# SignalLoop — Master Development Checklist
> Reddit-First Growth Intelligence Platform · MVP v1 · Built with Next.js + Flask + Supabase + Gemini + Razorpay

---

## How to use this checklist
- `[ ]` Not started
- `[~]` In progress  
- `[x]` Done
- Items are written as concrete, single actions — not categories
- Work top-to-bottom within each phase; later phases depend on earlier ones

---

## PHASE 0 — PROJECT SETUP

### 0.1 Repositories
- [ ] Create GitHub organisation or personal repo named `SignalLoop`
- [x] Create `frontend/` directory for Next.js app
- [x] Create `backend/` directory for Flask API
- [x] Initialise `.gitignore` covering: `node_modules/`, `.next/`, `__pycache__/`, `*.pyc`, `.env`, `.env.local`, `venv/`
- [ ] Create `main` branch (production) and `develop` branch (staging)
- [x] Write root-level `README.md` with: what the product is, local setup steps for both frontend and backend, env var reference
- [x] Add `CONTRIBUTING.md` with branch naming convention (`feature/`, `fix/`, `chore/`)

### 0.2 Environment Variables — Frontend (`.env.local`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- [ ] `NEXT_PUBLIC_API_URL` — Railway Flask backend URL (e.g. `https://api.yourdomain.railway.app`)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay public key (safe to expose to frontend)
- [x] Create `.env.local.example` with all keys listed but values blank

### 0.3 Environment Variables — Backend (`.env`)
- [ ] `SUPABASE_URL` — same as frontend
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (never expose to frontend)
- [ ] `REDDIT_CLIENT_ID` — from Reddit app dashboard
- [ ] `REDDIT_CLIENT_SECRET` — from Reddit app dashboard
- [ ] `REDDIT_USER_AGENT` — e.g. `AiDistributionEngine/1.0 by YourUsername`
- [ ] `GEMINI_API_KEY` — from Google AI Studio
- [ ] `RAZORPAY_KEY_ID` — Razorpay API key
- [ ] `RAZORPAY_KEY_SECRET` — Razorpay API secret
- [ ] `FLASK_SECRET_KEY` — random 32-byte secret for Flask sessions
- [ ] `FLASK_ENV` — set to `production` on Railway, `development` locally
- [ ] `FRONTEND_URL` — Vercel domain, used for CORS whitelist
- [x] Create `.env.example` with all keys listed but values blank

### 0.4 Local Dev Tooling
- [x] Install Node.js 20+ LTS
- [x] Install Python 3.11+
- [ ] Create Python virtual environment: `python -m venv venv`
- [ ] Activate venv and install all dependencies from `requirements.txt`
- [ ] Install Node dependencies with `npm install` or `pnpm install`
- [ ] Confirm `python app.py` starts Flask without errors
- [ ] Confirm `npm run dev` starts Next.js without errors
- [x] Set up ESLint for Next.js (`eslint-config-next` already included)
- [x] Set up Prettier with `.prettierrc` for frontend
- [ ] Set up Black for Python formatting: `pip install black`
- [x] Set up Ruff for Python linting: `pip install ruff`

---

## PHASE 1 — INFRASTRUCTURE & THIRD-PARTY SERVICES

### 1.1 Vercel — Frontend Hosting
- [ ] Create Vercel account at vercel.com
- [ ] Connect GitHub repo to Vercel via "Import Project"
- [ ] Set root directory to `frontend/`
- [ ] Set build command to `next build`
- [ ] Set output directory to `.next`
- [ ] Add all `NEXT_PUBLIC_*` environment variables in Vercel dashboard → Settings → Environment Variables
- [ ] Enable deployment for Production (main branch) and Preview (develop branch)
- [ ] Note the generated Vercel domain (e.g. `SignalLoop.vercel.app`)
- [ ] Optionally add a custom domain and configure DNS

### 1.2 Railway — Backend Hosting
- [ ] Create Railway account at railway.app
- [ ] Create a new project in Railway
- [ ] Connect GitHub repo, point to `backend/` folder
- [ ] Add `Procfile` to `backend/` with content: `web: gunicorn app:app --workers 2 --timeout 120`
- [ ] Set start command in Railway to use the Procfile
- [ ] Add all backend environment variables in Railway → Variables tab
- [ ] Enable auto-deploy on push to `main`
- [ ] Note the generated Railway public URL
- [ ] Confirm `/health` endpoint returns 200 after first deploy

### 1.3 Supabase — Database & Auth
- [ ] Create Supabase account at supabase.com
- [ ] Create a new project (choose region closest to India: `ap-south-1`)
- [ ] Save Project URL from Settings → API → Project URL
- [ ] Save `anon` public key from Settings → API → Project API Keys
- [ ] Save `service_role` key from Settings → API → Project API Keys (keep secret)
- [ ] Enable Google OAuth provider: Authentication → Providers → Google → add Google OAuth Client ID + Secret
- [ ] Enable Email provider: Authentication → Providers → Email → enable Email/Password signup
- [ ] Set Site URL in Supabase Auth settings to your Vercel domain
- [ ] Add `http://localhost:3000` to Redirect URLs for local dev
- [ ] Add Vercel production URL to Redirect URLs

### 1.4 Reddit API
- [ ] Go to reddit.com/prefs/apps and click "create another app"
- [ ] Set app type to "script"
- [ ] Set redirect URI to `http://localhost:8080` (unused but required)
- [ ] Save `client_id` (shown under app name) and `client_secret`
- [ ] Confirm user agent string follows format: `platform:app_name:version (by u/username)`
- [ ] Test authentication locally: `import praw; r = praw.Reddit(...)` and call `r.subreddit("test").hot(limit=1)`
- [ ] Confirm requests succeed without 401 errors

### 1.5 Gemini API
- [ ] Go to aistudio.google.com and create a new API key
- [ ] Save the key as `GEMINI_API_KEY`
- [ ] Set up billing in Google Cloud Console (required for production usage)
- [ ] Set a monthly spend alert at Rs.3,000 in Google Cloud billing alerts
- [ ] Test Gemini Flash-Lite call locally: `genai.GenerativeModel("gemini-1.5-flash-8b")`
- [ ] Test Gemini Flash call locally: `genai.GenerativeModel("gemini-1.5-flash")`
- [ ] Confirm both models return responses without errors

