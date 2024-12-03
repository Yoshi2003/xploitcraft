from pymongo import MongoClient
import os

# Load MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")

# Create MongoDB client
client = MongoClient(MONGO_URI)
db = client['xploitcraft']
subscriptions_collection = db['user_subscriptions']

def add_subscription(email, cert_category, frequency, time_slots):
    """
    Add a subscription to the database.
    """
    subscription_data = {
        "email": email,
        "cert_category": cert_category,
        "frequency": frequency,
        "time_slots": time_slots
    }
    subscriptions_collection.insert_one(subscription_data)

def remove_subscription(email):
    """
    Remove a subscription from the database by email.
    """
    subscriptions_collection.delete_one({"email": email})

def find_subscription(email):
    """
    Find a subscription by email.
    """
    return subscriptions_collection.find_one({"email": email})

def update_subscription(email, updated_data):
    """
    Update a subscription in the database.
    """
    subscriptions_collection.update_one(
        {"email": email},
        {"$set": updated_data}
    )

