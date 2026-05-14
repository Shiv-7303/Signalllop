import os
import json
from datetime import date
from supabase import create_client, Client
from backend.services.tavily_service import call_tavily
from backend.services.groq_service import call_groq, parse_json_safely
from backend.services.email_service import send_weekly_digest_email

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def get_all_active_businesses():
    try:
        response = supabase.table('businesses').select('*').execute()
        return response.data
    except Exception:
        return []

def load_prompt():
    prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'weekly_digest.txt')
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def run_weekly_digest():
    """Runs every Monday morning."""
    print("Running Weekly Digest Job...")
    all_businesses = get_all_active_businesses()

    for business in all_businesses:
        try:
            # Check user plan (skip if needed, but spec says ALL plans for digest)
            user_id = business['user_id']
            business_id = business['id']
            
            memory_res = supabase.table('business_memory').select('*').eq('business_id', business_id).execute()
            if not memory_res.data:
                continue
            memory = memory_res.data[0]

            keywords = memory.get('keywords', [])[:4]
            if not keywords:
                continue

            # 4 Basic searches
            new_results = []
            for keyword in keywords:
                result = call_tavily({
                    'query': f'site:reddit.com {keyword} discussion 2025 2026',
                    'depth': 'basic',
                    'max_results': 5
                })
                new_results.extend(result.get('results', []))

            # Generate digest
            user_msg = f"""
            Business: {business.get('business_name')}
            Category: {business.get('category')}
            
            Recent Search Results:
            {json.dumps([r.get('content', '')[:200] for r in new_results[:10]])}
            """
            
            response = call_groq(
                model='llama-3.1-8b-instant',
                system_prompt=load_prompt(),
                user_message=user_msg,
                max_tokens=600
            )
            digest = parse_json_safely(response)

            # Save
            digest_data = {
                "business_id": business_id,
                "new_opps": digest.get('new_opps_count', len(new_results)),
                "rising_keywords": digest.get('rising_keywords', []),
                "competitor_trends": digest.get('competitor_trends', []),
                "top_action": digest.get('top_action', ''),
                "digest_data": digest,
                "week_of": date.today().isoformat()
            }
            supabase.table('weekly_digests').insert(digest_data).execute()

            # Email
            user_res = supabase.table('users').select('*').eq('id', user_id).execute()
            if user_res.data:
                user = user_res.data[0]
                send_weekly_digest_email(user['email'], user.get('name', ''), business['business_name'], digest)

        except Exception as e:
            print(f"Weekly digest failed for {business.get('id')}: {e}")
            continue
    print("Weekly Digest Job Complete.")
