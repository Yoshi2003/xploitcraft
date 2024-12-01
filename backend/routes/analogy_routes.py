# analogy_routes.py
from flask import Blueprint, request, jsonify
from helpers.analogy_helper import (
    generate_single_analogy,
    generate_comparison_analogy,
    generate_triple_comparison_analogy
)
import logging

analogy_bp = Blueprint('analogy_bp', __name__)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

@analogy_bp.route('/generate_analogy', methods=['POST'])
def generate_analogy():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request must contain data"}), 400

    analogy_type = data.get("analogy_type")
    category = data.get("category")
    concept1 = data.get("concept1")
    concept2 = data.get("concept2", None)
    concept3 = data.get("concept3", None)

    try:
        # Determine the type of analogy request
        if analogy_type == "single" and concept1:
            return jsonify({
                "analogy": generate_single_analogy(concept1, category)
            }), 200

        elif analogy_type == "comparison" and concept1 and concept2:
            return jsonify({
                "analogy": generate_comparison_analogy(concept1, concept2, category)
            }), 200

        elif analogy_type == "triple" and concept1 and concept2 and concept3:
            return jsonify({
                "analogy": generate_triple_comparison_analogy(concept1, concept2, concept3, category)
            }), 200

        else:
            logger.error("Invalid parameters provided")
            return jsonify({"error": "Invalid parameters"}), 400

    except Exception as e:
        logger.error(f"Error generating analogy: {e}")
        return jsonify({"error": "An internal error occurred while generating the analogy."}), 500

