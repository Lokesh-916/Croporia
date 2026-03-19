from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from python_backend.config import settings
from python_backend.plant_id import assess_health
from python_backend.rag import rag_pipeline


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
  description: str | None = Field(default=None, description="Short explanation of the condition")
  common_names: list[str] = Field(default_factory=list, description="Common names (e.g. pests, overwatering)")
  classification: list[str] = Field(default_factory=list, description="Category hierarchy (e.g. Fungi, Animalia)")
  cause: str | None = Field(default=None, description="Scientific cause if available")
  treatment: DiseaseTreatment = Field(default_factory=DiseaseTreatment, description="What to do: biological, chemical, prevention")
  learn_more_url: str | None = Field(default=None, description="Link to more info (e.g. Wikipedia)")
  entity_id: str | None = None


class PlantHealthResponse(BaseModel):
  conditions: list[ConditionSuggestion] = Field(
    default_factory=list,
    description="Detected pest/disease names and conditions (most likely first), with description and treatment",
  )


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
  )


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

