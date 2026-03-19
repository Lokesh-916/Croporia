from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  """
  Centralised configuration for the Python RAG backend.

  Values can be overridden via environment variables if needed.
  """

  # Path to your farming knowledge base (markdown).
  # Default assumes Farming_Data_RAG.md lives at the project root, next to the frontend.
  project_root: Path = Field(
    default_factory=lambda: Path(__file__).resolve().parents[1]
  )

  # Default: Farming_Data_RAG.md (cleaned). Override with CROPORIA_FARMING_MARKDOWN_PATH for raw file.
  farming_markdown_path: Path = Field(
    default_factory=lambda: Path(__file__).resolve().parents[1]
    / "Farming_Data_RAG.md"
  )

  # Directory where we persist the FAISS index, so you don't have to rebuild
  # embeddings every time.
  vectorstore_dir: Path = Field(
    default_factory=lambda: Path(__file__).resolve().parent / "vectorstore"
  )

  # OpenAI / compatible chat + embedding models
  # Uses environment variables OPENAI_API_KEY or OPENAI_BASE_URL if set.
  chat_model: str = Field(default="gpt-4.1-mini")
  embedding_model: str = Field(default="text-embedding-3-small")

  # RAG settings
  chunk_size: int = 900
  chunk_overlap: int = 150
  top_k: int = 5

  # Plant.id API (pest / disease detection)
  plant_id_api_key: str | None = Field(
    default=None,
    description="API key for Plant.id health assessment",
    validation_alias=AliasChoices("PLANT_ID_API_KEY", "CROPORIA_PLANT_ID_API_KEY"),
  )

  class Config:
    env_prefix = "CROPORIA_"
    env_file = ".env"
    env_file_encoding = "utf-8"


settings = Settings()

