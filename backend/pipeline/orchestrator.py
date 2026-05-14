import os
import time
from supabase import create_client
from backend.pipeline.stage1_enrich import run_stage1_enrichment
from backend.pipeline.stage2_search import run_stage2_searches
from backend.pipeline.stage3_analyze import run_stage3_pain_analysis
from backend.pipeline.stage4_competitors import run_stage4_competitor_analysis

from backend.pipeline.stage5_report import run_stage5_master_report
from backend.pipeline.stage6_opportunities import run_stage6_opportunity_extraction
from backend.pipeline.stage7_memory import run_stage7_memory_update

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


        # ---------------------------------------------------------
        # STAGE 3: ANALYZE PAIN POINTS
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage3_analyze", 50, "Analyzing pain points...")
        pain_analysis = run_stage3_pain_analysis(search_results, enriched_context, job_id, supabase)
        update_job_status(supabase, job_id, "running", "stage3_analyze", 62, "Pain points extracted ✓")
        
        # ---------------------------------------------------------
        # STAGE 4: COMPETITORS
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage4_competitors", 65, "Evaluating competitors...")
        competitor_analysis = run_stage4_competitor_analysis(business_record['competitors'], enriched_context, job_id, supabase)
        update_job_status(supabase, job_id, "running", "stage4_competitors", 72, "Competitor gaps identified ✓")
        
        # ---------------------------------------------------------
        # STAGE 5: MASTER REPORT
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage5_report", 75, "Building your growth report...")
        full_report = run_stage5_master_report(enriched_context, pain_analysis, competitor_analysis, business_record, job_id, supabase)
        update_job_status(supabase, job_id, "running", "stage5_report", 93, "Full report assembled ✓")
        
        # ---------------------------------------------------------
        # STAGE 6: OPPORTUNITY EXTRACTION
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage6_opportunities", 95, "Extracting opportunity cards...")
        run_stage6_opportunity_extraction(search_results, pain_analysis, competitor_analysis, business_id, job_id, supabase)
        update_job_status(supabase, job_id, "running", "stage6_opportunities", 98, "Opportunities extracted ✓")
        
        # ---------------------------------------------------------
        # STAGE 7: MEMORY & WRAP UP
        # ---------------------------------------------------------
        update_job_status(supabase, job_id, "running", "stage7_memory", 99, "Finalizing memory and sending alerts...")
        run_stage7_memory_update(business_id, user_id, job_id, full_report, enriched_context, supabase)
        
        print(f"Pipeline {job_id} completed.")
        
    except Exception as e:
        print(f"Pipeline {job_id} failed: {e}")
        update_job_status(supabase, job_id, "failed", "error", 0, str(e))
