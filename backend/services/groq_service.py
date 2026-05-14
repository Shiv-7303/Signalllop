import os
import json
import requests

GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def call_groq(model: str, system_prompt: str, user_message: str, max_tokens: int = 1024, temperature: float = 0.3) -> str:
    """
    Calls the Groq API and returns the generated text.
    """
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"}
    }
    
    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    
    return response.json()['choices'][0]['message']['content']

def parse_json_safely(json_string: str) -> dict:
    """
    Safely parses JSON string, handling potential markdown wrappers.
    """
    try:
        clean_str = json_string.strip()
        if clean_str.startswith("```json"):
            clean_str = clean_str[7:]
        elif clean_str.startswith("```"):
            clean_str = clean_str[3:]
        if clean_str.endswith("```"):
            clean_str = clean_str[:-3]
            
        return json.loads(clean_str.strip())
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {json_string}")
        raise e
