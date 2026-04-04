# Requirements Document

## Introduction

The Curated Feed is a personalized farmer's newspaper that serves as the home/landing page after login. It aggregates real-time data exclusively from the internet — crop prices, weather, pest alerts, innovations, market demand, government schemes, and more — and presents them in a full-page newspaper-style UI tailored to the farmer's registered crops and field locations. The Python backend exposes a single `/feed` endpoint that orchestrates all data fetching, caches the result for the entire calendar day, and returns structured JSON to the React frontend. The feature is only accessible to farmers who have at least one registered crop.

All external data is sourced from free, publicly accessible APIs only. No paid API services are used.

## Glossary

- **Feed**: The personalized, aggregated content page shown to the farmer after login
- **Feed_Service**: The Python backend module responsible for orchestrating all data sources and returning the structured feed response
- **Crop_Context**: The set of crops derived from the farmer's registered fields; the only app-internal data used as query context
- **Field_Location**: The geographic coordinates or region associated with a farmer's registered field; used as query context only
- **Mandi_Price**: Wholesale agricultural commodity price from Indian mandis via data.gov.in (free, registration required)
- **Weather_Provider**: Open-Meteo API (free, no API key required) used to fetch current conditions and forecast weather for a field location
- **Search_Provider**: DuckDuckGo Instant Answer API (free, no API key required) used for web search of crop innovations, demand data, and news
- **News_Provider**: GNews API (free tier: 100 requests/day, API key required) used to fetch crop-specific news headlines
- **Wikipedia_Provider**: Wikipedia REST API (free, no API key required) used for crop background and contextual information
- **RAG_System**: The existing LangChain + FAISS retrieval-augmented generation system in the Python backend
- **Alert**: A time-sensitive notification about weather extremes, pest outbreaks, or other adverse conditions
- **Farmer**: An authenticated user who has at least one registered field with a crop assigned
- **Daily_Cache**: A server-side cache keyed by `(farmer_id, calendar_date)` that stores the complete feed response for one calendar day
- **Feed_Page**: The React frontend page that renders the full newspaper layout

## Environment Variables

The following `.env` placeholders are required for the Feed_Service:

| Variable | Provider | Required |
|---|---|---|
| `GNEWS_API_KEY` | GNews API (free tier) | Yes |
| `DATA_GOV_IN_API_KEY` | data.gov.in (free, registration) | Yes |

No other API keys are required. Open-Meteo, DuckDuckGo Instant Answer API, and Wikipedia REST API are all keyless.

---

## Requirements

### Requirement 1: Access Control — Farmers with Registered Crops Only

**User Story:** As a product owner, I want the curated feed to be accessible only to farmers who have at least one registered crop, so that the feed always has meaningful context to work with.

#### Acceptance Criteria

1. WHEN a Farmer with at least one registered field containing a crop requests the feed, THE Feed_Service SHALL process and return the feed.
2. WHEN a Farmer with no registered crops requests the feed, THE Feed_Service SHALL return HTTP 403 with a `no_crops` error code.
3. THE Feed_Page SHALL only display the feed navigation link to Farmers who have at least one registered crop.
4. WHEN a Farmer with no registered crops navigates directly to the feed URL, THE Feed_Page SHALL redirect the farmer to the field registration page with an explanatory message.

---

### Requirement 2: Daily Cache

**User Story:** As a farmer, I want the feed to load instantly on repeat visits within the same day, so that I don't wait for data to be re-fetched every time I open the app.

#### Acceptance Criteria

1. WHEN a Farmer requests the feed and a Daily_Cache entry exists for that farmer on the current calendar date, THE Feed_Service SHALL return the cached feed response without making any external API calls.
2. WHEN a Farmer requests the feed and no Daily_Cache entry exists for the current calendar date, THE Feed_Service SHALL fetch all data sources, store the assembled feed in the Daily_Cache keyed by `(farmer_id, calendar_date)`, and return the response.
3. THE Feed_Service SHALL include a `cached` boolean field in the feed metadata indicating whether the response was served from cache.
4. THE Feed_Service SHALL include the original `generated_at` ISO 8601 timestamp in cached responses so the farmer can see when the feed was first built.
5. THE Daily_Cache SHALL expire all entries at midnight local time so each new calendar day triggers a fresh fetch.

