# agents/analysis_agent.py

from agents.base_agent import BaseAgent
from llm import llm

class AnalysisAgent(BaseAgent):
    """Agent responsible for analyzing research notes."""

    def __init__(self):
        super().__init__("AnalysisAgent")

    def run(self, research_notes: str) -> str:
        self.log("Analyzing research notes...")

        prompt = (
            f"You are an expert analyst.\n"
            f"Analyze the following research and extract:\n"
            f"- Key insights and patterns\n"
            f"- Important findings\n"
            f"- Strengths and weaknesses\n\n"
            f"Research:\n{research_notes}"
        )

        analysis = llm.invoke(prompt)
        self.log("Analysis complete.")
        return analysis

