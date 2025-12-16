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
      if (token) {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
        return
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('authToken')
    } finally {
      // leave loading state to onAuthChanged handler where appropriate
    }
  }

  const login = async (email, password) => {
    try {
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
      console.error('Firebase login error', error)
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
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'OTP verification failed' 
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
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}