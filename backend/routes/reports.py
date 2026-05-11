import os
from flask import Blueprint, request, jsonify, g
from supabase import create_client, Client
from backend.utils.auth_middleware import require_auth
from backend.services.report_service import ReportService
from backend.utils.limiter import limiter

reports_bp = Blueprint('reports', __name__)
report_service = ReportService()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

@reports_bp.route('/generate', methods=['POST'])
@require_auth
@limiter.limit("5 per minute")
def generate_report():
    """Triggers the report generation pipeline."""
    data = request.json
    business_id = data.get('business_id')
    user_id = g.user_id
    
    if not business_id:
        return jsonify({"error": "business_id is required"}), 400
        
    result, status_code = report_service.generate_report(business_id, user_id)
    return jsonify(result), status_code

@reports_bp.route('/', methods=['GET'])
@require_auth
def get_reports():
    """Lists all reports for the user's businesses."""
    user_id = g.user_id
    business_id = request.args.get('business_id')
    
    try:
        # Accept optional query param ?business_id=...
        query = supabase.table('reports').select('*, businesses!inner(user_id)').eq('businesses.user_id', user_id)
        if business_id:
            query = query.eq('business_id', business_id)
            
        response = query.order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reports_bp.route('/<report_id>', methods=['GET'])
@require_auth
def get_report(report_id):
    """Gets a single report detail."""
    user_id = g.user_id
    
    try:
        response = supabase.table('reports').select('*, businesses!inner(user_id)').eq('id', report_id).eq('businesses.user_id', user_id).single().execute()
        if not response.data:
            return jsonify({"error": "Report not found"}), 404
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reports_bp.route('/<report_id>', methods=['DELETE'])
@require_auth
def delete_report(report_id):
    """Deletes a report."""
    user_id = g.user_id
    
    try:
        # Check ownership
        check = supabase.table('reports').select('id, businesses!inner(user_id)').eq('id', report_id).eq('businesses.user_id', user_id).single().execute()
        if not check.data:
            return jsonify({"error": "Report not found or access denied"}), 404
            
        supabase.table('reports').delete().eq('id', report_id).execute()
        return jsonify({"message": "Report deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
