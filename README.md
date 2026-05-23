# SafePay 💸

> A full-stack digital wallet for secure P2P money transfers — with a custom-trained Random Forest fraud detection model that scores every transaction and blocks it if the fraud probability exceeds 70%.

SafePay lets users send and receive money instantly, just like EasyPaisa or JazzCash, but goes a step further: every transaction is scored by a machine learning model before it's processed. If the fraud score is **≥ 70%**, the transaction is blocked automatically. If it's below that threshold, it goes through.

---

## Table of Contents

- [SafePay 💸](#safepay-)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Tech Stack](#tech-stack)
  - [How It Works](#how-it-works)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Local Setup (without Docker)](#local-setup-without-docker)
    - [Local Setup (with Docker)](#local-setup-with-docker)
  - [Environment Variables](#environment-variables)
  - [API Reference](#api-reference)
    - [Auth](#auth)
    - [Wallet](#wallet)
      - [Example — Send Money](#example--send-money)
  - [ML Fraud Detection](#ml-fraud-detection)
    - [Model](#model)
    - [Request / Response](#request--response)
  - [Deployment](#deployment)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Project Structure](#project-structure)
  - [License](#license)

---

## Features

- **Send & Receive Money** — instant wallet-to-wallet transfers between registered users
- **Wallet Balance** — real-time balance tracking per user account
- **Fraud Detection** — every transaction is scored by a Random Forest model; anything ≥ 70% fraud probability is blocked before processing
- **Transaction History** — full log of all sent, received, and blocked transactions
- **Secure Auth** — JWT-based authentication with protected routes
- **Dockerized** — all three services (frontend, backend, ML API) run via Docker Compose
- **Live on AWS** — deployed and accessible via cloud infrastructure

---

## Demo

> _Coming soon / add your live URL here_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (via Prisma ORM) |
| Fraud Detection | Random Forest model (scikit-learn) served via FastAPI |
| Containerization | Docker, Docker Compose |
| Cloud | AWS |
| CI/CD | GitHub Actions (in progress) |

---

## How It Works

```
User initiates transfer
        │
        ▼
  Express API receives request
        │
        ▼
  Transaction payload sent to FastAPI (ML model)
        │
        ▼
  Random Forest returns fraud_score (0.0 – 1.0)
        │
   ┌────┴────────────┐
fraud_score ≥ 0.70   fraud_score < 0.70
        │                    │
    BLOCKED              PROCESSED
    HTTP 400        Balances updated in
  no DB write        PostgreSQL via Prisma
```

1. User submits a transfer (amount + recipient).
2. Backend sends transaction features to the FastAPI ML service.
3. The Random Forest model returns a `fraud_score` between 0 and 1.
4. If `fraud_score >= 0.70` → transaction is blocked, user is notified, nothing is written to the DB.
5. If `fraud_score < 0.70` → balances are updated and the transaction is persisted via Prisma.

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL running locally (or a remote instance)
- Python 3.9+
- Docker & Docker Compose

### Local Setup (without Docker)

```bash
# 1. Clone the repo
git clone https://github.com/Wcoder547/safepay.git
cd safepay

# 2. Backend
cd backend
npm install
cp .env.example .env        # fill in your values
npx prisma migrate dev      # run DB migrations
npm run dev

# 3. Frontend (new terminal)
cd ../frontend
npm install
npm start

# 4. ML API (new terminal)
cd ../ml-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Local Setup (with Docker)

```bash
git clone https://github.com/Wcoder547/safepay.git
cd safepay
cp backend/.env.example backend/.env   # fill in your values
docker compose up --build
```

All three services start together. App runs at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/safepay
JWT_SECRET=your_jwt_secret_key
ML_API_URL=http://localhost:8000/predict
```

> **Never commit your `.env` file.** It's already in `.gitignore`.

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Wallet

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wallet/balance` | Get current user balance |
| POST | `/api/wallet/send` | Send money to another user |
| GET | `/api/wallet/transactions` | Get transaction history |

#### Example — Send Money

**Request**
```json
POST /api/wallet/send
Authorization: Bearer <token>

{
  "recipientEmail": "user@example.com",
  "amount": 500
}
```

**Response (success)**
```json
{
  "status": "success",
  "message": "Transaction completed",
  "transactionId": "txn_abc123",
  "newBalance": 4500
}
```

**Response (fraud blocked)**
```json
{
  "status": "blocked",
  "message": "Transaction flagged as fraudulent and has been blocked",
  "fraudScore": 0.87
}
```

---

## ML Fraud Detection

The fraud detection service lives in `ml-api/` and is built on a **custom-trained Random Forest classifier**.

### Model

- **Algorithm:** Random Forest (scikit-learn)
- **Dataset:** Custom dataset collected and labelled for this project
- **Serving:** FastAPI — exposes a `/predict` endpoint
- **Threshold:** transactions with a `fraud_score >= 0.70` are blocked

### Request / Response

```json
POST http://localhost:8000/predict

{
  "amount": 50000,
  "sender_account_age_days": 12,
  "recipient_account_age_days": 3,
  "transactions_last_24h": 8,
  ...
}
```

```json
{
  "fraud_score": 0.87,
  "is_fraud": true
}
```

The Express backend reads `is_fraud` and either proceeds with the transaction or returns a 400 to the client.

---

## Deployment

SafePay is deployed on **AWS** with all services containerized via Docker.

```bash
# Build and push images (run per service)
docker build -t safepay-backend ./backend
docker tag safepay-backend <your-ecr>/safepay-backend:latest
docker push <your-ecr>/safepay-backend:latest
```

> Update the registry URL to match your AWS ECR or Docker Hub setup.

---

## CI/CD Pipeline

A GitHub Actions pipeline is being set up to automate:

1. Run tests on every push to `main`
2. Build Docker images for all three services
3. Push images to the container registry
4. Deploy to AWS automatically

Pipeline config will live in `.github/workflows/deploy.yml`.

---

## Project Structure

```
safepay/
├── backend/              # Node.js + Express API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/             # React.js client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── ml-api/               # FastAPI + Random Forest model
│   ├── model/
│   │   └── fraud_model.pkl
│   ├── main.py
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## License

MIT © [Waseem Akram](https://www.linkedin.com/in/wasim-akram-dev/)