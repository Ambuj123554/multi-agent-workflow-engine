#!/usr/bin/env python3

content = '''# agents/writer_agent.py

from agents.base_agent import BaseAgent
from llm import llm

class WriterAgent(BaseAgent):
    """Creates the final user-ready answer."""

    def __init__(self):
        super().__init__("WriterAgent")

    def run(self, query: str, research: str, analysis: str, validation: str) -> str:
        self.log("Writing final output...")

        prompt = (
            f"You are an expert writer. Based on the research, analysis, and validation below, "
            f"write a clear, complete, and well-structured final answer for the user question."
            f"\\n\\nUser Question: {query}\\n\\nResearch:\\n{research}\\n\\nAnalysis:\\n{analysis}\\n\\nValidation:\\n{validation}\\n\\nWrite a professional, comprehensive, easy-to-read response."
        )

        final_output = llm.invoke(prompt)
        self.log("Final output ready.")
        return final_output
'''

with open(r'C:\Users\DELL\Desktop\AI_AGENT\backend\agents\writer_agent.py', 'w') as f:
    f.write(content)

print("File written successfully")

# Verify syntax
import ast
with open(r'C:\Users\DELL\Desktop\AI_AGENT\backend\agents\writer_agent.py', 'r') as f:
    code = f.read()
    try:
        ast.parse(code)
        print("Syntax OK")
    except SyntaxError as e:
        print(f"Syntax error: {e}")
