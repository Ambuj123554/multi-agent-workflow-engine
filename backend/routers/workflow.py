# routers/workflow.py
from fastapi import APIRouter
from pydantic import BaseModel

from orchestrator import Orchestrator
from memory import Memory


router = APIRouter()

# Shared orchestrator instance
orchestrator = Orchestrator()

class RunRequest(BaseModel):
    query: str

@router.post("/run")
async def run_workflow(payload: RunRequest):
    """
    Trigger Multi-Agent workflow engine
    """
    result = orchestrator.run(payload.query)
    return {"result": result}