### 1.6 Razorpay
- [ ] Create Razorpay account at razorpay.com and complete KYC
- [ ] Enable Subscriptions product in Razorpay dashboard → Products
- [ ] Go to Razorpay → Settings → API Keys and generate Test mode key pair
- [ ] Save Test `key_id` and `key_secret`
- [ ] Create Starter subscription plan in Razorpay: name "Starter", amount Rs.499, interval monthly
- [ ] Note the `plan_id` for Starter
- [ ] Create Pro subscription plan in Razorpay: name "Pro", amount Rs.999, interval monthly
- [ ] Note the `plan_id` for Pro
- [ ] Go to Settings → Webhooks → Add new webhook
- [ ] Set webhook URL to `https://your-railway-url/billing/webhook`
- [ ] Enable events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed`
- [ ] Save the webhook secret for HMAC verification
- [ ] Repeat all the above for Live mode before launch

---

## PHASE 2 — DATABASE SCHEMA

> All tables created in Supabase SQL editor or via migrations. RLS must be enabled on every table.

### 2.1 Table: `users`
- [x] Create table `users`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `email` — `text`, unique, not null
- [x] Add column `name` — `text`, nullable
- [x] Add column `avatar_url` — `text`, nullable
- [x] Add column `plan` — `text`, not null, default `'free'`, check constraint `plan IN ('free', 'starter', 'pro')`
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable Row Level Security on `users`
- [x] Add RLS policy: `SELECT` — users can only read their own row (`auth.uid() = id`)
- [x] Add RLS policy: `UPDATE` — users can only update their own row
- [x] Create index on `email`
- [x] Create Supabase database function `handle_new_user()` that inserts into `users` on auth signup
- [x] Create trigger `on_auth_user_created` that fires `handle_new_user()` after insert on `auth.users`

### 2.2 Table: `usage_tracking`
- [x] Create table `usage_tracking`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `user_id` — `uuid`, foreign key → `users.id`, on delete cascade, unique
- [x] Add column `reports_used` — `integer`, default `0`, not null
- [x] Add column `competitors_used` — `integer`, default `0`, not null
- [x] Add column `monthly_reset_date` — `date`, not null
- [x] Enable RLS on `usage_tracking`
- [x] Add RLS policy: `SELECT` — only own row (`auth.uid() = user_id`)
- [x] Add RLS policy: `UPDATE` — only own row
- [x] Create index on `user_id`
- [x] Update `handle_new_user()` to also insert a `usage_tracking` row with `monthly_reset_date = date_trunc('month', now()) + interval '1 month'`

### 2.3 Table: `businesses`
- [x] Create table `businesses`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `user_id` — `uuid`, foreign key → `users.id`, on delete cascade, not null
- [x] Add column `business_name` — `text`, not null
- [x] Add column `website` — `text`, nullable
- [x] Add column `category` — `text`, nullable (SaaS / Creator Tool / Agency / AI Tool / Ecommerce / Local Business / Other)
- [x] Add column `target_audience` — `text`, nullable
- [x] Add column `goal` — `text`, nullable (Leads / Traffic / Brand Awareness / Audience Growth / Sales)
- [x] Add column `region` — `text`, nullable (India / Global / USA / UK / Other)
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable RLS on `businesses`
- [x] Add RLS policy: `SELECT` — only rows where `auth.uid() = user_id`
- [x] Add RLS policy: `INSERT` — `auth.uid() = user_id`
- [x] Add RLS policy: `UPDATE` — `auth.uid() = user_id`
- [x] Add RLS policy: `DELETE` — `auth.uid() = user_id`
- [x] Create index on `user_id`

### 2.4 Table: `competitors`
- [x] Create table `competitors`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `business_id` — `uuid`, foreign key → `businesses.id`, on delete cascade, not null
- [x] Add column `competitor_name` — `text`, not null
- [x] Add column `website` — `text`, nullable
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable RLS on `competitors`
- [x] Add RLS policy: `SELECT` — only if the related `business.user_id = auth.uid()` (join-based policy)
- [x] Add RLS policy: `INSERT` — same join check
- [x] Add RLS policy: `DELETE` — same join check
- [x] Create index on `business_id`

### 2.5 Table: `reports`
- [x] Create table `reports`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `business_id` — `uuid`, foreign key → `businesses.id`, on delete cascade, not null
- [x] Add column `report_type` — `text`, not null (values: `growth`, `competitor`, `opportunity`)
- [x] Add column `report_data` — `jsonb`, not null
- [x] Add column `status` — `text`, default `'complete'` (values: `pending`, `complete`, `failed`)
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable RLS on `reports`
- [x] Add RLS policy: `SELECT` — only if related `business.user_id = auth.uid()`
- [x] Add RLS policy: `DELETE` — only if related `business.user_id = auth.uid()`
- [x] Create index on `business_id`
- [x] Create index on `created_at DESC` for sorting

### 2.6 Table: `opportunities`
- [x] Create table `opportunities`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `business_id` — `uuid`, foreign key → `businesses.id`, on delete cascade, not null
- [x] Add column `title` — `text`, not null
- [x] Add column `source` — `text`, default `'reddit'`
- [x] Add column `subreddit` — `text`, nullable
- [x] Add column `url` — `text`, nullable
- [x] Add column `engagement_score` — `integer`, default `0`
- [x] Add column `opportunity_score` — `integer`, default `0` (range 0–100)
- [x] Add column `ai_summary` — `text`, nullable
- [x] Add column `recommended_action` — `text`, nullable
- [x] Add column `intent_type` — `text`, nullable (values: `buying`, `pain_point`, `comparison`, `discussion`)
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable RLS on `opportunities`
- [x] Add RLS policy: `SELECT` — only if related `business.user_id = auth.uid()`
- [x] Create index on `(business_id, opportunity_score DESC)`
- [x] Create index on `created_at DESC`
- [x] Add unique constraint on `(business_id, url)` to prevent duplicate opportunities

### 2.7 Table: `saved_opportunities`
- [x] Create table `saved_opportunities`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `user_id` — `uuid`, foreign key → `users.id`, on delete cascade, not null
- [x] Add column `opportunity_id` — `uuid`, foreign key → `opportunities.id`, on delete cascade, not null
- [x] Add column `saved_at` — `timestamptz`, default `now()`
- [x] Add unique constraint on `(user_id, opportunity_id)` — prevents double-saving
- [x] Enable RLS on `saved_opportunities`
- [x] Add RLS policy: `SELECT` — `auth.uid() = user_id`
- [x] Add RLS policy: `INSERT` — `auth.uid() = user_id`
- [x] Add RLS policy: `DELETE` — `auth.uid() = user_id`
- [x] Create index on `user_id`

### 2.8 Table: `weekly_digests`
- [x] Create table `weekly_digests`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `business_id` — `uuid`, foreign key → `businesses.id`, on delete cascade, not null
- [x] Add column `digest_data` — `jsonb`, not null
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable RLS on `weekly_digests`
- [x] Add RLS policy: `SELECT` — only if related `business.user_id = auth.uid()`
- [x] Create index on `(business_id, created_at DESC)`

### 2.9 Table: `subscriptions`
- [x] Create table `subscriptions`
- [x] Add column `id` — `uuid`, primary key, default `gen_random_uuid()`
- [x] Add column `user_id` — `uuid`, foreign key → `users.id`, on delete cascade, not null
- [x] Add column `plan` — `text`, not null
- [x] Add column `razorpay_customer_id` — `text`, nullable
- [x] Add column `razorpay_subscription_id` — `text`, nullable, unique
- [x] Add column `status` — `text`, not null, default `'active'` (values: `active`, `cancelled`, `past_due`)
- [x] Add column `renewal_date` — `date`, nullable
- [x] Add column `created_at` — `timestamptz`, default `now()`
- [x] Enable RLS on `subscriptions`
- [x] Add RLS policy: `SELECT` — `auth.uid() = user_id`
- [x] Create index on `user_id`
- [x] Create index on `razorpay_subscription_id`

---

## PHASE 3 — BACKEND (Flask API)

### 3.1 Project Bootstrap (`backend/`)
- [x] Create `backend/app.py` — Flask app factory with CORS, blueprints, and scheduler
- [x] Create `backend/config.py` — load all env vars from `.env` using `python-dotenv`, expose as a `Config` class
- [x] Create `backend/requirements.txt` with pinned versions:
  - [x] `flask`
  - [x] `flask-cors`
  - [x] `gunicorn`
  - [x] `python-dotenv`
  - [x] `supabase`
  - [x] `praw` (Reddit API wrapper)
  - [x] `groq` (Migrated from Gemini due to quotas)
  - [x] `razorpay`
  - [x] `apscheduler`
  - [x] `flask-limiter`
  - [x] `resend`
- [x] In `app.py`: initialise Flask app
- [x] In `app.py`: configure `flask-cors` to allow only the `FRONTEND_URL` origin
- [x] In `app.py`: register all blueprints (auth, reports, opportunities, competitors, billing, usage)
- [x] In `app.py`: initialise and start `APScheduler BackgroundScheduler`
- [x] In `app.py`: register all background jobs with their schedules
- [x] In `app.py`: add `@app.route("/health")` returning `{"status": "ok", "version": "1.0"}`
- [x] In `app.py`: add global `@app.errorhandler(Exception)` returning JSON error response
- [x] In `app.py`: add `@app.errorhandler(404)` returning `{"error": "not found"}`
- [x] In `app.py`: add `@app.errorhandler(405)` returning `{"error": "method not allowed"}`

### 3.2 Auth Middleware (`backend/utils/auth.py`)
- [x] Create `require_auth` decorator function
- [x] Extract `Authorization: Bearer <token>` header from every incoming request
- [x] If header is missing: return `401 {"error": "missing_token"}`
- [x] Call Supabase `auth.get_user(token)` using the service role client to verify the JWT
- [x] If token is invalid or expired: return `401 {"error": "invalid_token"}`
- [x] Attach the decoded `user_id` (UUID string) to Flask's `g.user_id`
- [x] Attach the full user object to `g.user` for use in route handlers
- [x] Export `require_auth` so all route files can import and use it as a decorator

### 3.3 Auth Routes (`backend/routes/auth.py`)
- [x] Create `auth_bp = Blueprint("auth", __name__, url_prefix="/auth")`
- [x] `POST /auth/verify`:
  - [x] Call `require_auth` logic to validate the JWT from the request header
  - [x] Query `users` table for a row matching `user_id`
  - [x] If no row exists (first login): insert new row into `users` with email, name, plan='free'
  - [x] If no `usage_tracking` row exists for this user: insert one with `reports_used=0`, `competitors_used=0`, `monthly_reset_date` = first day of next month
  - [x] Return `{"user": {...}, "plan": "free"}`
- [x] `GET /auth/me`:
  - [x] Require auth
  - [x] Query `users` table for `g.user_id`
  - [x] Join `usage_tracking` to get usage counts
  - [x] Return full user object including plan, usage, limits

### 3.4 Usage Service (`backend/services/usage_service.py`)
- [x] Define plan limits dict: `PLAN_LIMITS = {"free": {"reports": 1, "competitors": 1}, "starter": {"reports": 20, "competitors": 5}, "pro": {"reports": 50, "competitors": 999}}`
- [x] `get_usage(user_id)` — query `usage_tracking` for this user, return row as dict
- [x] `get_plan(user_id)` — query `users.plan` for this user, return string
- [x] `check_report_limit(user_id)` — return `True` if `reports_used < PLAN_LIMITS[plan]["reports"]`, else `False`
- [x] `check_competitor_limit(user_id)` — return `True` if `competitors_used < PLAN_LIMITS[plan]["competitors"]`, else `False`
- [x] `increment_reports(user_id)` — `UPDATE usage_tracking SET reports_used = reports_used + 1 WHERE user_id = ?`
- [x] `increment_competitors(user_id)` — `UPDATE usage_tracking SET competitors_used = competitors_used + 1 WHERE user_id = ?`
- [x] `decrement_competitors(user_id)` — called when a competitor is deleted
- [x] `reset_monthly_usage(user_id)` — set `reports_used=0`, `competitors_used=0`, `monthly_reset_date` = first of next month
- [x] `check_and_auto_reset(user_id)` — if today >= `monthly_reset_date`, call `reset_monthly_usage()`; call this at the start of any usage check
- [x] `get_remaining(user_id)` — return `{"reports_remaining": N, "competitors_remaining": N, "plan": "...", "limits": {...}}`

### 3.5 Usage Routes (`backend/routes/usage.py`)
- [x] Create `usage_bp = Blueprint("usage", __name__, url_prefix="/usage")`
- [x] `GET /usage`:
  - [x] Require auth
  - [x] Call `check_and_auto_reset(g.user_id)` to handle any pending monthly resets
  - [x] Call `get_remaining(g.user_id)`
  - [x] Return full usage object with: `reports_used`, `reports_limit`, `reports_remaining`, `competitors_used`, `competitors_limit`, `competitors_remaining`, `plan`, `monthly_reset_date`

### 3.6 Business Routes (`backend/routes/businesses.py`)
- [x] Create `businesses_bp = Blueprint("businesses", __name__, url_prefix="/businesses")`
- [x] `POST /businesses`:
  - [x] Require auth
  - [x] Parse body: `business_name` (required), `website`, `category`, `target_audience`, `goal`, `region`
  - [x] Validate `business_name` is non-empty string
  - [x] Insert row into `businesses` with `user_id = g.user_id`
  - [x] Return created business object with 201
- [x] `GET /businesses`:
  - [x] Require auth
  - [x] Query all businesses where `user_id = g.user_id`
  - [x] Return array (empty array is valid)
- [x] `GET /businesses/<business_id>`:
  - [x] Require auth
  - [x] Query business by `id` and `user_id = g.user_id`
  - [x] Return 404 if not found or not owned by user
  - [x] Return business object
- [x] `PUT /businesses/<business_id>`:
  - [x] Require auth
  - [x] Verify user owns this business
  - [x] Update only provided fields (partial update)
  - [x] Return updated business object
- [x] `DELETE /businesses/<business_id>`:
  - [x] Require auth
  - [x] Verify user owns this business
  - [x] Delete the business (cascades to competitors, reports, opportunities)
  - [x] Return `{"deleted": true}`

### 3.7 Competitor Routes (`backend/routes/competitors.py`)
- [x] Create `competitors_bp = Blueprint("competitors", __name__, url_prefix="/businesses")`
- [x] `POST /businesses/<business_id>/competitors`:
  - [x] Require auth
  - [x] Verify user owns `business_id`
  - [x] Call `check_and_auto_reset(g.user_id)`
  - [x] Call `check_competitor_limit(g.user_id)` — if exceeded return `402 {"error": "competitor_limit_exceeded", "upgrade_required": true}`
  - [x] Parse body: `competitor_name` (required), `website` (optional)
  - [x] Insert into `competitors` table
  - [x] Call `increment_competitors(g.user_id)`
  - [x] Return created competitor with 201
- [x] `GET /businesses/<business_id>/competitors`:
  - [x] Require auth
  - [x] Verify user owns `business_id`
  - [x] Query all competitors for this business
  - [x] Return array
- [x] `DELETE /businesses/<business_id>/competitors/<competitor_id>`:
  - [x] Require auth
  - [x] Verify user owns `business_id`
  - [x] Verify competitor belongs to this business
  - [x] Delete the competitor row
  - [x] Call `decrement_competitors(g.user_id)`
  - [x] Return `{"deleted": true}`

### 3.8 Reddit Service (`backend/services/reddit_service.py`)
- [x] Initialise PRAW Reddit instance using env vars: `client_id`, `client_secret`, `user_agent`
- [x] Use `praw.Reddit(..., read_only=True)` since we only read data
- [x] `search_subreddits(keywords: list[str], limit=10) -> list[dict]`:
  - [x] For each keyword, call `reddit.subreddits.search(keyword, limit=5)`
  - [x] Deduplicate results by subreddit name
  - [x] Return list of `{"name": str, "display_name": str, "subscribers": int, "description": str}`
- [x] `search_posts(subreddit_names: list[str], keywords: list[str], limit_per=10) -> list[dict]`:
  - [x] For each subreddit and keyword combination, call `reddit.subreddit(name).search(keyword, sort="relevance", time_filter="month", limit=limit_per)`
  - [x] Extract per post: `title`, `selftext`, `url`, `score`, `num_comments`, `subreddit`, `created_utc`, `permalink`
  - [x] Deduplicate by `id`
  - [x] Return list of post dicts
- [x] `get_hot_posts(subreddit_name: str, limit=25) -> list[dict]`:
  - [x] Call `reddit.subreddit(subreddit_name).hot(limit=limit)`
  - [x] Return same post dict format as above
- [x] `get_post_comments(post_id: str, limit=10) -> list[str]`:
  - [x] Fetch `reddit.submission(id=post_id)` and expand `comment.replies` one level
  - [x] Return top-level comment bodies as a list of strings (ignore deleted/removed)
- [x] `calculate_engagement_score(post: dict) -> int`:
  - [x] Formula: `min(100, int((post["score"] * 0.4) + (post["num_comments"] * 2.5)))`
  - [x] Return integer 0–100
- [ ] Handle `praw.exceptions.PRAWException` — log error, return empty list
- [ ] Handle HTTP 429 (rate limit) — sleep 60 seconds and retry once
- [ ] Handle HTTP 503 — log and return empty list without crashing

### 3.9 Gemini Service (`backend/services/gemini_service.py`)
- [x] Import `google.generativeai as genai` and configure with `GEMINI_API_KEY`
- [x] Define two model instances:
  - [x] `FLASH_LITE = genai.GenerativeModel("gemini-1.5-flash-8b")` — for bulk cheap tasks
  - [x] `FLASH = genai.GenerativeModel("gemini-1.5-flash")` — for final reports
- [x] `generate_keywords(business_description: str) -> list[str]`:
  - [x] Use `FLASH_LITE`
  - [x] Prompt: given the business description, return 8–12 Reddit search keywords as a JSON array
  - [x] Parse response as JSON list of strings
  - [x] Return the list
- [x] `summarise_posts(posts: list[dict], business_context: str) -> str`:
  - [x] Use `FLASH_LITE`
  - [x] Build prompt with up to 20 post titles + first 300 chars of body + subreddit
  - [x] Ask model to summarise the key themes, pain points, and discussions in 200–300 words
  - [x] Return summary as plain text string
- [x] `extract_opportunities(summary: str, business_context: str) -> list[dict]`:
  - [x] Use `FLASH_LITE`
  - [x] Prompt instructs model to return a JSON array of opportunity objects
  - [x] Each object must have: `title`, `ai_summary`, `recommended_action`, `opportunity_score` (0–100), `intent_type` (buying/pain_point/comparison/discussion)
  - [x] Parse response as JSON
  - [x] Return list of dicts
- [x] `categorise_intent(post_title: str, post_body: str) -> str`:
  - [x] Use `FLASH_LITE`
  - [x] Prompt: classify this post as one of: `buying`, `pain_point`, `comparison`, `discussion`
  - [x] Return the single string label
- [x] `generate_strategy_report(business: dict, competitors: list, opportunities: list, post_summary: str) -> dict`:
  - [x] Use `FLASH` (higher quality for the main user-facing output)
  - [x] Build a detailed prompt using the strategy_prompt.txt template
  - [x] Inject: business name, category, target audience, goal, region, competitor names, opportunities summary, post summary
  - [x] Ask model to return a JSON object with:
    - [x] `growth_score` (int 0–100)
    - [x] `growth_score_insights` (list of 3 strings)
    - [x] `best_communities` (list of 3 objects: subreddit, members, activity, why_it_matters, suggested_strategy list)
    - [x] `opportunities` (list — pass through extracted opportunities)
    - [x] `content_ideas` (list of 5 strings)
    - [x] `strategy_summary` (string, 150–200 words)
  - [x] Parse JSON response
  - [x] Return dict
- [x] `generate_competitor_analysis(competitor_name: str, website: str, reddit_mentions: list) -> dict`:
  - [x] Use `FLASH`
  - [x] Load `competitor_prompt.txt` and inject competitor data
  - [x] Return dict with: `reddit_presence_score`, `top_content_types`, `underserved_communities`, `opportunity_gaps`, `summary`
- [x] `generate_weekly_digest(business: dict, new_opportunities: list, trends: list) -> dict`:
  - [x] Use `FLASH_LITE`
  - [x] Return dict with: `new_discussions_count`, `rising_keywords`, `competitor_trends`, `top_trend`, `best_community`, `best_action`, `digest_summary`
- [ ] All functions: wrap Gemini call in try/except
- [ ] On `google.api_core.exceptions.ResourceExhausted` (429): sleep 30s and retry once
- [ ] On `google.api_core.exceptions.DeadlineExceeded`: return empty/default structure and log error
- [x] All functions that return JSON: strip any markdown code fences (` ```json ` to ` ``` `) before `json.loads()`

### 3.10 Prompt Files (`backend/prompts/`)
- [x] Create `backend/prompts/opportunity_prompt.txt`:
  - [x] Instruction: "You are a growth intelligence AI. Given Reddit discussion data and business context, extract the top growth opportunities."
  - [x] Variables: `{business_name}`, `{category}`, `{target_audience}`, `{goal}`, `{reddit_summary}`
  - [x] Output instruction: "Return ONLY a valid JSON array. No markdown. No explanation."
  - [x] Output schema: array of objects with `title`, `ai_summary`, `recommended_action`, `opportunity_score`, `intent_type`
- [x] Create `backend/prompts/competitor_prompt.txt`:
  - [x] Instruction: "You are a competitive intelligence AI. Analyse this competitor's Reddit presence."
  - [x] Variables: `{competitor_name}`, `{website}`, `{reddit_mentions_summary}`
  - [x] Output instruction: "Return ONLY valid JSON. No markdown."
  - [x] Output schema: object with `reddit_presence_score`, `top_content_types`, `underserved_communities`, `opportunity_gaps`, `summary`
- [x] Create `backend/prompts/strategy_prompt.txt`:
  - [x] Instruction: "You are a growth strategist. Generate a full growth intelligence report for this business based on Reddit data."
  - [x] Variables: `{business_name}`, `{category}`, `{target_audience}`, `{goal}`, `{region}`, `{competitors}`, `{post_summary}`, `{opportunities}`
  - [x] Output instruction: "Return ONLY valid JSON. No markdown. No preamble."
  - [x] Output schema: full report object as defined in gemini_service.py
- [x] Create `backend/services/prompt_loader.py`:
  - [x] `load_prompt(filename: str) -> str` — reads from `prompts/` directory and returns content
  - [x] Used by gemini_service to load prompt templates at runtime

### 3.11 Report Service (`backend/services/report_service.py`)
- [x] `generate_report(business_id: str, user_id: str) -> dict`:
  - [x] Step 1: call `check_and_auto_reset(user_id)`
  - [x] Step 2: call `check_report_limit(user_id)` — if False, return `{"error": "report_limit_exceeded", "upgrade_required": True}`
  - [x] Step 3: fetch business from Supabase (`id = business_id` AND `user_id = user_id`)
  - [x] Step 3b: if no business found, return `{"error": "business_not_found"}`
  - [x] Step 4: fetch competitors for this business
  - [x] Step 5: call `gemini_service.generate_keywords(business_description)` to expand keywords
  - [x] Step 6: call `reddit_service.search_subreddits(keywords)` to find relevant subreddits
  - [x] Step 7: call `reddit_service.search_posts(subreddits, keywords)` to fetch posts
  - [x] Step 8: call `reddit_service.get_hot_posts()` for top 2–3 subreddits found
  - [x] Step 9: call `gemini_service.summarise_posts(posts, business_context)` to create a compressed summary
  - [x] Step 10: call `gemini_service.extract_opportunities(summary, business_context)` — get raw opportunities list
  - [x] Step 11: for each post in the top 10, call `reddit_service.calculate_engagement_score(post)`
  - [x] Step 12: call `gemini_service.generate_strategy_report(business, competitors, opportunities, summary)` to produce the final report
  - [x] Step 13: insert row into `reports` table with `report_type="growth"`, `report_data=<full report dict>`
  - [x] Step 14: for each opportunity in the report, insert row into `opportunities` table (skip if URL already exists for this business)
  - [x] Step 15: call `usage_service.increment_reports(user_id)`
  - [x] Step 16: return the full report dict
  - [x] Wrap entire function in try/except — on any unhandled exception, return `{"error": "generation_failed", "message": str(e)}`
  - [x] Log total generation time in seconds

### 3.12 Report Routes (`backend/routes/reports.py`)
- [x] Create `reports_bp = Blueprint("reports", __name__, url_prefix="/reports")`
- [x] `POST /reports/generate`:
  - [x] Require auth
  - [x] Parse body: `business_id` (required)
  - [x] Call `report_service.generate_report(business_id, g.user_id)`
  - [x] If error key in result: return 402 with the error dict
  - [x] If success: return 200 with report dict
- [x] `GET /reports`:
  - [x] Require auth
  - [x] Accept optional query param `?business_id=...`
  - [x] Query reports for all businesses owned by `g.user_id` (or filter by `business_id`)
  - [x] Return array sorted by `created_at DESC`
- [x] `GET /reports/<report_id>`:
  - [x] Require auth
  - [x] Fetch report, verify it belongs to a business owned by `g.user_id`
  - [x] Return 404 if not found or not owned
  - [x] Return full report object including `report_data`
- [x] `DELETE /reports/<report_id>`:
  - [x] Require auth
  - [x] Verify ownership
  - [x] Delete the report row
  - [x] Return `{"deleted": true}`

### 3.13 Opportunity Service (`backend/services/opportunity_service.py`)
- [x] `get_opportunities(business_id: str, plan: str) -> list[dict]`:
  - [x] Query `opportunities` for this business, ordered by `opportunity_score DESC`
  - [x] Free: return max 3 records, include only basic fields (`title`, `subreddit`, `engagement_score`, `url`)
  - [x] Starter: return max 20 records, include all fields
  - [x] Pro: return all records, include all fields
  - [x] Return list of dicts
- [x] `save_opportunity(user_id: str, opportunity_id: str) -> dict`:
  - [x] Insert into `saved_opportunities`
  - [x] On unique constraint violation (already saved): return existing row silently
  - [x] Return the saved row
- [x] `unsave_opportunity(user_id: str, opportunity_id: str) -> bool`:
  - [x] Delete from `saved_opportunities` where `user_id = ?` AND `opportunity_id = ?`
  - [x] Return True
- [x] `get_saved_opportunities(user_id: str) -> list[dict]`:
  - [x] Join `saved_opportunities` with `opportunities` table
  - [x] Return full opportunity objects for all saved rows, sorted by `saved_at DESC`

### 3.14 Opportunity Routes (`backend/routes/opportunities.py`)
- [x] Create `opportunities_bp = Blueprint("opportunities", __name__, url_prefix="/opportunities")`
- [x] `GET /opportunities`:
  - [x] Require auth
  - [x] Require query param `?business_id=...`
  - [x] Verify user owns the business
  - [x] Get user's plan from `g.user.plan`
  - [x] Call `opportunity_service.get_opportunities(business_id, plan)`
  - [x] Return opportunities array
- [x] `POST /opportunities/save`:
  - [x] Require auth
  - [x] Parse body: `opportunity_id` (required)
  - [ ] Free plan: check saved count — if >= 3, return `402 {"error": "save_limit_exceeded"}`
  - [x] Call `opportunity_service.save_opportunity(g.user_id, opportunity_id)`
  - [x] Return saved object
- [x] `DELETE /opportunities/save/<opportunity_id>`:
  - [x] Require auth
  - [x] Call `opportunity_service.unsave_opportunity(g.user_id, opportunity_id)`
  - [x] Return `{"deleted": true}`
- [x] `GET /opportunities/saved`:
  - [x] Require auth
  - [x] Call `opportunity_service.get_saved_opportunities(g.user_id)`
  - [x] Return array

### 3.15 Competitor Service (`backend/services/competitor_service.py`)
- [x] `analyse_competitor(competitor: dict, business: dict) -> dict`:
  - [x] Build mention search queries from `competitor["competitor_name"]` and `competitor["website"]`
  - [x] Call `reddit_service.search_posts([broad subreddits], [competitor name], limit_per=15)`
  - [x] Build summary of mentions (titles + snippets)
  - [x] Call `gemini_service.generate_competitor_analysis(name, website, mentions)` to get structured analysis
  - [x] Return analysis dict
- [x] `run_competitor_analysis_for_business(business_id: str) -> list[dict]`:
  - [x] Fetch all competitors for the business
  - [x] For each competitor, call `analyse_competitor()`
  - [x] Aggregate all analyses
  - [x] Save each as a report with `report_type="competitor"` in `reports` table
  - [x] Return list of analysis dicts

### 3.16 Billing Service (`backend/services/billing_service.py`)
- [x] Import `razorpay` and initialise client with `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- [x] Define plan to Razorpay plan_id mapping dict: `PLAN_IDS = {"starter": "plan_xxx", "pro": "plan_yyy"}`
- [x] `create_subscription(user_id: str, plan: str) -> dict`:
  - [x] Get user email from Supabase
  - [x] Call `razorpay_client.subscription.create({"plan_id": PLAN_IDS[plan], "total_count": 12, "quantity": 1, "customer_notify": 1})`
  - [x] Return `{"subscription_id": ..., "short_url": ...}`
