/**
 * EcoSphere (VerdantIQ) System REST API Endpoint Constants
 * Maps client REST calls to:
 * - Spring Boot Core REST Microservices (Port 8080)
 * - FastAPI Machine Learning & OR-Tools Service (Port 8000)
 * - Groq / OpenAI GenAI Decision Engine (API Gateway)
 * - MinIO / S3 Object Storage Service
 */

export const API_BASE_URLS = {
  SPRING_BOOT: import.meta.env.VITE_SPRING_BOOT_API_URL || 'http://localhost:8080/api/v1',
  FAST_API_ML: import.meta.env.VITE_FASTAPI_ML_URL || 'http://localhost:8000/api/v1',
  GROQ_AI: import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1',
  MINIO_S3: import.meta.env.VITE_S3_STORAGE_URL || 'http://localhost:9000/ecosphere-buckets',
};

export const ENDPOINTS = {
  // 1. Authentication & Profiling Service
  AUTH: {
    LOGIN: `${API_BASE_URLS.SPRING_BOOT}/auth/login`,
    REGISTER: `${API_BASE_URLS.SPRING_BOOT}/auth/register`,
    GET_PROFILE: `${API_BASE_URLS.SPRING_BOOT}/users/me`,
    SUBMIT_ONBOARDING_BASELINE: `${API_BASE_URLS.SPRING_BOOT}/onboarding/baseline`,
  },

  // 2. Daily Activity Tracking & PostGIS Location Service
  TRACKER: {
    LOG_ACTIVITY: `${API_BASE_URLS.SPRING_BOOT}/tracker/logs`,
    GET_ACTIVITY_HISTORY: `${API_BASE_URLS.SPRING_BOOT}/tracker/logs`,
    UPLOAD_BILL_OCR: `${API_BASE_URLS.SPRING_BOOT}/tracker/ocr/bill`,
    GEOTAG_TREE: `${API_BASE_URLS.SPRING_BOOT}/tracker/tree/geotag`,
  },

  // 3. Behavioral Predictions & Explainable AI (FastAPI Microservice)
  PREDICTIONS: {
    GET_XGBOOST_FORECASTS: `${API_BASE_URLS.FAST_API_ML}/ml/forecasts`,
    GET_EXPLAINABLE_REASONING: `${API_BASE_URLS.FAST_API_ML}/ml/explain`,
    TRIGGER_RETRAINING: `${API_BASE_URLS.FAST_API_ML}/ml/retrain`,
  },

  // 4. Household Digital Twin Simulation Lab
  DIGITAL_TWIN: {
    GET_TWIN_STATE: `${API_BASE_URLS.SPRING_BOOT}/twin/state`,
    TOGGLE_HARDWARE_UPGRADE: `${API_BASE_URLS.SPRING_BOOT}/twin/upgrade`,
    RUN_WEATHER_SIMULATION: `${API_BASE_URLS.FAST_API_ML}/twin/simulate`,
  },

  // 5. Cross-Domain Optimization Engine (Google OR-Tools MILP Solver)
  OPTIMIZER: {
    SOLVE_MILP_OR_TOOLS: `${API_BASE_URLS.FAST_API_ML}/optimizer/solve`,
    APPLY_OPTIMIZED_GOALS: `${API_BASE_URLS.SPRING_BOOT}/optimizer/apply-plan`,
  },

  // 6. Eco Challenges & Verification Desk
  CHALLENGES: {
    GET_ACTIVE_CHALLENGES: `${API_BASE_URLS.SPRING_BOOT}/challenges`,
    JOIN_CHALLENGE: `${API_BASE_URLS.SPRING_BOOT}/challenges/join`,
    SUBMIT_EVIDENCE_EXIF: `${API_BASE_URLS.SPRING_BOOT}/challenges/verify-evidence`,
    VALIDATE_LOCATION_QR: `${API_BASE_URLS.SPRING_BOOT}/challenges/qr-validate`,
  },

  // 7. Groq AI Environmental Decision Assistant
  GROQ_AI: {
    CHAT_COMPLETION: `${API_BASE_URLS.GROQ_AI}/chat/completions`,
    EXPLAIN_ANOMALY: `${API_BASE_URLS.SPRING_BOOT}/ai/explain-anomaly`,
  },

  // 8. Community & Institutional Portal
  COMMUNITY: {
    GET_CAMPUS_METRICS: `${API_BASE_URLS.SPRING_BOOT}/community/metrics`,
    GET_LEADERBOARD: `${API_BASE_URLS.SPRING_BOOT}/community/leaderboard`,
    SIGN_GREEN_PLEDGE: `${API_BASE_URLS.SPRING_BOOT}/community/pledge`,
  },

  // 9. Institution Admin Auditing Desk
  ADMIN_INSTITUTION: {
    GET_AUDIT_QUEUE: `${API_BASE_URLS.SPRING_BOOT}/admin/institution/queue`,
    AUDIT_SUBMISSION: `${API_BASE_URLS.SPRING_BOOT}/admin/institution/audit`,
    CREATE_CAMPUS_CHALLENGE: `${API_BASE_URLS.SPRING_BOOT}/admin/institution/challenges`,
  },

  // 10. System Admin Telemetry & Emission Factors Matrix
  ADMIN_SYSTEM: {
    GET_TELEMETRY_STATS: `${API_BASE_URLS.SPRING_BOOT}/admin/system/telemetry`,
    GET_EMISSION_FACTORS: `${API_BASE_URLS.SPRING_BOOT}/admin/system/emission-factors`,
    UPDATE_EMISSION_FACTORS: `${API_BASE_URLS.SPRING_BOOT}/admin/system/emission-factors`,
  },

  // 11. Reports & MinIO / S3 Storage Service
  REPORTS: {
    GENERATE_PDF_STATEMENT: `${API_BASE_URLS.SPRING_BOOT}/reports/generate-pdf`,
    DOWNLOAD_STATEMENT_S3: `${API_BASE_URLS.MINIO_S3}/statements`,
  },
};
