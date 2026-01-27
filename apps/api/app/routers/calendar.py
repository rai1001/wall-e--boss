from datetime import date

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.db import get_session
from app.schemas import EventRead
from app.services.calendar_mock import generate_mock_events

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/sync", response_model=list[EventRead], status_code=status.HTTP_201_CREATED)
async def calendar_sync(session: AsyncSession = Depends(get_session)):
    today = date.today()
    mock_events = generate_mock_events(today)
    saved = await crud.upsert_events(session, mock_events)
    return saved


@router.get("/today", response_model=list[EventRead])
async def calendar_today(session: AsyncSession = Depends(get_session)):
    today = date.today()
    events = await crud.events_for_day(session, today)
    return events


@router.post("/day/confirm-off", response_model=dict, status_code=status.HTTP_201_CREATED)
async def confirm_off(session: AsyncSession = Depends(get_session)):
    today = date.today()
    off = await crud.mark_off_day(session, today, reason="Confirmado por Rai")
    return {"date": off.date.isoformat(), "status": "DESCANSO"}
