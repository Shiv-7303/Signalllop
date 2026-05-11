from flask import Blueprint, jsonify, g
from backend.utils.auth_middleware import require_auth
from backend.services.usage_service import UsageService

usage_bp = Blueprint('usage', __name__)

@usage_bp.route('/', methods=['GET'])
@require_auth
def get_usage():
    """Returns the current usage stats for the authenticated user."""
    user_id = g.user_id
    try:
        # get_remaining internally handles check_and_auto_reset
        usage_data = UsageService.get_remaining(user_id)
        return jsonify(usage_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@usage_bp.route('/limits', methods=['GET'])
def get_all_limits():
    """Returns the plan limits (static data)."""
    from backend.services.usage_service import PLAN_LIMITS
    return jsonify(PLAN_LIMITS), 200
