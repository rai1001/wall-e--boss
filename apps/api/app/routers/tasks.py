from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas import TaskCreate, TaskRead, TaskUpdate
from app.db import get_session

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
async def list_tasks(session: AsyncSession = Depends(get_session)):
    return await crud.list_tasks(session)


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, session: AsyncSession = Depends(get_session)):
    return await crud.create_task(session, payload)


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, session: AsyncSession = Depends(get_session)):
    task = await crud.get_task(session, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    payload: TaskUpdate,
    session: AsyncSession = Depends(get_session),
):
    task = await crud.get_task(session, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return await crud.update_task(session, task, payload)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, session: AsyncSession = Depends(get_session)):
    task = await crud.get_task(session, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await crud.delete_task(session, task)
    return None
