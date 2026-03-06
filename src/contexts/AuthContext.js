import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus().finally(() => setLoading(false))
  }, [])

  const checkAuthStatus = async () => {
    try {
      const isAdminSession = localStorage.getItem('isAdminSession') === 'true'
      if (isAdminSession) return

      const token = localStorage.getItem('authToken')
      if (!token) return

      const userData = await authAPI.getCurrentUser()
      if (!userData) return
      if (userData.role === 'admin') {
        localStorage.removeItem('authToken')
        return
      }
      const formatted = formatUser(userData)
      setUser(formatted)
      setIsAuthenticated(true)
    } catch {
      localStorage.removeItem('authToken')
    }
  }

  // Accepts a plain user object (from backend response) and sets auth state
  const login = (userData) => {
    if (!userData) return
    const formatted = userData.email ? formatUser(userData) : userData
    setUser(formatted)
    setIsAuthenticated(true)
  }

  const setAuthState = (userData) => {
    if (!userData) return
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('isAdminSession')
    localStorage.removeItem('adminToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  // OTP-based signup
  const requestSignupOTP = async (userData) => {
    try {
      const response = await authAPI.requestSignupOTP(userData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to send verification code' }
    }
  }

  const verifySignupOTP = async (email, otp) => {
    try {
      const response = await authAPI.verifySignupOTP(email, otp)
      if (response.success && response.data?.token) {
        localStorage.setItem('authToken', response.data.token)
        const ud = response.data.user
        const formatted = formatUser({ ...ud, profile: ud.profile || {} })
        setUser(formatted)
        setIsAuthenticated(true)
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Invalid response from server' }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Verification failed',
        remainingAttempts: error.response?.data?.remainingAttempts
      }
    }
  }

  const requestOTP = async (email) => {
    try {
      await authAPI.requestOTP(email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'OTP request failed' }
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authAPI.verifyOTP(email, otp)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'OTP verification failed' }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    requestOTP,
    verifyOTP,
    requestSignupOTP,
    verifySignupOTP,
    checkAuthStatus,
    setAuthState,
    refreshUser: checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper — normalise backend user object to a consistent shape
function formatUser(u) {
  return {
    id: u.id || u._id,
    email: u.email,
    role: u.role || 'user',
    firstName: u.profile?.firstName || u.firstName || '',
    lastName: u.profile?.lastName || u.lastName || '',
    displayName: `${u.profile?.firstName || u.firstName || ''} ${u.profile?.lastName || u.lastName || ''}`.trim() || u.email,
    photoURL: u.profile?.avatar || u.photoURL || null,
    profile: u.profile || {},
    emailVerified: u.emailVerified || false,
    status: u.status || 'active'
  }
}
