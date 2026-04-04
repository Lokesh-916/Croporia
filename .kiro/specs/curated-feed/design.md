# Design Document: Curated Feed

## Overview

The Curated Feed is a personalized, newspaper-style landing page for authenticated farmers. After login, farmers with at least one registered crop are redirected to `/feed`, where they see a full-viewport newspaper grid aggregating real-time data from free public APIs: weather forecasts, mandi prices, crop news, pest alerts, government schemes, demand insights, innovations, RAG-powered agronomic tips, success stories, and irrigation advisories.

All feed content originates exclusively from external internet sources. The farmer's registered crops and field locations serve only as query context — no app-internal data appears as feed content. A server-side daily cache keyed by `(farmer_id, calendar_date)` ensures instant repeat loads within the same day.

The Python FastAPI backend (port 8000) gains a new `GET /feed` endpoint. The React frontend gains a new `/feed` page and a set of newspaper-layout components. The login redirect changes from `/community` to `/feed`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  React Frontend (Vite, port 5173)                                   │
│                                                                     │
│  src/pages/feed.jsx          ← newspaper layout page               │
│  src/components/feed/        ← section card components             │
│    HeroSection.jsx                                                  │
│    WeatherWidget.jsx                                                │
│    MandiPricesTable.jsx                                             │
│    NewsHeadlines.jsx                                                │
│    InnovationsGrid.jsx                                              │
│    DemandInsights.jsx                                               │
│    GovtSchemes.jsx                                                  │
│    RagInsights.jsx                                                  │
│    SuccessStories.jsx                                               │
│    IrrigationAdvisories.jsx                                         │
│    AgriEvents.jsx                                                   │
│    AlertsBanner.jsx                                                 │
│    FeedSkeleton.jsx                                                 │
└──────────────┬──────────────────────────────────────────────────────┘
               │ 1. GET /api/fields  (JWT)
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Node.js / Express Backend (port 5000)                              │
│  GET /api/fields  → returns farmer's fields with cropPlans          │
└──────────────┬──────────────────────────────────────────────────────┘
               │ (frontend extracts crop names + location)
               │
               │ 2. GET /feed?crops=wheat,rice&location=Punjab  (JWT)
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Python FastAPI Backend (port 8000)                                 │
│                                                                     │
│  python-backend/feed_router.py   ← FastAPI router, mounted at /feed│
│  python-backend/feed.py          ← FeedService orchestrator        │
│                                                                     │
│  Daily Cache: dict[(farmer_id, date_str)] → FeedResponse           │
│                                                                     │
│  Concurrent async fetches (asyncio.gather):                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
│  │ Open-Meteo   │ │ data.gov.in  │ │  GNews API   │ │ DuckDuckGo│ │
│  │ (weather)    │ │ (mandi price)│ │  (news)      │ │ (search)  │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────────┘ │
│  ┌──────────────┐ ┌──────────────┐                                 │
│  │ Wikipedia    │ │ RAG System   │                                  │
│  │ REST API     │ │ (rag.py)     │                                  │
│  └──────────────┘ └──────────────┘                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User logs in → Node.js returns JWT → frontend stores in `localStorage`
2. Login redirect changes from `/community` → `/feed`
3. Feed page mounts → calls `GET /api/fields` (Node.js, JWT) to get farmer's fields
4. Frontend extracts distinct crop names and the first field's location string
5. Frontend calls `GET /feed?crops=wheat,rice&location=Punjab` with `Authorization: Bearer <token>` to Python backend
6. Python backend decodes JWT to extract `farmer_id`
7. Cache lookup: if `(farmer_id, today)` exists → return cached response immediately
8. Cache miss: `FeedService` runs all fetchers concurrently via `asyncio.gather`
9. Each fetcher catches its own exceptions and returns an unavailability flag on failure
10. Assembled response is stored in cache and returned as JSON
11. Frontend renders newspaper grid from the structured JSON

---

## Components and Interfaces

### Python: `python-backend/feed.py` — FeedService

```python
class FeedService:
    async def fetch_weather(self, location: str, crops: list[str]) -> dict
    async def fetch_mandi_prices(self, crops: list[str]) -> dict
    async def fetch_news(self, crops: list[str]) -> dict
    async def fetch_innovations(self, crops: list[str]) -> dict
    async def fetch_demand_insights(self, crops: list[str]) -> dict
    async def fetch_alerts(self, crops: list[str], location: str, weather: dict) -> list[dict]
    async def fetch_govt_schemes(self, crops: list[str]) -> dict
    async def fetch_rag_insights(self, crops: list[str], location: str) -> dict
    async def fetch_success_stories(self, crops: list[str]) -> dict
    async def fetch_irrigation_advisories(self, crops: list[str], weather: dict) -> dict
    async def fetch_agri_events(self, crops: list[str], location: str) -> list[dict]
    async def build_feed(self, farmer_id: str, crops: list[str], location: str) -> dict
```

