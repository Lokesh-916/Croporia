# Croporia

**One stop solution for new-age farmers.**

Croporia is a farmer-assistance platform that brings together expert guidance, AI-powered crop knowledge, and plant health diagnostics—so farmers can make better decisions from the field.

---

## Features

### Talk to Experts
Chat with agriculture domain experts for personalised guidance. Browse specialists in soil & nutrients, orchards, climate-smart farming, and plant protection. Each expert profile includes experience, crops, regions, and impact—so you pick the right person for your question. *UI ready; chat backend can be wired to the RAG or live agents.*

### AI Crop Advisor (RAG)
Ask questions in plain language and get answers grounded in a curated farming knowledge base. The system uses **LangChain** and **FAISS** over structured crop data (varieties, seasons, manuring, pests, diseases, fertigation, yield) so answers are brief, practical, and safe—no guessing on crops or doses outside the data.

### Plant Health Check
Upload a photo of a diseased leaf or plant and get **AI-powered pest/disease detection** with treatment options. Powered by the **Plant.id** Health Assessment API: see likely conditions, confidence scores, and actionable advice (biological, chemical, and prevention).

### Farming Knowledge Base
A structured, RAG-ready knowledge base (`Farming_Data_RAG.md`) covering vegetables, fruits, cereals, and more—varieties, soil, season, seed rate, nursery, irrigation, fertiliser schedules, fertigation, pests, diseases, harvest, and yield. Grows with your data; a cleanup script keeps the source organised for retrieval.

---

## Tech Stack

| Layer        | Stack |
|-------------|--------|
| **Frontend** | React 19, Vite, Tailwind CSS, Inter & Pacifico fonts |
| **Backend**  | Node.js / Express (MERN), MongoDB |
| **RAG**      | LangChain, OpenAI embeddings & chat, FAISS |
| **Plant ID** | Plant.id API v2 (health assessment) |

---

## Project Structure

```
Croporia/
├── backend/             # Node.js/Express – MongoDB Models, Auth, Community, Fields
├── src/                 # React frontend – Community, Crops, Field Wizard
├── public/              # Static assets
├── data/                # Crop database (crops.json)
├── scripts/             # e.g. clean_farming_data.py → Farming_Data_RAG.md
├── Farming_Data_RAG.md  # Curated knowledge base for RAG
├── .env                 # MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, etc.
└── README.md
```

---

## Getting Started

### 1. Backend (MERN Stack)

```bash
cd backend
npm install
npm start # or npm run dev
```

Set in `.env` (backend folder):

- `MONGODB_URI` – required for database.
- `JWT_SECRET` – required for authentication.
- `OPENAI_API_KEY` – required for RAG features.

### 2. Frontend (Vite)

```bash
# In the root folder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Overview

| Endpoint        | Method | Description |
|----------------|--------|-------------|
| `/api/auth`     | POST   | Signup & Login |
| `/api/fields`   | GET/POST| My Farm Field Management |
| `/api/community`| GET/POST| Community Posts & Likes |
| `/plant-health` | POST   | Upload image; (Python-FastAPI) |

---

*Croporia – from soil to harvest, one platform.*
