from fastapi import APIRouter, HTTPException
from database import get_all_sessions, get_messages

router = APIRouter(prefix="/api/chat", tags=["Chat Sessions"])


@router.get("/sessions")
async def get_sessions():
    sessions = get_all_sessions()
    return {"sessions": sessions}


@router.get("/sessions/{session_id}/messages")
async def get_session_messages(session_id: int):
    messages = get_messages(session_id)
    if not messages:
        raise HTTPException(status_code=404, detail="Session not found or empty")
    return {"messages": messages}

