import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

import Xploitcraft from './components/pages/XploitcraftPage/Xploitcraft';
import About from './components/pages/AboutPage/About'; // About component
import ScenarioSphere from './components/pages/ScenarioPage/ScenarioSphere';
import AnalogyHub from './components/pages/AnalogyPage/AnalogyHub';
import Log from './components/pages/LogPage/Log';
import GRC from './components/pages/GRCpage/GRC';
import DailyCyberBrief from './components/pages/DailyPage/DailyCyberBrief';
import Resources from './components/pages/ResourcesPage/Resources';
import Donate from './components/pages/DonatePage/Donate';

import './components/pages/XploitcraftPage/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/xploitcraft" element={<Xploitcraft />} />
            <Route path="/scenariosphere" element={<ScenarioSphere />} />
            <Route path="/analogyhub" element={<AnalogyHub />} />
            <Route path="/loganal" element={<Loganal />} />
            <Route path="/grc" element={<GRC />} />
            <Route path="/dailycyberbrief" element={<DailyCyberBrief />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;









