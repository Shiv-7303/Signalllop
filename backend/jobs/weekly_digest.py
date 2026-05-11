import os
import time
from supabase import create_client, Client
from backend.services.reddit_service import RedditService
from backend.services.groq_service import GroqService
from backend.services.email_service import EmailService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

reddit = RedditService()
ai = GroqService()
email_service = EmailService()

def run_weekly_digest():
    """
    Main job function for weekly digests.
    Generates and emails a summary of the week's growth opportunities.
    """
    print("CRON: Starting Weekly Digest Job")
    start_time = time.time()
    
    try:
        # 1. Query all distinct users who have businesses
        users_res = supabase.table('users').select('id, email, name').execute()
        users = users_res.data
        
        for user in users:
            user_id = user['id']
            user_email = user['email']
            
            # 2. Query user's businesses
            biz_res = supabase.table('businesses').select('*').eq('user_id', user_id).execute()
            businesses = biz_res.data
            
            for biz in businesses:
                try:
                    business_id = biz['id']
                    business_name = biz['business_name']
                    
                    # 3. Fetch opportunities from the last 7 days
                    from datetime import datetime, timedelta
                    seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
                    
                    opt_res = supabase.table('opportunities').select('*')\
                        .eq('business_id', business_id)\
                        .gt('created_at', seven_days_ago)\
                        .order('opportunity_score', desc=True).execute()
                    
                    new_opts = opt_res.data
                    if not new_opts:
                        continue # Skip if no new data
                        
                    # 4. Generate Digest with Gemini
                    # We pass the top opportunities and any detected trends
                    # (Trends could be extracted from common keywords in new_opts)
                    trends = reddit.get_trending_keywords('all', limit=5) # Placeholder broad scan
                    
                    digest_data = ai.generate_weekly_digest(biz, new_opts[:10], trends)
                    
                    # 5. Save to weekly_digests table
                    supabase.table('weekly_digests').insert({
                        "business_id": business_id,
                        "digest_data": digest_data
                    }).execute()
                    
                    # 6. Send Email
                    # Subject: Your weekly growth digest is ready
                    stats = {"new_opportunities": len(new_opts)}
                    html_content = email_service.get_digest_template(business_name, stats)
                    # Add more detail from digest_data to html_content if needed
                    
                    email_service.send_email(user_email, f"Weekly Growth Digest: {business_name}", html_content)
                    print(f"Weekly digest sent to {user_email} for {business_name}")
                    
                except Exception as e:
                    print(f"Error generating digest for business {biz.get('id')}: {e}")
                    continue

        elapsed = time.time() - start_time
        print(f"CRON: Weekly Digest finished in {elapsed:.2f}s")
        
    except Exception as e:
        print(f"CRON: Weekly Digest Critical Error: {e}")
