import razorpay
import hmac
import hashlib
import os
from datetime import datetime, timedelta
from supabase import create_client

def get_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)

PLAN_PRICES = {
    'starter': 49900,   # ₹499 in paise
    'pro': 99900        # ₹999 in paise
}

# Provide defaults if not found so it doesn't crash during import
rzp_id = os.environ.get('RAZORPAY_KEY_ID', 'test_key')
rzp_secret = os.environ.get('RAZORPAY_KEY_SECRET', 'test_secret')

client = razorpay.Client(auth=(rzp_id, rzp_secret))

def create_order(user_id: str, plan: str) -> dict:
    if plan not in PLAN_PRICES:
        raise ValueError(f"Invalid plan: {plan}")

    order = client.order.create({
        'amount': PLAN_PRICES[plan],
        'currency': 'INR',
        'payment_capture': 1,
        'notes': {
            'user_id': user_id,
            'plan': plan
        }
    })
    return order

def verify_payment(payment_id: str, order_id: str, signature: str) -> bool:
    """Verify Razorpay HMAC signature."""
    msg = f'{order_id}|{payment_id}'
    expected = hmac.new(
        rzp_secret.encode(),
        msg.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

def upgrade_user_plan(user_id: str, plan: str, payment_id: str, order_id: str):
    """Upgrade user plan after verified payment."""
    supabase = get_supabase()
    
    # Update users table
    supabase.table('users').update(
        {'plan': plan}
    ).eq('id', user_id).execute()

    # Update or create subscription record
    # Note: Using razorpay_subscription_id = order_id just to store it since we created an order, not a strict subscription.
    supabase.table('subscriptions').upsert({
        'user_id': user_id,
        'plan': plan,
        'razorpay_payment_id': payment_id,
        'razorpay_subscription_id': order_id, 
        'status': 'active',
        'renewal_date': (datetime.utcnow() + timedelta(days=30)).isoformat()
    }).execute()

    # Reset usage counters for new billing cycle
    reset_usage_counters(user_id, plan)

def reset_usage_counters(user_id: str, plan: str):
    supabase = get_supabase()
    from backend.config import PLAN_LIMITS
    
    today = datetime.utcnow().date()
    if today.month == 12:
        next_month = today.replace(year=today.year + 1, month=1, day=1)
    else:
        next_month = today.replace(month=today.month + 1, day=1)
        
    # Upsert usage_tracking
    usage_data = {
        'user_id': user_id,
        'reports_used': 0,
        'competitors_used': 0,
        'monthly_reset_date': next_month.isoformat()
    }
    
    # check if user has usage_tracking
    res = supabase.table('usage_tracking').select('id').eq('user_id', user_id).execute()
    if res.data:
        supabase.table('usage_tracking').update(usage_data).eq('user_id', user_id).execute()
    else:
        supabase.table('usage_tracking').insert(usage_data).execute()
