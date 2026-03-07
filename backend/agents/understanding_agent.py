# agents/understanding_agent.py

from agents.base_agent import BaseAgent
from llm import llm


class UnderstandingAgent(BaseAgent):
    """Stage 1: Interprets and decomposes the user query before research."""

    def __init__(self):
        super().__init__("UnderstandingAgent")

    def run(self, query: str) -> str:
        self.log(f"Understanding query: {query}")

        prompt = (
            f"You are a query understanding expert.\n"
            f"Analyze the following user question and produce a structured breakdown:\n\n"
            f"1. Core intent: What is the user really asking?\n"
            f"2. Sub-questions: Break it into 2-4 specific sub-questions to research.\n"
            f"3. Key concepts: List the main topics/terms involved.\n"
            f"4. Expected output type: (explanation / comparison / how-to / analysis / other)\n\n"
            f"User Question: {query}\n\n"
            f"Return a clear, structured breakdown that will guide the research agent."
        )

        understanding = llm.invoke(prompt)
        self.log("Understanding complete.")
        return understanding
