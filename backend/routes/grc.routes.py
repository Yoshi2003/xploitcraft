from flask import Blueprint, request, jsonify
from helpers.grc_helper import generate_grc_question
import logging

logger = logging.getLogger(__name__)

grc_bp = Blueprint('grc', __name__)

GRC_CATEGORIES = ["Regulation", "Risk Management", "Compliance", "Audit", "Governance", "Random"]
DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"]

@grc_bp.route('/generate_question', methods=['POST'])
def generate_question():
    """
    API route to generate a GRC quiz question.
    Expects JSON with "category" and "difficulty".
    Returns a JSON object with question data.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request must contain JSON data"}), 400

        category = data.get('category', 'Random')
        difficulty = data.get('difficulty', 'Easy')

        if category not in GRC_CATEGORIES:
            return jsonify({"error": "Invalid category"}), 400
        if difficulty not in DIFFICULTY_LEVELS:
            return jsonify({"error": "Invalid difficulty"}), 400

        question_data = generate_grc_question(category, difficulty)
        return jsonify(question_data), 200

    except ValueError as ve:
        logger.error(f"ValueError in /generate_question: {ve}")
        return jsonify({"error": "Model returned invalid JSON. Check logs."}), 500
    except Exception as e:
        logger.error(f"Error in /generate_question: {str(e)}")
        return jsonify({"error": "An internal error occurred."}), 500
