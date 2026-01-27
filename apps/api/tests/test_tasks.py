import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.main import app, get_session
from app.db import Base


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
async def test_tasks_crud_flow(client: AsyncClient):
    payload = {
        "title": "Preparar pedido eventos",
        "priority": "VIP",
        "tags": ["work", "events"],
        "due_date": "2026-01-27",
    }

    # Create
    res_create = await client.post("/tasks", json=payload)
    assert res_create.status_code == 201
    created = res_create.json()
    assert created["title"] == payload["title"]
    assert created["priority"] == "VIP"
    task_id = created["id"]

    # List
    res_list = await client.get("/tasks")
    assert res_list.status_code == 200
    items = res_list.json()
    assert len(items) == 1
    assert items[0]["id"] == task_id

    # Update status and title
    res_update = await client.patch(f"/tasks/{task_id}", json={"status": "done", "title": "Pedido listo"})
    assert res_update.status_code == 200
    updated = res_update.json()
    assert updated["status"] == "done"
    assert updated["title"] == "Pedido listo"

    # Delete
    res_delete = await client.delete(f"/tasks/{task_id}")
    assert res_delete.status_code == 204

    # Verify deletion
    res_after = await client.get("/tasks")
    assert res_after.status_code == 200
    assert res_after.json() == []
