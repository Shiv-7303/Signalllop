import os
from backend.services.groq_service import call_groq, parse_json_safely
from backend.services.tavily_service import call_tavily
from backend.utils.chunker import format_results_for_groq
from datetime import datetime

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', filename)
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def run_stage4_competitor_analysis(competitors: list, enriched: dict, job_id: str, supabase) -> dict:
    """
    Analyzes each competitor individually.
    Returns aggregated competitive intelligence.
    """
    print(f"[{job_id}] Running Stage 4 Competitor Analysis...")

    competitor_analyses = []
    
    # Extract competitor names
    comp_names = []
    for c in competitors:
        if isinstance(c, dict):
            comp_names.append(c.get('competitor_name', ''))
        else:
            comp_names.append(str(c))

    for competitor in comp_names:
        if not competitor:
            continue
            
        print(f"[{job_id}] Analyzing competitor: {competitor}...")
        
        # Search for competitor complaints/weaknesses
        search_result = call_tavily({
            'query': f'{competitor} problems limitations "wish it had" alternative frustrated 2024 2025',
            'depth': 'basic',     # Basic for competitors (lower stake)
            'max_results': 6
        })

        if not search_result.get('results'):
            print(f"[{job_id}] No results found for competitor: {competitor}")
            continue

        formatted = format_results_for_groq(search_result['results'])

        prompt = load_prompt('competitor_analysis.txt')
        user_message = f"""
        Competitor: {competitor}
        My Product Category: {enriched.get('market_category', 'Unknown')}
        My ICP: {enriched.get('icp_description', 'Unknown')}

        Search results about this competitor:
        {formatted}

        Return JSON with:
        - competitor_name
        - main_weaknesses (list of 3-4 specific weaknesses found)
        - user_complaints (list of 2-3 direct complaint patterns)
        - gap_opportunity (1-2 sentence gap our product can fill)
        - their_strengths (list of 2-3 actual strengths)
        - platform_presence (where they are active)
        - pricing_complaints (any pricing feedback)

        Respond ONLY with valid JSON.
        """

        try:
            response = call_groq(
                model='llama-3.3-70b-versatile',
                system_prompt=prompt,
                user_message=user_message,
                max_tokens=600,
                temperature=0.2
            )

            analysis = parse_json_safely(response)
            competitor_analyses.append(analysis)

            # Save to competitors table
            # Find the ID for this competitor
            comp_id = None
            for c in competitors:
                if isinstance(c, dict) and c.get('competitor_name') == competitor:
                    comp_id = c.get('id')
                    break
            
            if comp_id:
                supabase.table('competitors').update({
                    'analysis': analysis,
                    'last_analyzed_at': datetime.utcnow().isoformat()
                }).eq('id', comp_id).execute()

        except Exception as e:
            print(f"[{job_id}] Error analyzing competitor {competitor}: {e}")

    # Generate overall competitive landscape summary
    # For now, we'll construct a simple summary. A deeper LLM call could be used here.
    gaps_found = 0
    landscape_summary = "Competitive landscape analysis complete. "
    if competitor_analyses:
        for ca in competitor_analyses:
            gaps = len(ca.get('main_weaknesses', []))
            gaps_found += gaps
            landscape_summary += f"Found {gaps} weaknesses in {ca.get('competitor_name', 'competitor')}. "

    return {
        'competitors': competitor_analyses,
        'landscape_summary': landscape_summary,
        'total_gaps_found': gaps_found
    }
