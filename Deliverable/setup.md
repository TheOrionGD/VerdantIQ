# EcoSphere (VerdantIQ) — Phased System Build Prompts

Status snapshot (per your update):
- ✅ Phase 0: Repo Audit — complete
- ✅ Phase 1: Auth & User Management (Spring Boot) — complete
- ✅ Phase 2: Database Schema & Geospatial Setup (MongoDB) — complete
- ✅ Phase 3: Core Activity, Onboarding & Community Services (Spring Boot) — complete
- ✅ Phase 4: File Management (MinIO / S3 + OCR) — complete
- ✅ Phase 5: GIS Layer (Geospatial Verification & Mapping) — complete
- ✅ Phase 6: ML Forecasting & Explainability (FastAPI) — complete
- ✅ Phase 7: Optimization Engine (Google OR-Tools MILP) — complete
- ✅ Phase 8: Generative AI Layer (Groq LLM Grounded Assistant) — complete
- ✅ Phase 9: Notifications & Real-Time SSE Stream — complete
- ✅ Phase 10: Data Visualization Support & Telemetry — complete
- ✅ Phase 11: Testing & Deployment — complete (All 11 Phases Completed 🎉)

Each phase below is a standalone, copy-pasteable prompt for an AI coding tool (Claude Code, Cursor, etc.). Feed them **in order** — later phases assume earlier ones exist. Each prompt tells the tool to check what's already there before generating, since three of these layers are "initialized" but not built out.


---

## Phase 0 — Repo Audit (run this first, always)

```text
Before writing any code, inspect the current repository structure for VerdantIQ/EcoSphere.
List what exists in ./backend (Spring Boot), ./ml-service (FastAPI), and any database
connection/config files already present. Report:
1. Which files/classes/modules already exist vs. are stubs vs. are missing entirely.
2. Any dependency mismatches against SPRINGBOOT_DEPENDENCIES.txt and
   PYTHON_ML_SERVICE_GUIDE.txt.
3. Whether MongoDB URI, JWT secret, and Groq API key env vars are actually wired up
   or just placeholders.
Do not generate new code yet — output a short status report and a proposed build order.
```

---

## Phase 1 — Auth & User Management (Spring Boot)

```text
Implement authentication and RBAC for the VerdantIQ Spring Boot backend (Java 21,
Spring Boot 3.2, MongoDB, JWT via jjwt 0.12.5 — see SPRINGBOOT_DEPENDENCIES.txt for
exact dependency versions).

Build:
1. User document model (@Document) with fields: id, email, passwordHash, role
   (STANDARD_USER, INSTITUTION_ADMIN, SYSTEM_ADMIN), institutionId (nullable),
   createdAt.
2. POST /api/v1/auth/register, POST /api/v1/auth/login — issue JWT access +
   refresh tokens. Passwords hashed with BCrypt.
3. Spring Security filter chain validating JWT on every request, populating
   SecurityContext with role-based authorities.
4. Role-gated endpoint examples: @PreAuthorize annotations restricting
   /api/v1/admin/** to INSTITUTION_ADMIN/SYSTEM_ADMIN.
5. GET/PUT /api/v1/users/me for profile retrieval/update.
6. application.yml reading MONGODB_URI, JWT_SECRET, JWT_EXPIRATION_MS from
   environment (never hardcoded).
7. Swagger UI (springdoc-openapi) exposing all endpoints at /swagger-ui.html,
   with JWT bearer auth configured in the OpenAPI security scheme.

Write JUnit 5 + Mockito tests for registration, login, and one 403-on-wrong-role case.
Do not claim endpoints are "production-ready" in comments — mark any shortcuts
(e.g. no rate limiting yet) with a TODO.
```

---

## Phase 2 — Database Schema & Geospatial Setup (MongoDB)

```text
Set up MongoDB collections and indexes for VerdantIQ using Spring Data MongoDB.

Build:
1. Document models: User, HouseholdTwin, ActivityLog, Challenge, Verification,
   Institution — matching the fields implied by the UI nodes in
   UI_Generation_Prompts.md (e.g. ActivityLog needs a GeoJSON Point field for
   tree-planting coordinates; Verification needs photo URL, timestamp, geotag).
2. 2dsphere index on ActivityLog.location for geospatial queries.
3. Repository interfaces (MongoRepository) for each collection plus one custom
   aggregation query per collection that will actually be used later
   (e.g. sum/avg CO2 by institutionId for the Community node).
4. A seed/migration script (Java, run-once CommandLineRunner or a separate
   script) that inserts 1 sample institution, 3 sample users, and a handful of
   activity logs so the frontend has real data to render against instead of
   mocks.
5. Document the exact indexes created and why, in a short SCHEMA.md.

Do not invent fields the frontend doesn't actually use — cross-check field names
against endpoints.js / apiService.js in the frontend repo if available.
```

