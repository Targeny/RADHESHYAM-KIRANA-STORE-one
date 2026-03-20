import React, { useState } from 'react';
import Footer from '../components/Footer';
import './HelpPage.css';

const FAQS = [
  { q: 'How fast is delivery?', a: 'We deliver most items in 8–10 minutes. In some areas, delivery may take up to 20 minutes during peak hours.' },
  { q: 'What is the delivery fee?', a: 'Delivery fee is ₹25 on orders below ₹199. Orders above ₹199 get free delivery.' },
  { q: 'Can I cancel my order?', a: 'You can cancel your order within 60 seconds of placing it. After that, the order is in progress and cannot be cancelled.' },
  { q: 'What if an item is missing from my order?', a: 'If an item is missing, please contact our support team immediately. We will refund or redeliver the missing item.' },
  { q: 'Do you have a minimum order value?', a: 'No minimum order value! You can order even a single item.' },
  { q: 'How do I apply a coupon?', a: 'Go to your cart, scroll to the "Apply Coupon" section, type in the coupon code, and click Apply.' },
  { q: 'Is my payment information secure?', a: 'Yes! We use industry-standard SSL encryption. We do not store card details on our servers.' },
  { q: 'Can I schedule a delivery for later?', a: 'Currently we only offer immediate express delivery. Scheduled deliveries may be available soon.' },
  { q: 'What areas do you deliver to?', a: 'We currently deliver across major cities. Enter your pincode on the homepage to check availability in your area.' },
  { q: 'How do I track my order?', a: 'Once your order is placed, you can track live status on the Order Success page and in your Order History.' },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="container">
          <h1>How can we help you? 👋</h1>
          <p>Find answers to common questions below, or chat with us directly</p>
        </div>
      </div>

      <div className="container help-content">
        {/* Quick Actions */}
        <div className="help-quick-actions">
          {[
            { icon: '📦', label: 'Track Order' },
            { icon: '🔄', label: 'Return / Refund' },
            { icon: '💬', label: 'Live Chat' },
            { icon: '📞', label: 'Call Us' },
          ].map(a => (
            <button key={a.label} className="quick-action-btn">
              <span>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  {faq.q}
                  <span className="faq-arrow">{openIndex === i ? '▲' : '▼'}</span>
                </button>
                {openIndex === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Box */}
        <div className="help-contact-box">
          <h3>Still need help?</h3>
          <p>Our support team is available 24/7 to assist you.</p>
          <div className="help-contact-actions">
            <button className="contact-chat-btn">💬 Chat with us</button>
            <a href="tel:+919999999999" className="contact-call-btn">📞 +91 99999-99999</a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpPage;
