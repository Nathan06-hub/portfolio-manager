import pytest
from httpx import AsyncClient
from backend.main import app

@pytest.mark.asyncio
async def test_dashboard_root_authenticated():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        # Provide any non‑empty token, e.g., "dummy-token"
        response = await ac.get(
            "/dashboard/",
            headers={"Authorization": "Bearer dummy-token"},
        )
    assert response.status_code == 200
    json = response.json()
    assert "message" in json
    assert json["message"] == "Bienvenue sur votre tableau de bord"
    # user dict should contain token info (may be None for id)
    assert "user" in json
