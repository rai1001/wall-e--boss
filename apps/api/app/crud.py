from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Event, OffDay, Task
from .schemas import EventCreate, TaskCreate, TaskUpdate


async def list_tasks(session: AsyncSession) -> List[Task]:
    result = await session.execute(select(Task).order_by(Task.created_at.desc()))
    return result.scalars().all()


async def get_task(session: AsyncSession, task_id: int) -> Optional[Task]:
    result = await session.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def create_task(session: AsyncSession, payload: TaskCreate) -> Task:
    task = Task(
        title=payload.title,
        priority=payload.priority,
        tags=payload.tags,
        due_date=payload.due_date,
        status=payload.status,
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def update_task(session: AsyncSession, task: Task, payload: TaskUpdate) -> Task:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def delete_task(session: AsyncSession, task: Task) -> None:
    await session.delete(task)
    await session.commit()


async def upsert_events(session: AsyncSession, events: list[EventCreate]) -> list[Event]:
    saved: list[Event] = []
    for e in events:
        event = Event(**e.model_dump())
        session.add(event)
        saved.append(event)
    await session.commit()
    for event in saved:
        await session.refresh(event)
    return saved


async def mark_off_day(session: AsyncSession, day: str, reason: str | None = None) -> OffDay:
    off = OffDay(date=date.fromisoformat(day) if isinstance(day, str) else day, reason=reason)
    session.add(off)
    await session.commit()
    await session.refresh(off)
    return off


async def events_for_day(session: AsyncSession, day: date):
    start = datetime.combine(day, datetime.min.time())
    end = datetime.combine(day, datetime.max.time())
    result = await session.execute(
        select(Event).where(Event.start_time >= start).where(Event.end_time <= end)
    )
    return result.scalars().all()
