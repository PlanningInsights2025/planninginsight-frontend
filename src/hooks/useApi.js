import { useState, useCallback } from 'react'
import { useNotification } from '../contexts/NotificationContext'

/**
 * Custom hook for handling API calls with loading and error states
 * @param {Function} apiFunction - API function to call
 * @returns {Array} [execute, loading, error, data]
 */
export const useApi = (apiFunction) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const { showNotification } = useNotification()

  /**
   * Execute the API call
   * @param {*} params - Parameters to pass to API function
   * @param {Object} options - Options for the API call
   * @param {boolean} options.showSuccess - Whether to show success notification
   * @param {boolean} options.showError - Whether to show error notification
   * @param {string} options.successMessage - Custom success message
   * @param {string} options.errorMessage - Custom error message
   * @returns {Promise} API response
   */
  const execute = useCallback(async (params = null, options = {}) => {
    const {
      showSuccess = true,
      showError = true,
      successMessage = 'Operation completed successfully',
      errorMessage = 'Something went wrong'
    } = options

    setLoading(true)
    setError(null)
    
    try {
      const response = await apiFunction(params)
      setData(response)
      
      if (showSuccess && successMessage) {
        showNotification(successMessage, 'success')
      }
      
      return response
    } catch (err) {
      const errorMsg = err.response?.data?.message || errorMessage
      setError(errorMsg)
      
      if (showError) {
        showNotification(errorMsg, 'error')
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction, showNotification])

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return [execute, loading, error, data, reset]
}