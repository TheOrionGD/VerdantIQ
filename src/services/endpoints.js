/**
 * EcoSphere (VerdantIQ) System REST API Endpoint Constants
 * Maps client REST calls directly to live microservices:
 * - Spring Boot Core REST Microservices (Port 8080)
 * - FastAPI Machine Learning & OR-Tools Service (Port 8000)
 * - MinIO / S3 Object Storage Service
 */

export const API_BASE_URLS = {
  SPRING_BOOT: import.meta.env.VITE_SPRING_BOOT_API_URL || 'http://localhost:8080/api/v1',
  FAST_API_ML: import.meta.env.VITE_FASTAPI_ML_URL || 'http://localhost:8000/api/v1',
  MINIO_S3: import.meta.env.VITE_S3_STORAGE_URL || 'http://localhost:9000/ecosphere-buckets',
};

export const ENDPOINTS = {
  // 1. Authentication & User Profile Service (Spring Boot)
  AUTH: {
    LOGIN: `${API_BASE_URLS.SPRING_BOOT}/auth/login`,
    REGISTER: `${API_BASE_URLS.SPRING_BOOT}/auth/register`,
    GET_PROFILE: `${API_BASE_URLS.SPRING_BOOT}/users/me`,
    UPDATE_PROFILE: `${API_BASE_URLS.SPRING_BOOT}/users/me`,
    SUBMIT_ONBOARDING_BASELINE: `${API_BASE_URLS.SPRING_BOOT}/onboarding`,
  },

  // 2. Daily Activity Tracking & MongoDB GeoSpatial Location Service (Spring Boot)
  TRACKER: {
    LOG_ACTIVITY: `${API_BASE_URLS.SPRING_BOOT}/tracker`,
    GET_ACTIVITY_HISTORY: `${API_BASE_URLS.SPRING_BOOT}/tracker`,
    GET_TREES: `${API_BASE_URLS.SPRING_BOOT}/tracker/trees`,
    UPLOAD_BILL_OCR: `${API_BASE_URLS.SPRING_BOOT}/tracker/upload-bill`,
  },

  // 3. Behavioral Predictions & Explainable AI (FastAPI Microservice)
  PREDICTIONS: {
    GET_XGBOOST_FORECASTS: `${API_BASE_URLS.FAST_API_ML}/ml/forecasts`,
    GET_EXPLAINABLE_REASONING: `${API_BASE_URLS.FAST_API_ML}/ml/explain`,
    TRIGGER_RETRAINING: `${API_BASE_URLS.FAST_API_ML}/ml/retrain`,
    GET_ML_TELEMETRY: `${API_BASE_URLS.FAST_API_ML}/ml/telemetry`,
  },

  // 4. Household Digital Twin Simulation Lab (FastAPI)
  DIGITAL_TWIN: {
    RUN_WEATHER_SIMULATION: `${API_BASE_URLS.FAST_API_ML}/twin/simulate`,
  },

  // 5. Cross-Domain Optimization Engine (Google OR-Tools MILP Solver - FastAPI)
  OPTIMIZER: {
    SOLVE_MILP_OR_TOOLS: `${API_BASE_URLS.FAST_API_ML}/optimizer/solve`,
  },

  // 6. Eco Challenges & Verification Desk (Spring Boot)
  CHALLENGES: {
    GET_ACTIVE_CHALLENGES: `${API_BASE_URLS.SPRING_BOOT}/community/challenges`,
    JOIN_CHALLENGE: `${API_BASE_URLS.SPRING_BOOT}/challenges/join`,
    SUBMIT_EVIDENCE: `${API_BASE_URLS.SPRING_BOOT}/community/verifications`,
    UPLOAD_EVIDENCE: `${API_BASE_URLS.SPRING_BOOT}/community/verifications/upload`,
    VALIDATE_LOCATION_QR: `${API_BASE_URLS.SPRING_BOOT}/challenges/qr-validate`,
  },

  // 7. Groq AI Environmental Decision Assistant (FastAPI)
  GROQ_AI: {
    CHAT_ASSISTANT: `${API_BASE_URLS.FAST_API_ML}/assistant/chat`,
  },

  // 8. Community & Institutional Portal (Spring Boot)
  COMMUNITY: {
    GET_CAMPUS_METRICS: `${API_BASE_URLS.SPRING_BOOT}/community/metrics`,
    GET_LEADERBOARD: `${API_BASE_URLS.SPRING_BOOT}/community/leaderboard`,
    SIGN_GREEN_PLEDGE: `${API_BASE_URLS.SPRING_BOOT}/community/pledge`,
  },

  // 9. Institution Admin Auditing Desk (Spring Boot)
  ADMIN_INSTITUTION: {
    GET_AUDIT_QUEUE: `${API_BASE_URLS.SPRING_BOOT}/admin/verifications`,
    AUDIT_SUBMISSION: `${API_BASE_URLS.SPRING_BOOT}/admin/institution/audit`,
    REVIEW_VERIFICATION: (id) => `${API_BASE_URLS.SPRING_BOOT}/admin/verifications/${id}/review`,
  },

  // 10. System Admin Telemetry & Emission Factors Matrix (Spring Boot)
  ADMIN_SYSTEM: {
    GET_TELEMETRY_STATS: `${API_BASE_URLS.SPRING_BOOT}/admin/telemetry`,
    GET_EMISSION_FACTORS: `${API_BASE_URLS.SPRING_BOOT}/admin/system/emission-factors`,
    UPDATE_EMISSION_FACTORS: `${API_BASE_URLS.SPRING_BOOT}/admin/system/emission-factors`,
    GET_INSTITUTION_STATS: `${API_BASE_URLS.SPRING_BOOT}/admin/institution/stats`,
  },

  // 11. Real-time Notifications & SSE Stream (Spring Boot)
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: `${API_BASE_URLS.SPRING_BOOT}/notifications`,
    MARK_READ: (id) => `${API_BASE_URLS.SPRING_BOOT}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URLS.SPRING_BOOT}/notifications/read-all`,
    STREAM_SSE: `${API_BASE_URLS.SPRING_BOOT}/notifications/stream`,
    CREATE_NOTIFICATION: `${API_BASE_URLS.SPRING_BOOT}/notifications`,
  },

  // 12. Reports & Statement Service (Spring Boot)
  REPORTS: {
    GENERATE_PDF_STATEMENT: `${API_BASE_URLS.SPRING_BOOT}/reports/monthly-pdf`,
  },
};
