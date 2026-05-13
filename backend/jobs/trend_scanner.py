import os
import time
from supabase import create_client, Client
from backend.services.reddit_service import RedditService
from backend.services.groq_service import GroqService
from backend.services.usage_service import UsageService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

reddit = RedditService()
ai = GroqService()

def run_opportunity_scanner():
    """
    Main job function for opportunity scanning.
    Scans Reddit for new opportunities for Starter and Pro users.
    """
    print("CRON: Starting Opportunity Scanner Job")
    start_time = time.time()
    new_count = 0
    
    try:
        # 1. Query all users with 'starter' or 'pro' plan
        users_res = supabase.table('users').select('id, email, plan').in_('plan', ['starter', 'pro']).execute()
        users = users_res.data
        
        for user in users:
            user_id = user['id']
            # 2. Query their businesses
            biz_res = supabase.table('businesses').select('*').eq('user_id', user_id).execute()
            businesses = biz_res.data
            
            for biz in businesses:
                try:
                    business_id = biz['id']
                    business_desc = f"{biz['business_name']} - {biz['category']}. Brief: {biz['project_brief']}. Goal: {biz['goal']}"
                    
                    # 3. Generate keywords
                    keywords = ai.generate_keywords(business_desc)
                    if not keywords: continue
                    
                    # 4. Search subreddits
                    subreddits = reddit.search_subreddits(keywords, limit=5)
                    sub_names = [s['display_name'] for s in subreddits]
                    if not sub_names: sub_names = ['all'] # Fallback
                    
                    # 5. Search posts (limit_per=15 as per checklist)
                    posts = reddit.search_posts(sub_names[:3], keywords[:5], limit_per=15)
                    
                    # 6. Process and save new opportunities
                    for post in posts:
                        engagement = reddit.calculate_engagement_score(post)
                        # Checklist 4.3: Only if engagement > 20
                        if engagement < 20: continue
                        
                        intent = ai.categorise_intent(post['title'], post['selftext'])
                        
                        opt_data = {
                            "business_id": business_id,
                            "title": post['title'],
                            "source": "reddit",
                            "subreddit": post['subreddit'],
                            "url": post['url'],
                            "engagement_score": engagement,
                            "opportunity_score": ai.calculate_opportunity_score(engagement, intent),
                            "intent_type": intent,
                            "ai_summary": post['selftext'][:500], # Basic summary for feed
                            "created_at": "now()"
                        }
                        
                        # Use upsert to skip duplicates
                        supabase.table('opportunities').upsert(opt_data, on_conflict='business_id, url').execute()
                        new_count += 1
                        
                        # Cap at 50 per business per scan
                        if new_count % 50 == 0: break
                        
                except Exception as e:
                    print(f"Error scanning for business {biz.get('id')}: {e}")
                    continue

        elapsed = time.time() - start_time
        print(f"CRON: Opportunity Scanner finished. Found/Upserted ~{new_count} opportunities in {elapsed:.2f}s")
        
    except Exception as e:
        print(f"CRON: Opportunity Scanner Critical Error: {e}")
