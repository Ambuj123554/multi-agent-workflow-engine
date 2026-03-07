from fastapi import APIRouter
from database import get_all_sessions

router = APIRouter(prefix="/api/chat", tags=["Chat History"])


@router.get("/history")
async def get_history():
    sessions = get_all_sessions()
    return {"history": sessions}

