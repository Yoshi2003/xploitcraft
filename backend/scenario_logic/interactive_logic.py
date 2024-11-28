import re
import logging
from helpers.openai_helper import client
import os
from openai import OpenAI


logger = logging.getLogger(__name__)

    # Use OpenAI API to generate dynamic questions


def generate_interactive_questions(scenario_text):
    """
    Generate interactive questions for users based on the scenario text.
    """
    questions = []  # Corrected variable name

    # Use OpenAI API to generate dynamic questions
    try:
        prompt = f"Based on this scenario: {scenario_text}, generate three engaging questions that are very difficult and require critical thinking, each with there own respective multiple choice of 3, have the correct answer of each multiple have the money sign dash $- surrounding the answer text, for example, C) $-answer-$, for a user about {scenario_text} to interact with. Only output the questions and multiple choice, do not say that here are 3 questions etc etc, just output questions/multiple choice."

        # Correctly format the request to OpenAI
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o",
            max_tokens=400,
            temperature=0.7,
        )
        
        # Accessing the content correctly
        content = response.choices[0].message.content.strip()  # Fix here
        
        # Split the content into multiple questions if needed
        openai_generated_questions = content.split("\n")
        
        # Adding OpenAI-generated questions to the list after cleaning
        for question in openai_generated_questions:
            clean_question = question.strip("-").strip()  # Remove any leading dashes or extra spaces
            if clean_question:
                questions.append(clean_question)

    except Exception as e:
        logger.error(f"Error generating dynamic questions using OpenAI: {e}")

    return questions





