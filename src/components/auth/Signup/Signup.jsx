import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../../services/api/firebaseAuth";
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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
  const { signup, login } = useAuth()
  const { showNotification } = useNotification()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!formData.agreeTerms) {
      alert("Please accept the Terms of Service and Privacy Policy");
      return;
    }
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
        const res = await signup(payload)
        if (res.success === false) {
          setErrorMessage(res.error || 'Signup failed')
          showNotification(res.error || 'Signup failed', 'error')
          setLoading(false)
          return
        }

        // If signup returned token/user they are already set in AuthContext; otherwise try login
        if (!res.data?.token && !res.data?.user) {
          const loginRes = await login(formData.email, formData.password)
          if (loginRes.success) {
            showNotification('Account created — Welcome!', 'success')
            navigate('/dashboard')
            setLoading(false)
            return
          }
        }

        // Navigate to dashboard if user is authenticated
        showNotification('Account created — Welcome!', 'success')
        navigate('/dashboard')
      } catch (err) {
        console.error('Signup error', err)
        const msg = err?.response?.data?.message || err?.message || 'Signup failed'
        setErrorMessage(msg)
        showNotification(msg, 'error')
      } finally {
        setLoading(false)
      }
    })()
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle()
      console.log('Google sign-in user:', user)
      // Optionally redirect after successful social login
      showNotification('Signed in with Google', 'success')
      navigate('/dashboard')
    } catch (err) {
      console.error('Google sign-in error', err)
      showNotification(err?.message || 'Google sign-in failed', 'error')
    }
  }

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
    facebook: {
      borderColor: "#1877f2",
      color: "#1877f2",
      background: "#fff",
    },
    github: {
      borderColor: "#333",
      color: "#333",
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
          
          .social-facebook:hover {
            background: #1877f2 !important;
            color: #fff !important;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(24, 119, 242, 0.3);
          }
          
          .social-github:hover {
            background: #333 !important;
            color: #fff !important;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(51, 51, 51, 0.3);
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
          }
        `}
      </style>

      <div style={styles.backgroundShapes}>
        <div style={{ ...styles.shape, ...styles.shape1 }}></div>
        <div style={{ ...styles.shape, ...styles.shape2 }}></div>
        <div style={{ ...styles.shape, ...styles.shape3 }}></div>
      </div>

      <div style={styles.card}>
        <div className="overlay-container" style={styles.overlayContainer}>
          <div style={styles.overlayContent}>
            <h1 style={styles.overlayTitle}>Welcome Back!</h1>
            <p style={styles.overlayText}>
              To keep connected with us please login with your personal info
            </p>
            <button
              className="ghost-btn"
              style={styles.ghostButton}
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.checkIcon}>✓</span>
                <span>Secure & Encrypted</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkIcon}>✓</span>
                <span>Quick Setup Process</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.checkIcon}>✓</span>
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-container" style={styles.formContainer}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Fill in your details to get started</p>

            <div style={styles.socialContainer}>
              <button 
                type="button" 
                className="social-google" 
                style={{ ...styles.socialBase, ...styles.google }}
                aria-label="Sign up with Google"
                onClick={handleGoogleSignIn}
              >
                G
              </button>
              <button 
                type="button" 
                className="social-facebook" 
                style={{ ...styles.socialBase, ...styles.facebook }}
                aria-label="Sign up with Facebook"
              >
                f
              </button>
              <button 
                type="button" 
                className="social-github" 
                style={{ ...styles.socialBase, ...styles.github }}
                aria-label="Sign up with GitHub"
              >
                <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button 
                type="button" 
                className="social-linkedin" 
                style={{ ...styles.socialBase, ...styles.linkedin }}
                aria-label="Sign up with LinkedIn"
              >
                in
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}