// App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./log.css"; // Ensure this path is correct based on your project structure

// -------------------------------
// Utility Functions
// -------------------------------

// Function to determine the color of the progress bar based on percentage
const getProgressBarColor = (percentage) => {
  if (percentage > 75) return "#4caf50"; // Green
  if (percentage > 50) return "#2196f3"; // Blue
  if (percentage > 25) return "#f44336"; // Red
  return "#9e9e9e"; // Grey
};

// -------------------------------
// Controls Component
// -------------------------------

const LOG_CATEGORIES = {
  security: ["All", "Firewall", "Vulnerability Scanner", "IDS", "Access Control"],
  event: ["All", "System Monitor", "AppManager", "AuthService", "Network Manager"],
  error: ["All", "Database", "FileSystem", "Network Interface", "Application Service"],
  debug: ["All", "Query Executor", "API Gateway", "Config Manager", "Process Manager"],
  info: ["All", "System Monitor", "Activity Tracker", "Deployment Manager", "Service Monitor"],
};

const Controls = ({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  count,
  setCount,
  generateLogs,
  loading,
  MAX_LOG_COUNT,
  progress,
}) => {
  return (
    <div className="log-controls">
      {/* Category Selection */}
      <div className="control-group">
        <label htmlFor="category-select">Log Category:</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        >
          {Object.keys(LOG_CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Selection */}
      <div className="control-group">
        <label htmlFor="subcategory-select">Subcategory:</label>
        <select
          id="subcategory-select"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={loading}
        >
          {LOG_CATEGORIES[category].map((subcat) => (
            <option key={subcat} value={subcat}>
              {subcat}
            </option>
          ))}
        </select>
      </div>

      {/* Log Count Selection */}
      <div className="control-group">
        <label htmlFor="count-input">Number of Logs:</label>
        <input
          type="number"
          id="count-input"
          value={count}
          min="1"
          max={MAX_LOG_COUNT}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 1 && value <= MAX_LOG_COUNT) {
              setCount(value);
            }
          }}
          disabled={loading || subcategory === "All"}
        />
        {subcategory !== "All" && <span className="max-count">Max {MAX_LOG_COUNT}</span>}
      </div>

      {/* Generate Logs Button */}
      <button
        className="generate-btn"
        onClick={generateLogs}
        disabled={
          loading ||
          (count < 1 || count > MAX_LOG_COUNT) ||
          (subcategory === "All" && LOG_CATEGORIES[category].length - 1 === 0)
        }
      >
        {loading ? `Generating Logs (${Math.floor(progress)}%)` : "Generate Logs"}
      </button>
    </div>
  );
};

// -------------------------------
// Filters Component
// -------------------------------

const LOG_SEVERITIES = ["All", "Critical", "High", "Medium", "Low", "Info", "Debug"];

