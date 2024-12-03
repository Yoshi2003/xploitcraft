import os
from celery import Celery
from datetime import timedelta
from helpers.email_helper import send_email
from helpers.emailopenai_helper import generate_email_content

# Initialize Celery app
celery = Celery('tasks', broker=os.getenv('REDIS_BROKER_URL'))

@celery.task
def send_scheduled_email(email, cert_category, prompt):
    """
    Celery task to generate email content and send it at scheduled times.
    """
    try:
        # Generate email content
        email_content = generate_email_content(
            subject=f"Daily CyberBrief - {cert_category}",
            prompt=prompt
        )
        # Send the email
        send_email(recipient=email, subject=f"Daily CyberBrief - {cert_category}", body=email_content)
    except Exception as e:
        print(f"Error while sending email: {str(e)}")

def schedule_email_task(email, content, time_slot):
    """
    Function to schedule an email using Celery.
    
    Args:
        email (str): Recipient email address.
        content (str): Content of the email.
        time_slot (str): The time slot for sending the email.
    """
    # Calculate the eta for the Celery task to execute
    eta = timedelta(hours=int(time_slot))
    
    # Schedule the task using Celery
    send_scheduled_email.apply_async(
        args=[email, "Cyber Security Certification Update", content],
        eta=eta
    )