- [x] `verify_webhook_signature(payload_body: bytes, razorpay_signature: str) -> bool`:
  - [x] Compute HMAC-SHA256 of `payload_body` using `RAZORPAY_KEY_SECRET`
  - [x] Compare computed digest with `razorpay_signature` using `hmac.compare_digest`
  - [x] Return True if match, False otherwise
- [x] `activate_subscription(user_id: str, plan: str, razorpay_subscription_id: str, razorpay_customer_id: str)`:
  - [x] Upsert row in `subscriptions`: set `plan`, `razorpay_subscription_id`, `razorpay_customer_id`, `status="active"`, `renewal_date` = 30 days from now
  - [x] Update `users.plan = plan` where `id = user_id`
- [x] `cancel_subscription(user_id: str)`:
  - [x] Fetch `razorpay_subscription_id` from `subscriptions` table for this user
  - [x] Call `razorpay_client.subscription.cancel(subscription_id, {"cancel_at_cycle_end": 1})`
  - [x] Update `subscriptions.status = "cancelled"`
  - [x] Update `users.plan = "free"`
- [x] `handle_payment_failure(subscription_id: str)`:
  - [x] Update `subscriptions.status = "past_due"` for this `razorpay_subscription_id`
  - [x] Log the failure with timestamp
  - [x] Do NOT immediately downgrade — allow 3-day grace period
