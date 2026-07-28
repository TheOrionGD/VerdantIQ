# ==============================================================================
# EcoSphere (VerdantIQ) — Phase 11 Multi-Layer System Launcher & Test Runner
# ==============================================================================
# This PowerShell script initializes all microservice layers and UI spatial engine
# in separate, dedicated terminal windows with a 5000ms (5-second) delay between
# each layer initialization, followed by automated integration testing.
# ==============================================================================

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) {
    $ScriptDir = Get-Location
}

# Resolve root project directory if script is located inside Deliverable
if ((Split-Path -Path $ScriptDir -Leaf) -eq "Deliverable") {
    $RootDir = Split-Path -Path $ScriptDir -Parent
} else {
    $RootDir = $ScriptDir
}

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  EcoSphere (VerdantIQ) — Phase 11 System Initializer & Integration Suite" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "Project Root Directory : $RootDir" -ForegroundColor Gray
Write-Host "Script Location        : $ScriptDir" -ForegroundColor Gray
Write-Host "Initialization Delay   : 5000 ms (5 seconds) between terminal startups" -ForegroundColor Yellow
Write-Host ""

# ------------------------------------------------------------------------------
# Layer 1: Spring Boot Core Backend (Java 21 / Gradle :8080)
# ------------------------------------------------------------------------------
Write-Host "[1/4] Initializing Layer 1: Spring Boot Core Backend (Port 8080)..." -ForegroundColor Green
$BackendCmd = "Set-Location '$RootDir/backend'; Write-Host '=== [Layer 1] EcoSphere Spring Boot Backend (Port 8080) ===' -ForegroundColor Green; ./gradlew bootRun"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCmd

Write-Host "Waiting 5000 ms for Spring Boot initialization thread..." -ForegroundColor Gray
Start-Sleep -Milliseconds 5000

# ------------------------------------------------------------------------------
# Layer 2: FastAPI ML & Optimization Engine (Python 3.11 / Uvicorn :8000)
# ------------------------------------------------------------------------------
Write-Host "[2/4] Initializing Layer 2: FastAPI ML & Optimization Engine (Port 8000)..." -ForegroundColor Cyan
$MlCmd = "Set-Location '$RootDir/ml-service'; Write-Host '=== [Layer 2] EcoSphere FastAPI ML & MILP Solver (Port 8000) ===' -ForegroundColor Cyan; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $MlCmd

Write-Host "Waiting 5000 ms for FastAPI ML service initialization thread..." -ForegroundColor Gray
Start-Sleep -Milliseconds 5000

# ------------------------------------------------------------------------------
# Layer 3: React Spatial UI / Client (Vite :5173)
# ------------------------------------------------------------------------------
Write-Host "[3/4] Initializing Layer 3: React Spatial UI Engine (Port 5173)..." -ForegroundColor Yellow
$FrontendCmd = "Set-Location '$RootDir'; Write-Host '=== [Layer 3] EcoSphere React Spatial UI Shell (Port 5173) ===' -ForegroundColor Yellow; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCmd

Write-Host "Waiting 5000 ms for React dev server initialization thread..." -ForegroundColor Gray
Start-Sleep -Milliseconds 5000

# ------------------------------------------------------------------------------
# Layer 4: System Endpoints Integration Tester (Node.js test-system-endpoints.js)
# ------------------------------------------------------------------------------
Write-Host "[4/4] Launching Layer 4: Endpoints Connectivity Integration Tester..." -ForegroundColor Magenta
$TesterCmd = "Set-Location '$RootDir'; Write-Host '=== [Layer 4] Endpoints Integration Test Suite ===' -ForegroundColor Magenta; node test-system-endpoints.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $TesterCmd

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "  All 4 System Layers Successfully Spawned on Dedicated Terminal Windows!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "  - Layer 1 Backend      : http://localhost:8080 (Swagger: /swagger-ui.html)" -ForegroundColor Gray
Write-Host "  - Layer 2 ML Engine    : http://localhost:8000 (OpenAPI: /docs)" -ForegroundColor Gray
Write-Host "  - Layer 3 Spatial UI   : http://localhost:5173" -ForegroundColor Gray
Write-Host "  - Layer 4 Tester       : Running test-system-endpoints.js on terminal" -ForegroundColor Gray
Write-Host "==============================================================================" -ForegroundColor Green

