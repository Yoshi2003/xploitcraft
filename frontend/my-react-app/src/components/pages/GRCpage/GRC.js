import React, { useState } from "react";
import "./GRC.css";

const ENDPOINT = "/api"; 

const GRC = () => {
  const [category, setCategory] = useState("Random");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");

  const categories = ["Regulation", "Risk Management", "Compliance", "Audit", "Governance", "Random"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setQuestionData(null);
    setSelectedOption(null);

    try {
      const response = await fetch(`${ENDPOINT}/grc/generate_question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, difficulty }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch question");
      }

      const data = await response.json();
      setQuestionData(data);
    } catch (error) {
      console.error("Error fetching question:", error);
      setFeedback("Error fetching question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index) => {
    if (!questionData) return;
    const correctIndex = questionData.correct_answer_index;

    if (index === correctIndex) {
      setFeedback(`✅ Correct! ${questionData.explanations[index.toString()]}`);
    } else {
      setFeedback(`❌ Incorrect. ${questionData.explanations[index.toString()]}`);
    }
  };

  return (
    <div className="grc-wizard-page">
      <div className="grc-wizard-container">
        <div className="grc-wizard-header">
          <h1 className="grc-title">GRC Wizard</h1>
          <p className="grc-subtitle">Choose a category and difficulty, then test your GRC knowledge.</p>
        </div>

        <div className="grc-wizard-controls">
          <div className="grc-control">
            <label className="grc-label">Category</label>
            <select
              className="grc-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grc-control">
            <label className="grc-label">Difficulty</label>
            <select
              className="grc-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficulties.map((level, idx) => (
                <option key={idx} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`grc-generate-btn ${loading ? "loading" : ""}`}
            onClick={fetchQuestion}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Question"}
          </button>
        </div>

        {questionData && (
          <div className="grc-question-container">
            <h2 className="grc-question">{questionData.question}</h2>
            <div className="grc-options">
              {questionData.options.map((option, index) => (
                <button
                  key={index}
                  className={`grc-option-btn ${selectedOption === index ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedOption(index);
                    handleAnswer(index);
                  }}
                  disabled={!!feedback}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className={`grc-feedback ${feedback.includes("Correct") ? "correct" : "incorrect"}`}>
            {feedback}
            {questionData && (
              <button
                className="copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Question: ${questionData.question}\nExplanation: ${feedback}`
                  )
                }
              >
                Copy Explanation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GRC;


