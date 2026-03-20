import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../data/products';
import './SearchResults.css';

const SearchResults = ({ query, onClose }) => {
  const results = query.length >= 2 ? searchProducts(query).slice(0, 8) : [];

  if (!query || query.length < 2) return null;

  return (
    <div className="search-results-dropdown">
      {results.length === 0 ? (
        <div className="search-no-results">
          <span>😕</span>
          <p>No results found for "<strong>{query}</strong>"</p>
        </div>
      ) : (
        <>
          <div className="search-results-header">
            <span>{results.length} result{results.length > 1 ? 's' : ''} for "{query}"</span>
          </div>
          <ul className="search-results-list">
            {results.map(product => (
              <li key={product.id} className="search-result-item">
                <Link to={`/category/${product.category}`} onClick={onClose} className="search-result-link">
                  <div className="search-result-icon" style={{ backgroundColor: product.color }}>
                    <span>{product.icon}</span>
                  </div>
                  <div className="search-result-info">
                    <span className="search-result-name">{product.name}</span>
                    <span className="search-result-weight">{product.weight}</span>
                  </div>
                  <span className="search-result-price">₹{product.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SearchResults;
