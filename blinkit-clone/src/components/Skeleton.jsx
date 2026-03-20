import React from 'react';
import './Skeleton.css';

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-subtitle" />
    <div className="skeleton skeleton-action" />
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
