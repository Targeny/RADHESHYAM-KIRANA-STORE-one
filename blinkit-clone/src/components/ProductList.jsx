import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const products = [
  { id: 1, name: 'Amul Taaza Toned Fresh Milk', weight: '500 ml', price: 27, mrp: 28, discount: 3, icon: '🥛', color: '#e3f2fd' },
  { id: 2, name: 'Harvest Gold White Bread', weight: '400 g', price: 40, icon: '🍞', color: '#fff3e0' },
  { id: 3, name: 'Farmley Premium California Almonds', weight: '200 g', price: 298, mrp: 499, discount: 40, icon: '🌰', color: '#efebe9' },
  { id: 4, name: 'Lay\'s India\'s Magic Masala Potato Chips', weight: '50 g', price: 20, icon: '🥔', color: '#fff8e1' },
  { id: 5, name: 'Coca-Cola Original Taste', weight: '750 ml', price: 40, icon: '🥤', color: '#ffebee' },
  { id: 6, name: 'Maggi 2-Minute Noodles', weight: '70 g', price: 14, icon: '🍜', color: '#fffde7' },
];

const ProductList = ({ title = "Recommended For You" }) => {
  return (
    <section className="product-list-section container">
      <div className="section-header">
        <h2>{title}</h2>
        <button className="view-all-btn">See All</button>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
