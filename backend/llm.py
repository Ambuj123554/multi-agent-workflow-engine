import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class LLM:
    def __init__(self, model_name="models/gemini-2.0-flash"):
        self.model = genai.GenerativeModel(model_name)

    def invoke(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text

llm = LLM()
