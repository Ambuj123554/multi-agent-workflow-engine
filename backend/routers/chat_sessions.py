from fastapi import APIRouter

router = APIRouter(prefix="/api/chat", tags=["Chat Sessions"])

# Dummy chats for now
dummy_sessions = [
    {"id": 1, "title": "Product Launch Strategy", "timestamp": "2h ago"},
    {"id": 2, "title": "Market Analysis Report", "timestamp": "5h ago"},
    {"id": 3, "title": "Customer Research Insights", "timestamp": "1d ago"},
    {"id": 4, "title": "Competitor Analysis", "timestamp": "2d ago"},
]

@router.get("/sessions")
async def get_sessions():
    return {"sessions": dummy_sessions}
