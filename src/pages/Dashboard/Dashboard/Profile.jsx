import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Profile Page Component
 * Redirects to UserProfile component for profile management
 */
const Profile = () => {
  // Redirect to the main profile component
  return <Navigate to="/profile" replace />
}

export default Profile