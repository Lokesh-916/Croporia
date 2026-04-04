"""
Plant.id API v2 health assessment client.

Calls https://api.plant.id/v2/health_assessment for pest/disease detection
and returns a simplified, action-oriented response for the frontend.
"""

from __future__ import annotations

import base64
import logging
from typing import Any

import httpx

from config import settings

logger = logging.getLogger(__name__)

HEALTH_ASSESSMENT_URL = "https://api.plant.id/v2/health_assessment"
REQUEST_TIMEOUT = 25.0

# Disease details we request so the user gets descriptions and treatments (solutions).
DISEASE_DETAILS = [
    "common_names",
    "url",
    "description",
    "classification",
    "cause",
    "treatment",
    "local_name",
]

# Top N suggestions to return (most likely conditions first).
MAX_SUGGESTIONS = 8


def _build_request_body(image_base64: str) -> dict[str, Any]:
    return {
        "images": [image_base64],
        "disease_details": DISEASE_DETAILS,
        "language": "en",
        "prune_diseases": False,  # Keep all categories including Animalia (aphids, insects)
        "modifiers": ["similar_images"],  # Removed crops_fast for better accuracy
    }


def _parse_treatment(details: dict[str, Any] | None) -> dict[str, list[str]]:
    """Extract biological, chemical, prevention lists from API details."""
    if not details or "treatment" not in details:
        return {"biological": [], "chemical": [], "prevention": []}
    t = details.get("treatment") or {}
    return {
        "biological": t.get("biological") or [],
        "chemical": t.get("chemical") or [],
        "prevention": t.get("prevention") or [],
    }


def _suggestion_to_item(s: dict[str, Any]) -> dict[str, Any]:
    """Map one API disease suggestion to our frontend-friendly shape."""
    # v2 API uses 'disease_details' key, not 'details'
    details = s.get("disease_details") or s.get("details") or {}
    similar_images = s.get("similar_images") or []
    return {
        "name": s.get("name") or details.get("local_name") or "Unknown",
        "local_name": details.get("local_name"),
        "probability": round(float(s.get("probability", 0)), 4),
        "redundant": s.get("redundant", False),
        "description": details.get("description"),
        "common_names": details.get("common_names") or [],
        "classification": details.get("classification") or [],
        "cause": details.get("cause"),
        "treatment": _parse_treatment(details),
        "learn_more_url": details.get("url"),
        "entity_id": str(s.get("entity_id")) if s.get("entity_id") else None,
        "similar_images": [
            {"url": img.get("url"), "url_small": img.get("url_small"), "similarity": img.get("similarity")}
            for img in similar_images[:3]
        ],
    }


def assess_health(image_bytes: bytes) -> dict[str, Any]:
    """
    Send image to Plant.id health assessment API and return a simplified result.

    Args:
        image_bytes: Raw image bytes (e.g. JPEG/PNG).

    Returns:
        Dict with:
          - conditions: list of top suggestions, each with name, description,
            probability, treatment (biological, chemical, prevention), learn_more_url, etc.

    Raises:
        ValueError: If API key is not configured or API returns an error.
    """
    if not settings.plant_id_api_key:
        raise ValueError(
            "Plant.id API key is not set. Set PLANT_ID_API_KEY or CROPORIA_PLANT_ID_API_KEY in your environment or .env file."
        )

    image_base64 = base64.standard_b64encode(image_bytes).decode("ascii")
    body = _build_request_body(image_base64)

    with httpx.Client(timeout=REQUEST_TIMEOUT) as client:
        response = client.post(
            HEALTH_ASSESSMENT_URL,
            json=body,
            headers={
                "Api-Key": settings.plant_id_api_key,
                "Content-Type": "application/json",
            },
        )

    if response.status_code != 200:
        try:
            err_body = response.json()
            msg = err_body.get("message") or err_body.get("error") or response.text
        except Exception:
            msg = response.text or f"HTTP {response.status_code}"
        raise ValueError(f"Plant.id API error: {msg}")

    data = response.json()
    logger.info("Plant.id raw response keys: %s", list(data.keys()))

    status = data.get("status")
    if status not in ("COMPLETED", None, ""):
        raise ValueError(f"Plant.id identification not completed: status={status}")

    # v2 API returns health_assessment at the top level, not inside "result"
    health = data.get("health_assessment") or {}
    diseases = health.get("diseases") or []
    is_healthy = health.get("is_healthy")
    is_healthy_prob = health.get("is_healthy_probability")

    logger.info("Diseases count: %d, is_healthy: %s", len(diseases), is_healthy)

    # Sort by probability, keep all with >2% confidence
    meaningful = [d for d in diseases if float(d.get("probability", 0)) > 0.02]
    if not meaningful:
        meaningful = diseases
    meaningful.sort(key=lambda d: float(d.get("probability", 0)), reverse=True)
    conditions = [_suggestion_to_item(s) for s in meaningful[:MAX_SUGGESTIONS]]

    return {
        "conditions": conditions,
        "is_healthy": is_healthy,
        "is_healthy_probability": round(float(is_healthy_prob), 4) if is_healthy_prob is not None else None,
    }

