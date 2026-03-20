import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductSection.css';

const ProductSection = ({ title, products, viewAllLink }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="product-section container">
      <div className="section-header">
        <div className="section-title-group">
          <h2 className="section-title">{title}</h2>
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="see-all-btn">
            See All →
          </Link>
        )}
      </div>

      <div className="product-scroll-track">
        {products.map(product => (
          <div key={product.id} className="product-scroll-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
