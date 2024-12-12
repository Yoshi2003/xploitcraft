import React, { useState } from 'react';
import './AnalogyHub.css';
import backgroundImage from './backround1.jpg'; // Importing the background image
import loadingImage from './loading2.png'; // Importing the loading image

const ENDPOINT = "/api"; 

const AnalogyHub = () => {
  const [analogyType, setAnalogyType] = useState('single');
  const [inputValues, setInputValues] = useState(['']);
  const [analogyCategory, setAnalogyCategory] = useState('real-world');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnalogy, setGeneratedAnalogy] = useState('');

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setAnalogyType(type);

    switch (type) {
      case 'comparison':
        setInputValues(['', '']);
        break;
      case 'triple':
        setInputValues(['', '', '']);
        break;
      default:
        setInputValues(['']);
    }
  };

  const handleInputChange = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  const handleGenerateClick = () => {
  setIsGenerating(true);

  // Prepare data to send to backend
  const data = {
    analogy_type: analogyType,
    category: analogyCategory,
    concept1: inputValues[0] || '',
    concept2: inputValues[1] || '',
    concept3: inputValues[2] || ''
  };

  // Make the request to backend
  fetch(`${ENDPOINT}/analogy/generate_analogy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error('Backend error:', data.error);
        setGeneratedAnalogy('An error occurred while generating the analogy.');
      } else {
        setGeneratedAnalogy(data.analogy);
      }
      setIsGenerating(false);
    })
    .catch((error) => {
      console.error('Error:', error);
      setGeneratedAnalogy('An internal error occurred. Please try again later.');
      setIsGenerating(false);
    });
};
  return (
    <div className="analogy-hub-container">
      <h1 className="analogy-hub-title">Analogy Hub</h1>
      <p className="analogy-hub-tagline">runtime-error.r00.</p>

      <div className="analogy-hub-form">
        <div className="analogy-type-section">
          <select value={analogyType} onChange={handleTypeChange} className="analogy-hub-input">
            <option value="single">Single</option>
            <option value="comparison">Comparison</option>
            <option value="triple">Triple Comparison</option>
          </select>
        </div>

        <div className="analogy-input-fields">
          {inputValues.map((value, index) => (
            <input
              key={index}
              type="text"
              className="analogy-hub-input"
              value={value}
              placeholder={`Enter concept ${index + 1}`}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="analogy-category-section">
          <select value={analogyCategory} onChange={(e) => setAnalogyCategory(e.target.value)} className="analogy-hub-input">
            <option value="real-world">Real World Analogy</option>
            <option value="video-games">Video Games</option>
            <option value="tv-show">TV Show</option>
            <option value="sports">Sports</option>
            <option value="fiction">fiction</option>
            <option value="food">Food & Cooking</option>
            <option value="relationships">Relationships</option>
            <option value="music">Music & Instruments</option>
            <option value="animals">Animals</option>
            <option value="nature">Nature & Environment</option>
            <option value="travel">Travel & Exploration</option>
            <option value="history">Historical Events</option>
            <option value="technology">Technology</option>
            <option value="mythology">Mythology</option>
            <option value="business">Business & Economics</option>
            <option value="art">Art & Creativity</option>
            <option value="school">School & Education</option>
            <option value="construction">Construction & Engineering</option>
            <option value="space">Space & Astronomy</option>
            <option value="superheroes">Superheroes & Comic Books</option>
            <option value="medieval">Medieval Times</option>
            <option value="movies">Movies & Cinema</option>
            <option value="everyday-life">Everyday Life</option>
            <option value="gardening">Gardening</option>
            <option value="mr-robot">Mr Robot</option>
          </select>
        </div>

        <div className="button-and-loader">
          <button className="analogy-generate-button" onClick={handleGenerateClick} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Analogy"}
          </button>
          {isGenerating && (
            <img
              src={loadingImage}
              alt="Loading..."
              className="loading-icon"
            />
          )}
        </div>
      </div>

      <div className="analogy-output-container">
        {generatedAnalogy && <p className="generated-analogy">{generatedAnalogy}</p>}
      </div>
    </div>
  );
};

export default AnalogyHub;


