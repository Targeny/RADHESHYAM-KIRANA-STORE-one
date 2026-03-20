import React, { useState, useEffect } from 'react';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    title: 'Stock up on daily essentials',
    subtitle: 'Get farm-fresh goodness & a range of exotic\nfruits, vegetables, eggs & more',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #0c831f 0%, #196e2e 100%)',
    icons: ['🥛', '🍎', '🍌', '🥚'],
  },
  {
    id: 2,
    title: 'Medicines at your doorstep',
    subtitle: 'Cough syrups, pain relief,\nvitamins & more — 10 min delivery',
    cta: 'Order Medicines',
    bg: 'linear-gradient(135deg, #029f9e 0%, #016d6d 100%)',
    icons: ['💊', '🩺', '🩹', '💉'],
  },
  {
    id: 3,
    title: 'Snacks for every craving',
    subtitle: 'Chips, chocolates, biscuits &\nall your favourite munchies',
    cta: 'Shop Snacks',
    bg: 'linear-gradient(135deg, #f8cb46 0%, #e8a010 100%)',
    textDark: true,
    icons: ['🍫', '🍟', '🍕', '🥐'],
  },
  {
    id: 4,
    title: 'Fresh Fruits & Vegetables',
    subtitle: 'Farm-to-door freshness,\ndelivered in minutes',
    cta: 'Shop Fresh',
    bg: 'linear-gradient(135deg, #32c872 0%, #0a8a3a 100%)',
    icons: ['🥕', '🍅', '🥦', '🍊'],
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="hero container">
      <div className="main-banner" style={{ background: slide.bg }}>
        <div className={`banner-content ${slide.textDark ? 'dark-text' : ''}`}>
          <h2>{slide.title}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{slide.subtitle}</p>
          <button className="cta-btn">{slide.cta}</button>
        </div>
        <div className="banner-image">
          <div className="mock-image-main">
            {slide.icons.map((icon, i) => (
              <span
                key={i}
                style={{
                  fontSize: i === 1 ? '100px' : i === 0 ? '80px' : '70px',
                  marginLeft: i > 0 ? '-18px' : '0',
                  zIndex: i === 1 ? 2 : 1,
                  position: 'relative',
                }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="sub-banners-row">
        <div className="sub-banner" style={{ background: 'linear-gradient(135deg, #2b52b2 0%, #1e3d8f 100%)' }}>
          <div className="sub-banner-content">
            <h3>Get printouts<br/>delivered</h3>
            <ul className="sub-banner-features">
              <li>✓ Safe &amp; secure</li>
              <li>✓ Convenient &amp; fast</li>
            </ul>
            <button className="sub-cta-btn">Order Now</button>
          </div>
          <div className="sub-banner-img">🖨️</div>
        </div>

        <div className="sub-banner" style={{ background: 'linear-gradient(135deg, #029f9e 0%, #018281 100%)' }}>
          <div className="sub-banner-content">
            <h3>Pharmacy at<br/>your doorstep!</h3>
            <p>Cough syrups, pain<br/>relief sprays &amp; more</p>
            <button className="sub-cta-btn">Order Now</button>
          </div>
          <div className="sub-banner-img">💊</div>
        </div>

        <div className="sub-banner" style={{ background: 'linear-gradient(135deg, #fcd32c 0%, #ebb402 100%)', color: '#000' }}>
          <div className="sub-banner-content">
            <h3 style={{ color: '#000' }}>Pet care supplies<br/>at your door</h3>
            <p style={{ color: '#333' }}>Food, treats, toys &amp; more</p>
            <button className="sub-cta-btn dark-btn">Order Now</button>
          </div>
          <div className="sub-banner-img">🐶</div>
        </div>

        <div className="sub-banner" style={{ background: 'linear-gradient(135deg, #c5d3df 0%, #90a5b8 100%)', color: '#000' }}>
          <div className="sub-banner-content">
            <h3 style={{ color: '#000' }}>No time for<br/>a diaper run?</h3>
            <p style={{ color: '#333' }}>Get baby care essentials</p>
            <button className="sub-cta-btn dark-btn">Order Now</button>
          </div>
          <div className="sub-banner-img">👶</div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
