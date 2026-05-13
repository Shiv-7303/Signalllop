import os
import json
from groq import Groq

def load_system_prompt():
    """Load the master system prompt from file."""
    prompt_path = os.path.join(
        os.path.dirname(__file__), 
        '..', 
        'prompts', 
        'growth_intelligence_prompt.txt'
    )
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def generate_report(business_data, reddit_data, competitor_data):
    # Using GROQ_API_KEY from environment
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    # Load the prompt
    system_prompt = load_system_prompt()
    
    # Build user message with business data
    user_message = f"""
Analyze this business and generate the detailed report:

Business Name: {business_data['business_name']}
Website: {business_data['website']}
Category: {business_data['category']}
Project Brief: {business_data['project_brief']}
Goal: {business_data['goal']}

Competitors:
{', '.join([c['competitor_name'] for c in competitor_data])}

Generate the complete JSON report now.
"""
    
    # Send to Groq
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        max_tokens=8000,
        temperature=0.65,
        top_p=0.9,
        response_format={"type": "json_object"},
    )
    
    # Parse and return
    report_json = json.loads(response.choices[0].message.content)
    return report_json
