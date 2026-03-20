import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import './CategoryGrid.css';

const CategoryGrid = () => {
  return (
    <section className="categories container">
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={`/category/${category.id}`} key={category.id} className="category-card">
            <div
              className="category-icon-wrapper"
              style={{ background: category.gradient }}
            >
              <span className="category-icon">{category.icon}</span>
            </div>
            <h4 className="category-name">{category.name}</h4>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
