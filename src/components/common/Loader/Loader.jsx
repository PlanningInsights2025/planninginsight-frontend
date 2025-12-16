import React from 'react'

/**
 * Reusable Loading Component
 * @param {Object} props - Component props
 * @param {string} props.size - Loader size (sm, md, lg)
 * @param {string} props.color - Loader color
 * @param {string} props.text - Loading text to display
 * @param {boolean} props.overlay - Whether to show overlay background
 */
const Loader = ({ 
  size = 'md', 
  color = 'primary', 
  text = 'Loading...',
  overlay = false 
}) => {
  /**
   * Size classes for loader
   */
  const sizeClasses = {
    sm: 'loader-sm',
    md: 'loader-md',
    lg: 'loader-lg'
  }

  /**
   * Color classes for loader
   */
  const colorClasses = {
    primary: 'loader-primary',
    white: 'loader-white',
    secondary: 'loader-secondary'
  }

  /**
   * Render loader with optional overlay
   */
  const renderLoader = () => (
    <div className="loader-container">
      <div className={`loader-spinner ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && <p className="loader-text">{text}</p>}
    </div>
  )

  if (overlay) {
    return (
      <div className="loader-overlay">
        {renderLoader()}
      </div>
    )
  }

  return renderLoader()
}

export default Loader