Each `fetch_*` method:
- Uses `httpx.AsyncClient` for all HTTP calls
- Catches all exceptions internally
- Returns a dict with either the data or an `*_unavailable: True` flag
- Never raises — partial failure is handled gracefully

### Python: `python-backend/feed_router.py` — FastAPI Router

```python
router = APIRouter(prefix="/feed", tags=["feed"])

@router.get("")
async def get_feed(
    crops: str,           # comma-separated crop names from query param
    location: str,        # field location string from query param
    authorization: str = Header(...)
) -> dict
```

JWT decoding reuses the same secret as the Node.js backend (shared `JWT_SECRET` env var).

### Python: Daily Cache

```python
# In-memory cache — module-level dict in feed.py
_feed_cache: dict[tuple[str, str], dict] = {}

def _cache_key(farmer_id: str) -> tuple[str, str]:
    return (farmer_id, date.today().isoformat())

def get_cached(farmer_id: str) -> dict | None:
    return _feed_cache.get(_cache_key(farmer_id))

def set_cached(farmer_id: str, response: dict) -> None:
    # Evict stale entries (different date) for this farmer
    stale = [k for k in _feed_cache if k[0] == farmer_id and k[1] != date.today().isoformat()]
    for k in stale:
        del _feed_cache[k]
    _feed_cache[_cache_key(farmer_id)] = response
```

Cache expires naturally: keys include the date string, so yesterday's entries are never matched and are evicted on the next write for that farmer.

### React: Component Tree

```
src/pages/feed.jsx
├── Navbar
├── AlertsBanner          ← top-of-page, only when alerts.length > 0
├── FeedHeader            ← "CROPORIA DAILY", date, crop badges, cached indicator
├── FeedSkeleton          ← shown while loading, mirrors grid structure
└── newspaper grid (CSS Grid)
    ├── col-span-2: HeroSection       ← top alert or top news headline
    ├── col-span-1: WeatherWidget     ← 5-day forecast cards (sidebar, row-span-3)
    ├── col-span-1: InnovationsGrid   ← 3 cards
    ├── col-span-1: NewsHeadlines     ← headlines list
    ├── col-span-1: MandiPricesTable  ← price table (sidebar continuation)
    ├── col-span-1: DemandInsights    ← trend cards
    ├── col-span-1: GovtSchemes       ← scheme cards
    ├── col-span-1: RagInsights       ← smart tips (sidebar continuation)
    ├── col-span-1: SuccessStories    ← story cards
    ├── col-span-1: AgriEvents        ← event list
    └── col-span-1: IrrigationAdvisories ← advisory cards (sidebar continuation)
```

Each section component receives its slice of the feed JSON as props and renders a graceful fallback when the `*_unavailable` flag is set.

---

## Data Models

### Feed Response JSON Schema

```json
{
  "meta": {
    "farmer_id": "string",
    "generated_at": "2024-01-15T08:30:00Z",
    "crops": ["wheat", "rice"],
    "field_count": 2,
    "cached": false
  },
  "alerts": [
    {
      "type": "weather | pest | disease",
      "severity": "low | medium | high",
      "affected_crop": "string",
      "region": "string",
      "message": "string",
      "recommended_action": "string"
    }
  ],
  "sections": [
    {
      "type": "weather | mandi_prices | news | innovations | demand | schemes | rag_insights | success_stories | irrigation | events",
      "crop": "string | null",
      "data": { }
    }
  ]
}
```

### Section Data Shapes

**weather section data:**
```json
{
  "location": "string",
  "current": {
    "temperature_c": 28.5,
    "humidity_pct": 65,
    "precipitation_prob_pct": 20,
    "wind_speed_kmh": 12.3,
    "condition": "Partly Cloudy"
  },
  "forecast": [
    {
      "date": "2024-01-16",
      "temperature_max_c": 31.0,
      "temperature_min_c": 22.0,
      "precipitation_prob_pct": 75,
      "condition": "Rain"
    }
  ],
  "weather_unavailable": false
}
```

**mandi_prices section data:**
```json
{
  "crop": "wheat",
  "entries": [
    {
      "mandi_name": "Azadpur Mandi",
      "commodity": "Wheat",
      "price_per_quintal": 2150,
      "price_date": "2024-01-15"
    }
  ],
  "prices_unavailable": false
}
```

**news section data:**
```json
{
  "crop": "wheat",
  "headlines": [
    {
      "title": "string",
      "source": "string",
      "published_at": "2024-01-15T06:00:00Z",
      "url": "string"
    }
  ],
  "news_unavailable": false
}
```

