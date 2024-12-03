from flask import Blueprint, request, jsonify
from helpers.email_helper import send_email
from helpers.emailopenai_helper import generate_email_content
from helpers.scheduler_helper import schedule_email_task

email_bp = Blueprint('email_routes', __name__)

@email_bp.route('/schedule_email', methods=['POST'])
def schedule_email():
    """
    Route to schedule an email for the Daily CyberBrief feature.
    """
    try:
        data = request.get_json()
        email = data.get("email")
        cert_category = data.get("cert_category")
        time_slots = data.get("time_slots")

        if not email or not cert_category or not time_slots:
            return jsonify({"error": "Missing required parameters."}), 400

        # Generate content using OpenAI
        prompt = f"Write an informative email about a topic related to {cert_category}."
        email_content = generate_email_content(subject=f"Daily CyberBrief - {cert_category}", prompt=prompt)

        # Schedule email task using the scheduler helper
        for time_slot in time_slots:
            schedule_email_task(email, email_content, time_slot)

        return jsonify({"message": "Emails scheduled successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

