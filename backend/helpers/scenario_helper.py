import os
import logging
from helpers.openai_helper import client
import re
from API.AI import client

logger = logging.getLogger(__name__)



def generate_scenario(industry, attack_type, skill_level, threat_intensity):
    """
    Generate a scenario using OpenAI based on the provided inputs.
    """
    try:
        prompt = (
            f"Imagine a cybersecurity incident involving the {industry} industry. "
            f"The attack is of type '{attack_type}', performed by someone with a skill level of '{skill_level}', "
            f"and the threat intensity is rated as '{threat_intensity}' on a scale from 1-100. "
            "Provide enough details to explain context then on a new line output the text for actors then on new line output the text of potential risks then on a new line, "
            "and mitigation steps text in new line, in a detailed story-like format. "
            "Include context, actors, risks involved, and the chronological unfolding of the attack. each thing seperated by single space as paragraph"
        )

        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o",
            max_tokens=500,
            temperature=0.7,
        )

        
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Error generating scenario: {str(e)}")
        raise e

def break_down_scenario(scenario_text):
    """
    Break down the generated scenario into structured components.
    """
    components = {
        "context": extract_context(scenario_text),
        "actors": extract_actors(scenario_text),
        "risks": extract_risks(scenario_text),
        "mitigation_steps": extract_mitigation(scenario_text)
    }
    return components

def extract_context(scenario_text):
    context_match = re.search(r"(.*?)(?:The attack|The adversary|The threat)", scenario_text, re.IGNORECASE)
    return context_match.group(0).strip() if context_match else "Context not found."

def extract_actors(scenario_text):
    actors_match = re.findall(r"\b(?:threat actor|adversary|attacker|insider)\b.*?", scenario_text, re.IGNORECASE)
    return actors_match if actors_match else ["Actors not found."]

def extract_risks(scenario_text):
    risks_match = re.findall(r"(risk of .*?)(\.|;|:)", scenario_text, re.IGNORECASE)
    risks = [risk[0] for risk in risks_match]
    return risks if risks else ["Risks not found."]

def extract_mitigation(scenario_text):
    mitigation_match = re.findall(r"(mitigation step|to mitigate|response step): (.*?)(\.|;|:)", scenario_text, re.IGNORECASE)
    mitigations = [step[1] for step in mitigation_match]
    return mitigations if mitigations else ["Mitigation steps not found."]

