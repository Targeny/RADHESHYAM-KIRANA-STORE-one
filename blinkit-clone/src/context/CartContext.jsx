import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_cart');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const deliveryFee = 15;

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('blinkit_cart', JSON.stringify(cartItems));
    let totals = 0;
    let count = 0;
    cartItems.forEach(item => {
      totals += item.price * item.quantity;
      count += item.quantity;
    });
    setCartTotal(totals);
    setItemCount(count);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem.quantity === 1) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('blinkit_cart');
  };

  const bulkAddToCart = (items) => {
    setCartItems(items.map(item => ({ ...item, quantity: item.quantity || 1 })));
  };

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    deliveryFee,
    finalTotal: cartTotal > 0 ? cartTotal + deliveryFee : 0,
    addToCart,
    removeFromCart,
    clearCart,
    bulkAddToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
