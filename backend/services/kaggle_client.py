import requests
import os

KAGGLE_API_URL = os.getenv("KAGGLE_API_URL", "http://127.0.0.1:8001")

def run_workflow(query: str):
    """Send workflow query to Kaggle Notebook API"""
    try:
        res = requests.post(
            f"{KAGGLE_API_URL}/run",
            json={"query": query},
            timeout=60
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": str(e)}


def get_memory():
    """Fetch memory from Kaggle Notebook"""
    try:
        res = requests.get(f"{KAGGLE_API_URL}/memory", timeout=60)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": str(e)}


def save_memory(data: dict):
    """Save memory to Kaggle Notebook"""
    try:
        res = requests.post(
            f"{KAGGLE_API_URL}/memory",
            json=data,
            timeout=60
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": str(e)}
