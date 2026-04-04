from __future__ import annotations

import asyncio
import logging
from datetime import date, datetime, timedelta, timezone
from functools import lru_cache

import httpx
from ddgs import DDGS

from config import settings
from rag import rag_pipeline

logger = logging.getLogger(__name__)

# ── Daily cache ───────────────────────────────────────────────────────────────
_feed_cache: dict[tuple[str, str], dict] = {}


def _cache_key(farmer_id: str) -> tuple[str, str]:
    return (farmer_id, date.today().isoformat())


def get_cached(farmer_id: str) -> dict | None:
    return _feed_cache.get(_cache_key(farmer_id))


def set_cached(farmer_id: str, response: dict) -> None:
    stale = [k for k in _feed_cache if k[0] == farmer_id and k[1] != date.today().isoformat()]
    for k in stale:
        del _feed_cache[k]
    _feed_cache[_cache_key(farmer_id)] = response


# ── Helpers ───────────────────────────────────────────────────────────────────
def _current_season() -> str:
    m = date.today().month
    if m in (3, 4, 5): return "Spring"
    if m in (6, 7, 8): return "Summer / Kharif"
    if m in (9, 10, 11): return "Autumn / Rabi sowing"
    return "Winter / Rabi"


def _geocode_location(location: str) -> tuple[float, float]:
    GEO: dict[str, tuple[float, float]] = {
        "punjab": (31.1471, 75.3412), "haryana": (29.0588, 76.0856),
        "uttar pradesh": (26.8467, 80.9462), "up": (26.8467, 80.9462),
        "maharashtra": (19.7515, 75.7139), "gujarat": (22.2587, 71.1924),
        "rajasthan": (27.0238, 74.2179), "madhya pradesh": (22.9734, 78.6569),
        "mp": (22.9734, 78.6569), "karnataka": (15.3173, 75.7139),
        "andhra pradesh": (15.9129, 79.7400), "ap": (15.9129, 79.7400),
        "telangana": (18.1124, 79.0193), "tamil nadu": (11.1271, 78.6569),
        "tn": (11.1271, 78.6569), "kerala": (10.8505, 76.2711),
        "west bengal": (22.9868, 87.8550), "wb": (22.9868, 87.8550),
        "bihar": (25.0961, 85.3131), "odisha": (20.9517, 85.0985),
        "delhi": (28.6139, 77.2090), "new delhi": (28.6139, 77.2090),
        "mumbai": (19.0760, 72.8777), "pune": (18.5204, 73.8567),
        "bangalore": (12.9716, 77.5946), "bengaluru": (12.9716, 77.5946),
        "hyderabad": (17.3850, 78.4867), "chennai": (13.0827, 80.2707),
        "kolkata": (22.5726, 88.3639), "ahmedabad": (23.0225, 72.5714),
        "jaipur": (26.9124, 75.7873), "lucknow": (26.8467, 80.9462),
        "chandigarh": (30.7333, 76.7794), "nagpur": (21.1458, 79.0882),
        "gudur": (14.1500, 79.8500), "nellore": (14.4426, 79.9865),
        "vizag": (17.6868, 83.2185), "visakhapatnam": (17.6868, 83.2185),
        "vijayawada": (16.5062, 80.6480), "guntur": (16.3067, 80.4365),
        "kurnool": (15.8281, 78.0373), "tirupati": (13.6288, 79.4192),
    }
    loc_lower = location.lower().strip()
    for key, coords in GEO.items():
        if key in loc_lower:
            return coords
    return (20.5937, 78.9629)  # India centre fallback


def _ddg_text(query: str, max_results: int = 6) -> list[dict]:
    """Synchronous DuckDuckGo text search — English results only."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results, region="in-en"))
        items = []
        for r in results:
            body = r.get("body", "")
            # Skip non-English results (basic heuristic)
            if not body or not all(ord(c) < 128 or c in '₹%.,()- ' for c in body[:50]):
                continue
            items.append({
                "title": r.get("title", "")[:120],
                "summary": body[:300],
                "url": r.get("href", "https://duckduckgo.com"),
            })
        return items
    except Exception as e:
        logger.warning(f"DDG search failed for '{query}': {e}")
        return []


async def _ddg_async(query: str, max_results: int = 6) -> list[dict]:
    """Run DDG search in a thread pool so it doesn't block the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _ddg_text, query, max_results)


