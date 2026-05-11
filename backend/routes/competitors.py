import os
from flask import Blueprint, request, jsonify, g
from supabase import create_client, Client
from backend.utils.auth_middleware import require_auth
from backend.services.usage_service import UsageService
from backend.services.competitor_service import CompetitorService

competitors_bp = Blueprint('competitors', __name__)
comp_service = CompetitorService()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

@competitors_bp.route('/<business_id>/competitors/<competitor_id>/analyse', methods=['POST'])
@require_auth
def analyse_competitor_route(business_id, competitor_id):
    """Triggers a full analysis for a specific competitor."""
    user_id = g.user_id
    result, status_code = comp_service.analyse_competitor(competitor_id, user_id)
    return jsonify(result), status_code

@competitors_bp.route('/<business_id>/competitors', methods=['POST'])
@require_auth
def add_competitor(business_id):
    """Adds a competitor to a business, enforcing plan limits."""
    data = request.json
    user_id = g.user_id
    
    # 1. Verify business belongs to user
    business = supabase.table('businesses').select('id').eq('id', business_id).eq('user_id', user_id).single().execute()
    if not business.data:
        return jsonify({"error": "Business not found or access denied"}), 404
        
    # 2. Check competitor limit
    if not UsageService.check_competitor_limit(user_id):
        return jsonify({
            "error": "competitor_limit_exceeded",
            "upgrade_required": True
        }), 402
        
    # 3. Add competitor
    try:
        competitor_data = {
            "business_id": business_id,
            "competitor_name": data['competitor_name'],
            "website": data.get('website')
        }
        
        response = supabase.table('competitors').insert(competitor_data).execute()
        
        # 4. Increment usage count
        UsageService.increment_competitors(user_id)
        
        return jsonify(response.data[0]), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@competitors_bp.route('/<business_id>/competitors', methods=['GET'])
@require_auth
def get_competitors(business_id):
    """Lists all competitors for a business."""
    user_id = g.user_id
    
    # Verify business belongs to user
    business = supabase.table('businesses').select('id').eq('id', business_id).eq('user_id', user_id).single().execute()
    if not business.data:
        return jsonify({"error": "Business not found or access denied"}), 404
        
    try:
        response = supabase.table('competitors').select('*').eq('business_id', business_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@competitors_bp.route('/<business_id>/competitors/<competitor_id>', methods=['DELETE'])
@require_auth
def delete_competitor(business_id, competitor_id):
    """Deletes a competitor."""
    user_id = g.user_id
    
    # Verify business belongs to user
    business = supabase.table('businesses').select('id').eq('id', business_id).eq('user_id', user_id).single().execute()
    if not business.data:
        return jsonify({"error": "Business not found or access denied"}), 404
        
    try:
        supabase.table('competitors').delete().eq('id', competitor_id).eq('business_id', business_id).execute()
        UsageService.decrement_competitors(user_id)
        return jsonify({"message": "Competitor removed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
