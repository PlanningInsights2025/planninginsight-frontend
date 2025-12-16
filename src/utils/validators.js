// Form validation functions

/**
 * Validate login form data
 * @param {Object} data - Form data
 * @returns {Object} Validation result with errors and isValid
 */
export const validateLoginForm = (data) => {
  const errors = {}
  
  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!data.password) {
    errors.password = 'Password is required'
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

/**
 * Validate signup form data
 * @param {Object} data - Form data
 * @returns {Object} Validation result with errors and isValid
 */
export const validateSignupForm = (data) => {
  const errors = {}
  
  // First name validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required'
  } else if (data.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
  }
  
  // Last name validation
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required'
  } else if (data.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
  }
  
  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  // Password validation
  if (!data.password) {
    errors.password = 'Password is required'
  } else {
    const passwordValidation = {
      minLength: data.password.length >= 8,
      hasUppercase: /[A-Z]/.test(data.password),
      hasLowercase: /[a-z]/.test(data.password),
      hasNumber: /\d/.test(data.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
    }
    
    if (!Object.values(passwordValidation).every(Boolean)) {
      errors.password = 'Password must contain uppercase, lowercase, number, and special character'
    }
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  // Terms agreement validation
  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions'
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

/**
 * Validate job application form
 * @param {Object} data - Application data
 * @returns {Object} Validation result
 */
export const validateJobApplication = (data) => {
  const errors = {}
  
  if (!data.coverLetter?.trim()) {
    errors.coverLetter = 'Cover letter is required'
  } else if (data.coverLetter.length < 50) {
    errors.coverLetter = 'Cover letter must be at least 50 characters'
  }
  
  if (data.expectedCTC && data.expectedCTC < 0) {
    errors.expectedCTC = 'Expected CTC cannot be negative'
  }
  
  if (data.noticePeriod && data.noticePeriod < 0) {
    errors.noticePeriod = 'Notice period cannot be negative'
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

/**
 * Validate course creation form
 * @param {Object} data - Course data
 * @returns {Object} Validation result
 */
export const validateCourseForm = (data) => {
  const errors = {}
  
  if (!data.title?.trim()) {
    errors.title = 'Course title is required'
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Course description is required'
  }
  
  if (!data.duration) {
    errors.duration = 'Course duration is required'
  }
  
  if (!data.fees || data.fees < 0) {
    errors.fees = 'Valid course fees are required'
  }
  
  if (!data.courseType) {
    errors.courseType = 'Course type is required'
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

/**
 * Generic required field validator
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = {}
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
  })
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}