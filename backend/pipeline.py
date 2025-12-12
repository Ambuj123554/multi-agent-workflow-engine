from agents.research_agent import research_agent
from agents.analysis_agent import analysis_agent
from agents.validation_agent import validation_agent
from agents.writer_agent import writer_agent


# If your agents are async, convert accordingly

async def run_multi_agent_pipeline(query: str) -> str:
    print("[Pipeline] Received query:", query)

    # 1. Research
    research_notes = await research_agent(query)
    print("[Pipeline] Research complete.")

    # 2. Analysis
    analysis_result = await analysis_agent(research_notes)
    print("[Pipeline] Analysis complete.")

    # 3. Validation
    validated_result = await validation_agent(analysis_result)
    print("[Pipeline] Validation complete.")

    # 4. Writer
    final_output = await writer_agent(validated_result)
    print("[Pipeline] Writer complete.")

    return final_output
