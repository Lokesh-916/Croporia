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
| **Backend**  | FastAPI, Python 3.x |
| **RAG**      | LangChain, OpenAI embeddings & chat, FAISS |
| **Plant ID** | Plant.id API v2 (health assessment) |

---

## Project Structure

```
Croporia/
├── talk-to-experts/     # React frontend – Talk to Experts UI
├── backend/             # FastAPI – RAG, plant health, ingest
├── scripts/             # e.g. clean_farming_data.py → Farming_Data_RAG.md
├── Farming_Data_RAG.md  # Curated knowledge base for RAG
├── .env                 # OPENAI_API_KEY, PLANT_ID_API_KEY (optional)
└── README.md
```

---

## Quick Start

### 1. Backend (RAG + Plant Health)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Set in `.env` (project root or `backend/`):

- `OPENAI_API_KEY` – required for RAG.
- `PLANT_ID_API_KEY` – optional; required for `/plant-health`.

```bash
uvicorn backend.main:app --reload
```

- **Ingest** (after updating the knowledge base): `POST http://localhost:8000/ingest`
- **Chat**: `POST http://localhost:8000/chat` with `{"question": "..."}`
- **Plant health**: `POST http://localhost:8000/plant-health` with an image file.

### 2. Frontend (Talk to Experts)

```bash
cd talk-to-experts
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`).

### 3. Regenerating the RAG Knowledge Base

After editing `Farming_Data.md`:

```bash
python scripts/clean_farming_data.py
```

Then call `POST /ingest` to re-index.

---

## API Overview

| Endpoint        | Method | Description |
|----------------|--------|-------------|
| `/health`     | GET    | Service and config check |
| `/ingest`     | POST   | Rebuild FAISS index from `Farming_Data_RAG.md` |
| `/chat`       | POST   | RAG Q&A; body: `{"question": "..."}` |
| `/plant-health` | POST | Upload image; returns conditions + treatment suggestions |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | RAG embeddings and chat |
| `PLANT_ID_API_KEY` or `CROPORIA_PLANT_ID_API_KEY` | Plant health (pest/disease) |
| `CROPORIA_FARMING_MARKDOWN_PATH` | Override path to knowledge base (default: `Farming_Data_RAG.md`) |

---

*Croporia – from soil to harvest, one platform.*
