from flask import Blueprint, request, jsonify
from models.user_subscription import remove_subscription, find_subscription

unsubscribe_bp = Blueprint('unsubscribe_routes', __name__)

@unsubscribe_bp.route('/', methods=['POST'])
def unsubscribe():
    """
    Route to unsubscribe a user from the Daily CyberBrief.
    """
    try:
        data = request.get_json()
        email = data.get("email")

        # Validate input
        if not email:
            return jsonify({"error": "Missing email"}), 400

        subscription = find_subscription(email)
        if not subscription:
            return jsonify({"message": "Subscription not found"}), 404

        # Remove subscription from the database
        remove_subscription(email)

        return jsonify({"message": "Successfully unsubscribed"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

