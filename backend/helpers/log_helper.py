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
    SecurityLog: (
        "You are analyzing a security log entry. Provide a comprehensive explanation that:\n"
        "1. Identifies the potential security implications of the observed activity.\n"
        "2. Explains the attack vector or threat method in detail.\n"
        "3. Discusses why this activity is significant from a security standpoint.\n"
        "4. Offers recommended mitigation, remediation steps, and best practices to prevent or respond to such threats.\n"
        "5. Adds educational context, such as definitions of key terms or relevant security concepts.\n"
        "Your goal is to teach the reader about the security scenario described by the log."
    ),
    FirewallLog: (
        "You are examining a firewall log entry. Provide a thorough analysis that:\n"
        "1. Describes the significance of the detected firewall event (e.g., blocked or allowed traffic).\n"
        "2. Explains what the indicated traffic behavior (protocol, port, volume) might mean.\n"
        "3. Clarifies the risk and potential impacts if such traffic were not properly controlled.\n"
        "4. Suggests how to respond, including tuning firewall rules, monitoring suspicious IPs, and improving filtering.\n"
        "5. Educates the reader about firewall operations and why this event matters in a real-world scenario."
    ),
    VulnerabilityLog: (
        "You are reviewing a vulnerability log entry. Provide an in-depth explanation that:\n"
        "1. Describes the vulnerability's nature and risk level.\n"
        "2. Explains why this vulnerability is significant, how attackers might exploit it, and the potential impacts.\n"
        "3. Offers recommended mitigation steps, such as applying patches, configuration changes, or code fixes.\n"
        "4. Adds educational context, like how CVEs are identified and the importance of timely patching.\n"
        "5. Helps the reader understand the broader vulnerability management process."
    ),
    IntrusionLog: (
        "You are analyzing an intrusion detection log entry. Provide a detailed explanation that:\n"
        "1. Explains the type of intrusion attempt, its likely intent, and how it fits into common attack patterns.\n"
        "2. Discusses the potential consequences if the intrusion succeeded.\n"
        "3. Recommends immediate response actions (e.g., block IP, isolate system) and longer-term mitigation (e.g., network segmentation).\n"
        "4. Provides educational context, including definitions of intrusion methods and best practices for intrusion detection and response."
    ),
    AccessControlLog: (
        "You are examining an access control log entry. Provide a comprehensive explanation that:\n"
        "1. Determines whether the access attempt was legitimate or suspicious.\n"
        "2. Discusses the reason behind the decision (granted or denied) and potential risks of incorrect access.\n"
        "3. Suggests security measures to strengthen access controls, such as MFA, strict RBAC, or improved authentication methods.\n"
        "4. Educates the reader about the principles of access control, least privilege, and identity management."
    ),
    SystemEvent: (
        "You are reviewing a system event log entry. Provide a thorough explanation that:\n"
        "1. Analyzes what the event means for overall system performance and stability.\n"
        "2. Identifies potential system health or configuration issues.\n"
        "3. Suggests maintenance steps or resource optimizations.\n"
        "4. Educates the reader on system monitoring, resource utilization, and the importance of proactive system management."
    ),
    ApplicationEvent: (
        "You are examining an application event log entry. Provide a detailed explanation that:\n"
        "1. Describes what the application event indicates, such as a crash, update, or error.\n"
        "2. Discusses root causes and common triggers for such events.\n"
        "3. Suggests resolution steps, including debugging, patching, or dependency management.\n"
        "4. Adds educational context on application lifecycle management, logging best practices, and how to maintain application reliability."
    ),
    AuthenticationEvent: (
        "You are analyzing an authentication event log entry. Provide a rich explanation that:\n"
        "1. Explains potential reasons for login failures or successes, including credential issues or unusual login patterns.\n"
        "2. Discusses security implications of authentication events (e.g., brute force attempts, compromised credentials).\n"
        "3. Suggests improvements such as stronger authentication methods, monitoring login attempts, and user education.\n"
        "4. Educates the reader about authentication protocols, MFA, and common authentication-related attacks."
    ),
    NetworkEvent: (
        "You are reviewing a network event log entry. Provide an in-depth explanation that:\n"
        "1. Describes the detected network anomaly or activity.\n"
        "2. Explains potential impacts on bandwidth, latency, and service availability.\n"
        "3. Suggests countermeasures (e.g., rate limiting, QoS, IDS/IPS usage) to handle such anomalies.\n"
        "4. Educates the reader on network protocols, common network attacks or misconfigurations, and best practices for network monitoring."
    ),
    DatabaseErrorLog: (
        "You are analyzing a database error log. Provide a comprehensive explanation that:\n"
        "1. Explains the nature of the database error (e.g., query failure, missing fields).\n"
        "2. Suggests how to fix the issue (e.g., correct SQL syntax, add missing indexes, restore data).\n"
        "3. Discusses the importance of proper database design, indexing, and error handling.\n"
        "4. Educates the reader about database optimization and common pitfalls in database operations."
    ),
    FileSystemErrorLog: (
        "You are examining a filesystem error log. Provide a thorough explanation that:\n"
        "1. Describes what caused the file-related error (e.g., missing file, permission issue).\n"
        "2. Suggests remediation steps (e.g., verify file paths, adjust permissions, ensure sufficient disk space).\n"
        "3. Discusses the importance of proper file handling, backups, and file integrity checks.\n"
        "4. Educates the reader on filesystem management best practices."
    ),
    NetworkErrorLog: (
        "You are reviewing a network error log entry. Provide a detailed explanation that:\n"
        "1. Explains the network error and its potential impact on connected services.\n"
        "2. Suggests methods to resolve the error (e.g., troubleshooting connectivity, adjusting firewall rules, checking cables).\n"
        "3. Discusses the importance of network resilience, redundancy, and proper monitoring.\n"
        "4. Educates the reader about network fault tolerance and common network troubleshooting steps."
    ),
    ApplicationErrorLog: (
        "You are analyzing an application error log entry. Provide a comprehensive explanation that:\n"
        "1. Describes the error, its potential root causes, and how it affects the application.\n"
        "2. Suggests steps to prevent similar issues in the future (e.g., better exception handling, code testing, patching).\n"
        "3. Discusses the importance of logging, monitoring, and proactive maintenance.\n"
        "4. Educates the reader about application stability, testing strategies, and error management techniques."
    ),
    QueryDebugLog: (
        "You are examining a query debug log entry. Provide a thorough explanation that:\n"
        "1. Reviews the SQL query and identifies any performance or efficiency issues.\n"
        "2. Suggests ways to improve execution time (e.g., indexing, query optimization).\n"
        "3. Discusses the importance of query optimization, caching, and proper schema design.\n"
        "4. Educates the reader about common database performance tuning practices."
    ),
    ApiDebugLog: (
        "You are analyzing an API debug log. Provide a detailed explanation that:\n"
        "1. Reviews the API request and response, identifying any latency or performance bottlenecks.\n"
        "2. Suggests improvements to reduce response time (e.g., load balancing, caching, optimizing code).\n"
        "3. Discusses the importance of API design, proper error handling, and versioning.\n"
        "4. Educates the reader about RESTful principles, rate limits, and API performance best practices."
    ),
    ConfigDebugLog: (
        "You are examining a configuration debug log. Provide a comprehensive explanation that:\n"
        "1. Explains the configuration change and its intended effect on the system behavior.\n"
        "2. Discusses the importance of proper configuration management, validation, and rollback planning.\n"
        "3. Suggests ways to prevent configuration drift and improve configuration governance.\n"
        "4. Educates the reader on best practices for managing configurations across environments."
    ),
    ProcessDebugLog: (
        "You are reviewing a process debug log entry. Provide a thorough explanation that:\n"
        "1. Describes the process's resource usage and identifies any optimization opportunities.\n"
        "2. Suggests ways to improve execution (e.g., parallelization, resource allocation).\n"
        "3. Discusses the importance of monitoring process performance and memory management.\n"
        "4. Educates the reader about system process management, scheduling, and profiling techniques."
    ),
    SystemInfoLog: (
        "You are analyzing a system info log. Provide a detailed explanation that:\n"
        "1. Reviews the current system status, performance, and health metrics.\n"
        "2. Identifies any potential issues or areas for improvement.\n"
        "3. Suggests routine maintenance tasks or resource adjustments.\n"
        "4. Educates the reader about system performance monitoring, capacity planning, and hardware health management."
    ),
    UserActivityLog: (
        "You are examining a user activity log. Provide a comprehensive explanation that:\n"
        "1. Highlights potential security or compliance issues related to user actions.\n"
        "2. Discusses why monitoring user activity is important for auditing and incident response.\n"
        "3. Suggests measures like user training, stricter access controls, or anomaly detection.\n"
        "4. Educates the reader on user behavior analytics, insider threats, and compliance requirements."
    ),
    DeploymentLog: (
        "You are reviewing a deployment log entry. Provide a thorough explanation that:\n"
        "1. Describes the deployment process and why it succeeded or failed.\n"
        "2. Suggests steps to improve future deployments (e.g., CI/CD enhancements, better testing).\n"
        "3. Discusses the value of automation, rollback strategies, and blue-green deployments.\n"
        "4. Educates the reader about modern deployment practices, DevOps culture, and continuous delivery."
    ),
    ServiceStatusLog: (
        "You are analyzing a service status log. Provide a comprehensive explanation that:\n"
        "1. Describes the current service health and any issues indicated.\n"
        "2. Suggests actions to maintain or improve service reliability (e.g., scaling, applying patches).\n"
        "3. Discusses the importance of SLAs, SLOs, and service monitoring.\n"
        "4. Educates the reader about service health metrics, observability tools, and capacity planning."
    ),
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

