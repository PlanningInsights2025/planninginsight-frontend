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
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
    console.log('🔒 ProtectedAdminRoute - Checking auth...');
    console.log('🔒 Token exists:', !!token);

    if (!token) {
      console.log('🔒 No token found - BLOCKING ACCESS');
      setIsChecking(false);
      setIsAuthenticated(false);
      return;
    }

    console.log('🔒 Token found, verifying with backend...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('🔒 Backend response status:', response.status);

      if (!response.ok) {
        console.log('🔒 Token invalid - BLOCKING ACCESS');
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      const data = await response.json();
      console.log('🔒 User role:', data.role);

      if (data.role === 'admin') {
        console.log('🔒 Admin verified - GRANTING ACCESS');
        setIsAuthenticated(true);
      } else {
        console.log('🔒 Not admin - BLOCKING ACCESS');
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('🔒 Auth check failed:', error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
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
