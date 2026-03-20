import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from '../components/Confetti';
import './OrderSuccessPage.css';

const STEPS = [
  { icon: '✅', label: 'Order Placed' },
  { icon: '📦', label: 'Being Packed' },
  { icon: '🛵', label: 'On the Way' },
  { icon: '🏠', label: 'Delivered' },
];

const OrderSuccessPage = () => {
  const [orderNum] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [seconds, setSeconds] = useState(600); // 10:00
  const [stepIndex, setStepIndex] = useState(1); // start at "Being Packed"

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(timer); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance tracking steps
  useEffect(() => {
    const milestones = [450, 240, 30]; // seconds remaining at which to advance step
    const idx = milestones.findIndex(m => seconds === m);
    if (idx !== -1) setStepIndex(idx + 2);
  }, [seconds]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const delivered = seconds === 0;

  return (
    <div className="order-success-page">
      <Confetti />
      <div className="success-card">
        <div className="success-animation">
          <div className="success-circle">{delivered ? '🏠' : '✓'}</div>
        </div>

        <h1>{delivered ? 'Delivered! 🎉' : 'Order Placed! 🎉'}</h1>
        <p className="order-num">Order #{orderNum}</p>

        {!delivered ? (
          <>
            <p className="success-msg">
              Your order has been placed successfully.
              Estimated delivery in&nbsp;
              <span className="countdown-badge">{mins}:{secs}</span>
            </p>
            <div className="countdown-ring">
              <span className="countdown-big">{mins}:{secs}</span>
              <span className="countdown-label">ETA</span>
            </div>
          </>
        ) : (
          <p className="success-msg delivered-msg">Your order has been delivered. Enjoy! 🛍️</p>
        )}

        {/* Delivery Track */}
        <div className="delivery-track">
          {STEPS.map((step, i) => (
            <div key={i} className={`track-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
              <div className="track-icon-wrap">
                <div className="track-icon">{step.icon}</div>
                {i < STEPS.length - 1 && <div className={`track-line ${i < stepIndex ? 'done' : ''}`} />}
              </div>
              <span className="track-label">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="success-actions">
          <Link to="/orders" className="view-orders-btn">View My Orders</Link>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
