from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .router import api_router

app = FastAPI(title="Portfolio Management API")

# Autoriser le front‑end (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
