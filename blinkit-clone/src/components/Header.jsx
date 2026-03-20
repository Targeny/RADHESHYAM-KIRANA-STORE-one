import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchResults from './SearchResults';
import LoginModal from './LoginModal';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';
import './Header.css';

const AVATARS = ['🧑', '👩', '🧔', '👱', '🧕'];

const Header = ({ onCartClick }) => {
  const { itemCount, finalTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isLoggedIn } = useAuth();
  const isCartEmpty = itemCount === 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearch(e.target.value.length >= 2);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClose = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <>
      <header className="header glass-effect">
        <div className="container header-container">
          {/* Logo */}
          <Link to="/" className="header-brand">
            <h1 className="logo-text">
              <span className="blink">blink</span>
              <span className="it">it</span>
            </h1>
          </Link>

          {/* Location */}
          <div className="header-location">
            <div className="location-info">
              <span className="location-label">Delivery in <strong>8 minutes</strong></span>
              <span className="location-address">
                Unit-612B, TOWER-A, Unitech B... <span className="caret">▼</span>
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="header-search" ref={searchRef}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder='Search "butter"'
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
              />
              {searchQuery && <button className="search-clear" onClick={handleSearchClose}>✕</button>}
            </div>
            {showSearch && <SearchResults query={searchQuery} onClose={handleSearchClose} />}
          </div>

          {/* Actions */}
          <div className="header-actions">
            <DarkModeToggle />
            <NotificationBell />

            <Link to="/offers" className="offers-nav-btn" aria-label="Offers">
              🏷️
            </Link>

            <Link to="/wishlist" className="wishlist-nav-btn" aria-label="Wishlist">
              ❤️{wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
            </Link>

            <Link to="/orders" className="orders-nav-btn" aria-label="Orders">
              📦
            </Link>

            {isLoggedIn ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button className="user-avatar-btn" onClick={() => setShowUserMenu(v => !v)}>
                  <span>{AVATARS[user.avatar]}</span>
                  <span className="user-name-short">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-info">
                      <span className="user-dropdown-avatar">{AVATARS[user.avatar]}</span>
                      <div>
                        <p className="ud-name">{user.name}</p>
                        <p className="ud-phone">+91 {user.phone}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="ud-link" onClick={() => setShowUserMenu(false)}>👤 My Profile</Link>
                    <Link to="/orders" className="ud-link" onClick={() => setShowUserMenu(false)}>📦 My Orders</Link>
                    <Link to="/wishlist" className="ud-link" onClick={() => setShowUserMenu(false)}>❤️ Wishlist</Link>
                    <button className="ud-logout-btn" onClick={() => { logout(); setShowUserMenu(false); }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                <span>👤</span> Login
              </button>
            )}

            <button className={`cart-btn ${isCartEmpty ? 'empty' : 'populated'}`} onClick={onCartClick}>
              <span className="cart-icon">🛒</span>
              {isCartEmpty ? (
                <span className="cart-text">My Cart</span>
              ) : (
                <div className="cart-info-stacked">
                  <span className="cart-count-text">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                  <span className="cart-total-text">₹{finalTotal}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
};

export default Header;
