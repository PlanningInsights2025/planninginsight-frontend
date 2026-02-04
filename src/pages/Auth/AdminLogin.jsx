import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const securityQuestions = [
    "What was your first pet's name?",
    "In what city were you born?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What is your favorite book?"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    setError('');

    // Log form data
    console.log('Form data:', formData);

    if (!validateForm()) {
      console.log('Validation failed'); // Debug log
      return;
    }

    console.log('Validation passed, making API call'); // Debug log
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/admin/login`;
      console.log('Calling API:', apiUrl); // Debug log
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      console.log('Response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        setError(data.message || 'Invalid admin credentials');
        setIsLoading(false);
        return;
      }

      // Store token from data.data.token location
      const token = data.data?.token;
      if (token) {
        console.log('✅ Storing admin token'); // Debug log
        // Store admin token in separate key to avoid mixing with user token
        localStorage.setItem('adminToken', token);
        localStorage.setItem('isAdminSession', 'true');
        localStorage.setItem('userRole', 'admin');
        
        // Store user data
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        
        console.log('✅ Login successful, navigating to admin dashboard'); // Debug log
        // Navigate to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        console.error('❌ No token found in response');
        setError('Login failed. No authentication token received.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('❌ Admin login error:', err);
      setError('Connection error. Please check if the server is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-background"></div>
      
      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Header */}
          <div className="admin-login-header">
            <div className="admin-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#524393" fillOpacity="0.2" stroke="#524393" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#524393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#524393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Admin Access</h1>
            <p>Secure administrator authentication</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="admin-error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {/* Email */}
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L21 21M10.5 10.5C10.0353 10.9646 9.75 11.6022 9.75 12.3C9.75 13.6912 10.8588 14.8 12.25 14.8C12.9478 14.8 13.5854 14.5147 14.05 14.05M7.36364 7.36364C5.40091 8.88182 4 11.0909 4 13.5C4 18 9 21 12 21C14.0909 21 15.9091 20.4 17.3636 19.3636M20 16C20.8182 14.9091 21.2727 13.7273 21.2727 12.5C21.2727 8 16.2727 5 13.2727 5C12.5455 5 11.8182 5.09091 11.1818 5.27273" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5C8 5 4.5 7.5 2 12C4.5 16.5 8 19 12 19C16 19 19.5 16.5 22 12C19.5 7.5 16 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="admin-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="admin-login-footer">
            <button
              type="button"
              className="footer-link"
              onClick={() => navigate('/login')}
            >
              ← Back to User Login
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>This is a secure admin area. All access attempts are logged.</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
