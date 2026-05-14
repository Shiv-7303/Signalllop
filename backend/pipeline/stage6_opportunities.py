import os
import json
from backend.services.groq_service import call_groq, parse_json_safely
from backend.utils.chunker import format_results_for_groq

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', filename)
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def run_stage6_opportunity_extraction(search_results: dict, pain_analysis: dict, competitor_data: dict, business_id: str, job_id: str, supabase) -> list:
    print(f"[{job_id}] Running Stage 6 Opportunity Extraction...")

    raw_results = search_results.get('raw_results', [])
    
    if not raw_results:
        print(f"[{job_id}] No raw results to extract opportunities from.")
        return []

    # Score and classify each result
    user_message = f"""
    Analyze these search results and extract opportunity cards.
    Return a JSON array of opportunity objects.

    Pain points we're solving: {json.dumps(pain_analysis.get('pain_points', [])[:3])}
    Competitor weaknesses: {json.dumps(competitor_data.get('competitors', [])[:2])}

    Results to analyze:
    {format_results_for_groq(raw_results[:20])}

    For each relevant result, create an object with:
    - title (compelling 6-10 word description of the opportunity)
    - opportunity_type: one of:
        "Buying Signal" | "Pain Point" | "Competitor Gap" | "Content Idea"
    - source_url
    - subreddit (extract from URL if reddit, else null)
    - engagement_count (estimate from context, or 0)
    - opportunity_score (1.0 to 10.0)
    - ai_insight (1 sentence: why this matters)
    - suggested_action (1 sentence: what to do)
    - raw_snippet (the relevant text from the result)

    Only include opportunities with score >= 5.0.
    Return ONLY a valid JSON array. No extra text.
    """

    try:
        response = call_groq(
            model='llama-3.1-8b-instant',   # Cheaper model for bulk extraction
            system_prompt=load_prompt('opportunity_extract.txt'),
            user_message=user_message,
            max_tokens=2000,
            temperature=0.2
        )

        opportunities = parse_json_safely(response)

        if not isinstance(opportunities, list):
            opportunities = opportunities.get('opportunities', [])

        # Save each to database
        saved_count = 0
        for opp in opportunities:
            if opp.get('opportunity_score', 0) >= 5.0:
                
                # Default values for schema alignment
                platform = 'reddit'
                url = str(opp.get('source_url', ''))
                if 'ycombinator' in url:
                    platform = 'hacker_news'
                elif 'indiehackers' in url:
                    platform = 'indiehackers'
                elif 'twitter' in url or 'x.com' in url:
                    platform = 'twitter'
                
                opp_data = {
                    'business_id': business_id,
                    'title': opp.get('title', 'Opportunity found'),
                    'source_url': url,
                    'source_platform': platform,
                    'subreddit': opp.get('subreddit'),
                    'engagement_count': int(opp.get('engagement_count', 0)),
                    'opportunity_score': float(opp.get('opportunity_score', 5.0)),
                    'opportunity_type': str(opp.get('opportunity_type', 'Pain Point')),
                    'ai_insight': opp.get('ai_insight', ''),
                    'suggested_action': opp.get('suggested_action', ''),
                    'raw_snippet': opp.get('raw_snippet', ''),
                    'is_active': True
                }
                
                # Adjust opportunity_type if it doesn't strictly match the DB check constraint
                # In DB constraint check is lowercase with underscores, so let's try to map it
                type_mapping = {
                    "buying signal": "buying_signal",
                    "pain point": "pain_point",
                    "competitor gap": "competitor_gap",
                    "content idea": "content_idea"
                }
                val = str(opp.get('opportunity_type', 'Pain Point')).lower()
                mapped_type = type_mapping.get(val, "pain_point") # default to pain_point
                opp_data['opportunity_type'] = mapped_type

                try:
                    supabase.table('opportunities').insert(opp_data).execute()
                    saved_count += 1
                except Exception as db_err:
                    print(f"[{job_id}] Error saving opportunity: {db_err}")

        print(f"[{job_id}] {saved_count} opportunities extracted ✓")
        return opportunities

    except Exception as e:
        print(f"[{job_id}] Error in Stage 6 Opportunity Extraction: {e}")
        return []
