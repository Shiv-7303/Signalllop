import os
import json
from datetime import datetime
from supabase import create_client, Client
from backend.services.tavily_service import call_tavily
from backend.services.groq_service import call_groq, parse_json_safely

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def get_pro_businesses():
    """Get businesses belonging to Pro users."""
    try:
        users_res = supabase.table('users').select('id, plan').eq('plan', 'pro').execute()
        if not users_res.data:
            return []
        
        user_ids = [u['id'] for u in users_res.data]
        bus_res = supabase.table('businesses').select('*').in_('user_id', user_ids).execute()
        return bus_res.data
    except Exception as e:
        print(f"Error fetching Pro businesses: {e}")
        return []

def run_competitor_monitor():
    """Runs every 24 hours for Pro users."""
    print("Running Competitor Monitor Job...")
    businesses = get_pro_businesses()

    for business in businesses:
        try:
            b_id = business['id']
            
            comps_res = supabase.table('competitors').select('*').eq('business_id', b_id).execute()
            if not comps_res.data:
                continue

            for comp in comps_res.data:
                comp_name = comp['competitor_name']
                
                # 1 Basic search per competitor
                res = call_tavily({
                    'query': f'{comp_name} news pricing updates "new feature" 2025 2026',
                    'depth': 'basic',
                    'max_results': 5
                })

                results = res.get('results', [])
                if not results:
                    continue

                user_msg = f"""
                Analyze recent news/discussions about {comp_name}:
                {json.dumps([r.get('content', '')[:200] for r in results])}
                
                Return JSON with:
                - significant_activity (boolean)
                - new_pattern (string, what changed?)
                - alert_needed (boolean)
                """

                response = call_groq(
                    model='llama-3.1-8b-instant',
                    system_prompt="You are a competitor monitoring agent. Respond ONLY with valid JSON.",
                    user_message=user_msg,
                    max_tokens=300
                )
                
                analysis = parse_json_safely(response)
                
                # Update competitor in DB
                old_analysis = comp.get('analysis', {})
                old_analysis['latest_monitor_update'] = analysis
                
                supabase.table('competitors').update({
                    'analysis': old_analysis,
                    'last_analyzed_at': datetime.utcnow().isoformat()
                }).eq('id', comp['id']).execute()

                # In a real app, if analysis['alert_needed'] is True, we'd send an email/notification here.

        except Exception as e:
            print(f"Competitor monitor failed for {business.get('id')}: {e}")
            continue

    print("Competitor Monitor Job Complete.")
