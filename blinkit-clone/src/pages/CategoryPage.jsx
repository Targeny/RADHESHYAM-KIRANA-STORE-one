import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { getProductsByCategory } from '../data/products';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const category = categories.find(c => c.id === id);
  const catProducts = getProductsByCategory(id);

  if (!category) {
    return (
      <div className="not-found container">
        <h2>Category not found</h2>
        <Link to="/" className="back-home-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-page-hero" style={{ background: category.gradient }}>
        <div className="container category-hero-inner">
          <Link to="/" className="breadcrumb">← Home</Link>
          <div className="category-hero-content">
            <span className="category-hero-icon">{category.icon}</span>
            <div>
              <h1>{category.name}</h1>
              <p>{catProducts.length} products available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="category-page-body container">
        <aside className="category-sidebar">
          <h3>All Categories</h3>
          <ul>
            {categories.map(cat => (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.id}`}
                  className={`sidebar-cat-link ${cat.id === id ? 'active' : ''}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="category-products">
          {catProducts.length === 0 ? (
            <div className="no-products">
              <span>😕</span>
              <p>No products in this category yet.</p>
            </div>
          ) : (
            <div className="category-product-grid">
              {catProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
