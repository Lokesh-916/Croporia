# Implementation Plan: Curated Feed

## Overview

Implement the personalized farmer newspaper feed. The Python FastAPI backend gains a `GET /feed` endpoint with concurrent async data fetching and a daily in-memory cache. The React frontend gains a full-viewport newspaper-layout page with section components. Login redirects to `/feed` after completion.

## Tasks

- [x] 1. Set up environment variables and config
  - Add `GNEWS_API_KEY` and `DATA_GOV_IN_API_KEY` placeholder entries to `.env`
  - Add `gnews_api_key`, `data_gov_in_api_key`, and `jwt_secret` fields to `python-backend/config.py`
  - _Requirements: 4.1, 9.1, 15.1_

- [-] 2. Implement FeedService in `python-backend/feed.py`
  - [ ] 2.1 Implement daily cache helpers (`_cache_key`, `get_cached`, `set_cached`) and module-level `_feed_cache` dict
    - Cache key is `(farmer_id, date.today().isoformat())`
    - `set_cached` evicts stale entries for the same farmer before writing
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 2.2 Implement `FeedService.fetch_weather` using Open-Meteo API
    - Use `httpx.AsyncClient`; catch all exceptions; return `weather_unavailable: true` on failure
    - Include current conditions and 5-day forecast per the weather section data shape
    - Generate a rain alert entry when any forecast day within 24 h has `precipitation_prob_pct > 70`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 2.3 Implement `FeedService.fetch_mandi_prices` using data.gov.in API
    - Use `DATA_GOV_IN_API_KEY`; return `prices_unavailable: true` when key is absent or request fails
    - Sort entries by `price_date` descending
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 2.4 Implement `FeedService.fetch_news` using GNews API
    - Use `GNEWS_API_KEY`; return `news_unavailable: true` when key is absent or request fails
    - Filter out articles older than 7 days relative to current time
    - Return 3–8 headlines per crop
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 2.5 Implement `FeedService.fetch_innovations` using DuckDuckGo + Wikipedia APIs
    - Query DuckDuckGo for crop innovations; supplement with Wikipedia summary
    - Deduplicate results by URL before returning
    - Return 3–10 items per crop; set `innovations_unavailable: true` on failure
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 2.6 Implement `FeedService.fetch_demand_insights` using DuckDuckGo API
    - Query for demand and export data per crop
    - Return 2–6 entries; set `demand_unavailable: true` on failure
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 2.7 Implement `FeedService.fetch_alerts` combining weather-derived and search-derived alerts
    - Accept pre-fetched `weather` dict; extract rain alerts from it
    - Query DuckDuckGo and GNews for pest/disease outbreak reports per crop and location
    - Classify each alert with severity `low | medium | high`
    - Return empty list (never omit section) when no alerts found
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 2.8 Implement `FeedService.fetch_govt_schemes` using DuckDuckGo API
    - Return up to 5 scheme entries per crop; return empty array when none found
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 2.9 Implement `FeedService.fetch_rag_insights` using existing RAG system (`rag.py`)
    - Pass crop + current season + location as query context
    - Return 1–3 insights with confidence scores; set `insights_unavailable: true` on failure
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 2.10 Implement `FeedService.fetch_success_stories` using DuckDuckGo API
    - Return up to 3 stories per crop; return empty array when none found
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 2.11 Implement `FeedService.fetch_irrigation_advisories` combining weather data and Wikipedia crop water requirements
    - Derive urgency from current season and precipitation forecast
    - Return up to 2 advisories per crop
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ] 2.12 Implement `FeedService.fetch_agri_events` using DuckDuckGo API
    - Filter out events with a past date relative to request time
    - Return up to 5 events
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ] 2.13 Implement `FeedService.build_feed` orchestrator
    - Fetch weather first (needed by alerts and irrigation); then run all remaining fetchers concurrently via `asyncio.gather`
    - Assemble response conforming to the Feed Response JSON schema (`meta`, `alerts`, `sections`)
    - Include `meta.cached: false` and `meta.generated_at` (ISO 8601) on fresh builds
    - Store result in daily cache via `set_cached`; return assembled dict
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 15.2, 15.4, 15.5, 16.1, 16.2, 16.3_

