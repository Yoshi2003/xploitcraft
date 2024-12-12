import logging
import os
from openai import OpenAI
from log_models import (
    SecurityLog, FirewallLog, VulnerabilityLog, IntrusionLog, AccessControlLog,
    EventLog, SystemEvent, ApplicationEvent, AuthenticationEvent, NetworkEvent,
    ErrorLog, DatabaseErrorLog, FileSystemErrorLog, NetworkErrorLog, ApplicationErrorLog,
    DebugLog, QueryDebugLog, ApiDebugLog, ConfigDebugLog, ProcessDebugLog,
    InfoLog, SystemInfoLog, UserActivityLog, DeploymentLog, ServiceStatusLog
)

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Initialize OpenAI API client
api_key = os.getenv("OPENAI_API_KEY", "your_openai_api_key_here")
client = OpenAI(api_key=api_key)

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
# Log Analysis Function
# ---------------------------------

def analyze_log(log_record):
    """
    Analyzes a log record using OpenAI API.
    """
    prompt = PROMPTS.get(type(log_record), "Analyze this log entry and explain its significance:")
    formatted_prompt = f"{prompt}\n\nLog Details:\n{log_record.json(indent=4)}"
    
    try:
        response = client.chat.create(
            model="gpt-4",
            messages=[{"role": "user", "content": formatted_prompt}],
            max_tokens=1000,
            temperature=0.7,
        )
        explanation = response.choices[0].message.content.strip()
        logger.info("Log analysis successful.")
        return explanation

    except Exception as e:
        logger.error(f"Log analysis failed: {e}")
        return "An error occurred while analyzing the log."

# ---------------------------------
# Bulk Analysis Function
# ---------------------------------

def analyze_logs_bulk(log_records):
    """
    Analyzes multiple logs in bulk.
    """
    analyzed_logs = []
    for log in log_records:
        analysis = analyze_log(log)
        analyzed_logs.append({
            "log": log.dict(),
            "analysis": analysis
        })
    return analyzed_logs

# ---------------------------------
# Analysis Demo (For Testing)
# ---------------------------------

if __name__ == "__main__":
    from log_generator import generate_logs
    
    # Example usage
    logs = generate_logs("security", 3)
    analyzed_logs = analyze_logs_bulk(logs)
    
    for entry in analyzed_logs:
        print(f"Log Record:\n{entry['log']}\n")
        print(f"Analysis Result:\n{entry['analysis']}\n")
        print("="*80)
