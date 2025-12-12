import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

print("\n--- Available Models for Your API Key ---")
for m in genai.list_models():
    print(m.name)
