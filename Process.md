# AI Distribution Engine — Report Generation Process

> **This document defines the complete end-to-end process for generating a highly detailed Growth Intelligence Report. Every section below maps to a part of the final JSON output. Follow this exactly.**

---

## How the Report Works (Bird's Eye)

The system runs in two modes depending on whether Reddit API credentials are set in `.env`. Both modes produce full reports. The mode switches automatically — no code change needed.

### Virtual Mode (Default — Reddit credentials empty)

```
User submits business info
         ↓
Backend detects Reddit credentials are empty
         ↓
Groq uses its own training data for Reddit research
         ↓
Single Groq API call with business context only
         ↓
AI returns structured JSON with all 11 sections
         ↓
Frontend renders interactive report
```

### Live Mode (Reddit credentials filled)

```
User submits business info
         ↓
Backend fetches live Reddit posts via API
         ↓
Top 10 posts injected into the Groq prompt
         ↓
Single Groq API call with full live context
         ↓
AI returns structured JSON with all 11 sections
         ↓
Frontend renders interactive report
```

### Which mode should you use?

| | Virtual Mode | Live Mode |
|---|---|---|
| Reddit credentials needed | ❌ No | ✅ Yes |
| Works immediately | ✅ Yes | Requires API approval |
| Report quality | Very good (training data) | Best (real-time signals) |
| Cost | Same | Same + Reddit API calls |
| Use for | MVP, early users, testing | Pro plan users, production |

**Virtual Mode is fully production-ready.** Groq's Llama 3.3 70B has extensive Reddit knowledge in its training data — it knows subreddit cultures, post patterns, and community norms. The gap vs live data only becomes meaningful at scale when you need posts from the last 48 hours specifically.

```
# backend/.env

# Leave empty = Virtual Mode (Groq uses training data)
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=SignalLoop/1.0

# Fill in = Live Mode (real Reddit posts injected)
# REDDIT_CLIENT_ID=your_id
# REDDIT_CLIENT_SECRET=your_secret
```

The quality of the report depends entirely on:
1. How much business context you give the API (name, niche, audience, competitors)
2. How clearly you define each section in the system prompt
3. Max tokens being high enough (minimum 8000)
4. In Live Mode: quality of Reddit posts fetched

---

## Section 1 — Product Overview

**What the AI must answer here:**
- What does this product actually do in plain English (3–4 sentences, not marketing fluff)
- What is the single core promise — one sentence max
- Exact product category (e.g. AI SaaS Tool, B2B Analytics, Consumer App)
- Who the target personas are — describe each one with their pain level and willingness to pay
- What unique mechanism makes this work that competitors do not have

**Why this section matters:**
This section anchors the entire report. If the AI misunderstands the product here, every section after it will be off. Feed the business description, website URL, and niche description to make this accurate.

**Data inputs needed:**
- `business_name`
- `website`
- `category`
- `niche_description`
- `target_audience`

---

## Section 2 — Market Scope

**What the AI must answer here:**
- TAM — Total Addressable Market with rupee/dollar figure and reasoning behind the number
- SAM — Serviceable Addressable Market (the realistic slice)
- SOM — Share of Market achievable in Year 1 with current resources
- Market trend (growing, stable, declining) with estimated percentage
- India-specific opportunity — why India right now is special for this product
- Market timing score out of 100 with verdict (Early / Right Time / Late) and reasoning

**Why this section matters:**
Founders and investors both need this. Users also need to understand if the market is big enough to justify the effort. Be specific with numbers — "large market" is useless, "₹4,200 crore" is useful.

**Data inputs needed:**
- `category`
- `region`
- `target_audience`
- `goal`

---

## Section 3 — Strengths and Weaknesses

**What the AI must answer here:**

For strengths — each one needs:
- A clear title
- 2–3 sentences on why this is a real strength, not just a feature
- Impact level (High / Medium / Low)

For weaknesses — each one needs:
- A specific, honest title (not generic like "early stage")
- Why it is a real problem for the business
- How severe it is (Critical / Major / Minor)
- A concrete fix suggestion

For moat analysis:
- Current defensibility score out of 100
- Moat type (Data / Network / Brand / Technology / Distribution / None yet)
- Honest paragraph on whether this business can be copied easily

**Why this section matters:**
Most AI tools give fake validation here — "Amazing product, great team!" That is useless. This section must be brutally honest. If the moat is weak, say so. If the pricing undercuts competitors, say why that is a strength and also a risk.

