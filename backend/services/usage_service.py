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
        """Fetches current usage counts for a user."""
        response = supabase.table('usage_tracking').select('*').eq('user_id', user_id).single().execute()
        return response.data

    @staticmethod
    def get_plan(user_id):
        """Fetches the current plan of a user."""
        response = supabase.table('users').select('plan').eq('id', user_id).single().execute()
        return response.data['plan'] if response.data else 'free'

    @staticmethod
    def check_report_limit(user_id):
        """Returns True if user is under their report limit."""
        UsageService.check_and_auto_reset(user_id)
        plan = UsageService.get_plan(user_id)
        usage = supabase.table('usage_tracking').select('reports_used').eq('user_id', user_id).single().execute()
        
        limit = PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])['reports']
        return usage.data['reports_used'] < limit if usage.data else False

    @staticmethod
    def check_competitor_limit(user_id):
        """Returns True if user is under their competitor limit."""
        UsageService.check_and_auto_reset(user_id)
        plan = UsageService.get_plan(user_id)
        usage = supabase.table('usage_tracking').select('competitors_used').eq('user_id', user_id).single().execute()
        
        limit = PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])['competitors']
        return usage.data['competitors_used'] < limit if usage.data else False

    @staticmethod
    def increment_reports(user_id):
        """Increments the report count for a user."""
        usage = supabase.table('usage_tracking').select('reports_used').eq('user_id', user_id).single().execute()
        if usage.data:
            new_count = usage.data['reports_used'] + 1
            supabase.table('usage_tracking').update({'reports_used': new_count}).eq('user_id', user_id).execute()

    @staticmethod
    def increment_competitors(user_id):
        """Increments the competitor count for a user."""
        usage = supabase.table('usage_tracking').select('competitors_used').eq('user_id', user_id).single().execute()
        if usage.data:
            new_count = usage.data['competitors_used'] + 1
            supabase.table('usage_tracking').update({'competitors_used': new_count}).eq('user_id', user_id).execute()

    @staticmethod
    def decrement_competitors(user_id):
        """Decrements the competitor count for a user."""
        usage = supabase.table('usage_tracking').select('competitors_used').eq('user_id', user_id).single().execute()
        if usage.data and usage.data['competitors_used'] > 0:
            new_count = usage.data['competitors_used'] - 1
            supabase.table('usage_tracking').update({'competitors_used': new_count}).eq('user_id', user_id).execute()

    @staticmethod
    def reset_monthly_usage(user_id):
        """Resets the usage counts for a new billing cycle."""
        # Simple month increment
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
        usage = UsageService.get_usage(user_id)
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
        
        reports_used = usage.get('reports_used', 0)
        competitors_used = usage.get('competitors_used', 0)
        
        return {
            'reports_used': reports_used,
            'reports_limit': limits['reports'],
            'reports_remaining': max(0, limits['reports'] - reports_used),
            'competitors_used': competitors_used,
            'competitors_limit': limits['competitors'],
            'competitors_remaining': max(0, limits['competitors'] - competitors_used),
            'plan': plan,
            'monthly_reset_date': usage.get('monthly_reset_date'),
            'limits': limits
        }
