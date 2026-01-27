import pytest
from httpx import AsyncClient

from app.main import app, get_session
from app.db import Base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker


@pytest.fixture
async def client():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_session():
        async with async_session() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_health_ok(client):
    res = await client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}
