import os
from supabase import create_client, Client
from backend.services.usage_service import UsageService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

class OpportunityService:
    @staticmethod
    def get_opportunities(business_id, user_id):
        """Fetches opportunities for a business, enforcing plan-based filtering."""
        plan = UsageService.get_plan(user_id)
        
        try:
            # Check ownership of business
            business = supabase.table('businesses').select('id').eq('id', business_id).eq('user_id', user_id).single().execute()
            if not business.data:
                return []

            response = supabase.table('opportunities').select('*').eq('business_id', business_id).order('opportunity_score', desc=True).execute()
            opportunities = response.data
            
            # Plan-based filtering (Checklist 3.13)
            if plan == 'free':
                # Return only top 3, basic fields
                filtered = []
                for opt in opportunities[:3]:
                    filtered.append({
                        "id": opt["id"],
                        "title": opt["title"],
                        "subreddit": opt["subreddit"],
                        "engagement_score": opt["engagement_score"],
                        "url": opt["url"]
                    })
                return filtered
            elif plan == 'starter':
                # Return up to 20
                return opportunities[:20]
            else:
                # Pro gets all
                return opportunities
                
        except Exception as e:
            print(f"Fetch Opportunities Error: {e}")
            return []

    @staticmethod
    def save_opportunity(user_id, opportunity_id):
        """Bookmarks an opportunity for a user."""
        try:
            data = {"user_id": user_id, "opportunity_id": opportunity_id}
            response = supabase.table('saved_opportunities').insert(data).execute()
            return response.data[0]
        except Exception as e:
            # Checklist 3.13: On unique constraint violation (already saved): return existing row silently
            try:
                existing = supabase.table('saved_opportunities').select('*').eq('user_id', user_id).eq('opportunity_id', opportunity_id).single().execute()
                return existing.data
            except Exception:
                print(f"Save Opportunity Error: {e}")
                return None

    @staticmethod
    def unsave_opportunity(user_id, opportunity_id):
        """Removes a bookmark."""
        try:
            supabase.table('saved_opportunities').delete().eq('user_id', user_id).eq('opportunity_id', opportunity_id).execute()
            return True
        except Exception as e:
            print(f"Unsave Opportunity Error: {e}")
            return False

    @staticmethod
    def get_saved_opportunities(user_id):
        """Fetches all bookmarked opportunities for a user."""
        try:
            # Join saved_opportunities with opportunities table
            response = supabase.table('saved_opportunities').select('*, opportunities(*)').eq('user_id', user_id).order('saved_at', desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Fetch Saved Opportunities Error: {e}")
            return []
