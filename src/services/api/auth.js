import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  // Email login with OTP
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // User registration (DEPRECATED - use requestSignupOTP instead)
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },

  // Request Signup OTP - Step 1 of registration
  requestSignupOTP: async (userData) => {
    const response = await api.post('/auth/request-signup-otp', userData)
    return response.data
  },

  // Verify Signup OTP - Step 2 of registration
  verifySignupOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-signup', { email, otp })
    return response.data
  },

  // Request Login OTP
  requestLoginOTP: async (email) => {
    const response = await api.post('/auth/request-login-otp', { email })
    return response.data
  },

  // Verify Login OTP
  verifyLoginOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-login-otp', { email, otp })
    return response.data
  },

  // Request OTP (legacy)
  requestOTP: async (email) => {
    const response = await api.post('/auth/request-otp', { email })
    return response.data
  },

  // Verify OTP (legacy)
  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp })
    return response.data
  },

  // Social login (Google, Outlook, SSO)
  socialLogin: async (provider, token) => {
    const response = await api.post('/auth/social-login', { provider, token })
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword })
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

export default api