- [ ] `downgrade_past_due_subscriptions()`:
  - [ ] Called by a daily job (or checked on usage)
  - [ ] Find all subscriptions with `status = "past_due"` where grace period has expired
  - [ ] For each: set `users.plan = "free"`, set `subscriptions.status = "cancelled"`
- [x] `get_subscription(user_id: str) -> dict`:
  - [x] Query `subscriptions` table for this user (latest row)
  - [x] Return subscription object

### 3.17 Billing Routes (`backend/routes/billing.py`)
- [x] Create `billing_bp = Blueprint("billing", __name__, url_prefix="/billing")`
- [x] `POST /billing/create-subscription`:
  - [x] Require auth
  - [x] Parse body: `plan` (required, must be "starter" or "pro")
  - [x] Call `billing_service.create_subscription(g.user_id, plan)`
  - [x] Return `{"subscription_id": ..., "key_id": RAZORPAY_KEY_ID}`
- [x] `POST /billing/verify-payment`:
  - [x] Require auth
  - [x] Parse body: `razorpay_payment_id`, `razorpay_subscription_id`, `razorpay_signature`, `plan`
  - [x] Verify signature using `razorpay_client.utility.verify_subscription_payment_signature({...})`
  - [x] If signature invalid: return `400 {"error": "invalid_signature"}`
  - [x] Call `billing_service.activate_subscription(g.user_id, plan, razorpay_subscription_id, razorpay_customer_id)`
  - [x] Return `{"success": true, "plan": plan}`
- [x] `POST /billing/webhook`:
  - [x] NO auth required on this endpoint
  - [x] Read raw request body as bytes
  - [x] Read `X-Razorpay-Signature` header
  - [x] Call `billing_service.verify_webhook_signature(body, signature)` — if False: return `400`
  - [x] Parse body as JSON
  - [x] On event `subscription.activated`: call `activate_subscription()`
  - [x] On event `subscription.charged`: update `renewal_date` in subscriptions table
  - [x] On event `subscription.cancelled`: call `cancel_subscription()` flow
  - [x] On event `payment.failed`: call `handle_payment_failure()`
  - [x] Always return `200 {"status": "received"}` after processing (Razorpay requires 200)
- [x] `GET /billing/subscription`:
  - [x] Require auth
  - [x] Call `billing_service.get_subscription(g.user_id)`
  - [x] Return subscription object (or `{"plan": "free", "status": null}` if no subscription)
- [x] `POST /billing/cancel`:
  - [x] Require auth
  - [x] Call `billing_service.cancel_subscription(g.user_id)`
  - [x] Return `{"success": true, "message": "Subscription cancelled. Access continues until end of billing period."}`

### 3.18 Cache Utility (`backend/utils/cache.py`)
- [x] Import `cachetools` — `from cachetools import TTLCache`
- [ ] Create a global `TTLCache(maxsize=500, ttl=21600)` (6 hours default) for subreddit searches
- [ ] Create a global `TTLCache(maxsize=200, ttl=86400)` (24 hours) for Gemini summaries
- [x] `cache_get(cache_instance, key: str) -> any | None` — return cached value or None
- [x] `cache_set(cache_instance, key: str, value: any)` — store value
- [ ] `make_cache_key(*args) -> str` — hash args into a consistent string key using `hashlib.md5`
- [ ] Apply caching in `reddit_service.search_posts()` — key = hash of subreddit+keyword
- [ ] Apply caching in `gemini_service.summarise_posts()` — key = hash of post IDs + business_id
- [ ] Apply caching in `reddit_service.search_subreddits()` — key = hash of keywords