**innovations section data:**
```json
{
  "crop": "wheat",
  "items": [
    {
      "title": "string",
      "summary": "string",
      "url": "string"
    }
  ],
  "innovations_unavailable": false
}
```

**demand section data:**
```json
{
  "crop": "wheat",
  "entries": [
    {
      "region": "string",
      "trend": "rising | stable | falling",
      "snippet": "string"
    }
  ],
  "demand_unavailable": false
}
```

**schemes section data:**
```json
{
  "crop": "wheat",
  "schemes": [
    {
      "name": "string",
      "description": "string",
      "eligibility": "string",
      "url": "string"
    }
  ]
}
```

**rag_insights section data:**
```json
{
  "crop": "wheat",
  "insights": [
    {
      "text": "string",
      "confidence": 0.87
    }
  ],
  "insights_unavailable": false
}
```

**success_stories section data:**
```json
{
  "crop": "wheat",
  "stories": [
    {
      "title": "string",
      "summary": "string",
      "url": "string"
    }
  ]
}
```

**irrigation section data:**
```json
{
  "crop": "wheat",
  "advisories": [
    {
      "text": "string",
      "recommended_action": "string",
      "urgency": "low | medium | high"
    }
  ]
}
```

**events section data:**
```json
{
  "events": [
    {
      "name": "string",
      "date": "2024-02-10",
      "location": "string",
      "url": "string"
    }
  ]
}
```

### External API Reference

| Source | URL | Auth |
|---|---|---|
| Open-Meteo | `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=...` | None |
| DuckDuckGo | `https://api.duckduckgo.com/?q={query}&format=json&no_html=1` | None |
| GNews | `https://gnews.io/api/v4/search?q={crop}&token={GNEWS_API_KEY}&max=8&lang=en` | `GNEWS_API_KEY` |
| Wikipedia | `https://en.wikipedia.org/api/rest_v1/page/summary/{crop}` | None |
| data.gov.in | `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={DATA_GOV_IN_API_KEY}&filters[commodity]={crop}` | `DATA_GOV_IN_API_KEY` |

### Environment Variables

Add to `.env` (project root):

```
# Feed feature
GNEWS_API_KEY=your_gnews_free_tier_key
DATA_GOV_IN_API_KEY=your_data_gov_in_key
JWT_SECRET=same_secret_as_nodejs_backend
```

`config.py` additions:
```python
gnews_api_key: str | None = Field(default=None, validation_alias="GNEWS_API_KEY")
data_gov_in_api_key: str | None = Field(default=None, validation_alias="DATA_GOV_IN_API_KEY")
jwt_secret: str | None = Field(default=None, validation_alias="JWT_SECRET")
```

### Login Redirect Change

