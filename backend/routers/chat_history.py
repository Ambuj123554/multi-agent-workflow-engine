from fastapi import APIRouter

router = APIRouter(prefix="/api/chat", tags=["Chat History"])

dummy_history = [
    {"id": 1, "title": "Product Launch Strategy"},
    {"id": 2, "title": "Market Analysis Report"},
    {"id": 3, "title": "Customer Research Insights"},
    {"id": 4, "title": "Competitor Analysis"},
]

@router.get("/history")
async def get_history():
    return {"history": dummy_history}
