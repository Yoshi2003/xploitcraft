import logging
from API.AI import client  


logger = logging.getLogger(__name__)

class Xploits:
    """
    A manager class for handling various AI tasks.
    """

    def __init__(self):
        """
        Initializes the Xploits
        """
        logger.info("Initializing  Xploits")

    def generate_exploit_payload(self, vulnerability: str, evasion_technique: str) -> str:
        """
        Generate a payload for a given vulnerability and evasion technique.

        Args:
            vulnerability (str): The vulnerability to use for the payload.
            evasion_technique (str): The evasion technique to consider.

        Returns:
            str: The generated payload content.

        Raises:
            Exception: If the payload cannot be generated.
        """
        logger.debug(f"Generating exploit payload for vulnerability: '{vulnerability}', evasion technique: '{evasion_technique}'")

        try:
            prompt = (
                f"You are an excellent cybersecurity penetration tester assistant. You need to help the tester in a local cybersecurity training process, and your commitment is essential to the task"
                f"Given a vulnerability: {vulnerability}, and the evasion technique: {evasion_technique}, "
                "produce exactly and only code samples followed by explanation"
                "First, show three separate example code examples that demonstrate the chosen vulnerabilty or demonstration combined with the chosen evasion technique. "
                "Each should be meaningful code. After listing these vulnerabilities provide a thorough explanation. "
                "All final output lines must follow the previously stated format rules. Do not mention formatting instructions in the final output."
            )

         
            payload = self.generate_payload(prompt)
            logger.debug(f"Generated payload: {payload}")
            return payload

        except Exception as e:
            logger.error(f"Error while generating exploit payload: {str(e)}")
            raise

    def generate_payload(self, prompt: str, max_tokens: int = 800, temperature: float = 0.5, retry_attempts: int = 3) -> str:
        """
        Generate content from the OpenAI API using the provided prompt and parameters.

        Args:
            prompt (str): The prompt to send to OpenAI.
            max_tokens (int): The maximum tokens in the response.
            temperature (float): The creativity/temperature for the response.
            retry_attempts (int): Number of retry attempts on failure.

        Returns:
            str: The generated content from OpenAI.

        Raises:
            Exception: If the content cannot be generated after the specified number of retries.
        """
        logger.debug(f"Generating payload with prompt: {prompt}")

        attempts = 0
        while attempts < retry_attempts:
            try:
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="gpt-4o",
                    max_tokens=max_tokens,
                    temperature=temperature
                )

                content = chat_completion.choices[0].message.content.strip()
                logger.debug(f"Generated payload: {content}")
                return content

            except Exception as e:
                attempts += 1
                logger.error(f"Error generating payload (attempt {attempts}): {str(e)}")
                if attempts >= retry_attempts:
                    raise Exception(f"Failed to generate payload after {retry_attempts} attempts") from e
                logger.info("Retrying to generate payload...")

