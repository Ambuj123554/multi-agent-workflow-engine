# agents/writer_agent.py

from agents.base_agent import BaseAgent

class WriterAgent(BaseAgent):
    """Creates the final user-ready answer (clean, natural, meaningful)."""

    def __init__(self):
        super().__init__("WriterAgent")

    def run(self, query: str, research: str, analysis: str, validation: str) -> str:
        self.log("Writing final output...")

        final_text = self.generate_final_answer(query, research, analysis, validation)

        self.log("Final output ready.")
        return final_text

    def generate_final_answer(self, query: str, research: str, analysis: str, validation: str) -> str:
        """
        Produce a natural AI-style final answer based on the research & analysis.
        """

        # Extract the useful parts from analysis
        # (just the first paragraph or summary)
        analysis_summary = analysis.split("\n")[1] if "\n" in analysis else analysis

        # Build a natural language response
        response = (
            f"Here’s what I found about **{query}**:\n\n"
            f"{analysis_summary}\n\n"
            "If you need deeper technical research, detailed analysis, or "
            "validation steps, just ask **'show full breakdown'**."
        )

        return response
