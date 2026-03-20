import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('blinkit_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(p => p.id === product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isWishlisted = (productId) => !!wishlist.find(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
