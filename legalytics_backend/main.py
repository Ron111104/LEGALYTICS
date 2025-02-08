import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Collect all ALLOWED_ORIGIN_X variables dynamically
origins = [
    os.getenv("ALLOWED_ORIGIN_1"),
    os.getenv("ALLOWED_ORIGIN_2"),
    os.getenv("ALLOWED_ORIGIN_3"),
]

# Remove None values (in case some variables are not set)
origins = [origin for origin in origins if origin]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/message")
def get_message():
    return {"message": "Hello from FastAPI!"}
