import os
from backend.services.groq_service import call_groq, parse_json_safely

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', filename)
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def run_stage1_enrichment(business_data: dict, job_id: str, supabase) -> dict:
    """
    Takes raw onboarding data, returns enriched context.
    """
    # update_job_status is handled in orchestrator to avoid circular imports, 
    # but we can print for now or pass a callback. For simplicity, orchestrator handles it.
    
    print(f"[{job_id}] Running Stage 1 Enrichment...")

    prompt = load_prompt('enrich_context.txt')
    competitors = business_data.get('competitors', [])
    
    user_message = f"""
    Business Name: {business_data.get('business_name')}
    Description: {business_data.get('description')}
    Category: {business_data.get('category')}
    Target Audience: {business_data.get('target_audience')}
    Goal: {business_data.get('goal')}
    Region: {business_data.get('region')}
    Competitors: {', '.join([c.get('competitor_name', '') for c in competitors] if isinstance(competitors, list) and len(competitors) > 0 and isinstance(competitors[0], dict) else competitors)}

    Return a JSON object with these exact keys:
    - expanded_keywords (list of 8-12 search keywords)
    - icp_description (2-3 sentence ideal customer profile)
    - problem_hypotheses (list of 3 specific problem statements)
    - market_category (e.g., "Social Listening SaaS")
    - business_model_guess (e.g., "B2B SaaS, monthly subscription")
    - search_angles (list of 5 angles for finding pain points online)
    - competitor_search_queries (list of 4 queries for finding competitor complaints)

    Respond ONLY with valid JSON. No markdown, no preamble.
    """

    response = call_groq(
        model='llama-3.3-70b-versatile',
        system_prompt=prompt,
        user_message=user_message,
        max_tokens=800,
        temperature=0.3
    )

    enriched = parse_json_safely(response)

    # Store in business_memory table
    memory_data = {
        "business_id": business_data['id'],
        "keywords": enriched.get('expanded_keywords', []),
        "icp_description": enriched.get('icp_description', ''),
        "problem_hypotheses": enriched.get('problem_hypotheses', []),
        "market_category": enriched.get('market_category', '')
    }
    
    # Upsert business memory
    try:
        supabase.table('business_memory').upsert(memory_data, on_conflict='business_id').execute()
        
        # Also update the business record itself with enriched context
        supabase.table('businesses').update({'enriched_context': enriched}).eq('id', business_data['id']).execute()
    except Exception as e:
        print(f"Error saving business memory: {e}")

    return enriched
