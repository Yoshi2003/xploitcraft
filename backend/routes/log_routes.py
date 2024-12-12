from flask import Blueprint, request, jsonify
from log_generator import generate_logs
from log_helper import analyze_logs_bulk
import logging
from database import db
from models.log_history import LogHistory


# Initialize Flask Blueprint
log_bp = Blueprint("logs", __name__)
logger = logging.getLogger(__name__)

# ---------------------------------
# Unified Log Generation & Analysis Route
# ---------------------------------

@log_bp.route("/logs/generate", methods=["POST"])
def generate_and_analyze_logs():
    """
    Endpoint to generate logs based on category and count,
    then analyze them using OpenAI's API.
    """
    try:
        # Extract request data
        data = request.get_json()
        category = data.get("category", "security").lower()
        count = int(data.get("count", 5))
        
        # Generate logs
        logs = generate_logs(category, count)
        if not logs:
            logger.warning(f"No logs generated for category: {category}")
            return jsonify({"error": "Invalid log category."}), 400
        
        # Analyze logs
        analyzed_logs = analyze_logs_bulk(logs)
        
        logger.info(f"Generated and analyzed {count} logs for category: {category}")
        return jsonify({
            "status": "success",
            "category": category,
            "logs": analyzed_logs,
            "count": len(analyzed_logs),
        }), 200

    except Exception as e:
        logger.error(f"Error generating and analyzing logs: {e}")
        return jsonify({"error": str(e)}), 500


# ---------------------------------
# Fetch Specific Logs Route (Optional Feature)
# ---------------------------------

@log_bp.route("/logs/fetch", methods=["GET"])
def fetch_logs():
    """
    Fetch logs based on query parameters like category and severity.
    """
    try:
        category = request.args.get("category", "all").lower()
        severity = request.args.get("severity", None)
        limit = int(request.args.get("limit", 10))
        
        # Simulate fetching logs (use a real database or log storage service)
        logs = generate_logs(category, limit)

        # Filter by severity if provided
        if severity:
            logs = [log for log in logs if log.severity.lower() == severity.lower()]

        logger.info(f"Fetched {len(logs)} logs with category: {category}, severity: {severity}")
        return jsonify({
            "status": "success",
            "logs": [log.dict() for log in logs],
            "count": len(logs),
        }), 200

    except Exception as e:
        logger.error(f"Error fetching logs: {e}")
        return jsonify({"error": str(e)}), 500


# ---------------------------------
# Analyze Existing Logs Route (Manual Analysis)
# ---------------------------------

@log_bp.route("/logs/analyze", methods=["POST"])
def analyze_existing_logs():
    """
    Endpoint to analyze manually provided logs.
    """
    try:
        # Extract request data
        data = request.get_json()
        logs = data.get("logs", [])
        
        if not logs:
            logger.warning("No logs provided for analysis.")
            return jsonify({"error": "No logs provided."}), 400
        
        # Analyze the logs
        analyzed_logs = analyze_logs_bulk(logs)
        
        logger.info(f"Analyzed {len(analyzed_logs)} provided logs.")
        return jsonify({
            "status": "success",
            "logs": analyzed_logs,
            "count": len(analyzed_logs),
        }), 200

    except Exception as e:
        logger.error(f"Error analyzing provided logs: {e}")
        return jsonify({"error": str(e)}), 500


# ---------------------------------
# Health Check Route
# ---------------------------------

@log_bp.route("/healthcheck", methods=["GET"])
def health_check():
    """
    Health check endpoint to ensure the service is running.
    """
    return jsonify({"status": "running", "service": "Log Analysis API"}), 200


log_history_bp = Blueprint("log_history", __name__)

@log_history_bp.route("/logs/history/save", methods=["POST"])
def save_log_history():
    try:
        data = request.get_json()
        history_entry = LogHistory(**data)
        db.log_history.insert_one(history_entry.dict())

        return jsonify({"status": "success", "message": "History saved."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@log_history_bp.route("/logs/history/fetch", methods=["GET"])
def fetch_log_history():
    try:
        history = list(db.log_history.find().sort("timestamp", -1))
        return jsonify({"status": "success", "history": history}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


