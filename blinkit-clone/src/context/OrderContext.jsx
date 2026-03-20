import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_orders');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('blinkit_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (cartItems, total, address) => {
    const newOrder = {
      id: Math.floor(100000 + Math.random() * 900000),
      items: cartItems,
      total,
      address,
      status: 'Delivered',
      date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const clearOrders = () => setOrders([]);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
