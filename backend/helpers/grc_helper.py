import os
import json
import logging
import re  
from API.AI import client

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
You are an expert in Governance, Risk, and Compliance (GRC) topics, as well as broad information security governance and frameworks 
found in certifications like CISSP, CompTIA Advanced Security Practitioner (CASP+), CISM, CRISC, and others. Your role is to generate 
a multiple-choice question (MCQ) that is both challenging and realistic.

CONTEXT: The user has selected:
- Category: {category} (e.g., 'Regulation', 'Risk Management', 'Compliance', 'Audit', 'Governance', 'Random')
- Difficulty: {difficulty} (e.g., 'Easy', 'Medium', 'Hard')

REQUIREMENTS FOR QUESTION:
1. The question should be related to GRC topics and may cover not just frameworks but also:
   - Governance aspects: Strategic Alignment, Policy Development, Stakeholder Engagement, Board Oversight, 
     Setting Security Objectives, Measuring Governance Maturity, Mergers & Acquisitions security considerations, 
     Ethical decision-making in security leadership, Communication strategies for reporting to executive management,
     Cybersecurity strategy integration with business goals, Executive-level reporting on security investments and ROI,
     Using maturity models (CMMI) for governance improvement, Handling organizational changes post-intrusion,
     Legal advisory board integration, Conflicts of interest in governance roles, Cultural alignment for security awareness.
   - Compliance domains: Privacy laws (GDPR, CCPA), sector-specific regulations (HIPAA for healthcare, GLBA for financial services), 
     Payment card standards (PCI-DSS), U.S. federal mandates (FISMA), NIST 800-53 controls, SOX requirements, data sovereignty laws, 
     emerging regulations (AI governance principles), industry-standard certifications (ISO 27001), 
     International Data Transfer frameworks (Schrems II considerations), Safe Harbor agreements, AML (Anti-Money Laundering) and KYC (Know Your Customer) guidelines,
     Cross-border data transfer restrictions, Localization laws for critical data, Compliance mapping across multiple jurisdictions,
     Code of conduct enforcement, Anti-bribery and corruption laws (FCPA, UK Bribery Act), Biometric data handling regulations.
   - Risk management methodologies: ISO 31000, NIST RMF, FAIR model for quantitative risk analysis, OCTAVE for operational risk,
     integrating risk registers, performing Business Impact Analysis (BIA), differentiating between inherent and residual risk,
     periodic risk evaluations, continuous monitoring, ties to enterprise risk management (ERM), risk aggregation techniques, 
     scenario analysis for strategic risk, cyber insurance considerations,
     Risk appetite statements and their influence on control decisions, Risk quantification models, Threat intelligence-driven risk adjustments,
     Use of KRI/KPIs in risk oversight, Downstream dependency analysis, Evaluating risk velocity and persistence.
   - Security governance components: Incident Response Frameworks, Disaster Recovery and Business Continuity Planning, 
     Vendor/Third-Party Risk Management, Supply Chain Security, Asset Management, Data Governance (classification, handling), 
     Security Operations (Logging, Monitoring, SIEM, SOAR), Secure Software Development Life Cycle (SSDLC), 
     Insider Threat Management, Change Management processes, Secure Cloud Governance models, threat intelligence integration,
     Secure configuration baselines and hardening guides, Patch management strategies, Secure DevOps integration,
     Privileged Access Management (PAM), Micro-segmentation strategies, Ethical hacking programs and bug bounty initiatives,
     Implementing honeypots for threat detection, Integration of AI-driven anomaly detection tools.
   - Managerial and Security Control Frameworks: COBIT for IT Governance, ISO 38500 for IT Governance principles, ITIL for Service Management,
     TOGAF for enterprise architecture, Zero Trust Architecture principles, Access Control models (RBAC, ABAC, MAC, DAC), 
     Cloud Security Governance (CSA CCM), Penetration Testing Methodologies, Vulnerability Management lifecycles, 
     Security Assessments (internal audits, external audits, compliance checks), Digital Ethics frameworks, 
     Data Ethics Frameworks, Security Program Development and continuous improvement strategies,
     Tailored assurance reports (SOC 2, SOC 3), Integrating ITIL change management with security reviews, 
     Aligning COBIT objectives with business processes, Using Gap assessments to drive continuous improvement, 
     Mapping security controls to business objectives, Leveraging Enterprise Architecture (EA) to support compliance, 
     Evaluating Zero Trust adoption barriers, Implementing credentialless authentication mechanisms, SASE frameworks,
     Adaptive Access Control strategies, Fine-grained attribute-based policies for least privilege.

   Do not limit all questions to just frameworks or these topics or factual questions, aslo provide conceptual questions and ethical dilemma questiosn relating to these topics, such as e.g What should you do in this situation...... e.g Whats the BEST way to mitigate this risk. e.g. etc etc. ; incorporate this broader range of topics. If the category is "Random," 
   feel free to combine elements from governance, compliance, risk management, incident handling, operational security, data protection, 
   and more, ensuring variety and complexity.

