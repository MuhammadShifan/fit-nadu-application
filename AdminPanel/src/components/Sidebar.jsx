import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/logo.png'; 

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-container">
        <img src={logo} alt="FitNadu Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
          <i className="bi bi-house-door-fill"></i> Dashboard
        </Link>
        <Link to="/gyms" className={`nav-item ${currentPath === '/gyms' ? 'active' : ''}`}>
          <i className="bi bi-activity"></i> Gyms
        </Link>
        <Link to="/trainers" className={`nav-item ${currentPath === '/trainers' ? 'active' : ''}`}>
          <i className="bi bi-person-badge"></i> Trainers
        </Link>
        <Link to="/supplements" className={`nav-item ${currentPath === '/supplements' ? 'active' : ''}`}>
          <i className="bi bi-capsule"></i> Supplements
        </Link>
        <Link to="/reports" className={`nav-item ${currentPath === '/reports' ? 'active' : ''}`}>
          <i className="bi bi-bar-chart-fill"></i> Reports
        </Link>
      </nav>

      <div className="sidebar-footer">
        <img src={logo} alt="FitNadu Logo" className="sidebar-footer-logo" />
        <p className="footer-tagline">Stronger Communities<br/>Healthier Tamil Nadu</p>
      </div>
    </aside>
  );
}