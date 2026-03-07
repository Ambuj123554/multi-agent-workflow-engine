import os
import sqlite3
import hashlib

_DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache.db")


def _get_conn():
    conn = sqlite3.connect(_DB_FILE)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS qa_cache "
        "(id TEXT PRIMARY KEY, query TEXT NOT NULL, answer TEXT NOT NULL, "
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    )
    conn.commit()
    return conn


def _normalize(query: str) -> str:
    return " ".join(query.lower().strip().split())


def check_cache(query: str) -> str | None:
    """Return cached answer for exact (normalized) query match."""
    try:
        key = hashlib.md5(_normalize(query).encode()).hexdigest()
        conn = _get_conn()
        row = conn.execute("SELECT answer FROM qa_cache WHERE id = ?", (key,)).fetchone()
        conn.close()
        if row:
            print(f"[Memory] Cache hit for: {query[:60]}")
            return row[0]
        print(f"[Memory] Cache miss for: {query[:60]}")
        return None
    except Exception as e:
        print(f"[Memory] Cache check failed: {e}")
        return None


def store_answer(query: str, answer: str):
    """Store a Q&A pair in the SQLite cache."""
    try:
        key = hashlib.md5(_normalize(query).encode()).hexdigest()
        conn = _get_conn()
        conn.execute(
            "INSERT OR REPLACE INTO qa_cache (id, query, answer) VALUES (?, ?, ?)",
            (key, query, answer[:4000]),
        )
        conn.commit()
        conn.close()
        print(f"[Memory] Stored answer for: {query[:60]}")
    except Exception as e:
        print(f"[Memory] Store failed: {e}")


def get_collection_size() -> int:
    try:
        conn = _get_conn()
        count = conn.execute("SELECT COUNT(*) FROM qa_cache").fetchone()[0]
        conn.close()
        return count
    except Exception:
        return 0


class MemoryStore:
    """Simple in-memory log used by the Orchestrator for agent context passing."""

    def __init__(self):
        self._entries = []

    def add(self, content: str, source: str = ""):
        self._entries.append({"source": source, "content": content})

    def get_all(self):
        return self._entries

    def clear(self):
        self._entries = []


# Alias so legacy imports like `from memory import Memory` still work
Memory = MemoryStore

# Global instance used by orchestrator.py
memory = MemoryStore()
