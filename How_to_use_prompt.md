# How to Use growth_intelligence_prompt.txt

## Folder Structure

```
backend/
├── prompts/
│   └── growth_intelligence_prompt.txt  ← Ye file yaha rakho
├── services/
│   └── report_service.py
├── routes/
│   └── reports.py
└── app.py
```

---

## Step 1 — Copy the Prompt File

```bash
# Terminal mein ye command chalao
mkdir -p backend/prompts/
# growth_intelligence_prompt.txt ko backend/prompts/ mein paste kar
```

---

## Step 2 — Use it in `report_service.py`

```python
# backend/services/report_service.py

import os

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
    from groq import Groq
    
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    # Load the prompt
    system_prompt = load_system_prompt()
    
    # Build user message with business data
    user_message = f"""
Analyze this business and generate the detailed report:

Business Name: {business_data['business_name']}
Website: {business_data['website']}
Category: {business_data['category']}
Target Audience: {business_data['target_audience']}
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
    import json
    report_json = json.loads(response.choices[0].message.content)
    return report_json
```

---

## Step 3 — Call it from Your Route

```python
# backend/routes/reports.py

from flask import Blueprint, request, jsonify
from services.report_service import generate_report

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/generate', methods=['POST'])
def create_report():
    data = request.get_json()
    
    # Extract data
    business_data = data.get('business')
    competitors = data.get('competitors', [])
    reddit_data = {}  # Virtual mode = empty
    
    # Generate report
    report = generate_report(business_data, reddit_data, competitors)
    
    return jsonify({
        "success": True,
        "report": report
    })
```

---

## That's It! 

### What happens:

1. `growth_intelligence_prompt.txt` contain detailed instructions
2. `report_service.py` loads it aur Groq ko bhejta hai
3. Groq ko pata hai kya exact output chahiye (JSON with 11 sections)
4. Report return hota hai frontend ko
5. Frontend use karta hai `ReportDashboard.jsx` mein display karne ke liye

---

## Quick Test

```bash
# Terminal mein
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "business": {
      "business_name": "MyTool",
      "website": "mytool.com",
      "category": "SaaS",
      "target_audience": "Founders",
      "goal": "Growth"
    },
    "competitors": [
      {"competitor_name": "SparkToro"}
    ]
  }'
```

---

## That's all you need to know. Bas ye 3 steps follow kar aur report generation ho jayega. ✅