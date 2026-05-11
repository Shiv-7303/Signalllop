# AI Distribution Engine

The AI Distribution Engine is a growth intelligence platform designed to help businesses find where their customers are hanging out, primarily focused on Reddit.

## Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase Auth & Database**

### Backend
- **Flask** (Python)
- **PRAW** (Reddit API)
- **Google Gemini API** (AI Intelligence)
- **Razorpay** (Payments)
- **Supabase SDK**

## Project Structure
- `/frontend`: Next.js application
- `/backend`: Flask API and background jobs

## Local Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### Installation

#### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Unix)
4. `pip install -r requirements.txt`
5. Create `.env` from `.env.example`

#### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env.local` from `.env.local.example`
4. `npm run dev`

## Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features and bug fixes
