import React, { useState, useEffect } from "react";
import "./log.css";

const ENDPOINT = "/api";

const Log = () => {
  const [logType, setLogType] = useState("");
  const [logs, setLogs] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [total, setTotal] = useState(0);

  // Fetch Logs from Backend
  const fetchAllLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${ENDPOINT}/log/fetch_logs?log_type=${encodeURIComponent(
          logType
        )}&page=${page}&per_page=${perPage}`
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch logs.");
      }

      const data = await response.json();
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Logs on Click
  const handleGenerateLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${ENDPOINT}/log/generate_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ log_type: logType || null, count: 10 }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate logs.");
      }

      const data = await response.json();
      console.log("Logs generated:", data.logs);
      await fetchAllLogs();
    } catch (err) {
      console.error("Error generating logs:", err);
      setError("Failed to generate logs.");
    } finally {
      setLoading(false);
    }
  };

  // Analyze Log
  const handleAnalyzeLog = async (logId) => {
    setLoading(true);
    setError("");
    setAnalysis("");
    try {
      const response = await fetch(`${ENDPOINT}/log/analyze_log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ log_id: logId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze log.");
      }

      const data = await response.json();
      setAnalysis(data.explanation);
    } catch (err) {
      console.error("Error analyzing log:", err);
      setError("Failed to analyze log.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Controls
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * perPage < total) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchAllLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, logType]);

  return (
    <div className="log-container">
      <h1>Log Analysis System</h1>

      <div className="controls">
        <label>
          Log Type:
          <select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            <option value="">All</option>
            <option value="security">Security</option>
            <option value="event">Event</option>
            <option value="debug">Debug</option>
            <option value="system">System</option>
            <option value="error">Error</option>
          </select>
        </label>

        <button onClick={handleGenerateLogs} disabled={loading}>
          {loading ? "Generating..." : "Generate Logs"}
        </button>

        <button onClick={fetchAllLogs} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Logs"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Details</th>
            <th>Analyze</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.type}</td>
              <td>
                <pre>{JSON.stringify(log, null, 2)}</pre>
              </td>
              <td>
                <button
                  onClick={() => handleAnalyzeLog(log._id)}
                  disabled={loading}
                >
                  Analyze
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1 || loading}>
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page * perPage >= total || loading}
        >
          Next
        </button>
      </div>

      {analysis && (
        <div className="analysis">
          <h2>Log Analysis</h2>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default Log;



