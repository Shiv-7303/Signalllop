from flask import Blueprint, request, jsonify, g
from backend.utils.auth_middleware import require_auth
from backend.services.billing_service import BillingService
from backend.utils.limiter import limiter
import os

billing_bp = Blueprint('billing', __name__)
billing_service = BillingService()

@billing_bp.route('/create-subscription', methods=['POST'])
@require_auth
@limiter.limit("10 per minute")
def create_subscription():
    """Creates a Razorpay subscription."""
    data = request.json
    plan = data.get('plan')
    
    if plan not in ['starter', 'pro']:
        return jsonify({"error": "Invalid plan"}), 400
        
    subscription = billing_service.create_subscription(g.user_id, plan)
    if not subscription:
        return jsonify({"error": "Subscription creation failed"}), 500
        
    return jsonify({
        "subscription_id": subscription['id'],
        "key_id": os.environ.get('RAZORPAY_KEY_ID')
    }), 201

@billing_bp.route('/verify-payment', methods=['POST'])
@require_auth
@limiter.limit("10 per minute")
def verify_payment():
    """Verifies the initial subscription payment."""
    data = request.json
    payment_id = data.get('razorpay_payment_id')
    subscription_id = data.get('razorpay_subscription_id')
    signature = data.get('razorpay_signature')
    plan = data.get('plan')
    
    # Razorpay verification logic
    params_dict = {
        'razorpay_subscription_id': subscription_id,
        'razorpay_payment_id': payment_id,
        'razorpay_signature': signature
    }
    
    try:
        billing_service.client.utility.verify_subscription_payment_signature(params_dict)
        # Assuming success, activate
        success = billing_service.activate_subscription(g.user_id, plan, subscription_id, "cust_placeholder")
        if not success:
            return jsonify({"error": "database_update_failed", "message": "Signature verified but could not update plan in database."}), 500
            
        return jsonify({"success": True, "plan": plan}), 200
    except Exception as e:
        return jsonify({"error": "Invalid signature", "message": str(e)}), 400

@billing_bp.route('/webhook', methods=['POST'])
def razorpay_webhook():
    """Handles Razorpay webhook events."""
    payload = request.data
    signature = request.headers.get('X-Razorpay-Signature')
    
    if not billing_service.verify_webhook_signature(payload, signature):
        return jsonify({"error": "Invalid signature"}), 400
        
    data = request.json
    event = data.get('event')
    
    # Handle different Razorpay events
    if event == 'subscription.activated':
        # Activation logic
        pass
    elif event == 'subscription.charged':
        # Update renewal date
        pass
    elif event == 'payment.failed':
        # Handle failure
        try:
            sub_id = data['payload']['subscription']['entity']['id']
            billing_service.handle_payment_failure(sub_id)
        except (KeyError, TypeError):
            pass
        
    return jsonify({"status": "received"}), 200

@billing_bp.route('/subscription', methods=['GET'])
@require_auth
def get_subscription():
    """Fetches the user's subscription details."""
    sub = billing_service.get_subscription(g.user_id)
    return jsonify(sub), 200

@billing_bp.route('/cancel', methods=['POST'])
@require_auth
@limiter.limit("10 per minute")
def cancel_subscription():
    """Cancels the user's subscription."""
    success = billing_service.cancel_subscription(g.user_id)
    if success:
        return jsonify({"success": True, "message": "Subscription cancelled"}), 200
    return jsonify({"error": "Cancellation failed"}), 500
