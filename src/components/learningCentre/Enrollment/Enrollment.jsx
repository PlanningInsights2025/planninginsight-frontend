import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { learningAPI } from '../../../services/api/learning'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  PlayCircle,
  FileText,
  Award,
  Download,
  Users,
  Star,
  Bookmark,
  Share2
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'

/**
 * Course Enrollment Component
 * Handles course enrollment process and payment integration
 */
const Enrollment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()
  const courseFromState = location.state?.course

  // State management
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)

  // API hooks
  const [fetchCourseApi] = useApi(learningAPI.getCourseById)
  const [enrollCourseApi] = useApi(learningAPI.enrollInCourse)

  /**
   * Redirect if not authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Please sign in to enroll in courses', 'info')
      navigate('/login', { state: { from: `/learning/courses/${id}/enroll` } })
    }
  }, [isAuthenticated, navigate, id, showNotification])

  /**
   * Fetch course details
   */
  useEffect(() => {
    if (isAuthenticated && !course) {
      loadCourseDetails()
    }
  }, [id, isAuthenticated, course])

  /**
   * Load course details
   */
  const loadCourseDetails = async () => {
    if (courseFromState) {
      setCourse(courseFromState)
      setLoading(false)
      return
    }
    
    try {
      const courseData = await fetchCourseApi(id, {
        showError: false
      })

      if (courseData) {
        setCourse(courseData)
        if (courseData.isEnrolled) {
          showNotification('You are already enrolled in this course', 'info')
          navigate(`/learning/courses/${id}/learn`)
        }
      } else {
        setError('Failed to load course details')
      }
    } catch (err) {
      setError('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Apply coupon code
   */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showNotification('Please enter a coupon code', 'error')
      return
    }

    setCouponLoading(true)

    try {
      // Simulate coupon validation
      setTimeout(() => {
        const validCoupons = {
          'WELCOME10': 0.1,
          'STUDENT20': 0.2,
          'EARLYBIRD': 0.15
        }

        const discount = validCoupons[couponCode.toUpperCase()]
        
        if (discount) {
          setCouponApplied(true)
          showNotification(`Coupon applied! ${discount * 100}% discount`, 'success')
        } else {
          showNotification('Invalid coupon code', 'error')
        }
        
        setCouponLoading(false)
      }, 1000)
    } catch (error) {
      showNotification('Failed to apply coupon', 'error')
      setCouponLoading(false)
    }
  }

  /**
   * Calculate final price
   */
  const calculateFinalPrice = () => {
    if (!course) return 0

    let finalPrice = course.discountPrice || course.fees

    if (couponApplied) {
      const validCoupons = {
        'WELCOME10': 0.1,
        'STUDENT20': 0.2,
        'EARLYBIRD': 0.15
      }
      const discount = validCoupons[couponCode.toUpperCase()] || 0
      finalPrice = finalPrice * (1 - discount)
    }

    return Math.round(finalPrice)
  }

  /**
   * Process enrollment
   */
  const handleEnrollment = async (e) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const paymentData = {
        paymentMethod,
        amount: calculateFinalPrice(),
        couponCode: couponApplied ? couponCode : undefined,
        billingInfo
      }

      const result = await enrollCourseApi(
        { courseId: id, ...paymentData },
        {
          successMessage: 'Successfully enrolled in the course!',
          showError: true
        }
      )

      if (result) {
        // Redirect to learning interface
        navigate(`/learning/courses/${id}/learn`)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setProcessing(false)
    }
  }

  /**
   * Format price for display
   */
  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`
  }

  /**
   * Render course summary
   */
  const renderCourseSummary = () => {
    if (!course) return null
    
    return (
    <div className="course-summary-card">
      <div className="course-header">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
        )}
        <div className="course-info">
          <h3>{course.title}</h3>
          <p className="instructor">By {course.instructor.name}</p>
          <div className="course-meta">
            <div className="meta-item">
              <Clock size={16} />
              <span>{course.duration} weeks</span>
            </div>
            <div className="meta-item">
              <PlayCircle size={16} />
              <span>
                {course.format === 'live' && 'Live Online'}
                {course.format === 'recorded' && 'Self-Paced'}
                {course.format === 'offline' && 'In-Person'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-breakdown">
        <h4>Order Summary</h4>
        <div className="breakdown-item">
          <span>Course Price</span>
          <span>{formatPrice(course.fees)}</span>
        </div>
        
        {course.discountPrice && (
          <div className="breakdown-item discount">
            <span>Discount</span>
            <span>-{formatPrice(course.fees - course.discountPrice)}</span>
          </div>
        )}

        {couponApplied && (
          <div className="breakdown-item coupon">
            <span>Coupon Discount ({couponCode})</span>
            <span>-{formatPrice((course.discountPrice || course.fees) - calculateFinalPrice())}</span>
          </div>
        )}

        <div className="breakdown-item total">
          <span>Total</span>
          <span>{formatPrice(calculateFinalPrice())}</span>
        </div>
      </div>

      <div className="course-features">
        <h4>What's Included</h4>
        <ul>
          <li>
            <CheckCircle size={16} />
            <span>Lifetime access to course content</span>
          </li>
          <li>
            <CheckCircle size={16} />
            <span>Certificate of completion</span>
          </li>
          <li>
            <CheckCircle size={16} />
            <span>Q&A support from instructor</span>
          </li>
          <li>
            <CheckCircle size={16} />
            <span>Downloadable resources</span>
          </li>
          <li>
            <CheckCircle size={16} />
            <span>30-day money-back guarantee</span>
          </li>
        </ul>
      </div>
    </div>
  )
  }

  /**
   * Render billing form
   */
  const renderBillingForm = () => (
    <form onSubmit={handleEnrollment} className="billing-form">
      <div className="form-section">
        <h3>Billing Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              value={billingInfo.firstName}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                firstName: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              value={billingInfo.lastName}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                lastName: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={billingInfo.email}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                email: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={billingInfo.phone}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                phone: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>Address *</label>
            <input
              type="text"
              value={billingInfo.address}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                address: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              value={billingInfo.city}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                city: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              value={billingInfo.state}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                state: e.target.value
              }))}
              required
            />
          </div>
          <div className="form-group">
            <label>ZIP Code *</label>
            <input
              type="text"
              value={billingInfo.zipCode}
              onChange={(e) => setBillingInfo(prev => ({
                ...prev,
                zipCode: e.target.value
              }))}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Payment Method</h3>
        <div className="payment-methods">
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="method-content">
              <div className="method-icon">💳</div>
              <div className="method-info">
                <strong>Credit/Debit Card</strong>
                <span>Pay securely with your card</span>
              </div>
            </div>
          </label>

          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="method-content">
              <div className="method-icon">📱</div>
              <div className="method-info">
                <strong>UPI</strong>
                <span>Instant payment with UPI</span>
              </div>
            </div>
          </label>

          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="netbanking"
              checked={paymentMethod === 'netbanking'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="method-content">
              <div className="method-icon">🏦</div>
              <div className="method-info">
                <strong>Net Banking</strong>
                <span>Transfer from your bank</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Coupon Code</h3>
        <div className="coupon-section">
          <div className="coupon-input">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponApplied}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || couponApplied || !couponCode.trim()}
              className="btn btn-outline"
            >
              {couponLoading ? <Loader size="sm" /> : couponApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
          {couponApplied && (
            <div className="coupon-success">
              <CheckCircle size={16} />
              <span>Coupon applied successfully!</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => navigate(`/learning/courses/${id}`)}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={processing}
          className="btn btn-primary btn-large"
        >
          {processing ? <Loader size="sm" /> : `Pay ${formatPrice(calculateFinalPrice())}`}
        </button>
      </div>
    </form>
  )

  if (loading) {
    return (
      <div className="enrollment-loading">
        <Loader size="lg" text="Loading enrollment..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (error) {
    return (
      <div className="enrollment-loading">
        <div style={{textAlign: 'center', padding: '40px'}}>
          <p style={{color: '#dc2626', marginBottom: '16px'}}>{error}</p>
          <button onClick={() => navigate('/learning')} className="btn btn-primary">
            Back to Learning
          </button>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="enrollment-page">
      <div className="container">
        {/* Back Navigation */}
        <div className="back-navigation">
          <button onClick={() => navigate(`/learning/courses/${id}`)} className="back-button">
            <ArrowLeft size={20} />
            Back to Course
          </button>
        </div>

        <div className="enrollment-header">
          <h1>Complete Your Enrollment</h1>
          <p>You're one step away from starting your learning journey</p>
        </div>

        <div className="enrollment-layout">
          {/* Main Content */}
          <div className="enrollment-main">
            {renderBillingForm()}
          </div>

          {/* Sidebar */}
          <div className="enrollment-sidebar">
            {renderCourseSummary()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Enrollment