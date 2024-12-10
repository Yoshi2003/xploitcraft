import os
import logging
from helpers.openai_helper import client

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def generate_single_analogy(concept, category):
    """
    Generate a single analogy for the given concept and category.
    """
    prompt = (
        f"Generate an analogy for the concept '{concept}' using the context of '{category}'. "
        "Make it easy to understand, concise, and entertaining."
    )

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o",
            max_tokens=300,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Error generating single analogy: {e}")
        return "An error occurred while generating the analogy."

def generate_comparison_analogy(concept1, concept2, category):
    """
    Generate a comparison analogy between two concepts and a category.
    """
    prompt = (
        f"Compare '{concept1}' and '{concept2}' using an analogy in the context of '{category}'. "
        "Explain how they are similar and different."
    )

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o",
            max_tokens=150,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Error generating comparison analogy: {e}")
        return "An error occurred while generating the analogy."

def generate_triple_comparison_analogy(concept1, concept2, concept3, category):
    """
    Generate a comparison analogy among three concepts and a category.
    """
    prompt = (
        f"Compare '{concept1}', '{concept2}', and '{concept3}' using an analogy in the context of '{category}'. "
        "Provide a fun and simple explanation that highlights the similarities and differences."
    )

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o",
            max_tokens=200,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Error generating triple comparison analogy: {e}")
        return "An error occurred while generating the analogy."

