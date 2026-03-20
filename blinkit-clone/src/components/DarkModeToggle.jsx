import React, { useEffect, useState } from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('blinkit_theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('blinkit_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className={`dark-toggle ${dark ? 'on' : ''}`}
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="toggle-knob">{dark ? '🌙' : '☀️'}</span>
    </button>
  );
};

export default DarkModeToggle;
