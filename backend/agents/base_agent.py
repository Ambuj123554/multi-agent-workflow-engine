# agents/base_agent.py
# ---------------------------------------------------
# Base class for all agents
# ---------------------------------------------------

class BaseAgent:
    """Shared utilities & behavior for all agents."""

    def __init__(self, name: str):
        self.name = name

    def log(self, text: str):
        """Print log message with agent prefix."""
        print(f"[{self.name}] {text}")

    def run(self, *args, **kwargs):
        raise NotImplementedError("Each agent must implement run()")
