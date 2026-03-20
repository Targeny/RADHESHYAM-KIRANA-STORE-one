import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getAllProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './OffersPage.css';

const OffersPage = () => {
  const products = getAllProducts().filter(p => p.discount && p.discount >= 10);
  const [copied, setCopied] = useState('');

  const COUPONS = [
    { code: 'FIRST20', desc: '20% off on your first order', icon: '🎉', color: '#e8f5e9' },
    { code: 'SAVE50', desc: '₹50 flat off on orders above ₹299', icon: '💰', color: '#fff8e1' },
    { code: 'BLINK10', desc: '10% off — no minimum order', icon: '⚡', color: '#e3f2fd' },
    { code: 'FRESH15', desc: '15% off on fresh fruits & veggies', icon: '🥗', color: '#f3e5f5' },
    { code: 'DAIRY25', desc: '25% off on dairy products', icon: '🥛', color: '#fce4ec' },
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="offers-page">
      {/* Flash Sale Banner */}
      <div className="flash-banner">
        <div className="container flash-inner">
          <span className="flash-badge">⚡ FLASH SALE</span>
          <p>Huge savings today — use a coupon at checkout!</p>
        </div>
      </div>

      <div className="container">
        {/* Coupon Cards */}
        <section className="coupons-section">
          <h2 className="section-title">🏷️ Available Coupons</h2>
          <div className="coupons-grid">
            {COUPONS.map(c => (
              <div key={c.code} className="coupon-card" style={{ backgroundColor: c.color }}>
                <span className="coupon-icon">{c.icon}</span>
                <div className="coupon-info">
                  <span className="coupon-code">{c.code}</span>
                  <span className="coupon-desc">{c.desc}</span>
                </div>
                <button
                  className={`copy-btn ${copied === c.code ? 'copied' : ''}`}
                  onClick={() => handleCopy(c.code)}
                >
                  {copied === c.code ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Discounted Products */}
        <section className="offers-products">
          <h2 className="section-title">🔥 Deal of the Day</h2>
          <p className="section-subtitle">{products.length} products on sale right now</p>
          <div className="offers-product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default OffersPage;