---

### Requirement 3: Personalized Feed Generation

**User Story:** As a farmer, I want the feed to be tailored to my registered crops and field locations, so that all content I see is directly relevant to my farming context.

#### Acceptance Criteria

1. WHEN a Farmer requests the feed, THE Feed_Service SHALL retrieve all crops and Field_Locations from the farmer's registered fields and use them exclusively as query context for external API calls.
2. THE Feed_Service SHALL NOT include any other app-internal data in the feed content; all displayed content SHALL originate from external internet sources.
3. THE Feed_Service SHALL include the farmer's crop list and field count in the feed metadata returned to the frontend.
4. WHEN a Farmer has multiple registered fields with different crops, THE Feed_Service SHALL generate feed sections for each distinct crop.

---

### Requirement 4: Mandi / Market Prices

**User Story:** As a farmer, I want to see current wholesale prices for my crops at nearby mandis, so that I can make informed selling decisions.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL fetch mandi prices for each crop in the Crop_Context from the data.gov.in API using the `DATA_GOV_IN_API_KEY`.
2. THE Feed_Service SHALL include the mandi name, commodity name, price per quintal, and price date in each mandi price entry.
3. WHEN mandi price data is unavailable for a crop, THE Feed_Service SHALL include a `prices_unavailable` flag for that crop's price section rather than omitting the section.
4. THE Feed_Service SHALL return mandi prices sorted by price date descending, with the most recent prices first.

---

### Requirement 5: Weather Forecast for Field Location

**User Story:** As a farmer, I want to see the current weather and a short-term forecast for my field location, so that I can plan field activities accordingly.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL fetch current weather conditions and a 5-day forecast for each distinct Field_Location using the Open-Meteo API (no API key required).
2. THE Feed_Service SHALL include temperature (°C), humidity (%), precipitation probability (%), wind speed (km/h), and a weather condition label in each weather entry.
3. IF the Weather_Provider returns an error for a Field_Location, THEN THE Feed_Service SHALL include a `weather_unavailable` flag for that location's weather section.
4. WHEN precipitation probability exceeds 70% within the next 24 hours, THE Feed_Service SHALL include a rain alert in the Alerts section for that field.

---

### Requirement 6: Crop Innovations and World Usage

**User Story:** As a farmer, I want to see the latest innovations and smart global uses of my crop, so that I can discover new opportunities and value-added applications.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL query the DuckDuckGo Instant Answer API with a crop-specific innovations query for each crop in the Crop_Context.
2. THE Feed_Service SHALL supplement DuckDuckGo results with the Wikipedia_Provider to retrieve background and usage context for each crop.
3. THE Feed_Service SHALL return at least 3 and at most 10 innovation results per crop, each containing a title, summary, and source URL.
4. WHEN the Search_Provider returns no results for a crop, THE Feed_Service SHALL include an `innovations_unavailable` flag for that crop's innovations section.
5. THE Feed_Service SHALL deduplicate innovation results by URL before returning them.

---

### Requirement 7: Crop Demand Insights

**User Story:** As a farmer, I want to see where and how much my crop is in demand, so that I can target the right markets.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL query the DuckDuckGo Instant Answer API for demand and export data for each crop in the Crop_Context.
2. THE Feed_Service SHALL include region name, demand trend (rising/stable/falling), and a supporting data snippet in each demand entry.
3. THE Feed_Service SHALL return at least 2 and at most 6 demand entries per crop.
4. WHEN demand data is unavailable, THE Feed_Service SHALL include a `demand_unavailable` flag for that crop's demand section.

---

### Requirement 8: Alerts (Weather, Pest, and Outbreak Warnings)

