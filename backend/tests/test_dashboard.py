import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_dashboard_root_unauthenticated():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        response = await ac.get("/dashboard/")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
