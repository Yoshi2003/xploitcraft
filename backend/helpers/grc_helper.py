import os
import json
import logging
from helpers.openai_helper import client

logger = logging.getLogger(__name__)

def generate_grc_question(category, difficulty):
    """
    Generates a GRC-related multiple-choice question in JSON format.
    The model returns a JSON object with keys:
      question (string)
      options (array of 4 strings)
      correct_answer_index (int)
      explanations (dict of strings for "0","1","2","3")
      exam_tip (string)
    """

    prompt = f"""
You are an expert in GRC-related topics.

INSTRUCTIONS:
- Return ONLY valid JSON. No extra text outside the JSON.
- The JSON must have:
  "question": string
  "options": ["Option A","Option B","Option C","Option D"]
  "correct_answer_index": integer (0-based)
  "explanations": {{"0":"...","1":"...","2":"...","3":"..."}}
  "exam_tip": string

Example:
{{
  "question": "Which framework is primarily focused on cybersecurity controls?",
  "options": ["COBIT","MITRE ATT&CK","PCI-DSS","NIST CSF"],
  "correct_answer_index": 3,
  "explanations": {{
    "0": "COBIT focuses on governance rather than direct cybersecurity controls.",
    "1": "MITRE ATT&CK is a knowledge base of attacker tactics, not a governance framework.",
    "2": "PCI-DSS focuses on payment card data security, not overall cybersecurity controls.",
    "3": "NIST CSF is specifically designed to provide cybersecurity controls and outcomes."
  }},
  "exam_tip": "NIST CSF is a common reference for cybersecurity frameworks."
}}

Requirements:
- Category: {category}
- Difficulty: {difficulty}
- Make the question related to GRC (Governance, Risk, Compliance) for CompTIA-style.
- Provide detailed explanation on why each answer is wrong adn why the correct answer is correct, with an exam tip at the end.
- Return only the JSON object and nothing else.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # or "gpt-4o" if you trust that environment
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7,
        )

        content = response.choices[0].message.content.strip()
        try:
            generated_question = json.loads(content)
        except json.JSONDecodeError as e:
            logger.error("JSON parsing error in generate_grc_question: %s", e)
            logger.error("Model returned: %s", content)
            raise ValueError("Model did not return valid JSON.") from e

        logger.info("Generated GRC question successfully.")
        return generated_question

    except Exception as e:
        logger.error(f"Error generating GRC question: {str(e)}")
        raise
