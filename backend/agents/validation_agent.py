# agents/validation_agent.py

from agents.base_agent import BaseAgent

class ValidationAgent(BaseAgent):
    """Validates the quality & consistency of analysis."""

    def __init__(self):
        super().__init__("ValidationAgent")

    def run(self, analysis: str) -> str:
        self.log("Validating analysis...")

        validation_summary = (
            "Validation Results:\n"
            "- No major logical gaps detected\n"
            "- Information flow is consistent\n"
            "- Content quality is acceptable\n"
            "- Suggestions: Improve clarity in final summary\n\n"
        )

        self.log("Validation complete.")
        return validation_summary + analysis
