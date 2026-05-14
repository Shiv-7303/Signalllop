import os
from backend.services.groq_service import call_groq, parse_json_safely
from backend.utils.chunker import chunk_results, format_results_for_groq

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', filename)
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def deduplicate_and_rank(pain_points: list) -> list:
    """
    Simple deduplication and ranking based on severity.
    """
    # In a real system, you might use embeddings or another LLM pass to merge similar ones.
    # For now, we just sort by severity.
    severity_map = {'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
    
    # Sort descending by severity score
    pain_points.sort(key=lambda x: severity_map.get(str(x.get('severity', '')).upper(), 0), reverse=True)
    
    # Simple deduplication by exact text match (basic)
    seen = set()
    unique = []
    for pp in pain_points:
        text = str(pp.get('pain', '')).lower()
        if text and text not in seen:
            seen.add(text)
            unique.append(pp)
            
    return unique

def calculate_demand_score(pain_points: list, demand_evidence: list) -> int:
    """Calculates a 0-100 score based on collected evidence."""
    score = 50 # Base score
    
    high_pains = sum(1 for p in pain_points if str(p.get('severity', '')).upper() == 'HIGH')
    score += (high_pains * 5)
    
    score += (len(demand_evidence) * 5)
    
    return min(100, max(0, score))

def score_to_label(score: int) -> str:
    if score >= 80: return "STRONG"
    if score >= 60: return "MODERATE"
    if score >= 40: return "WEAK"
    return "LOW"

def run_stage3_pain_analysis(search_results: dict, enriched: dict, job_id: str, supabase) -> dict:
    """
    Analyzes raw search results for pain points and demand signals.
    Chunks results to handle large data volumes.
    """
    print(f"[{job_id}] Running Stage 3 Pain Analysis...")

    raw_results = search_results.get('raw_results', [])
    chunks = chunk_results(raw_results, chunk_size=15)

    all_pain_points = []
    demand_evidence = []

    # If no results found
    if not chunks:
        return {
            'pain_points': [],
            'buying_signals': [],
            'demand_score': 0,
            'demand_label': 'NO DATA',
            'total_sources_analyzed': 0
        }

    # Analyze each chunk
    for i, chunk in enumerate(chunks):
        print(f"[{job_id}] Analyzing chunk {i+1}/{len(chunks)}...")
        formatted = format_results_for_groq(chunk)

        prompt = load_prompt('pain_analysis.txt')
        user_message = f"""
        Business Context:
        ─────────────────
        Product: {enriched.get('market_category', 'Unknown')}
        ICP: {enriched.get('icp_description', 'Unknown')}
        Problem hypotheses: {enriched.get('problem_hypotheses', [])}

        Search Results to Analyze (chunk {i+1}/{len(chunks)}):
        ────────────────────────────────────────────────────────
        {formatted}

        Extract and return JSON with:
        - pain_points: array of objects with fields:
            * pain (specific problem statement)
            * evidence (direct quote or paraphrase from results)
            * source_url
            * severity (HIGH/MEDIUM/LOW)
            * frequency (how many sources mention this)
        - buying_signals: array of objects with:
            * signal (description of buying intent)
            * evidence
            * source_url
        - demand_score (0-100 integer based on discussion volume + intent)
        - market_size_signals (array of strings about market scale)

        Be specific. Use actual evidence from the results.
        Respond ONLY with valid JSON.
        """

        try:
            response = call_groq(
                model='llama-3.3-70b-versatile',
                system_prompt=prompt,
                user_message=user_message,
                max_tokens=1000,
                temperature=0.2
            )

            chunk_analysis = parse_json_safely(response)
            all_pain_points.extend(chunk_analysis.get('pain_points', []))
            demand_evidence.extend(chunk_analysis.get('buying_signals', []))
        except Exception as e:
            print(f"[{job_id}] Error processing chunk {i+1}: {e}")

    # Deduplicate and rank pain points
    ranked_pain_points = deduplicate_and_rank(all_pain_points)

    # Calculate final demand score (average of chunks or based on total extracted)
    final_demand_score = calculate_demand_score(ranked_pain_points, demand_evidence)

    result = {
        'pain_points': ranked_pain_points[:8],    # Top 8 only
        'buying_signals': demand_evidence[:5],
        'demand_score': final_demand_score,
        'demand_label': score_to_label(final_demand_score),
        'total_sources_analyzed': len(raw_results)
    }

    return result
