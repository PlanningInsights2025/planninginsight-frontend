import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileComponent from '../../components/dashboard/Profile/Profile'
import './Profile.css'

/**
 * Profile Page Component
 * Wraps the Profile component with page-level layout
 * Handles user profile completion and management
 */
const Profile = () => {
  const navigate = useNavigate()

  return (
    <div className="profile-page-wrapper">
      <ProfileComponent />
    </div>
  )
}

export default Profile