import React from 'react'
import RecruiterProfileComponent from '../../components/jobPortal/RecruiterProfile/RecruiterProfile'

/**
 * Recruiter Profile Page Component
 * Wraps the RecruiterProfile component with page-level layout
 */
const RecruiterProfile = () => {
  return (
    <div className="recruiter-profile-page-wrapper">
      <RecruiterProfileComponent />
    </div>
  )
}

export default RecruiterProfile