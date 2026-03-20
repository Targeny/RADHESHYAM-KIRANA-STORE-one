import React, { useState } from 'react';
import './ReviewsSection.css';

const MOCK_REVIEWS = [
  { id: 1, name: 'Rahul S.', avatar: '🧑', rating: 5, text: 'Super fresh! Delivered in 9 minutes flat. Amazing quality.', date: '2 days ago' },
  { id: 2, name: 'Priya M.', avatar: '👩', rating: 4, text: 'Good quality, packaging was fine. Slightly pricey but totally worth the convenience.', date: '1 week ago' },
  { id: 3, name: 'Arjun K.', avatar: '🧔', rating: 5, text: 'Blinkit never disappoints! 10 minutes delivery is unbeatable.', date: '2 weeks ago' },
];

const StarInput = ({ value, onChange }) => (
  <div className="star-input">
    {[1,2,3,4,5].map(i => (
      <button
        key={i}
        type="button"
        className={`star-btn ${i <= value ? 'filled' : ''}`}
        onClick={() => onChange(i)}
      >★</button>
    ))}
  </div>
);

const ReviewsSection = ({ productId }) => {
  const storedKey = `blinkit_reviews_${productId}`;
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storedKey) || '[]');
      return [...MOCK_REVIEWS, ...stored];
    } catch { return MOCK_REVIEWS; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, text: '', name: '' });
  const [error, setError] = useState('');

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.rating) { setError('Please select a star rating'); return; }
    if (!form.text.trim()) { setError('Please write a review'); return; }
    const newReview = {
      id: Date.now(),
      name: form.name.trim() || 'Anonymous',
      avatar: '🧕',
      rating: form.rating,
      text: form.text.trim(),
      date: 'just now',
    };
    const stored = JSON.parse(localStorage.getItem(storedKey) || '[]');
    const updated = [newReview, ...stored];
    localStorage.setItem(storedKey, JSON.stringify(updated));
    setReviews(prev => [newReview, ...prev]);
    setForm({ rating: 0, text: '', name: '' });
    setError('');
    setShowForm(false);
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <div className="reviews-summary">
          <span className="big-rating">{avgRating}</span>
          <div>
            <div className="stars-display">
              {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
            </div>
            <span className="review-count">{reviews.length} reviews</span>
          </div>
        </div>
        <button className="write-review-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '✏️ Write a Review'}
        </button>
      </div>

      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <p className="review-form-title">Your Rating</p>
          <StarInput value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
          <input
            placeholder="Your name (optional)"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="review-name-input"
          />
          <textarea
            placeholder="Share your experience with this product..."
            value={form.text}
            onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
            rows={3}
            className="review-textarea"
          />
          {error && <p className="review-error">{error}</p>}
          <button type="submit" className="submit-review-btn">Submit Review 🚀</button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <div className="review-meta">
              <span className="reviewer-avatar">{r.avatar}</span>
              <div>
                <p className="reviewer-name">{r.name}</p>
                <span className="reviewer-date">{r.date}</span>
              </div>
              <div className="review-stars">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            </div>
            <p className="review-text">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