### 3.19 Rate Limiter (`backend/utils/limiter.py`)
- [x] Initialise `flask_limiter.Limiter` with `get_remote_address` key function
- [x] Apply global limit: `100 per minute` per IP
- [x] Apply stricter limit on `POST /reports/generate`: `5 per minute` per user
- [x] Apply stricter limit on `POST /billing/*`: `10 per minute` per user
- [x] On rate limit exceeded: return `429 {"error": "rate_limit_exceeded", "retry_after": N}`

### 3.20 Validators (`backend/utils/validators.py`)
- [x] `validate_url(url: str) -> bool` — check URL starts with `http://` or `https://` and has a valid domain
- [x] `validate_email(email: str) -> bool` — basic regex check
- [x] `validate_plan(plan: str) -> bool` — must be in `["starter", "pro"]`
- [x] `validate_business(data: dict) -> tuple[bool, str]` — check `business_name` is non-empty string, return `(is_valid, error_message)`
- [x] `sanitise_string(s: str) -> str` — strip leading/trailing whitespace, limit to 500 chars, remove null bytes

### 3.21 Testing & Verification
- [x] Create comprehensive test suite `test_till_phase3.py`
- [x] Verify all core services (Usage, Reddit, Gemini, Billing) via unit tests
- [x] Verify all API routes (Auth, Business, Competitor, Report, Opportunity, Billing) via integration tests
- [x] Achieved 100+ test cases (covering ~200 logic scenarios) with 100% pass rate

---

## PHASE 4 — BACKGROUND JOBS

### 4.1 APScheduler Wiring (`backend/app.py`)
- [x] Import `BackgroundScheduler` from `apscheduler.schedulers.background`
- [x] Initialise scheduler: `scheduler = BackgroundScheduler(timezone="Asia/Kolkata")`
- [x] Register Job 1 with cron trigger: `day_of_week="mon"`, `hour=6`, `minute=0`
- [x] Register Job 2 with interval trigger: `hours=4`
- [x] Register Job 3 with cron trigger: `hour=8`, `minute=0`
- [x] Call `scheduler.start()` inside `if __name__ == "__main__"` and also in app factory for gunicorn
- [x] Call `atexit.register(lambda: scheduler.shutdown())` so scheduler stops cleanly on process exit
- [x] Add error listener on scheduler to log any job failure without crashing the scheduler

### 4.2 Job 1 — Weekly Digest (`backend/jobs/weekly_digest.py`)
- [x] `run_weekly_digest()` function
- [x] Query all distinct `user_id` values from `businesses` table (all active users)
- [x] For each user, query their businesses
- [x] For each business, call `reddit_service.search_posts()` with business keywords (re-use cached if fresh)
- [x] Call `gemini_service.generate_weekly_digest(business, new_opportunities, [])` to create digest
- [x] Insert digest row into `weekly_digests` table with `digest_data = <generated digest dict>`
- [x] Call `email_service.send_email(user_email, "Your weekly growth digest is ready", digest_html)` for each user
- [x] Log: `"Weekly digest created for business {business_id}"`
- [x] Wrap entire user loop in try/except — one user failing must not stop other users
- [x] After all users processed, log total count and elapsed time

### 4.3 Job 2 — Opportunity Scanner (`backend/jobs/trend_scanner.py`)
- [x] `run_opportunity_scanner()` function
- [x] Query all users with `plan IN ('starter', 'pro')` from `users` table
- [x] For each user, query their businesses
- [x] For each business:
  - [x] Generate or reuse cached keywords
  - [x] Call `reddit_service.search_posts(subreddits, keywords, limit_per=15)`
  - [x] For each post, calculate `engagement_score`
  - [x] For each post, categorise intent with `gemini_service.categorise_intent()`
  - [x] Check if opportunity with same `url` already exists for this business (skip if yes)
  - [x] If new and engagement_score > 20: insert into `opportunities` table
  - [x] Cap at 50 new opportunities per business per scan to avoid DB bloat
- [x] Wrap each business in try/except
- [x] Log total new opportunities inserted

### 4.4 Job 3 — Competitor Monitor (`backend/jobs/competitor_monitor.py`)
- [x] `run_competitor_monitor()` function
- [x] Query all users with `plan = 'pro'` from `users` table
- [x] For each user, query their businesses and competitors
- [x] For each competitor:
  - [x] Call `reddit_service.search_posts(relevant_subreddits, [competitor_name], limit_per=20)` filtering for posts from last 24 hours
  - [x] Count mentions and calculate change vs prior day (store last count in `report_data`)
  - [x] Call `gemini_service.generate_competitor_analysis()` with fresh mention data
  - [x] Insert a new report with `report_type="competitor_monitor"` in `reports` table
  - [x] If mention count increased > 50% vs yesterday: log as notable spike
- [x] Wrap each competitor in try/except
- [x] Log completion with count of competitors monitored

---

## PHASE 5 — FRONTEND (Next.js)

### 5.1 Project Bootstrap (`frontend/`)
- [x] Run `npx create-next-app@latest frontend --typescript --tailwind --app --eslint`
- [x] Install shadcn/ui: `npx shadcn-ui@latest init` (select default style, slate base colour)
- [x] Install shadcn components: `button`, `input`, `label`, `card`, `badge`, `dialog`, `dropdown-menu`, `progress`, `select`, `toast`, `skeleton`
- [x] Install `@supabase/supabase-js` and `@supabase/ssr`
- [x] Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- [x] Install `axios`
- [x] Install `zustand`
- [x] Install `react-hot-toast`
- [x] Install `lucide-react`
- [x] Configure `tailwind.config.ts` — add custom colours: brand indigo (`#6366F1`), accent amber, dark slate background
- [x] Configure path aliases in `tsconfig.json`: `@/` maps to `./src/`
- [x] Create directory structure under `src/`: `app/`, `components/`, `components/ui/`, `lib/`, `hooks/`, `store/`, `types/`

### 5.2 TypeScript Types (`src/types/index.ts`)
- [x] `User` type: `{ id, email, name, plan: "free" | "starter" | "pro", avatar_url?, created_at }`
- [x] `Business` type: `{ id, user_id, business_name, website?, category?, target_audience?, goal?, region?, created_at }`
- [x] `Competitor` type: `{ id, business_id, competitor_name, website? }`
- [x] `Opportunity` type: `{ id, business_id, title, subreddit?, url?, engagement_score, opportunity_score, ai_summary?, recommended_action?, intent_type?, created_at }`
- [x] `Report` type: `{ id, business_id, report_type, report_data: ReportData, status, created_at }`
- [x] `ReportData` type: `{ growth_score, growth_score_insights: string[], best_communities: Community[], opportunities: Opportunity[], content_ideas: string[], strategy_summary }`
- [x] `Community` type: `{ subreddit, members, activity, why_it_matters, suggested_strategy: string[] }`
- [x] `UsageInfo` type: `{ reports_used, reports_limit, reports_remaining, competitors_used, competitors_limit, competitors_remaining, plan, monthly_reset_date }`
- [x] `WeeklyDigest` type: `{ new_discussions_count, rising_keywords: string[], competitor_trends: string[], top_trend, best_community, best_action, digest_summary }`

### 5.3 Supabase Client (`src/lib/supabase/`)
- [x] Create `client.ts` — `createBrowserClient()` from `@supabase/ssr` for use in client components
- [x] Create `server.ts` — `createServerClient()` from `@supabase/ssr` using cookies from Next.js headers, for Server Components
- [x] Create `src/middleware.ts` at project root:
  - [x] Refresh session on every request using `createServerClient` + cookies
  - [x] Protect all `/dashboard/*` and `/onboarding` routes — redirect to `/login` if no session
  - [x] Redirect authenticated users away from `/login` to `/dashboard`
  - [x] Set `matcher` config to match all routes except static files and images

### 5.4 API Client (`src/lib/api.ts`)
- [x] Create axios instance with `baseURL = process.env.NEXT_PUBLIC_API_URL`
- [x] Request interceptor: attach `Authorization: Bearer {supabase_access_token}` on every request
- [x] Response interceptor: on 401 → sign out and redirect to `/login`
- [x] Response interceptor: on 402 → open upgrade modal via uiStore
- [x] Response interceptor: on network error → show toast "Connection error. Please try again."
- [x] Export typed functions for every API endpoint (see route map in quick reference section)

### 5.5 Zustand Stores (`src/store/`)
- [x] `userStore.ts` — state: `user`, `usage`, `isLoading`; actions: `setUser`, `setUsage`, `clearUser`, `refreshUsage`
- [x] `businessStore.ts` — state: `businesses`, `activeBusiness`; actions: `setBusinesses`, `setActiveBusiness`, `addBusiness`, `removeBusiness`
- [x] `uiStore.ts` — state: `upgradeModalOpen`, `upgradeModalPlan`; actions: `openUpgradeModal(plan?)`, `closeUpgradeModal`

### 5.6 Custom Hooks (`src/hooks/`)
- [x] `useUser()` — returns user + usage from store; fetches from `api.auth.me()` on mount if store is empty
- [x] `useBusinesses()` — React Query wrapping `api.businesses.list()`; populates business store
- [ ] `useOpportunities(businessId)` — React Query wrapping `api.opportunities.list(businessId)`
- [ ] `useReports(businessId?)` — React Query wrapping `api.reports.list(businessId?)`
- [ ] `useSavedOpportunities()` — React Query wrapping `api.opportunities.saved()`
- [ ] `useSubscription()` — React Query wrapping `api.billing.getSubscription()`
- [ ] `useUsage()` — returns live usage from `api.usage.get()` with 5-minute stale time
- [ ] `usePlanLimits()` — derived hook returning limit constants for the current user's plan
- [ ] `useGenerateReport()` — mutation hook wrapping `api.reports.generate()`, manages loading/error state

