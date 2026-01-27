from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.db import get_session
from app.schemas import BriefingResponse
from app.services.briefing import build_briefing

router = APIRouter(prefix="/briefing", tags=["briefing"])


@router.get("/today", response_model=BriefingResponse)
async def briefing_today(session: AsyncSession = Depends(get_session)):
    today = date.today()
    tasks = await crud.list_tasks(session)
    events = await crud.events_for_day(session, today)
    return build_briefing(today, tasks, events)
