from datetime import datetime
import os
from backend.services.email_service import send_report_ready_email

def run_stage7_memory_update(business_id: str, user_id: str, job_id: str, full_report: dict, enriched: dict, supabase) -> None:
    print(f"[{job_id}] Running Stage 7 Memory Update...")
    
    # 1. Update business_memory with final enriched data (already mostly done in Stage 1 & 2, but we can touch it)
    try:
        supabase.table('business_memory').update({
            'cache_updated_at': datetime.utcnow().isoformat()
        }).eq('business_id', business_id).execute()
    except Exception as e:
        print(f"[{job_id}] Error updating memory: {e}")

    # 2. Log the action
    try:
        log_data = {
            'user_id': user_id,
            'business_id': business_id,
            'action_type': 'report_generated',
            'metadata': {
                'report_pain_points': len(full_report.get('pain_points', [])),
                'growth_score': full_report.get('growth_score')
            }
        }
        supabase.table('action_log').insert(log_data).execute()
    except Exception as e:
        print(f"[{job_id}] Error logging action: {e}")

    # 3. Mark job as complete (handled in orchestrator usually, but we do it here if specified)
    try:
        supabase.table('pipeline_jobs').update({
            "status": "completed",
            "current_stage": "done",
            "progress_pct": 100,
            "completed_at": datetime.utcnow().isoformat()
        }).eq('id', job_id).execute()
    except Exception as e:
        print(f"[{job_id}] Error completing job: {e}")

    # 4. Send welcome/report-ready email via Resend
    try:
        # Fetch user details
        user_res = supabase.table('users').select('*').eq('id', user_id).execute()
        if user_res.data:
            user = user_res.data[0]
            business_res = supabase.table('businesses').select('business_name').eq('id', business_id).execute()
            business_name = business_res.data[0]['business_name'] if business_res.data else "Your Business"
            
            send_report_ready_email(
                to=user['email'],
                name=user.get('name', ''),
                business_name=business_name,
                growth_score=full_report.get('growth_score', 0)
            )
    except Exception as e:
        print(f"[{job_id}] Error sending email: {e}")

    # 5. Schedule future scans based on plan
    # In a real app, we'd interact with APScheduler dynamically. 
    # For now, APScheduler in app.py runs interval jobs that check ALL eligible businesses.
    print(f"[{job_id}] Stage 7 Complete. Future scans are managed by APScheduler.")