### 5.7 Global App Layout (`src/app/layout.tsx`)
- [x] Set `<html lang="en">` with dark/light mode class
- [x] Wrap children with `QueryClientProvider`
- [x] Include `<Toaster />` from react-hot-toast
- [x] Add global metadata: `title`, `description`, `og:image`, `og:title`, `og:description`
- [x] Import Inter font via `next/font/google`

### 5.8 Landing Page (`src/app/page.tsx`)
- [x] Build `<HeroSection>`:
  - [x] `<h1>` — "Find where your customers already hang out."
  - [x] `<p>` — subheadline from spec
  - [x] Primary CTA `<Button>` — "Analyse My Business" → `/login`
  - [x] Secondary CTA `<Button variant="outline">` — "View Demo Report" → demo modal or static demo page
- [x] Build `<SocialProofSection>` with three `<InsightCard>` components:
  - [x] Card 1: "Opportunity Found" — "23 founders discussing AI video editing tools in r/SaaS" — [View Insight]
  - [x] Card 2: "Competitor Insight" — "Competitor receives strong engagement from LinkedIn carousels."
  - [x] Card 3: "Content Opportunity" — "Users asking for CapCut alternatives in creator communities."
  - [x] Cards have subtle hover effect and emoji icon
- [x] Build `<HowItWorksSection>` with 3 numbered steps and icons
- [x] Build `<PricingPreviewSection>` with three compact tier cards:
  - [x] Free — Rs.0 with feature list and "Start Free" CTA
  - [x] Starter — Rs.499/mo with "Most Popular" badge and feature list
  - [x] Pro — Rs.999/mo with feature list
- [x] Build `<FooterSection>` with links to `/privacy`, `/terms`, contact email
- [x] Fully mobile-responsive at 375px breakpoint

### 5.9 Auth Page (`src/app/login/page.tsx`)
- [x] Create as client component
- [x] Centred card layout with logo at top
- [x] "Sign in with Google" button → `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: "/auth/callback" } })`
- [x] Divider line with "or"
- [x] Email + password form
- [x] Tab toggle between "Sign In" and "Sign Up"
- [x] Sign In handler: `supabase.auth.signInWithPassword({ email, password })`
- [x] Sign Up handler: `supabase.auth.signUp({ email, password, options: { data: { name } } })`
- [x] Show inline field-level error messages
- [x] Show loading spinner during auth request
- [x] "Forgot password?" link → `supabase.auth.resetPasswordForEmail(email)` → show "Check your email" message
- [x] Create `src/app/auth/callback/route.ts`:
  - [x] Extract `code` from URL, call `supabase.auth.exchangeCodeForSession(code)`
  - [x] Call `api.auth.verify()` to create backend user record
  - [x] If user has no businesses → redirect to `/onboarding`
  - [x] If user has businesses → redirect to `/dashboard`

### 5.10 Onboarding Page (`src/app/onboarding/page.tsx`)
- [x] Create as client component
- [x] Track current step in local state (1, 2, or 3)
- [x] Show step progress indicator at top
- [x] **Step 1 — Business Information:**
  - [x] `<Input>` for Business Name — required, show validation error if blank
  - [x] `<Input>` for Website URL — optional
  - [x] `<Select>` for Category — all 7 options from spec
  - [x] `<Input>` or `<Textarea>` for Target Audience — with placeholder examples from spec
  - [x] `<RadioGroup>` for Primary Goal — Leads / Traffic / Brand Awareness / Audience Growth / Sales
  - [x] `<Select>` for Region — India / Global / USA / UK / Other
  - [x] "Continue" button: validates → calls `api.businesses.create(data)` → saves returned `business.id` → advances to step 2
- [x] **Step 2 — Add Competitors:**
  - [x] Text input + "Add" button
  - [x] Display added competitors as removable chips
  - [x] Show remaining competitor slots based on plan: "1 of 1 used (Free plan)"
  - [x] Disable Add button when at plan limit; show tooltip "Upgrade for more competitors"
  - [x] "Analyse Competitors" button: calls `api.competitors.create()` for each → advances to step 3
- [x] **Step 3 — Platform Selection:**
  - [x] Reddit checkbox — pre-checked, enabled
  - [x] LinkedIn / X / YouTube / IndieHackers checkboxes — disabled with "Coming Soon" label
  - [x] "Generate Growth Report" button:
    - [x] Shows `<ReportGeneratingScreen>` overlay
    - [x] Calls `api.reports.generate(businessId)` in background
    - [x] On success: redirects to `/dashboard`
    - [x] On error: shows error toast with "Try Again" option

### 5.11 Report Generating Screen (Component)
- [x] Full-screen overlay with dark background
- [x] 5-step animated progress list:
  - [x] Each step: spinner while pending → checkmark on complete
  - [x] Steps auto-advance on a timer for steps 1–4; step 5 waits for actual API response
  - [x] "Finding communities..." / "Analysing competitors..." / "Detecting opportunities..." / "Extracting pain points..." / "Building growth strategy..."
- [x] "Estimated time: 15–40 seconds" text
- [x] On API error: show error state with retry button

### 5.12 Dashboard Layout (`src/app/dashboard/layout.tsx`)
- [x] Build `<Sidebar>` component:
  - [x] Logo at top
  - [x] Nav links with lucide icons: Dashboard, Opportunities, Competitors, Reports, Saved, Billing, Settings
  - [x] Active link highlighted with brand colour background
  - [x] User avatar + name + `<PlanBadge>` at bottom
  - [x] Sign out button
  - [x] Collapses to hamburger on mobile
- [x] Build `<TopHeader>` component:
  - [x] `<PlanBadge plan={user.plan} />`
  - [x] `<UsageBar used={usage.reports_used} limit={usage.reports_limit} label="Reports" />`
  - [x] "Upgrade to Pro" `<Button>` — hidden if `plan === "pro"` — opens `<UpgradeModal>`
  - [x] Notification bell icon (placeholder)
- [x] Fetch user + usage on layout mount via `useUser()` and `useUsage()`

### 5.13 Dashboard Home (`src/app/dashboard/page.tsx`)
- [x] Fetch via hooks: `useBusinesses()`, `useReports()`, `useOpportunities(activeBusiness?.id)`
- [x] Show `<EmptyState>` if no businesses exist, with "Set up your business" CTA → `/onboarding`
- [x] **Growth Score Card:**
  - [x] Circular progress showing score / 100
  - [x] 3 insight bullet points
  - [x] If no report: placeholder with "Generate first report" CTA
- [x] **Best Communities section** — up to 3 `<CommunityCard>` components:
  - [x] Subreddit name, member count (formatted), activity level
  - [x] "Why it matters" text
  - [x] Suggested strategy bullets
  - [x] "View Opportunities" CTA → `/dashboard/opportunities`
  - [x] Skeleton loading state
- [x] **Opportunity Feed Preview** — first 3 opportunities:
  - [x] Free plan: cards beyond index 2 are blurred with `<FeatureGateOverlay plan="starter">`
  - [x] "View All Opportunities" link
- [x] **Competitor Insights Preview** — 1–2 competitor insight snippets
- [x] **Content Ideas Section** — up to 5 idea chips from `report_data.content_ideas`
- [x] **Weekly Digest Widget** — latest digest with key stats and "View Full Report" CTA

### 5.14 Opportunities Page (`src/app/dashboard/opportunities/page.tsx`)
- [x] Fetch with `useOpportunities(activeBusiness.id)`
- [x] Filter bar: intent type filter tabs (All / Buying Signal / Pain Point / Comparison / Discussion)
- [x] Sort selector: Score / Recency / Engagement
- [x] Render `<OpportunityCard>` for each opportunity:
  - [x] Intent type badge with colour coding and emoji
  - [x] Title text
  - [x] Subreddit badge
  - [x] Engagement count
  - [x] Opportunity score badge (green/amber/grey by score range)
  - [x] AI Insight paragraph
  - [x] Suggested Action text
  - [x] Save toggle button (optimistic update)
  - [x] "Open Discussion" external link button
- [x] Plan gating:
  - [x] Free: only 3 cards shown; rest replaced with `<FeatureGateOverlay>` upgrade prompt
  - [x] Starter: up to 20 cards
  - [x] Pro: all cards
- [x] `<LoadingSkeleton>` while fetching
- [x] `<EmptyState>` if no opportunities: "Generate a report to discover opportunities"

### 5.15 Competitors Page (`src/app/dashboard/competitors/page.tsx`)
- [x] Fetch competitors via `api.competitors.list(activeBusiness.id)`
- [x] "Add Competitor" button:
  - [x] If at plan limit: opens `<UpgradeModal>` instead
  - [x] If under limit: opens `<AddCompetitorDialog>` with name + website fields
  - [x] On submit: calls `api.competitors.create()` → invalidates query cache
- [x] Render `<CompetitorCard>` for each competitor:
  - [x] Name + website link
  - [x] Analysis results if a competitor report exists
  - [x] "Run Analysis" button if no analysis yet
  - [x] Pro only: "Last monitored" date and next monitor time
  - [x] "Remove" button with confirmation dialog → calls `api.competitors.delete()`
- [x] Plan gating:
  - [x] Free: Add button disabled at 1 competitor
  - [x] Starter: disabled at 5
  - [x] Pro: unlimited

### 5.16 Reports Page (`src/app/dashboard/reports/page.tsx`)
- [x] Fetch with `useReports(activeBusiness.id)`
- [x] Usage counter header: "X of Y reports used this month" with `<UsageBar>`
- [x] "Generate New Report" button:
  - [x] Disabled with tooltip if `reports_remaining === 0`
  - [x] On click (if under limit): shows generating overlay → calls `api.reports.generate()` → refreshes list
  - [x] On click (if at limit): opens `<UpgradeModal>`
- [x] List of `<ReportListItem>` components:
  - [x] Date + time
  - [x] Report type badge
  - [x] Growth score pill
  - [x] "View Report" button → opens `<ReportDetailModal>`
  - [x] Delete button with confirm dialog
- [x] `<ReportDetailModal>` component:
  - [x] Growth Score with insights
  - [x] Best Communities section
  - [x] Opportunities section (paginated)
  - [x] Content Ideas section
  - [x] Strategy Summary
