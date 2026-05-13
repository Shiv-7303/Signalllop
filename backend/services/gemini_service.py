import os
import time
import json
import re
from google import genai
from google.genai import types
from backend.config import Config
from backend.services.prompt_loader import load_prompt

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
        self.model_name = 'gemini-3.1-flash-lite'
        
        print("\n" + "="*50)
        print(f"🚀 AI ENGINE OPTIMIZED: Using {self.model_name}")
        print("="*50 + "\n")

    def _strip_json(self, text):
        if not text: return ""
        match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
        if match:
            return match.group(0)
        return text

    def _call_with_retry(self, prompt, use_search=False, retries=5, delay=20):
        """Aggressive retry with 20s base delay to survive strict Free Tier limits."""
        tools = []
        if use_search:
            tools.append(types.Tool(google_search=types.GoogleSearch()))
            
        generate_content_config = types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_level="MINIMAL"),
            tools=tools if tools else None,
        )

        last_exception = None
        for i in range(retries):
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=generate_content_config
                )
                if not response.text:
                    raise Exception("AI returned empty body")
                return response
            except Exception as e:
                last_exception = e
                if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                    print(f"⚠️  QUOTA DEPLETED: Waiting {delay}s for reset... (Attempt {i+1}/{retries})")
                    time.sleep(delay)
                    delay *= 1.5 
                    continue
                raise e 
        raise last_exception

    def generate_keywords(self, business_description):
        """Step 1: Expand keywords (Only 1 request)."""
        prompt = f"Act as a growth hacker. Return ONLY a JSON list of 10 Reddit search keywords for: {business_description}"
        try:
            response = self._call_with_retry(prompt)
            return json.loads(self._strip_json(response.text))
        except Exception:
            return ["marketing", "growth"]

    def generate_combined_analysis(self, posts_list, business_context_dict):
        """
        Step 2: COMBINED REQUEST (Summary + Opportunities).
        This saves a lot of quota by doing two tasks in one prompt.
        """
        business_desc = f"{business_context_dict['business_name']} ({business_context_dict['category']})"
        posts_text = ""
        # Reduced to 10 posts to save Input Tokens
        for i, post in enumerate(posts_list[:10]):
            posts_text += f"Post {i+1}: {post['title']} | {post['selftext'][:250]}\n"

        prompt = f"""
        You are a growth strategist for {business_desc}.
        Analyze these Reddit posts and return a JSON object with two keys:
        1. "summary": A 200-word analysis of pain points and themes.
        2. "opportunities": A list of objects each with (title, ai_summary, recommended_action, opportunity_score, intent_type).
        
        Posts:
        {posts_text}
        """
        try:
            response = self._call_with_retry(prompt)
            data = json.loads(self._strip_json(response.text))
            return data.get('summary', ""), data.get('opportunities', [])
        except Exception as e:
            print(f"Combined Analysis Error: {e}")
            return "Analysis failed.", []

    def generate_strategy_report(self, business, competitors, opportunities, post_summary):
        """Step 3: Final Strategy (Optionally with Search)."""
        template = load_prompt('strategy_prompt.txt')
        prompt = template.format(
            business_name=business.get('business_name'),
            category=business.get('category'),
            project_brief=business.get('project_brief'),
            goal=business.get('goal'),
            region=business.get('region'),
            competitors=", ".join([c['competitor_name'] for c in competitors]),
            post_summary=post_summary,
            opportunities=json.dumps(opportunities)
        )
        
        try:
            # We use search here as it's the most valuable step
            response = self._call_with_retry(prompt, use_search=True)
            return json.loads(self._strip_json(response.text))
        except Exception as e:
            return {"error": "Failed", "details": str(e)}

    def calculate_opportunity_score(self, engagement_score, intent_type):
        intent_weights = {'buying': 1.5, 'pain_point': 1.2, 'comparison': 1.0, 'discussion': 0.7}
        weight = intent_weights.get(intent_type.lower(), 0.5)
        return min(int(min(engagement_score, 50) * weight) + 20, 100)
