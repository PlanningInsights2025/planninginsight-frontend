import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { validateEmail } from '../../../utils/helpers'
import './ForgotPassword.css'

import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  Shield,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'
import './ForgotPassword.css'

/**
 * Enhanced Forgot Password Component - 2025
 * Multi-step password recovery with modern UI
 */
const ForgotPassword = () => {
  const { forgotPassword, resetPassword, verifyOTP } = useAuth()
  const { showNotification } = useNotification()

  const [step, setStep] = useState('email') // email -> otp -> reset -> success
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleEmailSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setLoading(true)
    try {
      const result = await forgotPassword(formData.email)
      if (result.success) {
        showNotification('Reset code sent to your email', 'success')
        setStep('otp')
        setErrors({})
      } else {
        showNotification(result.error || 'Failed to send reset code', 'error')
      }
    } catch (error) {
      showNotification('Failed to send reset code', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...formData.otp]
    newOtp[index] = value
    setFormData(prev => ({ ...prev, otp: newOtp }))

    if (value && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
    setFormData(prev => ({ ...prev, otp: newOtp }))
    
    const nextEmptyIndex = newOtp.findIndex(digit => !digit)
    if (nextEmptyIndex !== -1) {
      document.getElementById(`reset-otp-${nextEmptyIndex}`)?.focus()
    } else {
      document.getElementById('reset-otp-5')?.focus()
    }
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    const otpString = formData.otp.join('')

    if (otpString.length !== 6) {
      showNotification('Please enter complete 6-digit code', 'error')
      return
    }

    setLoading(true)
    try {
      const result = await verifyOTP(formData.email, otpString)
      if (result.success) {
        showNotification('Code verified successfully', 'success')
        setStep('reset')
      } else {
        showNotification(result.error || 'Invalid verification code', 'error')
      }
    } catch (error) {
      showNotification('Verification failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (event) => {
    event.preventDefault()

    const validationErrors = {}
    if (!formData.newPassword) {
      validationErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      validationErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const result = await resetPassword('reset-token', formData.newPassword)
      if (result.success) {
        showNotification('Password reset successfully!', 'success')
        setStep('success')
      } else {
        showNotification(result.error || 'Password reset failed', 'error')
      }
    } catch (error) {
      showNotification('Password reset failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      const result = await forgotPassword(formData.email)
      if (result.success) {
        showNotification('New code sent to your email', 'success')
        setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }))
        document.getElementById('reset-otp-0')?.focus()
      } else {
        showNotification(result.error || 'Failed to resend code', 'error')
      }
    } catch (error) {
      showNotification('Failed to resend code', 'error')
    }
  }

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="auth-form">
      <div className={`form-group ${errors.email ? 'error' : ''}`}>
        <label htmlFor="email">
          <Mail size={18} />
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }))
            setErrors({})
          }}
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
        />
        {errors.email && (
          <span className="error-message slide-in">{errors.email}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-large"
        disabled={loading}
      >
        {loading ? <Loader size="small" /> : (
          <>
            Send Reset Code
            <Mail size={20} />
          </>
        )}
      </button>

      <Link to="/login" className="back-link">
        <ArrowLeft size={18} />
        Back to Sign In
      </Link>
    </form>
  )

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="auth-form">
      <div className="otp-input-group">
        {formData.otp.map((digit, index) => (
          <input
            key={index}
            id={`reset-otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={index === 0 ? handleOtpPaste : undefined}
            className={`otp-input ${digit ? 'filled' : ''}`}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-large"
        disabled={loading || formData.otp.join('').length !== 6}
      >
        {loading ? <Loader size="small" /> : (
          <>
            Verify Code
            <CheckCircle size={20} />
          </>
        )}
      </button>

      <div className="form-footer">
        <p>
          Didn't receive the code?{' '}
          <button 
            type="button" 
            onClick={handleResendOtp}
            className="link-button"
            disabled={loading}
          >
            Resend Code
          </button>
        </p>
      </div>
    </form>
  )

  const renderResetStep = () => (
    <form onSubmit={handlePasswordReset} className="auth-form">
      <div className={`form-group ${errors.newPassword ? 'error' : ''}`}>
        <label htmlFor="newPassword">
          <Lock size={18} />
          New Password
        </label>
        <div className="input-with-icon">
          <input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, newPassword: e.target.value }))
              setErrors(prev => ({ ...prev, newPassword: '' }))
            }}
            placeholder="Enter new password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.newPassword && (
          <span className="error-message slide-in">{errors.newPassword}</span>
        )}
      </div>

      <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
        <label htmlFor="confirmPassword">
          <Lock size={18} />
          Confirm Password
        </label>
        <div className="input-with-icon">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
              setErrors(prev => ({ ...prev, confirmPassword: '' }))
            }}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error-message slide-in">{errors.confirmPassword}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary btn-large"
        disabled={loading}
      >
        {loading ? <Loader size="small" /> : (
          <>
            Reset Password
            <CheckCircle size={20} />
          </>
        )}
      </button>
    </form>
  )

  const renderSuccessStep = () => (
    <div className="success-container">
      <div className="success-icon">
        <CheckCircle size={64} />
      </div>
      <h2>Password Reset Successfully!</h2>
      <p>Your password has been reset. You can now sign in with your new password.</p>
      <Link to="/login" className="btn btn-primary btn-large">
        Go to Sign In
        <ArrowLeft size={20} />
      </Link>
    </div>
  )

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              {step === 'success' ? <CheckCircle size={32} /> : <Shield size={32} />}
            </div>
            <h1>
              {step === 'email' && 'Reset Password'}
              {step === 'otp' && 'Verify Your Identity'}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'All Set!'}
            </h1>
            <p>
              {step === 'email' && 'Enter your email to receive a password reset code'}
              {step === 'otp' && `Enter the 6-digit code sent to ${formData.email}`}
              {step === 'reset' && 'Choose a strong password for your account'}
              {step === 'success' && 'Your password has been successfully reset'}
            </p>
          </div>

          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'reset' && renderResetStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
