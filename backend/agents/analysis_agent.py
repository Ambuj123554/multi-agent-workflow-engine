# agents/analysis_agent.py

from agents.base_agent import BaseAgent

class AnalysisAgent(BaseAgent):
    """Agent responsible for analyzing research notes."""

    def __init__(self):
        super().__init__("AnalysisAgent")

    def run(self, research_notes: str) -> str:
        self.log("Analyzing research notes...")

        analysis = (
            "Analysis Summary:\n"
            f"- Extracted key factors from research\n"
            f"- Identified main patterns\n"
            f"- Highlighted important areas\n\n"
            f"Detailed Analysis Based on Research:\n{research_notes}"
        )

        self.log("Analysis complete.")
        return analysis
