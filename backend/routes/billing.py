import os
from flask import Blueprint, request, jsonify, g
from backend.utils.auth_middleware import require_auth
from backend.services.billing_service import create_order, verify_payment, upgrade_user_plan

billing_bp = Blueprint('billing', __name__)

@billing_bp.route('/create-subscription', methods=['POST'])
@require_auth
def create_subscription_route():
    """
    Creates a Razorpay order (which acts as our entry point to subscription checkout)
    and returns the details needed by the frontend.
    """
    data = request.json
    plan = data.get('plan')
    user_id = g.user_id

    if not plan:
        return jsonify({"error": "Plan is required"}), 400

    try:
        order = create_order(user_id, plan)
        
        # The frontend expects subscription_id and key_id. 
        # Since we're using order.create per B13, we pass the order ID as subscription_id.
        return jsonify({
            "subscription_id": order['id'], 
            "key_id": os.environ.get('RAZORPAY_KEY_ID', 'test_key')
        }), 200
        
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"Error creating order: {e}")
        return jsonify({"error": "Failed to create order"}), 500

@billing_bp.route('/verify-payment', methods=['POST'])
@require_auth
def verify_payment_route():
    """
    Verifies the Razorpay payment signature and upgrades the user.
    """
    data = request.json
    payment_id = data.get('razorpay_payment_id')
    order_id = data.get('razorpay_subscription_id') # mapped from frontend
    signature = data.get('razorpay_signature')
    plan = data.get('plan')
    user_id = g.user_id

    if not all([payment_id, order_id, signature, plan]):
        return jsonify({"error": "Missing payment verification data"}), 400

    try:
        is_valid = verify_payment(payment_id, order_id, signature)
        if not is_valid:
            return jsonify({"error": "Invalid signature"}), 400

        # Upgrade the user's plan and reset usage
        upgrade_user_plan(user_id, plan, payment_id, order_id)

        # (Optional) Send confirmation email - implemented in B13 spec, could call email_service here
        
        return jsonify({"success": True}), 200

    except Exception as e:
        print(f"Error verifying payment: {e}")
        return jsonify({"error": "Verification failed"}), 500

@billing_bp.route('/cancel', methods=['POST'])
@require_auth
def cancel_subscription():
    """
    Cancels the user's active subscription.
    """
    user_id = g.user_id
    from backend.services.billing_service import get_supabase
    supabase = get_supabase()
    
    try:
        from datetime import datetime
        supabase.table('subscriptions').update({
            'status': 'cancelled',
            'cancelled_at': datetime.utcnow().isoformat()
        }).eq('user_id', user_id).execute()
        
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
