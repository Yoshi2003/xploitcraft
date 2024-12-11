import React, { useState, useEffect } from 'react';
import './DailyCyberBrief.css';

const ENDPOINT = "/api";

const DailyCyberBrief = () => {
  const [email, setEmail] = useState('');
  const [certCategory, setCertCategory] = useState('CompTIA A+');
  const [frequency, setFrequency] = useState(1);
  const [timeSlots, setTimeSlots] = useState(['']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleFrequencyChange = (e) => {
    const value = parseInt(e.target.value);
    setFrequency(value);
    setTimeSlots(new Array(value).fill(''));
  };

  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = value;
    setTimeSlots(newTimeSlots);
  };

  // Generic function to manage API calls
  const handleApiRequest = async (url, data, successMessage) => {
    setLoading(true);
    setLoadingProgress(0);
    try {
      // Simulate loading progress
      const loadingInterval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress < 9) {
            return prevProgress + 10; // Gradually increase the loading bar to 90%
          } else {
            clearInterval(loadingInterval);
            return prevProgress;
          }
        });
      }, 200);

      const response = await fetch(`${ENDPOINT}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage(successMessage);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setLoadingProgress(100); // Set to 100% on completion
    }
  };

  const handleSubscribe = () => {
    const data = {
      email,
      cert_category: certCategory,
      frequency,
      time_slots: timeSlots
    };
    handleApiRequest('/subscribe/', data, 'Subscription successful!');
  };

  const handleUpdate = () => {
    const data = {
      email,
      cert_category: certCategory,
      frequency,
      time_slots: timeSlots
    };
    handleApiRequest('/update/', data, 'Subscription updated successfully!');
  };

  const handleUnsubscribe = () => {
    const data = { email };
    handleApiRequest('/unsubscribe/', data, 'Unsubscribed successfully!');
  };

  return (
    <div className="page-wrapper">
      <div className="left-bg"></div>

      <div className="daily-cyberbrief-container">
        <h1 className="cyberbrief-title">Daily CyberBrief</h1>
        <p className="cyberbrief-description">
          Get daily updates on cybersecurity and certification objectives straight to your email.
        </p>

        <div className="cyberbrief-form">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="cyberbrief-input"
          />

          <label>Certification Category:</label>
          <select
            value={certCategory}
            onChange={(e) => setCertCategory(e.target.value)}
            className="cyberbrief-input"
          >
            <option value="CompTIA A+">CompTIA A+</option>
            <option value="CompTIA Network+">CompTIA Network+</option>
            <option value="CompTIA Security+">CompTIA Security+</option>
            <option value="CompTIA CySA+">CompTIA CySA+</option>
            <option value="CompTIA Linux+">CompTIA Linux+</option>
            <option value="CompTIA CASP+">CompTIA CASP+</option>
            <option value="Cyber Fun Fact">Cyber Fun Fact</option>
          </select>

          <label>Frequency:</label>
          <select
            value={frequency}
            onChange={handleFrequencyChange}
            className="cyberbrief-input"
          >
            <option value={1}>Once per day</option>
            <option value={2}>Twice per day</option>
            <option value={3}>Three times per day</option>
            <option value={4}>Four times per day</option>
          </select>

          <label>Time Slots:</label>
          {timeSlots.map((time, index) => (
            <select
              key={index}
              value={time}
              onChange={(e) => handleTimeSlotChange(index, e.target.value)}
              className="cyberbrief-input time-slot"
            >
              <option value="">Select Time</option>
              <option value="Immediately">Immediately</option>
              {[...Array(24)].map((_, hour) => (
                <option key={hour} value={`${hour}:00`}>
                  {hour}:00
                </option>
              ))}
            </select>
          ))}

          <div className="button-group">
            <button onClick={handleSubscribe} className="cyberbrief-submit-button">
              Subscribe
            </button>
            <button onClick={handleUpdate} className="cyberbrief-submit-button">
              Update Subscription
            </button>
            <button onClick={handleUnsubscribe} className="cyberbrief-submit-button unsubscribe-button">
              Unsubscribe
            </button>
          </div>
          {loading && (
            <div className="loading-bar-container">
              <div className="loading-bar">
                <div
                  className="loading-bar-progress"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className="loading-percentage">{loadingProgress}%</span>
            </div>
          )}
          {message && <p className="cyberbrief-message">{message}</p>}
        </div>
      </div>

      <div className="right-bg"></div>
    </div>
  );
};

export default DailyCyberBrief;

