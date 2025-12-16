import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { useApi } from '../../hooks/useApi'
import { publishingAPI } from '../../services/api/publishing'
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  Users,
  Eye,
  Download,
  Lock,
  Globe,
  BookOpen
} from 'lucide-react'
import Loader from '../../components/common/Loader/Loader'

/**
 * Publishing House Main Page
 * Displays academic journals and publications with search, filter, and access controls
 * Handles manuscript submission workflow and publication access
 */
const Publishing = () => {
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [publications, setPublications] = useState([])
  const [filteredPublications, setFilteredPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    accessType: '',
    category: '',
    year: '',
    status: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  // API hooks
  const [fetchPublicationsApi] = useApi(publishingAPI.getPublications)

  /**
   * Fetch publications on component mount
   */
  useEffect(() => {
    loadPublications()
  }, [])

  /**
   * Filter publications when search term, filters, or sort change
   */
  useEffect(() => {
    filterAndSortPublications()
  }, [publications, searchTerm, filters, sortBy])

  /**
   * Load publications from API
   */
  const loadPublications = async () => {
    try {
      const publicationsData = await fetchPublicationsApi(null, {
        showError: true,
        errorMessage: 'Failed to load publications'
      })
      
      if (publicationsData) {
        setPublications(publicationsData)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filter and sort publications based on current criteria
   */
  const filterAndSortPublications = () => {
    let filtered = [...publications]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.keywords?.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply access type filter
    if (filters.accessType) {
      filtered = filtered.filter(pub => pub.accessType === filters.accessType)
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(pub => pub.category === filters.category)
    }

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter(pub => pub.year === parseInt(filters.year))
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(pub => pub.status === filters.status)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publicationDate) - new Date(a.publicationDate)
        case 'oldest':
          return new Date(a.publicationDate) - new Date(b.publicationDate)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'publisher':
          return a.publisher.localeCompare(b.publisher)
        case 'downloads':
          return b.downloads - a.downloads
        default:
          return 0
      }
    })

    setFilteredPublications(filtered)
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
      accessType: '',
      category: '',
      year: '',
      status: ''
    })
    setSearchTerm('')
  }

  /**
   * Get unique values for filter options
   */
  const getFilterOptions = () => {
    const accessTypes = [...new Set(publications.map(pub => pub.accessType))].sort()
    const categories = [...new Set(publications.map(pub => pub.category))].sort()
    const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a)
    const statuses = [...new Set(publications.map(pub => pub.status))].sort()

    return {
      accessTypes,
      categories,
      years,
      statuses
    }
  }

  /**
   * Check if user can access publication
   */
  const canAccessPublication = (publication) => {
    if (!isAuthenticated) return false
    
    switch (publication.accessType) {
      case 'open':
        return true
      case 'paid':
        return user.subscription?.includes('premium') || publication.purchased
      case 'sso':
        return user.email?.includes('.edu') || user.email?.includes('.ac.')
      default:
        return false
    }
  }

  /**
   * Handle publication download
   */
  const handleDownload = async (publication) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to download publications', 'info')
      return
    }

    if (!canAccessPublication(publication)) {
      showNotification('You do not have access to this publication', 'error')
      return
    }

    try {
      // Simulate download
      showNotification('Preparing download...', 'info')
      // In real implementation, this would call the download API
    } catch (error) {
      showNotification('Download failed', 'error')
    }
  }

  /**
   * Handle publication view
   */
  const handleView = (publication) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to view publications', 'info')
      return
    }

    if (!canAccessPublication(publication)) {
      showNotification('You do not have access to this publication', 'error')
      return
    }

    // Navigate to publication view page
    showNotification('Opening publication...', 'info')
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  /**
   * Get access type badge
   */
  const getAccessBadge = (accessType) => {
    const badges = {
      open: { label: 'Open Access', color: '#059669', bgColor: '#d1fae5' },
      paid: { label: 'Paid Access', color: '#dc2626', bgColor: '#fee2e2' },
      sso: { label: 'Institutional', color: '#7c3aed', bgColor: '#ede9fe' }
    }
    
    return badges[accessType] || { label: 'Restricted', color: '#6b7280', bgColor: '#f3f4f6' }
  }

  /**
   * Render publication card component
   */
  const renderPublicationCard = (publication) => {
    const accessBadge = getAccessBadge(publication.accessType)
    const canAccess = canAccessPublication(publication)

    return (
      <div key={publication.id} className="publication-card">
        {/* Publication Header */}
        <div className="publication-header">
          <div className="publication-title-section">
            <h3 className="publication-title">{publication.title}</h3>
            <span 
              className="access-badge"
              style={{ 
                backgroundColor: accessBadge.bgColor,
                color: accessBadge.color
              }}
            >
              {accessBadge.label}
            </span>
          </div>
          
          <div className="publication-meta">
            <div className="meta-item">
              <Calendar size={14} />
              <span>{formatDate(publication.publicationDate)}</span>
            </div>
            <div className="meta-item">
              <Users size={14} />
              <span>{publication.publisher}</span>
            </div>
            {publication.downloads && (
              <div className="meta-item">
                <Download size={14} />
                <span>{publication.downloads} downloads</span>
              </div>
            )}
          </div>
        </div>

        {/* Publication Description */}
        <div className="publication-description">
          {isAuthenticated && canAccess ? (
            <p>{publication.description}</p>
          ) : (
            <div className="blurred-content">
              <p>{publication.description.substring(0, 150)}...</p>
              <div className="blur-overlay">
                <div className="access-prompt">
                  {!isAuthenticated ? (
                    <>
                      <Lock size={20} />
                      <p>Sign in to view publication details</p>
                    </>
                  ) : (
                    <>
                      <Eye size={20} />
                      <p>Upgrade your account to access this publication</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Publication Keywords */}
        {publication.keywords && publication.keywords.length > 0 && (
          <div className="publication-keywords">
            {publication.keywords.slice(0, 4).map((keyword, index) => (
              <span key={index} className="keyword-tag">
                {keyword}
              </span>
            ))}
            {publication.keywords.length > 4 && (
              <span className="keyword-more">+{publication.keywords.length - 4} more</span>
            )}
          </div>
        )}

        {/* Publication Footer */}
        <div className="publication-footer">
          <div className="publication-info">
            <div className="info-item">
              <span>Volume {publication.volume}</span>
              {publication.issue && <span>Issue {publication.issue}</span>}
              <span>ISSN: {publication.issn}</span>
            </div>
          </div>
          
          <div className="publication-actions">
            {isAuthenticated && canAccess ? (
              <>
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => handleView(publication)}
                >
                  <Eye size={16} />
                  View
                </button>
                <button 
                  className="btn btn-outline btn-small"
                  onClick={() => handleDownload(publication)}
                >
                  <Download size={16} />
                  Download
                </button>
              </>
            ) : (
              <button 
                className="btn btn-outline btn-small"
                onClick={() => showNotification(
                  !isAuthenticated 
                    ? 'Please sign in to access this publication' 
                    : 'You need special access for this publication', 
                  'info'
                )}
              >
                <Lock size={16} />
                {!isAuthenticated ? 'Sign In to Access' : 'Request Access'}
              </button>
            )}
          </div>
        </div>

        {/* Citation Count */}
        {publication.citations > 0 && (
          <div className="citation-badge">
            <span>{publication.citations} citations</span>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render search and filter section
   */
  const renderSearchAndFilters = () => {
    const filterOptions = getFilterOptions()

    return (
      <div className="publishing-header">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search publications by title, publisher, or keywords..."
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
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="publisher">Publisher</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filter Publications</h3>
              <button 
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>

            <div className="filters-grid">
              {/* Access Type Filter */}
              <div className="filter-group">
                <label>Access Type</label>
                <select
                  value={filters.accessType}
                  onChange={(e) => handleFilterChange('accessType', e.target.value)}
                >
                  <option value="">All Access Types</option>
                  {filterOptions.accessTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'open' ? 'Open Access' : 
                       type === 'paid' ? 'Paid Access' : 'Institutional'}
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Year Filter */}
              <div className="filter-group">
                <label>Publication Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <label>Publication Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
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
   * Render publications grid
   */
  const renderPublicationsGrid = () => {
    if (loading) {
      return (
        <div className="publications-loading">
          <Loader size="lg" text="Loading publications..." />
        </div>
      )
    }

    if (filteredPublications.length === 0) {
      return (
        <div className="no-publications-found">
          <div className="no-publications-icon">
            <FileText size={48} />
          </div>
          <h3>No publications found</h3>
          <p>
            {searchTerm || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters to find more publications.'
              : 'There are currently no publications available matching your criteria.'
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
      <div className="publications-grid">
        {filteredPublications.map(renderPublicationCard)}
      </div>
    )
  }

  /**
   * Render stats section
   */
  const renderStats = () => (
    <div className="publishing-stats">
      <div className="stat-item">
        <span className="stat-number">{publications.length}</span>
        <span className="stat-label">Total Publications</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">
          {publications.filter(pub => pub.accessType === 'open').length}
        </span>
        <span className="stat-label">Open Access</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">
          {[...new Set(publications.map(pub => pub.publisher))].length}
        </span>
        <span className="stat-label">Publishers</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">
          {publications.reduce((total, pub) => total + (pub.downloads || 0), 0).toLocaleString()}
        </span>
        <span className="stat-label">Total Downloads</span>
      </div>
    </div>
  )

  /**
   * Render call to action for manuscript submission
   */
  const renderSubmissionCTA = () => (
    <div className="submission-cta">
      <div className="cta-content">
        <div className="cta-icon">
          <BookOpen size={32} />
        </div>
        <div className="cta-text">
          <h3>Ready to Publish Your Research?</h3>
          <p>Submit your manuscript to our peer-reviewed journals and reach a global audience of built environment professionals.</p>
        </div>
        <div className="cta-actions">
          {isAuthenticated ? (
            <button className="btn btn-primary">
              Submit Manuscript
            </button>
          ) : (
            <button className="btn btn-outline">
              Sign In to Submit
            </button>
          )}
          <button className="btn btn-outline">
            View Submission Guidelines
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="publishing-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Publishing House</h1>
          <p>Access academic journals, research papers, and publications in the built environment domain</p>
        </div>

        {/* Stats */}
        {!loading && publications.length > 0 && renderStats()}

        {/* Search and Filters */}
        {renderSearchAndFilters()}

        {/* Publications Grid */}
        {renderPublicationsGrid()}

        {/* Submission CTA */}
        {renderSubmissionCTA()}

        {/* Access Information */}
        <div className="access-info">
          <h3>Publication Access Information</h3>
          <div className="access-types">
            <div className="access-type">
              <Globe size={20} color="#059669" />
              <div>
                <h4>Open Access</h4>
                <p>Freely available to all users</p>
              </div>
            </div>
            <div className="access-type">
              <Lock size={20} color="#dc2626" />
              <div>
                <h4>Paid Access</h4>
                <p>Available with premium subscription or individual purchase</p>
              </div>
            </div>
            <div className="access-type">
              <Users size={20} color="#7c3aed" />
              <div>
                <h4>Institutional Access</h4>
                <p>Available to users with institutional email domains (.edu, .ac.)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publishing