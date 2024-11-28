

import os
import logging
from flask import Blueprint, request, jsonify, session
from uuid import uuid4
from helpers.scenario_helper import generate_scenario, break_down_scenario
from scenario_logic.interactive_logic import generate_interactive_questions
from scenario_logic.scenario_flow_manager import ScenarioFlowManager

# Create a blueprint for scenario routes
scenario_bp = Blueprint('scenario_bp', __name__)

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# To keep track of multiple user sessions
flow_managers = {}

@scenario_bp.route('/generate_scenario', methods=['POST'])
def generate_scenario_endpoint():
    global flow_managers
    session_id = session.get('session_id')

    # Log session ID check
    if not session_id:
        logger.info("Session ID not found; creating a new one.")
        session_id = str(uuid4())
        session['session_id'] = session_id
    else:
        logger.info(f"Using existing session ID: {session_id}")

    # Generate and store scenario flow for this user
    data = request.get_json()

    # Validate incoming data
    if not data:
        logger.error("No data received in the request.")
        return jsonify({'error': 'Missing request data'}), 400

    required_fields = ['industry', 'attack_type', 'skill_level', 'threat_intensity']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        logger.error(f"Missing required parameters: {', '.join(missing_fields)}")
        return jsonify({'error': f"Missing required parameters: {', '.join(missing_fields)}"}), 400

    # Extract and validate data fields
    industry = data['industry']
    attack_type = data['attack_type']
    skill_level = data['skill_level']
    threat_intensity = data['threat_intensity']

    try:
        threat_intensity = int(threat_intensity)
        if not (1 <= threat_intensity <= 100):
            raise ValueError
    except ValueError:
        logger.error("Invalid value for threat_intensity. Must be an integer between 1 and 100.")
        return jsonify({'error': 'Invalid value for threat_intensity. Must be an integer between 1 and 100.'}), 400

    try:
        # Generate scenario using OpenAI
        logger.info(f"Generating scenario for session ID: {session_id}")
        scenario_text = generate_scenario(industry, attack_type, skill_level, threat_intensity)
        scenario_breakdown = break_down_scenario(scenario_text)

        # Pass scenario_text for dynamic question generation
        interactive_questions = generate_interactive_questions(scenario_text)

        # Store ScenarioFlowManager for this user
        flow_managers[session_id] = ScenarioFlowManager(scenario_breakdown)

        logger.info(f"Scenario successfully generated for session ID: {session_id}")

        return jsonify({
            'scenario': scenario_text,
            'breakdown': scenario_breakdown,
            'interactive_questions': interactive_questions
        }), 200

    except Exception as e:
        logger.error(f"Error while generating scenario: {e}")
        return jsonify({'error': 'An internal error occurred while generating the scenario. Please try again later.'}), 500