# ── FeedService ───────────────────────────────────────────────────────────────
class FeedService:

    async def fetch_weather(self, location: str, crops: list[str]) -> dict:
        try:
            lat, lon = _geocode_location(location)
            url = (
                f"https://api.open-meteo.com/v1/forecast"
                f"?latitude={lat}&longitude={lon}"
                f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code"
                f"&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code"
                f"&timezone=auto&forecast_days=5"
            )
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(url)
                r.raise_for_status()
                d = r.json()

            wmo_labels = {
                0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
                45: "Foggy", 48: "Icy Fog", 51: "Light Drizzle", 53: "Drizzle",
                55: "Heavy Drizzle", 61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
                71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 80: "Rain Showers",
                81: "Heavy Showers", 82: "Violent Showers", 95: "Thunderstorm",
                96: "Thunderstorm w/ Hail", 99: "Thunderstorm w/ Heavy Hail",
            }

            cur = d.get("current", {})
            current = {
                "temperature_c": cur.get("temperature_2m"),
                "humidity_pct": cur.get("relative_humidity_2m"),
                "precipitation_prob_pct": cur.get("precipitation_probability", 0),
                "wind_speed_kmh": cur.get("wind_speed_10m"),
                "condition": wmo_labels.get(cur.get("weather_code", 0), "Unknown"),
            }

            daily = d.get("daily", {})
            forecast = []
            for i in range(len(daily.get("time", []))):
                forecast.append({
                    "date": daily["time"][i],
                    "temperature_max_c": daily["temperature_2m_max"][i],
                    "temperature_min_c": daily["temperature_2m_min"][i],
                    "precipitation_prob_pct": daily["precipitation_probability_max"][i],
                    "condition": wmo_labels.get(daily["weather_code"][i], "Unknown"),
                })

            return {"location": location, "current": current, "forecast": forecast, "weather_unavailable": False}
        except Exception as e:
            logger.warning(f"Weather fetch failed: {e}")
            return {"location": location, "weather_unavailable": True}

    async def fetch_mandi_prices(self, crops: list[str]) -> list[dict]:
        results = []
        if not settings.data_gov_in_api_key:
            return [{"crop": c, "prices_unavailable": True} for c in crops]
        async with httpx.AsyncClient(timeout=15) as client:
            for crop in crops:
                try:
                    # Try multiple name variants — data.gov.in is case/spelling sensitive
                    variants = list({crop.title(), crop.upper(), crop.lower(), crop})
                    records = []
                    for variant in variants:
                        if records:
                            break
                        try:
                            params = {
                                "api-key": settings.data_gov_in_api_key,
                                "format": "json",
                                "limit": "15",
                                "filters[commodity]": variant,
                            }
                            r = await client.get(
                                "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
                                params=params
                            )
                            r.raise_for_status()
                            records = r.json().get("records", [])
                        except Exception:
                            pass
                    # If still no records, fetch without filter and search locally
                    if not records:
                        try:
                            r = await client.get(
                                "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
                                params={"api-key": settings.data_gov_in_api_key, "format": "json", "limit": "50"}
                            )
                            r.raise_for_status()
                            all_records = r.json().get("records", [])
                            crop_lower = crop.lower()
                            records = [rec for rec in all_records if crop_lower in rec.get("commodity", "").lower()]
                        except Exception:
                            pass
                    entries = sorted([
                        {
                            "mandi_name": rec.get("market", ""),
                            "commodity": rec.get("commodity", crop),
                            "price_per_quintal": rec.get("modal_price", rec.get("max_price", "N/A")),
                            "price_date": rec.get("arrival_date", ""),
                            "state": rec.get("state", ""),
                        }
                        for rec in records
                    ], key=lambda x: x["price_date"], reverse=True)
                    results.append({"crop": crop, "entries": entries[:8], "prices_unavailable": len(entries) == 0})
                except Exception as e:
                    logger.warning(f"Mandi price fetch failed for {crop}: {e}")
                    results.append({"crop": crop, "prices_unavailable": True})
        return results

    async def fetch_news(self, crops: list[str]) -> list[dict]:
        # Only skip obvious recipe content
        FOOD_SKIP = {"recipe", "how to cook", "cooking", "tablespoon", "teaspoon", "bake", "roast"}
        cutoff = datetime.now(timezone.utc) - timedelta(days=60)
        results = []
        for crop in crops:
            headlines = []
            if settings.gnews_api_key:
                async with httpx.AsyncClient(timeout=12) as client:
                    for query in [f"{crop} India", "India agriculture", "India farming crop"]:
                        if headlines:
                            break
                        try:
                            r = await client.get(
                                "https://gnews.io/api/v4/search",
                                params={"q": query, "token": settings.gnews_api_key,
                                        "max": "10", "lang": "en", "sortby": "publishedAt"}
                            )
                            if r.status_code in (429, 403):
                                break
                            r.raise_for_status()
                            for a in r.json().get("articles", []):
                                title_lower = a.get("title", "").lower()
                                if any(kw in title_lower for kw in FOOD_SKIP):
                                    continue
                                pub = a.get("publishedAt", "")
                                try:
                                    if datetime.fromisoformat(pub.replace("Z", "+00:00")) < cutoff:
                                        continue
                                except Exception:
                                    pass
                                headlines.append({
                                    "title": a.get("title", ""),
                                    "source": a.get("source", {}).get("name", ""),
                                    "published_at": pub,
                                    "url": a.get("url", ""),
                                    "image": a.get("image", ""),
                                    "description": a.get("description", ""),
                                })
                        except Exception as e:
                            logger.warning(f"GNews failed: {e}")

            # DDG fallback
            if not headlines:
                for query in [f"{crop} agriculture news", "India farming news 2025"]:
                    if headlines:
                        break
                    for it in await _ddg_async(query, max_results=6):
                        if not any(kw in it["title"].lower() for kw in FOOD_SKIP):
                            headlines.append({
                                "title": it["title"], "source": "Web",
                                "published_at": "", "url": it["url"],
                                "image": "", "description": it["summary"],
                            })

            results.append({"crop": crop, "headlines": headlines[:6], "news_unavailable": len(headlines) == 0})
        return results

    async def fetch_wiki_summary(self, crop: str) -> dict | None:
        """Wikipedia REST API with proper browser User-Agent to avoid 403."""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (compatible; CroporiaFeedBot/1.0; +https://croporia.app)"
            }
            async with httpx.AsyncClient(timeout=8, headers=headers) as client:
                r = await client.get(
                    f"https://en.wikipedia.org/api/rest_v1/page/summary/{crop.replace(' ', '_')}"
                )
                if r.status_code == 200:
                    d = r.json()
                    return {
                        "title": d.get("title", crop),
                        "summary": d.get("extract", "")[:400],
                        "url": d.get("content_urls", {}).get("desktop", {}).get("page", ""),
                    }
        except Exception:
            pass
        return None

    async def fetch_innovations(self, crops: list[str]) -> list[dict]:
        results = []
        for crop in crops:
            try:
                # Run DDG search + Wikipedia in parallel
                ddg_task = _ddg_async(f"{crop} farming innovation technology new uses byproduct 2024 2025", max_results=8)
                wiki_task = self.fetch_wiki_summary(crop)
                ddg_items, wiki = await asyncio.gather(ddg_task, wiki_task)

                seen_urls: set[str] = set()
                items = []
                if wiki and wiki["url"] not in seen_urls and wiki["summary"]:
                    items.append(wiki)
                    seen_urls.add(wiki["url"])
                for d in ddg_items:
                    if d["url"] not in seen_urls and len(items) < 10:
                        items.append(d)
                        seen_urls.add(d["url"])

                results.append({"crop": crop, "items": items[:10], "innovations_unavailable": len(items) == 0})
            except Exception as e:
                logger.warning(f"Innovations fetch failed for {crop}: {e}")
                results.append({"crop": crop, "innovations_unavailable": True})
        return results

    async def fetch_demand_insights(self, crops: list[str]) -> list[dict]:
        results = []
        for crop in crops:
            try:
                items = await _ddg_async(f"{crop} market price India 2025", max_results=6)
                if not items:
                    items = await _ddg_async(f"{crop} agriculture demand", max_results=6)
                clean = [it for it in items if it["summary"] and all(ord(c) < 1000 for c in it["summary"][:80])]
                entries = [{"region": "India / Global", "trend": "rising", "snippet": it["summary"], "url": it["url"]} for it in clean[:6]]
                results.append({"crop": crop, "entries": entries, "demand_unavailable": len(entries) == 0})
            except Exception as e:
                logger.warning(f"Demand fetch failed for {crop}: {e}")
                results.append({"crop": crop, "demand_unavailable": True})
        return results

    async def fetch_govt_schemes(self, crops: list[str]) -> list[dict]:
        # Hardcoded reliable Indian agri schemes — always available
        KNOWN_SCHEMES = [
            {"name": "PM Kisan Samman Nidhi", "description": "Direct income support of ₹6,000/year to small and marginal farmers in three equal instalments.", "eligibility": "Small & marginal farmers with cultivable land", "url": "https://pmkisan.gov.in"},
            {"name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)", "description": "Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests & diseases.", "eligibility": "All farmers growing notified crops", "url": "https://pmfby.gov.in"},
            {"name": "Kisan Credit Card (KCC)", "description": "Provides farmers with affordable credit for agricultural needs including seeds, fertilisers, and equipment.", "eligibility": "All farmers, sharecroppers, and tenant farmers", "url": "https://www.nabard.org/content.aspx?id=572"},
            {"name": "PM Krishi Sinchai Yojana", "description": "Ensures access to water for every farm — 'Har Khet Ko Pani' and 'More Crop Per Drop' for irrigation efficiency.", "eligibility": "All farmers with agricultural land", "url": "https://pmksy.gov.in"},
            {"name": "Soil Health Card Scheme", "description": "Free soil testing and health cards to help farmers understand soil nutrient status and improve productivity.", "eligibility": "All farmers", "url": "https://soilhealth.dac.gov.in"},
        ]
        results = []
        for crop in crops:
            try:
                # Try DDG for crop-specific schemes as bonus
                ddg_items = await _ddg_async(f"India government scheme subsidy {crop} farmers 2025", max_results=3)
                ddg_schemes = [{"name": it["title"][:80], "description": it["summary"][:250], "eligibility": "Indian farmers", "url": it["url"]} for it in ddg_items if it["summary"]]
                # Merge: crop-specific first, then known schemes to fill gaps
                combined = ddg_schemes + [s for s in KNOWN_SCHEMES if s["url"] not in {d["url"] for d in ddg_schemes}]
                results.append({"crop": crop, "schemes": combined[:5]})
            except Exception:
                results.append({"crop": crop, "schemes": KNOWN_SCHEMES[:4]})
        return results

    async def fetch_success_stories(self, crops: list[str]) -> list[dict]:
        results = []
        for crop in crops:
            try:
                items = await _ddg_async(f"{crop} farmer success story profit India 2024 2025 site:krishijagran.com OR site:thebetterindia.com OR site:agrifarming.in", max_results=4)
                if not items:
                    items = await _ddg_async(f"Indian farmer success story {crop} income profit", max_results=4)
                if not items:
                    items = await _ddg_async("Indian farmer success story agriculture income 2024 2025", max_results=4)
                # Filter out irrelevant results
                SKIP_DOMAINS = {"music.163.com", "bilibili.com", "weibo.com"}
                clean = [it for it in items if not any(d in it["url"] for d in SKIP_DOMAINS) and it["summary"]]
                stories = [{"title": it["title"][:80], "summary": it["summary"][:250], "url": it["url"]} for it in clean[:3]]
                results.append({"crop": crop, "stories": stories})
            except Exception as e:
                logger.warning(f"Success stories failed for {crop}: {e}")
                results.append({"crop": crop, "stories": []})
        return results

    async def fetch_agri_events(self, crops: list[str], location: str) -> list[dict]:
        # Hardcoded reliable Indian agri events — always available
        KNOWN_EVENTS = [
            {"name": "Krishi Unnati Mela — IARI New Delhi", "date": "March 2026", "location": "New Delhi", "url": "https://iari.res.in"},
            {"name": "India International Agri Expo", "date": "2025–2026", "location": "India", "url": "https://www.indiaagriexpo.com"},
            {"name": "National Horticulture Fair — IIHR Bengaluru", "date": "Annual", "location": "Bengaluru", "url": "https://iihr.res.in"},
            {"name": "Agrovision — Nagpur", "date": "November 2025", "location": "Nagpur", "url": "https://agrovision.in"},
            {"name": "ICAR Kisan Mela", "date": "Annual", "location": "Pan India", "url": "https://icar.org.in"},
        ]
        try:
            state = location.split(",")[-1].strip() if "," in location else location
            ddg_items = await _ddg_async(f"agriculture farming event expo {state} India 2025 2026", max_results=4)
            ddg_events = [{"name": it["title"][:80], "date": "Upcoming", "location": state, "url": it["url"]} for it in ddg_items if it["summary"]]
            combined = ddg_events + [e for e in KNOWN_EVENTS if e["url"] not in {d["url"] for d in ddg_events}]
            return combined[:5]
        except Exception:
            return KNOWN_EVENTS[:4]

    async def fetch_rag_insights(self, crops: list[str], location: str) -> list[dict]:
        results = []
        season = _current_season()
        for crop in crops:
            try:
                query = f"Best practices for growing {crop} in {season} season in {location}. Soil health and irrigation tips."
                rag_result = rag_pipeline.ask(query)
                answer = rag_result.get("answer", "")
                if answer:
                    results.append({"crop": crop, "insights": [{"text": answer, "confidence": 0.85}], "insights_unavailable": False})
                else:
                    results.append({"crop": crop, "insights_unavailable": True})
            except Exception as e:
                logger.warning(f"RAG insights failed for {crop}: {e}")
                results.append({"crop": crop, "insights_unavailable": True})
        return results

    def _build_alerts(self, weather: dict, crops: list[str]) -> list[dict]:
        alerts = []
        if weather.get("weather_unavailable"):
            return alerts
        for day in weather.get("forecast", [])[:2]:
            if day.get("precipitation_prob_pct", 0) > 70:
                alerts.append({
                    "type": "weather",
                    "severity": "high" if day["precipitation_prob_pct"] > 85 else "medium",
                    "affected_crop": ", ".join(crops),
                    "region": weather.get("location", "Your field"),
                    "message": f"Heavy rain expected on {day['date']} ({day['precipitation_prob_pct']}% chance). Protect your crops.",
                    "recommended_action": "Ensure proper drainage. Avoid spraying pesticides or fertilisers.",
                })
        cur = weather.get("current", {})
        if (cur.get("temperature_c") or 0) > 40:
            alerts.append({
                "type": "weather", "severity": "high",
                "affected_crop": ", ".join(crops),
                "region": weather.get("location", "Your field"),
                "message": f"Extreme heat alert: {cur['temperature_c']}°C. Risk of heat stress on crops.",
                "recommended_action": "Irrigate early morning or evening. Provide shade netting if possible.",
            })
        return alerts

    def _build_irrigation_advisories(self, crops: list[str], weather: dict) -> list[dict]:
        season = _current_season()
        forecast = weather.get("forecast", []) if not weather.get("weather_unavailable") else []
        avg_rain = sum(d.get("precipitation_prob_pct", 0) for d in forecast[:3]) / max(len(forecast[:3]), 1)
        advisories = []
        for crop in crops:
            if avg_rain > 60:
                advisories.append({"crop": crop, "advisories": [{"text": f"Rain forecast is high ({avg_rain:.0f}% avg). Reduce irrigation for {crop}.", "recommended_action": "Skip irrigation for 2–3 days. Monitor soil moisture.", "urgency": "low"}]})
            elif avg_rain < 20:
                advisories.append({"crop": crop, "advisories": [{"text": f"Dry conditions ahead. {crop} may need extra watering in {season}.", "recommended_action": "Irrigate every 2 days. Consider drip irrigation to conserve water.", "urgency": "high"}]})
            else:
                advisories.append({"crop": crop, "advisories": [{"text": f"Normal moisture conditions. Maintain regular irrigation schedule for {crop}.", "recommended_action": "Irrigate as per crop stage requirements.", "urgency": "low"}]})
        return advisories

    async def build_feed(self, farmer_id: str, crops: list[str], location: str) -> dict:
        weather = await self.fetch_weather(location, crops)

        (
            mandi_list, news_list, innovations_list, demand_list,
            schemes_list, stories_list, events_list, rag_list,
        ) = await asyncio.gather(
            self.fetch_mandi_prices(crops),
            self.fetch_news(crops),
            self.fetch_innovations(crops),
            self.fetch_demand_insights(crops),
            self.fetch_govt_schemes(crops),
            self.fetch_success_stories(crops),
            self.fetch_agri_events(crops, location),
            self.fetch_rag_insights(crops, location),
        )

        alerts = self._build_alerts(weather, crops)
        irrigation_list = self._build_irrigation_advisories(crops, weather)

        sections = [{"type": "weather", "crop": None, "data": weather}]
        for lst, typ in [
            (mandi_list, "mandi_prices"), (news_list, "news"),
            (innovations_list, "innovations"), (demand_list, "demand"),
            (schemes_list, "schemes"), (stories_list, "success_stories"),
            (rag_list, "rag_insights"), (irrigation_list, "irrigation"),
        ]:
            for item in lst:
                sections.append({"type": typ, "crop": item.get("crop"), "data": item})
        sections.append({"type": "events", "crop": None, "data": {"events": events_list}})

        response = {
            "meta": {
                "farmer_id": farmer_id,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "crops": crops,
                "field_count": len(crops),
                "cached": False,
                "season": _current_season(),
                "location": location,
            },
            "alerts": alerts,
            "sections": sections,
        }
        set_cached(farmer_id, response)
        return response


feed_service = FeedService()
