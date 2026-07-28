/**
 * EcoSphere (VerdantIQ) Live Data API Service Layer
 * Drives real statistical data from:
 *   - Spring Boot Core Backend (Port 8080)
 *   - FastAPI ML & OR-Tools Optimization Service (Port 8000)
 */

import { ENDPOINTS } from './endpoints';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ecosphere_jwt') || sessionStorage.getItem('ecosphere_jwt');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.detail || errorText || errorMessage;
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const apiService = {
  // -------------------------------------------------------------
  // 1. AUTHENTICATION & USER PROFILE SERVICE
  // -------------------------------------------------------------
  auth: {
    login: async (credentials) => {
      const res = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await handleResponse(res);
      if (data?.accessToken) {
        localStorage.setItem('ecosphere_jwt', data.accessToken);
      }
      return data;
    },

    register: async (userPayload) => {
      const res = await fetch(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      const data = await handleResponse(res);
      if (data?.accessToken) {
        localStorage.setItem('ecosphere_jwt', data.accessToken);
      }
      return data;
    },

    getProfile: async () => {
      const res = await fetch(ENDPOINTS.AUTH.GET_PROFILE, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updateProfile: async (updatePayload) => {
      const res = await fetch(ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updatePayload),
      });
      return handleResponse(res);
    },

    submitOnboardingBaseline: async (questionnaire) => {
      const res = await fetch(ENDPOINTS.AUTH.SUBMIT_ONBOARDING_BASELINE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(questionnaire),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 2. DAILY ACTIVITY TRACKER & GEOSPATIAL SERVICE
  // -------------------------------------------------------------
  tracker: {
    logActivity: async (logPayload) => {
      const res = await fetch(ENDPOINTS.TRACKER.LOG_ACTIVITY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(logPayload),
      });
      return handleResponse(res);
    },

    getActivityLogs: async () => {
      const res = await fetch(ENDPOINTS.TRACKER.GET_ACTIVITY_HISTORY, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getTreeLocations: async () => {
      const res = await fetch(ENDPOINTS.TRACKER.GET_TREES, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    uploadBillOcr: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(ENDPOINTS.TRACKER.UPLOAD_BILL_OCR, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 3. BEHAVIORAL PREDICTIONS & FASTAPI ML SERVICE
  // -------------------------------------------------------------
  predictions: {
    getForecasts: async (userId = 'usr-demo', horizonDays = 30) => {
      const res = await fetch(`${ENDPOINTS.PREDICTIONS.GET_XGBOOST_FORECASTS}?user_id=${encodeURIComponent(userId)}&horizon_days=${horizonDays}`);
      return handleResponse(res);
    },

    getExplainableAnomalies: async (userId = 'usr-demo') => {
      const res = await fetch(`${ENDPOINTS.PREDICTIONS.GET_EXPLAINABLE_REASONING}?user_id=${encodeURIComponent(userId)}`);
      return handleResponse(res);
    },

    triggerModelRetraining: async () => {
      const res = await fetch(ENDPOINTS.PREDICTIONS.TRIGGER_RETRAINING, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getMlTelemetry: async () => {
      const res = await fetch(ENDPOINTS.PREDICTIONS.GET_ML_TELEMETRY);
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 4. HOUSEHOLD DIGITAL TWIN SIMULATION SERVICE
  // -------------------------------------------------------------
  digitalTwin: {
    runWeatherSimulation: async (upgradeConfig) => {
      const res = await fetch(ENDPOINTS.DIGITAL_TWIN.RUN_WEATHER_SIMULATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(upgradeConfig),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 5. OPTIMIZATION ENGINE (GOOGLE OR-TOOLS MILP SOLVER)
  // -------------------------------------------------------------
  optimizer: {
    solveMilp: async (constraints) => {
      const res = await fetch(ENDPOINTS.OPTIMIZER.SOLVE_MILP_OR_TOOLS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(constraints),
      });
      return handleResponse(res);
    },
  },

  // 6. ECO CHALLENGES & VERIFICATION SERVICE
  // -------------------------------------------------------------
  challenges: {
    getActiveChallenges: async (institutionId) => {
      const url = institutionId
        ? `${ENDPOINTS.CHALLENGES.GET_ACTIVE_CHALLENGES}?institutionId=${encodeURIComponent(institutionId)}`
        : ENDPOINTS.CHALLENGES.GET_ACTIVE_CHALLENGES;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    joinChallenge: async (challengeId) => {
      const res = await fetch(ENDPOINTS.CHALLENGES.JOIN_CHALLENGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ challengeId }),
      });
      return handleResponse(res);
    },

    submitEvidence: async (evidencePayload) => {
      const res = await fetch(ENDPOINTS.CHALLENGES.SUBMIT_EVIDENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(evidencePayload),
      });
      return handleResponse(res);
    },

    uploadVerificationPhoto: async (uploadMetadata) => {
      const res = await fetch(ENDPOINTS.CHALLENGES.UPLOAD_EVIDENCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(uploadMetadata),
      });
      return handleResponse(res);
    },

    validateLocationQr: async (qrCodeData) => {
      const res = await fetch(ENDPOINTS.CHALLENGES.VALIDATE_LOCATION_QR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ qrCodeData }),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 7. GROQ AI DECISION ASSISTANT SERVICE
  // -------------------------------------------------------------
  groqAi: {
    chat: async (userQuery, userId = 'usr-demo', conversationHistory = []) => {
      const res = await fetch(ENDPOINTS.GROQ_AI.CHAT_ASSISTANT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_query: userQuery,
          user_id: userId,
          conversation_history: conversationHistory,
        }),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 8. COMMUNITY & INSTITUTIONAL PORTAL SERVICE
  // -------------------------------------------------------------
  community: {
    getCampusMetrics: async () => {
      const res = await fetch(ENDPOINTS.COMMUNITY.GET_CAMPUS_METRICS, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getLeaderboard: async () => {
      const res = await fetch(ENDPOINTS.COMMUNITY.GET_LEADERBOARD, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    signGreenPledge: async (pledgeText) => {
      const res = await fetch(ENDPOINTS.COMMUNITY.SIGN_GREEN_PLEDGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ pledgeText }),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 9. INSTITUTION ADMIN AUDITING DESK SERVICE
  // -------------------------------------------------------------
  adminInstitution: {
    getAuditQueue: async (institutionId) => {
      const url = institutionId
        ? `${ENDPOINTS.ADMIN_INSTITUTION.GET_AUDIT_QUEUE}?institutionId=${encodeURIComponent(institutionId)}`
        : ENDPOINTS.ADMIN_INSTITUTION.GET_AUDIT_QUEUE;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    auditSubmission: async (submissionId, action = 'APPROVE') => {
      const res = await fetch(ENDPOINTS.ADMIN_INSTITUTION.AUDIT_SUBMISSION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ submissionId, action }),
      });
      return handleResponse(res);
    },

    reviewVerification: async (id, status = 'APPROVED') => {
      const res = await fetch(ENDPOINTS.ADMIN_INSTITUTION.REVIEW_VERIFICATION(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 10. SYSTEM ADMIN TELEMETRY & EMISSION FACTORS SERVICE
  // -------------------------------------------------------------
  adminSystem: {
    getTelemetry: async () => {
      const res = await fetch(ENDPOINTS.ADMIN_SYSTEM.GET_TELEMETRY_STATS, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getEmissionFactors: async () => {
      const res = await fetch(ENDPOINTS.ADMIN_SYSTEM.GET_EMISSION_FACTORS, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updateEmissionFactors: async (factors) => {
      const res = await fetch(ENDPOINTS.ADMIN_SYSTEM.UPDATE_EMISSION_FACTORS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(factors),
      });
      return handleResponse(res);
    },

    getTimeSeriesChartData: async (resourceType = 'energy') => {
      const res = await fetch(`${ENDPOINTS.ADMIN_SYSTEM.GET_INSTITUTION_STATS}?resourceType=${encodeURIComponent(resourceType)}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // -------------------------------------------------------------
  // 11. REAL-TIME NOTIFICATIONS & SSE STREAM SERVICE
  // -------------------------------------------------------------
  notifications: {
    getUserNotifications: async () => {
      const res = await fetch(ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    markAsRead: async (id) => {
      const res = await fetch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    markAllAsRead: async () => {
      const res = await fetch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    subscribeStream: (onNotification, onError) => {
      const token = localStorage.getItem('ecosphere_jwt') || sessionStorage.getItem('ecosphere_jwt');
      const url = token ? `${ENDPOINTS.NOTIFICATIONS.STREAM_SSE}?token=${token}` : ENDPOINTS.NOTIFICATIONS.STREAM_SSE;
      const eventSource = new EventSource(url);

      eventSource.addEventListener('NOTIFICATION', (event) => {
        try {
          const notificationData = JSON.parse(event.data);
          if (onNotification) onNotification(notificationData);
        } catch (e) {
          console.error('Error parsing SSE notification payload:', e);
        }
      });

      eventSource.onerror = (err) => {
        if (onError) onError(err);
      };

      return () => eventSource.close();
    },
  },

  // -------------------------------------------------------------
  // 12. REPORTS & APACHE PDFBOX SERVICE
  // -------------------------------------------------------------
  reports: {
    generatePdfStatement: async () => {
      const res = await fetch(ENDPOINTS.REPORTS.GENERATE_PDF_STATEMENT, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
