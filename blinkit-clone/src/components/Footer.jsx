import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { categories } from '../data/categories';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container container">
      <div className="footer-brand">
        <div className="footer-logo">
          <span className="blink">blink</span><span className="it">it</span>
        </div>
        <p className="footer-tagline">Grocery delivery in 10 minutes</p>
        <div className="footer-app-badges">
          <a href="#" className="app-badge">
            <span>🍎</span> App Store
          </a>
          <a href="#" className="app-badge">
            <span>▶️</span> Google Play
          </a>
        </div>
      </div>

      <div className="footer-column">
        <h4>Categories</h4>
        <ul>
          {categories.slice(0, 6).map(cat => (
            <li key={cat.id}>
              <Link to={`/category/${cat.id}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-column">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">Partner with us</a></li>
          <li><a href="#">Ride with us</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Help & Support</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Safety</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Refund Policy</a></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2024 Blinkit Clone. Built for learning purposes.</p>
      <div className="footer-socials">
        <a href="#" aria-label="Twitter">𝕏</a>
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="LinkedIn">🔗</a>
      </div>
    </div>
  </footer>
);

export default Footer;
