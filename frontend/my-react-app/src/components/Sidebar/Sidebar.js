// components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import sidebarLogo from './sidebarlogo.png'; // Importing the logo

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Toggle button visible on small screens */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {collapsed ? '☰' : '✖'}
      </button>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <h2 className="sidebar-title">root@</h2>
        <ul className="sidebar-list">
          <li><Link to="/xploitcraft">/Xploitcraft</Link></li>
          <li><Link to="/scenariosphere">/Scenario Sphere</Link></li>
          <li><Link to="/analogyhub">/Analogy Hub</Link></li>
          <li><Link to="/log">/Log Analysis</Link></li>
          <li><Link to="/grc">/GRC Wizard</Link></li>
          <li><Link to="/dailycyberbrief">/Daily CyberBrief</Link></li>
          <li><Link to="/resources">/Study Resources</Link></li>
          <li><Link to="/donate">/Donation</Link></li>
          <li><Link to="/about">/About</Link></li>
        </ul>
        <div className="sidebar-logo-container">
          <img src={sidebarLogo} alt="Sidebar Logo" className="sidebar-logo" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;






