# agents/writer_agent.py

from agents.base_agent import BaseAgent
from llm import llm

class WriterAgent(BaseAgent):
    """Creates the final user-ready answer (clean, natural, meaningful)."""

    def __init__(self):
        super().__init__("WriterAgent")

    def run(self, query: str, research: str, analysis: str, validation: str) -> str:
        self.log("Writing final output...")

        prompt = (
            f"You are an expert writer. Based on the research, analysis, and validation below, "
            f"write a clear, complete, and well-structured final answer for the user's question.\n\n"
            f"User Question: {query}\n\n"
            f"Research:\n{research}\n\n"
            f"Analysis:\n{analysis}\n\n"
            f"Validation:\n{validation}\n\n"
            f"Write a professional, comprehensive, and easy-to-read response."
        )

        final_output = llm.invoke(prompt)
        self.log("Final output ready.")
        return final_output
