from flask import Blueprint, jsonify, g
from backend.utils.auth_middleware import require_auth
from supabase import create_client
import os

pipeline_bp = Blueprint('pipeline', __name__)

def get_supabase():
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

@pipeline_bp.route('/status/<job_id>', methods=['GET'])
@require_auth
def get_pipeline_status(job_id):
    user_id = g.user_id
    supabase = get_supabase()

    try:
        response = supabase.table('pipeline_jobs').select('*').eq('id', job_id).eq('user_id', user_id).single().execute()
        if not response.data:
            return jsonify({'error': 'Job not found or access denied'}), 404
        
        job = response.data
        return jsonify({
            'status': job.get('status'),
            'stage': job.get('current_stage'),
            'progress': job.get('progress_pct'),
            'message': job.get('error_message') or f"Processing {job.get('current_stage')}..."
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
