import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../../services/api/firebaseAuth";
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
  const [currentRole, setCurrentRole] = useState('user'); // 'user' or 'admin'
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, setAuthState } = useAuth()
  const { showNotification } = useNotification()
  const [loading, setLoading] = useState(false)

  // Load saved role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('pi_last_role');
    if (savedRole === 'admin' || savedRole === 'user') {
      setCurrentRole(savedRole);
    }
  }, []);

  // Admin rate limiting functions
  const checkAdminLockout = () => {
    const lockUntil = Number(localStorage.getItem('pi_admin_lock_until') || 0);
    if (lockUntil && Date.now() < lockUntil) {
      const remainingMin = Math.ceil((lockUntil - Date.now()) / 60000);
      return {
        locked: true,
        message: `Too many failed admin attempts. Try again in ${remainingMin} minutes.`
      };
    }
    return { locked: false };
  };

  const recordAdminFailure = () => {
    const fails = Number(localStorage.getItem('pi_admin_fail_count') || 0) + 1;
    localStorage.setItem('pi_admin_fail_count', String(fails));
    
    if (fails >= 3) {
      const lockMs = 15 * 60 * 1000;
      const until = Date.now() + lockMs;
      localStorage.setItem('pi_admin_lock_until', String(until));
    }
  };

  const resetAdminFailures = () => {
    localStorage.removeItem('pi_admin_fail_count');
    localStorage.removeItem('pi_admin_lock_until');
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setError('');
    localStorage.setItem('pi_last_role', role);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
    ;(async () => {
      setLoading(true)
      try {
        // Try backend login with email/password
        console.log('🔐 Login: Attempting backend login...')
        const response = await fetch(`http://localhost:3000/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })
        
        const data = await response.json()
        console.log('📥 Login: Backend response:', data)
        
        if (data.success && data.data?.token && data.data?.user) {
          // Save token
          console.log('🔑 Login: Saving token...')
          localStorage.setItem('authToken', data.data.token)
          
          // Format and set user data
          const formattedUser = {
            id: data.data.user.id || data.data.user._id,
            email: data.data.user.email,
            firstName: data.data.user.profile?.firstName || '',
            lastName: data.data.user.profile?.lastName || '',
            displayName: `${data.data.user.profile?.firstName || ''} ${data.data.user.profile?.lastName || ''}`.trim() || data.data.user.email,
            role: data.data.user.role || 'user',
            emailVerified: data.data.user.emailVerified || true,
            status: data.data.user.status || 'active',
            photoURL: data.data.user.profile?.avatar || null,
            profile: data.data.user.profile || {}
          }
          
          console.log('👤 Login: Setting auth state...')
          setAuthState(formattedUser)
          console.log('✅ Login: Success!')
          
          showNotification('Signed in successfully', 'success')
          navigate('/dashboard', { replace: true })
        } else {
          showNotification(data.message || 'Login failed', 'error')
        }
      } catch (err) {
        console.error('❌ Login error:', err)
        showNotification(err?.message || 'Login failed', 'error')
      } finally {
        setLoading(false)
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    setError('');
    setLoading(true);

    try {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      const endpoint = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/login`;

      const payload = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid credentials');
        showNotification(data.message || 'Login failed', 'error');
        setLoading(false);
        return;
      }

      // Success
<<<<<<< HEAD
=======
=======
      // Admin lockout check
      if (currentRole === 'admin') {
        const lockCheck = checkAdminLockout();
        if (lockCheck.locked) {
          setError(lockCheck.message);
          showNotification(lockCheck.message, 'error');
          // Switch to user mode (stealth)
          handleRoleChange('user');
          setLoading(false);
          return;
        }
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
      }

      // Validate admin-specific fields
      if (currentRole === 'admin') {
        if (!twoFactorCode || twoFactorCode.length !== 6) {
          setError('Please enter your 6-digit 2FA code');
          setLoading(false);
          return;
        }
        if (!securityQuestion || !securityAnswer.trim()) {
          setError('Please answer the security question');
          setLoading(false);
          return;
        }
      }

      // Choose endpoint based on role
      const endpoint = currentRole === 'admin' 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/admin/login`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/login`;

      const payload = {
        email: formData.email,
        password: formData.password,
        role: currentRole,
        ...(currentRole === 'admin' && {
          twoFactorCode,
          securityQuestion,
          securityAnswer,
          trustDevice,
          deviceId: localStorage.getItem('device_id') || crypto.randomUUID()
        }),
        ...(currentRole === 'user' && {
          rememberMe: formData.rememberMe,
        }),
      };

      // Store device ID
      if (currentRole === 'admin' && !localStorage.getItem('device_id')) {
        localStorage.setItem('device_id', payload.deviceId);
      }

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
          showNotification('Invalid admin credentials', 'error');
          handleRoleChange('user');
        } else {
          setError(data.message || 'Invalid credentials');
          showNotification(data.message || 'Login failed', 'error');
        }
        setLoading(false);
        return;
      }

      // Success
      resetAdminFailures();

>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      if (data.token || data.data?.token) {
        const token = data.token || data.data.token;
        localStorage.setItem('authToken', token);
      }

      // Update auth context with user data
      if (data.data?.user) {
        const userData = {
          id: data.data.user.id,
          email: data.data.user.email,
          role: data.data.user.role,
          firstName: data.data.user.profile?.firstName || '',
          lastName: data.data.user.profile?.lastName || '',
          displayName: `${data.data.user.profile?.firstName || ''} ${data.data.user.profile?.lastName || ''}`.trim(),
          photoURL: data.data.user.profile?.photoURL || null
        };
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
        await login(userData);
      }

      showNotification('Signed in successfully', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
<<<<<<< HEAD
=======
=======
        // Call login with userData to update context
        await login(userData);
      }

      showNotification(`Signed in as ${currentRole}`, 'success');
      
      // Small delay to ensure context updates
      setTimeout(() => {
        navigate(currentRole === 'admin' ? '/admin/dashboard' : '/dashboard');
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      }, 100);

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      showNotification(err?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle()
      console.log('✅ Google sign-in successful:', user)
      
      // Call backend to get JWT token
      try {
        console.log('🔄 Calling backend for JWT token...')
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/google-login`
        console.log('Backend URL:', apiUrl)
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        });
        
        const data = await response.json();
        console.log('Backend response:', data)
        
        if (response.ok && data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('✅ JWT token stored successfully')
        } else {
          console.error('❌ Backend did not return token:', data)
        }
      } catch (backendError) {
        console.error('❌ Backend token fetch failed:', backendError);
        showNotification('Warning: Backend authentication failed. Some features may be limited.', 'warning')
      }
      
      showNotification('Signed in with Google', 'success')
      navigate('/dashboard')
    } catch (err) {
      console.error('Google sign-in error', err)
      showNotification(err?.message || 'Google sign-in failed', 'error')
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    container: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    },
    backgroundShapes: {
      position: "absolute",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: 0,
    },
    shape: {
      position: "absolute",
      borderRadius: "50%",
      opacity: 0.1,
    },
    shape1: {
      width: "500px",
      height: "500px",
      background: "#fff",
      top: "-250px",
      left: "-250px",
      animation: "float 8s ease-in-out infinite",
    },
    shape2: {
      width: "400px",
      height: "400px",
      background: "#fff",
      bottom: "-200px",
      right: "-200px",
      animation: "float 10s ease-in-out infinite reverse",
    },
    shape3: {
      width: "300px",
      height: "300px",
      background: "#fff",
      top: "50%",
      right: "10%",
      animation: "float 12s ease-in-out infinite",
    },
    card: {
      background: "#fff",
      borderRadius: "20px",
      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.3)",
      position: "relative",
      overflow: "hidden",
      width: "1000px",
      maxWidth: "100%",
      minHeight: "650px",
      display: "flex",
      zIndex: 1,
    },
    formContainer: {
      width: "60%",
      padding: "60px 50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      zIndex: 2,
    },
    form: {
      width: "100%",
      maxWidth: "550px",
    },
    title: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "8px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "15px",
      color: "#666",
      marginBottom: "35px",
      textAlign: "center",
      fontWeight: "400",
    },
    socialContainer: {
      display: "flex",
      gap: "15px",
      marginBottom: "25px",
      justifyContent: "center",
    },
    socialBase: {
      border: "2px solid",
      borderRadius: "12px",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50px",
      width: "50px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontSize: "20px",
      fontWeight: "700",
    },
    google: {
      borderColor: "#ea4335",
      color: "#ea4335",
      background: "#fff",
    },
    linkedin: {
      borderColor: "#0a66c2",
      color: "#0a66c2",
      background: "#fff",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "30px 0",
      color: "#999",
      fontSize: "14px",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#e8e8e8",
    },
    dividerText: {
      padding: "0 20px",
      fontWeight: "500",
      color: "#888",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#555",
      marginBottom: "8px",
      display: "block",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    input: {
      background: "#f7f8fa",
      border: "2px solid #e8e8e8",
      padding: "14px 18px",
      width: "100%",
      borderRadius: "12px",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
      color: "#333",
    },
    passwordContainer: {
      position: "relative",
    },
    eyeButton: {
      position: "absolute",
      right: "18px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
      padding: "5px",
      color: "#999",
      transition: "color 0.3s ease",
    },
    rememberRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      fontSize: "14px",
    },
    checkbox: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#666",
      cursor: "pointer",
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "600",
      transition: "color 0.3s ease",
    },
    button: {
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      fontSize: "15px",
      fontWeight: "700",
      padding: "16px 40px",
      width: "100%",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      left: "60%",
      width: "40%",
      height: "100%",
      overflow: "hidden",
      zIndex: 100,
    },
    overlay: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 60px",
      textAlign: "center",
    },
    overlayContent: {
      maxWidth: "400px",
    },
    overlayTitle: {
      fontSize: "42px",
      fontWeight: "800",
      marginBottom: "20px",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      lineHeight: "1.2",
    },
    overlayText: {
      fontSize: "16px",
      lineHeight: "28px",
      marginBottom: "40px",
      opacity: 0.95,
      fontWeight: "400",
    },
    ghostButton: {
      borderRadius: "30px",
      border: "2px solid #fff",
      background: "transparent",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "700",
      padding: "16px 50px",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
    },
    features: {
      marginTop: "40px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      textAlign: "left",
    },
    feature: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "15px",
    },
    checkIcon: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          
          * { box-sizing: border-box; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
          }

          /* Button spinner */
          .btn-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(254, 248, 248, 0.45);
            border-top-color: #ffffff;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          input:focus {
            border-color: #667eea !important;
            background: #fff !important;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
          }
          
          .social-google:hover {
            background: #ea4335 !important;
            color: #fff !important;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(234, 67, 53, 0.3);
          }
          
          .social-linkedin:hover {
            background: #0a66c2 !important;
            color: #fff !important;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(10, 102, 194, 0.3);
          }
          
          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
          }
          
          .submit-btn:active {
            transform: translateY(0);
          }
          
          .ghost-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
          }
          
          .eye-btn:hover {
            color: #667eea;
          }
          
          @media (max-width: 900px) {
            .form-container {
              width: 100% !important;
              padding: 40px 30px !important;
            }
            .overlay-container {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={styles.backgroundShapes}>
        <div style={{ ...styles.shape, ...styles.shape1 }}></div>
        <div style={{ ...styles.shape, ...styles.shape2 }}></div>
        <div style={{ ...styles.shape, ...styles.shape3 }}></div>
      </div>

      <div style={styles.card}>
        <div className="form-container" style={styles.formContainer}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to continue your journey</p>

            {/* Role Toggle */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              padding: '4px',
              background: 'rgba(102, 126, 234, 0.08)',
              borderRadius: '12px',
              marginBottom: '20px',
              position: 'relative',
            }}>
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: currentRole === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: currentRole === 'user' ? '#fff' : '#666',
                  fontWeight: currentRole === 'user' ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: currentRole === 'user' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                }}
              >
                <PersonIcon sx={{ fontSize: 18 }} /> User
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: currentRole === 'admin' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'transparent',
                  color: currentRole === 'admin' ? '#fff' : '#666',
                  fontWeight: currentRole === 'admin' ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: currentRole === 'admin' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none',
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 18 }} /> Admin
              </button>
            </div>

            {/* Show social login only for user mode */}
            {currentRole === 'user' && (
              <>
            <div style={styles.socialContainer}>
              <button 
                type="button" 
                className="social-google" 
                style={{ ...styles.socialBase, ...styles.google }}
                aria-label="Sign in with Google"
                onClick={async () => {
                  try {
                    const user = await handleGoogleSignIn()
                    showNotification('Signed in with Google', 'success')
                    navigate('/dashboard')
                  } catch (err) {
                    showNotification(err?.message || 'Google sign-in failed', 'error')
                  }
                }}
              >
                G
              </button>
              <button 
                type="button" 
                className="social-linkedin" 
                style={{ ...styles.socialBase, ...styles.linkedin }}
                aria-label="Sign in with LinkedIn"
              >
                in
              </button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or use your email</span>
              <div style={styles.dividerLine}></div>
            </div>
              </>
            )}

            {/* Admin mode info */}
            {currentRole === 'admin' && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(220, 38, 38, 0.08)',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '13px',
                color: '#991b1b',
                border: '1px solid rgba(220, 38, 38, 0.2)',
              }}>
                <strong>Admin Login:</strong> 2FA code and security question required
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#dc2626',
                fontWeight: '500',
                border: '1px solid rgba(220, 38, 38, 0.25)',
              }}>
                {error}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#dc2626',
                fontWeight: '500',
                border: '1px solid rgba(220, 38, 38, 0.25)',
              }}>
                {error}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#dc2626',
                fontWeight: '500',
                border: '1px solid rgba(220, 38, 38, 0.25)',
              }}>
                {error}
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

<<<<<<< HEAD
            <div style={styles.rememberRow}>
<<<<<<< HEAD
=======
=======
            {/* Admin-only fields */}
            {currentRole === 'admin' && (
              <div style={{
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '12px',
                border: '1.5px dashed rgba(220, 38, 38, 0.25)',
                marginBottom: '20px',
              }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>2FA Code</label>
                  <input
                    style={styles.input}
                    type="text"
                    inputMode="numeric"
                    placeholder="6-digit code"
                    maxLength="6"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    required={currentRole === 'admin'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Security Question</label>
                  <select
                    style={styles.input}
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    required={currentRole === 'admin'}
                  >
                    <option value="">Select a question</option>
                    <option value="city">What city did you grow up in?</option>
                    <option value="teacher">What was the name of your first teacher?</option>
                    <option value="pet">What was your first pet's name?</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Answer</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Your answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required={currentRole === 'admin'}
                    autoComplete="off"
                  />
                </div>

                <label style={{ ...styles.checkbox, marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                  />
                  <span>Trust this device for 7 days</span>
                </label>
              </div>
            )}

            {/* User-only remember me and links */}
            {currentRole === 'user' && (
              <div style={styles.rememberRow}>
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
                <label style={styles.checkbox}>
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <a 
                  style={styles.link} 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auth/forgot-password');
                  }}
                >
                  Forgot Password?
                </a>
              </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
            )}

            {/* Admin-only links */}
            {currentRole === 'admin' && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                fontSize: '14px',
              }}>
                <a 
                  style={{...styles.link, color: '#dc2626'}} 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/admin/help');
                  }}
                >
                  Admin Help
                </a>
                <a 
                  style={{...styles.link, color: '#dc2626'}} 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/admin/emergency');
                  }}
                >
                  Emergency Access
                </a>
              </div>
            )}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607

            <button type="submit" className="submit-btn" style={styles.button} disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Session info */}
            <p style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#999',
            }}>
<<<<<<< HEAD
              Session: up to 30 days
=======
<<<<<<< HEAD
              Session: up to 30 days
=======
              Session: {currentRole === 'admin' ? 'up to 2 hours (Admin)' : 'up to 30 days (User)'}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
            </p>
          </form>
        </div>

        <div className="overlay-container" style={styles.overlayContainer}>
          <div style={styles.overlay}>
            <div style={styles.overlayContent}>
              <h1 style={styles.overlayTitle}>Hello, Friend!</h1>
              <p style={styles.overlayText}>
               Start Your Journey With Us
              </p>
              <button
                className="ghost-btn"
                style={styles.ghostButton}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              
              <div style={styles.features}>
                <div style={styles.feature}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Access 2,500+ Job Opportunities</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Join 15,000+ Professionals</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Premium Learning Resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}