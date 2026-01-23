import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Check for admin token first, then fall back to regular auth token
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // If sending FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isAdminSession = localStorage.getItem('isAdminSession') === 'true'
      
      // If this is an admin session, redirect to admin login
      if (isAdminSession || currentPath.includes('/admin')) {
        if (!currentPath.includes('/admin/login')) {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('isAdminSession')
          window.location.href = '/admin/login'
        }
      } else {
        // Regular user session, redirect to regular login
        if (!currentPath.includes('/login')) {
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
