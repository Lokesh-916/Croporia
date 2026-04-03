# Croporia — Smart Farming Platform

One stop solution for the next generation of Indian farmers.

## What is Croporia?

Croporia is a full-stack farming companion that combines crop knowledge, AI assistance, market intelligence, and expert guidance into a single unified platform.

---

## Features

| Feature | Description |
|---|---|
| Crop Wiki | 43+ Indian crop profiles with soil, season, cost, and process data |
| Farming Practices | Traditional, tech-driven, and organic practice guides |
| My Farm | Register and track your fields, soil data, and crop plans |
| Crop Yield Predictor | AI-powered yield and revenue forecasting |
| Climate Simulator | Simulate weather scenarios and see crop impact |
| Pest & Disease Scanner | Upload a leaf photo — Plant.id API diagnoses it instantly |
| Smart Learning | 5 deep-dive courses with lessons, insights, and quizzes |
| Talk to Experts | Connect with certified agronomists, send messages |
| Community | Post updates, reply, bookmark, ask experts |
| Crop Market | Buy and sell crops directly with farmers nearby |
| Crop Monetizer | Hold-or-sell forecast — should you sell now or wait 14 days? |
| AI Farm Assistant | RAG-powered chatbot over your farming knowledge base |

---

## Tech Stack

**Frontend** — React 19, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion

**Node Backend** — Express, MongoDB (Mongoose), JWT auth, bcrypt

**Python Backend** — FastAPI, LangChain v1, Groq (llama-3.3-70b), HuggingFace embeddings, FAISS, Plant.id API

---

## Project Structure

```
Croporia/
├── src/                    # React frontend
│   ├── pages/              # All page components
│   ├── components/         # Navbar, FloatingChatbot, ProtectedRoute
│   └── context/            # ProgressContext for learning
├── backend/                # Node.js / Express API
│   ├── models/             # User, Field, Post, CropListing
│   └── routes/             # auth, fields, community, experts, market
├── python-backend/         # FastAPI service
│   ├── main.py             # All endpoints (RAG, plant-health, monetizer)
│   ├── rag.py              # LangChain RAG pipeline (Groq + FAISS)
│   ├── plant_id.py         # Plant.id health assessment
│   └── config.py           # Settings (reads from root .env)
└── public/                 # Static assets, simulator, predictor
```

---

## Getting Started

### 1. Environment Variables

Create a `.env` file at the project root:

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PLANT_ID_API_KEY=your_plant_id_api_key
```

### 2. Install Dependencies

```bash
# Frontend
npm install

# Node backend
cd backend && npm install

# Python backend
cd python-backend && .venv\Scripts\pip install -r requirements.txt
```

### 3. Run All Services

Open 3 terminals:

```bash
# Terminal 1 — Node backend (port 5000)
cd backend && node server.js

# Terminal 2 — Python backend (port 8000)
cd python-backend && .venv\Scripts\uvicorn main:app --reload --port 8000

# Terminal 3 — Frontend (port 5173)
npm run dev
```

Then open `http://localhost:5173`

### 4. Seed Expert Accounts (optional)

```bash
cd backend && node seedExperts.js
```

Creates 4 expert accounts. Login with password: `Expert@123`

---

## User Roles

**Farmer** — Full access to all features including My Farm, Market, Simulator, Predictor

**Expert** — Different navbar with Dashboard, messages inbox, peer expert panel. No My Farm access.

---

## API Endpoints

### Node Backend (port 5000)
- `POST /api/auth/register` — Register (Farmer or Expert)
- `POST /api/auth/login` — Login
- `GET/POST /api/fields` — Field management (auth required)
- `GET/POST /api/community/posts` — Community feed
- `GET/POST/DELETE /api/market/listings` — Crop marketplace
- `GET /api/experts` — List expert profiles

### Python Backend (port 8000)
- `POST /chat` — RAG farming assistant
- `POST /plant-health` — Pest/disease detection
- `POST /ingest` — Re-index Farming_Data_RAG.md
- `POST /monetizer/predict` — Hold-or-sell price forecast
- `GET /monetizer/crops` — List supported crops
