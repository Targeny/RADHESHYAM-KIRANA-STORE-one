import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.icon} Added to cart`, 'success');
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    addToast(`💔 Removed from Wishlist`, 'remove');
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty container">
        <div className="wishlist-empty-inner">
          <span>🤍</span>
          <h2>Your wishlist is empty</h2>
          <p>Save your favourite products here to buy them later.</p>
          <Link to="/" className="browse-link">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header">
        <h1>❤️ My Wishlist</h1>
        <span className="wishlist-count">{wishlist.length} item{wishlist.length > 1 ? 's' : ''}</span>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(product => {
          const inCart = cartItems.find(i => i.id === product.id);
          return (
            <div key={product.id} className="wishlist-card">
              <button className="wl-remove-btn" onClick={() => handleRemove(product)} title="Remove from wishlist">
                ✕
              </button>

              <Link to={`/product/${product.id}`} className="wl-image">
                <div className="wl-image-box" style={{ backgroundColor: product.color }}>
                  <span>{product.icon}</span>
                </div>
              </Link>

              <div className="wl-info">
                <Link to={`/product/${product.id}`} className="wl-name">{product.name}</Link>
                <p className="wl-weight">{product.weight}</p>
                <div className="wl-price-row">
                  <span className="wl-price">₹{product.price}</span>
                  {product.mrp && <span className="wl-mrp">₹{product.mrp}</span>}
                  {product.discount && <span className="wl-off">{product.discount}% off</span>}
                </div>
              </div>

              <button
                className={`wl-add-btn ${inCart ? 'in-cart' : ''}`}
                onClick={() => handleAddToCart(product)}
              >
                {inCart ? '✓ In Cart' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
