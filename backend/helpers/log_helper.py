import logging
from helpers.openai_helper import client

logger = logging.getLogger(__name__)

def explain_log(log_record):
    """
    Uses OpenAI's API to explain a log record in plain language.
    """
    prompt = f"""
You are a helpful assistant that explains logs in simple terms.
Given this log record (in JSON):

{log_record}

Explain what happened, why it might matter, and what steps to take next.
Keep it concise and clear.
"""

    try:
        response = client.chat.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7,
        )
        explanation = response.choices[0].message.content.strip()
        return explanation
    except Exception as e:
        logger.error(f"Error explaining log: {e}")
        return "An error occurred while analyzing the log."
