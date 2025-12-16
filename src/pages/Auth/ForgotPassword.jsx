import React from 'react'
import ForgotPasswordComponent from '../../components/auth/ForgotPassword/ForgotPassword'

/**
 * Forgot Password Page Component
 * Wraps the ForgotPassword component with page layout
 * Handles password reset flow
 */
const ForgotPassword = () => {
  return (
    <div className="forgot-password-page">
      <ForgotPasswordComponent />
    </div>
  )
}

export default ForgotPassword