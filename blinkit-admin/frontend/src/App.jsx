import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import CouponsPage from './pages/CouponsPage';
import BannersPage from './pages/BannersPage';
import './App.css';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/orders': 'Orders',
  '/users': 'Users',
  '/coupons': 'Coupons',
  '/banners': 'Banners',
};

function ProtectedLayout() {
  const { admin, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) return <div className="app-loading"><div className="spinner" /></div>;
  if (!admin) return <Navigate to="/login" replace />;

  const title = PAGE_TITLES[location.pathname] || 'Admin';

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Topbar onMenuToggle={() => setMobileOpen(v => !v)} title={title} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/banners" element={<BannersPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
