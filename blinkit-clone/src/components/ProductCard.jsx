import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();

  const cartItem = cartItems.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product);
    if (quantity === 0) addToast(`${product.icon} Added to cart`, 'success');
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    if (quantity === 1) addToast(`Removed from cart`, 'remove');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    const added = toggleWishlist(product);
    addToast(added ? `❤️ Wishlisted!` : `💔 Removed from Wishlist`, added ? 'success' : 'remove');
  };

  return (
    <div className="product-card glass-effect">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <div className="product-image-placeholder" style={{ backgroundColor: product.color }}>
            <span className="product-emoji">{product.icon}</span>
          </div>
        </Link>
        {product.discount && (
          <div className="product-badge discount">{product.discount}% OFF</div>
        )}
        {product.badge && !product.discount && (
          <div className="product-badge label">{product.badge}</div>
        )}
        <button
          className={`wishlist-heart-btn ${wishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-info">
        <div className="product-time">⏱ 10 MINS</div>
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <p className="product-weight">{product.weight}</p>
        {product.rating && (
          <div className="product-rating">⭐ {product.rating}</div>
        )}

        <div className="product-action">
          <div className="price-container">
            <span className="current-price">₹{product.price}</span>
            {product.mrp && <span className="mrp-price">₹{product.mrp}</span>}
          </div>
          {quantity === 0 ? (
            <button className="add-button" onClick={handleAdd}>
              ADD<span className="add-plus">+</span>
            </button>
          ) : (
            <div className="quantity-controls">
              <button className="qty-btn minus" onClick={handleRemove}>-</button>
              <span className="qty-count">{quantity}</span>
              <button className="qty-btn plus" onClick={handleAdd}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