**User Story:** As a farmer, I want to receive timely alerts about weather extremes, pest outbreaks, and disease risks in my region, so that I can take preventive action.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL query the DuckDuckGo Instant Answer API and News_Provider for pest and disease outbreak reports relevant to each crop and Field_Location.
2. THE Feed_Service SHALL classify each alert with a severity level of `low`, `medium`, or `high`.
3. THE Feed_Service SHALL include alert type, severity, affected crop, region, and a recommended action in each alert entry.
4. WHEN no alerts are found, THE Feed_Service SHALL return an empty alerts array rather than omitting the alerts section.
5. THE Feed_Service SHALL surface weather-derived alerts (from Requirement 5) alongside search-derived pest alerts in the same unified alerts section.

---

### Requirement 9: Crop-Specific News Headlines

**User Story:** As a farmer, I want to read the latest news about my crop, so that I stay informed about market and policy developments.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL fetch crop-specific news headlines from the GNews API using the `GNEWS_API_KEY` for each crop in the Crop_Context.
2. THE Feed_Service SHALL return at least 3 and at most 8 news headlines per crop, each containing a title, source name, published date, and article URL.
3. WHEN the News_Provider returns an error, THE Feed_Service SHALL include a `news_unavailable` flag for that crop's news section.
4. THE Feed_Service SHALL filter out news articles older than 7 days.

---

### Requirement 10: Government Schemes and Subsidies

**User Story:** As a farmer, I want to see relevant government schemes and subsidies for my crop, so that I can take advantage of available support.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL query the DuckDuckGo Instant Answer API for active government schemes and subsidies relevant to each crop in the Crop_Context.
2. THE Feed_Service SHALL include scheme name, brief description, eligibility summary, and a reference URL in each scheme entry.
3. THE Feed_Service SHALL return at most 5 scheme entries per crop.
4. WHEN no schemes are found, THE Feed_Service SHALL return an empty schemes array rather than omitting the schemes section.

---

### Requirement 11: RAG-Powered Smart Insights

**User Story:** As a farmer, I want to receive smart, context-aware insights about my crop's growth stage and soil health, so that I get expert-level guidance without consulting an agronomist.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL invoke the RAG_System with a query combining the farmer's crop and current season to retrieve relevant agronomic insights.
2. THE Feed_Service SHALL include at least 1 and at most 3 RAG-generated insight entries per crop, each containing an insight text and a confidence score.
3. IF the RAG_System returns no results, THEN THE Feed_Service SHALL include an `insights_unavailable` flag for that crop's insights section.
4. THE Feed_Service SHALL pass the farmer's Crop_Context and Field_Location as context to the RAG_System query.

---

### Requirement 12: Success Stories

**User Story:** As a farmer, I want to read success stories from other farmers growing the same crop, so that I can learn from their experiences.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL query the DuckDuckGo Instant Answer API for success stories and case studies related to each crop in the Crop_Context.
2. THE Feed_Service SHALL return at most 3 success story entries per crop, each containing a title, summary, and source URL.
3. WHEN no success stories are found, THE Feed_Service SHALL return an empty success_stories array rather than omitting the section.

---

### Requirement 13: Irrigation and Water Advisories

**User Story:** As a farmer, I want to receive irrigation advisories based on the current season and weather, so that I can manage water usage efficiently.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL derive irrigation advisories for each crop by combining the current season, weather forecast data from the Weather_Provider, and crop water requirements sourced from the Wikipedia_Provider.
2. THE Feed_Service SHALL include advisory text, recommended action, and urgency level (`low`, `medium`, `high`) in each irrigation advisory entry.
3. THE Feed_Service SHALL return at most 2 irrigation advisory entries per crop per feed request.

---

### Requirement 14: Upcoming Agri Events

**User Story:** As a farmer, I want to see upcoming agricultural events, expos, and training programs near me, so that I can participate and improve my knowledge.

#### Acceptance Criteria

