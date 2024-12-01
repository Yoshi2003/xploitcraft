// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import ScenarioSphere from './components/ScenarioSphere';
import AnalogyHub from './components/AnalogyHub';
import Redblue from './components/Redblue';
import Loganal from './components/Loganal';
import Incident from './components/Incident';
import GRC from './components/GRC';
import Daily from './components/Daily';
import Connor from './components/Connor';
import Donate from './components/Donate';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scenariosphere" element={<ScenarioSphere />} />
            <Route path="/analogyhub" element={<AnalogyHub />} />
            <Route path="/redblue" element={<Redblue />} />
            <Route path="/loganal" element={<Loganal />} />
            <Route path="/incident" element={<Incident />} />
            <Route path="/grc" element={<GRC />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/connor" element={<Connor />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;





