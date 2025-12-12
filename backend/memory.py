class Memory:
    def __init__(self):
        self.store = []

    def add(self, content: str, source: str):
        """Save memory entry"""
        entry = {
            "source": source,
            "content": content
        }
        self.store.append(entry)

    def get_all(self):
        """Return all memory entries"""
        return self.store

    def clear(self):
        """Clear all stored memory"""
        self.store = []
memory = Memory()