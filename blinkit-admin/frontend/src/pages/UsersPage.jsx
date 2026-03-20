import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './UsersPage.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | blocked
  const [actionId, setActionId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBlock = async (user) => {
    setActionId(user._id);
    try {
      await api.put(`/users/${user._id}/block`, { isBlocked: !user.isBlocked });
      await fetchUsers();
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !u.isBlocked) ||
      (filter === 'blocked' && u.isBlocked);
    return matchesSearch && matchesFilter;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{totalUsers} registered users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="user-stats">
        <div className="user-stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <p className="stat-value">{totalUsers}</p>
            <p className="stat-label">Total</p>
          </div>
        </div>
        <div className="user-stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <p className="stat-value">{activeUsers}</p>
            <p className="stat-label">Active</p>
          </div>
        </div>
        <div className="user-stat-card">
          <span className="stat-icon">🚫</span>
          <div>
            <p className="stat-value">{blockedUsers}</p>
            <p className="stat-label">Blocked</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="table-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'active', 'blocked'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user._id} className={user.isBlocked ? 'row-blocked' : ''}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{(user.name?.[0] || 'U').toUpperCase()}</div>
                      <div>
                        <p className="user-name">{user.name || '—'}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td-secondary">{user.phone || '—'}</td>
                  <td className="td-secondary">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <span className="order-count">{user.orderCount ?? 0}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn-action ${user.isBlocked ? 'btn-unblock' : 'btn-block'}`}
                      onClick={() => handleToggleBlock(user)}
                      disabled={actionId === user._id}
                    >
                      {actionId === user._id ? '...' : user.isBlocked ? '✅ Unblock' : '🚫 Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
