import os
from fastapi import FastAPI
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

# Run the FastAPI app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
