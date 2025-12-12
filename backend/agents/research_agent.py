# agents/research_agent.py

from agents.base_agent import BaseAgent
from llm import llm

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__("ResearchAgent")

    def run(self, query: str) -> str:
        self.log(f"Researching query: {query}")

        prompt = (
            f"You are a research expert.\n"
            f"Write detailed research on the topic '{query}'.\n"
            f"Include:\n"
            f"- Clear explanation\n"
            f"- Key points\n"
            f"- Real-world examples\n"
            f"- Risks or challenges\n"
            f"- Final summary\n"
            f"Write professionally and in depth."
        )

        research_output = llm.invoke(prompt)

        self.log("Research completed.")
        return research_output
