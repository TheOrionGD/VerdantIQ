/**
 * EcoSphere (VerdantIQ) — Unified System Endpoints Integration Test Suite
 *
 * This script tests connectivity, data serialization, and response contracts
 * across all microservice layers:
 *   1. Spring Boot Core Backend (http://localhost:8080)
 *   2. FastAPI ML & Optimization Engine (http://localhost:8000)
 *
 * Usage:
 *   node test-system-endpoints.js
 *
 * Requirements: Node.js 18+ (uses native fetch)
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// ANSI terminal colors
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const results = [];
let jwtToken = null;
let createdLogId = null;
let createdVerificationId = null;

function logHeader(title) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}  ${title}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}\n`);
}

function logResult(service, method, endpoint, status, durationMs, payloadSummary, isSuccess, errorMsg = '') {
  const statusStr = isSuccess
    ? `${COLORS.green}[PASS ${status}]${COLORS.reset}`
    : `${COLORS.red}[FAIL ${status || 'ERR'}]${COLORS.reset}`;
  const methodStr = `${COLORS.bright}${COLORS.yellow}${method.padEnd(6)}${COLORS.reset}`;
  const timeStr = `${COLORS.dim}(${durationMs}ms)${COLORS.reset}`;

  console.log(`${statusStr} ${methodStr} ${endpoint.padEnd(45)} ${timeStr}`);
  if (payloadSummary) {
    console.log(`      ${COLORS.dim}➜ Response:${COLORS.reset} ${payloadSummary}`);
  }
  if (!isSuccess && errorMsg) {
    console.log(`      ${COLORS.red}➜ Error:${COLORS.reset} ${errorMsg}`);
  }

  results.push({ service, method, endpoint, status, durationMs, isSuccess, errorMsg });
}

async function request(baseUrl, endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};

  if (options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  if (jwtToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  const start = Date.now();
  try {
    const res = await fetch(url, { ...options, headers });
    const duration = Date.now() - start;

    let data;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const isSuccess = res.status >= 200 && res.status < 300;
    const summary = typeof data === 'object' ? JSON.stringify(data).slice(0, 100) + '...' : String(data).slice(0, 100);

    return { ok: isSuccess, status: res.status, data, duration, summary };
  } catch (err) {
    const duration = Date.now() - start;
    return { ok: false, status: 0, data: null, duration, summary: '', error: err.message };
  }
}

// --- Test Suites ---

async function testAuthEndpoints() {
  logHeader('1. Testing Auth & User Management Endpoints (Spring Boot)');

  const testEmail = `test.user.${Date.now()}@verdantiq.io`;
  const testPassword = 'Password123!';

  // POST /api/v1/auth/register
  const regRes = await request(BACKEND_URL, '/api/v1/auth/register', {
    method: 'POST',
    body: { email: testEmail, password: testPassword, fullName: 'Test Endpoints User', role: 'INSTITUTION_ADMIN' }
  });
  logResult('Spring Boot', 'POST', '/api/v1/auth/register', regRes.status, regRes.duration, regRes.summary, regRes.ok, regRes.error);

  if (regRes.ok && regRes.data?.accessToken) {
    jwtToken = regRes.data.accessToken;
  }

  // POST /api/v1/auth/login
  const loginRes = await request(BACKEND_URL, '/api/v1/auth/login', {
    method: 'POST',
    body: { email: testEmail, password: testPassword }
  });
  logResult('Spring Boot', 'POST', '/api/v1/auth/login', loginRes.status, loginRes.duration, loginRes.summary, loginRes.ok, loginRes.error);

  if (loginRes.ok && loginRes.data?.accessToken) {
    jwtToken = loginRes.data.accessToken;
  }

  // GET /api/v1/users/me
  const meRes = await request(BACKEND_URL, '/api/v1/users/me');
  logResult('Spring Boot', 'GET', '/api/v1/users/me', meRes.status, meRes.duration, meRes.summary, meRes.ok, meRes.error);

  // PUT /api/v1/users/me
  const putMeRes = await request(BACKEND_URL, '/api/v1/users/me', {
    method: 'PUT',
    body: { fullName: 'Updated Test User Name' }
  });
  logResult('Spring Boot', 'PUT', '/api/v1/users/me', putMeRes.status, putMeRes.duration, putMeRes.summary, putMeRes.ok, putMeRes.error);
}

async function testOnboardingAndTrackerEndpoints() {
  logHeader('2. Testing Onboarding & Tracker Endpoints (Spring Boot)');

  // POST /api/v1/onboarding
  const onbRes = await request(BACKEND_URL, '/api/v1/onboarding', {
    method: 'POST',
    body: { householdMembers: 3, dietType: 'Vegetarian', monthlyElectricityBill: 120.0, monthlyWaterBill: 45.0, commuteMode: 'Transit', weeklyCommuteMiles: 50.0 }
  });
  logResult('Spring Boot', 'POST', '/api/v1/onboarding', onbRes.status, onbRes.duration, onbRes.summary, onbRes.ok, onbRes.error);

  // POST /api/v1/tracker (Create log)
  const createLogRes = await request(BACKEND_URL, '/api/v1/tracker', {
    method: 'POST',
    body: { category: 'energy', amount: 15.5, unit: 'kWh', co2SavedKg: 6.5, notes: 'LED bulb installation', latitude: 12.9716, longitude: 77.5946 }
  });
  logResult('Spring Boot', 'POST', '/api/v1/tracker', createLogRes.status, createLogRes.duration, createLogRes.summary, createLogRes.ok, createLogRes.error);
  if (createLogRes.ok && createLogRes.data?.id) {
    createdLogId = createLogRes.data.id;
  }

  // GET /api/v1/tracker
  const getLogsRes = await request(BACKEND_URL, '/api/v1/tracker');
  logResult('Spring Boot', 'GET', '/api/v1/tracker', getLogsRes.status, getLogsRes.duration, getLogsRes.summary, getLogsRes.ok, getLogsRes.error);

  // GET /api/v1/tracker/trees
  const treesRes = await request(BACKEND_URL, '/api/v1/tracker/trees');
  logResult('Spring Boot', 'GET', '/api/v1/tracker/trees', treesRes.status, treesRes.duration, treesRes.summary, treesRes.ok, treesRes.error);

  // POST /api/v1/tracker/upload-bill
  const billRes = await request(BACKEND_URL, '/api/v1/tracker/upload-bill', {
    method: 'POST',
    body: { fileName: 'july_electric_bill.pdf', contentType: 'application/pdf', fileSize: 245000 }
  });
  logResult('Spring Boot', 'POST', '/api/v1/tracker/upload-bill', billRes.status, billRes.duration, billRes.summary, billRes.ok, billRes.error);

  // PUT /api/v1/tracker/{id}
  if (createdLogId) {
    const putLogRes = await request(BACKEND_URL, `/api/v1/tracker/${createdLogId}`, {
      method: 'PUT',
      body: { category: 'energy', amount: 18.0, unit: 'kWh', co2SavedKg: 7.5, notes: 'Updated LED log' }
    });
    logResult('Spring Boot', 'PUT', `/api/v1/tracker/${createdLogId}`, putLogRes.status, putLogRes.duration, putLogRes.summary, putLogRes.ok, putLogRes.error);

    // DELETE /api/v1/tracker/{id}
    const delLogRes = await request(BACKEND_URL, `/api/v1/tracker/${createdLogId}`, { method: 'DELETE' });
    logResult('Spring Boot', 'DELETE', `/api/v1/tracker/${createdLogId}`, delLogRes.status, delLogRes.duration, delLogRes.summary, delLogRes.ok, delLogRes.error);
  }
}

async function testCommunityAndAdminEndpoints() {
  logHeader('3. Testing Community, Verification & Admin Endpoints (Spring Boot)');

  // GET /api/v1/community/leaderboard
  const leadRes = await request(BACKEND_URL, '/api/v1/community/leaderboard');
  logResult('Spring Boot', 'GET', '/api/v1/community/leaderboard', leadRes.status, leadRes.duration, leadRes.summary, leadRes.ok, leadRes.error);

  // GET /api/v1/community/metrics
  const metRes = await request(BACKEND_URL, '/api/v1/community/metrics');
  logResult('Spring Boot', 'GET', '/api/v1/community/metrics', metRes.status, metRes.duration, metRes.summary, metRes.ok, metRes.error);

  // POST /api/v1/community/pledge
  const pledgeRes = await request(BACKEND_URL, '/api/v1/community/pledge', {
    method: 'POST',
    body: { pledgeText: 'I pledge to reduce plastic waste on campus by 20%.' }
  });
  logResult('Spring Boot', 'POST', '/api/v1/community/pledge', pledgeRes.status, pledgeRes.duration, pledgeRes.summary, pledgeRes.ok, pledgeRes.error);

  // GET /api/v1/community/challenges
  const chalRes = await request(BACKEND_URL, '/api/v1/community/challenges');
  logResult('Spring Boot', 'GET', '/api/v1/community/challenges', chalRes.status, chalRes.duration, chalRes.summary, chalRes.ok, chalRes.error);

  // POST /api/v1/challenges/join
  const joinRes = await request(BACKEND_URL, '/api/v1/challenges/join', {
    method: 'POST',
    body: { challengeId: 'chal-tree-101' }
  });
  logResult('Spring Boot', 'POST', '/api/v1/challenges/join', joinRes.status, joinRes.duration, joinRes.summary, joinRes.ok, joinRes.error);

  // POST /api/v1/community/verifications
  const verRes = await request(BACKEND_URL, '/api/v1/community/verifications', {
    method: 'POST',
    body: { challengeId: 'chal-tree-101', institutionId: 'inst-1', photoUrl: 'https://minio.local/evidence/tree.jpg' }
  });
  logResult('Spring Boot', 'POST', '/api/v1/community/verifications', verRes.status, verRes.duration, verRes.summary, verRes.ok, verRes.error);
  if (verRes.ok && verRes.data?.id) {
    createdVerificationId = verRes.data.id;
  }

  // POST /api/v1/community/verifications/upload
  const verUploadRes = await request(BACKEND_URL, '/api/v1/community/verifications/upload', {
    method: 'POST',
    body: { fileName: 'proof.jpg', contentType: 'image/jpeg', latitude: 12.9716, longitude: 77.5946 }
  });
  logResult('Spring Boot', 'POST', '/api/v1/community/verifications/upload', verUploadRes.status, verUploadRes.duration, verUploadRes.summary, verUploadRes.ok, verUploadRes.error);

  // POST /api/v1/challenges/qr-validate
  const qrRes = await request(BACKEND_URL, '/api/v1/challenges/qr-validate', {
    method: 'POST',
    body: { qrCodeData: 'STATION_RECYCLING_BUILDING_4' }
  });
  logResult('Spring Boot', 'POST', '/api/v1/challenges/qr-validate', qrRes.status, qrRes.duration, qrRes.summary, qrRes.ok, qrRes.error);

  // GET /api/v1/admin/verifications
  const adminVerRes = await request(BACKEND_URL, '/api/v1/admin/verifications');
  logResult('Spring Boot', 'GET', '/api/v1/admin/verifications', adminVerRes.status, adminVerRes.duration, adminVerRes.summary, adminVerRes.ok, adminVerRes.error);

  // PUT /api/v1/admin/verifications/{id}/review
  if (createdVerificationId) {
    const reviewRes = await request(BACKEND_URL, `/api/v1/admin/verifications/${createdVerificationId}/review`, {
      method: 'PUT',
      body: { status: 'APPROVED' }
    });
    logResult('Spring Boot', 'PUT', `/api/v1/admin/verifications/${createdVerificationId}/review`, reviewRes.status, reviewRes.duration, reviewRes.summary, reviewRes.ok, reviewRes.error);
  }
}

async function testNotificationsAndTelemetryEndpoints() {
  logHeader('4. Testing Notifications, Reports & Telemetry Endpoints (Spring Boot)');

  // GET /api/v1/reports/monthly-pdf
  const pdfRes = await request(BACKEND_URL, '/api/v1/reports/monthly-pdf');
  logResult('Spring Boot', 'GET', '/api/v1/reports/monthly-pdf', pdfRes.status, pdfRes.duration, pdfRes.summary, pdfRes.ok, pdfRes.error);

  // POST /api/v1/notifications
  const createNotifRes = await request(BACKEND_URL, '/api/v1/notifications', {
    method: 'POST',
    body: { userId: 'usr-demo', type: 'ANOMALY', title: 'Power Consumption Alert', message: 'Spike detected in HVAC unit.' }
  });
  logResult('Spring Boot', 'POST', '/api/v1/notifications', createNotifRes.status, createNotifRes.duration, createNotifRes.summary, createNotifRes.ok, createNotifRes.error);

  // GET /api/v1/notifications
  const getNotifRes = await request(BACKEND_URL, '/api/v1/notifications');
  logResult('Spring Boot', 'GET', '/api/v1/notifications', getNotifRes.status, getNotifRes.duration, getNotifRes.summary, getNotifRes.ok, getNotifRes.error);

  // PATCH /api/v1/notifications/read-all
  const readAllRes = await request(BACKEND_URL, '/api/v1/notifications/read-all', { method: 'PATCH' });
  logResult('Spring Boot', 'PATCH', '/api/v1/notifications/read-all', readAllRes.status, readAllRes.duration, readAllRes.summary, readAllRes.ok, readAllRes.error);

  // GET /api/v1/admin/telemetry
  const telemetryRes = await request(BACKEND_URL, '/api/v1/admin/telemetry');
  logResult('Spring Boot', 'GET', '/api/v1/admin/telemetry', telemetryRes.status, telemetryRes.duration, telemetryRes.summary, telemetryRes.ok, telemetryRes.error);

  // GET /api/v1/admin/system/emission-factors
  const emGetRes = await request(BACKEND_URL, '/api/v1/admin/system/emission-factors');
  logResult('Spring Boot', 'GET', '/api/v1/admin/system/emission-factors', emGetRes.status, emGetRes.duration, emGetRes.summary, emGetRes.ok, emGetRes.error);

  // PUT /api/v1/admin/system/emission-factors
  const emPutRes = await request(BACKEND_URL, '/api/v1/admin/system/emission-factors', {
    method: 'PUT',
    body: { gridElectricityKgPerKwh: 0.45, gasolineTransportKgPerKm: 0.22 }
  });
  logResult('Spring Boot', 'PUT', '/api/v1/admin/system/emission-factors', emPutRes.status, emPutRes.duration, emPutRes.summary, emPutRes.ok, emPutRes.error);

  // GET /api/v1/admin/institution/stats
  const statsRes = await request(BACKEND_URL, '/api/v1/admin/institution/stats?resourceType=energy');
  logResult('Spring Boot', 'GET', '/api/v1/admin/institution/stats', statsRes.status, statsRes.duration, statsRes.summary, statsRes.ok, statsRes.error);
}

async function testFastApiMlServiceEndpoints() {
  logHeader('5. Testing ML & Optimization Engine Endpoints (FastAPI :8000)');

  // GET /health
  const healthRes = await request(ML_SERVICE_URL, '/health');
  logResult('FastAPI ML', 'GET', '/health', healthRes.status, healthRes.duration, healthRes.summary, healthRes.ok, healthRes.error);

  // GET /api/v1/ml/forecasts
  const forecastGetRes = await request(ML_SERVICE_URL, '/api/v1/ml/forecasts?user_id=usr-demo&horizon_days=7');
  logResult('FastAPI ML', 'GET', '/api/v1/ml/forecasts', forecastGetRes.status, forecastGetRes.duration, forecastGetRes.summary, forecastGetRes.ok, forecastGetRes.error);

  // POST /api/v1/ml/forecasts
  const forecastPostRes = await request(ML_SERVICE_URL, '/api/v1/ml/forecasts', {
    method: 'POST',
    body: { user_id: 'usr-demo', horizon_days: 30 }
  });
  logResult('FastAPI ML', 'POST', '/api/v1/ml/forecasts', forecastPostRes.status, forecastPostRes.duration, forecastPostRes.summary, forecastPostRes.ok, forecastPostRes.error);

  // GET /api/v1/ml/explain
  const explainGetRes = await request(ML_SERVICE_URL, '/api/v1/ml/explain?user_id=usr-demo');
  logResult('FastAPI ML', 'GET', '/api/v1/ml/explain', explainGetRes.status, explainGetRes.duration, explainGetRes.summary, explainGetRes.ok, explainGetRes.error);

  // POST /api/v1/optimizer/solve
  const solveRes = await request(ML_SERVICE_URL, '/api/v1/optimizer/solve', {
    method: 'POST',
    body: { target_co2_offset_kg: 50.0, max_budget_amount: 1500.0, priority_carbon_weight: 0.7, priority_cost_weight: 0.3 }
  });
  logResult('FastAPI ML', 'POST', '/api/v1/optimizer/solve', solveRes.status, solveRes.duration, solveRes.summary, solveRes.ok, solveRes.error);

  // POST /api/v1/twin/simulate
  const twinRes = await request(ML_SERVICE_URL, '/api/v1/twin/simulate', {
    method: 'POST',
    body: { upgrade_ids: ['solar', 'led'], weather_condition: 'SUNNY_SUMMER' }
  });
  logResult('FastAPI ML', 'POST', '/api/v1/twin/simulate', twinRes.status, twinRes.duration, twinRes.summary, twinRes.ok, twinRes.error);

  // POST /api/v1/assistant/chat
  const chatRes = await request(ML_SERVICE_URL, '/api/v1/assistant/chat', {
    method: 'POST',
    body: { user_query: 'Why did my energy bill spike yesterday?', user_id: 'usr-demo', conversation_history: [] }
  });
  logResult('FastAPI ML', 'POST', '/api/v1/assistant/chat', chatRes.status, chatRes.duration, chatRes.summary, chatRes.ok, chatRes.error);

  // POST /api/v1/gis/geotag
  const geotagRes = await request(ML_SERVICE_URL, '/api/v1/gis/geotag', {
    method: 'POST',
    body: { latitude: 12.9716, longitude: 77.5946, address: 'Eco Park Sector 4' }
  });
  logResult('FastAPI ML', 'POST', '/api/v1/gis/geotag', geotagRes.status, geotagRes.duration, geotagRes.summary, geotagRes.ok, geotagRes.error);

  // POST /api/v1/ml/retrain
  const retrainRes = await request(ML_SERVICE_URL, '/api/v1/ml/retrain', { method: 'POST' });
  logResult('FastAPI ML', 'POST', '/api/v1/ml/retrain', retrainRes.status, retrainRes.duration, retrainRes.summary, retrainRes.ok, retrainRes.error);

  // GET /api/v1/ml/telemetry
  const mlTelemRes = await request(ML_SERVICE_URL, '/api/v1/ml/telemetry');
  logResult('FastAPI ML', 'GET', '/api/v1/ml/telemetry', mlTelemRes.status, mlTelemRes.duration, mlTelemRes.summary, mlTelemRes.ok, mlTelemRes.error);
}

// --- Report Summary ---

function printSummaryTable() {
  const passed = results.filter(r => r.isSuccess).length;
  const failed = results.filter(r => !r.isSuccess).length;
  const total = results.length;

  console.log(`\n${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}  ENDPOINTS SYSTEM INTEGRATION TEST SUMMARY${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`Total Endpoints Tested : ${COLORS.bright}${total}${COLORS.reset}`);
  console.log(`Passed                 : ${COLORS.green}${COLORS.bright}${passed}${COLORS.reset}`);
  console.log(`Failed / Offline       : ${failed > 0 ? COLORS.red : COLORS.dim}${COLORS.bright}${failed}${COLORS.reset}\n`);

  if (failed > 0) {
    console.log(`${COLORS.yellow}Note: Ensure Spring Boot (port 8080) and FastAPI (port 8000) are running before executing integration tests.${COLORS.reset}\n`);
  }
}

// --- Main Runner ---

async function main() {
  console.log(`${COLORS.bright}${COLORS.magenta}EcoSphere (VerdantIQ) — Multi-Service Endpoints Tester${COLORS.reset}`);
  console.log(`Target Spring Boot : ${BACKEND_URL}`);
  console.log(`Target FastAPI ML   : ${ML_SERVICE_URL}`);

  try {
    await testAuthEndpoints();
    await testOnboardingAndTrackerEndpoints();
    await testCommunityAndAdminEndpoints();
    await testNotificationsAndTelemetryEndpoints();
    await testFastApiMlServiceEndpoints();
  } catch (err) {
    console.error(`${COLORS.red}Unhandled script error: ${err.message}${COLORS.reset}`);
  } finally {
    printSummaryTable();
  }
}

main();
