import React, { useState } from 'react';
import './ScenarioSphere.css';

// Define the endpoint for API requests
const ENDPOINT = "/api";

const ScenarioSphere = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [industry, setIndustry] = useState("Finance");
  const [attackType, setAttackType] = useState("");
  const [skillLevel, setSkillLevel] = useState("Script Kiddie");
  const [threatIntensity, setThreatIntensity] = useState(50);
  const [generatedScenario, setGeneratedScenario] = useState("");
  const [interactiveQuestions, setInteractiveQuestions] = useState([]);

  const handleGenerateClick = () => {
    setIsGenerating(true);

    const data = {
      industry,
      attack_type: attackType,
      skill_level: skillLevel,
      threat_intensity: threatIntensity,
    };

    fetch(`${ENDPOINT}/scenario/generate_scenario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setGeneratedScenario(data.scenario);
        setInteractiveQuestions(data.interactive_questions || []);
        setIsGenerating(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsGenerating(false);
      });
  };

  const formatQuestions = (questions) => {
    return questions.map((question, index) => {
      if (question.includes('$-')) {
        return ( 
          <li key={index} style={{ color: '#00ffcc', fontWeight: 'bold' }}>
            {question.replace('$-', '')}
          </li>
        );
      } else {
        return <li key={index}>{question}</li>;
      }
    });
  };

  return (
    <div className="scenario-body">
      <div className="scenario-container">
        <div className="scenario-input-section">
          <h1 className="scenario-title">Scenario Sphere</h1>
          <p className="scenario-tagline">Step into the real world of cyber defense...</p>

          <div className="scenario-input-wrapper">
            <label>Industry</label>
            <select 
              className="scenario-input-field scenario-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
              <option value="Technology">Technology</option>
              <option value="Energy">Energy</option>
              <option value="Education">Education</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Pharmaceutical">Pharmaceutical</option>
              <option value="Transportation">Transportation</option>
              <option value="Cybersecurity Company">Cybersecurity Company</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="CYBERPUNK2077">CYBERPUNK2077</option>
            </select>
          </div>

          <div className="scenario-input-wrapper">
            <label>Type of Attack</label>
            <input
              type="text"
              className="scenario-input-field scenario-attack-type"
              placeholder="Enter Attack Type"
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
            />
          </div>

          <div className="scenario-input-wrapper">
            <label>Skill Level</label>
            <select
              className="scenario-input-field scenario-skill-level"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="Script Kiddie">Script Kiddie</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="APT">APT</option>
            </select>
          </div>

          <div className="scenario-input-wrapper">
            <label>Threat Intensity</label>
            <input
              type="range"
              min="1"
              max="100"
              className="scenario-input-slider"
              value={threatIntensity}
              onChange={(e) => setThreatIntensity(e.target.value)}
            />
          </div>

          <div className="button-and-sphere">
            <button
              className="scenario-generate-button"
              onClick={handleGenerateClick}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Scenario"}
            </button>
            {isGenerating && (
              <div className="loading-sphere">
                <div className="sphere"></div>
              </div>
            )}
          </div>
        </div>

        <div className="scenario-output-container">
          {generatedScenario && (
            <>
              <h2 className="scenario-output-title">Generated Scenario</h2>
              <div className="scenario-output-box">{generatedScenario}</div>
            </>
          )}
          {!generatedScenario && (
            <div className="scenario-output-box">
              hidden-pr0cess.axx
            </div>
          )}

          {interactiveQuestions && interactiveQuestions.length > 0 && (
            <div className="interactive-questions">
              <h3>Interactive Questions (highlighted text is the correct answer..)</h3>
              <ul>
                {formatQuestions(interactiveQuestions)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSphere;


