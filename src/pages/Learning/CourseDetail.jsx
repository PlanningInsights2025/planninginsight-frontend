import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { useApi } from '../../hooks/useApi'
import { learningAPI } from '../../services/api/learning'
import { 
  ArrowLeft, 
  Book, 
  Clock, 
  Users,
  Star,
  PlayCircle,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Share2,
  Heart
} from 'lucide-react'
import Loader from '../../components/common/Loader/Loader'
// Local Enrollment modal implemented below (replaces external EnrollmentForm)

/**
 * Course Detail Page Component
 * Shows complete course information and handles course enrollment process
 * Includes instructor information, curriculum, reviews, and similar course recommendations
 */
const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [similarCourses, setSimilarCourses] = useState([])
  const [instructorInfo, setInstructorInfo] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [reviews, setReviews] = useState([])

  // API hooks
  const [fetchCourseApi] = useApi(learningAPI.getCourseById)
  const [fetchSimilarCoursesApi] = useApi(learningAPI.getSimilarCourses)
  const [fetchReviewsApi] = useApi(learningAPI.getCourseReviews)

  /**
   * Fetch course details on component mount
   */
  useEffect(() => {
    if (id) {
      loadCourseDetails()
    }
  }, [id])

  /**
   * Load course details and related data
   */
  const loadCourseDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch course details
      const courseData = await fetchCourseApi(id, {
        showError: true,
        errorMessage: 'Failed to load course details'
      })
      
      if (courseData) {
        setCourse(courseData)
        
        // Fetch similar courses
        const similarCoursesData = await fetchSimilarCoursesApi(id)
        setSimilarCourses(similarCoursesData || [])
        
        // Fetch reviews
        const reviewsData = await fetchReviewsApi(id)
        setReviews(reviewsData || [])
        
        // Fetch instructor info (would come from API in real implementation)
        loadInstructorInfo(courseData.instructorId)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load instructor information (mock data for now)
   */
  const loadInstructorInfo = (instructorId) => {
    // Mock instructor data
    const mockInstructor = {
      id: instructorId,
      name: 'Dr. Priya Sharma',
      title: 'Professor of Urban Planning',
      bio: 'Dr. Sharma has over 15 years of experience in urban planning and smart city development. She has worked with multiple government agencies and international organizations on sustainable urban development projects.',
      rating: 4.8,
      totalStudents: 12500,
      totalCourses: 8,
      experience: '15+ years',
      specialization: ['Smart Cities', 'Sustainable Development', 'Urban Analytics'],
      achievements: [
        'UN Habitat Advisory Board Member',
        'Author of "Smart Cities in Developing Economies"',
        'TEDx Speaker on Urban Innovation'
      ],
      profilePicture: null
    }
    setInstructorInfo(mockInstructor)
  }

  /**
   * Handle course enrollment
   */
  const handleEnroll = () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to enroll in this course', 'info')
      navigate('/login', { state: { from: `/learning/courses/${id}/enroll` } })
      return
    }
    // Navigate to the full enrollment page and pass the course
    navigate('/learning/enroll', { state: { course } })
  }

  /**
   * Handle save course
   */
  const handleSaveCourse = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to save courses', 'info')
      return
    }

    try {
      await learningAPI.toggleSaveCourse(id)
      showNotification('Course saved successfully', 'success')
    } catch (error) {
      showNotification('Failed to save course', 'error')
    }
  }

  /**
   * Handle share course
   */
  const handleShareCourse = () => {
    const courseUrl = window.location.href
    navigator.clipboard.writeText(courseUrl)
    showNotification('Course link copied to clipboard', 'success')
  }

  /**
   * Format price for display
   */
  const formatPrice = (price) => {
    if (price === 0) return 'Free'
    return `₹${price.toLocaleString()}`
  }

  /**
   * Format duration for display
   */
  const formatDuration = (duration) => {
    if (duration < 4) return `${duration} weeks`
    return `${duration} weeks`
  }

  /**
   * Calculate discount percentage
   */
  const calculateDiscount = (original, current) => {
    if (original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  /**
   * Render course header section
   */
  const renderCourseHeader = () => (
    <div className="course-header">
      <div className="back-navigation">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>
      </div>

      <div className="course-title-section">
        <div className="title-content">
          <div className="course-category">{course.category}</div>
          <h1>{course.title}</h1>
          <div className="instructor-info">
            <span>By {course.instructor}</span>
            {instructorInfo && (
              <span className="instructor-rating">
                <Star size={14} fill="currentColor" />
                {instructorInfo.rating}
              </span>
            )}
          </div>
        </div>

        <div className="course-actions">
          <button 
            className="icon-button"
            onClick={handleSaveCourse}
            title="Save course"
          >
            <Heart size={20} />
          </button>
          <button 
            className="icon-button"
            onClick={handleShareCourse}
            title="Share course"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="course-meta-overview">
        <div className="meta-item">
          <Clock size={18} />
          <span>{formatDuration(course.duration)}</span>
        </div>
        <div className="meta-item">
          <Users size={18} />
          <span>{course.enrollments.toLocaleString()} students</span>
        </div>
        <div className="meta-item">
          <Star size={18} fill="currentColor" />
          <span>{course.rating} ({course.reviewCount} reviews)</span>
        </div>
        {course.courseType === 'offline' && course.location && (
          <div className="meta-item">
            <MapPin size={18} />
            <span>{course.location}</span>
          </div>
        )}
        {course.nextSession && course.courseType === 'live' && (
          <div className="meta-item">
            <Calendar size={18} />
            <span>Starts {new Date(course.nextSession).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Enrollment Section */}
      <div className="enrollment-section">
        {isAuthenticated ? (
          <div className="enrollment-actions">
            <div className="pricing-info">
              <div className="price-display">
                <span className="current-price">{formatPrice(course.fees)}</span>
                {course.originalFees > course.fees && (
                  <>
                    <span className="original-price">₹{course.originalFees.toLocaleString()}</span>
                    <span className="discount-badge">
                      {calculateDiscount(course.originalFees, course.fees)}% OFF
                    </span>
                  </>
                )}
              </div>
              {course.earlyBird && (
                <div className="early-bird-notice">
                  <AlertCircle size={16} />
                  <span>Early bird pricing ends soon!</span>
                </div>
              )}
            </div>
            
            <button 
              className="btn btn-primary btn-large"
              onClick={handleEnroll}
            >
              <Book size={20} />
              Enroll Now
            </button>
          </div>
        ) : (
          <div className="login-prompt">
            <div className="prompt-content">
              <Eye size={24} />
              <p>Sign in to enroll in this course and access all features</p>
              <Link to="/login" className="btn btn-primary">
                Sign In to Enroll
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Render course tabs navigation
   */
  const renderCourseTabs = () => (
    <nav className="course-tabs">
      <div className="tabs-container">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'curriculum', label: 'Curriculum' },
          { id: 'instructor', label: 'Instructor' },
          { id: 'reviews', label: `Reviews (${reviews.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )

  /**
   * Render overview tab content
   */
  const renderOverviewTab = () => (
    <div className="tab-content">
      <div className="course-description">
        <h2>About This Course</h2>
        <p>{course.description}</p>
      </div>

      <div className="learning-objectives">
        <h3>What You'll Learn</h3>
        <div className="objectives-grid">
          <div className="objective-item">
            <CheckCircle size={16} />
            <span>Understand smart city planning principles</span>
          </div>
          <div className="objective-item">
            <CheckCircle size={16} />
            <span>Implement IoT solutions for urban development</span>
          </div>
          <div className="objective-item">
            <CheckCircle size={16} />
            <span>Analyze urban data for decision making</span>
          </div>
          <div className="objective-item">
            <CheckCircle size={16} />
            <span>Develop sustainable urban development strategies</span>
          </div>
        </div>
      </div>

      <div className="course-features">
        <h3>Course Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <PlayCircle size={24} />
            <div>
              <h4>Video Content</h4>
              <p>{course.duration * 4} hours of on-demand video</p>
            </div>
          </div>
          <div className="feature-item">
            <Download size={24} />
            <div>
              <h4>Resources</h4>
              <p>Downloadable resources and exercises</p>
            </div>
          </div>
          <div className="feature-item">
            <FileText size={24} />
            <div>
              <h4>Certificate</h4>
              <p>Certificate of completion</p>
            </div>
          </div>
          <div className="feature-item">
            <Clock size={24} />
            <div>
              <h4>Lifetime Access</h4>
              <p>Full lifetime access to course materials</p>
            </div>
          </div>
        </div>
      </div>

      {course.tags && course.tags.length > 0 && (
        <div className="course-tags">
          <h3>Skills You'll Gain</h3>
          <div className="tags-list">
            {course.tags.map((tag, index) => (
              <span key={index} className="skill-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  /**
   * Render curriculum tab content
   */
  const renderCurriculumTab = () => (
    <div className="tab-content">
      <div className="curriculum-header">
        <h2>Course Curriculum</h2>
        <div className="curriculum-stats">
          <span>{course.duration * 4} hours of content</span>
          <span>{course.duration} weeks</span>
          <span>{course.duration * 2} lessons</span>
        </div>
      </div>

      <div className="curriculum-sections">
        {[1, 2, 3, 4, 5, 6].map((week) => (
          <div key={week} className="curriculum-section">
            <div className="section-header">
              <h3>Week {week}: {getWeekTitle(week)}</h3>
              <span>{week * 4 - 3}-{week * 4} hours</span>
            </div>
            <div className="section-lessons">
              {[1, 2, 3, 4].map((lesson) => (
                <div key={lesson} className="lesson-item">
                  <div className="lesson-info">
                    <PlayCircle size={16} />
                    <span>Lesson {lesson}: {getLessonTitle(week, lesson)}</span>
                  </div>
                  <div className="lesson-duration">45 min</div>
                </div>
              ))}
              <div className="lesson-item assignment">
                <div className="lesson-info">
                  <FileText size={16} />
                  <span>Weekly Assignment</span>
                </div>
                <div className="lesson-duration">1 hour</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  /**
   * Get week title based on week number
   */
  const getWeekTitle = (week) => {
    const titles = [
      'Introduction to Smart Cities',
      'IoT and Urban Infrastructure',
      'Data Analytics for Urban Planning',
      'Sustainable Development Strategies',
      'Case Studies and Implementation',
      'Future Trends and Capstone Project'
    ]
    return titles[week - 1] || 'Advanced Topics'
  }

  /**
   * Get lesson title based on week and lesson
   */
  const getLessonTitle = (week, lesson) => {
    const lessons = [
      ['Understanding Smart City Concepts', 'IoT Applications in Urban Development', 'Data Collection Methods', 'Sustainability Principles'],
      ['Sensor Networks and Data Acquisition', 'Smart Transportation Systems', 'Energy Management', 'Waste Management Solutions'],
      ['Urban Data Analysis Techniques', 'Predictive Modeling', 'Visualization Tools', 'Decision Support Systems'],
      ['Green Building Standards', 'Renewable Energy Integration', 'Community Engagement', 'Policy Framework'],
      ['Singapore Smart Nation Case Study', 'Barcelona Superblocks', 'Mumbai Urban Development', 'Dubai Smart City'],
      ['AI in Urban Planning', 'Blockchain for Governance', '5G and Connectivity', 'Capstone Project Workshop']
    ]
    return lessons[week - 1]?.[lesson - 1] || 'Advanced Topic Discussion'
  }

  /**
   * Render instructor tab content
   */
  const renderInstructorTab = () => (
    <div className="tab-content">
      {instructorInfo && (
        <div className="instructor-profile">
          <div className="instructor-header">
            <div className="instructor-avatar">
              {instructorInfo.profilePicture ? (
                <img src={instructorInfo.profilePicture} alt={instructorInfo.name} />
              ) : (
                <div className="avatar-placeholder">
                  <Book size={24} />
                </div>
              )}
            </div>
            <div className="instructor-details">
              <h2>{instructorInfo.name}</h2>
              <p className="instructor-title">{instructorInfo.title}</p>
              <div className="instructor-stats">
                <div className="stat">
                  <Star size={16} fill="currentColor" />
                  <span>{instructorInfo.rating} Instructor Rating</span>
                </div>
                <div className="stat">
                  <Users size={16} />
                  <span>{instructorInfo.totalStudents.toLocaleString()} Students</span>
                </div>
                <div className="stat">
                  <Book size={16} />
                  <span>{instructorInfo.totalCourses} Courses</span>
                </div>
              </div>
            </div>
          </div>

          <div className="instructor-bio">
            <h3>About the Instructor</h3>
            <p>{instructorInfo.bio}</p>
          </div>

          <div className="instructor-specialization">
            <h3>Specialization</h3>
            <div className="specialization-tags">
              {instructorInfo.specialization.map((spec, index) => (
                <span key={index} className="specialization-tag">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {instructorInfo.achievements && instructorInfo.achievements.length > 0 && (
            <div className="instructor-achievements">
              <h3>Achievements & Recognition</h3>
              <ul>
                {instructorInfo.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  /**
   * Render reviews tab content
   */
  const renderReviewsTab = () => (
    <div className="tab-content">
      <div className="reviews-header">
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{course.rating}</span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= Math.floor(course.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="rating-count">Course Rating · {course.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <h4>{review.reviewerName}</h4>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="review-content">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this course!</p>
          </div>
        )}
      </div>

      {reviews.length > 5 && (
        <div className="reviews-footer">
          <button className="btn btn-outline">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  )

  /**
   * Render similar courses section
   */
  const renderSimilarCourses = () => (
    <div className="similar-courses-section">
      <h2>Similar Courses You Might Like</h2>
      <div className="similar-courses-grid">
        {similarCourses.slice(0, 3).map(similarCourse => (
          <div key={similarCourse.id} className="similar-course-card">
            <div className="similar-course-image">
              {similarCourse.image ? (
                <img src={similarCourse.image} alt={similarCourse.title} />
              ) : (
                <div className="image-placeholder">
                  <Book size={24} />
                </div>
              )}
            </div>
            
            <div className="similar-course-content">
              <h4>{similarCourse.title}</h4>
              <div className="similar-course-meta">
                <span className="instructor">{similarCourse.instructor}</span>
                <span className="rating">
                  <Star size={14} fill="currentColor" />
                  {similarCourse.rating}
                </span>
              </div>
              <div className="similar-course-price">
                {formatPrice(similarCourse.fees)}
              </div>
            </div>
            
            <div className="similar-course-actions">
              <Link 
                to={`/learning/courses/${similarCourse.id}`}
                className="btn btn-outline btn-small"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {similarCourses.length === 0 && (
        <div className="no-similar-courses">
          <p>No similar courses found at the moment.</p>
          <Link to="/learning" className="btn btn-outline">
            Browse All Courses
          </Link>
        </div>
      )}
    </div>
  )

  

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="loading-content">
          <Loader size="lg" text="Loading course details..." />
        </div>
      </div>
    )
  }

  /**
   * Render not found state
   */
  if (!course) {
    return (
      <div className="course-not-found">
        <div className="not-found-content">
          <AlertCircle size={48} />
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/learning" className="btn btn-primary">
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="course-detail-page">
      <div className="container">
        {/* Main Course Content */}
        <div className="course-detail-content">
          <div className="main-content">
            {renderCourseHeader()}
            {renderCourseTabs()}
            
            {/* Tab Content */}
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'curriculum' && renderCurriculumTab()}
            {activeTab === 'instructor' && renderInstructorTab()}
            {activeTab === 'reviews' && renderReviewsTab()}
            
            {renderSimilarCourses()}
          </div>
          
          <div className="sidebar-content">
            {/* Quick Enroll Card */}
            {isAuthenticated && (
              <div className="quick-enroll-card">
                <div className="card-content">
                  <h3>Ready to Start Learning?</h3>
                  <div className="pricing">
                    <span className="price">{formatPrice(course.fees)}</span>
                    {course.originalFees > course.fees && (
                      <span className="original-price">₹{course.originalFees.toLocaleString()}</span>
                    )}
                  </div>
                  <button 
                    className="btn btn-primary w-full"
                    onClick={handleEnroll}
                  >
                    <Book size={18} />
                    Enroll Now
                  </button>
                  <div className="enrollment-info">
                    <div className="info-item">
                      <CheckCircle size={14} />
                      <span>Lifetime access</span>
                    </div>
                    <div className="info-item">
                      <Download size={14} />
                      <span>Certificate included</span>
                    </div>
                    <div className="info-item">
                      <Clock size={14} />
                      <span>Self-paced learning</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Course Features Card */}
            <div className="features-card">
              <h3>This Course Includes</h3>
              <ul className="features-list">
                <li>
                  <PlayCircle size={16} />
                  <span>{course.duration * 4} hours on-demand video</span>
                </li>
                <li>
                  <Download size={16} />
                  <span>Downloadable resources</span>
                </li>
                <li>
                  <FileText size={16} />
                  <span>Certificate of completion</span>
                </li>
                <li>
                  <Clock size={16} />
                  <span>Full lifetime access</span>
                </li>
                <li>
                  <Users size={16} />
                  <span>Access on mobile and TV</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment now handled on separate Enrollment page */}
    </div>
  )
}

export default CourseDetail