import api from './api'

/**
 * Profile API Service
 * Handles all profile-related API calls
 */

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/profile/${userId || 'me'}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData)
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData()
    formData.append('profilePicture', file)
    
    const response = await api.post('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    throw error
  }
}

/**
 * Get profile statistics
 */
export const getProfileStats = async () => {
  try {
    const response = await api.get('/profile/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching profile stats:', error)
    return {
      success: true,
      stats: {
        connections: 0,
        posts: 0,
        views: 0
      }
    }
  }
}

/**
 * Update profile settings
 */
export const updateProfileSettings = async (settings) => {
  try {
    const response = await api.put('/profile/settings', settings)
    return response.data
  } catch (error) {
    console.error('Error updating profile settings:', error)
    throw error
  }
}

/**
 * Get profile visibility settings
 */
export const getProfileVisibility = async () => {
  try {
    const response = await api.get('/profile/visibility')
    return response.data
  } catch (error) {
    console.error('Error fetching profile visibility:', error)
    throw error
  }
}

/**
 * Update profile visibility
 */
export const updateProfileVisibility = async (visibility) => {
  try {
    const response = await api.put('/profile/visibility', visibility)
    return response.data
  } catch (error) {
    console.error('Error updating profile visibility:', error)
    throw error
  }
}
