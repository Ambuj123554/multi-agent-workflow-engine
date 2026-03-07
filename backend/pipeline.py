import time
from dataclasses import dataclass, field
from typing import List, Optional
from agents.understanding_agent import UnderstandingAgent
from agents.research_agent import ResearchAgent
from agents.analysis_agent import AnalysisAgent
from agents.validation_agent import ValidationAgent
from agents.writer_agent import WriterAgent

_understanding = UnderstandingAgent()
_research = ResearchAgent()
_analysis = AnalysisAgent()
_validation = ValidationAgent()
_writer = WriterAgent()

MAX_RETRIES = 2


@dataclass
class AgentTrace:
    stage: str
    prompt_summary: str   # first 300 chars of prompt
    response_summary: str # first 500 chars of response
    duration_ms: int
    status: str = "completed"  # completed | retried | cached


@dataclass
class PipelineResult:
    final_output: str
    confidence_score: int
    confidence_breakdown: dict
    traces: List[AgentTrace]
    retries: int
    cache_hit: bool = False


def _trace(stage: str, prompt: str, response: str, start: float) -> AgentTrace:
    return AgentTrace(
        stage=stage,
        prompt_summary=prompt[:300].strip(),
        response_summary=response[:500].strip(),
        duration_ms=int((time.time() - start) * 1000),
    )


async def run_multi_agent_pipeline(query: str, cached_answer: Optional[str] = None) -> PipelineResult:
    print("[Pipeline] Received query:", query)
    traces: List[AgentTrace] = []
    retries = 0

    # Cache hit — skip all agents
    if cached_answer:
        print("[Pipeline] Cache hit — skipping LLM calls.")
        return PipelineResult(
            final_output=cached_answer,
            confidence_score=10,
            confidence_breakdown={"accuracy": 10, "completeness": 10, "clarity": 10},
            traces=[AgentTrace("cache", "semantic similarity match", cached_answer[:500], 0, "cached")],
            retries=0,
            cache_hit=True,
        )

    # 1. Understanding
    t = time.time()
    understanding = _understanding.run(query)
    traces.append(_trace("Understanding", query, understanding, t))
    print("[Pipeline] Understanding complete.")

    # 2. Research
    t = time.time()
    research_input = f"{understanding}\n\nOriginal question: {query}"
    research_notes = _research.run(research_input)
    traces.append(_trace("Research", research_input, research_notes, t))
    print("[Pipeline] Research complete.")

    # 3. Analysis
    t = time.time()
    analysis_result = _analysis.run(research_notes)
    traces.append(_trace("Analysis", research_notes, analysis_result, t))
    print("[Pipeline] Analysis complete.")

    # 4. Validation loop
    validation = None
    for attempt in range(1, MAX_RETRIES + 2):
        t = time.time()
        validation = _validation.run(analysis_result, attempt=attempt)
        trace = _trace("Validation", analysis_result, validation.refined, t)

        if validation.passed:
            trace.status = "completed"
            traces.append(trace)
            print(f"[Pipeline] Validation passed (score {validation.score}/10).")
            break

        if attempt <= MAX_RETRIES:
            retries += 1
            trace.status = "retried"
            traces.append(trace)
            print(f"[Pipeline] Validation failed ({validation.score}/10). Retry {attempt}/{MAX_RETRIES}...")
            retry_context = (
                f"{understanding}\n\nOriginal question: {query}\n\n"
                f"Previous attempt was insufficient. Feedback:\n{validation.feedback}\n\n"
                f"Provide deeper, more accurate research addressing the gaps above."
            )
            t = time.time()
            research_notes = _research.run(retry_context)
            traces.append(_trace("Research (retry)", retry_context, research_notes, t))
            t = time.time()
            analysis_result = _analysis.run(research_notes)
            traces.append(_trace("Analysis (retry)", research_notes, analysis_result, t))
        else:
            trace.status = "completed"
            traces.append(trace)
            print(f"[Pipeline] Max retries reached. Using best result ({validation.score}/10).")

    # 5. Writer
    t = time.time()
    final_output = _writer.run(query, research_notes, analysis_result, validation.refined)
    traces.append(_trace("Writer", query, final_output, t))
    print("[Pipeline] Writer complete.")

    # Build confidence breakdown
    score = validation.score
    breakdown = {
        "accuracy":     min(10, max(1, score + (1 if score >= 8 else 0))),
        "completeness": min(10, max(1, score - (1 if score < 6 else 0))),
        "clarity":      min(10, max(1, score)),
    }

    return PipelineResult(
        final_output=final_output,
        confidence_score=score,
        confidence_breakdown=breakdown,
        traces=traces,
        retries=retries,
        cache_hit=False,
    )
