from functools import lru_cache
import time

class SimpleCache:
    def __init__(self):
        self.cache = {}

    def set(self, key, value, ttl=3600):
        expires_at = time.time() + ttl
        self.cache[key] = (value, expires_at)

    def get(self, key):
        if key not in self.cache:
            return None
        
        value, expires_at = self.cache[key]
        if time.time() > expires_at:
            del self.cache[key]
            return None
            
        return value

    def delete(self, key):
        if key in self.cache:
            del self.cache[key]

# Singleton instance
cache = SimpleCache()
