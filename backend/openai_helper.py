import os
import logging
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Load OpenAI API key with error handling
def load_api_key() -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.error("OpenAI API key is missing. Please ensure it's set in the environment variables.")
        raise ValueError("OpenAI API key is required but not found.")
    return api_key

# Create an OpenAI client using the API key from the environment variable
api_key = load_api_key()
client = OpenAI(api_key=api_key)

def generate_payload(prompt: str, retry_attempts: int = 3) -> str:
    """
    Generate a payload using the OpenAI API.
    
    Args:
        prompt (str): The input prompt for OpenAI to generate a payload.
        retry_attempts (int): The number of times to retry the API call in case of a failure.
        
    Returns:
        str: The generated payload content.
    
    Raises:
        Exception: Raises an error if the payload cannot be generated.
    """
    logger.debug(f"Generating payload with prompt: {prompt}")
    
    attempts = 0
    while attempts < retry_attempts:
        try:
            # Generate a chat completion with the provided prompt
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="gpt-4o",
                max_tokens=100,
                temperature=1.0
            )

            # Extract and return the content from the response
            content = chat_completion.choices[0].message.content.strip()
            logger.debug(f"Generated payload: {content}")
            return content
        
        except Exception as e:
            attempts += 1
            logger.error(f"Error generating payload (attempt {attempts}): {str(e)}")
            if attempts >= retry_attempts:
                raise Exception(f"Failed to generate payload after {retry_attempts} attempts") from e
            logger.info("Retrying to generate payload...")


