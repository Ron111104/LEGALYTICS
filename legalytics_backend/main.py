from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins (or specify specific ones for security)
origins = [
    "http://localhost:3000",  # Frontend URL (Next.js)
    "http://127.0.0.1:3000",  # If using localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/api/message")
def get_message():
    return {"message": "Hello from FastAPI!"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Legalytics API!"}
