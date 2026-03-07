import traceback
from typing import Optional, List
from fastapi import APIRouter
from pydantic import BaseModel
from pipeline import run_multi_agent_pipeline
from database import create_session, save_message
from memory import check_cache, store_answer

router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    session_id: Optional[int] = None


class AgentTraceOut(BaseModel):
    stage: str
    prompt_summary: str
    response_summary: str
    duration_ms: int
    status: str


class ChatResponse(BaseModel):
    response: str
    session_id: int
    confidence_score: int
    confidence_breakdown: dict
    traces: List[AgentTraceOut]
    retries: int
    cache_hit: bool


@router.post("/api/run", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(data: ChatRequest):
    user_query = data.query
    print("[Router] Received query:", user_query)

    session_id = data.session_id
    if not session_id:
        title = user_query[:60] + ("..." if len(user_query) > 60 else "")
        session_id = create_session(title)

    save_message(session_id, "user", user_query)

    try:
        # Check vector memory cache first
        cached = check_cache(user_query)
        result = await run_multi_agent_pipeline(user_query, cached_answer=cached)

        # Store in vector memory if not a cache hit
        if not result.cache_hit:
            store_answer(user_query, result.final_output)

    except Exception as e:
        traceback.print_exc()
        return ChatResponse(
            response=f"Error: {str(e)}",
            session_id=session_id,
            confidence_score=0,
            confidence_breakdown={},
            traces=[],
            retries=0,
            cache_hit=False,
        )

    save_message(session_id, "assistant", result.final_output)

    return ChatResponse(
        response=result.final_output,
        session_id=session_id,
        confidence_score=result.confidence_score,
        confidence_breakdown=result.confidence_breakdown,
        traces=[AgentTraceOut(**t.__dict__) for t in result.traces],
        retries=result.retries,
        cache_hit=result.cache_hit,
    )