**Data inputs needed:**
- All business data
- Competitor list
- Reddit context — in Virtual Mode, Groq uses training data; in Live Mode, real post sentiment is injected

---

## Section 4 — Improvement Roadmap

**What the AI must answer here:**
A prioritized list of improvements. Each item must include:
- Priority number (1 is highest)
- Title of the improvement
- Why it is critical — what business impact if not done
- How to implement it — specific technical or product steps, not vague advice
- Effort level (Low / Medium / High)
- Impact level (Low / Medium / High)
- Realistic timeline in weeks or months

**Why this section matters:**
This is one of the most actionable sections. Users need to know what to do next Monday, not in six months. Priority 1 items should be things that directly affect revenue or retention. Do not list 15 things — five to seven focused items are more useful than twenty vague ones.

**Data inputs needed:**
- Weaknesses from Section 3
- Reddit pain points (what users are complaining about in similar tools)
- SEO data if available

---

## Section 5 — Competitor Analysis

**What the AI must answer here:**

For each direct competitor:
- Name and website
- What they actually do (1–2 sentences)
- Their pricing
- Their real strengths (not just "big brand")
- Their exploitable weaknesses — gaps you can attack
- Their Reddit presence — which subreddits they appear in, how they engage
- Your specific advantage over them — one concrete angle

For indirect competitors:
- Name
- Threat level (High / Medium / Low)
- Why they are indirect and not direct

Competitive gap analysis:
- The single biggest unserved space in the market right now

**Why this section matters:**
Users must know exactly who they are fighting and where to attack. "SparkToro is expensive" is not enough. "SparkToro charges $300/month with no India pricing, no Reddit deep dive, and no ongoing monitoring" is useful.

**Data inputs needed:**
- Competitor list from user
- Reddit context — Virtual Mode: Groq knows competitor Reddit presence from training data; Live Mode: actual mentions scanned from fetched posts
- The product's own feature list for comparison

---

## Section 6 — Reddit Marketing Intelligence

**What the AI must answer here:**

For each target subreddit:
- Subreddit name with r/ prefix
- Approximate member count
- Why this specific community needs this product
- What type of content dominates (pain posts, tool recommendations, debates, success stories)
- How many times per week to post
- Best day and time to post (in IST for India-focused products)
- The exact content angle that works in this community
- What gets you banned or downvoted in this subreddit
- Types of threads that historically perform well
- Opportunity score out of 100

Overall Reddit strategy paragraph:
- How to approach Reddit as a whole for this business — not subreddit by subreddit, but the overarching philosophy

Reddit don't list:
- At least five mistakes that get founders banned, shadowbanned, or ignored on Reddit

**Why this section matters:**
Reddit is the primary distribution channel for this product. Most founders spam Reddit with product links and get banned within a week. This section must teach exactly how to behave on Reddit — which means understanding each subreddit's culture, not just its size.

**Virtual Mode behaviour (default):**
Groq generates this entire section from its training data. It knows r/SaaS, r/IndieHackers, r/entrepreneur and hundreds of other subreddits deeply — their cultures, what gets upvoted, what gets banned, best posting times. The output is based on patterns learned across millions of Reddit posts. This is sufficient for most use cases and produces immediately actionable subreddit strategies.

**Live Mode upgrade:**
When Reddit credentials are set, the backend fetches the top 10 live posts matching the business niche and injects them into the prompt. The AI then identifies buying signals from discussions happening right now — threads from the last 48 hours, rising keywords, real engagement scores. This is the upgrade for Pro plan users.

**Data inputs needed:**
- Business category and target audience (both modes)
- Competitor names (both modes — Virtual Mode knows their Reddit presence from training data)
- Live Reddit posts from `reddit_service.py` — only in Live Mode; returns empty array in Virtual Mode, which tells Groq to fall back to training data

---

## Section 7 — Marketing Strategy

**What the AI must answer here:**

Phase 1 — 0 to 100 users:
- Primary channel to focus on
- Specific tactics (not "post on social media" — actual tactics like "post a pain-point story in r/SaaS every Tuesday")
- Monthly budget estimate
- Expected timeline
- Expected conversion rate from visitor to signup

Phase 2 — 100 to 1,000 users:
- How the strategy shifts
- Which new channels to add
- Budget range

Channel priority ranking — for each channel:
- Channel name
- Priority rank
- Why this rank
- Effort required
- Expected customer acquisition cost in rupees

Positioning statement in this format:
"For [target user] who [problem], [product] is the [category] that [unique benefit] unlike [alternatives] which [limitation]"

