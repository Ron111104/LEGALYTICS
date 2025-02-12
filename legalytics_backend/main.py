import os
import pickle
import faiss
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import spacy
import requests  # Used for fetching remote full text files

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000",  # Next.js local dev server
    "https://your-deployed-frontend.com",  # Production frontend
    "*"
]

# Enable CORS (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

###############################################################################
#                           CASE SIMILARITY SEARCH                            #
###############################################################################

###############################################################################
#                           CASE SIMILARITY SEARCH                            #
###############################################################################

# Define directories for the search model and its data
SEARCH_MODEL_DIR = os.path.abspath("./models/lner/saved_model")
SEARCH_MODEL_DIR1 = os.path.abspath("./models/lner")

# Load the SentenceTransformer model (used for encoding input text)
search_model_path = os.path.join(SEARCH_MODEL_DIR1, "model.pkl")
with open(search_model_path, "rb") as file:
    search_model = pickle.load(file)

# Load the FAISS index
faiss_index_path = os.path.join(SEARCH_MODEL_DIR, "faiss_index.bin")
index = faiss.read_index(faiss_index_path)

# Load auxiliary data: case IDs, full case texts, and pre-computed embeddings
case_ids_path = os.path.join(SEARCH_MODEL_DIR, "case_ids.pkl")
with open(case_ids_path, "rb") as f:
    case_ids = pickle.load(f)

all_texts_path = os.path.join(SEARCH_MODEL_DIR, "all_texts.pkl")
with open(all_texts_path, "rb") as f:
    all_texts = pickle.load(f)

all_embeddings_path = os.path.join(SEARCH_MODEL_DIR, "all_embeddings.npy")
all_embeddings = np.load(all_embeddings_path)

def search_similar_cases(query_embedding, top_k=3):
    """Search FAISS for the most similar past cases."""
    if index.ntotal == 0:
        return []

    # FAISS expects a 2D array of type float32
    query_embedding = np.array([query_embedding], dtype=np.float32)
    distances, indices = index.search(query_embedding, top_k)

    # Compute cosine similarity scores (scaled as percentage)
    similarity_scores = cosine_similarity(query_embedding, all_embeddings)[0] * 100

    results = []
    for i in range(top_k):
        case_index = indices[0][i]
        if case_index >= len(case_ids):
            continue

        case_id = case_ids[case_index]
        similarity_score = round(similarity_scores[i], 2)

        results.append({
            "Case ID": case_id,
            "Similarity Score": f"{similarity_score}%",
            "Text Preview": f"{all_texts[case_index][:300]}...",  # Preview: first 300 characters
            "Full Text": all_texts[case_index]
        })

    # Sort results in descending order of similarity score
    return sorted(results, key=lambda x: float(x["Similarity Score"].strip('%')), reverse=True)

@app.post("/api/search")
async def search_case(
    file: UploadFile = File(None),
    text: str = Form(None)
):
    """
    Process input and return similar cases.
    Accepts a multipart/form-data request with an optional PDF file and/or a text field.
    If a PDF is provided, its text is extracted; otherwise, the provided text is used.
    """
    try:
        if file:
            # Extract text from the provided PDF file
            search_text = extract_text_from_pdf(file.file)
        elif text:
            search_text = text
        else:
            raise HTTPException(status_code=400, detail="Either a PDF file or text input must be provided.")

        # Generate embedding from the extracted or provided text
        query_embedding = search_model.encode(
            search_text, 
            convert_to_numpy=True, 
            normalize_embeddings=True
        )
        similar_cases = search_similar_cases(query_embedding)

        if not similar_cases:
            raise HTTPException(status_code=404, detail="No similar cases found")

        return {"retrieved_cases": similar_cases}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

###############################################################################
#                            PDF SUMMARIZATION API                            #
###############################################################################

# Load fine-tuned T5 model
MODEL_PATH = os.path.abspath("./models/legal_ner_model")
print("Contents of model folder:", os.listdir(MODEL_PATH))
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH, local_files_only=True).to(DEVICE)

def extract_text_from_pdf(pdf_file):
    """Extracts judgment text from a given PDF file."""
    reader = PyPDF2.PdfReader(pdf_file)
    text = []
    capture = False  # Flag to capture judgment text

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            lines = page_text.split("\n")
            for line in lines:
                if "JUDGMENT" in line.upper() or "O R D E R" in line.upper():
                    capture = True  # Start capturing from this point
                if capture:
                    text.append(line)

    return "\n".join(text) if text else "Judgment text not found"

def generate_summary(text):
    """Generates a summary using the fine-tuned T5 model."""
    inputs = tokenizer.encode(
        "summarize: " + text, return_tensors="pt", truncation=True, max_length=1024
    ).to(DEVICE)

    summary_ids = model.generate(
        inputs,
        max_length=250,
        min_length=100,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

@app.post("/api/summarize")
async def summarize_pdf(file: UploadFile = File(...)):
    """Accepts a PDF file, extracts text, summarizes it, and returns the summary."""
    try:
        # Extract text from uploaded PDF
        text = extract_text_from_pdf(file.file)

        if not text or text == "Judgment text not found":
            return {"error": "Could not extract judgment text from the PDF."}

        # Generate summary
        summary = generate_summary(text)

        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}

###############################################################################
#                           BAIL PREDICTION API                              #
###############################################################################

class BailInput(BaseModel):
    text: str

@app.post("/api/bail-prediction")
def predict_bail(bail_input: BailInput):
    """
    Predict bail decision using the trained model.
    Expects a JSON body with a 'text' field.
    The model returns a prediction of 'GRANTED' if bail is likely to be granted, otherwise 'DENIED'.
    """
    try:
        # Load the spaCy model for NER
        nlp = spacy.load("en_core_web_sm")
        # Set the bail model directory and load the model from there
        BAIL_MODEL_DIR = os.path.abspath("./models/bail")
        bail_model_path = os.path.join(BAIL_MODEL_DIR, "bail_prediction_model.pkl")
        loaded_pipeline = pickle.load(open(bail_model_path, "rb"))

        input_text = bail_input.text
        # Extract legal entities from the input text
        doc = nlp(input_text)
        extracted_entities = [ent.text for ent in doc.ents if ent.label_ in {"LAW", "ORG", "PERSON", "GPE", "DATE"}]
        # Combine original text with extracted entities
        processed_input = input_text + " " + " ".join(extracted_entities)
        # Predict bail decision
        prediction = loaded_pipeline.predict([processed_input])[0]
        decision = "GRANTED" if prediction == 1 else "DENIED"
        return {"bail_decision": decision}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
###############################################################################
#                               ROOT ENDPOINT                               #
###############################################################################

@app.get("/")
def read_root():
    return {"message": "Welcome to Legalytics API!"}

###############################################################################
#                             RUN THE APPLICATION                             #
###############################################################################

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
