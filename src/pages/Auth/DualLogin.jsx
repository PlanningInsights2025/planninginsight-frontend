import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DualLogin.css';

const DualLogin = () => {
  const navigate = useNavigate();
  
  // State management
  const [currentRole, setCurrentRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminHint, setShowAdminHint] = useState(false);

  // Refs
  const emailInputRef = useRef(null);
  const toggleIndicatorRef = useRef(null);

  // Constants
  const ROLE_KEY = 'pi_last_role';
  const TRUSTED_DEVICES_KEY = 'pi_trusted_devices';
  const ADMIN_FAILS_KEY = 'pi_admin_fail_count';
  const ADMIN_LOCK_UNTIL_KEY = 'pi_admin_lock_until';

  // Load saved role on mount
  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_KEY);
    if (savedRole === 'admin' || savedRole === 'user') {
      setCurrentRole(savedRole);
    }
  }, []);

  // Position toggle indicator
  useEffect(() => {
    positionToggleIndicator();
  }, [currentRole]);

  const positionToggleIndicator = () => {
    const activeButton = document.querySelector('.role-toggle-pill.is-active');
    if (!activeButton || !toggleIndicatorRef.current) return;

    const buttonRect = activeButton.getBoundingClientRect();
    const parentRect = activeButton.parentElement.getBoundingClientRect();
    const left = buttonRect.left - parentRect.left;
    
    toggleIndicatorRef.current.style.transform = `translateX(${left}px)`;
    toggleIndicatorRef.current.style.width = `${buttonRect.width}px`;
  };

  // Admin rate limiting functions
  const getAdminLockInfo = () => {
    const now = Date.now();
    const lockUntil = Number(localStorage.getItem(ADMIN_LOCK_UNTIL_KEY) || 0);
    if (!lockUntil || now >= lockUntil) {
      return { locked: false, remainingMs: 0 };
    }
    return { locked: true, remainingMs: lockUntil - now };
  };

  const recordAdminFailure = () => {
    const fails = Number(localStorage.getItem(ADMIN_FAILS_KEY) || 0) + 1;
    localStorage.setItem(ADMIN_FAILS_KEY, String(fails));

    if (fails >= 3) {
      const lockMs = 15 * 60 * 1000; // 15 minutes
      const until = Date.now() + lockMs;
      localStorage.setItem(ADMIN_LOCK_UNTIL_KEY, String(until));
    }
  };

  const resetAdminFailures = () => {
    localStorage.removeItem(ADMIN_FAILS_KEY);
    localStorage.removeItem(ADMIN_LOCK_UNTIL_KEY);
  };

  const formatMinutes = (ms) => {
    return Math.max(1, Math.ceil(ms / 60000));
  };

  // Device trust functions
  const rememberTrustedDevice = () => {
    const id = crypto.randomUUID();
    const existing = JSON.parse(localStorage.getItem(TRUSTED_DEVICES_KEY) || '[]');
    existing.push({ id, createdAt: Date.now() });
    localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(existing));
  };

  const isKnownDevice = () => {
    const data = JSON.parse(localStorage.getItem(TRUSTED_DEVICES_KEY) || '[]');
    return data.length > 0;
  };

  // Email detection for admin mode
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Check if email looks like admin email
    const isAdminLike = value && value.toLowerCase().includes('-admin@');
    if (isAdminLike && currentRole === 'user') {
      setShowAdminHint(true);
      // Optionally auto-switch to admin mode
      // handleRoleChange('admin', true);
    } else {
      setShowAdminHint(false);
    }
  };

  // Handle role change
  const handleRoleChange = (role, fromEmailSuggestion = false) => {
    setCurrentRole(role);
    setError('');
    
    if (!fromEmailSuggestion) {
      localStorage.setItem(ROLE_KEY, role);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      setError(currentRole === 'admin' 
        ? 'Admin login requires email and password.' 
        : 'Please enter your email and password.');
      return false;
    }

    if (currentRole === 'admin') {
      if (!twoFactorCode || twoFactorCode.length !== 6) {
        setError('Enter your 6-digit admin 2FA code.');
        return false;
      }
      if (!securityQuestion || !securityAnswer.trim()) {
        setError('Select a security question and provide an answer.');
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check admin lockout
    if (currentRole === 'admin') {
      const lock = getAdminLockInfo();
      if (lock.locked) {
        setError(`Too many attempts. Admin access locked for ~${formatMinutes(lock.remainingMs)} more minutes.`);
        // Stealth: switch to user mode
        handleRoleChange('user');
        return;
      }
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = currentRole === 'admin' ? '/api/admin/login' : '/api/auth/login';
      
      const payload = {
        email,
        password,
        role: currentRole,
        ...(currentRole === 'admin' && {
          twoFactorCode,
          securityQuestion,
          securityAnswer,
          trustDevice,
        }),
        ...(currentRole === 'user' && {
          rememberMe,
        }),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Role': currentRole,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (currentRole === 'admin') {
          recordAdminFailure();
          setError('Admin credentials not recognized. Switching to User mode for safety.');
          handleRoleChange('user');
        } else {
          setError(data.message || 'Invalid credentials. Please try again.');
        }
        return;
      }

      // Success
      resetAdminFailures();

      if (currentRole === 'admin' && trustDevice) {
        rememberTrustedDevice();
      }

      // Check for new location warning
      if (currentRole === 'admin' && !isKnownDevice()) {
        console.warn('New device detected for admin login');
      }

      // Store token if provided
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      // Navigate to dashboard
      navigate(currentRole === 'admin' ? '/admin/dashboard' : '/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
    // Implement OAuth flow here
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>

      <main className="login-shell">
        <section className={`login-card ${currentRole}`} data-role={currentRole}>
          <header className="login-header">
            <h1>Welcome back</h1>
            <p className="login-subtitle">
              Sign in as <span className="role-label">{currentRole === 'admin' ? 'Admin' : 'User'}</span> to continue to Planning Insights.
            </p>
          </header>

          {/* Role Toggle */}
          <div className="role-toggle" role="radiogroup" aria-label="Authentication role">
            <button
              type="button"
              className={`role-toggle-pill ${currentRole === 'user' ? 'is-active' : ''}`}
              onClick={() => handleRoleChange('user')}
              aria-pressed={currentRole === 'user'}
            >
              <span className="role-icon">👤</span>
              <span className="role-text">User</span>
            </button>
            <button
              type="button"
              className={`role-toggle-pill ${currentRole === 'admin' ? 'is-active' : ''}`}
              onClick={() => handleRoleChange('admin')}
              aria-pressed={currentRole === 'admin'}
            >
              <span className="role-icon">🛡️</span>
              <span className="role-text">Admin</span>
            </button>
            <div ref={toggleIndicatorRef} className="role-toggle-indicator" aria-hidden="true"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email-input">Email</label>
              <div className="field-with-hint">
                <input
                  ref={emailInputRef}
                  id="email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  aria-describedby="email-hint"
                />
                <small id="email-hint" className="field-hint">
                  Use your work email. 
                  {showAdminHint && (
                    <span className="email-admin-hint"> Looks like an admin email – try Admin mode?</span>
                  )}
                </small>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* User-only options */}
            {currentRole === 'user' && (
              <>
                <div className="form-row user-only">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <div className="link-row">
                    <button type="button" className="link-button" onClick={() => navigate('/auth/forgot-password')}>
                      Forgot password?
                    </button>
                    <button type="button" className="link-button" onClick={() => navigate('/auth/signup')}>
                      Sign up
                    </button>
                  </div>
                </div>

                {/* Social Login */}
                <div className="social-row">
                  <span className="divider-label">Or continue with</span>
                  <div className="social-buttons">
                    <button
                      type="button"
                      className="social-btn social-google"
                      onClick={() => handleSocialLogin('google')}
                      aria-label="Sign in with Google"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="social-btn social-github"
                      onClick={() => handleSocialLogin('github')}
                      aria-label="Sign in with GitHub"
                    >
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Admin-only extras */}
            {currentRole === 'admin' && (
              <div className="admin-extra">
                <div className="form-group">
                  <label htmlFor="code-input">2FA Code</label>
                  <input
                    id="code-input"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength="6"
                    placeholder="6-digit code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="security-question">Security Question</label>
                  <select
                    id="security-question"
                    name="securityQuestion"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                  >
                    <option value="">Select a question</option>
                    <option value="city">What city did you grow up in?</option>
                    <option value="teacher">What was the name of your first teacher?</option>
                    <option value="pet">What was your first pet's name?</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="security-answer">Answer</label>
                  <input
                    id="security-answer"
                    name="securityAnswer"
                    type="text"
                    autoComplete="off"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                  />
                </div>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    id="trust-device"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                  />
                  <span>Trust this device for 7 days</span>
                </label>

                <div className="link-row admin-links">
                  <button type="button" className="link-button" onClick={() => navigate('/admin/help')}>
                    Admin help
                  </button>
                  <button type="button" className="link-button" onClick={() => navigate('/admin/emergency')}>
                    Emergency access
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="form-error" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className={`submit-btn ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
              <span className="btn-label">Sign in</span>
              {isLoading && <span className="btn-spinner" aria-hidden="true"></span>}
            </button>

            <p className="session-meta">
              {currentRole === 'admin' 
                ? 'Session: up to 2 hours (Admin mode)'
                : 'Session: up to 30 days (User mode)'}
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default DualLogin;
