import os
import requests

TAVILY_API_KEY = os.environ.get('TAVILY_API_KEY')
TAVILY_BASE_URL = 'https://api.tavily.com/search'

def call_tavily(query_config: dict) -> dict:
    """
    Makes a single Tavily search call.
    query_config = {query, depth, max_results}
    """
    if not TAVILY_API_KEY:
        print("Warning: TAVILY_API_KEY not found. Returning empty results.")
        return {'results': []}

    payload = {
        'api_key': TAVILY_API_KEY,
        'query': query_config['query'],
        'search_depth': query_config.get('depth', 'basic'),
        'max_results': query_config.get('max_results', 5),
        'include_answer': False,       # We want raw results, not Tavily's summary
        'include_raw_content': False,  # Snippets are enough for Groq
        'include_domains': [],
        'exclude_domains': ['wikipedia.org', 'youtube.com']
    }

    try:
        response = requests.post(TAVILY_BASE_URL, json=payload, timeout=15)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Tavily search failed for query '{query_config['query']}': {e}")
        return {'results': [], 'error': str(e)}
