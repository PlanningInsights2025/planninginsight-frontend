import React from 'react'
import LoginComponent from '../../components/auth/Login/Login'

/**
 * Login Page Component
 * Wraps the Login component with page-level layout and styling
 * Handles authentication state and redirects
 */
const Login = () => {
  return (
    <div className="login-page">
      <LoginComponent />
    </div>
  )
}

export default Login