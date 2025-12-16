import { useState, useCallback } from 'react';
import * as validators from '../utils/validators';

/**
 * Custom hook for form validation
 * Provides reusable validation logic for forms
 * 
 * @param {Object} initialValues - Initial form values
 * @param {string} validationType - Type of validation (login, signup, etc.)
 * @returns {Object} Validation state and methods
 */
export const useValidation = (initialValues = {}, validationType = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Handle field change
   */
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate single field
    validateField(name);
  }, [values]);

  /**
   * Validate single field
   */
  const validateField = useCallback((name) => {
    // Add field-specific validation logic here
    const value = values[name];

    if (!value || (typeof value === 'string' && !value.trim())) {
      setErrors(prev => ({
        ...prev,
        [name]: 'This field is required'
      }));
      return false;
    }

    return true;
  }, [values]);

  /**
   * Validate all fields
   */
  const validate = useCallback(() => {
    let validationErrors = {};

    // Use predefined validator if type is specified
    if (validationType) {
      switch (validationType) {
        case 'login':
          const loginResult = validators.validateLoginForm(values);
          validationErrors = loginResult.errors;
          break;
        case 'signup':
          const signupResult = validators.validateSignupForm(values);
          validationErrors = signupResult.errors;
          break;
        case 'jobApplication':
          const jobResult = validators.validateJobApplication(values);
          validationErrors = jobResult.errors;
          break;
        default:
          break;
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationType]);

  /**
   * Reset form
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFormValues,
    isValid: Object.keys(errors).length === 0
  };
};

export default useValidation;
