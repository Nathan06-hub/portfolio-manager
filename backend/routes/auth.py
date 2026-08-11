from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import User
from ..database import get_db
from ..schemas import UserCreate, UserOut
from ..auth import get_password_hash, verify_password, create_access_token, Token

router = APIRouter()

@router.post('/register', response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Duplicate incomplete login removed

@router.post('/login', response_model=Token)
async def login(form: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Incorrect email or password')
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token)
