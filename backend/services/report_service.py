import os
import time
from supabase import create_client, Client
from backend.services.reddit_service import RedditService
from backend.services.groq_service import GroqService
from backend.services.usage_service import UsageService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

class ReportService:
    def __init__(self):
        self.reddit = RedditService()
        self.ai = GroqService()

    def generate_report(self, business_id, user_id):
        """Orchestrates the optimized 2-step AI pipeline using Groq."""
        start_time = time.time()
        
        try:
            UsageService.check_and_auto_reset(user_id)
            if not UsageService.check_report_limit(user_id):
                return {"error": "report_limit_exceeded", "upgrade_required": True}, 402

            business_res = supabase.table('businesses').select('*').eq('id', business_id).eq('user_id', user_id).single().execute()
            if not business_res.data:
                return {"error": "business_not_found"}, 404
            business = business_res.data
            
            competitors_res = supabase.table('competitors').select('*').eq('business_id', business_id).execute()
            competitors = competitors_res.data
            
            # --- OPTIMIZED AI PIPELINE ---
            
            # 1. Expand Keywords
            print("PIPELINE Step 1: Expanding keywords via Groq...")
            keywords = self.ai.generate_keywords(business['business_name'])
            time.sleep(3) # Short spacing for Groq
            
            # 2. Reddit Search
            print("PIPELINE: Searching Reddit...")
            subreddits = self.reddit.search_subreddits(keywords, limit=5)
            sub_names = [s['display_name'] for s in subreddits]
            posts = self.reddit.search_posts(sub_names[:3], keywords[:3], limit_per=15)
            
            # --- VIRTUAL FALLBACK TRIGGER ---
            is_virtual = len(posts) == 0
            if is_virtual:
                print("PIPELINE: No real Reddit data found. Triggering Virtual Research Fallback.")
            
            # 3. Combined Summary + Opportunity Extraction
            print("PIPELINE Step 2: Analyzing discussions & extracting opportunities...")
            summary, raw_opportunities = self.ai.generate_combined_analysis(posts, business, is_virtual=is_virtual)
            time.sleep(3) # Short spacing for Groq
            
            # 4. Final Strategy Report
            print("PIPELINE Step 3: Building final strategy report...")
            report_data = self.ai.generate_strategy_report(business, competitors, raw_opportunities, summary, is_virtual=is_virtual)
            
            # --- DATABASE PERSISTENCE ---

            is_failed = "error" in report_data
            report_insert = {
                "business_id": business_id,
                "report_type": "growth",
                "report_data": report_data,
                "status": "failed" if is_failed else "complete"
            }
            report_res = supabase.table('reports').insert(report_insert).execute()
            report_id = report_res.data[0]['id']
            
            if is_failed:
                return {"report_id": report_id, "report_data": report_data, "error": "AI Quota Exhausted"}, 200

            # Insert Opportunities
            for opt in raw_opportunities:
                opt_data = {
                    "business_id": business_id,
                    "title": opt.get('title'),
                    "source": "reddit",
                    "opportunity_score": opt.get('opportunity_score', 50),
                    "intent_type": opt.get('intent_type', 'discussion'),
                    "ai_summary": opt.get('ai_summary'),
                    "recommended_action": opt.get('recommended_action'),
                    "url": opt.get('url', 'https://reddit.com')
                }
                try:
                    supabase.table('opportunities').upsert(opt_data, on_conflict='business_id, url').execute()
                except: pass
                
            UsageService.increment_reports(user_id)
            print(f"DEBUG: Report generated successfully in {time.time() - start_time:.2f}s")
            
            return {"report_id": report_id, "report_data": report_data}, 200
            
        except Exception as e:
            print(f"PIPELINE CRASH: {e}")
            return {"error": "generation_failed", "message": str(e)}, 500