1. WHEN the feed is requested, THE Feed_Service SHALL query the DuckDuckGo Instant Answer API for upcoming agri events relevant to the farmer's crop and region.
2. THE Feed_Service SHALL include event name, date, location, and a registration or info URL in each event entry.
3. THE Feed_Service SHALL return at most 5 event entries per feed request.
4. THE Feed_Service SHALL filter out events with a date in the past relative to the feed request timestamp.

---

### Requirement 15: Feed API Endpoint

**User Story:** As a frontend developer, I want a single `/feed` endpoint that returns all feed sections in one call, so that the UI can render the full newspaper in one request.

#### Acceptance Criteria

1. THE Feed_Service SHALL expose a `GET /feed` HTTP endpoint that requires a valid authentication token.
2. WHEN a valid request is received and no Daily_Cache entry exists, THE Feed_Service SHALL return a JSON response containing all feed sections within 15 seconds.
3. WHEN a valid request is received and a Daily_Cache entry exists, THE Feed_Service SHALL return the cached response within 500ms.
4. THE Feed_Service SHALL fetch all external data sources concurrently to minimize total response time on cache-miss requests.
5. IF any individual data source fails, THEN THE Feed_Service SHALL include that section with an unavailability flag rather than failing the entire request.
6. THE Feed_Service SHALL return HTTP 401 when the authentication token is missing or invalid.
7. THE Feed_Service SHALL return HTTP 403 with a `no_crops` error code when the authenticated farmer has no registered crops.
8. THE Feed_Service SHALL return HTTP 200 with a structured JSON body on success, conforming to the Feed response schema.

---

### Requirement 16: Feed Response Schema

**User Story:** As a frontend developer, I want the feed response to follow a consistent schema, so that the UI can reliably parse and render each section.

#### Acceptance Criteria

1. THE Feed_Service SHALL return a JSON object with a top-level `sections` array where each element has a `type`, `crop`, and `data` field.
2. THE Feed_Service SHALL include a top-level `meta` object containing `farmer_id`, `generated_at` (ISO 8601 timestamp), `crops`, `field_count`, and `cached` (boolean).
3. THE Feed_Service SHALL include a top-level `alerts` array at the root level (not nested per crop) for easy surfacing in the UI.
4. FOR ALL valid feed requests, serializing the response to JSON and deserializing it SHALL produce an equivalent object (round-trip property).

---

### Requirement 17: Frontend Feed Page — Full Newspaper Layout

**User Story:** As a farmer, I want the feed to fill the entire page in a rich newspaper layout, so that I can scan all my information at a glance without scrolling through a single column.

#### Acceptance Criteria

1. WHEN a Farmer completes login and has at least one registered crop, THE Frontend SHALL redirect the farmer to the `/feed` page as the default landing page.
2. THE Feed_Page SHALL use a multi-column newspaper grid that fills the full available viewport width, with no unused whitespace on either side.
3. THE Feed_Page SHALL include a hero section spanning the full width at the top of the page for the most critical alert or top news headline.
4. THE Feed_Page SHALL include at least one sidebar column (minimum 20% viewport width) dedicated to mandi prices and weather at all times.
5. THE Feed_Page SHALL arrange remaining sections (innovations, demand, news, schemes, RAG insights, success stories, irrigation advisories, agri events) in a multi-column grid of at least 2 columns below the hero section.
6. THE Feed_Page SHALL display a loading skeleton that mirrors the newspaper grid structure while the feed data is being fetched.
7. WHEN feed data is received, THE Feed_Page SHALL render each section in its designated newspaper grid position.
8. WHEN a section has an unavailability flag, THE Feed_Page SHALL display a graceful fallback message for that section rather than collapsing the grid cell.
9. THE Feed_Page SHALL display the Alerts section at the top of the page above all other sections when at least one alert is present.
10. WHEN the farmer has no registered crops, THE Feed_Page SHALL redirect to the field registration page with an explanatory message rather than rendering the newspaper layout.