const Filters = ({
  filterSeverity,
  setFilterSeverity,
  searchTerm,
  setSearchTerm,
  loading,
}) => {
  return (
    <div className="log-filter">
      {/* Severity Filter */}
      <div className="filter-group">
        <label htmlFor="severity-filter">Filter by Severity:</label>
        <select
          id="severity-filter"
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          disabled={loading}
        >
          {LOG_SEVERITIES.map((sev) => (
            <option key={sev} value={sev}>
              {sev.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Search Logs */}
      <div className="filter-group">
        <label htmlFor="search-input">Search Logs:</label>
        <input
          type="text"
          id="search-input"
          placeholder="Search by event, message, or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>
    </div>
  );
};

// -------------------------------
// LogEntry Component
// -------------------------------

const LogEntry = ({ log, analyzeIndividualLog, loading }) => {
  return (
    <div className={`log-entry severity-${log.severity ? log.severity.toLowerCase() : 'all'}`}>
      <h3 className="log-event">{log.event || "N/A"}</h3>
      <p><strong>Type:</strong> {log.type || "N/A"}</p>
      <p><strong>Source:</strong> {log.source || "N/A"}</p>
      {log.message && <p><strong>Message:</strong> {log.message}</p>}
      <p><strong>Severity:</strong> {log.severity || "N/A"}</p>
      {log.timestamp && <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>}

      {/* Conditionally Render Additional Fields */}
      {/* Security Logs */}
      {log.source === "Firewall" && (
        <>
          <p><strong>Source IP:</strong> {log.source_ip}</p>
          <p><strong>Destination IP:</strong> {log.destination_ip}</p>
          <p><strong>Action:</strong> {log.action}</p>
          <p><strong>Protocol:</strong> {log.protocol}</p>
          <p><strong>Port:</strong> {log.port}</p>
        </>
      )}
      {log.source === "Vulnerability Scanner" && (
        <>
          <p><strong>Tool:</strong> {log.tool}</p>
          <p><strong>Vulnerability Name:</strong> {log.vulnerability_name}</p>
          <p><strong>CVE ID:</strong> {log.cve_id || "N/A"}</p>
        </>
      )}
      {log.source === "IDS" && (
        <>
          <p><strong>Detection System:</strong> {log.detection_system}</p>
          <p><strong>Intrusion Method:</strong> {log.intrusion_method}</p>
          <p><strong>Risk Level:</strong> {log.risk_level}</p>
        </>
      )}
      {log.source === "Access Control" && (
        <>
          <p><strong>Access Type:</strong> {log.access_type}</p>
          <p><strong>Resource:</strong> {log.resource}</p>
          <p><strong>Access Reason:</strong> {log.access_reason}</p>
        </>
      )}

      {/* Event Logs */}
      {log.source === "System Monitor" && (
        <>
          <p><strong>OS Version:</strong> {log.os_version}</p>
          <p><strong>Kernel Version:</strong> {log.kernel_version || "N/A"}</p>
          <p><strong>Hardware ID:</strong> {log.hardware_id}</p>
        </>
      )}
      {log.source === "AppManager" && (
        <>
          <p><strong>Application Name:</strong> {log.application_name}</p>
          <p><strong>Version:</strong> {log.version}</p>
          <p><strong>Action Details:</strong> {log.action_details}</p>
        </>
      )}
      {log.source === "AuthService" && (
        <>
          <p><strong>Authentication Method:</strong> {log.auth_method}</p>
          <p><strong>Authentication Status:</strong> {log.auth_status}</p>
          <p><strong>User Role:</strong> {log.user_role || "N/A"}</p>
        </>
      )}
      {log.source === "Network Manager" && (
        <>
          <p><strong>Source IP:</strong> {log.src_ip}</p>
          <p><strong>Destination IP:</strong> {log.dest_ip}</p>
          <p><strong>Protocol:</strong> {log.protocol}</p>
          <p><strong>Action Taken:</strong> {log.action_taken}</p>
        </>
      )}

      {/* Error Logs */}
      {log.source === "Database" && (
        <>
          <p><strong>Error Code:</strong> {log.error_code}</p>
          <p><strong>Error Message:</strong> {log.error_message}</p>
          <p><strong>Module:</strong> {log.module || "N/A"}</p>
          <p><strong>Query:</strong> {log.query}</p>
          <p><strong>Database Name:</strong> {log.database_name}</p>
          <p><strong>DB Engine:</strong> {log.db_engine}</p>
        </>
      )}
      {log.source === "FileSystem" && (
        <>
          <p><strong>Error Code:</strong> {log.error_code}</p>
          <p><strong>Error Message:</strong> {log.error_message}</p>
          <p><strong>Module:</strong> {log.module || "N/A"}</p>
          <p><strong>File Path:</strong> {log.file_path}</p>
          <p><strong>File Operation:</strong> {log.file_operation}</p>
          <p><strong>Error Details:</strong> {log.error_details}</p>
        </>
      )}
      {log.source === "Network Interface" && (
        <>
          <p><strong>Error Code:</strong> {log.error_code}</p>
          <p><strong>Error Message:</strong> {log.error_message}</p>
          <p><strong>Module:</strong> {log.module || "N/A"}</p>
          <p><strong>Interface:</strong> {log.interface}</p>
          <p><strong>Error Cause:</strong> {log.error_cause}</p>
          <p><strong>Affected Service:</strong> {log.affected_service}</p>
        </>
      )}
      {log.source === "Application Service" && (
        <>
          <p><strong>Error Code:</strong> {log.error_code}</p>
          <p><strong>Error Message:</strong> {log.error_message}</p>
          <p><strong>Module:</strong> {log.module || "N/A"}</p>
          <p><strong>App Name:</strong> {log.app_name}</p>
          <p><strong>Version:</strong> {log.version}</p>
          <p><strong>Crash Report:</strong> {log.crash_report || "N/A"}</p>
        </>
      )}

      {/* Debug Logs */}
      {log.source === "Query Executor" && (
        <>
          <p><strong>SQL Query:</strong> {log.sql_query}</p>
          <p><strong>Execution Time:</strong> {log.execution_time} ms</p>
        </>
      )}
      {log.source === "API Gateway" && (
        <>
          <p><strong>API Endpoint:</strong> {log.api_endpoint}</p>
          <p><strong>HTTP Method:</strong> {log.http_method}</p>
          <p><strong>Response Time:</strong> {log.response_time} ms</p>
        </>
      )}
      {log.source === "Config Manager" && (
        <>
          <p><strong>Config File:</strong> {log.config_file}</p>
          <p><strong>Settings Applied:</strong> {log.settings_applied.join(", ")}</p>
        </>
      )}
      {log.source === "Process Manager" && (
        <>
          <p><strong>Process ID:</strong> {log.process_id}</p>
          <p><strong>Process Name:</strong> {log.process_name}</p>
          <p><strong>Execution Status:</strong> {log.execution_status}</p>
        </>
      )}

      {/* Info Logs */}
      {log.source === "System Monitor" && (
        <>
          <p><strong>OS Version:</strong> {log.os_version}</p>
          <p><strong>Uptime:</strong> {log.uptime}</p>
          <p><strong>Resource Usage:</strong> {log.resource_usage}</p>
        </>
      )}
      {log.source === "Activity Tracker" && (
        <>
          <p><strong>User ID:</strong> {log.user_id}</p>
          <p><strong>Activity Type:</strong> {log.activity_type}</p>
          <p><strong>Activity Details:</strong> {log.activity_details}</p>
        </>
      )}
      {log.source === "Deployment Manager" && (
        <>
          <p><strong>Environment:</strong> {log.environment}</p>
          <p><strong>Deployment Status:</strong> {log.deployment_status}</p>
          <p><strong>Release Version:</strong> {log.release_version}</p>
        </>
      )}
      {log.source === "Service Monitor" && (
        <>
          <p><strong>Service Name:</strong> {log.service_name}</p>
          <p><strong>Status:</strong> {log.status}</p>
          <p><strong>Last Checked:</strong> {new Date(log.last_checked).toLocaleString()}</p>
        </>
      )}

      {/* Analyze Individual Log Button */}
      <button
        className="analyze-individual-btn"
        onClick={() => analyzeIndividualLog(log)}
        disabled={loading || log.analysis} // Disable if already analyzed or loading
        title="Analyze this log"
      >
        {log.analysis ? "Analyzed" : "Analyze Log"}
      </button>
    </div>
  );
};

// -------------------------------
// LogList Component
// -------------------------------

const LogList = ({ logs, analyzeIndividualLog, loading }) => {
  return (
    <div className="log-list">
      {logs.length === 0 ? (
        <p className="empty-message">No logs to display.</p>
      ) : (
        logs.map((log) => (
          <LogEntry
            key={log.id}
            log={log}
            analyzeIndividualLog={analyzeIndividualLog}
            loading={loading}
          />
        ))
      )}
    </div>
  );
};

// -------------------------------
// AnalysisSection Component
// -------------------------------

const AnalysisSection = ({ analysis }) => {
  return (
    analysis && (
      <div className="log-analysis">
        <h2>Analysis Result</h2>
        <pre className="analysis-box">{analysis}</pre>
      </div>
    )
  );
};

// -------------------------------
// HistoryEntry Component
// -------------------------------

const HistoryEntry = ({ entry }) => {
  return (
    <div className="history-entry">
      <h4>
        {entry.log.event || "N/A"} - {entry.log.source || "N/A"}
      </h4>
      <p>
        <strong>Analysis:</strong> {entry.analysis}
      </p>
      <p>
        <strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

// -------------------------------
// HistorySection Component
// -------------------------------

const HistorySection = ({ history, showHistory, toggleHistory }) => {
  return (
    history.length > 0 && (
      <div className="log-history">
        <h2>Analysis History</h2>
        <div className="history-controls">
          <button onClick={toggleHistory}>
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>
        {showHistory && (
          <div className="history-list">
            {history.map((entry) => (
              <HistoryEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    )
  );
};

// -------------------------------
// Main App Component
// -------------------------------

const App = () => {
  // State Management
  const [logs, setLogs] = useState([]); // Stores generated logs
  const [category, setCategory] = useState("security"); // Selected main category
  const [subcategory, setSubcategory] = useState("All"); // Selected subcategory
  const [count, setCount] = useState(1); // Number of logs to generate
  const [loading, setLoading] = useState(false); // Loading state for generate/analyze
  const [progress, setProgress] = useState(0); // Progress bar percentage
  const [analysis, setAnalysis] = useState(""); // Analysis result for individual log
  const [filterSeverity, setFilterSeverity] = useState("All"); // Severity filter
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [history, setHistory] = useState([]); // Analysis history
  const [showAnalysisHistory, setShowAnalysisHistory] = useState(false); // Toggle for history display

  const ENDPOINT = "/api"; // Correct backend URL

  // Effect to reset subcategory and count when category changes
  useEffect(() => {
    setSubcategory("All");
    setCount(1);
  }, [category]);

  // Generate Logs by calling the backend API
  const generateLogs = async () => {
    setLoading(true);
    setProgress(0);
    setLogs([]);
    setAnalysis("");
    try {
      const startTime = Date.now();

      // Send request to backend to generate logs
      const response = await axios.post(`${ENDPOINT}/logs/generate`, {
        category,
        count,
      });

      const generatedLogs = response.data.logs || [];
      console.log("Generated Logs:", generatedLogs); // Debugging

      // Filter logs based on selected subcategory if not "All"
      let filteredLogs = [];
      if (subcategory !== "All") {
        filteredLogs = generatedLogs.filter(
          (log) => log.source.toLowerCase() === subcategory.toLowerCase()
        );
      } else {
        filteredLogs = generatedLogs;
      }

      console.log("Filtered Logs:", filteredLogs); // Debugging

      setLogs(filteredLogs);

      const endTime = Date.now();
      const duration = endTime - startTime; // Duration in milliseconds

      // Simulate progress based on duration
      const simulateProgress = () => {
        const interval = 100; // Progress update interval in ms
        const totalIntervals = Math.floor(duration / interval);
        let currentInterval = 0;
        const progressInterval = setInterval(() => {
          currentInterval += 1;
          setProgress(Math.min((currentInterval / totalIntervals) * 100, 100));
          if (currentInterval >= totalIntervals) {
            clearInterval(progressInterval);
            setProgress(100);
          }
        }, interval);
      };

      simulateProgress();

      // Wait for the duration to ensure progress bar completes
      await new Promise((resolve) => setTimeout(resolve, duration));

      toast.success(`${filteredLogs.length} log(s) generated successfully!`);
    } catch (error) {
      console.error("Error generating logs:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Generation failed: ${error.response.data.error}`);
      } else {
        toast.error("Failed to generate logs. Please try again.");
      }
    }
    setLoading(false);
    setProgress(0);
  };

  // Analyze Individual Log by calling the backend API
  const analyzeIndividualLog = async (log) => {
    setLoading(true);
    setProgress(0);
    setAnalysis("");
    try {
      const startTime = Date.now();

      // Send single log to backend for analysis
      const response = await axios.post(`${ENDPOINT}/logs/analyze`, {
        log: log, // Sending a single log
      });

      const analyzedLog = response.data.analysis ? response.data.analysis : "";
      console.log("Analyzed Individual Log:", analyzedLog); // Debugging

      if (!analyzedLog) {
        toast.warn("Log analysis returned no results.");
        setLoading(false);
        return;
      }

      // Update the specific log with its analysis
      setLogs((prevLogs) =>
        prevLogs.map((l) => (l.id === log.id ? { ...l, analysis: analyzedLog } : l))
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Simulate progress based on duration
      const simulateProgress = () => {
        const interval = 100;
        const totalIntervals = Math.floor(duration / interval);
        let currentInterval = 0;
        const progressInterval = setInterval(() => {
          currentInterval += 1;
          setProgress(Math.min((currentInterval / totalIntervals) * 100, 100));
          if (currentInterval >= totalIntervals) {
            clearInterval(progressInterval);
            setProgress(100);
          }
        }, interval);
      };

      simulateProgress();
      await new Promise((resolve) => setTimeout(resolve, duration));

      // Update analysis history
      const timestamp = new Date().toLocaleString();
      const newHistoryEntry = {
        id: log.id,
        log: log,
        analysis: analyzedLog,
        timestamp,
      };
      setHistory([newHistoryEntry, ...history]);

      toast.success("Log analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing log:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Analysis failed: ${error.response.data.error}`);
      } else {
        toast.error("Failed to analyze log. Please try again.");
      }
    }
    setLoading(false);
    setProgress(0);
  };

  // Analyze All Logs by calling the backend API (Optional Feature)
  // Currently not used as per your requirements
  /*
  const analyzeAllLogs = async () => {
    if (logs.length === 0) {
      toast.warn("No logs to analyze. Please generate logs first.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setAnalysis("");
    try {
      const startTime = Date.now();

      // Send logs to backend for analysis
      const response = await axios.post(`${ENDPOINT}/logs/analyze`, {
        logs: logs, // Sending all logs
      });

      const analyzedLogs = response.data.logs || [];
      console.log("Analyzed Logs:", analyzedLogs); // Debugging

      if (analyzedLogs.length === 0) {
        toast.warn("Log analysis returned no results.");
        setLoading(false);
        return;
      }

      // Update all logs with their analyses
      setLogs(analyzedLogs.map((entry) => entry.log));

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Simulate progress based on duration
      const simulateProgress = () => {
        const interval = 100;
        const totalIntervals = Math.floor(duration / interval);
        let currentInterval = 0;
        const progressInterval = setInterval(() => {
          currentInterval += 1;
          setProgress(Math.min((currentInterval / totalIntervals) * 100, 100));
          if (currentInterval >= totalIntervals) {
            clearInterval(progressInterval);
            setProgress(100);
          }
        }, interval);
      };

      simulateProgress();
      await new Promise((resolve) => setTimeout(resolve, duration));

      // Update analysis history
      const timestamp = new Date().toLocaleString();
      const newHistory = analyzedLogs.map((entry) => ({
        id: entry.log.id,
        log: entry.log,
        analysis: entry.analysis,
        timestamp,
      }));
      setHistory([...newHistory, ...history]);

      toast.success("All logs analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing logs:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Analysis failed: ${error.response.data.error}`);
      } else {
        toast.error("Failed to analyze logs. Please try again.");
      }
    }
    setLoading(false);
    setProgress(0);
  };
  */

  // Filter Logs by Severity and Search Term
  const filteredLogs = logs.filter((log) => {
    const matchesSeverity =
      filterSeverity === "All" ||
      (log.severity && log.severity.toLowerCase() === filterSeverity.toLowerCase());
    const matchesSearch =
      searchTerm === "" ||
      (log.event && log.event.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.message && log.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.source && log.source.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSeverity && matchesSearch;
  });

  // Export Logs as JSON File
  const exportLogs = () => {
    if (logs.length === 0) {
      toast.warn("No logs to export.");
      return;
    }
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs_export.json";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Logs exported successfully!");
  };

  // Reset Logs and Analysis
  const resetLogs = () => {
    setLogs([]);
    setAnalysis("");
    setHistory([]);
    setSearchTerm("");
    setFilterSeverity("All");
    setCategory("security");
    setSubcategory("All");
    toast.info("Dashboard has been reset.");
  };

  return (
    <div className="log-page-container">
      <h1 className="log-page-title">Log Analysis Dashboard</h1>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Options: "light", "dark", "colored"
      />

      {/* Controls Section */}
      <Controls
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        count={count}
        setCount={setCount}
        generateLogs={generateLogs}
        loading={loading}
        MAX_LOG_COUNT={5}
        progress={progress}
      />

      {/* Filter Section */}
      <Filters
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
      />

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              backgroundColor: getProgressBarColor(progress),
            }}
          ></div>
          <span className="progress-percentage">{Math.floor(progress)}%</span>
        </div>
      )}

      {/* Logs Display */}
      <LogList
        logs={filteredLogs}
        analyzeIndividualLog={analyzeIndividualLog}
        loading={loading}
      />

      {/* Analysis Section for Individual Log */}
      <AnalysisSection analysis={analysis} />

      {/* Analysis History */}
      <HistorySection
        history={history}
        showHistory={showAnalysisHistory}
        toggleHistory={() => setShowAnalysisHistory(!showAnalysisHistory)}
      />

      {/* Export and Reset Buttons */}
      <div className="log-actions">
        <button
          className="export-btn"
          onClick={exportLogs}
          disabled={logs.length === 0}
        >
          Export Logs
        </button>
        <button
          className="reset-btn"
          onClick={resetLogs}
          disabled={loading || (logs.length === 0 && history.length === 0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;

