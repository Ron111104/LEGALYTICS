import os
import pdfplumber
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch allowed origins dynamically
origins = [
    os.getenv("ALLOWED_ORIGIN_1"),
    os.getenv("ALLOWED_ORIGIN_2"),
    os.getenv("ALLOWED_ORIGIN_3"),
]

# Remove None values
origins = [origin for origin in origins if origin]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Legalytics API!"}

@app.get("/api/message")
def get_message():
    return {"message": "Hello from FastAPI!"}

@app.post("/summarize")
async def summarize_case(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        # Extract text from the PDF
        with pdfplumber.open(file.file) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        # TODO: Implement an actual summarization model instead of returning raw text
        summary = text[:1000] + "..."  # Placeholder: First 1000 chars for now

        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# Run the FastAPI app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