2. Difficulty:
   - "Easy" should still require conceptual understanding (e.g., understanding what GDPR focuses on or how ISO 27001 differs from a simple best-practice guide).
   - "Medium" and "Hard" can involve subtle distinctions, comparing and contrasting frameworks, regulations, or methodologies, or focusing on specific control differences, more nuanced risk treatments, or scenario-based questions that require deeper thought.

3. Four options (A, B, C, D) total, one correct answer. The incorrect options should be very plausible but not correct, requiring the test-taker to carefully differentiate.

4. Explanations:
   - For the correct answer: Provide multiple sentences detailing exactly why it’s correct, clearly tying it back to the question’s scenario or concept. Show how it fulfills the requirements asked in the question as well as why the other answer choices are incorrect/not the correct answer..
   - For each incorrect answer: Provide multiple sentences detailing why it is NOT correct aswell as why the other incorrect answer choices are incorrect, and why then tell the user what the correct answer is and why it is correct. 
     Do not just say it’s incorrect; fully explain what that framework/control/standard/principle primarily addresses and why it falls short. 
     Highlight conceptual differences, limitations, or focus areas that differ from the question’s criteria.
   - All explanations should be in-depth and more than just naming what something is—explain conceptually why it aligns or does not align with the question’s key point.
   - Regardless of user choice, the generated output must contain full explanations for all answer choices provided. The explanations are produced in advance as part of the JSON object. Each explanation should be at least 3 sentences, rich in detail and conceptual clarity.

5. Include an "exam_tip" field that provides a short, memorable takeaway or mnemonic to help differentiate the correct concept from the others. The exam tip should help the user recall why the correct answer stands out.

6. Return ONLY a JSON object with the fields:
   "question", "options", "correct_answer_index", "explanations", and "exam_tip"
   No extra text, no Markdown, no commentary outside the JSON.

8. For each explanation (correct and incorrect):
   - At minimum of 3 sentences for the correct answer.
   - if the user gets the answer correct provide minium 3 senetence answer as to why it is correct, but also why the other answer choices listed are not the correct answer.
   - Substantial detail.
   - Clearly articulate conceptual reasons, not just factual statements.

EXAMPLE FORMAT (this is not real content, just structure, make sure to use all topics not just the topic provided in this example):
{{
  "question": "The question",
  "options": ["Option A","Option B","Option C","Option D"],
  "correct_answer_index": C,
  "explanations": {{
    "A": "Explain thoroughly why option A fails. Mention its scope, focus areas, and why that doesn't meet the question criteria and then explain what the correct answer is and why it is correct aswell as why the other answer choices are incorrect.",
    "B": "Explain thoroughly why option B fails. Mention its scope, focus areas, and why that doesn't meet the question criteria and then explain what the correct answer is and why it is correct aswell as why the other answer choices are incorrect.",
    "C": "Explain thoroughly why option C is correct, linking its characteristics to the question scenario and why the other answer choices are incorrect",
    "D": "Explain thoroughly why option D fails. Mention its scope, focus areas, and why that doesn't meet the question criteria and then explain what the correct answer is and why it is correct aswell as why the other answer choices are incorrect."
  }},
  "exam_tip": "A short, memorable hint or mnemonic that differentiates the correct approach from others."
}}

Now generate the JSON object following these instructions.
"""



    try:
        response = client.chat.completions.create(
            model="gpt-4",  
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.6,
        )

        content = response.choices[0].message.content.strip()

        # Remove code fences if present
        content = re.sub(r'^```.*\n', '', content)
        content = re.sub(r'\n```$', '', content)

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
