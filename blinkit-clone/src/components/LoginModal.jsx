import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const { login, redirectPath, setRedirectPath } = useAuth();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) setStep('otp');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    login(phone);
    onClose(redirectPath || '/');
    setRedirectPath(null);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={() => onClose(null)} />
      <div className="login-modal">
        <button className="modal-close-btn" onClick={() => onClose(null)}>✕</button>

        <div className="login-modal-left">
          <h2>India's last minute app</h2>
          <div className="login-modal-illustration">🛒</div>
          <p className="login-modal-tagline">Groceries delivered in <strong>10 minutes</strong></p>
        </div>

        <div className="login-modal-right">
          <div className="login-logo">
            <span className="blink">blink</span><span className="it">it</span>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="login-form">
              <h3>Log in or Sign up</h3>
              <p className="login-subtitle">Enter your phone number to continue</p>
              <div className="phone-input-wrap">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="phone-input"
                  autoFocus
                />
              </div>
              <button type="submit" className="otp-btn" disabled={phone.length !== 10}>
                Continue →
              </button>
              <p className="login-terms">
                By continuing, you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="login-form">
              <button type="button" className="back-btn" onClick={() => setStep('phone')}>← Back</button>
              <h3>Enter OTP</h3>
              <p className="login-subtitle">Sent to +91 {phone}</p>
              <div className="otp-boxes">
                {[0,1,2,3,4,5].map(i => (
                  <input
                    key={i}
                    type="tel"
                    maxLength={1}
                    className="otp-box"
                    value={otp[i] || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g,'');
                      const next = otp.split('');
                      next[i] = val;
                      const joined = next.join('').slice(0,6);
                      setOtp(joined);
                      if (val && e.target.nextSibling) e.target.nextSibling.focus();
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[i] && e.target.previousSibling) {
                        e.target.previousSibling.focus();
                      }
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <p className="otp-hint">💡 Demo: enter any 6 digits to login</p>
              <button type="submit" className="otp-btn" disabled={otp.length !== 6}>
                Verify &amp; Login ✓
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;