In `src/pages/auth/login.jsx`, change:
```js
// before
navigate('/community')
// after
navigate('/feed')
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Access control by crop presence

*For any* authenticated farmer, if they have at least one crop in their registered fields then `GET /feed` returns HTTP 200; if they have zero crops then `GET /feed` returns HTTP 403 with error code `no_crops`.

**Validates: Requirements 1.1, 1.2**

---

### Property 2: Cache round-trip

*For any* farmer and any set of crops, making two consecutive `GET /feed` requests on the same calendar day should return responses with identical `sections` and `alerts` content, and the second response's `meta.cached` should be `true` while `meta.generated_at` should equal the first response's `meta.generated_at`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

---

### Property 3: Cache date expiry

*For any* farmer, a cache entry keyed with yesterday's date should not be returned for today's feed request — the service should perform a fresh fetch and return `meta.cached = false`.

**Validates: Requirements 2.5**

---

### Property 4: Crop context propagation

*For any* farmer with N distinct crops across their fields, the feed response `sections` array should contain at least one entry for each distinct crop, and the `meta.crops` array should list all N crops.

**Validates: Requirements 3.1, 3.3, 3.4**

---

### Property 5: Mandi prices ordering invariant

*For any* mandi prices section with more than one entry, the entries should be sorted by `price_date` in descending order — i.e., `entries[i].price_date >= entries[i+1].price_date` for all valid indices.

**Validates: Requirements 4.4**

---

### Property 6: Rain alert threshold

*For any* weather forecast where at least one day within the next 24 hours has `precipitation_prob_pct > 70`, the top-level `alerts` array should contain at least one alert with `type = "weather"` referencing that field's location.

**Validates: Requirements 5.4**

---

### Property 7: Innovation URL uniqueness

*For any* innovations section, all `url` values in the `items` array should be distinct — no two items share the same URL.

**Validates: Requirements 6.5**

---

### Property 8: Section count bounds

*For any* feed response:
- innovations `items` count is between 3 and 10 (or `innovations_unavailable = true`)
- demand `entries` count is between 2 and 6 (or `demand_unavailable = true`)
- news `headlines` count is between 3 and 8 (or `news_unavailable = true`)
- rag_insights `insights` count is between 1 and 3 (or `insights_unavailable = true`)

**Validates: Requirements 6.3, 7.3, 9.2, 11.2**

---

### Property 9: Alert severity is a valid enum value

*For any* alert in the `alerts` array, the `severity` field must be exactly one of `"low"`, `"medium"`, or `"high"`.

**Validates: Requirements 8.2**

---

### Property 10: News recency filter

*For any* news headline in any news section, the `published_at` timestamp should be no more than 7 days before the feed's `meta.generated_at` timestamp.

**Validates: Requirements 9.4**

---

### Property 11: Partial failure resilience

*For any* feed request where exactly one external data source returns an error, the overall HTTP response should still be 200 and the affected section should carry the appropriate `*_unavailable = true` flag while all other sections contain valid data.

**Validates: Requirements 15.5**

---

### Property 12: Response schema invariant

*For any* successful feed response:
- `meta` contains `farmer_id` (string), `generated_at` (ISO 8601 string), `crops` (array), `field_count` (integer), `cached` (boolean)
- every element in `sections` has `type` (string), `crop` (string or null), and `data` (object)
- `alerts` is always an array (possibly empty)

**Validates: Requirements 16.1, 16.2, 16.3**

---

### Property 13: JSON serialization round-trip

*For any* valid feed response object, serializing it to a JSON string and then deserializing that string should produce an object that is deeply equal to the original.

**Validates: Requirements 16.4**

---

## Error Handling

| Scenario | Behavior |
|---|---|
| JWT missing or invalid | HTTP 401 |
| Farmer has no registered crops | HTTP 403 `{"error": "no_crops"}` |
| Individual external API timeout (>10s) | Section marked `*_unavailable: true`, rest of feed returned |
| All external APIs fail | HTTP 200 with all sections flagged unavailable |
| `GNEWS_API_KEY` not set | news sections return `news_unavailable: true` |
| `DATA_GOV_IN_API_KEY` not set | mandi sections return `prices_unavailable: true` |
| Open-Meteo geocoding fails (bad location string) | weather section returns `weather_unavailable: true` |
| RAG vectorstore not initialized | rag_insights section returns `insights_unavailable: true` |
| Farmer navigates to `/feed` with no crops | React redirects to `/fields/new` with query param `?reason=feed_requires_crops` |

---

## Testing Strategy

### Unit Tests

Focus on specific examples and edge cases:

- `FeedService.build_feed` with a mocked farmer context returns a response matching the schema
- Cache hit returns `cached: true` and identical `generated_at`
- Cache miss populates the cache dict
- Cache key with yesterday's date is not matched today
- `fetch_mandi_prices` with a mocked 200 response returns correctly sorted entries
- `fetch_mandi_prices` with a mocked 500 response returns `prices_unavailable: true`
- `fetch_news` filters out articles older than 7 days
- `fetch_innovations` deduplicates by URL
- Rain alert is generated when precipitation > 70%
- No alerts section is omitted when empty — returns `[]`
- JWT decode failure returns 401
- No-crops farmer returns 403 with `no_crops` code
- React `<FeedPage>` redirects to `/fields/new` when `cropPlans` is empty

### Property-Based Tests

Use **Hypothesis** (Python) for backend properties and **fast-check** (JS) for frontend schema validation.

Each property test runs a minimum of **100 iterations**.

Tag format: `# Feature: curated-feed, Property {N}: {property_text}`

| Property | Test Description |
|---|---|
| P1: Access control | Generate random farmer contexts (with/without crops), assert correct HTTP status |
| P2: Cache round-trip | Generate random crop lists, call build_feed twice, assert second is cached with same generated_at |
| P3: Cache date expiry | Insert cache entry with yesterday's date, assert today's request triggers fresh fetch |
| P4: Crop context propagation | Generate N distinct crops, assert sections and meta.crops cover all N |
| P5: Mandi prices ordering | Generate random mandi entries, assert sorted descending by date |
| P6: Rain alert threshold | Generate weather forecasts with random precipitation values, assert alert presence matches threshold |
| P7: Innovation URL uniqueness | Generate innovation lists with potential duplicates, assert deduplication produces unique URLs |
| P8: Section count bounds | Generate random API responses, assert counts fall within specified bounds |
| P9: Alert severity enum | Generate random alert data, assert severity is always in {"low","medium","high"} |
| P10: News recency filter | Generate news articles with random dates, assert all returned articles are within 7 days |
| P11: Partial failure resilience | Mock one random data source to fail, assert HTTP 200 with that section flagged |
| P12: Response schema invariant | Generate random feed responses, assert all required fields are present with correct types |
| P13: JSON round-trip | Generate random feed response dicts, assert `json.loads(json.dumps(r)) == r` |
