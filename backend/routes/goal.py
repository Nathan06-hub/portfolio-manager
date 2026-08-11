from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Goal
from ..database import get_db
from ..schemas_goal import GoalCreate, GoalUpdate, GoalOut
from ..auth import get_current_user

router = APIRouter()

# Helper to ensure the goal belongs to current user
async def get_user_goal(goal_id: int, user_id: int, db: AsyncSession) -> Goal:
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.owner_id == user_id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.get('/', response_model=list[GoalOut])
async def list_goals(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Goal).where(Goal.owner_id == current_user.id))
    goals = result.scalars().all()
    return goals

@router.get('/{goal_id}', response_model=GoalOut)
async def get_goal(goal_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goal = await get_user_goal(goal_id, current_user.id, db)
    return goal

@router.post('/', response_model=GoalOut, status_code=status.HTTP_201_CREATED)
async def create_goal(payload: GoalCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    db_goal = Goal(
        name=payload.name,
        target_amount=payload.target_amount,
        current_amount=0.0,
        deadline=payload.deadline,
        owner_id=current_user.id,
    )
    db.add(db_goal)
    await db.commit()
    await db.refresh(db_goal)
    return db_goal

@router.put('/{goal_id}', response_model=GoalOut)
async def update_goal(goal_id: int, payload: GoalUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goal = await get_user_goal(goal_id, current_user.id, db)
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(goal, key, value)
    await db.commit()
    await db.refresh(goal)
    return goal

@router.delete('/{goal_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(goal_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    goal = await get_user_goal(goal_id, current_user.id, db)
    await db.delete(goal)
    await db.commit()
    return None
