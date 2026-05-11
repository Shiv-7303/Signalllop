import os
from supabase import create_client, Client
from backend.services.reddit_service import RedditService
from backend.services.groq_service import GroqService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

class CompetitorService:
    def __init__(self):
        self.reddit = RedditService()
        self.ai = GroqService()

    def analyse_competitor(self, competitor_id, user_id):
        """Runs a full analysis for a specific competitor."""
        try:
            # 1. Fetch Competitor + Business Context
            res = supabase.table('competitors').select('*, businesses(*)').eq('id', competitor_id).single().execute()
            if not res.data or res.data['businesses']['user_id'] != user_id:
                return {"error": "Competitor not found or access denied"}, 404
            
            competitor = res.data
            comp_name = competitor['competitor_name']
            comp_website = competitor.get('website', '')
            business_id = competitor['business_id']
            business_context = f"{competitor['businesses']['business_name']} - {competitor['businesses']['category']}"
            
            # 2. Fetch Reddit mentions
            # Checklist 3.15: Build search queries from name and website
            keywords = [comp_name]
            if comp_website:
                domain = comp_website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]
                keywords.append(domain)
                
            mentions = self.reddit.search_posts(['all', 'SaaS', 'startups', 'technology'], keywords, limit_per=15)
            # Checklist 3.15: Build summary of mentions
            mentions_summary = self.ai.summarise_posts(mentions, business_context)
            
            # 3. Analyse via Groq
            # Checklist 3.15: Call generate_competitor_analysis(name, website, mentions)
            analysis_data = self.ai.generate_competitor_analysis(comp_name, comp_website, mentions_summary)
            
            # 4. Save to reports table
            report_insert = {
                "business_id": business_id,
                "report_type": "competitor",
                "report_data": {
                    "competitor_name": comp_name,
                    "website": comp_website,
                    "analysis": analysis_data,
                    "mentions_count": len(mentions)
                },
                "status": "complete"
            }
            response = supabase.table('reports').insert(report_insert).execute()
            
            return {
                "message": "Competitor analysis complete",
                "report_id": response.data[0]['id'],
                "analysis": analysis_data
            }, 200
            
        except Exception as e:
            print(f"Competitor Analysis Error: {e}")
            return {"error": str(e)}, 500

    def run_competitor_analysis_for_business(self, business_id, user_id):
        """Runs analysis for all competitors of a business."""
        try:
            # Fetch all competitors
            comp_res = supabase.table('competitors').select('id').eq('business_id', business_id).execute()
            competitors = comp_res.data
            
            results = []
            for comp in competitors:
                res, _ = self.analyse_competitor(comp['id'], user_id)
                results.append(res)
                
            return results
        except Exception as e:
            print(f"Batch Competitor Analysis Error: {e}")
            return []
