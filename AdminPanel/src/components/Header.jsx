import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <i className="bi bi-list menu-toggle"></i>
        <div className="search-bar">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search gyms, users, trainers..." />
        </div>
      </div>
      <div className="topbar-right">
        <div className="notification-icon">
          <i className="bi bi-bell"></i>
          <span className="badge">3</span>
        </div>
        <div className="admin-profile">
          {/* <i className="bi bi-person-circle avatar-icon"></i> */}
          <div className="admin-info">
            <span className="admin-name">Admin</span>
            
          </div>
        </div>
      </div>
    </header>
  );
}