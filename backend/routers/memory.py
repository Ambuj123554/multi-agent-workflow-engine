from fastapi import APIRouter
from services.kaggle_client import get_memory, save_memory

router = APIRouter()

@router.get("/")
def fetch_memory():
    return get_memory()

@router.post("/")
def add_memory(payload: dict):
    return save_memory(payload)