**Why this section matters:**
Without a clear channel hierarchy, founders spread themselves across six platforms and get traction on none. This section forces a prioritized bet on one or two channels with specific tactics and expected costs.

**Data inputs needed:**
- Target personas from Section 1
- Competitor channels from Section 5
- Reddit intelligence from Section 6

---

## Section 8 — Content Playbook

**What the AI must answer here:**

Reddit post templates — for each template:
- Post type (Pain Post / Story Post / Tool Comparison / Value Post / Question Post)
- Title formula with placeholders in brackets
- Body structure description — what paragraphs to include, what to avoid
- CTA style — how to mention the product without triggering spam filters
- A real example title written for this specific business
- Which subreddits to use this template in
- Upvote potential (High / Medium / Low)

Content calendar for Week 1:
- Day by day breakdown
- Which subreddit for each day
- Post type for each day
- Specific topic for each day

Viral hook formulas:
- At least five proven headline formulas for this niche that drive clicks

**Why this section matters:**
Most founders know they need to "post on Reddit" but freeze when opening the compose window. This section eliminates that. Someone should be able to finish reading this and immediately write five posts without thinking.

**Data inputs needed:**
- Reddit intelligence from Section 6 (generated by Groq in Virtual Mode, or live posts in Live Mode)
- Product name and core promise
- Virtual Mode: Groq writes post templates based on known patterns for this niche. Live Mode: templates are shaped by real post titles that are currently getting traction

---

## Section 9 — SEO, AEO, and GEO Audit

### SEO (Search Engine Optimization)

**What the AI must answer here:**
- Overall SEO score out of 100
- Critical issues — specific missing elements (not generic advice)
- Quick wins — what can be fixed in under one week
- Target keywords — for each keyword: estimated monthly search volume, difficulty, and what content type to create
- Technical checklist with status for each item: meta titles, meta descriptions, schema markup, page speed, mobile optimization, internal linking, sitemap, robots.txt

### AEO (Answer Engine Optimization)

**What the AI must answer here:**
- Overall AEO score out of 100
- How AEO applies specifically to this type of product
- Featured snippet opportunities — questions this business could own in Google's answer boxes
- Whether an FAQ page is needed
- Voice search keywords — conversational queries to target
- Missing structured data types to add

### GEO (Generative Engine Optimization)

**What the AI must answer here:**
- Overall GEO score out of 100
- Current AI search visibility status — how well positioned for ChatGPT, Perplexity, Gemini
- Why GEO matters specifically for this product
- Specific tactics to improve AI search visibility
- Citation building strategy — how to get the product mentioned in AI-curated tool lists and roundups

**Why all three matter:**
SEO is for Google search. AEO is for Google's AI Overviews and featured snippets. GEO is for when someone asks ChatGPT "what is the best Reddit intelligence tool for founders." All three feed different traffic sources and all three are being underutilized by most early-stage products.

**Data inputs needed:**
- Website URL
- Product category
- Target keywords list if the user has provided one

---

## Section 10 — Benchmark Data

**What the AI must answer here:**

Feature comparison table:
- List of features to compare (8–10 features)
- Score out of 10 for each product on each feature
- This product and all direct competitors must be included

Pricing benchmark table:
- Each product with entry price, mid-tier price, and value-per-rupee rating

Growth potential score breakdown:
- Overall score out of 100
- Individual scores for: market timing, product differentiation, distribution advantage, team execution, monetization clarity
- Each score must have brief reasoning

**Why this section matters:**
Numbers communicate faster than paragraphs. A founder glancing at the benchmark chart instantly understands where they win and where they lose. The growth potential breakdown gives an investor-ready snapshot of the business's trajectory.

**How to render this on the frontend:**
- Feature comparison → Radar chart (recharts RadarChart)
- Pricing benchmark → Horizontal bar chart
- Growth potential breakdown → Horizontal bar chart or score rings

**Data inputs needed:**
- Competitor data from Section 5
- Feature list from the product's onboarding data

---

## Section 11 — Bonus Intelligence (6 Extra Questions)

These six sections add depth that competitors do not cover.

### 11a — Investor Readiness
- Score out of 100
- What investors will love about this business
- What will raise red flags
- The two-sentence narrative to use when pitching

### 11b — Pricing Strategy Audit
- Verdict on current pricing (too cheap / fair / expensive)
- Specific recommended changes with reasoning
- Psychological pricing tips — how to present tiers to maximize conversions

