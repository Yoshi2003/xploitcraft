from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# -------------------------------
# General Log Model
# -------------------------------

class Log(BaseModel):
    type: str
    source: str
    event: str
    message: str
    severity: str = Field(..., description="Severity level of the log (e.g., critical, high, medium, low, info, debug)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of the log creation")


# -------------------------------
# Security Logs
# -------------------------------

class SecurityLog(Log):
    ip_address: Optional[str] = Field(None, description="IP address associated with the log")
    username: Optional[str] = Field(None, description="Username associated with the log")
    attack_vector: Optional[str] = Field(None, description="Attack vector involved")
    status: Optional[str] = Field(None, description="Status of the action (e.g., Successful, Failed)")


class FirewallLog(SecurityLog):
    source_ip: str = Field(..., description="Source IP address")
    destination_ip: str = Field(..., description="Destination IP address")
    action: str = Field(..., description="Action taken (Allowed, Blocked)")
    protocol: str = Field(..., description="Protocol used (TCP, UDP, ICMP)")
    port: int = Field(..., ge=1, le=65535, description="Port number")


class VulnerabilityLog(SecurityLog):
    tool: str = Field(..., description="Tool used for scanning (e.g., Burp Suite, Nessus, Qualys)")
    vulnerability_name: str = Field(..., description="Name of the vulnerability found")
    cve_id: Optional[str] = Field(None, description="CVE identifier if applicable")


class IntrusionLog(SecurityLog):
    detection_system: str = Field(..., description="Detection system used (e.g., Snort, Suricata)")
    intrusion_method: str = Field(..., description="Method of intrusion (Exploit, Privilege Escalation)")
    risk_level: str = Field(..., description="Risk level (Low, Medium, High, Critical)")


class AccessControlLog(SecurityLog):
    access_type: str = Field(..., description="Type of access (Granted, Denied)")
    resource: str = Field(..., description="Resource being accessed")
    access_reason: str = Field(..., description="Reason for access denial or granting")


# -------------------------------
# Event Logs
# -------------------------------

class EventLog(Log):
    system_component: str = Field(..., description="Component of the system")
    action_performed: str = Field(..., description="Action performed")
    result: str = Field(..., description="Result of the action")


class SystemEvent(EventLog):
    os_version: str = Field(..., description="Operating system version")
    kernel_version: Optional[str] = Field(None, description="Kernel version")
    hardware_id: str = Field(..., description="Hardware identifier")


class ApplicationEvent(EventLog):
    application_name: str = Field(..., description="Name of the application")
    version: str = Field(..., description="Version of the application")
    action_details: str = Field(..., description="Details of the action performed")


class AuthenticationEvent(EventLog):
    auth_method: str = Field(..., description="Authentication method used (e.g., OAuth, SAML, LDAP)")
    auth_status: str = Field(..., description="Authentication status (Success, Failure)")
    user_role: Optional[str] = Field(None, description="Role of the user (e.g., Admin, User, Guest)")


class NetworkEvent(EventLog):
    src_ip: str = Field(..., description="Source IP address")
    dest_ip: str = Field(..., description="Destination IP address")
    protocol: str = Field(..., description="Protocol used (TCP, UDP, ICMP)")
    action_taken: str = Field(..., description="Action taken (Monitored, Blocked)")


# -------------------------------
# Error Logs
# -------------------------------

class ErrorLog(Log):
    error_code: str = Field(..., description="Error code associated with the log")
    error_message: str = Field(..., description="Detailed error message")
    module: Optional[str] = Field(None, description="Module where the error occurred")


class DatabaseErrorLog(ErrorLog):
    query: str = Field(..., description="Database query that failed")
    database_name: str = Field(..., description="Name of the database")
    db_engine: str = Field(..., description="Database engine used (e.g., PostgreSQL, MySQL)")


class FileSystemErrorLog(ErrorLog):
    file_path: str = Field(..., description="Path of the file involved in the error")
    file_operation: str = Field(..., description="Operation attempted on the file (Read, Write, Delete)")
    error_details: str = Field(..., description="Detailed information about the error")


class NetworkErrorLog(ErrorLog):
    interface: str = Field(..., description="Network interface involved")
    error_cause: str = Field(..., description="Cause of the network error")
    affected_service: str = Field(..., description="Service affected by the network error")


class ApplicationErrorLog(ErrorLog):
    app_name: str = Field(..., description="Name of the application")
    version: str = Field(..., description="Version of the application")
    crash_report: Optional[str] = Field(None, description="Crash report details if available")


# -------------------------------
# Debug Logs
# -------------------------------

class DebugLog(Log):
    debug_message: str = Field(..., description="Debugging message")
    module_name: str = Field(..., description="Module name where the debug occurred")


class QueryDebugLog(DebugLog):
    sql_query: str = Field(..., description="SQL query executed")
    execution_time: float = Field(..., ge=0.0, description="Execution time in milliseconds")


class ApiDebugLog(DebugLog):
    api_endpoint: str = Field(..., description="API endpoint accessed")
    http_method: str = Field(..., description="HTTP method used (GET, POST, PUT, DELETE)")
    response_time: float = Field(..., ge=0.0, description="Response time in milliseconds")


class ConfigDebugLog(DebugLog):
    config_file: str = Field(..., description="Configuration file path")
    settings_applied: List[str] = Field(..., description="List of settings applied")


class ProcessDebugLog(DebugLog):
    process_id: int = Field(..., ge=1, description="Process ID")
    process_name: str = Field(..., description="Name of the process")
    execution_status: str = Field(..., description="Execution status of the process")


# -------------------------------
# Info Logs
# -------------------------------

class InfoLog(Log):
    summary: str = Field(..., description="Summary of the log")
    details: str = Field(..., description="Detailed information about the log")


class SystemInfoLog(InfoLog):
    os_version: str = Field(..., description="Operating system version")
    uptime: str = Field(..., description="System uptime duration")
    resource_usage: str = Field(..., description="Resource usage statistics")


class UserActivityLog(InfoLog):
    user_id: str = Field(..., description="Unique identifier of the user")
    activity_type: str = Field(..., description="Type of activity (e.g., Login, Logout)")
    activity_details: str = Field(..., description="Detailed description of the activity")


class DeploymentLog(InfoLog):
    environment: str = Field(..., description="Deployment environment (e.g., Production, Staging)")
    deployment_status: str = Field(..., description="Status of the deployment (Success, Failure)")
    release_version: str = Field(..., description="Version of the release deployed")


class ServiceStatusLog(InfoLog):
    service_name: str = Field(..., description="Name of the service")
    status: str = Field(..., description="Current status of the service (Operational, Down)")
    last_checked: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the service was last checked")


# -------------------------------
# Log Response Model
# -------------------------------

class LogResponse(BaseModel):
    logs: List[Log] = Field(..., description="List of generated logs")
    count: int = Field(..., description="Total number of logs generated")

