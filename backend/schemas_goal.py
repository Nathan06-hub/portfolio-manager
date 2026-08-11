from pydantic import BaseModel, EmailStr, PositiveFloat, conint
from typing import Optional
from datetime import datetime

class GoalCreate(BaseModel):
    name: str
    target_amount: PositiveFloat
    deadline: Optional[datetime] = None

class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[PositiveFloat] = None
    current_amount: Optional[PositiveFloat] = None
    deadline: Optional[datetime] = None

class GoalOut(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    deadline: Optional[datetime]
    class Config:
        orm_mode = True
