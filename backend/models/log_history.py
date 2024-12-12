# models/log_history.py
from datetime import datetime
from pydantic import BaseModel

class LogHistory(BaseModel):
    log: dict  # Entire log structure
    analysis: str
    timestamp: datetime
