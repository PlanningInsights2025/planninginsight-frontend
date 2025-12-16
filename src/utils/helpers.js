// Utility helper functions for the application

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate unique code based on user name (3-4 chars + initials)
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} Unique code
 */
export const generateUniqueCode = (firstName, lastName) => {
  // Generate random 3-4 character prefix
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let prefix = ''
  const prefixLength = Math.floor(Math.random() * 2) + 3 // 3 or 4 characters
  
  for (let i = 0; i < prefixLength; i++) {
    prefix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Get initials from first and last name
  const initials = (
    (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')
  ).toUpperCase()
  
  return `${prefix}${initials}`
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and messages
 */
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const isValid = Object.values(requirements).every(Boolean)
  const messages = []
  
  if (!requirements.minLength) messages.push('At least 8 characters')
  if (!requirements.hasUppercase) messages.push('One uppercase letter')
  if (!requirements.hasLowercase) messages.push('One lowercase letter')
  if (!requirements.hasNumber) messages.push('One number')
  if (!requirements.hasSpecialChar) messages.push('One special character')
  
  return { isValid, messages }
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {string} requiredRole - Required role
 * @returns {boolean} True if user has required role
 */
export const hasRole = (user, requiredRole) => {
  return user?.role === requiredRole || user?.role === 'master_admin'
}

/**
 * Calculate profile completion percentage
 * @param {Object} profile - User profile object
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (profile) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'profilePicture',
    'resume',
    'bio',
    'skills',
    'education',
    'experience'
  ]
  
  const completedFields = requiredFields.filter(field => {
    const value = profile[field]
    return value && 
          (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '')
  })
  
  return Math.round((completedFields.length / requiredFields.length) * 100)
}