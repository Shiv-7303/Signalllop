from flask import Blueprint, request, jsonify, g
import threading
from backend.utils.auth_middleware import require_auth
from backend.utils.limiter import check_usage_limit
from backend.services.usage_service import UsageService
from backend.pipeline.orchestrator import run_pipeline
from backend.utils.validators import sanitise_string
import os
from supabase import create_client

onboarding_bp = Blueprint('onboarding', __name__)

def get_supabase():
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

@onboarding_bp.route('/submit', methods=['POST'])
@require_auth
@check_usage_limit('reports')
def submit_onboarding():
    data = request.json
    user_id = g.user_id
    supabase = get_supabase()

    try:
        plan = UsageService.get_plan(user_id)
    except Exception as e:
        print(f"Error getting plan: {e}")
        plan = 'free' # default

    # 1. Create business record
    try:
        business_data = {
            "user_id": user_id,
            "business_name": sanitise_string(data.get('business_name', '')),
            "description": sanitise_string(data.get('description', '')),
            "category": sanitise_string(data.get('category', 'SaaS')),
            "target_audience": sanitise_string(data.get('target_audience', '')),
            "goal": sanitise_string(data.get('goal', 'Leads')),
            "region": sanitise_string(data.get('region', 'Global'))
        }
        business_response = supabase.table('businesses').insert(business_data).execute()
        if not business_response.data:
            return jsonify({'error': 'Failed to create business'}), 500
        business_id = business_response.data[0]['id']
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # 2. Add competitors (respects plan limit)
    try:
        PLAN_LIMITS = {
            'free': {'competitors': 1},
            'starter': {'competitors': 5},
            'pro': {'competitors': 999}
        }
        max_competitors = PLAN_LIMITS.get(plan, {'competitors': 1})['competitors']
        competitors = data.get('competitors', [])[:max_competitors]
        
        for comp in competitors:
            if comp.strip():
                comp_data = {
                    "business_id": business_id,
                    "competitor_name": sanitise_string(comp)
                }
                supabase.table('competitors').insert(comp_data).execute()
    except Exception as e:
        print(f"Error adding competitors: {e}")

    # 3. Create pipeline job
    try:
        job_data = {
            "business_id": business_id,
            "user_id": user_id,
            "status": "pending",
            "current_stage": "initialized",
            "progress_pct": 0
        }
        job_response = supabase.table('pipeline_jobs').insert(job_data).execute()
        if not job_response.data:
            return jsonify({'error': 'Failed to create pipeline job'}), 500
        job_id = job_response.data[0]['id']
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # 4. Spawn background thread for pipeline
    try:
        thread = threading.Thread(
            target=run_pipeline,
            args=(job_id, business_id, user_id, data)
        )
        thread.daemon = True
        thread.start()
    except Exception as e:
        print(f"Error starting pipeline thread: {e}")

    # 5. Increment usage
    try:
        UsageService.increment_reports(user_id)
    except Exception as e:
        print(f"Error incrementing usage: {e}")

    return jsonify({
        'job_id': str(job_id),
        'status': 'started',
        'message': 'Pipeline started'
    }), 202
