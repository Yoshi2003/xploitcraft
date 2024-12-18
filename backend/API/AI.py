import os
import logging
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()


logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


def load_api_key() -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.error("OpenAI API key is missing. Please ensure it's set in the environment variables.")
        raise ValueError("OpenAI API key is required but not found.")
    return api_key


api_key = load_api_key()
client = OpenAI(api_key=api_key)



