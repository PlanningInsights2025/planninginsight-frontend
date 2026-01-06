import React, { useState, useEffect, useRef } from 'react';

export default function OTPVerification({ 
  email, 
  onVerify, 
  onResend, 
  onBack,
  loading = false,
  error = '',
  remainingAttempts = null
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Resend cooldown
    if (resendCooldown > 0) {
      const timeout = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    const complete = newOtp.every(d => d !== '');
    console.log('📝 OTP changed:', {
      otp: newOtp.join(''),
      complete: complete,
      array: newOtp
    });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    // Focus last filled input
    const nextIndex = Math.min(newOtp.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    console.log('🎯 OTPVerification: handleSubmit called', { otpString, length: otpString.length });
    
    if (otpString.length === 6) {
      console.log('✅ OTPVerification: Valid OTP, calling onVerify...');
      onVerify(otpString);
    } else {
      console.log('❌ OTPVerification: Invalid OTP length', otpString.length);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setCanResend(false);
      setResendCooldown(60);
      setTimer(600);
      setOtp(['', '', '', '', '', '']);
      onResend();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = {
    container: {
      background: '#fff',
      borderRadius: '20px',
      padding: '50px',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '15px',
      color: '#666',
      marginBottom: '10px',
    },
    email: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#667eea',
      marginBottom: '30px',
    },
    otpContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginBottom: '25px',
    },
    otpInput: {
      width: '50px',
      height: '60px',
      fontSize: '24px',
      fontWeight: '700',
      textAlign: 'center',
      border: '2px solid #e8e8e8',
      borderRadius: '12px',
      background: '#f7f8fa',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', monospace",
    },
    timer: {
      fontSize: '14px',
      color: '#999',
      marginBottom: '20px',
    },
    timerActive: {
      color: '#667eea',
      fontWeight: '600',
    },
    timerExpired: {
      color: '#e74c3c',
      fontWeight: '600',
    },
    error: {
      background: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      padding: '12px',
      color: '#c00',
      fontSize: '14px',
      marginBottom: '20px',
    },
    attemptsWarning: {
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '12px',
      color: '#856404',
      fontSize: '14px',
      marginBottom: '20px',
    },
    button: {
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontSize: '15px',
      fontWeight: '700',
      padding: '16px 40px',
      width: '100%',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
      marginBottom: '15px',
      position: 'relative',
      zIndex: 10,
      pointerEvents: 'auto',
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    resendButton: {
      background: 'transparent',
      border: '2px solid #667eea',
      color: '#667eea',
      boxShadow: 'none',
    },
    backButton: {
      background: 'transparent',
      border: '2px solid #ddd',
      color: '#666',
      boxShadow: 'none',
      marginTop: '10px',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  const otpComplete = otp.every(digit => digit !== '');
  
  // Debug logging
  console.log('🔍 OTPVerification Render State:', {
    otp: otp,
    otpString: otp.join(''),
    otpComplete: otpComplete,
    loading: loading,
    buttonDisabled: !otpComplete || loading
  });

  return (
    <div style={styles.container}>
      <style>
        {`
          .otp-input:focus {
            border-color: #667eea !important;
            background: #fff !important;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
          }
          
          .verify-btn {
            position: relative !important;
            z-index: 10 !important;
            pointer-events: auto !important;
          }
          
          .verify-btn:disabled {
            pointer-events: none !important;
            cursor: not-allowed !important;
          }
          
          .verify-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4) !important;
          }
          
          .resend-btn:hover:not(:disabled) {
            background: #667eea !important;
            color: #fff !important;
          }
          
          .back-btn:hover {
            background: #f5f5f5 !important;
            border-color: #999 !important;
          }

          .btn-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <h1 style={styles.title}>Verify Your Email</h1>
      <p style={styles.subtitle}>We've sent a 6-digit code to</p>
      <p style={styles.email}>{email}</p>

      <form onSubmit={handleSubmit}>
        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input"
              style={styles.otpInput}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div style={styles.timer}>
          {timer > 0 ? (
            <span style={styles.timerActive}>
              Code expires in {formatTime(timer)}
            </span>
          ) : (
            <span style={styles.timerExpired}>
              ⚠️ Code expired. Please request a new one.
            </span>
          )}
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {remainingAttempts !== null && remainingAttempts <= 2 && (
          <div style={styles.attemptsWarning}>
            ⚠️ Warning: {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
          </div>
        )}

        <button
          type="submit"
          className="verify-btn"
          style={{
            ...styles.button,
            ...((!otpComplete || loading) && styles.buttonDisabled),
          }}
          disabled={!otpComplete || loading}
          onClick={(e) => {
            console.log('🖱️ BUTTON CLICKED!', { otpComplete, loading, disabled: !otpComplete || loading });
            // Don't prevent default - let form submission happen
          }}
        >
          {loading ? (
            <>
              <span className="btn-spinner" aria-hidden></span>
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <button
          type="button"
          className="resend-btn"
          style={{
            ...styles.button,
            ...styles.resendButton,
            ...(!canResend && styles.buttonDisabled),
          }}
          onClick={handleResend}
          disabled={!canResend}
        >
          {canResend ? (
            'Resend Code'
          ) : (
            `Resend in ${resendCooldown}s`
          )}
        </button>

        <button
          type="button"
          className="back-btn"
          style={{
            ...styles.button,
            ...styles.backButton,
          }}
          onClick={onBack}
        >
          Back to Signup
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '13px', color: '#999' }}>
        Didn't receive the code? Check your spam folder or{' '}
        <span style={styles.link} onClick={canResend ? handleResend : undefined}>
          resend it
        </span>
      </p>
    </div>
  );
}
