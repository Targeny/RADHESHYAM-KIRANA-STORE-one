import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { notifications, markAllRead, unreadCount } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(v => !v);
    if (!open && unreadCount > 0) markAllRead();
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="notif-bell" onClick={handleOpen} aria-label="Notifications">
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="notif-clear" onClick={() => {}}>Mark all read</button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <span>🔕</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                  <span className="notif-icon">{n.icon}</span>
                  <div className="notif-content">
                    <p className="notif-msg">{n.msg}</p>
                    <span className="notif-time">{formatTime(n.time)}</span>
                  </div>
                  {!n.read && <div className="notif-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
