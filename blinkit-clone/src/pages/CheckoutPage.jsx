import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, deliveryFee, finalTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', pincode: '',
    payment: 'cod',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter valid 10-digit phone';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
    return newErrors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    placeOrder(cartItems, finalTotal, `${form.address}, ${form.city} – ${form.pincode}`);
    clearCart();
    navigate('/order-success');
  };


  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty container">
        <span>🛒</span>
        <h2>Nothing to checkout</h2>
        <button onClick={() => navigate('/')} className="go-home-btn">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        {/* Delivery Form */}
        <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
          <div className="form-section">
            <h2>📦 Delivery Details</h2>
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label>Mobile Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-field">
              <label>Email (optional)</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@email.com" />
            </div>
            <div className="form-field">
              <label>Delivery Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Flat no, Building, Street" rows={3} />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="form-field">
                <label>Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" maxLength={6} />
                {errors.pincode && <span className="field-error">{errors.pincode}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>💳 Payment Method</h2>
            <div className="payment-options">
              {[
                { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                { id: 'upi', label: 'UPI / QR Code', icon: '📱' },
                { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
              ].map(opt => (
                <label key={opt.id} className={`payment-option ${form.payment === opt.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={form.payment === opt.id}
                    onChange={handleChange}
                  />
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="place-order-btn">
            🚀 Place Order · ₹{finalTotal}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="checkout-summary">
          <h2>Your Order</h2>
          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <div className="checkout-item-icon" style={{ backgroundColor: item.color }}>{item.icon}</div>
                <div className="checkout-item-info">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-qty">x{item.quantity}</span>
                </div>
                <span className="checkout-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row"><span>Item Total</span><span>₹{cartTotal}</span></div>
            <div className="checkout-total-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
            <div className="checkout-total-row grand"><span>Total Payable</span><span>₹{finalTotal}</span></div>
          </div>

          <div className="safe-checkout">🔒 100% Secure Checkout</div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
