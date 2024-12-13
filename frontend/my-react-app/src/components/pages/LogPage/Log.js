import React, { useState, useEffect } from "react";
import axios from "axios";
import "./log.css";

// Corrected API Base URL for Apache proxy setup
const ENDPOINT = "/api";  

// Log Categories and Severities
const LOG_CATEGORIES = ["security", "event", "error", "debug", "info"];
const LOG_SEVERITIES = ["critical", "high", "medium", "low"];

function Log() {
  // State Management
  const [logs, setLogs] = useState([]);
  const [category, setCategory] = useState("security");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);

  // Fetch Logs from Backend
  const generateLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ENDPOINT}/logs/generate`, {
        category,
        count,
      });
      setLogs(response.data.logs || []);
      alert("Logs generated successfully!");
    } catch (error) {
      console.error("Error generating logs:", error);
      alert("Failed to generate logs. Please try again.");
    }
    setLoading(false);
  };

  // Analyze Selected Log
  const analyzeLog = async (log) => {
    setLoading(true);
    setSelectedLog(log);
    try {
      const response = await axios.post(`${ENDPOINT}/logs/analyze`, {
        logs: [log.log],
      });
      const result = response.data.logs[0].analysis || "No analysis available.";
      setAnalysis(result);
      saveToHistory(log, result);
    } catch (error) {
      console.error("Error analyzing log:", error);
      alert("Log analysis failed.");
    }
    setLoading(false);
  };

  // Save Analysis to History
  const saveToHistory = (log, analysis) => {
    const entry = { log, analysis, timestamp: new Date().toLocaleString() };
    setHistory([entry, ...history]);
  };

  // Filter Logs by Severity
  const filterLogsBySeverity = (severity) => {
    setFilterSeverity(severity === "all" ? "" : severity);
  };

  // Search Logs
  const searchLogs = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Filtered Logs by Severity and Search Term
  const filteredLogs = logs.filter((log) => {
    const matchesSeverity =
      !filterSeverity || log.log.severity === filterSeverity;
    const matchesSearch =
      !searchTerm ||
      log.log.event.toLowerCase().includes(searchTerm) ||
      log.log.message.toLowerCase().includes(searchTerm) ||
      log.log.source.toLowerCase().includes(searchTerm);
    return matchesSeverity && matchesSearch;
  });

  // Export Logs as JSON File
  const exportLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs_export.json";
    a.click();
  };


  return (
    <div className="log-page-container">
      <h1 className="log-page-title">Log Analysis Dashboard</h1>

      {/* Controls Section */}
      <div className="log-controls">
        <label>Log Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {LOG_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>

        <label>Log Count:</label>
        <input
          type="number"
          value={count}
          min="1"
          max="100"
          onChange={(e) => setCount(Number(e.target.value))}
        />

        <button className="generate-btn" onClick={generateLogs}>
          Generate Logs
        </button>
        <button className="export-btn" onClick={exportLogs}>
          Export Logs
        </button>
      </div>

      {/* Filter Section */}
      <div className="log-filter">
        <label>Filter by Severity:</label>
        <select
          value={filterSeverity}
          onChange={(e) => filterLogsBySeverity(e.target.value)}
        >
          <option value="all">All</option>
          {LOG_SEVERITIES.map((sev) => (
            <option key={sev} value={sev}>
              {sev.toUpperCase()}
            </option>
          ))}
        </select>

        <label>Search Logs:</label>
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => searchLogs(e.target.value)}
        />
      </div>

      {/* Logs Display */}
      <div className="log-list">
        {loading ? (
          <p className="loading-message">Loading logs...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="empty-message">No logs to display.</p>
        ) : (
          filteredLogs.map((entry, index) => (
            <div
              key={index}
              className={`log-entry severity-${entry.log.severity}`}
              onClick={() => analyzeLog(entry)}
            >
              <h3>{entry.log.event}</h3>
              <p><strong>Source:</strong> {entry.log.source}</p>
              <p><strong>Message:</strong> {entry.log.message}</p>
              <p><strong>Severity:</strong> {entry.log.severity}</p>
              <p><strong>Timestamp:</strong> {entry.log.timestamp}</p>
            </div>
          ))
        )}
      </div>

      {/* Analysis Section */}
      {selectedLog && analysis && (
        <div className="log-analysis">
          <h2>Log Analysis Result</h2>
          <pre className="analysis-box">{analysis}</pre>
        </div>
      )}

      {/* Analysis History */}
      {history.length > 0 && (
        <div className="log-history">
          <h2>Analysis History</h2>
          {history.map((entry, idx) => (
            <div key={idx} className="history-entry">
              <p><strong>Log:</strong> {entry.log.log.event}</p>
              <p><strong>Analysis:</strong> {entry.analysis}</p>
              <p><strong>Timestamp:</strong> {entry.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Log;



