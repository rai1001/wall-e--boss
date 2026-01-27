from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.db import get_session
from app.schemas import PlanTodayResponse
from app.services.plan import build_plan_today

router = APIRouter(prefix="/plan", tags=["plan"])


@router.get("/today", response_model=PlanTodayResponse)
async def plan_today(session: AsyncSession = Depends(get_session)):
    today = date.today()
    tasks = await crud.list_tasks(session)
    events = await crud.events_for_day(session, today)
    response = build_plan_today(today, tasks, events)
    return response
