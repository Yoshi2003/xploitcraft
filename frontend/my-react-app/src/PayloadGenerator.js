import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000"; // Update with your backend server's IP or domain
const socket = io(ENDPOINT);

function PayloadGenerator() {
  const [vulnerability, setVulnerability] = useState("");
  const [evasionTechnique, setEvasionTechnique] = useState("");
  const [payload, setPayload] = useState("");

  const handleGeneratePayload = async () => {
    if (vulnerability && evasionTechnique) {
      try {
        // Make a POST request to the backend to generate the payload
        const response = await axios.post(`${ENDPOINT}/generate_payload`, {
          vulnerability,
          evasion_technique: evasionTechnique
        });
        setPayload(response.data.payload);
      } catch (error) {
        console.error("Error generating payload:", error);
        alert("Failed to connect to the backend server. Please check the server connection.");
      }
    } else {
      alert("Please enter both vulnerability and evasion technique");
    }
  };

  // Use useEffect to add event listeners on the socket connection
  useEffect(() => {
    // Handling payload response from the backend via WebSocket
    socket.on('payload_response', data => {
      setPayload(data.payload);
    });

    // Handling errors from the backend via WebSocket
    socket.on('error', data => {
      alert(`Error: ${data.error}`);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('payload_response');
      socket.off('error');
    };
  }, []);

  return (
    <div>
      <h2>Generate Custom Payload</h2>
      <div>
        <input
          type="text"
          placeholder="Enter vulnerability"
          value={vulnerability}
          onChange={(e) => setVulnerability(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter evasion technique"
          value={evasionTechnique}
          onChange={(e) => setEvasionTechnique(e.target.value)}
        />
        <button onClick={handleGeneratePayload}>Generate Payload</button>
      </div>
      <div>
        <h3>Generated Payload</h3>
        <pre>{payload}</pre>
      </div>
    </div>
  );
}

export default PayloadGenerator;

