import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/products', icon: '📦', label: 'Products' },
  { to: '/categories', icon: '🗂️', label: 'Categories' },
  { to: '/orders', icon: '🛒', label: 'Orders' },
  { to: '/users', icon: '👥', label: 'Users' },
  { to: '/coupons', icon: '🎟️', label: 'Coupons' },
  { to: '/banners', icon: '🖼️', label: 'Banners' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Blinkit<span>Admin</span></span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">{admin?.name?.[0] || 'A'}</div>
            <div>
              <p className="admin-name">{admin?.name}</p>
              <p className="admin-role">{admin?.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>
    </>
  );
}
