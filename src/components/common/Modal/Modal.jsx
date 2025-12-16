import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Function to close modal
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (sm, md, lg, xl)
 * @param {boolean} props.closeOnOverlay - Whether to close modal when clicking overlay
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlay = true 
}) => {
  /**
   * Handle Escape key press to close modal
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27 && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  /**
   * Handle overlay click
   */
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlay) {
      onClose()
    }
  }

  // If modal is not open, don't render anything
  if (!isOpen) return null

  // Size classes for modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container ${sizeClasses[size]}`}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal