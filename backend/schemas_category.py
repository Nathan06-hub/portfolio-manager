from pydantic import BaseModel, Field, validator
from typing import Optional

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

    class Config:
        orm_mode = True

class CategoryOut(BaseModel):
    id: int
    name: str
    owner_id: int

    class Config:
        orm_mode = True
