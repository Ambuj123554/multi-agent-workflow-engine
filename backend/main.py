# main.py
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import workflow, memory
from routers.chat import router as chat_router
from routers.chat_history import router as chat_history_router
from routers.chat_sessions import router as chat_sessions_router
from routers.compare import router as compare_router

app = FastAPI(title="AI Multi-Agent Workflow Engine")

# CORS (allows React/Next.js/Vue etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Multi-Agent Workflow Engine is running 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Register Routers
app.include_router(chat_router)
app.include_router(chat_history_router)
app.include_router(chat_sessions_router)
app.include_router(compare_router)
app.include_router(workflow.router, prefix="/api")
app.include_router(memory.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
