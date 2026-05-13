import os
from flask import Blueprint, request, jsonify, g
from supabase import create_client, Client
from backend.utils.auth_middleware import require_auth

auth_bp = Blueprint('auth', __name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

@auth_bp.route('/verify', methods=['POST'])
@require_auth
def verify_user():
    """
    Verifies the Supabase JWT and returns the user profile.
    Ensures user record and usage tracking exist.
    """
    user_id = g.user_id
    email = g.user.email
    name = g.user.user_metadata.get('full_name') if hasattr(g, 'user') and g.user.user_metadata else None
    
    try:
        # 1. Fetch or Create User safety (Trigger should handle this normally)
        response = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not response.data:
            # Fallback creation
            response = supabase.table('users').insert({
                "id": user_id,
                "email": email,
                "name": name,
                "plan": "free"
            }).execute()
            user_data = response.data[0] if response.data else None
        else:
            user_data = response.data[0]
            
        if not user_data:
            return jsonify({"error": "Failed to fetch or create user"}), 500
        
        # 2. Ensure usage tracking exists
        usage_res = supabase.table('usage_tracking').select('*').eq('user_id', user_id).execute()
        if not usage_res.data:
            from datetime import date, timedelta
            reset_date = (date.today().replace(day=1) + timedelta(days=32)).replace(day=1)
            supabase.table('usage_tracking').insert({
                "user_id": user_id,
                "monthly_reset_date": reset_date.isoformat(),
                "reports_used": 0,
                "competitors_used": 0
            }).execute()
            
        return jsonify({
            "user": user_data,
            "plan": user_data.get('plan', 'free')
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    """Logs out the user (client-side cleanup)."""
    return jsonify({"message": "Successfully logged out"}), 200

@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_me():
    """Returns the currently authenticated user's profile."""
    user_id = g.user_id
    
    try:
        response = supabase.table('users').select('*').eq('id', user_id).execute()
        if not response.data:
             return jsonify({"error": "User not found"}), 404
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
