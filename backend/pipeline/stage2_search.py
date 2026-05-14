import concurrent.futures
from backend.services.tavily_service import call_tavily

def run_stage2_searches(enriched: dict, competitors: list, job_id: str, supabase) -> dict:
    """
    Runs all Tavily searches in parallel for speed.
    Returns dict of search_type → results.
    """
    print(f"[{job_id}] Running Stage 2 Search...")

    keywords = enriched.get('expanded_keywords', [])
    search_angles = enriched.get('search_angles', [])
    competitor_queries = enriched.get('competitor_search_queries', [])
    
    # Extract competitor names safely
    comp_names = []
    for c in competitors:
        if isinstance(c, dict):
            comp_names.append(c.get('competitor_name', ''))
        else:
            comp_names.append(str(c))
            
    # Safely get keywords
    k1 = keywords[0] if len(keywords) > 0 else 'startup'
    k2 = keywords[1] if len(keywords) > 1 else 'software'
    k3 = keywords[2] if len(keywords) > 2 else 'app'
    k4 = keywords[3] if len(keywords) > 3 else 'tool'
    c1 = comp_names[0] if comp_names else k3

    # Build all 5 search queries
    queries = [
        # Query 1: Core pain point discovery (Advanced)
        {
            'query': f'site:reddit.com OR site:news.ycombinator.com {k1} {k2} problem frustration',
            'depth': 'advanced',
            'max_results': 10
        },
        # Query 2: Buying signals (Advanced)
        {
            'query': f'site:reddit.com {k1} alternative recommendation "looking for" OR "any tool"',
            'depth': 'advanced',
            'max_results': 8
        },
        # Query 3: Competitor complaints (Advanced)
        {
            'query': f'{c1} problems limitations frustrated alternative 2024 2025',
            'depth': 'advanced',
            'max_results': 8
        },
        # Query 4: Market discussion (Basic — less critical)
        {
            'query': f'site:reddit.com {enriched.get("market_category", "")} discussion community founders',
            'depth': 'basic',
            'max_results': 6
        },
        # Query 5: Indie hacker angle (Basic)
        {
            'query': f'site:indiehackers.com OR site:reddit.com/r/indiehackers {k1} {k4}',
            'depth': 'basic',
            'max_results': 6
        }
    ]

    # Run all searches in parallel (3 workers max to respect rate limits)
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(call_tavily, q): f'search_{i}'
            for i, q in enumerate(queries)
        }
        for future, key in futures.items():
            try:
                results[key] = future.result(timeout=20)
            except Exception as e:
                print(f"Error in future {key}: {e}")
                results[key] = {'results': [], 'error': str(e)}

    # Flatten all results into single list
    all_results = []
    for key, data in results.items():
        for item in data.get('results', []):
            all_results.append({
                'title': item.get('title', ''),
                'url': item.get('url', ''),
                'content': item.get('content', '')[:500],  # truncate
                'score': item.get('score', 0),
                'source_type': key
            })

    # Cache in business memory if possible
    # We need the business ID which we can get from the job_id
    try:
        job_res = supabase.table('pipeline_jobs').select('business_id').eq('id', job_id).execute()
        if job_res.data:
            b_id = job_res.data[0]['business_id']
            # We don't overwrite the whole row, just update tavily_cache
            from datetime import datetime
            supabase.table('business_memory').update({
                'tavily_cache': {'raw_results': all_results, 'total_found': len(all_results)},
                'cache_updated_at': datetime.utcnow().isoformat()
            }).eq('business_id', b_id).execute()
    except Exception as e:
        print(f"Error caching tavily results: {e}")

    return {
        'raw_results': all_results,
        'total_found': len(all_results),
        'queries_run': len(queries)
    }
