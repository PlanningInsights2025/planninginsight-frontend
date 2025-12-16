import React from 'react'
import SignupComponent from '../../components/auth/Signup/Signup'

/**
 * Signup Page Component
 * Wraps the Signup component with page-level layout
 * Handles user registration flow
 */
const Signup = () => {
  return (
    <div className="signup-page">
      <SignupComponent />
    </div>
  )
}

export default Signup