from pathlib import Path
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  project_root: Path = Field(
    default_factory=lambda: Path(__file__).resolve().parents[1]
  )
  farming_markdown_path: Path = Field(
    default_factory=lambda: Path(__file__).resolve().parents[1] / "Farming_Data_RAG.md"
  )
  vectorstore_dir: Path = Field(
    default_factory=lambda: Path(__file__).resolve().parent / "vectorstore"
  )

  # Groq LLM
  groq_api_key: str | None = Field(
    default=None,
    validation_alias=AliasChoices("GROQ_API_KEY", "CROPORIA_GROQ_API_KEY"),
  )

  # Plant.id
  plant_id_api_key: str | None = Field(
    default=None,
    validation_alias=AliasChoices("PLANT_ID_API_KEY", "CROPORIA_PLANT_ID_API_KEY"),
  )

  # Curated Feed
  gnews_api_key: str | None = Field(default=None, validation_alias="GNEWS_API_KEY")
  data_gov_in_api_key: str | None = Field(default=None, validation_alias="DATA_GOV_IN_API_KEY")
  jwt_secret: str | None = Field(default=None, validation_alias="JWT_SECRET")

  class Config:
    env_file = str(Path(__file__).resolve().parents[1] / ".env")
    env_file_encoding = "utf-8"
    extra = "ignore"


settings = Settings()
