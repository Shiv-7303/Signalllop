import os
from functools import wraps
from flask import request, jsonify, g
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "missing_token"}), 401
        
        try:
            # Expecting "Bearer <token>"
            token = auth_header.split(" ")[1]
            # Verify the token with Supabase
            # Note: auth.get_user(token) verifies the JWT
            user_response = supabase.auth.get_user(token)
            
            if not user_response or not user_response.user:
                return jsonify({"error": "invalid_token"}), 401
            
            # Attach user to g for use in routes
            g.user = user_response.user
            g.user_id = user_response.user.id
            
        except Exception as e:
            return jsonify({"error": "invalid_token", "message": str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated
