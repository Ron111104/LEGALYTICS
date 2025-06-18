# LEGALYTICS

Comprehensive AI-Powered Legal Analytics Platform

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Directory Structure](#directory-structure)
6. [Installation and Setup](#installation-and-setup)

   * [Prerequisites](#prerequisites)
   * [Frontend Setup](#frontend-setup)
   * [Backend Setup](#backend-setup)
7. [Configuration](#configuration)
8. [Usage](#usage)

   * [Running the Development Environment](#running-the-development-environment)
   * [Building for Production](#building-for-production)
9. [API Reference](#api-reference)

   * [Authentication Endpoints](#authentication-endpoints)
   * [Case Retrieval Endpoints](#case-retrieval-endpoints)
   * [Summarization Endpoints](#summarization-endpoints)
   * [Bail Prediction Endpoints](#bail-prediction-endpoints)
   * [Chatbot Endpoints](#chatbot-endpoints)
10. [Deployment](#deployment)

    * [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
    * [Backend Deployment (Docker)](#backend-deployment-docker)
    * [Monitoring and Health Checks](#monitoring-and-health-checks)
11. [Contributing](#contributing)
12. [License](#license)
13. [Contact](#contact)

---

## Project Overview

Legalytics is a comprehensive AI-driven legal analytics platform designed to streamline legal research, case analysis, and consumer legal assistance. The platform offers four core services:

* Case Retrieval: Vector-based similarity search for relevant legal precedents.
* Case Summarization: Extractive and abstractive summarization of legal documents.
* Bail Prediction: Machine learning-based bail outcome assessment.
* AI Chatbot: Interactive legal assistant powered by GPT-4.

Legalytics processes multilingual legal texts, leverages custom NLP models, and integrates secure authentication. It is built for scalability, reliability, and ease of use in professional legal environments.

## Key Features

* **Instant Case Summarization**: Generate concise summaries for PDF or text documents.
* **Legal Named Entity Recognition (L-NER)**: Identify legal entities (judges, appellants, statutes).
* **Case Similarity Detection**: Retrieve and rank relevant cases using FAISS.
* **Bail Prediction Analysis**: Risk scoring and bail recommendations.
* **AI Chatbot Assistant**: Real-time legal support via an embedded chat interface.
* **Multilingual Support**: Translate and process vernacular legal documents.

## Architecture Overview

The platform follows a microservices-inspired design with separation of concerns:

**Frontend (Next.js)**

* Server-side rendering and static site generation
* Firebase authentication and JWT management
* React Context API for state

**Backend (FastAPI & Node.js)**

* Python FastAPI for ML model endpoints
* Next.js API routes as middleware
* FAISS for vector search
* PDF parsing, text extraction
* OpenAI GPT-4 integration for chatbot

**Data Storage**

* MongoDB for document metadata and session data
* MySQL (optional) for analytical data
* AWS S3 for file storage

---

## Technology Stack

| Layer              | Technologies                            |
| ------------------ | --------------------------------------- |
| Frontend Framework | Next.js, React                          |
| Styling            | Tailwind CSS, PostCSS                   |
| Animations         | Framer Motion                           |
| Icons              | Lucide React                            |
| Component Libs     | Radix UI, CVA, Tailwind Merge           |
| Authentication     | Firebase Auth, React Firebase Hooks     |
| Backend Framework  | Python 3.8+, FastAPI, Node.js           |
| ML & NLP           | Transformers (Hugging Face), spaCy, OCR |
| Vector Search      | FAISS                                   |
| Database           | MongoDB, MySQL                          |
| Storage & Cloud    | AWS S3, AWS Lambda                      |
| External APIs      | OpenAI GPT-4, Firebase Admin            |

---

## Directory Structure

```
LEGALYTICS/
├─ legalytics_frontend/       # Next.js frontend application
│  ├─ .env                    # Frontend environment variables
│  ├─ components/             # Reusable React components
│  ├─ pages/                  # Next.js pages and API routes
│  ├─ public/                 # Static assets (images, logos)
│  ├─ styles/                 # CSS and Tailwind config
│  └─ ...
│
├─ legalytics_backend/        # Python backend services
│  ├─ .env                    # Backend environment variables
│  ├─ main.py                 # FastAPI application entry point
│  ├─ requirements.txt        # Python dependencies
│  ├─ models/                 # Trained ML models
│  ├─ bail/                   # Bail prediction logic
│  ├─ lner/                   # Named entity recognition modules
│  └─ ...
│
├─ .gitignore
├─ README.md                  # This file
└─ LICENSE                    # License file
```

---

## Installation and Setup

### Prerequisites

* Node.js `^18` and npm or yarn
* Python `^3.8` and pip
* Firebase account and project
* OpenAI API key
* AWS account (S3 bucket)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Ron111104/LEGALYTICS.git
   cd LEGALYTICS/legalytics_frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Create `.env` in `legalytics_frontend/`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

### Backend Setup

1. Navigate to backend folder:

   ```bash
   cd ../legalytics_backend
   ```
2. Create and activate Python virtual environment:

   ```bash
   python3 -m venv env
   source env/bin/activate
   ```
3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Create `.env` in `legalytics_backend/`:

   ```env
   FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
   OPENAI_API_KEY=your_openai_api_key
   AWS_S3_BUCKET=your_s3_bucket_name
   JWT_SECRET=your_jwt_secret
   ```
5. Download or place ML model files under `models/` as per project instructions.

---

## Configuration

* Update Firebase configuration in both frontend and backend `.env` files.
* Ensure AWS credentials are configured locally for S3 access or provide IAM role to the backend service.
* Confirm OpenAI API key and rate limits in environment.
* Adjust CORS origins in `main.py` if deploying under custom domains.

---

## Usage

### Running the Development Environment

1. Start the backend server:

   ```bash
   cd legalytics_backend
   source env/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. Start the frontend development server:

   ```bash
   cd ../legalytics_frontend
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

### Building for Production

* Frontend:

  ```bash
  npm run build
  ```
* Backend: Use Docker or host on AWS EC2/Lambda as per your infrastructure.

---

## API Reference

### Authentication Endpoints

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| POST   | `/api/auth/signup`       | Register user, send email verify |
| POST   | `/api/auth/login`        | Authenticate user, return JWT    |
| POST   | `/api/auth/forgot`       | Send password reset email        |
| POST   | `/api/auth/verify-email` | Verify user email token          |

### Case Retrieval Endpoints

| Method | Endpoint            | Description                            |
| ------ | ------------------- | -------------------------------------- |
| POST   | `/api/cases/upload` | Upload PDF/text for similarity search  |
| GET    | `/api/cases/search` | Retrieve similar cases by vector index |

### Summarization Endpoints

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| POST   | `/api/summarize/pdf`   | Extractive/abstractive summarization  |
| POST   | `/api/summarize/batch` | Batch summarization for multiple docs |

### Bail Prediction Endpoints

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| POST   | `/api/bail/predict` | Predict bail likelihood |

### Chatbot Endpoints

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| POST   | `/api/chatbot/message` | Send user query, receive AI reply |

---

## Deployment

### Frontend Deployment (Vercel)

1. Connect GitHub repository in Vercel dashboard.
2. Configure environment variables under project settings.
3. Deploy. Vercel will handle build and hosting.

### Backend Deployment (Docker)

1. Build Docker image:

   ```bash
   docker build -t legalytics-backend .
   ```
2. Run container:

   ```bash
   docker run -d \
     -e FIREBASE_SERVICE_ACCOUNT='...' \
     -e OPENAI_API_KEY='...' \
     -e AWS_S3_BUCKET='...' \
     -e JWT_SECRET='...' \
     -p 8000:8000 \
     legalytics-backend
   ```
3. Optionally configure AWS ECS or Kubernetes for auto-scaling.

### Monitoring and Health Checks

* Health endpoint available at `/api/health`.
* Use AWS CloudWatch or Prometheus/Grafana for metrics and alerts.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add feature description"`.
4. Push to your branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please adhere to the code style guidelines and include tests where applicable.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For support or questions, please open an issue on GitHub

