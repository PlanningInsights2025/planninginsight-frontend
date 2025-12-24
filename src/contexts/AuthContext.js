import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api/auth'
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut as firebaseSignOut,
  onAuthChanged,
} from '../services/api/firebaseAuth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Subscribe to Firebase auth state changes; fall back to backend token check if needed
    const unsubscribe = onAuthChanged(async (fbUser) => {
      if (fbUser) {
        // Map Firebase user to app user shape
        const displayName = fbUser.displayName || ''
        const [firstName, ...rest] = displayName.split(' ')
        const lastName = rest.join(' ')
        const mapped = {
          id: fbUser.uid,
          email: fbUser.email,
          firstName: firstName || fbUser.email,
          lastName: lastName || '',
          displayName: fbUser.displayName || `${firstName} ${lastName}`,
          photoURL: fbUser.photoURL || null,
        }
        setUser(mapped)
        setIsAuthenticated(true)
      } else {
        // No Firebase user; try backend token check
        await checkAuthStatus()
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      console.log('[AuthContext] Checking auth status, token exists:', !!token)
      if (token) {
        // Try to get user data from backend
        try {
          console.log('[AuthContext] Fetching user data from /auth/me...')
          const userData = await authAPI.getCurrentUser()
          console.log('[AuthContext] User data received:', userData)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('[AuthContext] Failed to get user from token:', error.response?.data || error.message)
          // Token might be invalid, clear it
          localStorage.removeItem('authToken')
          setUser(null)
          setIsAuthenticated(false)
        }
        return
      }
      console.log('[AuthContext] No token found')
    } catch (error) {
      console.error('[AuthContext] Auth check failed:', error)
      localStorage.removeItem('authToken')
    }
    setUser(null)
    setIsAuthenticated(false)
  }

  const login = async (emailOrUserData, password) => {
    try {
      // If first parameter is an object, it means we're updating context with user data
      if (typeof emailOrUserData === 'object' && emailOrUserData !== null) {
        const userData = emailOrUserData;
        console.log('Updating auth context with user data:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      }
      
      // Otherwise, proceed with Firebase email/password login
      const email = emailOrUserData;
      const fbUser = await signInWithEmail(email, password)
      const displayName = fbUser.displayName || ''
      const [firstName, ...rest] = displayName.split(' ')
      const lastName = rest.join(' ')
      const mapped = {
        id: fbUser.uid,
        email: fbUser.email,
        firstName: firstName || fbUser.email,
        lastName: lastName || '',
        displayName: fbUser.displayName || `${firstName} ${lastName}`,
        photoURL: fbUser.photoURL || null,
      }
      setUser(mapped)
      setIsAuthenticated(true)
      return { success: true, user: mapped }
    } catch (error) {
      console.error('Login error', error)
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      // Use Firebase to create account
      const extraProfile = { displayName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() }
      const fbUser = await signUpWithEmail(userData.email, userData.password, extraProfile)
      const displayName = fbUser.displayName || ''
      const [firstName, ...rest] = displayName.split(' ')
      const lastName = rest.join(' ')
      const mapped = {
        id: fbUser.uid,
        email: fbUser.email,
        firstName: firstName || fbUser.email,
        lastName: lastName || '',
        displayName: fbUser.displayName || `${firstName} ${lastName}`,
        photoURL: fbUser.photoURL || null,
      }
      setUser(mapped)
      setIsAuthenticated(true)
      return { success: true, user: mapped }
    } catch (error) {
      console.error('Firebase signup error', error)
      // Map common Firebase auth errors to friendly messages
      const code = error?.code || ''
      let friendly = error?.message || 'Signup failed'
      if (code === 'auth/operation-not-allowed') {
        friendly = 'Email/password sign-in is not enabled in Firebase. Enable it in the Firebase Console -> Authentication -> Sign-in method.'
      } else if (code === 'auth/email-already-in-use') {
        friendly = 'This email is already in use. Try logging in or use a different email.'
      } else if (code === 'auth/invalid-email') {
        friendly = 'The email address is invalid. Please enter a valid email.'
      } else if (code === 'auth/weak-password') {
        friendly = 'The password is too weak. Please use at least 6 characters.'
      }
      return { 
        success: false, 
        error: friendly,
        raw: error
      }
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut()
    } catch (err) {
      console.warn('Firebase signOut failed', err)
    }
    localStorage.removeItem('authToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  const requestOTP = async (email) => {
    try {
      await authAPI.requestOTP(email)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'OTP request failed' 
      }
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authAPI.verifyOTP(email, otp)
      // Backend returns { success: true, message: "...", data: { resetToken: "..." } }
      if (response.success && response.data?.resetToken) {
        return { 
          success: true, 
          data: { 
            token: response.data.resetToken 
          } 
        }
      }
      return { 
        success: false, 
        error: response.message || 'OTP verification failed' 
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'OTP verification failed' 
      }
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email)
      // Backend returns { success: true, message: "..." }
      if (response.success) {
        return { success: true, data: response }
      }
      return { success: false, error: response.message || 'Failed to send reset code' }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to send reset code' 
      }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      // Backend expects { resetToken, newPassword }
      const response = await authAPI.resetPassword(token, newPassword)
      if (response.success) {
        return { success: true, data: response }
      }
      return { 
        success: false, 
        error: response.message || 'Password reset failed' 
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Password reset failed' 
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    requestOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}