import asyncio
import traceback
from fastapi import APIRouter
from pydantic import BaseModel
from llm import get_llm

router = APIRouter(prefix="/api", tags=["Compare"])


class CompareRequest(BaseModel):
    query: str
    providers: list[str] = ["groq", "gemini"]


class ProviderResult(BaseModel):
    provider: str
    response: str
    error: str = ""


class CompareResponse(BaseModel):
    query: str
    results: list[ProviderResult]


async def _run_provider(provider: str, prompt: str) -> ProviderResult:
    try:
        llm_instance = get_llm(provider)
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, llm_instance.invoke, prompt)
        return ProviderResult(provider=provider, response=response)
    except Exception as e:
        traceback.print_exc()
        return ProviderResult(provider=provider, response="", error=str(e))


@router.post("/compare", response_model=CompareResponse)
async def compare_llms(data: CompareRequest):
    prompt = (
        f"Answer the following question thoroughly and clearly:\n\n{data.query}"
    )
    tasks = [_run_provider(p, prompt) for p in data.providers]
    results = await asyncio.gather(*tasks)
    return CompareResponse(query=data.query, results=list(results))
