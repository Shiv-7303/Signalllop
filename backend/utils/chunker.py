def chunk_results(results: list, chunk_size: int = 15) -> list:
    """
    Splits a list of results into chunks of a specific size.
    """
    if not results:
        return []
    return [results[i:i + chunk_size] for i in range(0, len(results), chunk_size)]

def format_results_for_groq(chunk: list) -> str:
    """
    Formats a chunk of search results into a readable string for the LLM.
    """
    formatted = ""
    for i, item in enumerate(chunk):
        formatted += f"--- Result {i+1} ---\n"
        formatted += f"Title: {item.get('title', 'N/A')}\n"
        formatted += f"URL: {item.get('url', 'N/A')}\n"
        formatted += f"Content Snippet: {item.get('content', 'N/A')}\n\n"
    return formatted
