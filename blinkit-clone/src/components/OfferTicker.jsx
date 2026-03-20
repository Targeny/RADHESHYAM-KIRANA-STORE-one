import React from 'react';
import './OfferTicker.css';

const offers = [
  '🎉 New User Offer: 20% OFF on first order (code: NEW20)',
  '🚀 Express Delivery in 8 minutes on all orders above ₹99',
  '🥦 Fresh Fruits & Vegetables — Farm to Door Daily',
  '☀️ Sunrise Special: 15% OFF on Dairy products before 9 AM',
  '💊 Pharmacy delivery now available in your area!',
  '🎁 Refer a friend & both of you get ₹50 off',
  '🛒 Free delivery on orders above ₹199',
];

const OfferTicker = () => {
  const repeated = [...offers, ...offers]; // duplicate for seamless loop

  return (
    <div className="offer-ticker">
      <div className="ticker-track">
        {repeated.map((offer, i) => (
          <span key={i} className="ticker-item">{offer}</span>
        ))}
      </div>
    </div>
  );
};

export default OfferTicker;