- [ ] 3. Checkpoint — ensure FeedService unit tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement feed router in `python-backend/feed_router.py`
  - [ ] 4.1 Create `feed_router.py` with `APIRouter(prefix="/feed")`
    - Decode JWT from `Authorization` header using `JWT_SECRET`; return 401 on failure
    - Accept `crops` (comma-separated) and `location` query params
    - Return 403 `{"error": "no_crops"}` when crops list is empty
    - Check daily cache; return cached response immediately when hit
    - Call `FeedService.build_feed` on cache miss; return result
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 15.1, 15.2, 15.3, 15.6, 15.7, 15.8_

  - [ ] 4.2 Mount `feed_router` in `python-backend/main.py`
    - Import and include the router with `app.include_router(feed_router)`
    - _Requirements: 15.1_

- [ ] 5. Implement React feed page and components
  - [ ] 5.1 Create `src/components/feed/AlertsBanner.jsx`
    - Renders a dismissible banner at the top of the page when `alerts.length > 0`
    - Color-codes by highest severity; shows alert message and recommended action
    - _Requirements: 8.3, 17.9_

  - [ ] 5.2 Create `src/components/feed/FeedHeader.jsx`
    - Renders "CROPORIA DAILY" masthead, current date, crop badges, and cached indicator
    - _Requirements: 17.2_

  - [ ] 5.3 Create `src/components/feed/FeedSkeleton.jsx`
    - Renders a loading skeleton that mirrors the newspaper grid structure
    - _Requirements: 17.6_

  - [ ] 5.4 Create `src/components/feed/HeroSection.jsx`
    - Full-width hero showing the top alert or top news headline
    - _Requirements: 17.3_

  - [ ] 5.5 Create `src/components/feed/WeatherWidget.jsx`
    - Sidebar widget showing current conditions and 5-day forecast cards
    - Renders graceful fallback when `weather_unavailable` is true
    - _Requirements: 5.2, 17.4, 17.8_

  - [ ] 5.6 Create `src/components/feed/MandiPricesTable.jsx`
    - Table of mandi prices sorted by date; graceful fallback on `prices_unavailable`
    - _Requirements: 4.2, 17.4, 17.8_

  - [ ] 5.7 Create `src/components/feed/NewsHeadlines.jsx`
    - List of news headlines with source and date; graceful fallback on `news_unavailable`
    - _Requirements: 9.2, 17.8_

  - [ ] 5.8 Create `src/components/feed/InnovationsGrid.jsx`
    - Grid of 3 innovation cards with title, summary, and source link; graceful fallback on `innovations_unavailable`
    - _Requirements: 6.3, 17.5, 17.8_

  - [ ] 5.9 Create `src/components/feed/DemandInsights.jsx`
    - Trend cards with region, trend badge (rising/stable/falling), and snippet; graceful fallback on `demand_unavailable`
    - _Requirements: 7.2, 17.8_

  - [ ] 5.10 Create `src/components/feed/GovtSchemes.jsx`
    - Scheme cards with name, description, eligibility, and link; empty-state when no schemes
    - _Requirements: 10.2, 17.8_

  - [ ] 5.11 Create `src/components/feed/RagInsights.jsx`
    - Smart tip cards with insight text and confidence bar; graceful fallback on `insights_unavailable`
    - _Requirements: 11.2, 17.8_

  - [ ] 5.12 Create `src/components/feed/SuccessStories.jsx`
    - Story cards with title, summary, and link; empty-state when no stories
    - _Requirements: 12.2, 17.8_

  - [ ] 5.13 Create `src/components/feed/IrrigationAdvisories.jsx`
    - Advisory cards with text, recommended action, and urgency badge
    - _Requirements: 13.2, 17.8_

  - [ ] 5.14 Create `src/components/feed/AgriEvents.jsx`
    - Event list with name, date, location, and registration link; empty-state when no events
    - _Requirements: 14.2, 17.8_

  - [ ] 5.15 Create `src/pages/feed.jsx` — main newspaper layout page
    - On mount: call `GET /api/fields` (Node.js) to extract crops and location; call `GET /feed` (Python backend) with JWT
    - Show `FeedSkeleton` while loading
    - When `cropPlans` is empty, redirect to `/fields/new?reason=feed_requires_crops`
    - Render newspaper CSS Grid: `AlertsBanner` at top, `FeedHeader`, then hero + sidebar + multi-column grid
    - Pass each section's data slice as props to the corresponding component
    - _Requirements: 1.3, 1.4, 3.1, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10_

