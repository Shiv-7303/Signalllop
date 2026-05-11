import os
import hmac
import hashlib
import razorpay
from backend.config import Config
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

PLAN_IDS = {
    'starter': os.environ.get('RAZORPAY_PLAN_STARTER_ID', 'plan_Snw1uNEsnPJH0Z'),
    'pro': os.environ.get('RAZORPAY_PLAN_PRO_ID', 'plan_test_pro')
}

class BillingService:
    def __init__(self):
        self.client = razorpay.Client(auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET))

    def create_subscription(self, user_id, plan_name):
        """Creates a Razorpay subscription."""
        plan_id = PLAN_IDS.get(plan_name)
        if not plan_id:
            return None
            
        data = {
            "plan_id": plan_id,
            "total_count": 12,
            "quantity": 1,
            "customer_notify": 1,
            "notes": {
                "user_id": user_id,
                "plan": plan_name
            }
        }
        try:
            subscription = self.client.subscription.create(data=data)
            return subscription
        except Exception as e:
            print(f"Razorpay Subscription Error: {e}")
            return None

    def verify_webhook_signature(self, payload_body, razorpay_signature):
        """Verifies the Razorpay webhook signature using HMAC."""
        webhook_secret = os.environ.get('RAZORPAY_WEBHOOK_SECRET')
        if not webhook_secret:
            return False
            
        try:
            expected_signature = hmac.new(
                webhook_secret.encode(),
                payload_body,
                hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(expected_signature, razorpay_signature)
        except Exception:
            return False

    def activate_subscription(self, user_id, plan, subscription_id, customer_id):
        """Activates a subscription in the database."""
        from datetime import date, timedelta
        renewal_date = (date.today() + timedelta(days=30)).isoformat()
        
        try:
            # 1. Update user's plan first (Most important)
            user_update = supabase.table('users').update({"plan": plan}).eq('id', user_id).execute()
            if not user_update.data:
                print(f"❌ Failed to update user plan for {user_id}")
                return False

            # 2. Insert/Update subscription record
            sub_data = {
                "user_id": user_id,
                "plan": plan,
                "razorpay_subscription_id": subscription_id,
                "razorpay_customer_id": customer_id,
                "status": "active",
                "renewal_date": renewal_date
            }
            
            # Use the unique constraint name we just added
            supabase.table('subscriptions').upsert(sub_data, on_conflict='razorpay_subscription_id').execute()
            
            print(f"✅ Subscription activated: {subscription_id} for user {user_id} (Plan: {plan})")
            return True
        except Exception as e:
            print(f"❌ Activate Subscription Error: {e}")
            return False

    def cancel_subscription(self, user_id):
        """Cancels the active subscription for a user."""
        try:
            # Fetch active subscription
            response = supabase.table('subscriptions').select('razorpay_subscription_id').eq('user_id', user_id).eq('status', 'active').execute()
            if not response.data:
                return False
                
            sub_id = response.data[0]['razorpay_subscription_id']
            # Cancel at Razorpay
            self.client.subscription.cancel(sub_id, {"cancel_at_cycle_end": 1})
            
            # Update DB
            supabase.table('subscriptions').update({"status": "cancelled"}).eq('razorpay_subscription_id', sub_id).execute()
            supabase.table('users').update({"plan": "free"}).eq('id', user_id).execute()
            return True
        except Exception as e:
            print(f"Cancel Subscription Error: {e}")
            return False

    def handle_payment_failure(self, subscription_id):
        """Marks a subscription as past_due on payment failure."""
        try:
            supabase.table('subscriptions').update({"status": "past_due"}).eq('razorpay_subscription_id', subscription_id).execute()
            return True
        except Exception as e:
            print(f"Payment Failure Handling Error: {e}")
            return False

    def get_subscription(self, user_id):
        """Fetches the current subscription for a user."""
        try:
            response = supabase.table('subscriptions').select('*').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
            return response.data[0] if response.data else {"plan": "free", "status": None}
        except Exception:
            return {"plan": "free", "status": None}