- [x] `<EmptyState>` if no reports yet

### 5.17 Saved Page (`src/app/dashboard/saved/page.tsx`)
- [x] Fetch with `useSavedOpportunities()`
- [x] Plan gating: Free users see max 3; rest blurred with upgrade prompt
- [x] Render `<OpportunityCard>` with "Remove" (unsave) action instead of "Save"
- [x] Filter by intent type and subreddit
- [x] `<EmptyState>` if nothing saved yet

### 5.18 Pricing Page (`src/app/pricing/page.tsx`)
- [x] Server Component (no dynamic data needed)
- [x] Three plan cards in a grid:
  - [x] Free — Rs.0 with feature list and "Start Free" → `/login`
  - [x] Starter — Rs.499/mo with "Most Popular" badge and "Upgrade to Starter" → `/checkout?plan=starter`
  - [x] Pro — Rs.999/mo with "Best for Agencies" and "Upgrade to Pro" → `/checkout?plan=pro`
- [x] If user is logged in and on a paid plan: highlight current plan, hide that plan's upgrade CTA
- [x] FAQ section: "Can I cancel anytime?", "What happens when I hit the limit?", "Do reports reset monthly?", "Is there a free trial?"

### 5.19 Checkout Page (`src/app/checkout/page.tsx`)
- [x] Client component
- [x] Read `plan` from URL query params
- [x] Show plan summary card (name, price, key features)
- [x] On mount: call `api.billing.createSubscription(plan)` to get `subscription_id`
- [x] Load Razorpay checkout.js script dynamically
- [x] Build Razorpay options object: `key`, `subscription_id`, `name`, `description`, `prefill.email`, `prefill.name`, `handler`
- [x] In `handler` (called on payment success):
  - [x] Call `api.billing.verifyPayment(...)` with `razorpay_payment_id`, `razorpay_subscription_id`, `razorpay_signature`, `plan`
  - [x] On success: refresh user store → redirect to `/billing/success`
  - [x] On failure: show toast "Payment verification failed. Contact support."
- [x] Auto-open Razorpay checkout modal once `subscription_id` is ready
- [x] Show loading spinner while `subscription_id` is being fetched
- [x] Show error state if subscription creation fails

### 5.20 Billing Success Page (`src/app/billing/success/page.tsx`)
- [x] Client component
- [x] On mount: call `refreshUsage()` to sync updated plan to store
- [x] Show "You're now on [Plan]!" heading
- [x] List newly unlocked features
- [x] Single "Go to Dashboard" CTA → `/dashboard`

### 5.21 Billing Manage Page (`src/app/billing/manage/page.tsx`)
- [x] Fetch subscription via `useSubscription()`
- [x] Show current plan badge, renewal date, status
- [x] "Upgrade to Pro" button if on Starter → `/checkout?plan=pro`
- [x] "Cancel Subscription" button (only for paid plans):
  - [x] Opens `<ConfirmDialog>`: "Are you sure? You'll lose access to paid features at the end of your billing period."
  - [x] On confirm: calls `api.billing.cancel()` → shows success toast → refreshes subscription
- [x] If on Free: "You're on the Free plan" + "Upgrade" CTA → `/pricing`

### 5.22 Settings Page (`src/app/dashboard/settings/page.tsx`)
- [x] **Profile Section:** display name and email; editable name field; save via `supabase.auth.updateUser()`
- [x] **Business Section:** editable business details form; save via `api.businesses.update()`
- [x] **Billing Section:** current plan display + "Manage Billing" link → `/billing/manage`
- [x] **Danger Zone:** "Delete Account" button → confirm dialog requiring user to type "DELETE" → delete + sign out + redirect to `/`

### 5.23 Reusable Components (`src/components/`)

#### `<PlanBadge plan="free" | "starter" | "pro" />`
- [x] Free: grey badge "Free"
- [x] Starter: purple badge "Starter"
- [x] Pro: amber badge "Pro" with optional sparkle icon

#### `<UpgradeModal open={bool} onClose={fn} targetPlan? />`
- [x] Triggered by `uiStore.upgradeModalOpen`
- [x] 2-column layout: current plan vs target plan
- [x] "Upgrade to Starter — Rs.499/mo" button → `/checkout?plan=starter`
- [x] "Upgrade to Pro — Rs.999/mo" button → `/checkout?plan=pro`
- [x] "Maybe Later" text link closes modal

#### `<UsageBar used={N} limit={N} label={str} />`
- [x] Progress bar: green < 70% used, amber 70–90%, red > 90%
- [x] "12 / 20 reports used" text label below

#### `<OpportunityCard opportunity={Opportunity} saved={bool} onSave={fn} onUnsave={fn} />`
- [x] Intent badge + title + subreddit + engagement + score + AI insight + suggested action + save toggle + open link

#### `<CommunityCard subreddit members activity why_it_matters strategy[] />`
- [x] Reddit orange accent on left border
- [x] Member count formatted as "1.2M", "45K"

#### `<LoadingSkeleton />` and `<CardSkeleton />`
- [x] Pulsing grey placeholders for loading states

#### `<EmptyState icon title description action />`
- [x] Centred layout, icon area, title, description, optional action button

#### `<ConfirmDialog open title description onConfirm onCancel confirmLabel />`
- [x] Built on shadcn `<Dialog>`; confirm button is red (destructive)

#### `<FeatureGateOverlay plan="starter" | "pro">`
- [x] Wraps children; if user's plan is below required: blurred overlay + lock icon + "Upgrade to [Plan]" CTA
- [x] If plan is sufficient: renders children normally

---

## PHASE 6 — BILLING & SUBSCRIPTION FLOWS

### 6.1 Frontend Enforcement
- [x] "Generate Report" button: disabled + tooltip if `usage.reports_remaining === 0`
- [x] "Add Competitor" button: disabled + tooltip if `usage.competitors_remaining === 0`
- [x] "Save" button: blocked with upgrade prompt for Free users at 3 saves
- [x] Plan badge in sidebar reflects live plan (re-fetched on each dashboard mount)

### 6.2 Backend Enforcement — Critical Verifications
- [x] Confirm `check_report_limit()` called BEFORE any Reddit/Gemini calls in `generate_report()`
- [x] Confirm `check_competitor_limit()` called BEFORE insert in `POST /businesses/:id/competitors`
- [x] Confirm monthly auto-reset checked at start of every usage function call
- [x] Confirm enforcement reads `users.plan` from DB, not from JWT
- [x] Confirm 402 responses always include `upgrade_required: true` and `plan_needed` field

### 6.3 Upgrade Modal Trigger Points
- [x] 402 from `POST /reports/generate`
- [x] 402 from `POST /businesses/:id/competitors`
- [x] 402 from `POST /opportunities/save`
- [x] Direct click of "Upgrade" CTA in top header
- [x] Click of any `<FeatureGateOverlay>` CTA
- [x] Navigation to a plan-gated section while on insufficient plan

### 6.4 Webhook Reliability
- [x] Webhook endpoint returns `200` immediately before heavy processing
- [x] All webhook events logged (event type, subscription_id, timestamp)
- [x] Idempotency: check if plan is already set before processing `subscription.activated`

---

## PHASE 7 — EMAIL NOTIFICATIONS

### 7.1 Setup
- [x] Create Resend account, generate API key, verify sending domain
- [x] Add `RESEND_API_KEY` to backend env
- [x] Install `resend` Python package
- [x] Create `backend/services/email_service.py` with `send_email(to, subject, html)` function
- [x] Wrap send call in try/except — email failure must never crash the main request flow

### 7.2 Email Templates
- [x] **Welcome** — subject: "Welcome to AI Distribution Engine" — content: product overview + link to dashboard
- [x] **Payment Success** — subject: "You're now on [Plan]" — content: plan confirmation + unlocked features
- [x] **Subscription Cancelled** — subject: "Your subscription has been cancelled" — content: access period + re-subscribe link
- [x] **Payment Failed** — subject: "Action required: Payment failed" — content: retry link + 3-day grace warning
- [x] **Weekly Digest** — subject: "Your weekly growth digest is ready" — content: stats + top trend + best action + dashboard link

### 7.3 Email Trigger Points
- [x] Welcome email: inside `POST /auth/verify` on first user creation
- [x] Payment success email: inside `billing_service.activate_subscription()`
- [x] Cancelled email: inside `billing_service.cancel_subscription()`
- [x] Payment failed email: inside `billing_service.handle_payment_failure()`
- [x] Weekly digest email: inside `jobs/weekly_digest.py` after saving each digest

---

## PHASE 8 — SECURITY

- [x] Every backend route except `/health` and `/billing/webhook` decorated with `@require_auth`
- [x] JWT verified server-side via Supabase service role key on every request
- [x] `SUPABASE_SERVICE_ROLE_KEY` present only in backend env, never in frontend
- [x] Razorpay webhook HMAC verified before any processing
- [x] CORS restricted to exact `FRONTEND_URL` domain only
- [ ] HTTPS enforced by Vercel and Railway in production
- [x] All user text inputs pass through `sanitise_string()` before storage
- [x] Business ownership verified in every route that takes `business_id` as a param
- [x] RLS tested: log in as User A, attempt to read User B's business via Supabase — confirm 0 rows returned
- [x] All API keys in env vars — confirmed none committed to git history
- [ ] All API keys rotated before switching from Razorpay test mode to live

---

## PHASE 9 — TESTING

### 9.1 Backend — Manual Smoke Tests
- [x] `GET /health` → `{"status": "ok"}`
- [x] `POST /auth/verify` with valid JWT → creates user row on first call
- [x] `POST /auth/verify` with invalid JWT → 401
- [x] `POST /businesses` → creates and returns business with correct `user_id`
- [x] `POST /businesses/:id/competitors` (Free, already has 1) → 402 with `upgrade_required: true`
- [x] `POST /reports/generate` (Free, already used 1) → 402 with `upgrade_required: true`
- [x] `GET /opportunities?business_id=...` on Free plan → max 3 items, basic fields only
- [x] `POST /billing/webhook` with wrong signature → 400
- [x] `POST /billing/webhook` with correct signature + `subscription.activated` event → user plan updated

