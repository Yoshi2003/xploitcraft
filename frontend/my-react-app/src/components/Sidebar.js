// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Root$</h2>
      <ul className="sidebar-list">
        <li><Link to="/">/Home</Link></li>
        <li><Link to="/ScenarioSphere">/Scenario Sphere</Link></li>
        <li><Link to="/AnalogyHub">/Analogy Hub</Link></li>
        <li><Link to="/redblue">/Red vs Blue</Link></li>
        <li><Link to="/loganal">/Log Analysis</Link></li>
        <li><Link to="/incident">/Incident Command</Link></li>
        <li><Link to="/grc">/GRC Wizard</Link></li>
        <li><Link to="/daily">/Daily CyberBrief</Link></li>
        <li><Link to="/connor">/Messers Youtube</Link></li>
        <li><Link to="/donate">/Donation</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;



