from functools import wraps
from flask import jsonify, g
from backend.services.usage_service import UsageService
from backend.config import PLAN_LIMITS

def check_usage_limit(resource: str):
    """
    Decorator factory for usage limit checks.
    Usage: @check_usage_limit('reports')
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_id = g.user_id
            
            # Ensure auto-reset happens if needed
            UsageService.check_and_auto_reset(user_id)
            
            plan = UsageService.get_plan(user_id)
            limits = PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])
            usage = UsageService.get_usage(user_id)

            if resource == 'reports':
                max_allowed = limits['reports_per_month']
                reports_used = usage.get('reports_used', 0) if usage else 0

                if max_allowed != -1 and reports_used >= max_allowed:
                    return jsonify({
                        'error': 'limit_exceeded',
                        'message': f'You have used all {max_allowed} reports this month.',
                        'current_plan': plan,
                        'upgrade_url': '/pricing'
                    }), 402

            elif resource == 'competitors':
                max_allowed = limits['competitors']
                if max_allowed != -1:
                    competitors_used = usage.get('competitors_used', 0) if usage else 0
                    # The actual check logic usually happens before adding *multiple* competitors 
                    # but this provides a base level check
                    if competitors_used >= max_allowed:
                        return jsonify({
                            'error': 'competitor_limit',
                            'message': f'Max {max_allowed} competitors on your plan.',
                            'upgrade_url': '/pricing'
                        }), 402

            return f(*args, **kwargs)
        return decorated
    return decorator
