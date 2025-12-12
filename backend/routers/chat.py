from fastapi import APIRouter
from pydantic import BaseModel
# from backend.routers.workflow import run_multi_agent_pipeline



router = APIRouter()

# -----------------------------
# Request / Response Models
# -----------------------------
class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    response: str


# -----------------------------
# /chat route for frontend
# -----------------------------
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(data: ChatRequest):
    """
    Receives user message, passes it to multi-agent pipeline,
    and returns the final writer-agent output.
    """

    user_query = data.query
    print("[Router] Received query:", user_query)

    try:
        pipeline_output = await run_multi_agent_pipeline(user_query)
    except Exception as e:
        print("[Router Error]", str(e))
        return ChatResponse(response="Internal server error in pipeline.")

    return ChatResponse(response=pipeline_output)
