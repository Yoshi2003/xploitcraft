import random
from faker import Faker
from datetime import datetime

fake = Faker()

# Define different log types
LOG_TYPES = {
    "security": lambda: {
        "type": "security",
        "ip": fake.ipv4(),
        "username": fake.user_name(),
        "event": random.choice(["Login attempt", "Password reset request"]),
        "status": random.choice(["success", "failure"]),
        "timestamp": datetime.utcnow(),
    },
    "event": lambda: {
        "type": "event",
        "source": fake.company(),
        "event": fake.catch_phrase(),
        "description": fake.text(),
        "timestamp": datetime.utcnow(),
    },
    "debug": lambda: {
        "type": "debug",
        "file": fake.file_name(),
        "message": fake.sentence(),
        "line_number": random.randint(1, 1000),
        "timestamp": datetime.utcnow(),
    },
    "system": lambda: {
        "type": "system",
        "hostname": fake.hostname(),
        "event": "System reboot",
        "status": "OK",
        "timestamp": datetime.utcnow(),
    },
    "error": lambda: {
        "type": "error",
        "url": fake.url(),
        "error_code": random.randint(400, 500),
        "message": fake.sentence(),
        "timestamp": datetime.utcnow(),
    },
}

# Generate a batch of logs
def generate_logs(log_type=None, count=10):
    logs = []
    for _ in range(count):
        if log_type in LOG_TYPES:
            log = LOG_TYPES[log_type]()
        else:
            log = random.choice(list(LOG_TYPES.values()))()
            log = log()  # Call the lambda function to generate the log
        logs.append(log)
    return logs

