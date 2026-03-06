import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protected Route Component for Admin Pages
 * Verifies token with backend and checks admin role
 * Redirects to admin login if not authenticated or not admin
 */
const ProtectedAdminRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const isAdminSession = localStorage.getItem('isAdminSession');
    const userRole = localStorage.getItem('userRole');

    if (token && (isAdminSession === 'true' || userRole === 'admin')) {
      // Verify the token is still valid by calling a protected admin endpoint
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/admin/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok || response.status === 500) {
          // 500 means DB issue but token is valid; 401/403 means token is bad
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdminSession');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Network error — trust the stored token
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#EEF3CE'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #524393', 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#524393', fontWeight: 600 }}>Verifying access...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
