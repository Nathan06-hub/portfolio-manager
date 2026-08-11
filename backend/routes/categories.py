from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Category
from ..database import get_db
from ..schemas_category import CategoryCreate, CategoryOut
from ..auth import get_current_user

router = APIRouter()

@router.get('/', response_model=list[CategoryOut])
async def list_categories(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.owner_id == current_user.id))
    categories = result.scalars().all()
    return categories

@router.post('/', response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    db_category = Category(name=payload.name, owner_id=current_user.id)
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category

@router.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.id == category_id, Category.owner_id == current_user.id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(category)
    await db.commit()
    return None
