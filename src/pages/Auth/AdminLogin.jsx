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
    console.log('Form submitted');
    setError('');
    console.log('Form data:', formData);

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    console.log('Validation passed, making API call');
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/login`;
      console.log('Calling API:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        setError(data.message || 'Invalid admin credentials');
        setIsLoading(false);
        return;
      }

      const token = data.data?.token;
      if (token) {
        console.log('✅ Storing admin token');
        localStorage.setItem('adminToken', token);
        localStorage.setItem('isAdminSession', 'true');
        localStorage.setItem('userRole', 'admin');
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        console.log('✅ Login successful, navigating to admin dashboard');
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
    <div className="al-page">
      {/* Ambient background orbs */}
      <div className="al-orb al-orb-1"></div>
      <div className="al-orb al-orb-2"></div>
      <div className="al-orb al-orb-3"></div>

      <div className="al-card">
        {/* ── LEFT: Login Form ── */}
        <div className="al-left">
          {/* Badge */}
          <div className="al-badge">
            <div className="al-badge-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                {/* City grid / building icon */}
                <rect x="2" y="18" width="6" height="12" rx="1" stroke="#6366F1" strokeWidth="1.5"/>
                <rect x="10" y="12" width="6" height="18" rx="1" stroke="#6366F1" strokeWidth="1.5"/>
                <rect x="18" y="8" width="6" height="22" rx="1" stroke="#6366F1" strokeWidth="1.5"/>
                <rect x="26" y="15" width="4" height="15" rx="1" stroke="#22D3EE" strokeWidth="1.5"/>
                <line x1="2" y1="30" x2="30" y2="30" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Blueprint details */}
                <line x1="12" y1="16" x2="14" y2="16" stroke="#22D3EE" strokeWidth="1" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="14" y2="19" stroke="#22D3EE" strokeWidth="1" strokeLinecap="round"/>
                <line x1="20" y1="12" x2="22" y2="12" stroke="#22D3EE" strokeWidth="1" strokeLinecap="round"/>
                <line x1="20" y1="15" x2="22" y2="15" stroke="#22D3EE" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="al-badge-glow"></div>
          </div>

          <h1 className="al-heading">Admin Control Access</h1>
          <p className="al-subtext">Secure platform access for Planning Insights management</p>

          {/* Error */}
          {error && (
            <div className="al-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="al-form" noValidate>
            <div className="al-field">
              <label htmlFor="email" className="al-label">Email Address</label>
              <div className="al-input-wrap">
                <svg className="al-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@planninginsights.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="al-input"
                />
              </div>
            </div>

            <div className="al-field">
              <label htmlFor="password" className="al-label">Password</label>
              <div className="al-input-wrap">
                <svg className="al-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="al-input al-input-pw"
                />
                <button
                  type="button"
                  className="al-pw-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3l18 18M10.5 10.5A2.25 2.25 0 0014.5 14M7.4 7.4A9.77 9.77 0 004 12c2.5 4.5 6 7 8 7a9.2 9.2 0 005.3-1.6M20 16c.8-1.1 1.3-2.3 1.3-4C19.5 7.5 15 5 12 5c-.7 0-1.4.09-2.1.27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5C8 5 4.5 7.5 2 12c2.5 4.5 6 7 10 7s7.5-2.5 10-7C19.5 7.5 16 5 12 5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="al-spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="al-footer">
            <button type="button" className="al-back-link" onClick={() => navigate('/login')}>
              ← Back to User Login
            </button>
            <div className="al-security-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v4c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All access attempts are logged &amp; monitored
            </div>
          </div>
        </div>

        {/* ── RIGHT: Visual Identity ── */}
        <div className="al-right">
          <div className="al-right-inner">
            {/* City SVG Illustration */}
            <div className="al-city-wrap">
              <svg className="al-city-svg" viewBox="0 0 480 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ground line */}
                <line x1="10" y1="240" x2="470" y2="240" stroke="#334155" strokeWidth="1.5"/>

                {/* Roads */}
                <line x1="120" y1="240" x2="120" y2="275" stroke="#1E3A5F" strokeWidth="8"/>
                <line x1="240" y1="240" x2="240" y2="275" stroke="#1E3A5F" strokeWidth="8"/>
                <line x1="360" y1="240" x2="360" y2="275" stroke="#1E3A5F" strokeWidth="8"/>
                <line x1="0" y1="260" x2="480" y2="260" stroke="#1E3A5F" strokeWidth="8"/>
                {/* Road dashes */}
                <line x1="0" y1="260" x2="90" y2="260" stroke="#334155" strokeWidth="1.5" strokeDasharray="10 8"/>
                <line x1="150" y1="260" x2="210" y2="260" stroke="#334155" strokeWidth="1.5" strokeDasharray="10 8"/>
                <line x1="270" y1="260" x2="330" y2="260" stroke="#334155" strokeWidth="1.5" strokeDasharray="10 8"/>
                <line x1="390" y1="260" x2="480" y2="260" stroke="#334155" strokeWidth="1.5" strokeDasharray="10 8"/>

                {/* Building 1 – Far left short */}
                <rect x="20" y="190" width="40" height="50" rx="2" stroke="#4F46E5" strokeWidth="1.2" fill="rgba(79,70,229,0.06)"/>
                <line x1="30" y1="200" x2="50" y2="200" stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.6"/>
                <line x1="30" y1="210" x2="50" y2="210" stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.6"/>
                <line x1="30" y1="220" x2="50" y2="220" stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.6"/>
                <line x1="40" y1="190" x2="40" y2="240" stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.4"/>

                {/* Building 2 – Tall tower left */}
                <rect x="75" y="110" width="35" height="130" rx="2" stroke="#4F46E5" strokeWidth="1.3" fill="rgba(79,70,229,0.08)"/>
                <rect x="83" y="100" width="19" height="15" rx="1" stroke="#22D3EE" strokeWidth="1" fill="rgba(34,211,238,0.05)"/>
                {[120,132,144,156,168,180,192,204,216,228].map((y, i) => (
                  <line key={i} x1="80" y1={y} x2="106" y2={y} stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.5"/>
                ))}
                <line x1="92" y1="110" x2="92" y2="240" stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.35"/>

                {/* Building 3 – Medium left-center */}
                <rect x="130" y="155" width="50" height="85" rx="2" stroke="#4F46E5" strokeWidth="1.3" fill="rgba(79,70,229,0.07)"/>
                {[165,177,189,201,213,225].map((y, i) => (
                  <line key={i} x1="135" y1={y} x2="175" y2={y} stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.5"/>
                ))}
                <line x1="155" y1="155" x2="155" y2="240" stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.35"/>
                {/* Windows lit */}
                <rect x="134" y="160" width="8" height="6" rx="1" fill="rgba(34,211,238,0.25)"/>
                <rect x="148" y="160" width="8" height="6" rx="1" fill="rgba(99,102,241,0.3)"/>
                <rect x="162" y="175" width="8" height="6" rx="1" fill="rgba(34,211,238,0.2)"/>

                {/* Building 4 – Tallest center */}
                <rect x="200" y="60" width="55" height="180" rx="2" stroke="#6366F1" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/>
                <rect x="212" y="48" width="30" height="16" rx="1" stroke="#22D3EE" strokeWidth="1.2" fill="rgba(34,211,238,0.06)"/>
                {/* Antenna */}
                <line x1="227" y1="28" x2="227" y2="48" stroke="#22D3EE" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="227" cy="26" r="3" fill="#22D3EE" fillOpacity="0.7"/>
                {[70,83,96,109,122,135,148,161,174,187,200,213,226].map((y, i) => (
                  <line key={i} x1="205" y1={y} x2="250" y2={y} stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.5"/>
                ))}
                <line x1="227" y1="60" x2="227" y2="240" stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.4"/>
                {/* Lit windows center */}
                <rect x="206" y="68" width="9" height="7" rx="1" fill="rgba(99,102,241,0.35)"/>
                <rect x="221" y="68" width="9" height="7" rx="1" fill="rgba(34,211,238,0.3)"/>
                <rect x="236" y="81" width="9" height="7" rx="1" fill="rgba(99,102,241,0.3)"/>
                <rect x="206" y="94" width="9" height="7" rx="1" fill="rgba(34,211,238,0.25)"/>
                <rect x="236" y="107" width="9" height="7" rx="1" fill="rgba(99,102,241,0.35)"/>

                {/* Building 5 - right-center medium */}
                <rect x="277" y="140" width="45" height="100" rx="2" stroke="#4F46E5" strokeWidth="1.3" fill="rgba(79,70,229,0.07)"/>
                {[150,162,174,186,198,210,222].map((y, i) => (
                  <line key={i} x1="282" y1={y} x2="317" y2={y} stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.5"/>
                ))}
                <rect x="283" y="148" width="8" height="6" rx="1" fill="rgba(34,211,238,0.22)"/>
                <rect x="298" y="162" width="8" height="6" rx="1" fill="rgba(99,102,241,0.28)"/>

                {/* Building 6 – right tall */}
                <rect x="337" y="90" width="42" height="150" rx="2" stroke="#6366F1" strokeWidth="1.4" fill="rgba(79,70,229,0.09)"/>
                <rect x="345" y="80" width="26" height="14" rx="1" stroke="#22D3EE" strokeWidth="1" fill="rgba(34,211,238,0.05)"/>
                {[100,113,126,139,152,165,178,191,204,217,230].map((y, i) => (
                  <line key={i} x1="342" y1={y} x2="374" y2={y} stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.5"/>
                ))}
                <rect x="343" y="98" width="8" height="6" rx="1" fill="rgba(99,102,241,0.3)"/>
                <rect x="358" y="114" width="8" height="6" rx="1" fill="rgba(34,211,238,0.28)"/>
                <rect x="343" y="140" width="8" height="6" rx="1" fill="rgba(99,102,241,0.35)"/>

                {/* Building 7 – far right short */}
                <rect x="400" y="180" width="48" height="60" rx="2" stroke="#4F46E5" strokeWidth="1.2" fill="rgba(79,70,229,0.06)"/>
                {[190,200,210,220,230].map((y, i) => (
                  <line key={i} x1="405" y1={y} x2="443" y2={y} stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.45"/>
                ))}

                {/* Connection data lines */}
                <line x1="227" y1="26" x2="358" y2="85" stroke="#22D3EE" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 6"/>
                <line x1="227" y1="26" x2="92" y2="105" stroke="#22D3EE" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 6"/>
                <line x1="358" y1="85" x2="424" y2="175" stroke="#6366F1" strokeWidth="0.7" strokeOpacity="0.2" strokeDasharray="4 6"/>

                {/* Data nodes */}
                <circle cx="227" cy="26" r="4" fill="#22D3EE" fillOpacity="0.9"/>
                <circle cx="358" cy="85" r="3" fill="#6366F1" fillOpacity="0.8"/>
                <circle cx="92" cy="105" r="3" fill="#6366F1" fillOpacity="0.7"/>
                <circle cx="155" cy="150" r="2.5" fill="#22D3EE" fillOpacity="0.6"/>
                <circle cx="299" cy="135" r="2.5" fill="#22D3EE" fillOpacity="0.6"/>
              </svg>

              <div className="al-city-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
