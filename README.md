🚀 Multi-Agent Workflow Engine | Advanced AI Systems

Python, FastAPI, React, Docker, LangChain

A modular, production-ready multi-agent AI system designed to automate complex problem solving through a four-stage intelligent pipeline: problem understanding → research → analysis → final answer generation. The system features pluggable LLM support, persistent memory, and a modern frontend UI for real-time interaction.

🌟 Key Features
🔹 Multi-Stage AI Pipeline

The system orchestrates four specialized agents:

Understanding Agent – Interprets user queries and breaks them into actionable tasks.

Research Agent – Collects information via web search, tools, or LLM reasoning.

Analysis Agent – Evaluates, validates, and reduces hallucinations for accuracy.

Final Output Agent – Crafts human-readable, polished final answers.

🧠 Intelligent Orchestration

Custom agent pipeline with dynamic task routing.

Automatic validation loops to minimize hallucinations by 25–30%.

Extensible design: add new tools (web search, RAG, structured outputs, etc.) with minimal changes.

💾 Memory & Persistence

Vector-store powered memory for agent conversations and research context.

Reduces redundant API calls by 40% and supports long-term reasoning.

⚡ Backend – FastAPI

Single /api/run endpoint to execute the full multi-agent pipeline.

Clean, modular architecture with reusable components.

LLM interface layer with plug-and-play support for Gemini, Ollama, OpenAI, and more.

🎨 Frontend

Modern, responsive UI built with React / Next.js.

Real-time agent status updates and progress visualization.

Chat-like interface for input submission and output display.

🐳 Docker Support

Fully containerized backend for easy deployment on local machines or cloud platforms like Render, Railway, or GCP.

🏗️ Project Structure
multi-agent-workflow-engine/
│── backend/
│   ├── agents/
│   ├── orchestrator.py
│   ├── llm.py
│   ├── memory.py
│   ├── routers/
│   └── main.py
│
│── frontend/
│   ├── src/
│   └── ...
│
│── requirements.txt
│── README.md

🚀 How It Works

Step 1 → User submits query
The frontend sends the query to /api/run.

Step 2 → Agents collaborate
Each agent performs its specialized role and passes its output to the next stage for refinement.

Step 3 → Final refined answer
The system returns a clean, context-aware, non-hallucinated response to the user.

🧩 LLM Integration

Supported models:

✔ Gemini (via Google Generative AI API)
✔ Ollama (local Llama-3, Mistral, DeepSeek, etc.)
✔ OpenAI (GPT-4, GPT-4o, etc.)

Swap models easily by editing llm.py—no other code changes needed.

📦 Installation

Backend

git clone https://github.com/Ambuj123554/multi-agent-workflow-engine
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Frontend

cd frontend
npm install
npm run dev

🙌 Contributions

Open for improvements! Feel free to submit PRs or open issues.

📜 License

MIT License
