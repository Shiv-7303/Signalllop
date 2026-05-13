from datetime import datetime, date
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

PLAN_LIMITS = {
    'free': {'reports': 1, 'competitors': 1},
    'starter': {'reports': 20, 'competitors': 5},
    'pro': {'reports': 50, 'competitors': 9999}
}

class UsageService:
    @staticmethod
    def get_usage(user_id):
        """Fetches current usage counts for a user. Auto-creates if missing."""
        response = supabase.table('usage_tracking').select('*').eq('user_id', user_id).execute()
        if not response.data:
            from datetime import date, timedelta
            reset_date = (date.today().replace(day=1) + timedelta(days=32)).replace(day=1)
            # Try to insert; if it fails (409), just ignore and fetch again
            try:
                supabase.table('usage_tracking').insert({
                    "user_id": user_id,
                    "monthly_reset_date": reset_date.isoformat(),
                    "reports_used": 0,
                    "competitors_used": 0
                }).execute()
            except Exception:
                pass
            response = supabase.table('usage_tracking').select('*').eq('user_id', user_id).execute()
            return response.data[0] if response.data else None
        return response.data[0]

    @staticmethod
    def get_plan(user_id):
        """Fetches the current plan of a user."""
        response = supabase.table('users').select('plan').eq('id', user_id).execute()
        return response.data[0]['plan'] if response.data else 'free'

    @staticmethod
    def check_report_limit(user_id):
        """Returns True if user is under their report limit."""
        UsageService.check_and_auto_reset(user_id)
        plan = UsageService.get_plan(user_id)
        usage = UsageService.get_usage(user_id)
        
        limit = PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])['reports']
        return usage['reports_used'] < limit if usage else False

    @staticmethod
    def check_competitor_limit(user_id):
        """Returns True if user is under their competitor limit."""
        UsageService.check_and_auto_reset(user_id)
        plan = UsageService.get_plan(user_id)
        usage = UsageService.get_usage(user_id)
        
        limit = PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])['competitors']
        return usage['competitors_used'] < limit if usage else False

    @staticmethod
    def increment_reports(user_id):
        """Increments the report count for a user."""
        usage = UsageService.get_usage(user_id)
        if usage:
            new_count = usage['reports_used'] + 1
            print(f"DEBUG: Incrementing reports for {user_id}. Old: {usage['reports_used']}, New: {new_count}")
            resp = supabase.table('usage_tracking').update({'reports_used': new_count}).eq('user_id', user_id).execute()
            print(f"DEBUG: Supabase update response: {resp.data}")

    @staticmethod
    def increment_competitors(user_id):
        """Increments the competitor count for a user."""
        usage = UsageService.get_usage(user_id)
        if usage:
            new_count = usage['competitors_used'] + 1
            supabase.table('usage_tracking').update({'competitors_used': new_count}).eq('user_id', user_id).execute()

    @staticmethod
    def decrement_competitors(user_id):
        """Decrements the competitor count for a user."""
        usage = UsageService.get_usage(user_id)
        if usage and usage['competitors_used'] > 0:
            new_count = usage['competitors_used'] - 1
            supabase.table('usage_tracking').update({'competitors_used': new_count}).eq('user_id', user_id).execute()

    @staticmethod
    def reset_monthly_usage(user_id):
        """Resets the usage counts for a new billing cycle."""
        today = date.today()
        if today.month == 12:
            next_month = today.replace(year=today.year + 1, month=1, day=1)
        else:
            next_month = today.replace(month=today.month + 1, day=1)
            
        supabase.table('usage_tracking').update({
            'reports_used': 0,
            'competitors_used': 0,
            'monthly_reset_date': next_month.isoformat()
        }).eq('user_id', user_id).execute()

    @staticmethod
    def check_and_auto_reset(user_id):
        """Checks if usage needs to be reset based on date."""
        # Directly fetch to avoid triggering get_usage's auto-insert again
        response = supabase.table('usage_tracking').select('monthly_reset_date, reports_used, competitors_used').eq('user_id', user_id).execute()
        usage = response.data[0] if response.data else None
        
        if not usage or not usage.get('monthly_reset_date'):
            return
            
        reset_date = datetime.strptime(usage['monthly_reset_date'], '%Y-%m-%d').date()
        if date.today() >= reset_date:
            UsageService.reset_monthly_usage(user_id)

    @staticmethod
    def get_remaining(user_id):
        """Returns a detailed usage object with remaining counts."""
        UsageService.check_and_auto_reset(user_id)
        plan = UsageService.get_plan(user_id)
        usage = UsageService.get_usage(user_id)
        
        limits = PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])
        
        reports_used = usage.get('reports_used', 0) if usage else 0
        competitors_used = usage.get('competitors_used', 0) if usage else 0
        
        return {
            'reports_used': reports_used,
            'reports_limit': limits['reports'],
            'reports_remaining': max(0, limits['reports'] - reports_used),
            'competitors_used': competitors_used,
            'competitors_limit': limits['competitors'],
            'competitors_remaining': max(0, limits['competitors'] - competitors_used),
            'plan': plan,
            'monthly_reset_date': usage.get('monthly_reset_date') if usage else None,
            'limits': limits
        }
