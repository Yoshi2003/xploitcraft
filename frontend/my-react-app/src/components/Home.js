// components/Home.js
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import logo from '../logo5.png';
import '../App.css';

const ENDPOINT = "http://localhost:5000/api";

function Home() {
  const [vulnerability, setVulnerability] = useState("");
  const [evasionTechnique, setEvasionTechnique] = useState("");
  const [payload, setPayload] = useState("");
  const [socket] = useState(() => socketIOClient(ENDPOINT));

  useEffect(() => {
    socket.on('payload_response', (data) => {
      setPayload(data.payload);
    });

    socket.on('error', (data) => {
      alert(`Error: ${data.error}`);
    });

    return () => {
      socket.off('payload_response');
      socket.off('error');
      socket.disconnect();
    };
  }, [socket]);

  const handleGeneratePayload = () => {
    if (vulnerability && evasionTechnique) {
      fetch(`${ENDPOINT}/generate_payload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vulnerability: vulnerability,
          evasion_technique: evasionTechnique,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.payload) {
            setPayload(data.payload);
          } else if (data.error) {
            alert(`Error: ${data.error}`);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Failed to connect to the backend server. Please check the server connection.');
        });
    } else {
      alert("Please enter both vulnerability and evasion technique");
    }
  };

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="header-title">XploitCraft Pro</h1>

      <div className="input-container-horizontal">
        <input
          type="text"
          placeholder="Enter Vulnerability"
          value={vulnerability}
          onChange={(e) => setVulnerability(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter Evasion Technique"
          value={evasionTechnique}
          onChange={(e) => setEvasionTechnique(e.target.value)}
          className="input-field"
        />
      </div>

      <button onClick={handleGeneratePayload} className="generate-button">
        Generate Payload
      </button>

      {payload && (
        <div className="payload-wrapper">
          <h2 className="generated-payload-title">Generated Payload</h2>
          <div className="payload-content">
            <SyntaxHighlighter
              language="python"
              style={gruvboxDark}
              customStyle={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
                lineHeight: '1.5',
                width: '100%',
                tabSize: '4',
              }}
            >
              {payload}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </header>
  );
}

export default Home;

