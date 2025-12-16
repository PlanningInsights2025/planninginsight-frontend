import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import {
  Search,
  Filter,
  Calendar,
  Users,
  FileText,
  Download,
  Eye,
  BookOpen,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';

/**
 * Journal Listing Component
 * Displays academic journals with filtering, search, and access controls
 */
const JournalListing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    accessType: '',
    category: '',
    publisher: '',
    year: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // API hooks
  const [fetchJournalsApi] = useApi(publishingAPI.getJournals);

  /**
   * Load journals on component mount
   */
  useEffect(() => {
    loadJournals();
  }, []);

  /**
   * Filter journals when search term, filters, or sort change
   */
  useEffect(() => {
    filterAndSortJournals();
  }, [journals, searchTerm, filters, sortBy]);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const journalsData = await fetchJournalsApi();

      if (journalsData) {
        setJournals(journalsData);
      }
    } catch (error) {
      showNotification('Failed to load journals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortJournals = () => {
    let filtered = [...journals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(journal =>
        journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply access type filter
    if (filters.accessType) {
      filtered = filtered.filter(journal => journal.accessType === filters.accessType);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(journal => journal.category === filters.category);
    }

    // Apply publisher filter
    if (filters.publisher) {
      filtered = filtered.filter(journal => journal.publisher === filters.publisher);
    }

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter(journal => journal.publicationYear === parseInt(filters.year));
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(journal => journal.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publicationDate) - new Date(a.publicationDate);
        case 'oldest':
          return new Date(a.publicationDate) - new Date(b.publicationDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'citations':
          return b.citationCount - a.citationCount;
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        default:
          return 0;
      }
    });

    setFilteredJournals(filtered);
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      accessType: '',
      category: '',
      publisher: '',
      year: '',
      status: ''
    });
    setSearchTerm('');
  };

  /**
   * Check if user can access journal
   */
  const canAccessJournal = (journal) => {
    if (!isAuthenticated) return false;

    switch (journal.accessType) {
      case 'open':
        return true;
      case 'paid':
        return user.subscription?.isActive || journal.userHasAccess;
      case 'sso':
        return user.isInstitutional || journal.userHasAccess;
      default:
        return false;
    }
  };

  /**
   * Get access type badge color
   */
  const getAccessTypeBadge = (accessType) => {
    const types = {
      open: { label: 'Open Access', color: 'success' },
      paid: { label: 'Paid Access', color: 'warning' },
      sso: { label: 'Institutional', color: 'primary' }
    };
    return types[accessType] || { label: accessType, color: 'secondary' };
  };

  /**
   * Get unique values for filter options
   */
  const getFilterOptions = () => {
    const accessTypes = [...new Set(journals.map(journal => journal.accessType))];
    const categories = [...new Set(journals.map(journal => journal.category))];
    const publishers = [...new Set(journals.map(journal => journal.publisher))];
    const years = [...new Set(journals.map(journal => journal.publicationYear))].sort((a, b) => b - a);
    
    return {
      accessTypes,
      categories,
      publishers,
      years,
      statuses: ['active', 'upcoming', 'archived']
    };
  };

  /**
   * Format citation count
   */
  const formatCitationCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  /**
   * Render journal card
   */
  const renderJournalCard = (journal) => {
    const accessType = getAccessTypeBadge(journal.accessType);
    const canAccess = canAccessJournal(journal);

    return (
      <div key={journal.id} className="journal-card">
        {/* Journal Header */}
        <div className="journal-header">
          <div className="journal-title-section">
            <h3 className="journal-title">
              <Link to={`/publishing/journals/${journal.id}`}>
                {journal.title}
              </Link>
            </h3>
            <span className={`access-badge ${accessType.color}`}>
              {accessType.label}
            </span>
          </div>
          
          <div className="journal-meta">
            <div className="meta-item">
              <TrendingUp size={16} />
              <span>{formatCitationCount(journal.citationCount)} citations</span>
            </div>
            <div className="meta-item">
              <Download size={16} />
              <span>{journal.downloadCount} downloads</span>
            </div>
          </div>
        </div>

        {/* Journal Info */}
        <div className="journal-info">
          <div className="publisher-info">
            <span className="publisher-name">{journal.publisher}</span>
            {journal.impactFactor && (
              <span className="impact-factor">
                Impact Factor: {journal.impactFactor}
              </span>
            )}
          </div>

          <div className="publication-details">
            <div className="detail-item">
              <Calendar size={16} />
              <span>Published {new Date(journal.publicationDate).getFullYear()}</span>
            </div>
            <div className="detail-item">
              <BookOpen size={16} />
              <span>{journal.articleCount} articles</span>
            </div>
            {journal.issn && (
              <div className="detail-item">
                <FileText size={16} />
                <span>ISSN: {journal.issn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Journal Description */}
        <div className="journal-description">
          <p>{journal.description}</p>
        </div>

        {/* Journal Tags */}
        {journal.tags && journal.tags.length > 0 && (
          <div className="journal-tags">
            {journal.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
            {journal.tags.length > 5 && (
              <span className="tag-more">+{journal.tags.length - 5}</span>
            )}
          </div>
        )}

        {/* Journal Actions */}
        <div className="journal-actions">
          <div className="action-buttons">
            {canAccess ? (
              <>
                <button className="btn btn-primary btn-small">
                  <Download size={16} />
                  Download
                </button>
                <Link 
                  to={`/publishing/journals/${journal.id}`}
                  className="btn btn-outline btn-small"
                >
                  <Eye size={16} />
                  View Details
                </Link>
              </>
            ) : (
              <div className="access-restricted">
                <div className="restricted-message">
                  <Eye size={20} />
                  <div>
                    <p>Sign in to access this journal</p>
                    <small>
                      {journal.accessType === 'paid' && 'Paid subscription required'}
                      {journal.accessType === 'sso' && 'Institutional access required'}
                    </small>
                  </div>
                </div>
                <button 
                  className="btn btn-outline btn-small"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {journal.callForPapers && (
            <div className="call-for-papers">
              <div className="cfp-badge">
                <Clock size={14} />
                <span>Call for Papers</span>
              </div>
              <span className="cfp-deadline">
                Deadline: {new Date(journal.callForPapers.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render search and filter section
   */
  const renderSearchAndFilters = () => {
    const filterOptions = getFilterOptions();

    return (
      <div className="journals-header">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search journals by title, publisher, or keywords..."
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
            <option value="citations">Most Cited</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filter Journals</h3>
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
                      {getAccessTypeBadge(type).label}
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

              {/* Publisher Filter */}
              <div className="filter-group">
                <label>Publisher</label>
                <select
                  value={filters.publisher}
                  onChange={(e) => handleFilterChange('publisher', e.target.value)}
                >
                  <option value="">All Publishers</option>
                  {filterOptions.publishers.map(publisher => (
                    <option key={publisher} value={publisher}>
                      {publisher}
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
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render journals grid
   */
  const renderJournalsGrid = () => {
    if (loading) {
      return (
        <div className="journals-loading">
          <Loader size="lg" text="Loading journals..." />
        </div>
      );
    }

    if (filteredJournals.length === 0) {
      return (
        <div className="no-journals-found">
          <div className="no-journals-icon">
            <FileText size={48} />
          </div>
          <h3>No journals found</h3>
          <p>
            {searchTerm || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters to find more journals.'
              : 'There are currently no journals available.'
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
      );
    }

    return (
      <div className="journals-grid">
        {filteredJournals.map(renderJournalCard)}
      </div>
    );
  };

  /**
   * Render stats section
   */
  const renderStats = () => {
    const openAccessCount = journals.filter(j => j.accessType === 'open').length;
    const totalCitations = journals.reduce((sum, journal) => sum + journal.citationCount, 0);
    const totalDownloads = journals.reduce((sum, journal) => sum + journal.downloadCount, 0);

    return (
      <div className="journals-stats">
        <div className="stat-item">
          <span className="stat-number">{journals.length}</span>
          <span className="stat-label">Total Journals</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{openAccessCount}</span>
          <span className="stat-label">Open Access</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{formatCitationCount(totalCitations)}</span>
          <span className="stat-label">Total Citations</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{formatCitationCount(totalDownloads)}</span>
          <span className="stat-label">Total Downloads</span>
        </div>
      </div>
    );
  };

  return (
    <div className="journal-listing-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Academic Journals</h1>
          <p>Discover and access research publications in the built environment domain</p>
        </div>

        {/* Stats */}
        {!loading && journals.length > 0 && renderStats()}

        {/* Search and Filters */}
        {renderSearchAndFilters()}

        {/* Journals Grid */}
        {renderJournalsGrid()}

        {/* Call to Action */}
        {isAuthenticated && (
          <div className="cta-section">
            <div className="cta-content">
              <h3>Ready to Publish Your Research?</h3>
              <p>Submit your manuscript to our peer-reviewed journals and contribute to the academic community.</p>
              <div className="cta-actions">
                <Link to="/publishing/submit" className="btn btn-primary">
                  Submit Manuscript
                </Link>
                <Link to="/publishing/guidelines" className="btn btn-outline">
                  View Guidelines
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalListing;