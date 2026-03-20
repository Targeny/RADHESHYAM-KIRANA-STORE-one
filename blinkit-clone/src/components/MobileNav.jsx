import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './MobileNav.css';

const MobileNav = ({ onCartClick }) => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { icon: '🏠', label: 'Home', to: '/' },
    { icon: '🔍', label: 'Search', to: '/search' },
    { icon: '🏷️', label: 'Offers', to: '/offers' },
    { icon: '❤️', label: 'Wishlist', to: '/wishlist', badge: wishlistCount },
    { icon: '🛒', label: 'Cart', onClick: onCartClick, badge: itemCount },
  ];

  return (
    <nav className="mobile-nav">
      {tabs.map((tab, i) =>
        tab.onClick ? (
          <button key={i} className={`mobile-nav-item ${tab.badge > 0 ? 'active' : ''}`} onClick={tab.onClick}>
            <span className="mobile-nav-icon">
              {tab.icon}
              {tab.badge > 0 && <span className="mobile-nav-badge">{tab.badge}</span>}
            </span>
            <span className="mobile-nav-label">{tab.label}</span>
          </button>
        ) : (
          <Link key={i} to={tab.to} className={`mobile-nav-item ${path === tab.to ? 'current' : ''}`}>
            <span className="mobile-nav-icon">
              {tab.icon}
              {tab.badge > 0 && <span className="mobile-nav-badge">{tab.badge}</span>}
            </span>
            <span className="mobile-nav-label">{tab.label}</span>
          </Link>
        )
      )}
    </nav>
  );
};

export default MobileNav;
