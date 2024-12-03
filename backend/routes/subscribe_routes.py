# xploitcraft/backend/routes/subscribe_routes.py

from flask import Blueprint, request, jsonify
from models.user_subscription import add_subscription, find_subscription
from helpers.scheduler_helper import schedule_email_task
from helpers.emailopenai_helper import generate_email_content
from helpers.email_helper import send_email  # Assuming this function sends the email directly using SendGrid

subscribe_bp = Blueprint('subscribe_routes', __name__)

@subscribe_bp.route('/', methods=['POST'])
def subscribe():
    """
    Route to subscribe a user to the Daily CyberBrief.
    """
    try:
        data = request.get_json()
        email = data.get("email")
        cert_category = data.get("cert_category")
        frequency = data.get("frequency")
        time_slots = data.get("time_slots")

        # Validate input
        if not email or not cert_category or not frequency or not time_slots:
            return jsonify({"error": "Missing required parameters"}), 400

        # Check if already subscribed
        if find_subscription(email):
            return jsonify({"message": "You are already subscribed"}), 400

        # Add subscription to the database
        add_subscription(email, cert_category, frequency, time_slots)

        # Generate content using OpenAI API
        prompt = f"Write an informative email about a topic related to {cert_category}."
        email_content = generate_email_content(subject=f"Daily CyberBrief - {cert_category}", prompt=prompt)

        # Handle "Immediately" option in time slots
        if "Immediately" in time_slots:
            # Send email immediately
            send_email(email, "Daily CyberBrief - {cert_category}", email_content)
            return jsonify({"message": "Subscription successful and email sent immediately!"}), 200

        # Otherwise, schedule emails as usual
        for time_slot in time_slots:
            schedule_email_task(email, email_content, time_slot)

        return jsonify({"message": "Subscription successful!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

