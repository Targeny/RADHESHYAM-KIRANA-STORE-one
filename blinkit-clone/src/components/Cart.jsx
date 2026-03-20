import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Cart.css';

const COUPONS = {
  'FIRST20': { discount: 20, label: '20% off (First Order)' },
  'SAVE50':  { discount: 0, flat: 50, label: '₹50 flat off' },
  'BLINK10': { discount: 10, label: '10% off' },
};

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, deliveryFee, finalTotal, addToCart, removeFromCart, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError('');
      addToast(`🎉 Coupon "${code}" applied!`, 'success');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const couponDiscount = appliedCoupon
    ? appliedCoupon.flat
      ? appliedCoupon.flat
      : Math.round((cartTotal * appliedCoupon.discount) / 100)
    : 0;

  const payable = Math.max(0, finalTotal - couponDiscount);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <div className={`cart-sidebar glass-effect ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2>My Cart</h2>
            {cartItems.length > 0 && (
              <span className="cart-delivery-tag">🚀 Delivery in 8 mins</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-cart-icon">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Add some items to get started!</p>
              <button className="browse-btn" onClick={onClose}>Browse Products</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image" style={{ backgroundColor: item.color }}>
                    <span className="cart-item-emoji">{item.icon}</span>
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <p className="cart-item-weight">{item.weight}</p>
                    <span className="cart-item-price">₹{item.price}</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls cart-qty">
                      <button className="qty-btn minus" onClick={() => removeFromCart(item.id)}>-</button>
                      <span className="qty-count">{item.quantity}</span>
                      <button className="qty-btn plus" onClick={() => addToCart(item)}>+</button>
                    </div>
                    <span className="cart-item-total">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Coupon Input */}
            <div className="coupon-section">
              {appliedCoupon ? (
                <div className="coupon-applied">
                  <span>🎉 {appliedCoupon.label}</span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}>Remove</button>
                </div>
              ) : (
                <div className="coupon-input-row">
                  <input
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button className="coupon-apply-btn" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="coupon-error">{couponError}</p>}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Item Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className="delivery-free">₹{deliveryFee}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="summary-row savings">
                  <span>Coupon Savings</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="summary-row final-total">
                <span>To Pay</span>
                <span>₹{payable}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
