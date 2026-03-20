import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route to require authentication.
 * If not logged in, redirects to home and saves the intended path
 * so the LoginModal can redirect back after login.
 */
const ProtectedRoute = ({ children, openLogin }) => {
  const { isLoggedIn, setRedirectPath } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    setRedirectPath(location.pathname);
    // Trigger the login modal via a custom event so App can open it
    window.dispatchEvent(new CustomEvent('blinkit:requireLogin'));
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
