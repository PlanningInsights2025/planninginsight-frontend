import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import { useApi } from '../../hooks/useApi';
import { newsroomAPI } from '../../services/api/newsroom';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Plus, 
  TrendingUp, 
  Clock, 
  FileText, 
  Video, 
  Lightbulb, 
  Users, 
  Award, 
  ChevronRight, 
  Bell, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Heart, 
  BookOpen, 
  Edit3, 
  ArrowUp, 
  ChevronUp,
  X,
  SlidersHorizontal
} from 'lucide-react';
import Loader from '../../components/common/Loader/Loader';
import './News.css';

const News = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { execute: fetchArticlesApi } = useApi(newsroomAPI.getArticles);

  // Scroll to Top Button Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const articlesData = await fetchArticlesApi(null, {
        showError: true,
        errorMessage: 'Failed to load articles'
      });

      if (articlesData) {
        setArticles(articlesData);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredArticles = () => {
    let filtered = [...articles];

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(article => article.category === activeCategory);
    }

    if (filter !== 'all') {
      filtered = filtered.filter(article => article.type === filter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'trending':
          return (b.engagementScore || 0) - (a.engagementScore || 0);
        case 'comments':
          return (b.commentCount || 0) - (a.commentCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getCategories = () => {
    const categories = [...new Set(articles.map(article => article.category))];
    return ['all', ...categories.filter(Boolean)];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const handleLike = (articleId) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId);
    } else {
      newLiked.add(articleId);
    }
    setLikedArticles(newLiked);
  };

  const handleBookmark = (articleId) => {
    const newBookmarked = new Set(bookmarkedArticles);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
      showNotification('Removed from bookmarks', 'success');
    } else {
      newBookmarked.add(articleId);
      showNotification('Added to bookmarks', 'success');
    }
    setBookmarkedArticles(newBookmarked);
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: `/news/articles/${article.id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/news/articles/${article.id}`)
        .then(() => showNotification('Link copied to clipboard!', 'success'));
    }
  };

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail && /\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterSubscribed(true);
      showNotification('Successfully subscribed to newsletter!', 'success');
      setNewsletterEmail('');
    } else {
      showNotification('Please enter a valid email address', 'error');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleResetFilters = () => {
    setFilter('all');
    setSortBy('latest');
    setSearchTerm('');
    setActiveCategory('all');
    setShowAdvancedFilters(false);
  };

  const filteredArticles = getFilteredArticles();
  const categories = getCategories();
  const featuredArticle = filteredArticles[0];

  if (loading) {
    return (
      <div className="loading-state">
        <Loader />
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="container">
        {/* Hero Section */}
        <section className="news-hero">
          <div className="news-hero-content">
            <div className="hero-badge">
              <TrendingUp size={16} />
              <span>Latest Updates</span>
            </div>
            <h1 className="news-hero-title">
              Newsroom & <span className="text-gradient">Insights</span>
            </h1>
            <p className="news-hero-description">
              Stay updated with cutting-edge insights, research, and discussions shaping the built environment sector
            </p>

            {/* Hero Actions */}
            {isAuthenticated && (
              <div className="hero-actions">
                <button
                  onClick={() => setShowCollabModal(true)}
                  className="btn-primary btn-large"
                >
                  <Plus size={20} />
                  Write Article
                </button>
                <Link to="/news/bookmarks" className="btn-secondary btn-large">
                  <Bookmark size={20} />
                  My Bookmarks
                </Link>
              </div>
            )}

            {/* News Stats */}
            <div className="news-stats">
              <div className="stat-item">
                <FileText size={24} />
                <div>
                  <strong>{articles.length}+</strong>
                  <span>Articles</span>
                </div>
              </div>
              <div className="stat-item">
                <Users size={24} />
                <div>
                  <strong>500+</strong>
                  <span>Contributors</span>
                </div>
              </div>
              <div className="stat-item">
                <Award size={24} />
                <div>
                  <strong>50+</strong>
                  <span>Categories</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Banner */}
        {!isAuthenticated && (
          <div className="guest-banner">
            <div className="guest-banner-content">
              <div className="guest-icon">
                <Bell size={32} />
              </div>
              <div className="guest-text">
                <h3>Join Our Community</h3>
                <p>Sign in to contribute articles, engage with content, and connect with professionals</p>
              </div>
              <Link to="/login" className="btn-primary">
                <Sparkles size={18} />
                Get Started Free
              </Link>
            </div>
          </div>
        )}

        {/* Featured Article */}
        {featuredArticle && (
          <section className="featured-section">
            <div className="section-label">
              <Star size={16} />
              <span>Featured Article</span>
            </div>
            <Link to={`/news/articles/${featuredArticle.id}`} className="featured-article-card">
              <div className="featured-image-wrapper">
                <img
                  src={featuredArticle.image || '/api/placeholder/800/400'}
                  alt={featuredArticle.title}
                  className="featured-image"
                />
                <div className="featured-overlay">
                  <span className="featured-badge">Featured</span>
                </div>
              </div>
              <div className="featured-content">
                <div className="featured-meta">
                  <span className="category-badge">{featuredArticle.category}</span>
                  <span className="read-time">
                    <Clock size={14} />
                    {featuredArticle.readTime || '5 min'} read
                  </span>
                </div>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <div className="featured-footer">
                  <div className="author-info-small">
                    <User size={16} />
                    <span>{featuredArticle.author?.name || 'Anonymous'}</span>
                  </div>
                  <div className="featured-stats">
                    <span><Eye size={14} /> {featuredArticle.views || 0}</span>
                    <span><MessageSquare size={14} /> {featuredArticle.commentCount || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Enhanced Filters Section */}
        <section className="filters-section">
          {/* Categories */}
          <div className="categories-wrapper">
            <h3 className="filter-label">Browse by Category</h3>
            <div className="categories-scroll">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Search & Sort Row */}
          <div className="search-sort-row">
            {/* Enhanced Search Box */}
            <div className={`search-box-enhanced ${isSearchFocused ? 'focused' : ''}`}>
              <div className="search-input-wrapper">
                <Search className="search-icon-left" size={20} />
                <input
                  type="text"
                  placeholder="Search articles, authors, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="search-input-enhanced"
                />
                {searchTerm && (
                  <button
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  className="search-submit-btn"
                  onClick={() => console.log('Search:', searchTerm)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              
              {/* Search Suggestions */}
              {isSearchFocused && searchTerm && (
                <div className="search-suggestions-dropdown">
                  <div className="suggestions-header">
                    <span className="suggestions-title">Quick suggestions</span>
                  </div>
                  <div className="suggestion-item" onClick={() => setSearchTerm('Urban Planning')}>
                    <Search size={14} />
                    <span>Urban Planning</span>
                  </div>
                  <div className="suggestion-item" onClick={() => setSearchTerm('Sustainable Development')}>
                    <Search size={14} />
                    <span>Sustainable Development</span>
                  </div>
                  <div className="suggestion-item" onClick={() => setSearchTerm('Smart Cities')}>
                    <Search size={14} />
                    <span>Smart Cities</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
              <div className="filter-dropdown-wrapper">
                <SlidersHorizontal size={18} className="filter-icon" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select-modern"
                >
                  <option value="all">All Types</option>
                  <option value="article">Articles</option>
                  <option value="research">Research</option>
                  <option value="case-study">Case Studies</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>

              <div className="filter-dropdown-wrapper">
                <TrendingUp size={18} className="filter-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select-modern"
                >
                  <option value="latest">Latest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                  <option value="comments">Most Discussed</option>
                </select>
              </div>

              <button
                className={`advanced-filter-btn ${showAdvancedFilters ? 'active' : ''}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="advanced-filters-panel">
              <div className="advanced-filters-content">
                <div className="filter-group">
                  <label>Date Range</label>
                  <select className="form-input-modern">
                    <option>Any time</option>
                    <option>Last 24 hours</option>
                    <option>Last week</option>
                    <option>Last month</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Reading Time</label>
                  <select className="form-input-modern">
                    <option>Any duration</option>
                    <option>Under 5 min</option>
                    <option>5-10 min</option>
                    <option>10-20 min</option>
                    <option>20+ min</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Author Type</label>
                  <select className="form-input-modern">
                    <option>All authors</option>
                    <option>Verified</option>
                    <option>Expert</option>
                    <option>Community</option>
                  </select>
                </div>
                <div className="filter-actions">
                  <button className="btn-ghost" onClick={handleResetFilters}>
                    Reset All
                  </button>
                  <button className="btn-primary" onClick={() => setShowAdvancedFilters(false)}>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Articles Section */}
        <section className="articles-section">
          <div className="section-header-inline">
            <h2>Latest Articles</h2>
            <span className="article-count">{filteredArticles.length} articles found</span>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="articles-grid-modern">
              {filteredArticles.map((article) => (
                <article key={article.id} className="article-card-modern">
                  <Link to={`/news/articles/${article.id}`} className="article-image-link">
                    <div className="article-image-modern">
                      <img
                        src={article.image || '/api/placeholder/400/250'}
                        alt={article.title}
                      />
                      <span className="article-type-badge">{article.type || 'Article'}</span>
                    </div>
                  </Link>

                  <div className="article-body">
                    <div className="article-header-modern">
                      <span className="category-tag">{article.category}</span>
                      <div className="article-quick-actions">
                        <button
                          className={`action-icon ${bookmarkedArticles.has(article.id) ? 'active' : ''}`}
                          onClick={() => handleBookmark(article.id)}
                          title="Bookmark"
                        >
                          <Bookmark size={14} />
                        </button>
                        <button
                          className="action-icon"
                          onClick={() => handleShare(article)}
                          title="Share"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>

                    <Link to={`/news/articles/${article.id}`} className="article-title-modern">
                      {article.title}
                    </Link>

                    <p className="article-excerpt-modern">{article.excerpt}</p>

                    <div className="article-footer-modern">
                      <div className="author-meta">
                        <div className="author-avatar-small">
                          <User size={16} />
                        </div>
                        <div className="author-details-small">
                          <span className="author-name">{article.author?.name || 'Anonymous'}</span>
                          <span className="publish-date-small">{formatRelativeTime(article.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="engagement-row">
                        <button
                          className={`like-btn ${likedArticles.has(article.id) ? 'liked' : ''}`}
                          onClick={() => handleLike(article.id)}
                        >
                          <Heart size={14} fill={likedArticles.has(article.id) ? 'currentColor' : 'none'} />
                          {article.likes || 0}
                        </button>
                        <span className="engagement-item">
                          <MessageSquare size={14} />
                          {article.commentCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state-modern">
              <FileText size={64} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn-primary" onClick={handleResetFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className={`newsletter-section ${newsletterSubscribed ? 'success' : ''}`}>
          <div className="newsletter-content-modern">
            <div className="newsletter-icon">
              {newsletterSubscribed ? <Bell size={40} /> : <Zap size={40} />}
            </div>
            {newsletterSubscribed ? (
              <>
                <h3>You're All Set!</h3>
                <p>Thank you for subscribing. You'll receive our latest updates directly in your inbox.</p>
              </>
            ) : (
              <>
                <h3>Stay in the Loop</h3>
                <p>Get the latest articles, research updates, and industry insights delivered to your inbox</p>
                <form className="newsletter-form-modern" onSubmit={handleNewsletterSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="newsletter-input-modern"
                  />
                  <button type="submit" className="btn-primary">
                    Subscribe
                  </button>
                </form>
                <p className="newsletter-note">We respect your privacy. Unsubscribe anytime.</p>
              </>
            )}
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

      {/* Collaboration Modal */}
      {showCollabModal && (
        <div className="modal-overlay" onClick={() => setShowCollabModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h3>Write New Article</h3>
              <button className="modal-close-btn" onClick={() => setShowCollabModal(false)}>
                ×
              </button>
            </div>
            <form className="modal-form-modern" onSubmit={(e) => {
              e.preventDefault();
              showNotification('Article submitted for review!', 'success');
              setShowCollabModal(false);
            }}>
              <div className="form-group-modern">
                <label>Article Title</label>
                <input type="text" className="form-input-modern" placeholder="Enter article title" required />
              </div>
              <div className="form-group-modern">
                <label>Category</label>
                <select className="form-input-modern" required>
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-modern">
                <label>Article Content</label>
                <textarea className="form-input-modern" rows="6" placeholder="Write your article..." required></textarea>
              </div>
              <div className="checkbox-group-modern">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the content guidelines and terms</label>
              </div>
              <div className="modal-footer-modern">
                <button type="button" className="btn-ghost" onClick={() => setShowCollabModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
