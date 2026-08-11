from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Transaction
from ..database import get_db
from ..schemas import TransactionCreate, TransactionUpdate, TransactionOut
from ..auth import get_current_user

router = APIRouter()

# Helper to ensure the transaction belongs to the current user
async def get_user_transaction(transaction_id: int, user_id: int, db: AsyncSession) -> Transaction:
    result = await db.execute(
        select(Transaction).where(Transaction.id == transaction_id, Transaction.owner_id == user_id)
    )
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.get('/', response_model=list[TransactionOut])
async def list_transactions(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transaction).where(Transaction.owner_id == current_user.id))
    transactions = result.scalars().all()
    return transactions

@router.get('/{transaction_id}', response_model=TransactionOut)
async def get_transaction(transaction_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    transaction = await get_user_transaction(transaction_id, current_user.id, db)
    return transaction

@router.post('/', response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
async def create_transaction(payload: TransactionCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    db_transaction = Transaction(
        amount=payload.amount,
        description=payload.description,
        type='income' if payload.type == 0 else 'expense',
        owner_id=current_user.id,
    )
    db.add(db_transaction)
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction

@router.put('/{transaction_id}', response_model=TransactionOut)
async def update_transaction(transaction_id: int, payload: TransactionUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    transaction = await get_user_transaction(transaction_id, current_user.id, db)
    update_data = payload.dict(exclude_unset=True)
    if 'type' in update_data:
        update_data['type'] = 'income' if update_data['type'] == 0 else 'expense'
    for key, value in update_data.items():
        setattr(transaction, key, value)
    await db.commit()
    await db.refresh(transaction)
    return transaction

@router.delete('/{transaction_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    transaction = await get_user_transaction(transaction_id, current_user.id, db)
    await db.delete(transaction)
    await db.commit()
    return None
