"""
Pytest Unit Test Suite for EcoSphere ML Service & OR-Tools Solver (Phase 7 & 8)
"""
import pytest
from app.optimizer import solve_sustainability_plan
from app.forecaster import generate_consumption_forecast
from app.anomaly_detector import detect_and_explain_anomalies
from app.groq_assistant import generate_grounded_assistant_response


def test_optimizer_feasible():
    res = solve_sustainability_plan(target_co2_offset_kg=50.0, max_budget_amount=2000.0)
    assert res["status"] in ("OPTIMAL_SOLVED", "FEASIBLE_SOLVED", "FEASIBLE_GREEDY_FALLBACK", "FEASIBLE_PARTIAL_TARGET")
    assert "recommendedActions" in res
    assert "roadmap" in res
    assert len(res["recommendedActions"]) > 0
    assert len(res["roadmap"]) > 0
    assert res["totalCostAmount"] <= 2000.0


def test_optimizer_infeasible_budget():
    res = solve_sustainability_plan(target_co2_offset_kg=5000.0, max_budget_amount=10.0)
    assert res["status"] in ("INFEASIBLE", "INFEASIBLE_GREEDY_FALLBACK")
    assert res["totalCostAmount"] <= 10.0
    assert len(res["recommendedActions"]) == 0
    assert len(res["roadmap"]) == 0


def test_forecaster_fallback():
    res = generate_consumption_forecast(user_id="usr-thin", horizon_days=30, historical_records=[])
    assert res["status"] == "INSUFFICIENT_DATA"
    assert res["historicalDataPoints"] == 0
    assert "timeSeriesData" in res
    assert len(res["timeSeriesData"]) > 0
    assert "date" in res["timeSeriesData"][0]
    assert "actual" in res["timeSeriesData"][0]
    assert "predicted" in res["timeSeriesData"][0]


def test_anomaly_detection_spike():
    values = [10.0, 10.2, 10.1, 9.9, 10.0, 35.0, 10.1]
    res = detect_and_explain_anomalies("usr-test", values)
    assert res["anomalyDetected"] is True
    assert res["anomalyIndex"] == 5


def test_groq_assistant_grounding():
    user_summary = {"userId": "usr-test", "totalCo2SavedKg": 55.0}
    anomaly = {"anomalyDetected": True, "primaryDriver": "HVAC Spike", "deviationPercentage": 40.0}
    optimizer = {"recommendedActions": [{"name": "Smart LED Swap", "monthly_offset_kg": 14.2}]}

    res = generate_grounded_assistant_response(
        user_query="What is my biggest energy issue?",
        user_activity_summary=user_summary,
        anomaly_payload=anomaly,
        optimizer_roadmap=optimizer
    )

    assert "message" in res
    assert "chips" in res
    assert "chart_spec" in res
    assert "HVAC Spike" in res["message"] or "VerdantIQ" in res["message"]


def test_groq_assistant_guardrail_offtopic():
    user_summary = {"userId": "usr-test", "totalCo2SavedKg": 55.0}
    anomaly = {"anomalyDetected": False}
    optimizer = {"recommendedActions": []}

    res = generate_grounded_assistant_response(
        user_query="Can you give me medical advice about a cough?",
        user_activity_summary=user_summary,
        anomaly_payload=anomaly,
        optimizer_roadmap=optimizer
    )

    assert "message" in res
    assert "chips" in res
    assert "sustainability" in res["message"].lower() or "EcoSphere" in res["message"]


def test_fastapi_endpoints():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)

    # Test /health
    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    assert health_resp.json()["status"] == "UP"

    # Test GET & POST /api/v1/ml/forecasts
    forecast_get = client.get("/api/v1/ml/forecasts?user_id=usr-test&horizon_days=7")
    assert forecast_get.status_code == 200
    assert "predictedEnergyKwh" in forecast_get.json()
    assert "timeSeriesData" in forecast_get.json()

    forecast_post = client.post("/api/v1/ml/forecasts", json={"user_id": "usr-test", "horizon_days": 30})
    assert forecast_post.status_code == 200

    # Test /api/v1/ml/explain
    explain_resp = client.get("/api/v1/ml/explain?user_id=usr-test")
    assert explain_resp.status_code == 200

    # Test /api/v1/optimizer/solve
    solve_resp = client.post("/api/v1/optimizer/solve", json={
        "target_co2_offset_kg": 50.0,
        "max_budget_amount": 1500.0,
        "priority_carbon_weight": 0.7,
        "priority_cost_weight": 0.3
    })
    assert solve_resp.status_code == 200
    assert "roadmap" in solve_resp.json()

    # Test /api/v1/assistant/chat
    chat_resp = client.post("/api/v1/assistant/chat", json={
        "user_query": "How can I reduce my power consumption?",
        "user_id": "usr-test",
        "conversation_history": []
    })
    assert chat_resp.status_code == 200
    assert "message" in chat_resp.json()
    assert "chips" in chat_resp.json()

    # Test /api/v1/ml/retrain
    retrain_resp = client.post("/api/v1/ml/retrain")
    assert retrain_resp.status_code == 200
    assert retrain_resp.json()["status"] == "RETRAIN_SUCCESSFUL"

    # Test /api/v1/ml/telemetry
    telemetry_resp = client.get("/api/v1/ml/telemetry")
    assert telemetry_resp.status_code == 200
    assert telemetry_resp.json()["status"] == "HEALTHY"
    assert "trainingMetricsHistory" in telemetry_resp.json()



