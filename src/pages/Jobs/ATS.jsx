import React from 'react'
import ATSComponent from '../../components/jobPortal/ATS/ATS'

/**
 * ATS Page Component
 * Wraps the ATS component with page-level layout
 */
const ATS = () => {
  return (
    <div className="ats-page-wrapper">
      <ATSComponent />
    </div>
  )
}

export default ATS