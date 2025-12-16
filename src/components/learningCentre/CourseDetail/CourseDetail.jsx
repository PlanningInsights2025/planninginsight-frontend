import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { learningAPI } from '../../../services/api/learning';
import {
  Play,
  Clock,
  Users,
  Star,
  Bookmark,
  Share2,
  CheckCircle,
  FileText,
  Download,
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import Modal from '../../common/Modal/Modal';

/**
 * Course Detail Component
 * Displays comprehensive course information, enrollment options, and curriculum
 */
const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showGroupBookingModal, setShowGroupBookingModal] = useState(false);
  const [groupBookingData, setGroupBookingData] = useState({
    participants: 1,
    participantsList: []
  });

  // API hooks
  const [fetchCourseApi] = useApi(learningAPI.getCourse);
  const [enrollCourseApi] = useApi(learningAPI.enrollCourse);
  const [checkEnrollmentApi] = useApi(learningAPI.checkEnrollment);

  /**
   * Load course data and check enrollment status
   */
  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await fetchCourseApi(courseId);

      if (courseData) {
        setCourse(courseData);
        setInstructor(courseData.instructor);

        // Check if user is enrolled
        if (isAuthenticated) {
          const enrollmentData = await checkEnrollmentApi(courseId);
          setEnrollment(enrollmentData);
        }
      }
    } catch (error) {
      showNotification('Failed to load course details', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle course enrollment
   */
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to enroll in courses', 'error');
      navigate('/login', { state: { from: `/learning/courses/${courseId}` } });
      return;
    }

    try {
      const enrollmentData = await enrollCourseApi(courseId);

      if (enrollmentData) {
        setEnrollment(enrollmentData);
        setShowEnrollmentModal(false);
        showNotification('Successfully enrolled in the course!', 'success');
        
        // Redirect to course player
        navigate(`/learning/my-courses/${courseId}`);
      }
    } catch (error) {
      // Error handled by useApi hook
    }
  };

  /**
   * Handle group booking
   */
  const handleGroupBooking = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in for group bookings', 'error');
      return;
    }

    try {
      // Process group booking
      showNotification('Group booking request submitted successfully', 'success');
      setShowGroupBookingModal(false);
    } catch (error) {
      showNotification('Failed to process group booking', 'error');
    }
  };

  /**
   * Add participant to group booking
   */
  const addParticipant = () => {
    if (groupBookingData.participantsList.length >= 10) {
      showNotification('Maximum 10 participants allowed for group booking', 'error');
      return;
    }

    setGroupBookingData(prev => ({
      ...prev,
      participantsList: [
        ...prev.participantsList,
        { name: '', email: '', phone: '' }
      ]
    }));
  };

  /**
   * Update participant data
   */
  const updateParticipant = (index, field, value) => {
    setGroupBookingData(prev => ({
      ...prev,
      participantsList: prev.participantsList.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      )
    }));
  };

  /**
   * Calculate course progress
   */
  const calculateProgress = () => {
    if (!enrollment || !course) return 0;
    
    const totalContent = course.curriculum.reduce((total, chapter) => 
      total + chapter.lessons.length, 0
    );
    const completedContent = enrollment.completedLessons?.length || 0;
    
    return totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
  };

  /**
   * Format course duration
   */
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  /**
   * Render curriculum section
   */
  const renderCurriculum = () => (
    <div className="curriculum-section">
      <h3>Course Curriculum</h3>
      <div className="chapters-list">
        {course.curriculum.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="chapter">
            <div className="chapter-header">
              <h4>{chapter.title}</h4>
              <span className="chapter-duration">
                {formatDuration(chapter.duration)}
              </span>
            </div>
            <div className="lessons-list">
              {chapter.lessons.map((lesson, lessonIndex) => {
                const isCompleted = enrollment?.completedLessons?.includes(lesson.id);
                const canAccess = enrollment || lesson.isPreview;
                
                return (
                  <div 
                    key={lesson.id} 
                    className={`lesson ${isCompleted ? 'completed' : ''} ${!canAccess ? 'locked' : ''}`}
                  >
                    <div className="lesson-info">
                      <div className="lesson-icon">
                        {isCompleted ? (
                          <CheckCircle size={16} className="completed" />
                        ) : lesson.isPreview ? (
                          <Play size={16} />
                        ) : (
                          <Play size={16} className="locked" />
                        )}
                      </div>
                      <div className="lesson-details">
                        <h5>{lesson.title}</h5>
                        <span className="lesson-duration">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    </div>
                    {lesson.isPreview && !enrollment && (
                      <span className="preview-badge">Preview</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Render instructor section
   */
  const renderInstructor = () => (
    <div className="instructor-section">
      <h3>About the Instructor</h3>
      <div className="instructor-card">
        <div className="instructor-header">
          <div className="instructor-avatar">
            {instructor.profilePicture ? (
              <img src={instructor.profilePicture} alt={instructor.name} />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className="instructor-info">
            <h4>{instructor.name}</h4>
            <p className="instructor-title">{instructor.title}</p>
            <div className="instructor-stats">
              <div className="stat">
                <Star size={16} />
                <span>{instructor.rating} Rating</span>
              </div>
              <div className="stat">
                <Users size={16} />
                <span>{instructor.totalStudents} Students</span>
              </div>
              <div className="stat">
                <Play size={16} />
                <span>{instructor.totalCourses} Courses</span>
              </div>
            </div>
          </div>
        </div>
        <div className="instructor-bio">
          <p>{instructor.bio}</p>
        </div>
        <div className="instructor-expertise">
          <h5>Areas of Expertise</h5>
          <div className="expertise-tags">
            {instructor.expertise.map((skill, index) => (
              <span key={index} className="expertise-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render reviews section
   */
  const renderReviews = () => (
    <div className="reviews-section">
      <h3>Student Reviews</h3>
      <div className="reviews-summary">
        <div className="overall-rating">
          <div className="rating-score">
            <span className="score">{course.rating}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(course.rating) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span className="rating-count">({course.totalReviews} reviews)</span>
          </div>
        </div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="rating-bar">
              <span className="rating-star">{rating} ★</span>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${(course.ratingDistribution[rating] / course.totalReviews) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="rating-count">{course.ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="reviews-list">
        {course.reviews.slice(0, 5).map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer">
                <div className="reviewer-avatar">
                  {review.user.profilePicture ? (
                    <img src={review.user.profilePicture} alt={review.user.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="reviewer-info">
                  <h5>{review.user.name}</h5>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.rating ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
            </div>
            <div className="review-content">
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="course-detail-loading">
        <Loader size="lg" text="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <div className="not-found-content">
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist or is no longer available.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/learning')}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="container">
        {/* Back Navigation */}
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="course-header">
          <div className="course-hero">
            <div className="course-image">
              <img src={course.thumbnail} alt={course.title} />
              <div className="image-overlay">
                <button className="play-button">
                  <Play size={32} />
                </button>
              </div>
            </div>
            
            <div className="course-info">
              <div className="course-meta">
                <span className="category-badge">{course.category}</span>
                <span className="level-badge">{course.level}</span>
                {course.isCertified && (
                  <span className="certified-badge">
                    <CheckCircle size={16} />
                    Certificate
                  </span>
                )}
              </div>

              <h1 className="course-title">{course.title}</h1>
              <p className="course-description">{course.description}</p>

              <div className="course-stats">
                <div className="stat">
                  <Star size={20} />
                  <span>{course.rating} ({course.totalReviews} reviews)</span>
                </div>
                <div className="stat">
                  <Users size={20} />
                  <span>{course.totalEnrollments} students</span>
                </div>
                <div className="stat">
                  <Clock size={20} />
                  <span>{formatDuration(course.totalDuration)} total</span>
                </div>
                <div className="stat">
                  {course.mode === 'online' ? (
                    <Play size={20} />
                  ) : (
                    <MapPin size={20} />
                  )}
                  <span>
                    {course.mode === 'online' ? 'Online' : course.location}
                  </span>
                </div>
              </div>

              <div className="instructor-preview">
                <div className="instructor-avatar small">
                  {instructor.profilePicture ? (
                    <img src={instructor.profilePicture} alt={instructor.name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span>Created by <strong>{instructor.name}</strong></span>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="enrollment-card">
              <div className="pricing">
                <div className="current-price">₹{course.currentPrice}</div>
                {course.originalPrice > course.currentPrice && (
                  <div className="original-price">₹{course.originalPrice}</div>
                )}
                {course.discount > 0 && (
                  <div className="discount-badge">{course.discount}% OFF</div>
                )}
              </div>

              <div className="enrollment-features">
                <div className="feature">
                  <CheckCircle size={16} />
                  <span>Lifetime access</span>
                </div>
                <div className="feature">
                  <CheckCircle size={16} />
                  <span>Certificate of completion</span>
                </div>
                <div className="feature">
                  <CheckCircle size={16} />
                  <span>Q&A support</span>
                </div>
                <div className="feature">
                  <CheckCircle size={16} />
                  <span>Mobile and TV access</span>
                </div>
              </div>

              <div className="enrollment-actions">
                {enrollment ? (
                  <>
                    <button 
                      className="btn btn-primary btn-large"
                      onClick={() => navigate(`/learning/my-courses/${courseId}`)}
                    >
                      Continue Learning
                    </button>
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Your progress</span>
                        <span>{calculateProgress()}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary btn-large"
                      onClick={() => setShowEnrollmentModal(true)}
                    >
                      Enroll Now
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setShowGroupBookingModal(true)}
                    >
                      Group Booking
                    </button>
                    <button className="btn btn-ghost">
                      <Bookmark size={20} />
                      Save for later
                    </button>
                  </>
                )}
              </div>

              <div className="money-back-guarantee">
                <CheckCircle size={16} />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="course-tabs">
          <nav className="tabs-navigation">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'instructor', label: 'Instructor' },
              { id: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="what-youll-learn">
                  <h3>What you'll learn</h3>
                  <div className="learning-points">
                    {course.learningObjectives.map((objective, index) => (
                      <div key={index} className="learning-point">
                        <CheckCircle size={16} />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="course-requirements">
                  <h3>Requirements</h3>
                  <ul>
                    {course.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>

                <div className="course-description-full">
                  <h3>Description</h3>
                  <div className="description-content">
                    {course.fullDescription}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && renderCurriculum()}
            {activeTab === 'instructor' && renderInstructor()}
            {activeTab === 'reviews' && renderReviews()}
          </div>
        </div>

        {/* Related Courses */}
        <div className="related-courses">
          <h2>Related Courses</h2>
          <div className="courses-grid">
            {/* Related courses would be mapped here */}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <Modal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        title="Enroll in Course"
        size="md"
      >
        <div className="enrollment-modal">
          <div className="course-summary">
            <img src={course.thumbnail} alt={course.title} />
            <div className="summary-info">
              <h4>{course.title}</h4>
              <div className="pricing">
                <span className="price">₹{course.currentPrice}</span>
                {course.originalPrice > course.currentPrice && (
                  <span className="original-price">₹{course.originalPrice}</span>
                )}
              </div>
            </div>
          </div>

          <div className="enrollment-options">
            <h5>Payment Options</h5>
            <div className="payment-methods">
              <label className="payment-option">
                <input type="radio" name="payment" defaultChecked />
                <span>Credit/Debit Card</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" />
                <span>UPI</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" />
                <span>Net Banking</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={handleEnroll}
            >
              Proceed to Payment
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowEnrollmentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Group Booking Modal */}
      <Modal
        isOpen={showGroupBookingModal}
        onClose={() => setShowGroupBookingModal(false)}
        title="Group Booking"
        size="lg"
      >
        <div className="group-booking-modal">
          <div className="group-pricing">
            <h4>Group Pricing</h4>
            <div className="pricing-tiers">
              <div className="pricing-tier">
                <span>1-4 participants</span>
                <span>₹{course.currentPrice} each</span>
              </div>
              <div className="pricing-tier highlighted">
                <span>5-9 participants</span>
                <span>₹{Math.round(course.currentPrice * 0.9)} each (10% off)</span>
              </div>
              <div className="pricing-tier">
                <span>10+ participants</span>
                <span>₹{Math.round(course.currentPrice * 0.8)} each (20% off)</span>
              </div>
            </div>
          </div>

          <div className="participants-section">
            <h5>Add Participants</h5>
            <div className="participants-list">
              {groupBookingData.participantsList.map((participant, index) => (
                <div key={index} className="participant-form">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={participant.email}
                    onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={participant.phone}
                    onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <button 
              className="btn btn-outline"
              onClick={addParticipant}
            >
              Add Another Participant
            </button>
          </div>

          <div className="modal-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={handleGroupBooking}
            >
              Request Group Booking
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowGroupBookingModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetail;