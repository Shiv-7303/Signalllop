import os
import time
from supabase import create_client
from backend.pipeline.stage1_enrich import run_stage1_enrichment
from backend.pipeline.stage2_search import run_stage2_searches

def get_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

def update_job_status(supabase, job_id, status, stage, progress, message=""):
    try:
        supabase.table('pipeline_jobs').update({
            "status": status,
            "current_stage": stage,
            "progress_pct": progress,
            "error_message": message
        }).eq('id', job_id).execute()
    except Exception as e:
        print(f"Failed to update job status: {e}")

def run_pipeline(job_id, business_id, user_id, raw_data):
    """
    Main orchestrator for the AI Distribution Pipeline.
    Runs in a background thread.
    """
    supabase = get_supabase()
    
    try:
        print(f"Starting pipeline for job {job_id}, business {business_id}")
        
        # Fetch the full business record to pass to stage 1
        business_res = supabase.table('businesses').select('*').eq('id', business_id).execute()
        if not business_res.data:
            raise Exception("Business record not found")
        business_record = business_res.data[0]
        
        # Fetch competitors
        comp_res = supabase.table('competitors').select('*').eq('business_id', business_id).execute()
        business_record['competitors'] = comp_res.data

        # ---------------------------------------------------------
        # STAGE 1: ENRICHMENT
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage1_enrich", 10, "Understanding your business...")
        enriched_context = run_stage1_enrichment(business_record, job_id, supabase)
        update_job_status(supabase, job_id, "running", "stage1_enrich", 20, "Business context mapped ✓")
        
        
        # ---------------------------------------------------------
        # STAGE 2: SEARCH
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage2_search", 25, "Hunting across Reddit and forums...")
        search_results = run_stage2_searches(enriched_context, business_record['competitors'], job_id, supabase)
        update_job_status(supabase, job_id, "running", "stage2_search", 45, f"Collected {search_results['total_found']} data points ✓")


        # --- MOCK REMAINING PIPELINE EXECUTION FOR NOW ---
        
        # Stage 3: Analyze
        update_job_status(supabase, job_id, "running", "stage3_analyze", 50, "Analyzing pain points...")
        time.sleep(3)
        
        # Stage 4: Competitors
        update_job_status(supabase, job_id, "running", "stage4_competitors", 70, "Evaluating competitors...")
        time.sleep(2)
        
        # Stage 5: Report Generation
        # Create a mock report so the dashboard has something to show
        try:
            report_data = {
                "business_id": business_id,
                "job_id": job_id,
                "growth_score": 85,
                "report_data": {
                    "report_meta": { "confidence_score": 85, "market_verdict": "STRONG" },
                    "product_overview": {
                        "real_pain_points": [
                            {"text": "Manual Reddit monitoring is slow", "severity": "HIGH"},
                            {"text": "Competitor tools miss context", "severity": "MEDIUM"}
                        ]
                    }
                }
            }
            supabase.table('reports').insert(report_data).execute()
        except Exception as e:
            print(f"Error creating mock report: {e}")

        update_job_status(supabase, job_id, "running", "stage5_report", 90, "Generating report...")
        time.sleep(2)
        
        # Completion
        update_job_status(supabase, job_id, "completed", "done", 100, "Pipeline finished successfully")
        print(f"Pipeline {job_id} completed.")
        
    except Exception as e:
        print(f"Pipeline {job_id} failed: {e}")
        update_job_status(supabase, job_id, "failed", "error", 0, str(e))
