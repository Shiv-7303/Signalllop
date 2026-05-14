import os
from dotenv import load_dotenv

# Get the directory where config.py is located
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

PLAN_LIMITS = {
    'free': {
        'reports_per_month': 1,
        'competitors': 1,
        'opportunity_feed': 'basic',
        'saved_opportunities': 3,
        'priority_queue': False,
        'weekly_digest': True,
        'opportunity_scan_interval': None   # No scanning for free
    },
    'starter': {
        'reports_per_month': 20,
        'competitors': 5,
        'opportunity_feed': 'advanced',
        'saved_opportunities': -1,          # unlimited
        'priority_queue': False,
        'weekly_digest': True,
        'opportunity_scan_interval': 6      # hours
    },
    'pro': {
        'reports_per_month': 50,
        'competitors': -1,                  # unlimited
        'opportunity_feed': 'premium',
        'saved_opportunities': -1,
        'priority_queue': True,
        'weekly_digest': True,
        'opportunity_scan_interval': 6,
        'competitor_monitor': True
    }
}

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    REDDIT_CLIENT_ID = os.environ.get('REDDIT_CLIENT_ID')
    REDDIT_CLIENT_SECRET = os.environ.get('REDDIT_CLIENT_SECRET')
    REDDIT_USER_AGENT = os.environ.get('REDDIT_USER_AGENT', 'ai-distribution-engine/1.0')
    
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
    
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
    
    REDIS_URL = os.environ.get('REDIS_URL', 'memory://') # Fallback to memory for dev
    
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
