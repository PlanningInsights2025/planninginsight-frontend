import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, getGoogleRedirectResult } from "../../../services/api/firebaseAuth";
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import OTPVerification from './OTPVerification'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showOTPScreen, setShowOTPScreen] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const navigate = useNavigate();
  const { requestSignupOTP, verifySignupOTP, checkAuthStatus } = useAuth()
  const { showNotification } = useNotification()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match!");
      showNotification("Passwords don't match!", 'error')
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage("Please accept the Terms of Service and Privacy Policy");
      showNotification("Please accept the Terms of Service and Privacy Policy", 'error')
      return;
    }

    // NEW: Request OTP instead of creating account directly
    ;(async () => {
      setErrorMessage('')
      setLoading(true)
      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          password: formData.password,
        }
        
        // Step 1: Request OTP
        const res = await requestSignupOTP(payload)
        
        if (res.success === false) {
          setErrorMessage(res.error || 'Failed to send verification code')
          showNotification(res.error || 'Failed to send verification code', 'error')
          setLoading(false)
          return
        }

        // Show OTP verification screen
        showNotification('Verification code sent to your email!', 'success')
        setShowOTPScreen(true)
        setLoading(false)
      } catch (err) {
        console.error('Signup OTP request error', err)
        const msg = err?.response?.data?.message || err?.message || 'Failed to send verification code'
        setErrorMessage(msg)
        showNotification(msg, 'error')
        setLoading(false)
      }
    })()
  };

  const handleVerifyOTP = async (otp) => {
    console.log('🔍 Starting OTP verification...', { email: formData.email, otp })
    setOtpError('')
    setOtpLoading(true)
    setRemainingAttempts(null)
    
    try {
      console.log('📞 Calling verifySignupOTP...')
      const res = await verifySignupOTP(formData.email, otp)
      console.log('✅ Response received:', res)
      
      if (res.success === false) {
        console.log('❌ Verification failed:', res.error)
        setOtpError(res.error || 'Invalid verification code')
        setRemainingAttempts(res.remainingAttempts)
        showNotification(res.error || 'Invalid verification code', 'error')
        setOtpLoading(false)
        return
      }

      // Success! Account verified and activated
      console.log('🎉 Verification successful!')
      showNotification('Email verified! Welcome to Planning Insights!', 'success')
      setOtpLoading(false)
      
      // Small delay to show success message
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (err) {
      console.error('❌ OTP verification error:', err)
      console.error('Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      })
      const msg = err?.response?.data?.message || err?.message || 'Verification failed'
      setOtpError(msg)
      showNotification(msg, 'error')
      setOtpLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtpError('')
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        password: formData.password,
      }
      
      const res = await requestSignupOTP(payload)
      
      if (res.success) {
        showNotification('New verification code sent!', 'success')
        setRemainingAttempts(null)
      } else {
        setOtpError(res.error || 'Failed to resend code')
        showNotification(res.error || 'Failed to resend code', 'error')
      }
    } catch (err) {
      console.error('Resend OTP error', err)
      const msg = err?.response?.data?.message || err?.message || 'Failed to resend code'
      setOtpError(msg)
      showNotification(msg, 'error')
    }
  }

  const handleBackToSignup = () => {
    setShowOTPScreen(false)
    setOtpError('')
    setRemainingAttempts(null)
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle() // Redirects to Google
    } catch (err) {
      console.error('Google sign-in error', err)
      showNotification(err?.message || 'Google sign-in failed', 'error')
      setLoading(false)
    }
  }

  // Handle Google OAuth redirect result
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        const result = await getGoogleRedirectResult()
        if (result && result.user) {
          const user = result.user
          console.log('Google sign-in redirect result:', user)
          
          // Call backend to create/login user
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://planninginsight-backend.vercel.app/api'
          const response = await fetch(`${apiBaseUrl}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          })
          
          const data = await response.json()
          if (data.token) {
            localStorage.setItem('authToken', data.token)
            await checkAuthStatus?.()
            showNotification('Signed in with Google', 'success')
            navigate('/dashboard')
          } else {
            throw new Error(data.message || 'Google sign-in failed')
          }
        }
      } catch (err) {
        console.error('Google redirect error:', err)
        if (err.message && err.message !== 'No redirect result available') {
          showNotification(err?.message || 'Google sign-in failed', 'error')
        }
      }
    }
    
    handleGoogleRedirect()
  }, [navigate, checkAuthStatus, showNotification])

  // Handle LinkedIn OAuth redirect: capture ?token= or error, store it, hydrate auth, and navigate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const socialError = params.get('social_error')
    const socialErrorDesc = params.get('social_error_description')
    if (socialError) {
      showNotification(socialErrorDesc || socialError, 'error')
      const url = new URL(window.location.href)
      url.searchParams.delete('social_error')
      url.searchParams.delete('social_error_description')
      window.history.replaceState({}, document.title, url.pathname + url.search)
      return
    }
    if (token) {
      try {
        localStorage.setItem('authToken', token)
        // Clear token from URL to avoid leaking it
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.pathname + url.search)
        // Hydrate user state from backend
        checkAuthStatus?.()
        showNotification('Signed in with LinkedIn', 'success')
        navigate('/dashboard')
      } catch (err) {
        console.error('LinkedIn token handling failed', err)
        showNotification('LinkedIn sign-in failed', 'error')
      }
    }
  }, [])

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark",
    "India", "China", "Japan", "South Korea", "Singapore", "UAE", "Brazil",
    "Mexico", "Argentina", "South Africa", "Nigeria", "Kenya", "Egypt"
  ];

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
      right: "-250px",
      animation: "float 8s ease-in-out infinite",
    },
    shape2: {
      width: "400px",
      height: "400px",
      background: "#fff",
      bottom: "-200px",
      left: "-200px",
      animation: "float 10s ease-in-out infinite reverse",
    },
    shape3: {
      width: "350px",
      height: "350px",
      background: "#fff",
      top: "40%",
      left: "15%",
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
    overlayContainer: {
      width: "40%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "60px 50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      zIndex: 100,
    },
    overlayContent: {
      maxWidth: "350px",
      textAlign: "center",
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
    formContainer: {
      width: "60%",
      padding: "50px 60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflowY: "auto",
      background: "#fff",
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
      marginBottom: "30px",
      textAlign: "center",
      fontWeight: "400",
    },
    socialContainer: {
      display: "flex",
      gap: "20px",
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
      width: "120px", // Wider for better text display
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontSize: "14px",
      fontWeight: "600",
      fontFamily: "'Poppins', sans-serif",
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
      margin: "25px 0",
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
    row: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
    },
    inputGroup: {
      flex: 1,
    },
    inputGroupFull: {
      marginBottom: "20px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#555",
      marginBottom: "8px",
      display: "block",
    },
    required: {
      color: "#e74c3c",
      marginLeft: "3px",
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
    select: {
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
      cursor: "pointer",
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
    checkbox: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      color: "#666",
      fontSize: "14px",
      marginBottom: "25px",
      lineHeight: "1.6",
    },
    checkboxInput: {
      marginTop: "3px",
      cursor: "pointer",
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "600",
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
            border: 2px solid rgba(240, 226, 226, 0.08);
            border-top-color: rgba(102,126,234,1);
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          input:focus, select:focus {
            border-color: #667eea !important;
            background: #fff !important;
            box-shadow: 0 0 0 4px rgba(206, 209, 223, 0.1) !important;
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
          
          .ghost-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
          }
          
          .eye-btn:hover {
            color: #667eea;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
          }
          
          @media (max-width: 1000px) {
            .overlay-container {
              display: none !important;
            }
            .form-container {
              width: 100% !important;
              padding: 40px 30px !important;
            }
          }
          
          @media (max-width: 600px) {
            .input-row {
              flex-direction: column !important;
            }
            .social-container {
              flex-direction: column !important;
              align-items: center !important;
            }
            .social-button {
              width: 100% !important;
              max-width: 280px !important;
            }
          }
        `}
      </style>

      <div style={styles.backgroundShapes}>
        <div style={{ ...styles.shape, ...styles.shape1 }}></div>
        <div style={{ ...styles.shape, ...styles.shape2 }}></div>
        <div style={{ ...styles.shape, ...styles.shape3 }}></div>
      </div>

      {/* Show OTP verification screen or signup form */}
      {showOTPScreen ? (
        <OTPVerification
          email={formData.email}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onBack={handleBackToSignup}
          loading={otpLoading}
          error={otpError}
          remainingAttempts={remainingAttempts}
        />
      ) : (
        <div style={styles.card}>
        <div className="overlay-container" style={styles.overlayContainer}>
          <div style={styles.overlayContent}>
            <h1 style={styles.overlayTitle}>Have an existing account?</h1>
            <p style={styles.overlayText}>
              Signin Here
            </p>
            <button
              className="ghost-btn"
              style={styles.ghostButton}
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="form-container" style={styles.formContainer}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Fill in your details to get started</p>

            <div style={styles.socialContainer}>
              <button 
                type="button" 
                className="social-google social-button" 
                style={{ ...styles.socialBase, ...styles.google }}
                aria-label="Sign up with Google"
                onClick={handleGoogleSignIn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: "8px" }}>
                  <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                type="button" 
                className="social-linkedin social-button" 
                style={{ ...styles.socialBase, ...styles.linkedin }}
                aria-label="Sign up with LinkedIn"
                onClick={() => {
                  try { localStorage.removeItem('authToken') } catch (_) {}
                  const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
                  const base = raw.replace(/\/?api\/?$/i, '')
                  window.location.assign(`${base}/api/auth/linkedin`)
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a66c2" style={{ marginRight: "8px" }}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>

            {/* Help users switch LinkedIn accounts if the provider reuses session */}
            <div style={{ textAlign: 'center', marginBottom: 20, fontSize: 13, color: '#666' }}>
              Trouble switching LinkedIn accounts?
              <button
                type="button"
                style={{ marginLeft: 8, color: '#0a66c2', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  try { localStorage.removeItem('authToken') } catch (_) {}
                  showNotification('You will be taken to LinkedIn to sign out. Then return here and click "Sign up with LinkedIn" again.', 'info')
                  window.open('https://www.linkedin.com/m/logout/', '_blank', 'noopener,noreferrer')
                }}
              >
                Sign out of LinkedIn first
              </button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or register with email</span>
              <div style={styles.dividerLine}></div>
            </div>

            <div className="input-row" style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  First Name<span style={styles.required}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Last Name<span style={styles.required}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroupFull}>
              <label style={styles.label}>
                Email Address<span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="email"
                placeholder="Email@Gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row" style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="+91 1234567890"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Country<span style={styles.required}>*</span>
                </label>
                <select
                  style={styles.select}
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-row" style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Password<span style={styles.required}>*</span>
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    style={styles.input}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Confirm Password<span style={styles.required}>*</span>
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    style={styles.input}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    style={styles.eyeButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            <label style={styles.checkbox}>
              <input
                style={styles.checkboxInput}
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span>
                I agree to the <a style={styles.link} href="#">Terms of Service</a> and{" "}
                <a style={styles.link} href="#">Privacy Policy</a>
              </span>
            </label>

            {errorMessage && (
              <div style={{ color: '#b00020', marginBottom: '12px', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}
            <button type="submit" className="submit-btn" style={styles.button} disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden></span>
                  Sending verification code...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
        </div>
      )}
    </div>
  );
}