import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Skeleton';
import './SearchPage.css';

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sort, setSort] = useState('relevant');

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    // Text search
    if (query.length >= 2) {
      result = result.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price filter
    result = result.filter(p => p.price <= maxPrice);

    // Discount filter
    if (minDiscount > 0) {
      result = result.filter(p => (p.discount || 0) >= minDiscount);
    }

    // Sort
    switch (sort) {
      case 'price_asc':   return [...result].sort((a, b) => a.price - b.price);
      case 'price_desc':  return [...result].sort((a, b) => b.price - a.price);
      case 'rating':      return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'discount':    return [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:            return result;
    }
  }, [query, selectedCategories, maxPrice, minDiscount, sort]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(1000);
    setMinDiscount(0);
    setSort('relevant');
  };

  const hasFilters = selectedCategories.length > 0 || maxPrice < 1000 || minDiscount > 0;

  return (
    <div className="search-page container">
      {/* Search header */}
      <div className="search-page-header">
        <h1>
          {query ? (
            <>Results for "<span className="search-query-highlight">{query}</span>"</>
          ) : (
            'Browse All Products'
          )}
        </h1>
        <p className="search-result-count">{filteredProducts.length} products found</p>
      </div>

      <div className="search-layout">
        {/* Filters Sidebar */}
        <aside className="search-filters">
          <div className="filter-header">
            <h3>Filters</h3>
            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
            )}
          </div>

          {/* Sort */}
          <div className="filter-section">
            <h4>Sort By</h4>
            <div className="sort-options">
              {SORT_OPTIONS.map(opt => (
                <label key={opt.value} className={`sort-option ${sort === opt.value ? 'active' : ''}`}>
                  <input type="radio" name="sort" value={opt.value} checked={sort === opt.value} onChange={() => setSort(opt.value)} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="category-checkboxes">
              {categories.map(cat => (
                <label key={cat.id} className={`cat-checkbox ${selectedCategories.includes(cat.id) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h4>Max Price: ₹{maxPrice}</h4>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
            <div className="slider-labels"><span>₹10</span><span>₹1000</span></div>
          </div>

          {/* Min Discount */}
          <div className="filter-section">
            <h4>Min Discount: {minDiscount}%</h4>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={minDiscount}
              onChange={e => setMinDiscount(Number(e.target.value))}
              className="price-slider"
            />
            <div className="slider-labels"><span>0%</span><span>50%</span></div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="search-results-grid">
          {filteredProducts.length === 0 ? (
            <div className="search-empty">
              <span>🔍</span>
              <h2>No products found</h2>
              <p>Try adjusting your search or filters.</p>
              <button className="clear-filters-btn large" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="search-product-grid">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
