import pytest
from fastapi.testclient import TestClient
from backend.src.main import app

# Devopstrio AVD Multi-Region DR 
# Orchestration & Continuity Logic Tests

client = TestClient(app)

def test_regional_topology_discovery():
    """Verify that the platform identifies healthy geo-paired regions."""
    response = client.get("/regions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["status"] == "Healthy"

def test_failover_trigger_sequence():
    """Ensure a failover request is correctly accepted and queued."""
    payload = {
        "host_pool_id": "hp-uksouth-01",
        "target_region": "northeurope",
        "failover_type": "Emergency",
        "triggered_by": "dr-admin-99"
    }
    response = client.post("/failover/start", json=payload)
    assert response.status_code == 202
    assert "job_id" in response.json()
    assert response.json()["status"] == "In-Progress"

def test_replication_health_metrics():
    """Validate that profile sync lag is reportable and within threshold simulation."""
    response = client.get("/replication/status")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "lag_seconds" in data[0]
    # In our mock data, lag is 12s
    assert data[0]["lag_seconds"] < 60

def test_readiness_scorecard():
    """Confirm the capacity engine provides a verified readiness score."""
    response = client.get("/capacity")
    assert response.status_code == 200
    assert "readiness_score" in response.json()
    assert response.json()["readiness_score"] == "98%"

def test_health_check_operational():
    """Standard health check for Kubernetes liveness/readiness probes."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"
