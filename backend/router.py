from fastapi import APIRouter
from .routes.auth import router as auth_router
from .routes.transactions import router as transactions_router
from .routes.dashboard import router as dashboard_router
from .routes.goal import router as goal_router
from .routes.categories import router as categories_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(transactions_router, prefix="/transactions", tags=["transactions"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(goal_router, prefix="/goals", tags=["goals"])
api_router.include_router(categories_router, prefix="/categories", tags=["categories"])
