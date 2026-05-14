import os
from flask import Blueprint, request, jsonify, g
from supabase import create_client, Client
from backend.utils.auth_middleware import require_auth
from backend.utils.validators import validate_business, sanitise_string

businesses_bp = Blueprint('businesses', __name__)

def get_supabase():
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

@businesses_bp.route('/', methods=['POST'])
@require_auth
def create_business():
    """Creates a new business for the authenticated user."""
    data = request.json
    user_id = g.user_id
    supabase = get_supabase()
    
    # 1. Validation
    is_valid, error_msg = validate_business(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400
        
    # 2. Check business count limit for MVP
    try:
        count_resp = supabase.table('businesses').select('id', count='exact').eq('user_id', user_id).execute()
        if count_resp.count >= 5: # Increased to 5 for flexibility
            return jsonify({"error": "Business limit reached"}), 402
    except Exception as e:
        return jsonify({"error": str(e)}), 500
            
    try:
        business_data = {
            "user_id": user_id,
            "business_name": sanitise_string(data['business_name']),
            "website": data.get('website'),
            "category": sanitise_string(data.get('category', 'SaaS')),
            "description": sanitise_string(data.get('project_brief', '')),
            "target_audience": sanitise_string(data.get('target_audience', '')),
            "goal": sanitise_string(data.get('goal', 'Growth')),
            "region": sanitise_string(data.get('region', 'Global'))
        }
        
        response = supabase.table('businesses').insert(business_data).execute()
        return jsonify(response.data[0]), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@businesses_bp.route('/', methods=['GET'])
@require_auth
def get_businesses():
    """Returns all businesses for the authenticated user."""
    user_id = g.user_id
    supabase = get_supabase()
    
    try:
        response = supabase.table('businesses').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@businesses_bp.route('/<business_id>', methods=['GET'])
@require_auth
def get_business(business_id):
    """Returns a single business if it belongs to the user."""
    user_id = g.user_id
    supabase = get_supabase()
    
    try:
        response = supabase.table('businesses').select('*').eq('id', business_id).eq('user_id', user_id).single().execute()
        if not response.data:
            return jsonify({"error": "Business not found or access denied"}), 404
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": "not found"}), 404

@businesses_bp.route('/<business_id>', methods=['PUT'])
@require_auth
def update_business(business_id):
    """Updates a business if it belongs to the user."""
    data = request.json
    user_id = g.user_id
    supabase = get_supabase()
    
    try:
        # Check ownership first
        check = supabase.table('businesses').select('id').eq('id', business_id).eq('user_id', user_id).single().execute()
        if not check.data:
            return jsonify({"error": "Business not found or access denied"}), 404
            
        response = supabase.table('businesses').update(data).eq('id', business_id).execute()
        return jsonify(response.data[0]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@businesses_bp.route('/<business_id>', methods=['DELETE'])
@require_auth
def delete_business(business_id):
    """Deletes a business if it belongs to the user."""
    user_id = g.user_id
    supabase = get_supabase()
    
    try:
        # Check ownership
        check = supabase.table('businesses').select('id').eq('id', business_id).eq('user_id', user_id).single().execute()
        if not check.data:
            return jsonify({"error": "Business not found or access denied"}), 404
            
        supabase.table('businesses').delete().eq('id', business_id).execute()
        return jsonify({"deleted": True}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
