# 🧠 MemBrain — Strategic Collective Forgetting Agent

> **Qwen Cloud AI Hackathon 2026 — Track 1: MemoryAgent**
>
> *The world's first production-grade agent that knows not just what to remember — but what to forget.*

***

## 📌 What is MemBrain?

**MemBrain** is a production-ready conversational agent built to solve the ultimate limitation of Long-Term Memory (LTM) in AI: **Context Bloat**. 

Standard memory agents continuously append data until they hit token limits, becoming slow, expensive, and easily confused by contradictory information. **MemBrain** introduces a revolutionary concept called **Strategic Forgetting**, continuously scoring memories and automatically archiving or deleting irrelevant nodes to maintain a pristine, highly-relevant context window.

## ✨ Key Features

- **🧠 Strategic Forgetting Engine:** Continuously evaluates memories using the **Temporal Importance Decay (TID)** mathematical formula.
- **🗑️ HITL Forgetting Checkpoints:** "Human-in-the-Loop" dashboard allows users to review, approve, or reject memory deletions.
- **🪦 Memory Obituaries:** Before permanent deletion, Qwen-Max summarizes memories into a 1-sentence "obituary" stored in cold storage (Alibaba OSS).
- **⚡ Real-time Token Budgeting:** Live visualization of token usage, ensuring the agent operates within limits without hallucination.
- **📊 D3.js Memory Tree Visualization:** (Coming Soon) Interactive dashboard showing the relationship, status, and health of all stored memories.

## 🛠️ Technology Stack

MemBrain is built as a Monorepo containing both the UI and the API.

- **Backend:** Node.js 22, Express 5, Prisma 6, Socket.IO, BullMQ
- **Frontend:** React 18, Vite 6, Tailwind CSS v4, Zustand
- **Database:** PostgreSQL 16 (with `pgvector`)
- **Cache / Message Broker:** Redis 7.2
- **AI Models:** Qwen-Max (Reasoning), Text-Embedding-v3 (Embeddings)
- **Cloud Infrastructure:** Alibaba Cloud (ECS, RDS, OSS, ACR)

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22
- Docker & Docker Compose (for Postgres and Redis)
- A Qwen Cloud (DashScope) API Key

### 1. Installation

Clone the repository and install dependencies from the root:
```bash
git clone https://github.com/yourusername/membrain.git
cd membrain
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```
*Crucially, you must add your `QWEN_API_KEY` to the `.env` file.*

### 3. Start Database & Cache

Use Docker Compose to spin up PostgreSQL (with pgvector) and Redis:
```bash
docker-compose up -d
```

### 4. Setup Prisma (Database Schema)

Generate the Prisma Client and push the schema to the database:
```bash
npm run dev -w packages/backend
# (Wait for backend to start, then stop it)
cd packages/backend
npx prisma generate
npx prisma db push
```

### 5. Run the Application

You can start both the frontend and backend simultaneously using the root package scripts:

**Terminal 1 (Backend):**
```bash
npm run dev:backend
```
*Runs on `http://localhost:3001`*

**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```
*Runs on `http://localhost:5173`*

## 📁 Monorepo Structure

```text
membrain/
├── .github/workflows/       # CI/CD pipelines for Alibaba Cloud
├── docs/                    # API Specs and Hackathon proofs
├── packages/
│   ├── backend/             # Express API, Prisma, BullMQ Workers
│   └── frontend/            # React UI, Tailwind, Zustand Stores
├── docker-compose.yml       # Local infrastructure setup
├── package.json             # NPM Workspaces config
└── README.md                # You are here
```

## 🧮 The TID Formula

MemBrain determines what to forget using the **Temporal Importance Decay (TID)** score:
`I(M, t) = α·R(M) + β·e^(-λ(t - t_last)) + γ·G(M) - δ·N(M)`

- **R(M):** Recency Score (Bumps back to 1.0 upon access)
- **t_last:** Time since last access (Exponential decay)
- **G(M):** Goal-relevance Score
- **N(M):** Noise/Contradiction Penalty

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
