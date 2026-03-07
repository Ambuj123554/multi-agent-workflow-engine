import os
from dotenv import load_dotenv

load_dotenv()


class GroqLLM:
    def __init__(self, model_name="llama-3.3-70b-versatile"):
        from groq import Groq
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model_name = model_name
        self.provider = "groq"

    def invoke(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content


class GeminiLLM:
    def __init__(self, model_name="models/gemini-2.0-flash"):
        import google.generativeai as genai
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(model_name)
        self.model_name = model_name
        self.provider = "gemini"

    def invoke(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text


class OllamaLLM:
    def __init__(self, model_name="llama3.2"):
        import requests as _requests
        self._requests = _requests
        self.model_name = model_name
        self.base_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.provider = "ollama"

    def invoke(self, prompt: str) -> str:
        response = self._requests.post(
            f"{self.base_url}/api/generate",
            json={"model": self.model_name, "prompt": prompt, "stream": False},
            timeout=120,
        )
        return response.json().get("response", "")


def get_llm(provider: str = None):
    """Factory: returns LLM instance for the given provider."""
    provider = provider or os.getenv("LLM_PROVIDER", "groq")
    if provider == "gemini":
        return GeminiLLM()
    elif provider == "ollama":
        return OllamaLLM()
    return GroqLLM()


# Default LLM used by all agents
llm = get_llm()
