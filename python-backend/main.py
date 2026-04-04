from __future__ import annotations

import logging
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from plant_id import assess_health
from rag import rag_pipeline
from feed_router import router as feed_router

logging.basicConfig(level=logging.INFO)


class IngestResponse(BaseModel):
  status: str
  documents_indexed: int
  source_path: str


class QuestionRequest(BaseModel):
  question: str = Field(
    ...,
    description="User question about farming / crops / seasons.",
    min_length=3,
  )


class AnswerSource(BaseModel):
  source: str
  start_index: int | None = None


class QuestionResponse(BaseModel):
  answer: str
  sources: list[AnswerSource]


class DiseaseTreatment(BaseModel):
  biological: list[str] = Field(default_factory=list, description="Organic / ecological treatment options")
  chemical: list[str] = Field(default_factory=list, description="Chemical treatment options if needed")
  prevention: list[str] = Field(default_factory=list, description="How to prevent the condition")


class ConditionSuggestion(BaseModel):
  name: str = Field(description="Disease/condition name (e.g. Fungi, water-related issue)")
  local_name: str | None = None
  probability: float = Field(description="Confidence 0–1 that this condition is present")
  redundant: bool = False
  description: str | None = Field(default=None, description="Short explanation of the condition")
  common_names: list[str] = Field(default_factory=list, description="Common names (e.g. pests, overwatering)")
  classification: list[str] = Field(default_factory=list, description="Category hierarchy (e.g. Fungi, Animalia)")
  cause: str | None = Field(default=None, description="Scientific cause if available")
  treatment: DiseaseTreatment = Field(default_factory=DiseaseTreatment, description="What to do: biological, chemical, prevention")
  learn_more_url: str | None = Field(default=None, description="Link to more info (e.g. Wikipedia)")
  entity_id: str | None = None
  similar_images: list[dict] = Field(default_factory=list)


class PlantHealthResponse(BaseModel):
  conditions: list[ConditionSuggestion] = Field(default_factory=list)
  is_healthy: bool | None = None
  is_healthy_probability: float | None = None


app = FastAPI(
  title="Croporia Farming RAG API",
  description=(
    "Backend service for the 'Talk to Experts' feature. "
    "Uses LangChain RAG over Farming_Data.md to answer farm-related questions."
  ),
  version="0.1.0",
)


app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(feed_router)


@app.get("/health", tags=["system"])
def health_check() -> dict:
  return {
    "status": "ok",
    "farming_markdown_path": str(settings.farming_markdown_path),
  }


@app.post("/ingest", response_model=IngestResponse, tags=["rag"])
def ingest_farming_data() -> IngestResponse:
  """
  (Re)index the Farming_Data.md file into the FAISS vector store.

  Call this **after** you finish editing and saving Farming_Data.md.
  """
  try:
    result = rag_pipeline.ingest()
  except FileNotFoundError as exc:
    raise HTTPException(status_code=400, detail=str(exc))

  return IngestResponse(**result)


@app.post("/chat", response_model=QuestionResponse, tags=["rag"])
def ask_expert(payload: QuestionRequest) -> QuestionResponse:
  """
  Ask a question about farming. The answer is generated via RAG over Farming_Data.md.
  """
  if not payload.question.strip():
    raise HTTPException(status_code=400, detail="Question cannot be empty.")

  try:
    result = rag_pipeline.ask(payload.question.strip())
  except FileNotFoundError as exc:
    raise HTTPException(
      status_code=400,
      detail=(
        f"{exc}. Make sure you have created and saved Farming_Data.md, "
        "then call POST /ingest once."
      ),
    )
  except Exception as exc:  # pragma: no cover - defensive
    raise HTTPException(status_code=500, detail=f"RAG pipeline error: {exc}")

  return QuestionResponse(
    answer=result["answer"],
    sources=[AnswerSource(**src) for src in result.get("sources", [])],
  )


