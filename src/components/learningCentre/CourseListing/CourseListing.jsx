import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { learningAPI } from '../../../services/api/learning'
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  BookOpen,
  PlayCircle,
  MapPin,
  Calendar,
  Bookmark,
  Share2,
  Eye
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'

/**
 * Course Listing Component
 * Displays courses with search, filter, and sorting capabilities
 */
const CourseListing = () => {
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  // State management
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    price: '',
    format: '',
    instructor: ''
  })
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  // API hooks
  const [fetchCoursesApi] = useApi(learningAPI.getCourses)

  /**
   * Fetch courses on component mount
   */
  useEffect(() => {
    loadCourses()
  }, [])

  /**
   * Filter courses when criteria change
   */
  useEffect(() => {
    filterAndSortCourses()
  }, [courses, searchTerm, filters, sortBy])

  /**
   * Load courses from API
   */
  const loadCourses = async () => {
    try {
      const coursesData = await fetchCoursesApi(null, {
        showError: true,
        errorMessage: 'Failed to load courses'
      })

      if (coursesData) {
        setCourses(coursesData)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filter and sort courses based on current criteria
   */
  const filterAndSortCourses = () => {
    let filtered = [...courses]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category)
    }

    // Apply level filter
    if (filters.level) {
      filtered = filtered.filter(course => course.level === filters.level)
    }

    // Apply duration filter
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number)
      filtered = filtered.filter(course => {
        const courseDuration = parseInt(course.duration)
        return courseDuration >= min && courseDuration <= max
      })
    }

    // Apply price filter
    if (filters.price) {
      switch (filters.price) {
        case 'free':
          filtered = filtered.filter(course => course.fees === 0)
          break
        case 'paid':
          filtered = filtered.filter(course => course.fees > 0)
          break
        case 'discount':
          filtered = filtered.filter(course => course.discountPrice)
          break
      }
    }

    // Apply format filter
    if (filters.format) {
      filtered = filtered.filter(course => course.format === filters.format)
    }

    // Apply instructor filter
    if (filters.instructor) {
      filtered = filtered.filter(course => 
        course.instructor.name.toLowerCase().includes(filters.instructor.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.enrollments || 0) - (a.enrollments || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'price-low':
          return (a.fees || 0) - (b.fees || 0)
        case 'price-high':
          return (b.fees || 0) - (a.fees || 0)
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }

  /**
   * Handle search input change
   */
  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      duration: '',
      price: '',
      format: '',
      instructor: ''
    })
    setSearchTerm('')
  }

  /**
   * Get unique values for filter options
   */
  const getFilterOptions = () => {
    const categories = [...new Set(courses.map(course => course.category))].sort()
    const levels = [...new Set(courses.map(course => course.level))].sort()
    const formats = [...new Set(courses.map(course => course.format))].sort()
    const instructors = [...new Set(courses.map(course => course.instructor.name))].sort()

    return {
      categories,
      levels,
      formats,
      instructors,
      durations: [
        '0-4',
        '4-8',
        '8-12',
        '12-20',
        '20+'
      ],
      prices: [
        'free',
        'paid',
        'discount'
      ]
    }
  }

  /**
   * Format course duration for display
   */
  const formatDuration = (duration) => {
    if (duration < 1) return '< 1 week'
    if (duration === 1) return '1 week'
    return `${duration} weeks`
  }

  /**
   * Format course price for display
   */
  const formatPrice = (course) => {
    if (course.fees === 0) return 'Free'
    
    if (course.discountPrice) {
      return (
        <div className="price-with-discount">
          <span className="original-price">₹{course.fees.toLocaleString()}</span>
          <span className="discount-price">₹{course.discountPrice.toLocaleString()}</span>
        </div>
      )
    }
    
    return `₹${course.fees.toLocaleString()}`
  }

  /**
   * Render course card
   */
  const renderCourseCard = (course) => (
    <div key={course.id} className="course-card">
      {/* Course Image */}
      <div className="course-image">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="image-placeholder">
            <BookOpen size={32} />
          </div>
        )}
        
        {/* Course Format Badge */}
        <div className={`format-badge format-${course.format}`}>
          {course.format === 'live' && <PlayCircle size={16} />}
          {course.format === 'recorded' && <BookOpen size={16} />}
          {course.format === 'offline' && <MapPin size={16} />}
          <span>
            {course.format === 'live' && 'Live Online'}
            {course.format === 'recorded' && 'Self-Paced'}
            {course.format === 'offline' && 'In-Person'}
          </span>
        </div>

        {/* Save Button */}
        <button className="save-button" title="Save course">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Course Content */}
      <div className="course-content">
        {/* Course Header */}
        <div className="course-header">
          <h3 className="course-title">{course.title}</h3>
          <div className="course-actions">
            <button className="icon-button" title="Share course">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Instructor */}
        <div className="instructor">
          By <span className="instructor-name">{course.instructor.name}</span>
          {course.instructor.verified && (
            <span className="verified-badge">Verified</span>
          )}
        </div>

        {/* Course Meta */}
        <div className="course-meta">
          <div className="meta-item">
            <Clock size={16} />
            <span>{formatDuration(course.duration)}</span>
          </div>
          
          <div className="meta-item">
            <Users size={16} />
            <span>{(course.enrollments || 0).toLocaleString()} enrolled</span>
          </div>
          
          <div className="meta-item">
            <Star size={16} />
            <span>{course.rating || '4.5'}</span>
          </div>
        </div>

        {/* Course Description */}
        <div className="course-description">
          {isAuthenticated ? (
            <p>{course.description.substring(0, 120)}...</p>
          ) : (
            <div className="blurred-content">
              <p>{course.description.substring(0, 120)}...</p>
              <div className="blur-overlay">
                <div className="login-prompt">
                  <Eye size={24} />
                  <p>Sign in to view full course details</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="course-tags">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="tag-more">+{course.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Course Footer */}
        <div className="course-footer">
          <div className="course-price">
            {formatPrice(course)}
          </div>
          
          <div className="course-actions">
            {isAuthenticated ? (
              course.isEnrolled ? (
                <Link 
                  to={`/learning/courses/${course.id}`}
                  className="btn btn-primary btn-small"
                >
                  Continue Learning
                </Link>
              ) : (
                <Link 
                  to={`/learning/courses/${course.id}`}
                  className="btn btn-primary btn-small"
                >
                  Enroll Now
                </Link>
              )
            ) : (
              <Link 
                to="/login" 
                state={{ from: `/learning/courses/${course.id}` }}
                className="btn btn-outline btn-small"
              >
                Sign In to Enroll
              </Link>
            )}
            
            <Link 
              to={`/learning/courses/${course.id}`}
              className="btn btn-outline btn-small"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Upcoming Session (for live courses) */}
        {course.format === 'live' && course.nextSession && (
          <div className="upcoming-session">
            <Calendar size={14} />
            <span>Next session: {new Date(course.nextSession).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Render search and filter section
   */
  const renderSearchAndFilters = () => {
    const filterOptions = getFilterOptions()

    return (
      <div className="courses-header">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses by title, instructor, or topic..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="filter-count">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Shortest Duration</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filter Courses</h3>
              <button 
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>

            <div className="filters-grid">
              {/* Category Filter */}
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="filter-group">
                <label>Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                >
                  <option value="">All Levels</option>
                  {filterOptions.levels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Filter */}
              <div className="filter-group">
                <label>Duration (weeks)</label>
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                >
                  <option value="">Any Duration</option>
                  {filterOptions.durations.map(duration => (
                    <option key={duration} value={duration}>
                      {duration.replace('-', ' - ')} weeks
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <label>Price</label>
                <select
                  value={filters.price}
                  onChange={(e) => handleFilterChange('price', e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="discount">With Discount</option>
                </select>
              </div>

              {/* Format Filter */}
              <div className="filter-group">
                <label>Format</label>
                <select
                  value={filters.format}
                  onChange={(e) => handleFilterChange('format', e.target.value)}
                >
                  <option value="">All Formats</option>
                  {filterOptions.formats.map(format => (
                    <option key={format} value={format}>
                      {format === 'live' && 'Live Online'}
                      {format === 'recorded' && 'Self-Paced'}
                      {format === 'offline' && 'In-Person'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render courses grid
   */
  const renderCoursesGrid = () => {
    if (loading) {
      return (
        <div className="courses-loading">
          <Loader size="lg" text="Loading courses..." />
        </div>
      )
    }

    if (filteredCourses.length === 0) {
      return (
        <div className="no-courses-found">
          <div className="no-courses-icon">
            <BookOpen size={48} />
          </div>
          <h3>No courses found</h3>
          <p>
            {searchTerm || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters to find more courses.'
              : 'There are currently no courses available.'
            }
          </p>
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <button 
              className="btn btn-outline"
              onClick={clearFilters}
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="courses-grid">
        {filteredCourses.map(renderCourseCard)}
      </div>
    )
  }

  return (
    <div className="course-listing-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Learning Centre</h1>
          <p>Advance your career with our curated courses and certifications</p>
        </div>

        {/* Search and Filters */}
        {renderSearchAndFilters()}

        {/* Courses Grid */}
        {renderCoursesGrid()}

        {/* Login Promotion for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="login-promotion">
            <div className="promotion-content">
              <h3>Unlock Full Learning Experience</h3>
              <p>
                Sign in to enroll in courses, track your progress, earn certificates, 
                and access exclusive learning resources.
              </p>
              <div className="promotion-actions">
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-outline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseListing