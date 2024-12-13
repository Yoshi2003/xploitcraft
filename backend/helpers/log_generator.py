import random
from faker import Faker
from datetime import datetime
from typing import List, Union
from models.log_models import (
    SecurityLog, FirewallLog, VulnerabilityLog, IntrusionLog, AccessControlLog,
    EventLog, SystemEvent, ApplicationEvent, AuthenticationEvent, NetworkEvent,
    ErrorLog, DatabaseErrorLog, FileSystemErrorLog, NetworkErrorLog, ApplicationErrorLog,
    DebugLog, QueryDebugLog, ApiDebugLog, ConfigDebugLog, ProcessDebugLog,
    InfoLog, SystemInfoLog, UserActivityLog, DeploymentLog, ServiceStatusLog
)

fake = Faker()

# -------------------------------
# Security Logs Generators
# -------------------------------

def generate_security_logs(count: int) -> List[Union[SecurityLog]]:
    logs = []
    for _ in range(count):
        logs.extend([
            FirewallLog(
                type="security",
                source="Firewall",
                event="Traffic Control",
                message=f"Blocked traffic from {fake.ipv4()} to {fake.ipv4()}",
                severity=random.choice(["critical", "high", "medium", "low"]),
                source_ip=fake.ipv4(),
                destination_ip=fake.ipv4(),
                action=random.choice(["Allowed", "Blocked"]),
                protocol=random.choice(["TCP", "UDP", "ICMP"]),
                port=random.randint(1, 65535),
                ip_address=fake.ipv4(),
                username=fake.user_name(),
                attack_vector=random.choice(["Brute-force", "Phishing", "SQL Injection"]),
                status=random.choice(["Successful", "Failed"]),
            ),
            VulnerabilityLog(
                type="security",
                source="Vulnerability Scanner",
                event="Scan Result",
                message=f"{fake.catch_phrase()} found on {fake.hostname()}",
                severity_level=random.choice(["critical", "high", "medium", "low"]),
                tool=random.choice(["Burp Suite", "Nessus", "Qualys"]),
                vulnerability_name=fake.catch_phrase(),
                cve_id=f"CVE-{random.randint(1999, 2024)}-{random.randint(1000, 9999)}",
                ip_address=fake.ipv4(),  # Added Missing Fields
                username=fake.user_name(),
                attack_vector=random.choice(["Brute-force", "Phishing", "SQL Injection"]),
                status=random.choice(["Successful", "Failed"]),
            ),
            IntrusionLog(
                type="security",
                source="IDS",
                event="Unauthorized Access Attempt",
                message=f"Detected malicious access attempt from {fake.ipv4()}",
                detection_system="Snort",
                intrusion_method=random.choice(["Brute-force", "Phishing", "SQL Injection"]),
                risk_level=random.choice(["Low", "Medium", "High", "Critical"]),
            ),
            AccessControlLog(
                type="security",
                source="Access Control",
                event="Access Denied",
                message=f"Access denied to {fake.user_name()} for {fake.file_path()}",
                access_type="Denied",
                resource=fake.file_path(),
                access_reason=random.choice(["Unauthorized user", "Incorrect credentials"]),
            ),
        ])
    return logs

# -------------------------------
# Event Logs Generators
# -------------------------------

def generate_event_logs(count: int) -> List[EventLog]:
    logs = []
    for _ in range(count):
        logs.extend([
            SystemEvent(
                type="event",
                source="System Monitor",
                event="System Reboot",
                message=f"System rebooted at {datetime.utcnow()}",
                os_version=fake.windows_platform_token(),
                hardware_id=fake.uuid4(),
                system_component=fake.bs(),
                action_performed="System Rebooted",
                result="Success",
                kernel_version=fake.mac_platform_token(),
            ),
            ApplicationEvent(
                type="event",
                source="AppManager",
                event="App Crash",
                message=f"{fake.company()} application crashed.",
                application_name=fake.company(),
                version=fake.numerify("#.#.#"),
                action_details=fake.sentence(),
                system_component=fake.bs(),  # Fixed Missing Fields
                action_performed="Application Terminated",
                result="Failure",
            ),
            AuthenticationEvent(
                type="event",
                source="AuthService",
                event="Login Attempt",
                message=f"User {fake.user_name()} attempted to login.",
                auth_method=random.choice(["OAuth", "SAML", "LDAP"]),
                auth_status=random.choice(["Success", "Failure"]),
                user_role=random.choice(["Admin", "User", "Moderator"]),
            ),
            NetworkEvent(
                type="event",
                source="Network Manager",
                event="Network Alert",
                message=f"Traffic anomaly detected between {fake.ipv4()} and {fake.ipv4()}",
                src_ip=fake.ipv4(),
                dest_ip=fake.ipv4(),
                protocol=random.choice(["TCP", "UDP", "ICMP"]),
                action_taken=random.choice(["Monitored", "Blocked"]),
            ),
        ])
    return logs

# -------------------------------
# Error Logs Generators
# -------------------------------

def generate_error_logs(count: int) -> List[ErrorLog]:
    logs = []
    for _ in range(count):
        logs.extend([
            DatabaseErrorLog(
                type="error",
                source="Database",
                event="Query Failure",
                message="Database query failed during operation.",
                error_message="Query could not execute due to missing field.",
                module="Query Executor",
                error_code=f"DB-{random.randint(1000, 9999)}",
                database_name=fake.company(),
                db_engine=random.choice(["PostgreSQL", "MySQL", "MongoDB"]),
                query="SELECT * FROM users WHERE active=1",
            ),
            FileSystemErrorLog(
                type="error",
                source="FileSystem",
                event="File Not Found",
                message=f"File {fake.file_path()} not found.",
                file_path=fake.file_path(),
                file_operation=random.choice(["Read", "Write", "Delete"]),
                error_code=f"FS-{random.randint(1000, 9999)}",  # Corrected Missing Field
                error_message="File access error occurred.",  # Corrected Missing Field
                module="File Manager",  # Corrected Missing Field
            ),
            NetworkErrorLog(
                type="error",
                source="Network Interface",
                event="Connection Timeout",
                message=f"Network interface {fake.word()} experienced timeout.",
                interface=f"eth{random.randint(0, 3)}",
                affected_service=fake.word(),
                error_cause="Connection Timeout",
            ),
            ApplicationErrorLog(
                type="error",
                source="AppService",
                event="Service Failure",
                message=f"{fake.company()} app service crashed unexpectedly.",
                app_name=fake.company(),
                version=fake.numerify("#.#.#"),
                crash_report=fake.text(),
            ),
        ])
    return logs


# -------------------------------
# Debug Logs Generators
# -------------------------------

def generate_debug_logs(count: int) -> List[DebugLog]:
    logs = []
    for _ in range(count):
        logs.extend([
            QueryDebugLog(
                type="debug",
                source="Query Executor",
                event="Query Execution",
                message="SQL query executed successfully.",
                debug_message="Execution time: 23ms",
                module_name="DatabaseManager",
                sql_query="SELECT * FROM products WHERE active=True",
                execution_time=random.uniform(10.0, 50.0),
            ),
            ApiDebugLog(
                type="debug",
                source="API Gateway",
                event="API Request",
                message=f"API request to {fake.uri()}",
                debug_message=f"Response time: {random.uniform(100.0, 500.0)}ms",
                module_name="APIService",
                api_endpoint=fake.uri(),
                http_method=random.choice(["GET", "POST", "PUT", "DELETE"]),
                response_time=random.uniform(100.0, 500.0),
            ),
            ConfigDebugLog(
                type="debug",
                source="Config Manager",
                event="Config Update",
                message="Configuration file updated.",
                debug_message="Settings applied successfully.",
                module_name="SystemConfigurator",
                config_file=fake.file_path(),
                settings_applied=[fake.word() for _ in range(3)],
            ),
            ProcessDebugLog(
                type="debug",
                source="Process Manager",
                event="Process Monitoring",
                message=f"Process {fake.word()} running smoothly.",
                debug_message="Execution status: Running",
                module_name="ProcessMonitor",
                process_id=random.randint(1000, 9999),
                process_name=fake.word(),
                execution_status="Running",
            ),
        ])
    return logs

# -------------------------------
# Info Logs Generators
# -------------------------------

def generate_info_logs(count: int) -> List[InfoLog]:
    logs = []
    for _ in range(count):
        logs.extend([
            SystemInfoLog(
                type="info",
                source="System Monitor",
                event="System Check",
                message="System operational with optimal performance.",
                summary="System check completed.",
                details="Uptime: 48 hours | Memory usage: 65%",
                os_version=fake.windows_platform_token(),
                uptime=f"{random.randint(1, 72)} hours",
                resource_usage=f"CPU: {random.randint(10, 90)}% | RAM: {random.randint(20, 80)}%",
            ),
            UserActivityLog(
                type="info",
                source="Activity Tracker",
                event="User Login",
                message=f"User {fake.user_name()} logged in successfully.",
                summary="User Activity Detected",
                details=f"User performed {random.randint(1, 10)} actions.",
                user_id=fake.uuid4(),
                activity_type="Login",
                activity_details=f"{fake.word()} action performed successfully.",
            ),
            DeploymentLog(
                type="info",
                source="Deployment Manager",
                event="Deployment Successful",
                message="New deployment completed successfully.",
                summary="Deployment Process Completed",
                details="Version 2.3.4 deployed to production.",
                environment="Production",
                deployment_status="Success",
                release_version=f"{random.randint(1, 9)}.{random.randint(0, 9)}.{random.randint(0, 9)}",
            ),
            ServiceStatusLog(
                type="info",
                source="Service Monitor",
                event="Service Running",
                message=f"Service {fake.word()} is running normally.",
                summary="Service Health Check Passed",
                details="No issues detected.",
                service_name=fake.word(),
                status="Operational",
                last_checked=datetime.utcnow(),
            ),
        ])
    return logs

# -------------------------------
# Main Log Generator
# -------------------------------

def generate_logs(category: str, count: int):
    generators = {
        "security": generate_security_logs,
        "event": generate_event_logs,
        "error": generate_error_logs,
        "debug": generate_debug_logs,
        "info": generate_info_logs,
    }
    return generators.get(category, lambda x: [])(count)
