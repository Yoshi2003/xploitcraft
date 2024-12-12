from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from helpers.log_generator import generate_logs
from helpers.log_helper import explain_log
from models.log_models import Log  # Import the Log model
import logging
import os

# Initialize logger
logger = logging.getLogger(__name__)

# Define the blueprint with the name "log"
log_bp = Blueprint("log", __name__)

# Initialize MongoDB client
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017/xploitcraft")
client_mongo = MongoClient(MONGO_URI)
db = client_mongo.get_default_database()

# Generate Logs Route
@log_bp.route("/generate_logs", methods=["POST"])
def generate_logs_route():
    data = request.get_json() or {}
    log_type = data.get("log_type", None)
    count = int(data.get("count", 10))

    logs = generate_logs(log_type, count)

    # Validate logs using Pydantic
    try:
        validated_logs = [Log(**log).dict() for log in logs]
    except Exception as e:
        logger.error(f"Log validation error: {e}")
        return jsonify({"error": "Invalid log data."}), 400

    try:
        db.logs.insert_many(validated_logs)
        logger.info(f"Inserted {count} logs of type '{log_type}'")
        return jsonify({"message": "Logs generated", "logs": validated_logs}), 201
    except Exception as e:
        logger.error(f"Error inserting logs: {e}")
        return jsonify({"error": "Failed to generate logs."}), 500

# Fetch Logs Route
@log_bp.route("/fetch_logs", methods=["GET"])
def fetch_logs_route():
    log_type = request.args.get("log_type", None)
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    skip = (page - 1) * per_page

    try:
        query = {"type": log_type} if log_type else {}
        cursor = db.logs.find(query).skip(skip).limit(per_page)
        logs = list(cursor)

        # Convert MongoDB IDs to strings
        for log_record in logs:
            log_record["_id"] = str(log_record["_id"])

        total_logs = db.logs.count_documents(query)
        logger.info(f"Fetched {len(logs)} logs out of {total_logs} total")
        return jsonify({
            "logs": logs,
            "total": total_logs,
            "page": page,
            "per_page": per_page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching logs: {e}")
        return jsonify({"error": "Failed to fetch logs."}), 500

# Analyze Log Route
@log_bp.route("/analyze_log", methods=["POST"])
def analyze_log_route():
    data = request.get_json() or {}
    log_id = data.get("log_id")
    if not log_id:
        return jsonify({"error": "log_id is required"}), 400

    try:
        log_doc = db.logs.find_one({"_id": ObjectId(log_id)})
        if not log_doc:
            return jsonify({"error": "Log not found"}), 404

        explanation = explain_log(log_doc)
        return jsonify({"explanation": explanation}), 200
    except Exception as e:
        logger.error(f"Error analyzing log: {e}")
        return jsonify({"error": "Failed to analyze log."}), 500
