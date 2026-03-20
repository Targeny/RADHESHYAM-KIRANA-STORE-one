import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/Header';
import Cart from './components/Cart';
import MobileNav from './components/MobileNav';
import ScrollToTop from './components/ScrollToTop';
import FloatingChat from './components/FloatingChat';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import OffersPage from './pages/OffersPage';
import HelpPage from './pages/HelpPage';

import './components/Toast.css';
import './components/Skeleton.css';
import './App.css';

function AppShell() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Listen for ProtectedRoute trigger
  useEffect(() => {
    const handleRequireLogin = () => setShowLoginModal(true);
    window.addEventListener('blinkit:requireLogin', handleRequireLogin);
    return () => window.removeEventListener('blinkit:requireLogin', handleRequireLogin);
  }, []);

  const handleLoginClose = (redirectTo) => {
    setShowLoginModal(false);
    if (redirectTo && redirectTo !== '/') navigate(redirectTo);
  };

  return (
    <div className="app">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Protected routes */}
          <Route path="/wishlist" element={
            <ProtectedRoute><WishlistPage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><OrdersPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Routes>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileNav onCartClick={() => setIsCartOpen(true)} />
      <ScrollToTop />
      <FloatingChat />

      {showLoginModal && <LoginModal onClose={handleLoginClose} />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <ToastProvider>
                <AppShell />
              </ToastProvider>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
