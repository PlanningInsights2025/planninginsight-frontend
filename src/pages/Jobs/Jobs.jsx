import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { useApi } from '../../hooks/useApi'
import { jobsAPI } from '../../services/api/jobs'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Building, 
  DollarSign,
  Users,
  Bookmark,
  Share2,
  Eye
} from 'lucide-react'
import Loader from '../../components/common/Loader/Loader'
import './jobportal.css'

/**
 * Job Portal Main Page
 * Displays job listings with search, filter, and sorting capabilities
 * Handles both logged-in and non-logged-in user views
 */
const Jobs = () => {
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experience: '',
    salaryRange: '',
    company: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  // API hooks
  const [fetchJobsApi, fetchLoading] = useApi(jobsAPI.getJobs)

  /**
   * Fetch jobs on component mount
   */
  useEffect(() => {
    loadJobs()
  }, [])

  /**
   * Filter jobs when search term, filters, or sort change
   */
  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, searchTerm, filters, sortBy])

  /**
   * Load jobs from API
   */
  const loadJobs = async () => {
    try {
      const jobsData = await fetchJobsApi(null, {
        showError: true,
        errorMessage: 'Failed to load jobs'
      })
      
      if (jobsData && Array.isArray(jobsData) && jobsData.length > 0) {
        setJobs(jobsData)
      } else {
        // use demo data when API returns nothing
        setJobs(DEMO_JOBS)
      }
    } catch (error) {
      // Error handled by useApi hook
      setJobs(DEMO_JOBS)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filter and sort jobs based on current criteria
   */
  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Apply job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType)
    }

    // Apply experience filter
    if (filters.experience) {
      filtered = filtered.filter(job => {
        const jobExp = parseInt(job.experienceRequired)
        const filterExp = parseInt(filters.experience)
        return jobExp <= filterExp
      })
    }

    // Apply salary range filter
    if (filters.salaryRange) {
      filtered = filtered.filter(job => {
        const [min, max] = filters.salaryRange.split('-').map(Number)
        return job.salaryRange >= min && job.salaryRange <= max
      })
    }

    // Apply company filter
    if (filters.company) {
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'deadline':
          return new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
        case 'salary-high':
          return b.salaryRange - a.salaryRange
        case 'salary-low':
          return a.salaryRange - b.salaryRange
        case 'company':
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
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
      location: '',
      jobType: '',
      experience: '',
      salaryRange: '',
      company: ''
    })
    setSearchTerm('')
  }

  /**
   * Get unique values for filter options
   */
  const getFilterOptions = () => {
    const locations = [...new Set(jobs.map(job => job.location))].sort()
    const companies = [...new Set(jobs.map(job => job.company))].sort()
    const jobTypes = [...new Set(jobs.map(job => job.jobType))].sort()

    return {
      locations,
      companies,
      jobTypes,
      experienceLevels: ['0-2', '2-5', '5-10', '10+'],
      salaryRanges: [
        '0-500000',
        '500000-1000000', 
        '1000000-2000000',
        '2000000-5000000',
        '5000000+'
      ]
    }
  }

  /**
   * Format salary for display
   */
  const formatSalary = (salary) => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`
    }
    return `₹${(salary / 1000).toFixed(0)}K`
  }

  /**
   * Check if job application deadline is approaching
   */
  const isDeadlineApproaching = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }

  /**
   * Check if job application deadline has passed
   */
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date()
  }

  /**
   * Render job card component
   */
  const renderJobCard = (job) => {
    const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
    return (
      <article key={job.id} className={`jp-card ${job.featured ? 'featured' : ''}`}>
        <div className="jp-card-inner horizontal">
          <div className="jp-card-main">
            <header className="jp-card-header">
              <div className="jp-title-block">
                <h3 className="jp-title">{job.title}</h3>
                <div className="jp-sub">{job.company} <span className="dot">•</span> {job.location}</div>
              </div>
            </header>

            <div className="jp-tags">
              {job.jobType && <span className="tag">{job.jobType}</span>}
              {job.experienceRequired && <span className="tag">{job.experienceRequired} yrs</span>}
              {job.salaryRange && <span className="tag">{formatSalary(job.salaryRange)}/yr</span>}
            </div>

            <div className="jp-body">
              <p className="jp-desc">{job.description ? job.description.substring(0, 200) + '...' : ''}</p>
              {!isAuthenticated && (
                <div className="jp-login-bar">Login required to view full details and apply</div>
              )}
            </div>

            <div className="jp-card-bottom left-meta">
              <div className="jp-deadline"><Clock size={14} /> Apply by {new Date(job.applicationDeadline).toLocaleDateString()} <span className={`jp-days ${daysUntilDeadline < 3 ? 'urgent' : daysUntilDeadline < 7 ? 'soon' : 'normal'}`}>{daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Last day'}</span></div>
            </div>
          </div>

          <div className="jp-card-side">
            <div className="jp-badges side-badges">
              {job.jobType && <span className="jp-chip">{job.jobType}</span>}
              {job.experienceRequired && <span className="jp-chip light">{job.experienceRequired} yrs</span>}
              {job.salaryRange && <span className="jp-chip light">{formatSalary(job.salaryRange)}/yr</span>}
            </div>

            <div className="jp-applicants"><Users size={14} /> {job.applicants || 0} applicants</div>

            <div className="jp-side-actions">
              <button className="btn outline" onClick={() => showNotification('Please view details', 'info')}>View Details</button>
              <button className="btn primary" onClick={() => showNotification(isAuthenticated ? 'Applied' : 'Please sign in to apply', 'info')}>{isAuthenticated ? 'Apply Now' : 'Sign In to Apply'}</button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  /**
   * Render search and filter section
   */
  const renderSearchAndFilters = () => {
    const filterOptions = getFilterOptions()

    return (
      <div className="jobs-header">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
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
            <option value="newest">Newest First</option>
            <option value="deadline">Application Deadline</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
            <option value="company">Company Name</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filter Jobs</h3>
              <button 
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>

            <div className="filters-grid">
              {/* Location Filter */}
              <div className="filter-group">
                <label>Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  {filterOptions.locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div className="filter-group">
                <label>Job Type</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {filterOptions.jobTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="filter-group">
                <label>Experience</label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                  <option value="">Any Experience</option>
                  {filterOptions.experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {level} years
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range Filter */}
              <div className="filter-group">
                <label>Salary Range</label>
                <select
                  value={filters.salaryRange}
                  onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                >
                  <option value="">Any Salary</option>
                  {filterOptions.salaryRanges.map(range => (
                    <option key={range} value={range}>
                      {range.replace('-', ' - ').replace('+', '+')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              <div className="filter-group">
                <label>Company</label>
                <select
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                >
                  <option value="">All Companies</option>
                  {filterOptions.companies.map(company => (
                    <option key={company} value={company}>
                      {company}
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
   * Render jobs grid
   */
  const renderJobsGrid = () => {
    if (loading) {
      return (
        <div className="jobs-loading">
          <Loader size="lg" text="Loading jobs..." />
        </div>
      )
    }

    if (filteredJobs.length === 0) {
      return (
        <div className="no-jobs-found">
          <div className="no-jobs-icon">
            <Search size={48} />
          </div>
          <h3>No jobs found</h3>
          <p>
            {searchTerm || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters to find more jobs.'
              : 'There are currently no job openings matching your criteria.'
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
      <div className="jobs-grid">
        {filteredJobs.map(renderJobCard)}
      </div>
    )
  }

  /**
   * Render stats section
   */
  const renderStats = () => (
    <div className="jobs-stats">
      <div className="stat-item">
        <span className="stat-number">{jobs.length}</span>
        <span className="stat-label">Total Jobs</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">
          {jobs.filter(job => !isDeadlinePassed(job.applicationDeadline)).length}
        </span>
        <span className="stat-label">Active Jobs</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">
          {[...new Set(jobs.map(job => job.company))].length}
        </span>
        <span className="stat-label">Companies</span>
      </div>
    </div>
  )

  return (
    <div className="jobs-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Job Portal</h1>
          <p>Find your next career opportunity in the built environment sector</p>
        </div>

        {/* Stats */}
        {!loading && jobs.length > 0 && renderStats()}

        {/* Search and Filters */}
        {renderSearchAndFilters()}

        {/* Jobs Grid */}
        {renderJobsGrid()}

        {/* Login Prompt for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="login-promotion">
            <div className="promotion-content">
              <h3>Unlock Full Job Details</h3>
              <p>
                Sign in to view complete job descriptions, see your compatibility score, 
                and apply for positions directly.
              </p>
              <div className="promotion-actions">
                <button className="btn btn-primary">
                  Sign In
                </button>
                <button className="btn btn-outline">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs

// Demo jobs fallback for design / testing
const DEMO_JOBS = [
  {
    id: 'd1', title: 'Senior Urban Planner', company: 'CityScape Architects', location: 'New York, USA',
    jobType: 'Full-time', experienceRequired: '5', salaryRange: 90000, description: 'We are seeking an experienced Urban Planner to lead sustainable city development projects. Experience in TOD and stakeholder engagement required.', applicationDeadline: '2026-12-15', applicants: 383, featured: true, isPremium: true
  },
  {
    id: 'd2', title: 'Landscape Architect', company: 'GreenSpace Design', location: 'Barcelona, Spain',
    jobType: 'Full-time', experienceRequired: '3', salaryRange: 60000, description: "Join our team to create sustainable public spaces. Proficiency in AutoCAD and SketchUp preferred.", applicationDeadline: '2026-12-20', applicants: 28, featured: false, isPremium: false
  },
  // generate multiple demo entries to showcase layout
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `demo-${i+3}`,
    title: ['Project Manager','Environmental Consultant','Urban Designer','Site Engineer','Sustainability Consultant'][i % 5] + ` ${i+1}`,
    company: ['BuildRight','EcoSolutions','CityScape','GreenBuild','UrbanWorks'][i % 5],
    location: ['Singapore','Vancouver, Canada','New York, USA','Barcelona, Spain','London, UK'][i % 5],
    jobType: ['Full-time','Contract','Part-time'][i % 3],
    experienceRequired: `${2 + (i % 6)}`,
    salaryRange: 50000 + (i * 5000),
    description: 'Sample description for demo job. This is a truncated preview of the real job description used to test card layout and spacing.',
    applicationDeadline: '2026-12-31',
    applicants: Math.floor(10 + Math.random()*120),
    featured: i % 4 === 0,
    isPremium: i % 6 === 0
  }))
]