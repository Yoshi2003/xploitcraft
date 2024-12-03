from flask import Blueprint, request, jsonify
from models.user_subscription import find_subscription, update_subscription

update_bp = Blueprint('update_routes', __name__)

@update_bp.route('/', methods=['POST'])
def update_subscription_info():
    """
    Route to update a user's Daily CyberBrief subscription.
    """
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Missing email"}), 400

        # Find the existing subscription
        subscription = find_subscription(email)
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404

        # Update subscription fields
        cert_category = data.get("cert_category", subscription["cert_category"])
        frequency = data.get("frequency", subscription["frequency"])
        time_slots = data.get("time_slots", subscription["time_slots"])

        # Update subscription in the database
        updated_data = {
            "cert_category": cert_category,
            "frequency": frequency,
            "time_slots": time_slots
        }
        update_subscription(email, updated_data)

        return jsonify({"message": "Subscription updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

