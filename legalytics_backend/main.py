import PyPDF2
from fastapi.middleware.cors import CORSMiddleware
import os
import torch
from fastapi import FastAPI, UploadFile, File
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
def read_root():
    return {"message": "Welcome to Legalytics API!"}

# Run FastAPI with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
