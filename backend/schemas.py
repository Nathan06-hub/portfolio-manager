from pydantic import BaseModel, EmailStr, PositiveFloat, conint, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    class Config:
        orm_mode = True

class TransactionCreate(BaseModel):
    amount: PositiveFloat
    description: Optional[str] = None
    type: conint(strict=True, ge=0, le=1)  # 0 = income, 1 = expense
    category_id: Optional[int] = None

class TransactionUpdate(BaseModel):
    amount: Optional[PositiveFloat] = None
    description: Optional[str] = None
    type: Optional[conint(strict=True, ge=0, le=1)] = None
    category_id: Optional[int] = None

class TransactionOut(BaseModel):
    id: int
    amount: float
    description: Optional[str]
    type: int
    timestamp: datetime
    class Config:
        orm_mode = True

class DashboardSummary(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    transaction_count: int
    # Add more aggregated fields as needed
    class Config:
        orm_mode = True