---

## Phase 3 — Core Activity, Onboarding & Community Services (Spring Boot)

```text
Implement the remaining Spring Boot REST services for VerdantIQ.

Build:
1. POST /api/v1/onboarding — accepts household size, diet type, utility bill
   averages, transit mode; computes a baseline CO2 score using a documented,
   explicit formula (state the formula and its source/assumptions in code
   comments — do not fabricate a scientifically-precise coefficient set,
   flag it clearly as an approximation to be tuned later).
2. CRUD for /api/v1/tracker (activity logs: transport, energy, water, waste,
   trees) with GeoJSON handling for tree locations.
3. /api/v1/community and /api/v1/admin/institution — MongoDB aggregation
   pipelines ($group, $sum, $avg) for institution-level leaderboards and
   totals.
4. /api/v1/reports — Apache PDFBox service generating a monthly statement PDF
   from a user's activity logs (real data pulled from MongoDB, not a static
   template with fake numbers).
5. Pending-submission audit endpoints for admin approval/rejection of
   challenge evidence.

All endpoints must require valid JWT (from Phase 1) and respect role checks
where relevant (e.g. only INSTITUTION_ADMIN can approve/reject).
```

---

## Phase 4 — File Management (MinIO / S3 + OCR)

```text
Add file storage and OCR to VerdantIQ.

Build:
1. MinIO (S3-compatible) client configuration in Spring Boot with buckets:
   utility-bills, challenge-evidence, pdf-statements. Use presigned URLs for
   uploads/downloads — do not proxy large files through the app server.
2. POST /api/v1/tracker/upload-bill — accepts an image/PDF utility bill,
   stores it in MinIO, and runs OCR (Tesseract via a Java wrapper, or delegate
   to the Python service if that's a cleaner fit — pick one and justify it)
   to extract a numeric usage value for pre-filling the tracker form.
2. POST /api/v1/community/verifications/upload — challenge evidence photo
   upload with EXIF/geotag extraction, stored alongside the Verification
   document from Phase 2.
3. Signed-URL expiry, content-type validation, and file-size limits — state
   the limits you chose and why.

Confirm OCR accuracy expectations honestly in a README note (e.g. "works well
on clean digital bills, degrades on low-res photos of printed bills") rather
than overstating reliability.
```

---

## Phase 5 — GIS Layer (Geospatial Verification & Mapping)

```text
Build the GIS features implied by the Institution Admin node (geotag map
matches) and the Tracker node (tree coordinates) in UI_Generation_Prompts.md.

Build:
1. Backend: $geoNear / $geoWithin MongoDB aggregation endpoints to validate
   that a submitted challenge photo's geotag falls within an expected radius
   of the institution's campus boundary (store campus boundary as a GeoJSON
   Polygon on the Institution document).
2. Backend: /api/v1/tracker/trees — endpoint returning all tree-planting
   points as GeoJSON FeatureCollection for map rendering.
3. Frontend integration point: document the exact API contract (request/
   response JSON shape) the React Digital Twin / Admin nodes need to render
   a map — do not build a new frontend map component unless asked;
   just make sure the API output is map-library-ready (Leaflet/Mapbox GeoJSON
   format).
4. Flag clearly if precise campus-boundary polygons aren't available yet and
   a bounding-circle approximation is used instead.
```

---

## Phase 6 — ML Forecasting & Explainability (FastAPI)

```text
Implement the ML endpoints in ./ml-service (Python 3.11, FastAPI — see
PYTHON_ML_SERVICE_GUIDE.txt for exact dependency versions).

Build:
1. POST /api/v1/ml/forecasts — trains/loads an XGBoost regression model per
   user (or per resource type) on historical ActivityLog data pulled via
   PyMongo, returns 7-day and 30-day forecasts. If there's insufficient
   history for a given user, return a clearly-labeled fallback (e.g.
   population-average trend) instead of a fabricated confident forecast.
2. POST /api/v1/ml/explain — scikit-learn anomaly detection (e.g.
   IsolationForest) on recent logs, flags spikes, and returns a structured
   JSON payload (metric, deviation %, likely cause category) — this is the
   payload the Groq layer (Phase 7) will turn into natural language, so keep
   it structured, not prose.
3. POST /api/v1/ml/retrain — scheduled/triggerable retraining job, logs
   training error metrics (RMSE/MAE) to MongoDB for the System Admin
   Telemetry node to display.
4. Pydantic models for all request/response bodies.
5. Honest model-quality notes in the response or logs when training data is
   thin (<30 data points) — don't present low-confidence predictions as
   precise.
```

---

## Phase 7 — Optimization Engine (Google OR-Tools)

