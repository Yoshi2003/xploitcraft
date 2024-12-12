from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# General Log Model
class Log(BaseModel):
    type: str
    source: str
    event: str
    message: str
    severity: Optional[str] = "info"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# -------------------------------
# Security Logs
# -------------------------------

class SecurityLog(Log):
    ip_address: Optional[str]
    username: Optional[str]
    attack_vector: Optional[str]
    status: Optional[str]

class FirewallLog(SecurityLog):
    source_ip: str
    destination_ip: str
    action: str  # Allowed, Blocked
    protocol: str
    port: int

class VulnerabilityLog(SecurityLog):
    tool: str  # e.g., Burp Suite, Nessus
    vulnerability_name: str
    severity_level: str  # Critical, High, Medium, Low
    cve_id: Optional[str]  # CVE reference if applicable

class IntrusionLog(SecurityLog):
    detection_system: str  # e.g., IDS/IPS
    intrusion_method: str
    risk_level: str  # Low, Medium, High, Critical

class AccessControlLog(SecurityLog):
    access_type: str  # Granted, Denied
    resource: str
    access_reason: str

# -------------------------------
# Event Logs
# -------------------------------

class EventLog(Log):
    system_component: str
    action_performed: str
    result: str

class SystemEvent(EventLog):
    os_version: str
    kernel_version: Optional[str]
    hardware_id: str

class ApplicationEvent(EventLog):
    application_name: str
    version: str
    action_details: str

class AuthenticationEvent(EventLog):
    auth_method: str  # e.g., OAuth, SAML
    auth_status: str  # Success, Failure
    user_role: Optional[str]

class NetworkEvent(EventLog):
    src_ip: str
    dest_ip: str
    protocol: str
    action_taken: str

# -------------------------------
# Error Logs
# -------------------------------

class ErrorLog(Log):
    error_code: str
    error_message: str
    module: Optional[str]

class DatabaseErrorLog(ErrorLog):
    query: str
    database_name: str
    db_engine: str  # e.g., PostgreSQL, MySQL

class FileSystemErrorLog(ErrorLog):
    file_path: str
    file_operation: str  # e.g., Read, Write, Delete
    error_details: str

class NetworkErrorLog(ErrorLog):
    interface: str
    error_cause: str
    affected_service: str

class ApplicationErrorLog(ErrorLog):
    app_name: str
    version: str
    crash_report: Optional[str]

# -------------------------------
# Debug Logs
# -------------------------------

class DebugLog(Log):
    debug_message: str
    module_name: str

class QueryDebugLog(DebugLog):
    sql_query: str
    execution_time: float

class ApiDebugLog(DebugLog):
    api_endpoint: str
    http_method: str
    response_time: float

class ConfigDebugLog(DebugLog):
    config_file: str
    settings_applied: List[str]

class ProcessDebugLog(DebugLog):
    process_id: int
    process_name: str
    execution_status: str

# -------------------------------
# Info Logs
# -------------------------------

class InfoLog(Log):
    summary: str
    details: str

class SystemInfoLog(InfoLog):
    os_version: str
    uptime: str
    resource_usage: str

class UserActivityLog(InfoLog):
    user_id: str
    activity_type: str
    activity_details: str

class DeploymentLog(InfoLog):
    environment: str
    deployment_status: str
    release_version: str

class ServiceStatusLog(InfoLog):
    service_name: str
    status: str
    last_checked: datetime

# -------------------------------
# Log Response Model
# -------------------------------

class LogResponse(BaseModel):
    logs: List[Log]
    count: int

