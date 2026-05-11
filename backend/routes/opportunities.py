from flask import Blueprint, request, jsonify, g
from backend.utils.auth_middleware import require_auth
from backend.services.opportunity_service import OpportunityService

opportunities_bp = Blueprint('opportunities', __name__)

@opportunities_bp.route('/', methods=['GET'])
@require_auth
def list_opportunities():
    """Lists opportunities for a business."""
    business_id = request.args.get('business_id')
    user_id = g.user_id
    
    if not business_id:
        return jsonify({"error": "business_id is required"}), 400
        
    opportunities = OpportunityService.get_opportunities(business_id, user_id)
    return jsonify(opportunities), 200

@opportunities_bp.route('/save', methods=['POST'])
@require_auth
def save_opportunity():
    """Bookmarks an opportunity."""
    data = request.json
    opportunity_id = data.get('opportunity_id')
    user_id = g.user_id
    
    if not opportunity_id:
        return jsonify({"error": "opportunity_id is required"}), 400
        
    result = OpportunityService.save_opportunity(user_id, opportunity_id)
    if result:
        return jsonify(result), 201
    return jsonify({"error": "Failed to save opportunity"}), 500

@opportunities_bp.route('/save/<opportunity_id>', methods=['DELETE'])
@require_auth
def unsave_opportunity(opportunity_id):
    """Removes a bookmark."""
    user_id = g.user_id
    
    success = OpportunityService.unsave_opportunity(user_id, opportunity_id)
    if success:
        return jsonify({"message": "Opportunity unsaved"}), 200
    return jsonify({"error": "Failed to unsave opportunity"}), 500

@opportunities_bp.route('/feed', methods=['GET'])
@require_auth
def get_global_feed():
    """Fetches a global feed of opportunities for all user's businesses."""
    user_id = g.user_id
    try:
        # Complex query to get opportunities for all user's businesses
        response = supabase.table('opportunities').select('*, businesses!inner(user_id)').eq('businesses.user_id', user_id).order('opportunity_score', desc=True).limit(50).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@opportunities_bp.route('/saved', methods=['GET'])
@require_auth
def get_saved():
    """Fetches saved opportunities."""
    user_id = g.user_id
    saved = OpportunityService.get_saved_opportunities(user_id)
    return jsonify(saved), 200
