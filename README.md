🚀 Multi-Agent Workflow Engine

A modular, production-ready AI system that automates problem understanding → research → analysis → final answer generation using multiple collaborating agents. The project includes a FastAPI backend, modern frontend UI, and a fully pluggable LLM abstraction layer (Gemini / Ollama / OpenAI compatible).

⭐ Key Features
🔹 Multi-Stage AI Pipeline

The system orchestrates four intelligent agents:

Understanding Agent – Interprets the user query and breaks it into actionable tasks.

Research Agent – Gathers information using web-search, tools, or LLM reasoning.

Analysis Agent – Evaluates, summarises, checks correctness, and removes hallucinations.

Final Output Agent – Crafts a clean, human-readable final answer.

⭐ Technical Highlights
🧠 Multi-Agent Orchestration

Custom agent pipeline with modular task routing.

Supports automatic validation loops to reduce hallucinations.

Extensible design: easily add tools (web search, RAG, structured output, etc.)

💾 Memory & Persistence

Vector-store powered memory system.

Stores agent conversations and research context.

Reduces redundant API calls and improves long-term reasoning.

⚡ Backend – FastAPI

Single /api/run endpoint to execute the full pipeline.

Clean architecture and reusable components.

LLM interface layer with plug-and-play models (Gemini/Ollama/OpenAI).

🎨 Frontend

Modern UI (React / Next.js or whichever you use).

Real-time status updates of each agent.

Beautiful chat-like interface for input and results.

🐳 Docker Support

Fully containerized backend for easy deployment.

Works locally or on cloud (Render, Railway, GCP, etc.)

🏗️ Project Structure
multi-agent-workflow-engine/
│── backend/
│   ├── agents/
│   ├── orchestrator.py
│   ├── llm.py
│   ├── memory.py
│   ├── routers/
│   ├── main.py
│
│── frontend/
│   ├── src/
│   └── ...
│
│── README.md
│── requirements.txt

🚀 How It Works
Step 1 → User submits query

The frontend sends a request to /api/run.

Step 2 → Agents collaborate

Each agent performs its role and passes optimized output to the next.

Step 3 → Final refined answer

The system returns a clean, context-aware, non-hallucinated response.

🧩 LLM Integration

Supported:
✔ Gemini (via Google Generative AI API)
✔ Ollama (local Llama-3, Mistral, DeepSeek, etc.)
✔ OpenAI (GPT-4, GPT-4o, etc.)

Swap models by editing just one file: llm.py.

📦 Installation
git clone https://github.com/Ambuj123554/multi-agent-workflow-engine
cd backend
pip install -r requirements.txt
fastapi dev main.py

🖥️ Run Frontend
cd frontend
npm install
npm run dev

🙌 Contributions

Open to improvements — feel free to submit PRs or open issues!

📜 License

MIT License
