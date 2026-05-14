import os
from datetime import datetime, timedelta
from supabase import create_client, Client
from backend.services.tavily_service import call_tavily
from backend.pipeline.stage6_opportunities import run_stage6_opportunity_extraction

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def get_eligible_businesses():
    """Get businesses belonging to Starter or Pro users."""
    try:
        users_res = supabase.table('users').select('id, plan').in_('plan', ['starter', 'pro']).execute()
        if not users_res.data:
            return []
        
        user_ids = [u['id'] for u in users_res.data]
        bus_res = supabase.table('businesses').select('*').in_('user_id', user_ids).execute()
        return bus_res.data
    except Exception as e:
        print(f"Error fetching eligible businesses: {e}")
        return []

def run_opportunity_scanner():
    """Runs every 6 hours for Starter + Pro users."""
    print("Running Opportunity Scanner Job...")
    businesses = get_eligible_businesses()

    for business in businesses:
        try:
            b_id = business['id']
            
            # Check last run time (simplified: rely on APScheduler interval, 
            # but ideally we'd store last_scan_at in DB)
            
            memory_res = supabase.table('business_memory').select('*').eq('business_id', b_id).execute()
            if not memory_res.data:
                continue
            memory = memory_res.data[0]
            
            keywords = memory.get('keywords', [])[:3] # Top 3 keywords
            if not keywords:
                continue

            raw_results = []
            for keyword in keywords:
                res = call_tavily({
                    'query': f'site:reddit.com "looking for" OR "alternative to" {keyword}',
                    'depth': 'basic',
                    'max_results': 5
                })
                raw_results.extend(res.get('results', []))

            if raw_results:
                # We need pain_analysis and competitor_data for stage 6
                # Let's fetch them from the latest report
                rep_res = supabase.table('reports').select('pain_points, competitor_gaps').eq('business_id', b_id).order('created_at', desc=True).limit(1).execute()
                
                pain_analysis = {'pain_points': rep_res.data[0].get('pain_points', [])} if rep_res.data else {'pain_points': []}
                competitor_data = {'competitors': rep_res.data[0].get('competitor_gaps', [])} if rep_res.data else {'competitors': []}

                search_data = {'raw_results': raw_results}
                
                # Run stage 6 logic
                run_stage6_opportunity_extraction(search_data, pain_analysis, competitor_data, b_id, 'job_scanner', supabase)

        except Exception as e:
            print(f"Opportunity scanner failed for {business.get('id')}: {e}")
            continue

    print("Opportunity Scanner Job Complete.")
