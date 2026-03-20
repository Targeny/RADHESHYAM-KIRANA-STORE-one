import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import Footer from '../components/Footer';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, addAddress, removeAddress, setDefaultAddress, logout, AVATARS } = useAuth();
  const { orders } = useOrders();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: '', line1: '', city: '', pincode: '' });
  const [addrError, setAddrError] = useState('');

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUser({ name: nameInput.trim() });
      setEditingName(false);
    }
  };

  const handleAvatarChange = (idx) => updateUser({ avatarIndex: idx });

  const handleAddAddr = (e) => {
    e.preventDefault();
    if (!addrForm.line1.trim() || !addrForm.city.trim() || !/^\d{6}$/.test(addrForm.pincode)) {
      setAddrError('Please fill in all fields correctly (6-digit pincode).');
      return;
    }
    addAddress(addrForm);
    setAddrForm({ label: '', line1: '', city: '', pincode: '' });
    setAddrError('');
    setShowAddAddress(false);
  };

  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Today';

  return (
    <div className="profile-page container">
      {/* Hero Banner */}
      <div className="profile-hero">
        <div className="profile-avatar-ring">
          <span className="profile-avatar">{AVATARS[user?.avatarIndex ?? 0]}</span>
        </div>
        <div className="profile-hero-info">
          {editingName ? (
            <div className="profile-name-edit">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="name-edit-input"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              />
              <button className="name-save-btn" onClick={handleSaveName}>Save</button>
              <button className="name-cancel-btn" onClick={() => setEditingName(false)}>✕</button>
            </div>
          ) : (
            <div className="profile-name-row">
              <h1 className="profile-name">{user?.name}</h1>
              <button className="edit-name-btn" onClick={() => setEditingName(true)}>✏️</button>
            </div>
          )}
          <p className="profile-phone">📱 +91 {user?.phone}</p>
          <p className="profile-joined">Member since {joinDate}</p>
        </div>
        <button className="profile-logout-btn" onClick={logout}>Logout 🚪</button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        {[
          { icon: '📦', label: 'Orders', value: orders.length },
          { icon: '❤️', label: 'Wishlisted', value: JSON.parse(localStorage.getItem('blinkit_wishlist') || '[]').length },
          { icon: '⭐', label: 'Reviews', value: 0 },
          { icon: '🎁', label: 'Coupons Used', value: 2 },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Avatar Picker */}
      <div className="profile-section">
        <h2>Choose Avatar</h2>
        <div className="avatar-picker">
          {AVATARS.map((av, i) => (
            <button
              key={i}
              className={`avatar-option ${user?.avatarIndex === i ? 'selected' : ''}`}
              onClick={() => handleAvatarChange(i)}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="profile-section">
        <div className="section-row">
          <h2>📍 Saved Addresses</h2>
          <button className="add-addr-btn" onClick={() => setShowAddAddress(v => !v)}>
            {showAddAddress ? '✕ Cancel' : '+ Add New'}
          </button>
        </div>

        {showAddAddress && (
          <form className="add-addr-form" onSubmit={handleAddAddr}>
            <div className="addr-form-grid">
              <div className="addr-field">
                <label>Label (Home/Work/Other)</label>
                <input
                  placeholder="e.g. Home"
                  value={addrForm.label}
                  onChange={e => setAddrForm(p => ({ ...p, label: e.target.value }))}
                />
              </div>
              <div className="addr-field full">
                <label>Full Address</label>
                <input
                  placeholder="Flat no, Building, Street"
                  value={addrForm.line1}
                  onChange={e => setAddrForm(p => ({ ...p, line1: e.target.value }))}
                />
              </div>
              <div className="addr-field">
                <label>City</label>
                <input
                  placeholder="Mumbai"
                  value={addrForm.city}
                  onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div className="addr-field">
                <label>Pincode</label>
                <input
                  placeholder="400001"
                  maxLength={6}
                  value={addrForm.pincode}
                  onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g,'') }))}
                />
              </div>
            </div>
            {addrError && <p className="addr-error">{addrError}</p>}
            <button type="submit" className="save-addr-btn">Save Address</button>
          </form>
        )}

        {(user?.savedAddresses || []).length === 0 && !showAddAddress && (
          <div className="no-addresses">
            <span>📭</span>
            <p>No saved addresses yet. Add one to speed up checkout!</p>
          </div>
        )}

        <div className="addresses-list">
          {(user?.savedAddresses || []).map(addr => (
            <div key={addr.id} className={`address-card ${user?.defaultAddressId === addr.id ? 'default' : ''}`}>
              <div className="addr-card-left">
                <span className="addr-label">{addr.label || 'Address'}</span>
                {user?.defaultAddressId === addr.id && <span className="default-tag">Default</span>}
                <p className="addr-line">{addr.line1}</p>
                <p className="addr-city">{addr.city} – {addr.pincode}</p>
              </div>
              <div className="addr-card-actions">
                {user?.defaultAddressId !== addr.id && (
                  <button className="set-default-btn" onClick={() => setDefaultAddress(addr.id)}>Set Default</button>
                )}
                <button className="remove-addr-btn" onClick={() => removeAddress(addr.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
