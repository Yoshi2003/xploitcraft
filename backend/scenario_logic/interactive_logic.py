import re
import logging
from API.AI import client
import os
from openai import OpenAI


logger = logging.getLogger(__name__)

    


def generate_interactive_questions(scenario_text):
    """
    Generate interactive questions for users based on the scenario text.
    """
    questions = []  

    
    try:
        prompt = f"Based on this scenario: {scenario_text}, generate three engaging questions that are very difficult and require critical thinking, each with there own respective multiple choice of 3, have the correct answer of each multiple have the money sign dash $- surrounding the answer text, for example, C) $-answer-$, for a user about {scenario_text} to interact with. Only output the questions and multiple choice, do not say that here are 3 questions etc etc, just output questions/multiple choice."

        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o",
            max_tokens=400,
            temperature=0.7,
        )
        
       
        content = response.choices[0].message.content.strip()  
        
        
        openai_generated_questions = content.split("\n")
        
       
        for question in openai_generated_questions:
            clean_question = question.strip("-").strip()  
            if clean_question:
                questions.append(clean_question)

    except Exception as e:
        logger.error(f"Error generating dynamic questions using OpenAI: {e}")

    return questions





