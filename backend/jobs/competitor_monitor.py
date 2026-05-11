import os
import time
from supabase import create_client, Client
from backend.services.reddit_service import RedditService
from backend.services.groq_service import GroqService
from backend.services.competitor_service import CompetitorService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

reddit = RedditService()
ai = GroqService()
comp_service = CompetitorService()

def run_competitor_monitor():
    """
    Main job function for competitor monitoring.
    Runs daily analysis for Pro users' competitors and detects spikes.
    """
    print("CRON: Starting Competitor Monitor Job")
    start_time = time.time()
    
    try:
        # 1. Query all users with 'pro' plan
        users_res = supabase.table('users').select('id').eq('plan', 'pro').execute()
        users = users_res.data
        
        for user in users:
            user_id = user['id']
            # 2. Query their businesses and competitors
            # We can use the competitor_service for individual analysis
            biz_res = supabase.table('businesses').select('id').eq('user_id', user_id).execute()
            
            for biz in biz_res.data:
                business_id = biz['id']
                try:
                    # Fetch competitors for this business
                    comp_res = supabase.table('competitors').select('*').eq('business_id', business_id).execute()
                    
                    for comp in comp_res.data:
                        competitor_id = comp['id']
                        competitor_name = comp['competitor_name']
                        
                        # 3. Run analysis (already saves a 'competitor' type report)
                        analysis_res, status = comp_service.analyse_competitor(competitor_id, user_id)
                        
                        if status == 200:
                            # 4. Check for spikes (Logic from 4.4)
                            # Fetch yesterday's report count to compare
                            from datetime import datetime, timedelta
                            yesterday = (datetime.now() - timedelta(days=1)).isoformat()
                            
                            prev_res = supabase.table('reports')\
                                .select('report_data')\
                                .eq('business_id', business_id)\
                                .eq('report_type', 'competitor')\
                                .lt('created_at', yesterday)\
                                .order('created_at', desc=True).limit(1).execute()
                            
                            if prev_res.data:
                                prev_count = prev_res.data[0]['report_data'].get('mentions_count', 0)
                                curr_count = analysis_res.get('analysis', {}).get('mentions_count', 0)
                                
                                if curr_count > (prev_count * 1.5):
                                    print(f"NOTABLE SPIKE: {competitor_name} mentions up from {prev_count} to {curr_count}")
                                    # Future: Trigger alert notification
                                    
                        print(f"Daily monitor complete for competitor: {competitor_name}")
                        
                except Exception as e:
                    print(f"Error monitoring competitors for business {business_id}: {e}")
                    continue

        elapsed = time.time() - start_time
        print(f"CRON: Competitor Monitor finished in {elapsed:.2f}s")
        
    except Exception as e:
        print(f"CRON: Competitor Monitor Critical Error: {e}")
