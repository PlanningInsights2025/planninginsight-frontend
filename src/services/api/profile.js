import api from './api'

/**
 * Profile API Service
<<<<<<< HEAD
 * Handles all profile-related API calls
=======
<<<<<<< HEAD
 * Handles all profile-related API calls
=======
<<<<<<< HEAD
 * Handles all profile-related API calls
=======
 * Handles all profile-related API calls including user profiles, skills, and experience
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
 */

/**
 * Get user profile
 */
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/profile/${userId || 'me'}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
export const getProfile = async (userId = null) => {
  try {
    const endpoint = userId ? `/profile/${userId}` : '/profile/me'
    const response = await api.get(endpoint)
    return response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
    throw error
  }
}

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
<<<<<<< HEAD
    const response = await api.put('/profile', profileData)
=======
<<<<<<< HEAD
    const response = await api.put('/profile', profileData)
=======
<<<<<<< HEAD
    const response = await api.put('/profile', profileData)
=======
    const response = await api.put('/profile/me', profileData)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
    return {
      success: true,
      stats: {
        connections: 0,
        posts: 0,
        views: 0
      }
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    // Return mock data as fallback
    return {
      profileViews: 0,
      searchAppearances: 0,
      postImpressions: 0,
      endorsements: 0
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
    }
  }
}

/**
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
 * Add experience
 */
export const addExperience = async (experienceData) => {
  try {
    const response = await api.post('/profile/experience', experienceData)
    return response.data
  } catch (error) {
    console.error('Error adding experience:', error)
    throw error
  }
}

/**
 * Update experience
 */
export const updateExperience = async (experienceId, experienceData) => {
  try {
    const response = await api.put(`/profile/experience/${experienceId}`, experienceData)
    return response.data
  } catch (error) {
    console.error('Error updating experience:', error)
    throw error
  }
}

/**
 * Delete experience
 */
export const deleteExperience = async (experienceId) => {
  try {
    const response = await api.delete(`/profile/experience/${experienceId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting experience:', error)
    throw error
  }
}

/**
 * Add education
 */
export const addEducation = async (educationData) => {
  try {
    const response = await api.post('/profile/education', educationData)
    return response.data
  } catch (error) {
    console.error('Error adding education:', error)
    throw error
  }
}

/**
 * Update education
 */
export const updateEducation = async (educationId, educationData) => {
  try {
    const response = await api.put(`/profile/education/${educationId}`, educationData)
    return response.data
  } catch (error) {
    console.error('Error updating education:', error)
    throw error
  }
}

/**
 * Delete education
 */
export const deleteEducation = async (educationId) => {
  try {
    const response = await api.delete(`/profile/education/${educationId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting education:', error)
    throw error
  }
}

/**
 * Add skill
 */
export const addSkill = async (skillData) => {
  try {
    const response = await api.post('/profile/skills', skillData)
    return response.data
  } catch (error) {
    console.error('Error adding skill:', error)
    throw error
  }
}

/**
 * Update skills
 */
export const updateSkills = async (skills) => {
  try {
    const response = await api.put('/profile/skills', { skills })
    return response.data
  } catch (error) {
    console.error('Error updating skills:', error)
    throw error
  }
}

/**
 * Delete skill
 */
export const deleteSkill = async (skillId) => {
  try {
    const response = await api.delete(`/profile/skills/${skillId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting skill:', error)
    throw error
  }
}

/**
 * Add certification
 */
export const addCertification = async (certificationData) => {
  try {
    const response = await api.post('/profile/certifications', certificationData)
    return response.data
  } catch (error) {
    console.error('Error adding certification:', error)
    throw error
  }
}

/**
 * Update certification
 */
export const updateCertification = async (certificationId, certificationData) => {
  try {
    const response = await api.put(`/profile/certifications/${certificationId}`, certificationData)
    return response.data
  } catch (error) {
    console.error('Error updating certification:', error)
    throw error
  }
}

/**
 * Delete certification
 */
export const deleteCertification = async (certificationId) => {
  try {
    const response = await api.delete(`/profile/certifications/${certificationId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting certification:', error)
    throw error
  }
}

/**
 * Endorse skill
 */
export const endorseSkill = async (userId, skillId) => {
  try {
    const response = await api.post(`/profile/${userId}/skills/${skillId}/endorse`)
    return response.data
  } catch (error) {
    console.error('Error endorsing skill:', error)
    throw error
  }
}

/**
 * Get profile completeness
 */
export const getProfileCompleteness = async () => {
  try {
    const response = await api.get('/profile/completeness')
    return response.data
  } catch (error) {
    console.error('Error fetching profile completeness:', error)
    return { percentage: 0, missingFields: [] }
  }
}

/**
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
export const getProfileVisibility = async () => {
  try {
    const response = await api.get('/profile/visibility')
    return response.data
  } catch (error) {
    console.error('Error fetching profile visibility:', error)
    throw error
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
export const getVisibilitySettings = async () => {
  try {
    const response = await api.get('/profile/settings/visibility')
    return response.data
  } catch (error) {
    console.error('Error fetching visibility settings:', error)
    return {}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
  }
}

/**
 * Update profile visibility
 */
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
export const updateProfileVisibility = async (visibility) => {
  try {
    const response = await api.put('/profile/visibility', visibility)
    return response.data
  } catch (error) {
    console.error('Error updating profile visibility:', error)
    throw error
  }
}
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
export const updateVisibility = async (visibilitySettings) => {
  try {
    const response = await api.put('/profile/settings/visibility', visibilitySettings)
    return response.data
  } catch (error) {
    console.error('Error updating visibility:', error)
    throw error
  }
}

export default {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getProfileStats,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkills,
  deleteSkill,
  addCertification,
  updateCertification,
  deleteCertification,
  endorseSkill,
  getProfileCompleteness,
  updateProfileSettings,
  getVisibilitySettings,
  updateVisibility
}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
