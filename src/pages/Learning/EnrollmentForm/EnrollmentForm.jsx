import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { learningAPI } from '../../../services/api/learning'
import { 
  X, 
  Book, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'
import Modal from '../../common/Modal/Modal'

/**
 * Course Enrollment Form Component
 * Handles course enrollment with group booking options and payment integration
 * Includes Razorpay integration and enrollment confirmation
 */
const EnrollmentForm = ({ course, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [formData, setFormData] = useState({
    enrollmentType: 'individual',
    participants: [{ name: '', email: '', phone: '' }],
    paymentMethod: 'razorpay',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [groupSize, setGroupSize] = useState(1)

  // API hooks
  const [enrollInCourseApi] = useApi(learningAPI.enrollInCourse)

  /**
   * Initialize form with user data for individual enrollment
   */
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        participants: [{
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone || ''
        }]
      }))
    }
  }, [user])

  /**
   * Handle input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  /**
   * Handle participant information changes
   */
  const handleParticipantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      )
    }))
  }

  /**
   * Add new participant for group enrollment
   */
  const addParticipant = () => {
    if (formData.participants.length >= 10) {
      showNotification('Maximum 10 participants allowed for group enrollment', 'error')
      return
    }

    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { name: '', email: '', phone: '' }]
    }))
  }

  /**
   * Remove participant from group enrollment
   */
  const removeParticipant = (index) => {
    if (formData.participants.length <= 1) {
      showNotification('At least one participant is required', 'error')
      return
    }

    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }))
  }

  /**
   * Handle group size change
   */
  const handleGroupSizeChange = (size) => {
    setGroupSize(size)
    
    // Calculate group discount
    const basePrice = course.fees
    let totalPrice = basePrice * size
    
    // Apply group discounts
    if (size >= 5 && size <= 10) {
      totalPrice = totalPrice * 0.9 // 10% discount for 5-10 participants
    } else if (size > 10) {
      totalPrice = totalPrice * 0.8 // 20% discount for more than 10 participants
    }
    
    // Update participants array
    const newParticipants = Array(size).fill().map((_, index) => 
      formData.participants[index] || { name: '', email: '', phone: '' }
    )
    
    setFormData(prev => ({
      ...prev,
      participants: newParticipants
    }))
  }

  /**
   * Validate form data
   */
  const validateForm = () => {
    const validationErrors = {}

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      validationErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    // Validate participant information for group enrollment
    if (formData.enrollmentType === 'group') {
      formData.participants.forEach((participant, index) => {
        if (!participant.name.trim()) {
          validationErrors[`participant_${index}_name`] = 'Participant name is required'
        }
        if (!participant.email.trim()) {
          validationErrors[`participant_${index}_email`] = 'Participant email is required'
        } else if (!/\S+@\S+\.\S+/.test(participant.email)) {
          validationErrors[`participant_${index}_email`] = 'Participant email is invalid'
        }
      })
    }

    return validationErrors
  }

  /**
   * Calculate total price
   */
  const calculateTotalPrice = () => {
    if (course.fees === 0) return 0

    const participantCount = formData.enrollmentType === 'group' 
      ? formData.participants.length 
      : 1

    let total = course.fees * participantCount

    // Apply group discounts
    if (formData.enrollmentType === 'group' && participantCount >= 5) {
      if (participantCount <= 10) {
        total = total * 0.9 // 10% discount
      } else {
        total = total * 0.8 // 20% discount
      }
    }

    return Math.round(total)
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Validate form
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showNotification('Please fix the errors in the form', 'error')
      return
    }

    setSubmitting(true)

    try {
      const enrollmentData = {
        courseId: course.id,
        enrollmentType: formData.enrollmentType,
        participants: formData.participants,
        totalAmount: calculateTotalPrice(),
        paymentMethod: formData.paymentMethod,
        enrolledAt: new Date().toISOString()
      }

      // For free courses, enroll directly
      if (course.fees === 0) {
        const result = await enrollInCourseApi(course.id, enrollmentData, {
          successMessage: 'Successfully enrolled in the course!'
        })

        if (result) {
          onSuccess()
        }
      } else {
        // For paid courses, integrate with Razorpay
        await handleRazorpayPayment(enrollmentData)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Handle Razorpay payment integration
   */
  const handleRazorpayPayment = async (enrollmentData) => {
    // Simulate Razorpay integration
    showNotification('Redirecting to payment gateway...', 'info')
    
    // In real implementation, this would integrate with Razorpay API
    setTimeout(async () => {
      try {
        // Simulate successful payment
        const result = await enrollInCourseApi(course.id, {
          ...enrollmentData,
          paymentStatus: 'completed',
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9)
        }, {
          successMessage: 'Payment successful! You are now enrolled in the course.'
        })

        if (result) {
          onSuccess()
        }
      } catch (error) {
        showNotification('Payment failed. Please try again.', 'error')
      }
    }, 2000)
  }

  /**
   * Format price for display
   */
  const formatPrice = (price) => {
    if (price === 0) return 'Free'
    return `₹${price.toLocaleString()}`
  }

  /**
   * Render enrollment type selection
   */
  const renderEnrollmentType = () => (
    <div className="form-section">
      <h3>Enrollment Type</h3>
      
      <div className="enrollment-options">
        <label className="option-card">
          <input
            type="radio"
            name="enrollmentType"
            value="individual"
            checked={formData.enrollmentType === 'individual'}
            onChange={(e) => handleInputChange('enrollmentType', e.target.value)}
            className="option-input"
          />
          <div className="option-content">
            <div className="option-header">
              <Users size={20} />
              <h4>Individual Enrollment</h4>
            </div>
            <p>Enroll yourself in this course</p>
            <div className="option-price">
              {formatPrice(course.fees)}
            </div>
          </div>
        </label>

        <label className="option-card">
          <input
            type="radio"
            name="enrollmentType"
            value="group"
            checked={formData.enrollmentType === 'group'}
            onChange={(e) => handleInputChange('enrollmentType', e.target.value)}
            className="option-input"
          />
          <div className="option-content">
            <div className="option-header">
              <Users size={20} />
              <h4>Group Enrollment</h4>
              <span className="discount-badge">Save up to 20%</span>
            </div>
            <p>Enroll multiple participants with group discounts</p>
            <div className="group-pricing">
              <div className="price-tier">
                <span>1-4 participants:</span>
                <span>Regular pricing</span>
              </div>
              <div className="price-tier">
                <span>5-10 participants:</span>
                <span>10% discount</span>
              </div>
              <div className="price-tier">
                <span>10+ participants:</span>
                <span>20% discount</span>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  )

  /**
   * Render group size selector
   */
  const renderGroupSizeSelector = () => {
    if (formData.enrollmentType !== 'group') return null

    return (
      <div className="form-section">
        <h3>Group Size</h3>
        <p className="section-description">
          Select the number of participants for group enrollment
        </p>
        
        <div className="group-size-selector">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
            <button
              key={size}
              type="button"
              className={`size-option ${groupSize === size ? 'active' : ''}`}
              onClick={() => handleGroupSizeChange(size)}
            >
              {size} {size === 1 ? 'Person' : 'People'}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /**
   * Render participants form
   */
  const renderParticipantsForm = () => {
    if (formData.enrollmentType !== 'group') return null

    return (
      <div className="form-section">
        <h3>Participant Information</h3>
        <p className="section-description">
          Enter details for all participants. Each participant will receive individual access.
        </p>
        
        <div className="participants-list">
          {formData.participants.map((participant, index) => (
            <div key={index} className="participant-card">
              <div className="participant-header">
                <h4>Participant {index + 1}</h4>
                {formData.participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="remove-participant"
                    aria-label={`Remove participant ${index + 1}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="participant-fields">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                    className={`form-input ${errors[`participant_${index}_name`] ? 'error' : ''}`}
                    placeholder="Enter participant's full name"
                  />
                  {errors[`participant_${index}_name`] && (
                    <span className="error-message">{errors[`participant_${index}_name`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    value={participant.email}
                    onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                    className={`form-input ${errors[`participant_${index}_email`] ? 'error' : ''}`}
                    placeholder="Enter participant's email"
                  />
                  {errors[`participant_${index}_email`] && (
                    <span className="error-message">{errors[`participant_${index}_email`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={participant.phone}
                    onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                    className="form-input"
                    placeholder="Enter participant's phone number"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {formData.participants.length < 10 && (
          <button
            type="button"
            onClick={addParticipant}
            className="btn btn-outline"
          >
            + Add Another Participant
          </button>
        )}
      </div>
    )
  }

  /**
   * Render pricing summary
   */
  const renderPricingSummary = () => (
    <div className="pricing-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-details">
        <div className="summary-row">
          <span>Course Fee</span>
          <span>{formatPrice(course.fees)} × {formData.participants.length}</span>
        </div>
        
        {formData.enrollmentType === 'group' && formData.participants.length >= 5 && (
          <div className="summary-row discount">
            <span>
              Group Discount ({formData.participants.length >= 10 ? '20%' : '10%'})
            </span>
            <span>-{formatPrice(course.fees * formData.participants.length - calculateTotalPrice())}</span>
          </div>
        )}
        
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>{formatPrice(calculateTotalPrice())}</span>
        </div>
      </div>

      {course.fees > 0 && (
        <div className="coupon-section">
          <h4>Coupon Code</h4>
          <div className="coupon-input-group">
            <input type="text" placeholder="Enter coupon" className="form-input" />
            <button type="button" className="btn-apply">Apply</button>
          </div>
        </div>
      )}

      {course.fees === 0 ? (
        <div className="free-enrollment-notice">
          <CheckCircle size={16} />
          <span>This course is free. No payment required.</span>
        </div>
      ) : (
        <div className="payment-section">
          <h4>Payment Method</h4>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={formData.paymentMethod === 'razorpay'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="payment-input"
              />
              <div className="payment-content">
                <div className="payment-icon">💳</div>
                <div className="payment-details">
                  <span className="payment-label">Credit/Debit Card</span>
                  <span className="payment-desc">Pay securely with your card</span>
                </div>
              </div>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === 'upi'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="payment-input"
              />
              <div className="payment-content">
                <div className="payment-icon">📱</div>
                <div className="payment-details">
                  <span className="payment-label">UPI Payment</span>
                  <span className="payment-desc">Instant payment with UPI</span>
                </div>
              </div>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={formData.paymentMethod === 'netbanking'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="payment-input"
              />
              <div className="payment-content">
                <div className="payment-icon">🏦</div>
                <div className="payment-details">
                  <span className="payment-label">Net Banking</span>
                  <span className="payment-desc">Transfer from your bank</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? (
            <Loader size="sm" />
          ) : course.fees === 0 ? (
            'Enroll for Free'
          ) : (
            `Pay ${formatPrice(calculateTotalPrice())}`
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  )

  /**
   * Render terms and conditions
   */
  const renderTermsAndConditions = () => (
    <div className="form-section">
      <label className="checkbox-label terms-checkbox">
        <input
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
          className="checkbox-input"
        />
        <span className="checkbox-custom"></span>
        <span className="checkbox-text">
          I agree to the{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          ,{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          , and understand that course access is subject to platform guidelines.
        </span>
      </label>
      {errors.agreeToTerms && (
        <span className="error-message">{errors.agreeToTerms}</span>
      )}
    </div>
  )

  /**
   * Render form actions
   */
  const renderFormActions = () => (
    <div className="form-actions">
      <button
        type="button"
        onClick={onClose}
        className="btn btn-outline"
        disabled={submitting}
      >
        Cancel
      </button>
      
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
      >
        {submitting ? (
          <Loader size="sm" />
        ) : course.fees === 0 ? (
          <>
            <CheckCircle size={18} />
            Enroll for Free
          </>
        ) : (
          <>
            <DollarSign size={18} />
            Proceed to Payment
          </>
        )}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll in Course"
      size="xl"
      closeOnOverlay={!submitting}
    >
      <form onSubmit={handleSubmit} className="enrollment-form">
        <div className="form-main">
          {renderEnrollmentType()}
          {renderGroupSizeSelector()}
          {renderParticipantsForm()}
          {renderTermsAndConditions()}
        </div>
        {renderPricingSummary()}
      </form>
    </Modal>
  )
}

export default EnrollmentForm