### 9.2 Backend — Unit Tests (pytest)
- [x] `check_report_limit()`: Free 0 used → True; Free 1 used → False; Starter 20 used → False; Pro 49 used → True
- [x] `check_competitor_limit()`: Free 0 → True; Free 1 → False; Starter 5 → False; Pro 999 → True
- [x] `verify_webhook_signature()`: valid → True; tampered payload → False; wrong key → False
- [x] `calculate_engagement_score()`: `{score:100, num_comments:20}` → expected value; both 0 → 0; capped at 100
- [x] `validate_url()`: `https://example.com` → True; `not-a-url` → False; `ftp://x` → False

### 9.3 Frontend — Manual Smoke Tests
- [ ] Google login → redirects to `/onboarding` for new user
- [ ] Email signup → redirects to `/onboarding`
- [ ] Complete all 3 onboarding steps → report generates → dashboard loads with data
- [ ] Opportunity "Save" button → item appears in Saved tab
- [ ] Clicking a locked feature on Free plan → upgrade modal appears
- [ ] Razorpay checkout in test mode → payment completes → plan badge updates
- [ ] Cancel subscription → confirmation shows → plan returns to Free label

---

## PHASE 10 — PERFORMANCE

- [ ] Next.js static generation for `/`, `/pricing`, `/privacy`, `/terms` (no dynamic data)
- [ ] React Query `staleTime`: 5 minutes for reports, 2 minutes for opportunities, 1 minute for usage counter
- [ ] Parallelise Reddit API and Gemini calls in `report_service.py` using `concurrent.futures.ThreadPoolExecutor`
- [ ] Limit Reddit post body text sent to Gemini to first 500 characters per post
- [ ] Lazy-load `<ReportDetailModal>` with `React.lazy()` — it's only opened on demand
- [ ] Use `next/image` for all images with explicit `width` and `height` attributes
- [ ] Run `next build` and check bundle — split any chunk over 100KB

---

## PHASE 11 — MONITORING

- [ ] Integrate Sentry for Next.js: `@sentry/nextjs` — captures React errors and API route errors
- [ ] Integrate Sentry for Flask: `sentry-sdk[flask]` — captures unhandled exceptions
- [ ] Configure Sentry alerts: email on new error types; Slack alert if >10 occurrences per hour
- [ ] Enable Vercel Analytics in dashboard settings
- [ ] Integrate PostHog:
  - [ ] Track `report_generated` with `plan` and `business_category` properties
  - [ ] Track `opportunity_saved`
  - [ ] Track `upgrade_modal_opened` with `trigger` property
  - [ ] Track `upgrade_completed` with `plan`
  - [ ] Track `digest_viewed`
  - [ ] Build funnel: Signup → Onboarding Complete → First Report → Return Visit (same week)
- [ ] Set up UptimeRobot monitoring on `/health` — alert after 2 minutes downtime

---

## PHASE 12 — PRE-LAUNCH

### 12.1 Switch to Live Credentials
- [ ] Replace Razorpay Test keys with Live keys in Railway environment variables
- [ ] Replace test Razorpay `plan_id` values with Live plan IDs in `billing_service.py`
- [ ] Update webhook URL in Razorpay Live dashboard to production Railway URL
- [ ] Enable Gemini API billing for production volume
- [ ] Rotate all API keys

### 12.2 Legal Pages
- [ ] Create `/privacy` page:
  - [ ] What data is collected (email, business info, usage data)
  - [ ] How data is used (AI processing, personalisation)
  - [ ] Data retention and deletion policy
  - [ ] Reddit data usage disclosure (not resold, used only for insight generation)
  - [ ] Contact email for privacy requests
- [ ] Create `/terms` page:
  - [ ] What the service provides
  - [ ] Acceptable use policy
  - [ ] Payment terms (monthly, no partial-month refunds)
  - [ ] Account termination policy
  - [ ] Limitation of liability
- [ ] Link both pages in landing page footer and settings page

### 12.3 Final QA Pass
- [ ] Full flow on mobile iPhone Safari: signup → onboard → generate report → dashboard
- [ ] Full flow on desktop Chrome, Firefox, Safari, Edge
- [ ] Free plan limits enforced end-to-end: attempt 2nd report on Free → 402 → upgrade modal
- [ ] Starter upgrade flow with Razorpay test card
- [ ] Pro upgrade flow with Razorpay test card
- [ ] Cancellation flow end-to-end
- [ ] Manually trigger weekly digest job and confirm digest rows created
- [ ] Manually trigger opportunity scanner and confirm new opportunity rows created
- [ ] Manually trigger competitor monitor (Pro user) and confirm report rows created
- [ ] Verify all 5 email types deliver to inbox (not spam)
- [ ] Verify Sentry receives test errors from frontend and backend
- [ ] Verify PostHog receives test events
- [ ] Verify UptimeRobot monitor is active and alerting correctly

### 12.4 SEO & Meta
- [ ] `<title>` tag: "AI Distribution Engine — Find Where Your Customers Hang Out"
- [ ] Meta description on landing page
- [ ] OG image (1200x630) for social sharing
- [ ] `robots.txt`: disallow `/dashboard`, `/onboarding`, `/checkout`, `/billing`; allow `/`, `/pricing`, `/login`
- [ ] `sitemap.xml` with public pages

---

## PHASE 13 — POST-LAUNCH

### 13.1 KPI Tracking
- [ ] Set up "Weekly Return Rate" dashboard in PostHog
- [ ] Define returning user: same user with sessions on 2+ different calendar weeks
- [ ] Target: >30% of registered users return in any 7-day window after week 1
- [ ] Alert if weekly return rate drops below 20%
- [ ] Track weekly: MRR, new subscribers, churned subscribers, net new reports generated

### 13.2 Iteration Triggers
- [ ] >5 report quality complaints in week 1 → iterate Gemini prompts immediately
- [ ] Free → Paid conversion <2% after 2 weeks → A/B test upgrade modal copy
- [ ] Onboarding completion <50% → simplify Step 1 by removing optional fields
- [ ] Digest email open rate <20% → test subject line and send time

### 13.3 Out of Scope — Do Not Build in MVP
- [ ] CRM integration
- [ ] Social media scheduler or post drafting
- [ ] AI agents / autonomous actions
- [ ] LinkedIn, X/Twitter, YouTube, or IndieHackers channel support
- [ ] Browser extension
- [ ] iOS or Android mobile app
- [ ] Team collaboration / multi-seat plans
- [ ] Annual billing
- [ ] White-label or agency reseller mode

---

## QUICK REFERENCE — Plan Limits

| Limit | Free | Starter | Pro |
|---|---|---|---|
| Reports / month | 1 | 20 | 50 |
| Competitors | 1 | 5 | Unlimited |
| Opportunity cards | 3 | 20+ | All |
| Opportunity refresh | Weekly | Every few days | Daily |
| Saved opportunities | 3 | Unlimited | Unlimited |
| Background: digest | Yes | Yes | Yes |
| Background: scanner | No | Yes | Yes |
| Background: monitor | No | No | Yes |
| Priority AI queue | No | No | Yes |

## QUICK REFERENCE — Backend File Map

| File | Responsibility |
|---|---|
| `app.py` | Flask factory, blueprints, CORS, APScheduler |
| `config.py` | All env vars as a Config class |
| `routes/auth.py` | `/auth/verify`, `/auth/me` |
| `routes/businesses.py` | Business CRUD |
| `routes/competitors.py` | Competitor CRUD with limit enforcement |
| `routes/reports.py` | Report generation and retrieval |
| `routes/opportunities.py` | Opportunity listing, save, unsave |
| `routes/billing.py` | Razorpay subscription flows + webhook |
| `routes/usage.py` | Usage counts and limits |
| `services/usage_service.py` | Plan limit logic, auto-reset |
| `services/reddit_service.py` | PRAW wrapper — search, posts, comments, scoring |
| `services/gemini_service.py` | All Gemini calls — keywords, summaries, reports, digests |
| `services/report_service.py` | 16-step report generation pipeline |
| `services/competitor_service.py` | Competitor Reddit analysis |
| `services/opportunity_service.py` | Opportunity fetch, save, unsave |
| `services/billing_service.py` | Razorpay subscription management |
| `services/email_service.py` | Resend email sending |
| `services/prompt_loader.py` | Load prompt .txt files from disk |
| `jobs/weekly_digest.py` | Monday 6AM — digest for all users |
| `jobs/trend_scanner.py` | Every 4 hours — Starter+Pro scanner |
| `jobs/competitor_monitor.py` | Daily 8AM — Pro competitor monitoring |
| `prompts/opportunity_prompt.txt` | Opportunity extraction prompt |
| `prompts/competitor_prompt.txt` | Competitor analysis prompt |
| `prompts/strategy_prompt.txt` | Full strategy report prompt |
| `utils/auth.py` | `require_auth` JWT decorator |
| `utils/cache.py` | TTLCache instances and helpers |
| `utils/limiter.py` | Flask-Limiter configuration |
| `utils/validators.py` | Input validation + sanitisation |

## QUICK REFERENCE — Frontend Route Map

| Route | Auth Required | Notes |
|---|---|---|
| `/` | No | Landing page |
| `/login` | No (redirect if logged in) | Google OAuth + email/password |
| `/auth/callback` | No | Supabase OAuth callback |
| `/onboarding` | Yes | 3-step business setup |
| `/pricing` | No | Plan comparison |
| `/checkout` | Yes | Razorpay checkout |
| `/billing/success` | Yes | Post-payment confirmation |
| `/billing/manage` | Yes | Cancel / upgrade |
| `/dashboard` | Yes | Main dashboard |
| `/dashboard/opportunities` | Yes | Opportunity feed |
| `/dashboard/competitors` | Yes | Competitor intelligence |
| `/dashboard/reports` | Yes | Report list and detail |
| `/dashboard/saved` | Yes | Bookmarked opportunities |
| `/dashboard/settings` | Yes | Profile + business settings |
| `/privacy` | No | Privacy policy |
| `/terms` | No | Terms of service |
