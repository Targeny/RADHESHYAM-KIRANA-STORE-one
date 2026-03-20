import React, { useEffect, useRef } from 'react';
import './Confetti.css';

const COLORS = ['#0c831f','#f8cb46','#e64a19','#1565c0','#ad1457','#00838f'];
const COUNT = 80;

function rand(min, max) { return min + Math.random() * (max - min); }

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: COUNT }, () => ({
      x: rand(0, canvas.width),
      y: rand(-100, 0),
      r: rand(6, 14),
      d: rand(0, COUNT),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: rand(-10, 10),
      tiltAngle: 0,
      tiltAngleIncrement: rand(0.05, 0.12),
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    let angle = 0;
    let frame;
    let elapsed = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;
      elapsed++;

      pieces.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(angle + p.d) + 2 + p.r / 8);
        p.x += Math.sin(angle);
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.save();
          ctx.translate(p.x + p.r / 2, p.y + p.r / 2);
          ctx.rotate(p.tiltAngle);
          ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
          ctx.restore();
        } else {
          ctx.arc(p.x, p.y, p.r / 3, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Reset when off screen
        if (p.y > canvas.height + 20) {
          pieces[i].y = -20;
          pieces[i].x = rand(0, canvas.width);
        }
      });

      if (elapsed < 200) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      aria-hidden="true"
    />
  );
};

export default Confetti;