- [ ] 6. Wire routing and login redirect
  - [ ] 6.1 Add `/feed` route with `ProtectedRoute` in `src/App.jsx`
    - Import `FeedPage` and wrap with existing `ProtectedRoute` component
    - _Requirements: 17.1_

  - [ ] 6.2 Change post-login redirect in `src/pages/auth/login.jsx` from `/community` to `/feed`
    - _Requirements: 17.1_

- [ ] 7. Checkpoint — verify routing and feed page render
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Write property-based tests in `python-backend/tests/test_feed_properties.py`
  - [ ]* 8.1 Write property test for access control by crop presence (Property 1)
    - **Property 1: Access control by crop presence**
    - **Validates: Requirements 1.1, 1.2**

  - [ ]* 8.2 Write property test for cache round-trip (Property 2)
    - **Property 2: Cache round-trip**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

  - [ ]* 8.3 Write property test for cache date expiry (Property 3)
    - **Property 3: Cache date expiry**
    - **Validates: Requirements 2.5**

  - [ ]* 8.4 Write property test for crop context propagation (Property 4)
    - **Property 4: Crop context propagation**
    - **Validates: Requirements 3.1, 3.3, 3.4**

  - [ ]* 8.5 Write property test for mandi prices ordering invariant (Property 5)
    - **Property 5: Mandi prices ordering invariant**
    - **Validates: Requirements 4.4**

  - [ ]* 8.6 Write property test for rain alert threshold (Property 6)
    - **Property 6: Rain alert threshold**
    - **Validates: Requirements 5.4**

  - [ ]* 8.7 Write property test for innovation URL uniqueness (Property 7)
    - **Property 7: Innovation URL uniqueness**
    - **Validates: Requirements 6.5**

  - [ ]* 8.8 Write property test for section count bounds (Property 8)
    - **Property 8: Section count bounds**
    - **Validates: Requirements 6.3, 7.3, 9.2, 11.2**

  - [ ]* 8.9 Write property test for alert severity enum (Property 9)
    - **Property 9: Alert severity is a valid enum value**
    - **Validates: Requirements 8.2**

  - [ ]* 8.10 Write property test for news recency filter (Property 10)
    - **Property 10: News recency filter**
    - **Validates: Requirements 9.4**

  - [ ]* 8.11 Write property test for partial failure resilience (Property 11)
    - **Property 11: Partial failure resilience**
    - **Validates: Requirements 15.5**

  - [ ]* 8.12 Write property test for response schema invariant (Property 12)
    - **Property 12: Response schema invariant**
    - **Validates: Requirements 16.1, 16.2, 16.3**

  - [ ]* 8.13 Write property test for JSON serialization round-trip (Property 13)
    - **Property 13: JSON serialization round-trip**
    - **Validates: Requirements 16.4**

- [ ] 9. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use Hypothesis (Python) with a minimum of 100 iterations each
- Tag format for property tests: `# Feature: curated-feed, Property {N}: {property_text}`
