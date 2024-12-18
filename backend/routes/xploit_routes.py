from flask import Blueprint, request, jsonify
from helpers.xploitcraft_helper import Xploits
import logging

# Configure logger
logger = logging.getLogger(__name__)


xploit = Xploits()


xploit_bp = Blueprint('xploit_bp', __name__)


@xploit_bp.route('/generate_payload', methods=['POST'])
def generate_payload_endpoint():
    data = request.get_json()
    logger.debug(f"Received data: {data}")

    if not data or 'vulnerability' not in data or 'evasion_technique' not in data:
        logger.error("Invalid request payload")
        return jsonify({'error': 'Missing vulnerability or evasion technique'}), 400

    vulnerability = data.get('vulnerability')
    evasion_technique = data.get('evasion_technique')

    try:
        payload = xploit.generate_exploit_payload(vulnerability, evasion_technique)
        logger.debug(f"Generated payload: {payload}")
        return jsonify({'payload': payload})
    except Exception as e:
        logger.error(f"Error while generating payload: {str(e)}")
        return jsonify({'error': 'Failed to generate payload'}), 500


