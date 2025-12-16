import React from 'react'
import ProfileComponent from '../../components/dashboard/Profile/Profile'

/**
 * Profile Page Component
 * Wraps the Profile component with page-level layout
 * Handles user profile completion and management
 */
const Profile = () => {
  return (
    <div className="profile-page-wrapper">
      <ProfileComponent />
    </div>
  )
}

export default Profile