### 11c — Viral Loop Potential
- Score out of 100
- What naturally makes users share or mention this product
- A specific viral mechanic to add (e.g. "Powered by X" badge, public report sharing, referral credits)

### 11d — Retention Risks
- Each risk with likelihood level and mitigation strategy
- Focus on churn triggers specific to this type of product, not generic ones

### 11e — Quick Wins Next 30 Days
- Maximum five actions
- Each with expected outcome and estimated effort in hours
- These must be immediately executable — no research required, no team needed

### 11f — India Growth Hacks
- Tactics that work uniquely well in the Indian market for this product type
- Community-specific channels (WhatsApp groups, Telegram, LinkedIn India communities, Indie hackers India Slack, etc.)
- Pricing psychology specific to Indian SaaS buyers

---

## How All Sections Connect

```
Section 1 (Product Overview)
        feeds into
Section 2 (Market Scope) + Section 3 (Strengths/Weaknesses)
        feeds into
Section 4 (Roadmap) + Section 5 (Competitors)
        feeds into
Section 6 (Reddit Intel) + Section 7 (Marketing Strategy)
        feeds into
Section 8 (Content Playbook)
        runs parallel with
Section 9 (SEO/AEO/GEO) + Section 10 (Benchmarks)
        all feed into
Section 11 (Bonus Intelligence)
```

Each section informs the next. The Reddit intelligence in Section 6 shapes the content playbook in Section 8. The competitor weaknesses in Section 5 shape the positioning in Section 7. The SEO audit in Section 9 informs the quick wins in Section 11e. The report is not a list of independent sections — it is one connected analysis.

---

## What Makes This Better Than a Vague Report

| Generic Report | This Process |
|---|---|
| "Strong market opportunity" | "₹4,200 crore TAM, timing score 87/100, right window is next 18 months" |
| "Post on Reddit" | "Post pain story in r/SaaS on Tuesday 8 PM IST, use this exact title formula" |
| "Competitors exist" | "SparkToro charges $300/month, has no Reddit deep dive, zero India presence — attack here" |
| "Improve SEO" | "Missing schema markup, no FAQ page, 3 featured snippet gaps — fixes take under 1 week" |
| "Consider viral loops" | "Add public shareable report link — 'Made with [Product]' footer drives referral signups" |

The difference is specificity. Every claim must have a number, a name, or a next step attached to it.

---

## Groq API Settings (Required for Full Detail)

```
model        : llama-3.3-70b-versatile
max_tokens   : 8000  (minimum — use 16000 if plan allows)
temperature  : 0.65
top_p        : 0.9
response_fmt : json_object
```

Changing the model to a smaller one or leaving max_tokens at default (1024) will cut the report to 10% of its intended length. These settings are not optional.

---

## Data Flow Into the API Call

### Virtual Mode (Reddit credentials empty in .env)

```
Business profile data (from onboarding)
    +
Competitor list (from user input)
    +
System prompt (growth_intelligence_prompt.txt)
    ↓
reddit_service.py detects empty credentials → returns empty array
    ↓
Prompt tells Groq: "No live Reddit data — use training knowledge"
    ↓
Single Groq API call
    ↓
JSON with all 11 sections
    ↓
Save to Supabase → Return to frontend
```

### Live Mode (Reddit credentials filled in .env)

```
Business profile data (from onboarding)
    +
Live Reddit posts (reddit_service.py fetches top 10 posts)
    +
Competitor list (from user input)
    +
System prompt (growth_intelligence_prompt.txt)
    ↓
Posts injected into Groq prompt as live context
    ↓
Single Groq API call
    ↓
JSON with all 11 sections (with real-time signals)
    ↓
Save to Supabase → Return to frontend
```

### How `reddit_service.py` handles the switch

```python
def fetch_reddit_data(niche, target_audience, competitors):
    client_id = os.environ.get("REDDIT_CLIENT_ID", "")
    
    # Empty credentials = Virtual Mode
    if not client_id:
        return {
            "mode": "virtual",
            "posts": [],          # Empty array = Groq uses training data
            "message": "Virtual mode — Groq will use training knowledge for Reddit analysis"
        }
    
    # Credentials present = Live Mode
    # ... fetch real posts here ...
    return {
        "mode": "live",
        "posts": [...]            # Real posts injected into prompt
    }
```

The `mode` flag in the return value gets included in the Groq prompt so the AI knows which mode it is operating in and adjusts its language accordingly — Virtual Mode responses say "based on known patterns in this community" while Live Mode responses say "based on current discussions found."