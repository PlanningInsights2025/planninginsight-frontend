import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import { useApi } from '../../hooks/useApi';
import { publishingAPI } from '../../services/api/publishing';
import { 
  Search, Filter, FileText, Calendar, Users, Eye, Download, Lock, 
  Globe, BookOpen, ChevronUp, Sparkles, TrendingUp, Award, CheckCircle, 
  Clock, ArrowRight, Star, Zap, Heart, Share2, Bookmark, X, AlertCircle, 
  Upload, Edit3, Send, Layers 
} from 'lucide-react';
import Loader from '../../components/common/Loader/Loader';
import './Publishing.css';

const PublishingHouse = () => {
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // State management
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    accessType: '',
    category: '',
    year: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // API hooks
  const { execute: fetchPublicationsApi } = useApi(publishingAPI.getPublications);

  // Refs for scroll animations
  const observerRef = useRef(null);

  // Scroll to Top Button Logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadPublications();
  }, []);

  useEffect(() => {
    filterAndSortPublications();
  }, [publications, searchTerm, filters, sortBy]);

  const loadPublications = async () => {
    try {
      const publicationsData = await fetchPublicationsApi(null, {
        showError: true,
        errorMessage: 'Failed to load publications'
      });

      if (publicationsData) {
        setPublications(publicationsData);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPublications = () => {
    let filtered = [...publications];

    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.accessType) {
      filtered = filtered.filter(pub => pub.accessType === filters.accessType);
    }

    if (filters.category) {
      filtered = filtered.filter(pub => pub.category === filters.category);
    }

    if (filters.year) {
      filtered = filtered.filter(pub => pub.year === parseInt(filters.year));
    }

    if (filters.status) {
      filtered = filtered.filter(pub => pub.status === filters.status);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publicationDate) - new Date(a.publicationDate);
        case 'oldest':
          return new Date(a.publicationDate) - new Date(b.publicationDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'publisher':
          return a.publisher.localeCompare(b.publisher);
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredPublications(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      accessType: '',
      category: '',
      year: '',
      status: ''
    });
    setSearchTerm('');
    showNotification('Filters cleared', 'info');
  };

  const getFilterOptions = () => {
    const accessTypes = [...new Set(publications.map(pub => pub.accessType))].sort();
    const categories = [...new Set(publications.map(pub => pub.category))].sort();
    const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
    const statuses = [...new Set(publications.map(pub => pub.status))].sort();

    return { accessTypes, categories, years, statuses };
  };

  const canAccessPublication = (publication) => {
    if (!isAuthenticated) return false;

    switch (publication.accessType) {
      case 'open':
        return true;
      case 'paid':
        return user.subscription?.includes('premium') || publication.purchased;
      case 'sso':
        return user.email?.includes('.edu') || user.email?.includes('.ac.');
      default:
        return false;
    }
  };

  const handleDownload = async (publication, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showNotification('Please sign in to download publications', 'info');
      navigate('/login');
      return;
    }

    if (!canAccessPublication(publication)) {
      showNotification('You do not have access to this publication', 'error');
      return;
    }

    showNotification('Download started!', 'success');
  };

  const handleView = (publication) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to view publications', 'info');
      navigate('/login');
      return;
    }

    navigate(`/publishing/view/${publication.id}`);
  };

  const handleBookmark = (publication, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showNotification('Please sign in to bookmark', 'info');
      return;
    }

    showNotification('Added to bookmarks!', 'success');
  };

  const handleShare = async (publication, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: publication.title,
          text: publication.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getAccessBadge = (accessType) => {
    const badges = {
      open: { label: 'Open Access', color: '#059669', icon: Globe },
      paid: { label: 'Premium', color: '#dc2626', icon: Lock },
      sso: { label: 'Institutional', color: '#7c3aed', icon: Users }
    };

    return badges[accessType] || { label: 'Restricted', color: '#6b7280', icon: Lock };
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const { accessTypes, categories, years, statuses } = getFilterOptions();

  if (loading) {
    return (
      <div className="loading-state">
        <Loader />
      </div>
    );
  }

  return (
    <div className="publishing-page">
      <div className="container">
        {/* Hero Section */}
        <section className="publishing-hero">
          <div className="hero-badge">
            <BookOpen size={16} />
            <span>Publishing House</span>
          </div>
          <h1 className="hero-title">
            Academic <span className="text-gradient">Publications</span>
          </h1>
          <p className="hero-description">
            Access peer-reviewed academic journals, research papers, and publications in the built environment domain
          </p>

          {/* Stats */}
          <div className="publishing-stats">
            <div className="stat-card">
              <FileText size={24} />
              <div>
                <strong>{publications.length}+</strong>
                <span>Publications</span>
              </div>
            </div>
            <div className="stat-card">
              <Users size={24} />
              <div>
                <strong>1,200+</strong>
                <span>Authors</span>
              </div>
            </div>
            <div className="stat-card">
              <Award size={24} />
              <div>
                <strong>50+</strong>
                <span>Journals</span>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp size={24} />
              <div>
                <strong>10K+</strong>
                <span>Citations</span>
              </div>
            </div>
          </div>
        </section>

        {/* Submission CTA for authenticated users */}
        {isAuthenticated && (
          <section className="submission-cta">
            <div className="cta-content">
              <div className="cta-icon">
                <Send size={32} />
              </div>
              <div className="cta-text">
                <h3>Submit Your Research</h3>
                <p>Share your research with a global audience of built environment professionals</p>
              </div>
              <button 
                onClick={() => navigate('/publishing/submit')} 
                className="btn-primary"
              >
                <Upload size={20} />
                Submit Manuscript
              </button>
            </div>
          </section>
        )}

        {/* Guest CTA for non-authenticated users */}
        {!isAuthenticated && (
          <section className="guest-cta">
            <div className="cta-content">
              <div className="cta-icon">
                <Sparkles size={32} />
              </div>
              <div className="cta-text">
                <h3>Join Our Research Community</h3>
                <p>Sign in to submit manuscripts, access premium content, and track your publications</p>
              </div>
              <button 
                onClick={() => navigate('/login')} 
                className="btn-primary"
              >
                <ArrowRight size={20} />
                Get Started
              </button>
            </div>
          </section>
        )}

        {/* Search & Filter Section - FIXED ALIGNMENT */}
        <section className="search-filter-section">
          <div className="search-row">
            {/* Search Box */}
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search publications, authors, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-modern"
              />
            </div>

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

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
            >
              <Filter size={20} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-header">
                <h3>Filter Publications</h3>
                <button onClick={clearFilters} className="clear-filters">
                  <X size={16} />
                  Clear All
                </button>
              </div>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Access Type</label>
                  <select
                    value={filters.accessType}
                    onChange={(e) => handleFilterChange('accessType', e.target.value)}
                  >
                    <option value="">All Access Types</option>
                    {accessTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Publication Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Publications Section */}
        <section className="publications-section">
          <div className="section-header-inline">
            <h2>Available Publications</h2>
            <span className="publication-count">
              {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPublications.length > 0 ? (
            <div className="publications-grid">
              {filteredPublications.map((publication, index) => {
                const accessBadge = getAccessBadge(publication.accessType);
                const AccessIcon = accessBadge.icon;
                const canAccess = canAccessPublication(publication);

                return (
                  <div
                    key={publication.id}
                    ref={(el) => {
                      if (el && observerRef.current) {
                        el.dataset.id = publication.id;
                        observerRef.current.observe(el);
                      }
                    }}
                    className={`publication-card ${visibleCards.has(publication.id) ? 'visible' : ''}`}
                    style={{ '--card-index': index }}
                    onClick={() => handleView(publication)}
                  >
                    {/* Card Header */}
                    <div className="card-header">
                      <span 
                        className="access-badge" 
                        style={{ 
                          background: `${accessBadge.color}20`, 
                          color: accessBadge.color 
                        }}
                      >
                        <AccessIcon size={14} />
                        {accessBadge.label}
                      </span>
                      <div className="card-actions">
                        <button
                          className="action-btn"
                          onClick={(e) => handleBookmark(publication, e)}
                          title="Bookmark"
                        >
                          <Bookmark size={16} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={(e) => handleShare(publication, e)}
                          title="Share"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="card-content">
                      <h3 className="publication-title">{publication.title}</h3>

                      <div className="publication-meta">
                        <span className="meta-item">
                          <Users size={14} />
                          {publication.publisher}
                        </span>
                        <span className="meta-item">
                          <Calendar size={14} />
                          {formatDate(publication.publicationDate)}
                        </span>
                      </div>

                      <div className={`publication-description ${!canAccess ? 'blurred' : ''}`}>
                        <p>{publication.description}</p>
                        {!canAccess && (
                          <div className="blur-overlay">
                            <Lock size={32} />
                            <p>
                              {!isAuthenticated 
                                ? 'Sign in to view full details' 
                                : 'Upgrade to access this publication'}
                            </p>
                          </div>
                        )}
                      </div>

                      {publication.keywords && publication.keywords.length > 0 && (
                        <div className="publication-keywords">
                          {publication.keywords.slice(0, 3).map((keyword, i) => (
                            <span key={i} className="keyword-tag">{keyword}</span>
                          ))}
                          {publication.keywords.length > 3 && (
                            <span className="keyword-more">+{publication.keywords.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                      <div className="engagement-stats">
                        <span>
                          <Eye size={14} />
                          {publication.views || 0}
                        </span>
                        <span>
                          <Download size={14} />
                          {publication.downloads || 0}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canAccess) {
                            handleDownload(publication, e);
                          } else {
                            handleView(publication);
                          }
                        }}
                        className="btn-primary btn-sm"
                      >
                        {canAccess ? (
                          <>
                            <Download size={16} />
                            Download
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            View Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={64} />
              <h3>No Publications Found</h3>
              <p>
                {searchTerm || activeFiltersCount > 0
                  ? 'Try adjusting your search or filters to find more publications'
                  : 'There are currently no publications available'}
              </p>
              {(searchTerm || activeFiltersCount > 0) && (
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* Access Information Section */}
        <section className="access-info-section">
          <h3>Access Types Explained</h3>
          <div className="access-types-grid">
            <div className="access-type-card">
              <Globe size={40} />
              <h4>Open Access</h4>
              <p>Freely available to all users without restrictions</p>
            </div>
            <div className="access-type-card">
              <Lock size={40} />
              <h4>Premium Access</h4>
              <p>Available with premium subscription or individual purchase</p>
            </div>
            <div className="access-type-card">
              <Users size={40} />
              <h4>Institutional Access</h4>
              <p>Available to users with verified institutional email addresses</p>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default PublishingHouse;
