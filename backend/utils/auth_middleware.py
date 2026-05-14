import os
from functools import wraps
from flask import request, jsonify, g
from supabase import create_client, Client

def get_supabase_client():
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("ERROR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in auth_middleware!")
    return create_client(url, key)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            print("Auth Error: Missing Authorization header")
            return jsonify({"error": "missing_token"}), 401
        
        try:
            # Expecting "Bearer <token>"
            token = auth_header.split(" ")[1]
            print(f"Auth token prefix: {token[:10]}")
            # Verify the token with Supabase
            supabase = get_supabase_client()
            user_response = supabase.auth.get_user(token)
            
            print(f"User response: {user_response}")
            if not user_response or not user_response.user:
                print("Auth Error: Supabase get_user returned empty or no user")
                return jsonify({"error": "invalid_token"}), 401
            
            # Attach user to g for use in routes
            g.user = user_response.user
            g.user_id = user_response.user.id
            
        except Exception as e:
            print(f"Auth Error Exception: {e}")
            return jsonify({"error": "invalid_token", "message": str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated
