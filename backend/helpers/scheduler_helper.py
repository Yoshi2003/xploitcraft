# scheduler_helper.py: Handles scheduling tasks for Daily CyberBrief

from celery import Celery
from helpers.emailopenai_helper import generate_daily_email
from helpers.email_helper import send_email
import os
import time

# Initialize Celery with a Redis broker
celery_broker = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
app = Celery('tasks', broker=celery_broker)

@app.task
def schedule_email_task(subscription_id, email, topic):
    try:
        # Generate the content using OpenAI
        content = generate_daily_content(topic)
        subject = f"Your Daily CyberBrief on {topic}"

        # Send the email
        email_sent = send_email(email, subject, content)

        if email_sent:
            print(f"Email sent successfully to {email}")
        else:
            print(f"Failed to send email to {email}")
    except Exception as e:
        print(f"Error in scheduling task: {str(e)}")
