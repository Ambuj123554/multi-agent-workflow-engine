# agents/validation_agent.py

from agents.base_agent import BaseAgent
from llm import llm


class ValidationResult:
    def __init__(self, passed: bool, score: int, feedback: str, refined: str):
        self.passed = passed      # True if score >= 7
        self.score = score        # 1-10
        self.feedback = feedback  # What needs improvement
        self.refined = refined    # Improved version of the analysis


class ValidationAgent(BaseAgent):
    """Validates quality & consistency of analysis. Returns score + feedback for retry loop."""

    def __init__(self):
        super().__init__("ValidationAgent")

    def run(self, analysis: str, attempt: int = 1) -> ValidationResult:
        self.log(f"Validating analysis (attempt {attempt})...")

        prompt = (
            f"You are a strict validation expert. Review the following analysis.\n\n"
            f"Evaluate on these criteria:\n"
            f"1. Factual accuracy — are claims correct and well-supported?\n"
            f"2. Completeness — are key aspects covered without major gaps?\n"
            f"3. Logical consistency — does the reasoning flow without contradictions?\n"
            f"4. Clarity — is it easy to understand?\n\n"
            f"Analysis to validate:\n{analysis}\n\n"
            f"Respond in EXACTLY this format:\n"
            f"SCORE: <number 1-10>\n"
            f"FEEDBACK: <one paragraph on what's missing or wrong, or 'None' if excellent>\n"
            f"REFINED: <improved version of the analysis>"
        )

        raw = llm.invoke(prompt)

        # Parse the structured response
        score, feedback, refined = self._parse_response(raw)
        passed = score >= 7

        self.log(f"Validation score: {score}/10 — {'PASSED' if passed else 'FAILED, needs retry'}")
        return ValidationResult(passed=passed, score=score, feedback=feedback, refined=refined)

    def _parse_response(self, raw: str):
        score = 7
        feedback = ""
        refined = raw

        try:
            lines = raw.strip().splitlines()
            score_line = next((l for l in lines if l.startswith("SCORE:")), None)
            feedback_line = next((l for l in lines if l.startswith("FEEDBACK:")), None)
            refined_idx = next((i for i, l in enumerate(lines) if l.startswith("REFINED:")), None)

            if score_line:
                score = int(''.join(filter(str.isdigit, score_line.split(":", 1)[1][:3])))
                score = max(1, min(10, score))
            if feedback_line:
                feedback = feedback_line.split(":", 1)[1].strip()
            if refined_idx is not None:
                refined_parts = lines[refined_idx].split(":", 1)
                rest = refined_parts[1].strip() if len(refined_parts) > 1 else ""
                refined = rest + "\n" + "\n".join(lines[refined_idx + 1:])
                refined = refined.strip()
        except Exception:
            pass  # fall back to defaults

        return score, feedback, refined

