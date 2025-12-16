import React from 'react'
import EnrollmentComponent from '../../components/learningCentre/Enrollment/Enrollment'

/**
 * Enrollment Page Component
 * Wraps the Enrollment component with page-level layout
 */
const Enrollment = () => {
  return (
    <div className="enrollment-page-wrapper">
      <EnrollmentComponent />
    </div>
  )
}

export default Enrollment