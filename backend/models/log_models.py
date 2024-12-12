from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
     id: str
     username: str
     email: str
    # Add other fields as necessary

# Add other existing models here
# Example:
# class Product(BaseModel):
#     id: str
#     name: str
#     price: float

# New Log Model
class Log(BaseModel):
    type: str
    ip: Optional[str] = None
    username: Optional[str] = None
    event: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None
    file: Optional[str] = None
    message: Optional[str] = None
    error_code: Optional[int] = None
    status: Optional[str] = None
    hostname: Optional[str] = None
    timestamp: datetime
