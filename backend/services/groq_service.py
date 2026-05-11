import os
import json
import re
from groq import Groq
from backend.config import Config
from backend.services.prompt_loader import load_prompt

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        # Using Llama 3.3 70B for high performance strategy
        self.model_name = 'llama-3.3-70b-versatile'
        
        print("\n" + "="*50)
        print(f"🚀 AI ENGINE MIGRATED: Using Groq ({self.model_name})")
        print("="*50 + "\n")

    def _strip_json(self, text):
        """Robustly strips markdown code fences and non-JSON preamble/postamble."""
        if not text: return ""
        # Find first { or [ and last } or ]
        match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
        if match:
            return match.group(0)
        return text

    def generate_keywords(self, business_description):
        """Step 1: Expand keywords."""
        prompt = f"Act as a growth hacker. Return a JSON object with a key 'keywords' containing a list of 10 Reddit search keywords for: {business_description}"
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(self._strip_json(completion.choices[0].message.content))
            
            # Extract list regardless of key used by AI
            if isinstance(data, dict):
                for key in ['keywords', 'search_terms', 'reddit_keywords']:
                    if key in data and isinstance(data[key], list):
                        return data[key]
                # Fallback: return first list found in dict
                for val in data.values():
                    if isinstance(val, list): return val
            
            return data if isinstance(data, list) else ["marketing", "growth"]
        except Exception as e:
            print(f"Groq Keyword Error: {e}")
            return ["marketing", "growth", "reddit"]

    def generate_combined_analysis(self, posts_list, business_context_dict, is_virtual=False):
        """Step 2: Combined Summary + Opportunities (Virtual Support)."""
        business_desc = f"{business_context_dict['business_name']} ({business_context_dict['category']})"
        
        if is_virtual:
            # SYNTHETIC RESEARCH PROMPT
            prompt = f"""
            You are a growth strategist performing Virtual Reddit Research for {business_desc}.
            Since we don't have live API access, you must use your knowledge of Reddit discussions in this niche.
            
            Generate a JSON object with:
            1. "summary": A 200-word analysis of common pain points, complaints, and trending topics for this niche on Reddit.
            2. "opportunities": A list of 5 realistic 'simulated' Reddit opportunities.
               Each must have: (title, ai_summary, recommended_action, opportunity_score [70-95], intent_type [buying/pain_point]).
               
            Return ONLY valid JSON.
            """
        else:
            posts_text = ""
            for i, post in enumerate(posts_list[:15]):
                posts_text += f"Post {i+1}: {post['title']} | {post['selftext'][:400]}\n"

            prompt = f"""
            You are a growth strategist for {business_desc}.
            Analyze these Reddit posts and return a JSON object with two keys:
            1. "summary": A 200-word analysis of pain points and themes.
            2. "opportunities": A list of objects each with (title, ai_summary, recommended_action, opportunity_score, intent_type).
            
            Posts:
            {posts_text}
            
            Return ONLY valid JSON.
            """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(self._strip_json(completion.choices[0].message.content))
            return data.get('summary', ""), data.get('opportunities', [])
        except Exception as e:
            print(f"Groq Combined Analysis Error: {e}")
            return "Analysis failed.", []

    def generate_strategy_report(self, business, competitors, opportunities, post_summary, is_virtual=False):
        """Step 3: Final Strategy Report (Virtual Support)."""
        template = load_prompt('strategy_prompt.txt')
        
        # Inject Virtual context if needed
        virtual_suffix = "\nNOTE: This is a virtual research report based on deep niche intelligence." if is_virtual else ""
        
        prompt = template.format(
            business_name=business.get('business_name'),
            category=business.get('category'),
            target_audience=business.get('target_audience'),
            goal=business.get('goal'),
            region=business.get('region'),
            competitors=", ".join([c['competitor_name'] for c in competitors]),
            post_summary=post_summary + virtual_suffix,
            opportunities=json.dumps(opportunities)
        )
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(self._strip_json(completion.choices[0].message.content))
        except Exception as e:
            print(f"Groq Strategy Error: {e}")
            return {"error": "Failed", "details": str(e)}

    def generate_competitor_analysis(self, competitor_name, website, mentions_summary):
        """Generates analysis for a specific competitor."""
        template = load_prompt('competitor_prompt.txt')
        prompt = template.format(
            competitor_name=competitor_name, 
            website=website,
            reddit_mentions_summary=mentions_summary
        )
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(self._strip_json(completion.choices[0].message.content))
        except Exception as e:
            print(f"Groq Competitor Error: {e}")
            return {"error": "failed"}

    def generate_weekly_digest(self, business, new_opportunities, trends):
        """Generates a weekly digest summary."""
        prompt = f"""
        Generate a weekly growth digest for: {business['business_name']}.
        Opportunities found: {len(new_opportunities)}
        Trends: {json.dumps(trends)}
        
        Return a JSON object with: 
        new_discussions_count, rising_keywords (list), competitor_trends (list), 
        top_trend, best_community, best_action, digest_summary (100 words).
        """
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(self._strip_json(completion.choices[0].message.content))
        except Exception:
            return {"error": "Failed"}