@app.post("/plant-health", response_model=PlantHealthResponse, tags=["plant-health"])
def plant_health_assessment(image: UploadFile = File(..., description="Plant or leaf image (JPEG/PNG)")) -> PlantHealthResponse:
  """
  Run pest/disease detection on a plant image using Plant.id health assessment API.

  Returns detected pest/disease names (and conditions) with descriptions and
  treatments (biological, chemical, prevention). Use conditions[].name or
  conditions[].common_names for the pest/disease name.
  """
  if not image.content_type or not image.content_type.startswith("image/"):
    raise HTTPException(
      status_code=400,
      detail="File must be an image (e.g. image/jpeg, image/png).",
    )

  try:
    image_bytes = image.file.read()
  except Exception as exc:
    raise HTTPException(status_code=400, detail=f"Could not read image: {exc}") from exc

  if not image_bytes:
    raise HTTPException(status_code=400, detail="Image file is empty.")

  try:
    result = assess_health(image_bytes)
  except ValueError as exc:
    if "API key" in str(exc):
      raise HTTPException(status_code=503, detail=str(exc)) from exc
    raise HTTPException(status_code=502, detail=str(exc)) from exc
  except Exception as exc:
    raise HTTPException(status_code=502, detail=f"Plant health service error: {exc}") from exc

  return PlantHealthResponse(
    conditions=[ConditionSuggestion(**c) for c in result["conditions"]],
    is_healthy=result.get("is_healthy"),
    is_healthy_probability=result.get("is_healthy_probability"),
  )



# ── Crop Monetizer ────────────────────────────────────────────────────────────

CROP_PRICES_KG = {
  "tomato": 35.0, "brinjal": 30.0, "okra": 40.0, "chilli": 60.0, "onion": 30.0,
  "potato": 25.0, "cauliflower": 45.0, "cabbage": 30.0, "spinach": 20.0,
  "bitter gourd": 50.0, "bottle gourd": 25.0, "carrot": 40.0,
  "mango": 80.0, "banana": 40.0, "papaya": 30.0, "guava": 50.0, "watermelon": 20.0,
  "pomegranate": 120.0, "coconut": 40.0, "lemon": 60.0, "sapota": 40.0, "jackfruit": 30.0,
  "rice": 50.0, "wheat": 30.0, "maize": 25.0, "groundnut": 80.0, "sunflower": 90.0,
  "soybean": 55.0, "cotton": 100.0, "sugarcane": 5.0, "turmeric": 150.0,
  "red gram": 120.0, "blackgram": 110.0,
}

class PriceRequest(BaseModel):
  crop_name: str
  quantity_kgs: float
  storage_cost_per_day: float

@app.post("/monetizer/predict", tags=["monetizer"])
def predict_crop_price(payload: PriceRequest) -> dict:
  """Hold-or-sell recommendation based on 14-day price projection."""
  crop = payload.crop_name.lower().strip()
  if crop not in CROP_PRICES_KG:
    raise HTTPException(status_code=400, detail=f"Crop '{payload.crop_name}' not in price database.")
  np.random.seed(42)
  dates = pd.date_range(end=pd.Timestamp.today(), periods=30)
  base = CROP_PRICES_KG[crop]
  trend = np.linspace(base * 0.9, base * 1.1, 30)
  prices = trend + np.random.normal(0, base * 0.05, 30)
  df = pd.DataFrame({"date": dates, "price": prices})
  sma = df["price"].rolling(window=7).mean().dropna().values
  slope = float((sma[-1] - sma[0]) / (len(sma) - 1)) if len(sma) >= 2 else 0.0
  current_price = float(df["price"].iloc[-1])
  projected_price = max(current_price + slope * 14, 0.0)
  current_revenue = current_price * payload.quantity_kgs
  storage_cost = payload.storage_cost_per_day * 14 * payload.quantity_kgs
  future_revenue = projected_price * payload.quantity_kgs - storage_cost
  return {
    "crop_name": payload.crop_name,
    "current_price": round(current_price, 2),
    "projected_price": round(projected_price, 2),
    "trend_slope": round(slope, 2),
    "current_revenue": round(current_revenue, 2),
    "total_storage_cost": round(storage_cost, 2),
    "future_revenue": round(future_revenue, 2),
    "recommendation": "HOLD FOR 14 DAYS" if future_revenue > current_revenue else "SELL NOW",
  }

@app.get("/monetizer/crops", tags=["monetizer"])
def list_supported_crops() -> dict:
  return {"crops": sorted(CROP_PRICES_KG.keys())}


if __name__ == "__main__":
  # This block is only for local development convenience.
  # Preferred: `uvicorn python_backend.main:app --reload`
  import uvicorn

  uvicorn.run(
    "python_backend.main:app",
    host="0.0.0.0",
    port=8000,
    reload=True,
  )