```text
Implement the MILP constraint solver in ./ml-service.

Build:
1. POST /api/v1/optimizer/solve — accepts monthly budget cap, minimum carbon
   offset target, and user priority weights (carbon vs. cost).
2. Formulate as a Mixed-Integer Linear Program using OR-Tools CP-SAT or the
   MILP solver (pick one, justify the choice — CP-SAT for discrete
   action selection is usually the better fit here):
   - Decision variables: binary "adopt this action" per candidate action
     (from a defined action catalog: LED swap, transit switch, rainwater
     tank, solar panel, etc. — each with a real or reasonably-estimated
     cost, CO2 impact, and time-to-implement).
   - Objective: weighted minimize(CO2 remaining) + minimize(cost), per the
     user's priority weights.
   - Constraints: total cost <= budget, total CO2 offset >= target.
3. Output: ordered action roadmap (the format the Optimization Engine node
   in the frontend expects — an array of {step, action, cost, co2_impact,
   month}).
4. Unit tests covering: infeasible input (budget too low for any action),
   and a normal feasible case.
5. Document the action-catalog cost/impact numbers as "starting estimates,
   should be replaced with sourced data" if you don't have real figures —
   do not present placeholder numbers as verified.
```

---

## Phase 8 — Generative AI Layer (Groq)

```text
Wire the Groq LLM into VerdantIQ as a real reasoning layer, not just an API
key placeholder.

Build:
1. Backend or ml-service endpoint (pick one, keep it consistent with where
   Phase 6's /explain output lives) — POST /api/v1/assistant/chat.
2. System prompt template that injects: user's recent activity summary,
   the structured anomaly-explanation payload from Phase 6, and the
   optimizer's current roadmap from Phase 7 — so the LLM is grounding its
   answer in real data, not hallucinating numbers.
3. Response format: structured JSON with a markdown "message" field plus
   optional "chips" (quick action suggestions) and "chart_spec" (for
   micro-charts) — matching what the Groq Omnibar and Assistant node in
   UI_Generation_Prompts.md expect to render.
4. Basic conversation history handling (last N turns) — no long-term memory
   store unless explicitly requested.
5. Guardrail: if the LLM is asked something outside the injected data context
   (e.g. medical advice, unrelated topics), have the system prompt instruct
   it to redirect to sustainability topics rather than improvising.
```

---

## Phase 9 — Notifications

```text
Add a notification service to VerdantIQ.

Build:
1. Notification document model (userId, type, message, read, createdAt) in
   MongoDB.
2. Trigger points: anomaly detected (Phase 6), challenge approved/rejected
   (Phase 3 admin actions), optimizer roadmap milestone due.
3. GET /api/v1/notifications, PATCH /api/v1/notifications/{id}/read.
4. Delivery: start with in-app (polled or WebSocket/SSE — pick one, WebSocket
   is a better fit if the frontend is already doing live canvas updates).
   Explicitly scope out email/SMS/push unless requested — don't silently add
   a third-party dependency for that without flagging it.
```

---

## Phase 10 — Data Visualization Support

```text
Ensure backend/ml-service responses are visualization-ready for the frontend
graphs already built in the Predictions & Analytics and Admin Console nodes.

Build:
1. Confirm /api/v1/ml/forecasts and /api/v1/admin/institution/stats return
   time-series data pre-shaped for chart libraries (array of
   {date, actual, predicted} objects), not raw DB documents.
2. Add /api/v1/admin/telemetry — MongoDB latency, ML training error history
   (from Phase 6 logs), request throughput — for the System Admin Telemetry
   node.
3. Add /api/v1/community/leaderboard — pre-sorted, pre-aggregated standings
   (no client-side sorting/aggregation of raw logs).
4. Document every response shape in the Swagger spec with realistic examples,
   not empty placeholders.
```

---

## Phase 11 — Testing & Deployment

```text
Set up automated testing and deployment for VerdantIQ.

Build:
1. Backend: JUnit 5 + Mockito unit tests for each service from Phases 1–5;
   one integration test hitting a real (test) MongoDB via Testcontainers.
2. ML service: pytest coverage for /forecasts, /explain, /solve — including
   the "insufficient data" and "infeasible constraints" edge cases flagged
   earlier.
3. GitHub Actions CI: run backend + ml-service test suites on every PR.
4. Deployment config for Render/Railway (Spring Boot + FastAPI as two
   services) and MongoDB Atlas connection string wiring via env vars — no
   secrets committed.
5. A DEPLOYMENT.md documenting the actual steps taken, including anything
   that had to be manually configured in the Atlas/Render dashboards (things
   an AI tool can't do for you).
```

---

## How to use this

Run Phase 0 first in your coding tool. Then go phase by phase — each prompt
assumes the previous ones' outputs exist. Don't skip Phase 0's audit step even
though the backend/ML/DB layers are "initialized" — initialized often means
scaffolded, not functional, and you want the AI tool building on what's
actually there rather than guessing.