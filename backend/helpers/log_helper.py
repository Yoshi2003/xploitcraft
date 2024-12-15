# helpers/log_helper.py

import logging
import json
from datetime import datetime
import re
import time
import random  # For jitter in backoff
from typing import List
from helpers.openai_helper import client  # Assumes you have an openai_helper.py for API key setup
from models.log_models import (
    Log, SecurityLog, FirewallLog, VulnerabilityLog, IntrusionLog, AccessControlLog,
    EventLog, SystemEvent, ApplicationEvent, AuthenticationEvent, NetworkEvent,
    DatabaseErrorLog, FileSystemErrorLog, NetworkErrorLog, ApplicationErrorLog,
    QueryDebugLog, ApiDebugLog, ConfigDebugLog, ProcessDebugLog,
    SystemInfoLog, UserActivityLog, DeploymentLog, ServiceStatusLog
)

# Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
handler.setFormatter(formatter)
logger.addHandler(handler)

# ---------------------------------
# Retry Configuration
# ---------------------------------
MAX_RETRIES = 3          # Maximum number of retry attempts
INITIAL_BACKOFF = 1      # Initial backoff delay in seconds
BACKOFF_FACTOR = 2       # Exponential backoff factor
JITTER = 0.5             # Jitter factor to add randomness

# ---------------------------------
# OpenAI Analysis Prompts
# ---------------------------------

PROMPTS = {
    SecurityLog: "Analyze this security log entry and explain its potential implications, attack vector, and recommended mitigation actions:",
    FirewallLog: "Describe the significance of this firewall log and suggest how to respond to the indicated traffic behavior:",
    VulnerabilityLog: "Explain the vulnerability reported in this log, its risk level, and recommended mitigation steps:",
    IntrusionLog: "Explain this intrusion detection log, its possible impact, and what action should be taken to prevent further intrusion:",
    AccessControlLog: "Analyze this access control log and determine if the access attempt was legitimate. Suggest security measures if necessary:",

    SystemEvent: "Analyze this system event and describe the implications on overall system performance:",
    ApplicationEvent: "Describe this application event, including what may have caused the reported issue and how to resolve it:",
    AuthenticationEvent: "Analyze this authentication event and explain potential reasons for login failures:",
    NetworkEvent: "Explain this network event, including the impact of detected anomalies and suggested countermeasures:",

    DatabaseErrorLog: "Explain this database error log entry and suggest how to fix the reported issue:",
    FileSystemErrorLog: "Describe this filesystem error log and recommend actions to fix the reported issue:",
    NetworkErrorLog: "Explain this network error log and describe its potential impact on connected services:",
    ApplicationErrorLog: "Analyze this application error log and describe steps to prevent similar issues:",

    QueryDebugLog: "Analyze this query debug log and explain if the query execution performance can be improved:",
    ApiDebugLog: "Analyze this API debug log and suggest improvements for reducing response time:",
    ConfigDebugLog: "Explain this configuration change log and describe its effect on system behavior:",
    ProcessDebugLog: "Describe this process management log and explain how process execution can be optimized:",

    SystemInfoLog: "Analyze this system info log and describe the current system status, performance, and health:",
    UserActivityLog: "Explain this user activity log, highlighting potential security or compliance issues:",
    DeploymentLog: "Describe this deployment log and suggest steps for improving future deployment processes:",
    ServiceStatusLog: "Analyze this service status log and determine if the system needs attention or maintenance:",
}

# ---------------------------------
# Log Serialization Function
# ---------------------------------

def serialize_log(log: Log) -> dict:
    """
    Converts log objects into JSON-serializable format by serializing all datetime fields,
    including those nested within dictionaries and lists.
    """
    def serialize_value(value):
        if isinstance(value, datetime):
            return value.isoformat()
        elif isinstance(value, dict):
            return {k: serialize_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [serialize_value(item) for item in value]
        else:
            return value

    log_dict = log.dict()
    serialized_dict = {}
    for k, v in log_dict.items():
        try:
            serialized_dict[k] = serialize_value(v)
        except Exception as e:
            logger.error(f"Error serializing field '{k}': {e}")
            serialized_dict[k] = str(v)  # Fallback to string representation

    return serialized_dict

# ---------------------------------
# Log Analysis Function with Simple Retry
# ---------------------------------

def analyze_log(log_record: Log) -> str:
    """
    Analyzes a single log record using OpenAI API with simple retry logic to handle rate limits.
    """
    prompt = PROMPTS.get(type(log_record), "Analyze this log entry and explain its significance:")
    formatted_prompt = f"{prompt}\n\nLog Details:\n{json.dumps(log_record.dict(), indent=4, default=str)}"

    attempt = 0
    backoff = INITIAL_BACKOFF

    while attempt < MAX_RETRIES:
        try:
            response = client.chat.completions.create(
                model="gpt-4",  # Adjust model as needed
                messages=[{"role": "user", "content": formatted_prompt}],
                max_tokens=1000,
                temperature=0.7,
            )
            content = response.choices[0].message.content.strip()

            # Optional: Cleanup formatting if needed
            content = re.sub(r'^```.*\n', '', content)
            content = re.sub(r'\n```$', '', content)

            logger.info("Log analysis successful.")
            logger.debug(f"Response Content: {content}")
            return content

        except Exception as e:
            error_message = str(e).lower()
            if "rate limit" in error_message:
                # Handle rate limit error by retrying after backoff
                attempt += 1
                wait_time = backoff + (JITTER * random.uniform(0, 1))
                logger.warning(f"Rate limit exceeded. Retrying in {wait_time:.2f} seconds... (Attempt {attempt}/{MAX_RETRIES})")
                time.sleep(wait_time)
                backoff *= BACKOFF_FACTOR  # Exponential increase
            else:
                # Log other exceptions and do not retry
                logger.error(f"Error analyzing log: {e}")
                break  # Exit the retry loop

    logger.error("Log analysis failed after multiple attempts due to rate limiting or other errors.")
    return "An error occurred while analyzing the log."

# ---------------------------------
# Bulk Log Analysis Function
# ---------------------------------

from concurrent.futures import ThreadPoolExecutor, as_completed

def analyze_logs_bulk(log_records: List[Log], max_workers: int = 5) -> List[dict]:
    """
    Analyzes multiple log records in bulk with controlled concurrency to handle rate limits.
    """
    analyzed_logs = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all log analysis tasks
        future_to_log = {executor.submit(analyze_log_entry, log): log for log in log_records}

        for future in as_completed(future_to_log):
            log = future_to_log[future]
            try:
                analysis = future.result()
                serialized_log = serialize_log(log)
                analyzed_logs.append({
                    "log": serialized_log,
                    "analysis": analysis
                })
            except Exception as e:
                logger.error(f"Error analyzing log ID {log.id}: {e}")
                analyzed_logs.append({
                    "log": serialize_log(log),
                    "analysis": "Analysis failed due to an unexpected error."
                })

    return analyzed_logs

# ---------------------------------
# Analysis Demo (For Testing)
# ---------------------------------

if __name__ == "__main__":
    from log_generator import generate_logs  # Ensure this module exists and is correctly implemented

    # Example usage
    logs = generate_logs("security", 3)  # Generate 3 security logs
    analyzed_logs = analyze_logs_bulk(logs)

    for entry in analyzed_logs:
        print(f"Log Record:\n{entry['log']}\n")
        print(f"Analysis Result:\n{entry['analysis']}\n")
        print("="*80)

