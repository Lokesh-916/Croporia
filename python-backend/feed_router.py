from __future__ import annotations

import logging

import jwt as pyjwt
from fastapi import APIRouter, Header, HTTPException, Query

from config import settings
from feed_service import feed_service, get_cached

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/feed", tags=["feed"])


def _decode_jwt(authorization: str) -> str:
    """Decode JWT and return farmer_id (sub). Raises 401 on failure."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    secret = settings.jwt_secret
    if not secret:
        raise HTTPException(status_code=500, detail="JWT_SECRET not configured on server")
    try:
        payload = pyjwt.decode(token, secret, algorithms=["HS256"])
        farmer_id = payload.get("id") or payload.get("sub") or payload.get("userId")
        if not farmer_id:
            raise HTTPException(status_code=401, detail="Token missing user id")
        return str(farmer_id)
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")


@router.get("")
async def get_feed(
    crops: str = Query(..., description="Comma-separated crop names"),
    location: str = Query(default="India", description="Field location string"),
    authorization: str = Header(default=""),
) -> dict:
    farmer_id = _decode_jwt(authorization)

    crop_list = [c.strip() for c in crops.split(",") if c.strip()]
    if not crop_list:
        raise HTTPException(status_code=403, detail="no_crops")

    # Cache hit
    cached = get_cached(farmer_id)
    if cached:
        cached["meta"]["cached"] = True
        return cached

    # Cache miss — build fresh
    feed = await feed_service.build_feed(farmer_id, crop_list, location)
    return feed


@router.delete("/cache")
async def clear_feed_cache(authorization: str = Header(default="")) -> dict:
    """Clear today's cached feed for this farmer — forces a fresh fetch."""
    farmer_id = _decode_jwt(authorization)
    from feed_service import _feed_cache
    keys_to_delete = [k for k in _feed_cache if k[0] == farmer_id]
    for k in keys_to_delete:
        del _feed_cache[k]
    return {"cleared": True, "farmer_id": farmer_id}
