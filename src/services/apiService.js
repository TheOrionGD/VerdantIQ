import { ENDPOINTS } from './endpoints';

const USE_REAL_BACKEND = import.meta.env.VITE_USE_REAL_BACKEND === 'true';

// Helper for simulated latency during client mock phase
const simulateLatency = (data, delayMs = 300) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
};

export const apiService = {
  // -------------------------------------------------------------
  // 1. AUTHENTICATION & PROFILING SERVICE
  // -------------------------------------------------------------
  auth: {
    login: async (credentials) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.AUTH.LOGIN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        return res.json();
      }
      return simulateLatency({ token: 'mock-jwt-token-12345', user: { id: 'u-101', name: 'Alex Rivera', role: 'Standard User' } });
    },

    submitOnboardingBaseline: async (questionnaire) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.AUTH.SUBMIT_ONBOARDING_BASELINE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(questionnaire),
        });
        return res.json();
      }
      return simulateLatency({
        status: 'SUCCESS',
        calculatedEcoScore: 72,
        co2BaselineKg: 320,
        regionalAverageKg: 390,
        digitalTwinId: 'dt-88402',
      });
    },
  },

  // -------------------------------------------------------------
  // 2. DAILY ACTIVITY TRACKER & POSTGIS LOCATION SERVICE
  // -------------------------------------------------------------
  tracker: {
    logActivity: async (logPayload) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.TRACKER.LOG_ACTIVITY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logPayload),
        });
        return res.json();
      }
      return simulateLatency({
        logId: Date.now(),
        status: 'PERSISTED_POSTGIS',
        pointsEarned: 35,
        co2SavedKg: 2.8,
        timestamp: new Date().toISOString(),
      });
    },

    uploadBillOcr: async (file) => {
      if (USE_REAL_BACKEND) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(ENDPOINTS.TRACKER.UPLOAD_BILL_OCR, { method: 'POST', body: formData });
        return res.json();
      }
      return simulateLatency({
        ocrParsed: true,
        extractedKwh: 25.4,
        billingPeriod: 'July 2026',
        extractedCost: 42.50,
      });
    },
  },

  // -------------------------------------------------------------
  // 3. BEHAVIORAL PREDICTIONS & FASTAPI ML SERVICE
  // -------------------------------------------------------------
  predictions: {
    getForecasts: async (range = '7D') => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(`${ENDPOINTS.PREDICTIONS.GET_XGBOOST_FORECASTS}?range=${range}`);
        return res.json();
      }
      return simulateLatency({
        model: 'XGBoost v2.1',
        rmse: 0.042,
        forecastData: [
          { day: 'Mon', actual: 18.2, predicted: 19.0 },
          { day: 'Tue', actual: 17.5, predicted: 17.8 },
          { day: 'Wed', actual: 21.4, predicted: 18.5 },
          { day: 'Thu', actual: 16.8, predicted: 17.0 },
          { day: 'Fri', actual: 19.1, predicted: 18.2 },
          { day: 'Sat', actual: 24.5, predicted: 22.0 },
          { day: 'Sun', actual: 22.0, predicted: 21.5 },
        ],
      });
    },

    triggerModelRetraining: async () => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.PREDICTIONS.TRIGGER_RETRAINING, { method: 'POST' });
        return res.json();
      }
      return simulateLatency({
        status: 'RETRAIN_COMPLETED',
        recordsProcessed: 14250,
        newRmse: 0.038,
        redisCacheFlushed: true,
      });
    },
  },

  // -------------------------------------------------------------
  // 4. HOUSEHOLD DIGITAL TWIN SIMULATION SERVICE
  // -------------------------------------------------------------
  digitalTwin: {
    getAvailableUpgrades: async () => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(`${ENDPOINTS.DIGITAL_TWIN.GET_TWIN_STATE}/upgrades`);
        return res.json();
      }
      return simulateLatency([
        { id: 'solar', name: '5kW Rooftop Solar Array', category: 'Roof', cost: 1200, offset: 140, water: 0, payback: 18 },
        { id: 'led', name: 'LED Smart Lighting Kit', category: 'Kitchen', cost: 40, offset: 12, water: 0, payback: 4 },
        { id: 'rain', name: 'Rainwater Harvester Tank', category: 'Garden', cost: 350, offset: 25, water: 450, payback: 12 },
        { id: 'charger', name: 'Level 2 EV Smart Charger', category: 'Garage', cost: 500, offset: 85, water: 0, payback: 14 },
      ]);
    },

    runWeatherSimulation: async (upgradeConfig) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.DIGITAL_TWIN.RUN_WEATHER_SIMULATION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(upgradeConfig),
        });
        return res.json();
      }
      return simulateLatency({
        simulatedSolarYieldKwh: 450,
        estimatedPaybackMonths: 18,
        annualCo2OffsetKg: 167,
      });
    },
  },

  // -------------------------------------------------------------
  // 5. CROSS-DOMAIN OPTIMIZATION ENGINE (OR-TOOLS MILP)
  // -------------------------------------------------------------
  optimizer: {
    solveMilp: async (constraints) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.OPTIMIZER.SOLVE_MILP_OR_TOOLS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(constraints),
        });
        return res.json();
      }
      return simulateLatency({
        solveTimeMs: 18,
        roadmap: [
          { step: 1, action: 'Convert Lighting to Smart LEDs', cost: 40, savingsMonthly: 14, month: 'Month 1' },
          { step: 2, action: 'Switch 2 Weekly Commutes to Electric Bus', cost: 0, savingsMonthly: 35, month: 'Month 2' },
          { step: 3, action: 'Install Rainwater Harvester Barrel', cost: 180, savingsMonthly: 22, month: 'Month 3' },
        ],
      });
    },
  },

  // -------------------------------------------------------------
  // 6. ECO CHALLENGES & VERIFICATION DESK SERVICE
  // -------------------------------------------------------------
  challenges: {
    submitEvidence: async (challengeId, file, exifData) => {
      if (USE_REAL_BACKEND) {
        const formData = new FormData();
        formData.append('challengeId', challengeId);
        formData.append('file', file);
        formData.append('exif', JSON.stringify(exifData));
        const res = await fetch(ENDPOINTS.CHALLENGES.SUBMIT_EVIDENCE_EXIF, { method: 'POST', body: formData });
        return res.json();
      }
      return simulateLatency({
        verified: true,
        exifGeotagMatch: '12.9716° N, 77.5946° E',
        pointsDisbursed: 150,
      });
    },

    validateLocationQr: async (qrCodeData) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.CHALLENGES.VALIDATE_LOCATION_QR, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qrCodeData }),
        });
        return res.json();
      }
      return simulateLatency({
        validStation: true,
        stationName: 'Green Campus Recycling Station #4',
        rewardPoints: 150,
      });
    },
  },

  // -------------------------------------------------------------
  // 7. GROQ AI DECISION ASSISTANT SERVICE
  // -------------------------------------------------------------
  groqAi: {
    chat: async (prompt, systemContext) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.GROQ_AI.CHAT_COMPLETION, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [
              { role: 'system', content: systemContext },
              { role: 'user', content: prompt },
            ],
          }),
        });
        return res.json();
      }
      return simulateLatency({
        choices: [
          {
            message: {
              content: `Groq AI Recommendation: Based on your current 68 Eco-Score, optimizing water heating schedules yields an immediate 8% footprint reduction.`,
            },
          },
        ],
      });
    },
  },

  // -------------------------------------------------------------
  // 8. COMMUNITY & INSTITUTIONAL PORTAL SERVICE
  // -------------------------------------------------------------
  community: {
    getCampusMetrics: async () => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.COMMUNITY.GET_CAMPUS_METRICS);
        return res.json();
      }
      return simulateLatency({
        co2AvoidedKg: 14850,
        treesPlanted: 420,
        waterRecycledGal: 12400,
      });
    },
  },

  // -------------------------------------------------------------
  // 9. INSTITUTION ADMIN AUDITING DESK SERVICE
  // -------------------------------------------------------------
  adminInstitution: {
    getAuditQueue: async () => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.ADMIN_INSTITUTION.GET_AUDIT_QUEUE);
        return res.json();
      }
      return simulateLatency([
        { id: 'q1', user: 'Alex Rivera', challenge: 'Commute Green 5 Days', photo: 'GPS Geotag: 12.97° N, 77.59° E', time: '10 mins ago' },
        { id: 'q2', user: 'Sophia Lin', challenge: 'Plant a Native Sapling', photo: 'GPS Geotag: 12.98° N, 77.61° E', time: '42 mins ago' },
      ]);
    },

    auditSubmission: async (submissionId, approved) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.ADMIN_INSTITUTION.AUDIT_SUBMISSION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId, action: approved ? 'APPROVE' : 'REJECT' }),
        });
        return res.json();
      }
      return simulateLatency({ status: approved ? 'APPROVED' : 'REJECTED', submissionId });
    },
  },

  // -------------------------------------------------------------
  // 10. SYSTEM ADMIN TELEMETRY & EMISSION FACTORS SERVICE
  // -------------------------------------------------------------
  adminSystem: {
    getTelemetry: async () => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.ADMIN_SYSTEM.GET_TELEMETRY_STATS);
        return res.json();
      }
      return simulateLatency({
        redisLatencyMs: 2.4,
        postGisQueryMs: 12,
        xgboostRmse: 0.042,
        uptimePercentage: 99.98,
      });
    },

    updateEmissionFactors: async (factors) => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.ADMIN_SYSTEM.UPDATE_EMISSION_FACTORS, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(factors),
        });
        return res.json();
      }
      return simulateLatency({ status: 'EMISSION_FACTORS_UPDATED', redisFlushed: true });
    },
  },

  // -------------------------------------------------------------
  // 11. REPORTS & APACHE PDFBOX / S3 SERVICE
  // -------------------------------------------------------------
  reports: {
    generatePdfStatement: async (period = 'July 2026') => {
      if (USE_REAL_BACKEND) {
        const res = await fetch(ENDPOINTS.REPORTS.GENERATE_PDF_STATEMENT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ period }),
        });
        return res.json();
      }
      return simulateLatency({
        status: 'GENERATED_PDFBOX',
        downloadUrl: `${ENDPOINTS.REPORTS.DOWNLOAD_STATEMENT_S3}/EcoSphere_Statement_${period.replace(' ', '_')}.pdf`,
        fileSizeMb: 2.4,
      });
    },
  },
};
