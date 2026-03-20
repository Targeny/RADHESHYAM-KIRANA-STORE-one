import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductSection from '../components/ProductSection';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);

  const cartItem = cartItems.find(item => item.id === product?.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const wishlisted = product ? isWishlisted(product.id) : false;

  const relatedProducts = product
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8)
    : [];

  const category = product ? categories.find(c => c.id === product.category) : null;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [id]);

  if (!product) {
    return (
      <div className="not-found container">
        <h2>Product not found</h2>
        <Link to="/" className="back-home-link">← Back to Home</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product);
    if (quantity === 0) addToast(`${product.icon} Added to cart`, 'success');
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    addToast(added ? `❤️ Added to Wishlist` : `💔 Removed from Wishlist`, added ? 'success' : 'remove');
  };

  if (loading) {
    return (
      <div className="product-detail container">
        <div className="pd-skeleton">
          <div className="pd-skel-image skeleton" />
          <div className="pd-skel-info">
            <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 36, width: '80%', marginBottom: 16, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 24, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 48, width: '50%', borderRadius: 12 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          {category && <Link to={`/category/${category.id}`}>{category.name}</Link>}
          <span>›</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="pd-layout">
          {/* Image Panel */}
          <div className="pd-image-panel">
            <div className="pd-image-box" style={{ backgroundColor: product.color }}>
              <span className="pd-emoji">{product.icon}</span>
              {product.discount && (
                <div className="pd-discount-badge">{product.discount}% OFF</div>
              )}
            </div>
            <div className="pd-quick-actions">
              <button className={`pd-wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist}>
                {wishlisted ? '❤️' : '🤍'} {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button className="pd-share-btn">📤 Share</button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="pd-info">
            {product.badge && <span className="pd-label-badge">{product.badge}</span>}
            <h1 className="pd-name">{product.name}</h1>
            <p className="pd-weight">📦 {product.weight}</p>
            <div className="pd-delivery-tag">⏱ Delivery in <strong>10 minutes</strong></div>
            {product.rating && (
              <div className="pd-rating">
                <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
                <span className="rating-num">{product.rating}/5</span>
                <span className="rating-count">(1,240 ratings)</span>
              </div>
            )}

            <div className="pd-price-section">
              <span className="pd-price">₹{product.price}</span>
              {product.mrp && <span className="pd-mrp">MRP ₹{product.mrp}</span>}
              {product.discount && <span className="pd-saving">You save ₹{product.mrp - product.price}</span>}
            </div>

            <div className="pd-add-section">
              {quantity === 0 ? (
                <button className="pd-add-btn" onClick={handleAdd}>
                  🛒 Add to Cart
                </button>
              ) : (
                <div className="pd-qty-controls">
                  <button className="pd-qty-btn" onClick={() => removeFromCart(product.id)}>−</button>
                  <span className="pd-qty-num">{quantity}</span>
                  <button className="pd-qty-btn" onClick={handleAdd}>+</button>
                </div>
              )}
            </div>

            <div className="pd-highlights">
              <h3>Product Highlights</h3>
              <ul>
                <li>✅ 100% Fresh &amp; Authentic</li>
                <li>✅ No added preservatives</li>
                <li>✅ Express 10-min delivery</li>
                <li>✅ Easy returns within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <ProductSection
              title={`More from ${category?.name || 'this category'}`}
              products={relatedProducts}
              viewAllLink={`/category/${product.category}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
