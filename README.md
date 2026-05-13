# SignalLoop

> **AI-powered growth intelligence platform** that scans Reddit in real-time to surface buying signals, competitor mentions, and market opportunities for your business.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Reference](#api-reference)
- [Background Jobs](#background-jobs)
- [Pricing & Plans](#pricing--plans)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)

---

## Overview

SignalLoop connects to Reddit via PRAW, uses **Groq (Llama 3.3 70B)** as the primary AI engine and **Gemini** as a secondary engine, and runs a 3-step pipeline to turn raw social discussions into structured growth reports:

1. **Keyword Expansion** — AI generates 10 targeted Reddit search keywords for your business niche.
2. **Reddit Scan + Opportunity Extraction** — Searches subreddits, scores engagement, classifies intent (`buying`, `pain_point`, `comparison`, `discussion`).
3. **Strategy Report** — Generates a full JSON growth strategy with growth score, best communities, recommended actions, and competitor analysis.

If live Reddit data is unavailable, the system falls back to **Virtual Reddit Research** — where the AI synthesises realistic niche intelligence from its training knowledge.

---

## Architecture

```
┌─────────────────────┐        ┌──────────────────────────────┐
│   Next.js Frontend  │◄──────►│   Flask REST API (Backend)   │
│   (Vercel)          │  HTTPS │   (Gunicorn / Render)        │
└─────────────────────┘        └──────────┬───────────────────┘
                                           │
              ┌────────────────────────────┼──────────────────────┐
              │                            │                      │
     ┌────────▼──────┐        ┌────────────▼──────┐   ┌──────────▼──────┐
     │  Supabase DB  │        │  Reddit API (PRAW) │   │  Groq / Gemini  │
     │  (Postgres)   │        │                   │   │  AI Engines     │
     └───────────────┘        └───────────────────┘   └─────────────────┘
                                           │
                               ┌───────────▼───────────┐
                               │  APScheduler (Cron)   │
                               │  - Weekly Digest       │
                               │  - Opportunity Scanner │
                               │  - Competitor Monitor  │
                               └───────────────────────┘
```

**Auth flow:** Supabase handles OAuth/email auth on the frontend. The JWT is passed as `Authorization: Bearer <token>` to every backend API call. Flask validates it via the `require_auth` decorator.

---

## Project Structure

```
SignalLoop/
├── backend/
│   ├── app.py                  # Flask app factory, blueprint registration, scheduler
│   ├── config.py               # Environment variable config class
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile                # Gunicorn production entry point
│   ├── pyproject.toml          # Ruff linter config
│   ├── .env.example            # Environment variable template
│   │
│   ├── routes/                 # Flask Blueprints (REST endpoints)
│   │   ├── auth.py             # /auth — verify, logout, /me
│   │   ├── businesses.py       # /businesses — CRUD for business profiles
│   │   ├── competitors.py      # /businesses/<id>/competitors — CRUD + AI analysis
│   │   ├── opportunities.py    # /opportunities — list, save, delete signals
│   │   ├── reports.py          # /reports — trigger generation, list, fetch
│   │   ├── billing.py          # /billing — Razorpay subscriptions & webhooks
│   │   └── usage.py            # /usage — quota tracking
│   │
│   ├── services/               # Business logic layer
│   │   ├── groq_service.py     # Primary AI engine (Llama 3.3 70B via Groq)
│   │   ├── gemini_service.py   # Secondary AI engine (Gemini 3.1 Flash Lite)
│   │   ├── reddit_service.py   # PRAW wrapper — search, posts, comments, scoring
│   │   ├── report_service.py   # Orchestrates the 3-step AI pipeline
│   │   ├── competitor_service.py # Competitor analysis orchestration
│   │   ├── opportunity_service.py# Opportunity CRUD + scoring
│   │   ├── billing_service.py  # Razorpay subscription lifecycle
│   │   ├── usage_service.py    # Plan limits, usage counters, monthly reset
│   │   ├── email_service.py    # Transactional emails via Resend
│   │   └── prompt_loader.py    # Loads .txt prompt templates
│   │
│   ├── jobs/                   # APScheduler cron/interval jobs
│   │   ├── weekly_digest.py    # Every Monday 6AM — email digest per business
│   │   ├── trend_scanner.py    # Every 4 hours — scan Reddit for new opportunities
│   │   └── competitor_monitor.py # Daily 8AM — monitor competitor Reddit mentions
│   │
│   ├── utils/
│   │   ├── auth_middleware.py  # require_auth decorator (JWT validation)
│   │   ├── validators.py       # Business input validation & string sanitisation
│   │   ├── limiter.py          # Flask-Limiter rate limiting setup
│   │   ├── cache.py            # Redis/memory caching helpers
│   │   └── tracing.py          # Request tracing setup
│   │
│   └── prompts/
│       ├── strategy_prompt.txt   # Full strategy report prompt template
│       ├── competitor_prompt.txt # Competitor analysis prompt
│       └── opportunity_prompt.txt# Opportunity scoring prompt
│
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx        # Landing page (hero, features, pricing, FAQ, footer)
│   │   │   ├── layout.tsx      # Root layout with providers
│   │   │   ├── globals.css     # Global styles
│   │   │   ├── login/          # Login / signup page
│   │   │   ├── onboarding/     # Business setup wizard
│   │   │   ├── pricing/        # Pricing page
│   │   │   ├── checkout/       # Razorpay checkout flow
│   │   │   ├── billing/        # Billing management
│   │   │   └── dashboard/
│   │   │       ├── page.tsx        # Main dashboard (growth score, communities, signals)
│   │   │       ├── layout.tsx      # Dashboard shell with Sidebar + TopHeader
│   │   │       ├── reports/        # Strategy report detail view
│   │   │       ├── opportunities/  # Signal stream (filterable)
│   │   │       ├── competitors/    # Competitor management
│   │   │       ├── saved/          # Saved opportunities
│   │   │       └── settings/       # Business & account settings
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar with plan badge
│   │   │   ├── TopHeader.tsx       # Top bar with business switcher
│   │   │   ├── HaloBackground.tsx  # Animated canvas background
│   │   │   ├── UpgradeModal.tsx    # Upgrade prompt dialog
│   │   │   ├── FeatureGateOverlay.tsx # Blurs locked features
│   │   │   └── ui/                 # shadcn/ui component library
│   │   │
│   │   ├── hooks/
│   │   │   ├── useBusinesses.ts    # Fetches & caches user's businesses
│   │   │   ├── useUser.ts          # Auth user + plan data
│   │   │   └── useUsage.ts         # Usage quota hook
│   │   │
│   │   ├── store/
│   │   │   ├── businessStore.ts    # Zustand — active business selection
│   │   │   ├── userStore.ts        # Zustand — auth user & plan
│   │   │   └── uiStore.ts          # Zustand — sidebar open/close state
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios instance with JWT interceptor
│   │   │   ├── animations.ts       # Framer Motion spring configs
│   │   │   ├── utils.ts            # cn() class merger
│   │   │   └── supabase/           # Supabase client (browser + server + middleware)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces (Business, Report, Opportunity…)
│   │   │
│   │   └── middleware.ts           # Next.js middleware — Supabase session refresh
│   │
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── components.json             # shadcn/ui config
│
├── index.html                  # Static landing page (standalone HTML version)
├── DESIGN.md                   # Full visual design system specification
├── checklist.md                # Implementation checklist / PRD tracker
├── create_test_user.py         # Script to seed a test user in Supabase
├── test_email.py               # Email service integration test
├── test_till_phase3.py         # Phase 1-3 API integration tests
└── project_prd.pdf             # Original product requirements document
```

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Web Framework | Flask + Flask-CORS |
| WSGI Server | Gunicorn |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase JWT (validated server-side) |
| Primary AI | Groq — `llama-3.3-70b-versatile` |
| Secondary AI | Google Gemini — `gemini-3.1-flash-lite` |
| Reddit | PRAW (Python Reddit API Wrapper) |
| Payments | Razorpay (subscriptions + webhooks) |
| Email | Resend |
| Scheduling | APScheduler (BackgroundScheduler) |
| Rate Limiting | Flask-Limiter |
| Caching | Redis (falls back to memory in dev) |
| Linting | Ruff |
| Testing | Pytest |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI primitives |
| Animation | Framer Motion 12 |
| State Management | Zustand 5 |
| Server State | TanStack React Query 5 |
| Auth | Supabase SSR (`@supabase/ssr`) |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner + React Hot Toast |

---

## Features

### Core Product
- **Business Profiles** — Create up to 5 business profiles per account with name, website, category, project brief, goal, and region.
- **Competitor Tracking** — Add competitors per business; trigger AI analysis that scans Reddit for mentions and sentiment.
- **Growth Reports** — 3-step AI pipeline generates a full JSON strategy report including:
  - `growth_score` (0–100)
  - `growth_score_insights` (key intelligence bullets)
  - `best_communities` (top subreddits with activity level and rationale)
  - `recommended_actions`
  - Strategic narrative
- **Signal Stream** — Real-time Reddit signals classified by intent type (`buying`, `pain_point`, `comparison`, `discussion`) with opportunity scores (0–100).
- **Virtual Research Fallback** — When live Reddit data is unavailable (API limits), the AI synthesises realistic niche intelligence from its training data, seamlessly continuing the pipeline.
- **Saved Signals** — Save high-value opportunities for later reference.

### Automation (Background Jobs)
- **Weekly Digest** (Monday 6AM IST) — Per-business summary emailed to every user.
- **Opportunity Scanner** (every 4 hours) — Scans Reddit for new signals for Starter/Pro users; caps at 50 per business per scan; deduplicates via upsert.
- **Competitor Monitor** (daily 8AM IST) — Monitors Reddit for competitor brand mentions.

### Billing
- Razorpay subscription integration with HMAC webhook signature verification.
- Plan upgrades/downgrades reflected immediately in `users.plan`.
- Subscription lifecycle: `active` → `past_due` → `cancelled`.
- Monthly usage auto-reset when `monthly_reset_date` passes.

### Frontend UX
- Animated growth score gauge (SVG + Framer Motion).
- Animated Halo canvas background in the dashboard.
- Feature gate overlays for locked plan features.
- Upgrade modal with plan comparison.
- Business switcher in top header.
- Full onboarding wizard for first-time users.

---

## API Reference

All endpoints (except `/auth/verify`, `/billing/webhook`, and `/health`) require:
```
Authorization: Bearer <supabase_jwt>
```

### Auth — `/auth`
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/verify` | Verify JWT; create user + usage row if first login |
| `GET` | `/auth/me` | Get current user profile |
| `POST` | `/auth/logout` | Logout (client-side cleanup signal) |

### Businesses — `/businesses`
| Method | Path | Description |
|---|---|---|
| `POST` | `/businesses/` | Create a business (max 5 per user) |
| `GET` | `/businesses/` | List all businesses for current user |
| `GET` | `/businesses/<id>` | Get a single business |
| `PUT` | `/businesses/<id>` | Update a business |
| `DELETE` | `/businesses/<id>` | Delete a business |

### Competitors — `/businesses/<business_id>/competitors`
| Method | Path | Description |
|---|---|---|
| `POST` | `/businesses/<id>/competitors` | Add a competitor (plan limit enforced) |
| `GET` | `/businesses/<id>/competitors` | List competitors for a business |
| `DELETE` | `/businesses/<id>/competitors/<cid>` | Remove a competitor |
| `POST` | `/businesses/<id>/competitors/<cid>/analyse` | Trigger full AI competitor analysis |

### Reports — `/reports`
| Method | Path | Description |
|---|---|---|
| `POST` | `/reports/generate` | Generate a new growth report (triggers 3-step pipeline) |
| `GET` | `/reports/` | List reports for a business |
| `GET` | `/reports/<id>` | Get a single report |

### Opportunities — `/opportunities`
| Method | Path | Description |
|---|---|---|
| `GET` | `/opportunities/` | List opportunities for a business |
| `POST` | `/opportunities/<id>/save` | Save an opportunity |
| `DELETE` | `/opportunities/<id>` | Remove an opportunity |

### Billing — `/billing`
| Method | Path | Description |
|---|---|---|
| `POST` | `/billing/create-subscription` | Create Razorpay subscription (rate limited: 10/min) |
| `POST` | `/billing/verify-payment` | Verify payment signature and activate plan |
| `GET` | `/billing/subscription` | Get current subscription details |
| `POST` | `/billing/cancel` | Cancel subscription at cycle end |
| `POST` | `/billing/webhook` | Razorpay webhook handler (no auth required) |

### Usage — `/usage`
| Method | Path | Description |
|---|---|---|
| `GET` | `/usage/` | Get current usage counts and remaining quota |

### Health
| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{"status": "ok", "environment": "..."}` |

---

## Background Jobs

| Job | Schedule | Description |
|---|---|---|
| `run_weekly_digest` | Every Monday at 06:00 IST | Fetches last 7 days of opportunities per business, generates AI digest, sends email via Resend |
| `run_opportunity_scanner` | Every 4 hours | Scans Reddit for Starter/Pro users; scores engagement (min 20), classifies intent, upserts opportunities |
| `run_competitor_monitor` | Daily at 08:00 IST | Monitors Reddit for competitor brand mentions and updates analysis data |

All jobs log errors per-business and continue to next business on failure (no full crash).

---

## Pricing & Plans

| Feature | Free | Starter | Pro |
|---|---|---|---|
| Monthly Reports | Unlimited* | 20 | 50 |
| Competitors Tracked | Unlimited* | 5 | Unlimited |
| Opportunity Scanner | Manual only | ✅ Auto (4hr) | ✅ Auto (4hr) |
| Weekly Digest Email | ❌ | ✅ | ✅ |
| Price | Free | Paid | Paid |

> *Free plan limits are set to `9999` in code — effectively unlimited for MVP testing.

Plan IDs are configured via `RAZORPAY_PLAN_STARTER_ID` and `RAZORPAY_PLAN_PRO_ID` environment variables.

---

## Environment Variables

### Backend (`backend/.env`)
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Reddit API (create app at https://www.reddit.com/prefs/apps)
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
REDDIT_USER_AGENT=ai-distribution-engine/1.0

# AI APIs
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key

# Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
RAZORPAY_PLAN_STARTER_ID=plan_xxxxx
RAZORPAY_PLAN_PRO_ID=plan_yyyyy

# Email
RESEND_API_KEY=your-resend-api-key

# App
FLASK_ENV=development
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379  # Optional; falls back to memory
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- A Supabase project
- Reddit API credentials
- Groq API key (free tier available)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and fill environment variables
cp .env.example .env

# Run development server
python -m flask --app app run --port 5000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill environment variables
cp .env.local.example .env.local   # create this from template above

# Run development server
npm run dev
```

Visit `http://localhost:3000`.

### Running Tests

```bash
# From repo root
python test_till_phase3.py   # Phase 1-3 integration tests
python test_email.py         # Email service test
python create_test_user.py   # Seed a test user
```

---

## Database Schema

Core tables in Supabase (PostgreSQL):

| Table | Key Columns |
|---|---|
| `users` | `id`, `email`, `name`, `plan` |
| `businesses` | `id`, `user_id`, `business_name`, `website`, `category`, `project_brief`, `goal`, `region` |
| `competitors` | `id`, `business_id`, `competitor_name`, `website`, `analysis_data` |
| `reports` | `id`, `business_id`, `report_type`, `report_data` (JSONB), `status` |
| `opportunities` | `id`, `business_id`, `title`, `source`, `subreddit`, `url`, `engagement_score`, `opportunity_score`, `intent_type`, `ai_summary`, `recommended_action` |
| `subscriptions` | `id`, `user_id`, `plan`, `razorpay_subscription_id`, `razorpay_customer_id`, `status`, `renewal_date` |
| `usage_tracking` | `id`, `user_id`, `reports_used`, `competitors_used`, `monthly_reset_date` |
| `weekly_digests` | `id`, `business_id`, `digest_data` (JSONB) |

Row-level security is enforced via Supabase RLS policies. The Flask backend uses the **service role key** to bypass RLS and enforce ownership checks in application code.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

*© SignalLoop. All rights reserved.*
