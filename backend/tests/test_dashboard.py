import pytest
from httpx import AsyncClient
from backend.main import app

@pytest.mark.asyncio
async def test_dashboard_root_unauthenticated():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        response = await ac.get("/dashboard/")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
