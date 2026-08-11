from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Transaction
from ..database import get_db
from ..schemas import DashboardSummary
from ..auth import get_current_user

router = APIRouter()

@router.get("/", response_model=dict)
async def get_dashboard_root(current_user = Depends(get_current_user)):
    """Simple dashboard health endpoint."""
    # Return a friendly message; include user id if available
    user_id = getattr(current_user, "id", None)
    return {"message": "Bienvenue sur votre tableau de bord", "user": {"id": user_id}}

@router.get('/summary', response_model=DashboardSummary)
async def get_dashboard_summary(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Total income
    income_stmt = select(func.sum(Transaction.amount)).where(
        Transaction.owner_id == current_user.id,
        Transaction.type == 'income'
    )
    expense_stmt = select(func.sum(Transaction.amount)).where(
        Transaction.owner_id == current_user.id,
        Transaction.type == 'expense'
    )
    count_stmt = select(func.count(Transaction.id)).where(Transaction.owner_id == current_user.id)

    income_result = await db.execute(income_stmt)
    expense_result = await db.execute(expense_stmt)
    count_result = await db.execute(count_stmt)

    total_income = income_result.scalar() or 0.0
    total_expense = expense_result.scalar() or 0.0
    transaction_count = count_result.scalar() or 0
    balance = total_income - total_expense

    return DashboardSummary(
        total_income=total_income,
        total_expense=total_expense,
        balance=balance,
        transaction_count=transaction_count,
    )
