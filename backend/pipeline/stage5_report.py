import os
import json
from backend.services.groq_service import call_groq, parse_json_safely

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', filename)
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def build_context_block(enriched: dict, pain_analysis: dict, competitor_data: dict, business_data: dict) -> str:
    return f"""
    Business Idea: {business_data.get('business_name')}
    Description: {business_data.get('description')}
    Audience: {business_data.get('target_audience')}
    
    Market Category: {enriched.get('market_category')}
    ICP: {enriched.get('icp_description')}
    
    Top Pain Points: {json.dumps(pain_analysis.get('pain_points', [])[:3])}
    Top Buying Signals: {json.dumps(pain_analysis.get('buying_signals', [])[:2])}
    
    Competitor Summary: {competitor_data.get('landscape_summary')}
    """

def run_stage5_master_report(enriched: dict, pain_analysis: dict, competitor_data: dict, business_data: dict, job_id: str, supabase) -> dict:
    print(f"[{job_id}] Running Stage 5 Master Report Generation...")

    context_block = build_context_block(enriched, pain_analysis, competitor_data, business_data)

    # ─────────────────────────────────────────────────────
    # CALL A: Product Intelligence (PRD + Roadmap + Stack)
    # ─────────────────────────────────────────────────────
    print(f"[{job_id}] Stage 5 - Call A: Product Intelligence")
    call_a_message = f"""
    {context_block}

    Generate a JSON object with these keys:

    "prd": {{
      "problem_statement": "...",
      "solution": "...",
      "mvp_features": ["...", "...", "..."],
      "non_features": ["...", "..."],
      "success_metric": "...",
      "unique_angle": "..."
    }},

    "roadmap": {{
      "phase1": {{
        "name": "...",
        "duration": "Week 1-2",
        "features": ["...", "..."],
        "goal": "..."
      }},
      "phase2": {{
        "name": "...",
        "duration": "Week 3-4",
        "features": ["...", "..."],
        "goal": "..."
      }},
      "phase3": {{
        "name": "...",
        "duration": "Month 2",
        "features": ["...", "..."],
        "goal": "..."
      }}
    }},

    "build_stack": {{
      "frontend": "...",
      "backend": "...",
      "database": "...",
      "ai": "...",
      "payments": "...",
      "hosting": "...",
      "why": "...",
      "estimated_cost_per_month": "..."
    }}
    """

    try:
        call_a_response = call_groq(
            model='llama-3.3-70b-versatile',
            system_prompt=load_prompt('prd_generation.txt'),
            user_message=call_a_message,
            max_tokens=1500,
            temperature=0.3
        )
        product_data = parse_json_safely(call_a_response)
    except Exception as e:
        print(f"[{job_id}] Error in Call A: {e}")
        product_data = {}


    # ─────────────────────────────────────────────────────
    # CALL B: Marketing & Growth Strategy
    # ─────────────────────────────────────────────────────
    print(f"[{job_id}] Stage 5 - Call B: Marketing Strategy")
    call_b_message = f"""
    {context_block}
    Product PRD: {json.dumps(product_data.get('prd', {}))}

    Generate JSON with:

    "marketing": {{
      "best_channels": [
        {{
          "channel": "r/SaaS",
          "why": "...",
          "content_type": "...",
          "best_time": "...",
          "avoid": "..."
        }}
      ],
      "content_angles": ["...", "...", "..."],
      "hook_templates": ["...", "..."],
      "dms_strategy": "..."
    }},

    "launch_plan": {{
      "week1": ["...", "..."],
      "week2": ["...", "..."],
      "week3": ["...", "..."],
      "week4": ["...", "..."]
    }},

    "pricing_suggestion": {{
      "free_tier": "...",
      "paid_tier_1": {{ "price": "...", "features": ["..."] }},
      "paid_tier_2": {{ "price": "...", "features": ["..."] }},
      "reasoning": "..."
    }}
    """

    try:
        call_b_response = call_groq(
            model='llama-3.3-70b-versatile',
            system_prompt=load_prompt('marketing_strategy.txt'),
            user_message=call_b_message,
            max_tokens=1200,
            temperature=0.4    # Slightly higher for creative marketing ideas
        )
        marketing_data = parse_json_safely(call_b_response)
    except Exception as e:
        print(f"[{job_id}] Error in Call B: {e}")
        marketing_data = {}


    # ─────────────────────────────────────────────────────
    # CALL C: Validation + Prompts + Score
    # ─────────────────────────────────────────────────────
    print(f"[{job_id}] Stage 5 - Call C: Validation & Prompts")
    call_c_message = f"""
    {context_block}

    Generate JSON with:

    "validation_checklist": [
      {{
        "action": "...",
        "how_to": "...",
        "success_signal": "...",
        "priority": "HIGH/MEDIUM/LOW"
      }}
    ],

    "risk_flags": [
      {{
        "risk": "...",
        "mitigation": "..."
      }}
    ],

    "prompts": {{
        "cursor": "...",
        "v0": "...",
        "bolt": "..."
    }},

    "growth_score": 78,
    "growth_score_reasoning": "..."
    """

    try:
        call_c_response = call_groq(
            model='llama-3.3-70b-versatile',
            system_prompt=load_prompt('build_stack.txt'),
            user_message=call_c_message,
            max_tokens=1000,
            temperature=0.3
        )
        action_data = parse_json_safely(call_c_response)
    except Exception as e:
        print(f"[{job_id}] Error in Call C: {e}")
        action_data = {}


    # Combine all outputs
    
    # Map the new structure to what the frontend expects (report_meta, product_overview, etc)
    report_data_payload = {
        "report_meta": {
            "confidence_score": action_data.get('growth_score', pain_analysis.get('demand_score', 0)),
            "market_verdict": pain_analysis.get('demand_label', 'UNKNOWN')
        },
        "product_overview": {
            "real_pain_points": pain_analysis.get('pain_points', []),
            "target_personas": [
                {
                    "persona_name": "Primary User",
                    "description": enriched.get('icp_description', ''),
                    "pain_level": 8,
                    "willingness_to_pay": "Medium"
                }
            ]
        },
        "market_scope": {
            "timing_score": {"verdict": pain_analysis.get('demand_label', 'UNKNOWN')}
        },
        "competitor_analysis": {
            "direct_competitors": competitor_data.get('competitors', [])
        },
        "product_management": {
            "prd_summary": product_data.get('prd', {}).get('problem_statement', ''),
            "core_features": [{"name": f, "description": "Core feature", "priority": "High"} for f in product_data.get('prd', {}).get('mvp_features', [])]
        },
        "validation_and_marketing": {
            "landing_page_copy": {
                "hero_headline": "Solve " + (pain_analysis.get('pain_points', [{'pain': 'your problem'}])[0]['pain'] if pain_analysis.get('pain_points') else 'your problem'),
                "hero_subheadline": "The fastest way to achieve " + business_data.get('goal', 'your goals'),
                "cta_button": "Get Started"
            },
            "launch_strategy": "Launch on " + (marketing_data.get('marketing', {}).get('best_channels', [{'channel': 'Reddit'}])[0]['channel'] if marketing_data.get('marketing', {}).get('best_channels') else 'Product Hunt'),
            "validation_surveys": [v.get('action', '') for v in action_data.get('validation_checklist', [])]
        },
        "engineering": {
            "ai_coding_prompts": {
                "cursor_prompt": action_data.get('prompts', {}).get('cursor', ''),
                "v0_prompt": action_data.get('prompts', {}).get('v0', ''),
                "bolt_prompt": action_data.get('prompts', {}).get('bolt', '')
            }
        },
        
        # Keep raw data for debugging/future use
        "raw_stage_data": {
            "product": product_data,
            "marketing": marketing_data,
            "actions": action_data
        }
    }

    full_report = {
        "business_id": business_data['id'],
        "job_id": job_id,
        "report_type": "full_analysis",
        "pain_points": pain_analysis.get('pain_points', []),
        "demand_signals": pain_analysis.get('buying_signals', []),
        "competitor_gaps": competitor_data.get('competitors', []),
        "prd": product_data.get('prd', {}),
        "roadmap": product_data.get('roadmap', {}),
        "marketing": marketing_data.get('marketing', {}),
        "build_stack": product_data.get('build_stack', {}),
        "prompts": action_data.get('prompts', {}),
        "validation": action_data.get('validation_checklist', []),
        "growth_score": action_data.get('growth_score', pain_analysis.get('demand_score', 0)),
        "report_data": report_data_payload
    }

    try:
        supabase.table('reports').insert(full_report).execute()
    except Exception as e:
        print(f"[{job_id}] Error saving master report: {e}")

    return full_report
