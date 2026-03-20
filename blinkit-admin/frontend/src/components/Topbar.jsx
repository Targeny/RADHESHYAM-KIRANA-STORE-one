import React from 'react';
import './Topbar.css';

export default function Topbar({ onMenuToggle, title }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">☰</button>
        <div>
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>
      <div className="topbar-right">
        <span className="topbar-time">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      </div>
    </header>
  );
}
