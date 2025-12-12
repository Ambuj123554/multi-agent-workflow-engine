# orchestrator.py
# ---------------------------------------------------
# Multi-Agent Workflow Engine
# ---------------------------------------------------

from agents.research_agent import ResearchAgent
from agents.analysis_agent import AnalysisAgent
from agents.validation_agent import ValidationAgent
from agents.writer_agent import WriterAgent
from memory import memory  # global memory store


class Orchestrator:
    """
    Controls the full workflow:
    1. Research
    2. Analysis
    3. Validation
    4. Final writing
    """

    def __init__(self):
        self.research_agent = ResearchAgent()
        self.analysis_agent = AnalysisAgent()
        self.validation_agent = ValidationAgent()
        self.writer_agent = WriterAgent()

    def run(self, query: str):
        """
        Runs the 4-stage workflow on a given query.
        """
        # ----- 1. Research -----
        research_notes = self.research_agent.run(query)
        memory.add(research_notes, source="research_agent")

        # ----- 2. Analysis -----
        analysis_output = self.analysis_agent.run(research_notes)
        memory.add(analysis_output, source="analysis_agent")

        # ----- 3. Validation -----
        validation_result = self.validation_agent.run(analysis_output)
        memory.add(validation_result, source="validation_agent")

        # ----- 4. Final Output Writer -----
        final_output = self.writer_agent.run(
            query=query,
            research=research_notes,
            analysis=analysis_output,
            validation=validation_result
        )

        memory.add(final_output, source="writer_agent")

        # Return clean response
        return {
            "query": query,
            "research": research_notes,
            "analysis": analysis_output,
            "validation": validation_result,
            "final_output": final_output
        }


# ---- Single global orchestrator instance ----
orchestrator = Orchestrator()
