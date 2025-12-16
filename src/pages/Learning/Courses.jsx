import React from 'react'
import CourseListingComponent from '../../components/learningCentre/CourseListing/CourseListing'

/**
 * Courses Page Component
 * Wraps the CourseListing component with page-level layout
 */
const Courses = () => {
  return (
    <div className="courses-page-wrapper">
      <CourseListingComponent />
    </div>
  )
}

export default Courses