import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import { useApi } from '../../hooks/useApi';
import { newsroomAPI } from '../../services/api/newsroom';
import { Search, Filter, Calendar, User, Eye, MessageSquare, ThumbsUp, Bookmark, Share2, Plus, TrendingUp, Clock, FileText, Video, Lightbulb, Users, Award, ChevronRight, Bell, Star, ArrowRight, Sparkles, Zap, Heart, BookOpen, Edit3, ArrowUp, ChevronUp, X, SlidersHorizontal, MapPin, Building, Truck, Leaf, Map, Briefcase, Home, Trees, Landmark, Scale, Upload, Paperclip, AlertTriangle } from 'lucide-react';
import Loader from '../../components/common/Loader/Loader';
import './News.css';

// Define the 10 categories from the built environment
const BUILT_ENVIRONMENT_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: null, color: null },
  { id: 'urban-regional-planning', name: 'Urban & Regional Planning', icon: MapPin, color: '#dc2626', description: 'Strategic planning of cities, towns, and regions for land use, infrastructure, and sustainable development' },
  { id: 'architecture-urban-design', name: 'Architecture & Urban Design', icon: Building, color: '#e91e63', description: 'Designing buildings, public spaces, and the urban form to enhance functionality, aesthetics, and livability' },
  { id: 'civil-transportation-engineering', name: 'Civil & Transportation Engineering', icon: Truck, color: '#f59e0b', description: 'Designing and constructing infrastructure systems like roads, bridges, water supply, drainage, and transit networks' },
  { id: 'environmental-planning-sustainability', name: 'Environmental Planning & Sustainability', icon: Leaf, color: '#10b981', description: 'Integrating ecological principles into development, managing natural resources, and addressing climate resilience' },
  { id: 'geoinformatics-remote-sensing', name: 'Geoinformatics & Remote Sensing (GIS)', icon: Map, color: '#059669', description: 'Using geospatial data and satellite imagery for spatial analysis, mapping, urban monitoring, and decision-making' },
  { id: 'construction-project-management', name: 'Construction & Project Management', icon: Briefcase, color: '#3b82f6', description: 'Overseeing construction processes, procurement processes, project monitoring, cost control and site operations to deliver built infrastructure' },
  { id: 'real-estate-housing', name: 'Real Estate & Housing', icon: Home, color: '#1e40af', description: 'Development, valuation, and management of residential, commercial, and industrial property markets' },
  { id: 'landscape-architecture', name: 'Landscape Architecture', icon: Trees, color: '#7c3aed', description: 'Designing open spaces, parks, waterfronts, and ecological zones to support biodiversity and community well-being' },
  { id: 'heritage-conservation-cultural-planning', name: 'Heritage Conservation & Cultural Planning', icon: Landmark, color: '#ca8a04', description: 'Preserving historic buildings, urban memory, and identity while integrating them into modern development' },
  { id: 'public-policy-governance-urban-finance', name: 'Public Policy, Governance & Urban Finance', icon: Scale, color: '#b91c1c', description: 'Framing the institutional, regulatory, and financial frameworks that enable inclusive and efficient urban development' }
];

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
  const [myArticles, setMyArticles] = useState([]);
  const [articlesNeedingModification, setArticlesNeedingModification] = useState([]);

  // New Article Form State
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '',
    content: '',
    agreeTerms: false
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [contentType, setContentType] = useState('text'); // 'text' or 'file'
  const fileInputRef = useRef(null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadArticles();
    if (isAuthenticated) {
      loadUserArticles();
    }
  }, [isAuthenticated]);

  const loadUserArticles = async () => {
    try {
      const response = await newsroomAPI.getUserArticles();
      const userArticles = response.data?.articles || response.articles || [];
      setMyArticles(userArticles);
      
      // Filter articles that need modification
      const needsModification = userArticles.filter(
        article => article.approvalStatus === 'needsModification'
      );
      setArticlesNeedingModification(needsModification);
    } catch (error) {
      console.error('Error loading user articles:', error);
    }
  };

  const loadArticles = async () => {
    try {
      console.log('=== LOADING PUBLISHED ARTICLES ===');
      // Fetch only published articles for public newsroom
      const response = await newsroomAPI.getPublishedArticles();
      console.log('Published articles response:', response);
      
      // Backend returns: { success: true, data: { articles: [...], pagination: {...} } }
      if (response && response.data && response.data.articles) {
        setArticles(response.data.articles);
        console.log(`Loaded ${response.data.articles.length} published articles`);
      } else if (response && response.data && Array.isArray(response.data)) {
        setArticles(response.data);
        console.log(`Loaded ${response.data.length} published articles`);
      } else if (Array.isArray(response)) {
        setArticles(response);
        console.log(`Loaded ${response.length} published articles`);
      } else {
        console.log('No articles found in response');
        setArticles([]);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      showNotification('Failed to load articles', 'error');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Word Count Calculator
  const calculateWordCount = (text) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  // Handle Content Change with Word Count (minimum 100 words)
  const handleContentChange = (e) => {
    const content = e.target.value;
    setNewArticle({ ...newArticle, content });
    setWordCount(calculateWordCount(content));
    setCharCount(content.length);
  };

  // Handle Content Type Change
  const handleContentTypeChange = (type) => {
    setContentType(type);
    if (type === 'text') {
      setUploadedFiles([]);
    } else {
      setNewArticle({ ...newArticle, content: '' });
      setWordCount(0);
      setCharCount(0);
    }
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload PDF, Word, Excel, or Text files.', 'error');
        return false;
      }
      
      if (file.size > maxSize) {
        showNotification(`${file.name} is too large. Maximum size is 10MB.`, 'error');
        return false;
      }
      
      return true;
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);
    if (validFiles.length > 0) {
      showNotification(`${validFiles.length} file(s) uploaded successfully`, 'success');
    }
  };

  // Remove Uploaded File
  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  // Handle Article Submission
  const handleArticleSubmit = (e) => {
    e.preventDefault();
    
    if (!newArticle.title || !newArticle.category) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Validate based on content type
    if (contentType === 'text') {
      if (!newArticle.content) {
        showNotification('Please write article content', 'error');
        return;
      }
      if (wordCount < 100) {
        showNotification('Article content must be at least 100 words', 'error');
        return;
      }
    } else {
      if (uploadedFiles.length === 0) {
        showNotification('Please upload at least one file', 'error');
        return;
      }
    }

    if (!newArticle.agreeTerms) {
      showNotification('Please agree to the content guidelines and terms', 'error');
      return;
    }

    // Here you would typically send the data to your API
    console.log('Article Data:', newArticle);
    console.log('Content Type:', contentType);
    console.log('Uploaded Files:', uploadedFiles);
    
    showNotification('Article submitted successfully!', 'success');
    setShowCollabModal(false);
    
    // Reset form
    setNewArticle({
      title: '',
      category: '',
      content: '',
      agreeTerms: false
    });
    setUploadedFiles([]);
    setWordCount(0);
    setCharCount(0);
    setContentType('text');
  };

  const getFilteredArticles = () => {
    if (!Array.isArray(articles)) {
      console.warn('Articles is not an array:', articles);
      return [];
    }

    let filtered = [...articles];

    if (searchTerm) {
      filtered = filtered.filter(
        article =>
          article?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article?.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article?.author?.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article?.author?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article?.tags?.some(tag =>
            tag?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(article => article?.category === activeCategory);
    }

    if (filter !== 'all') {
      filtered = filtered.filter(article => article?.type === filter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b?.publishedAt || b?.createdAt || 0) - new Date(a?.publishedAt || a?.createdAt || 0);
        case 'popular':
          return (b?.views || 0) - (a?.views || 0);
        case 'trending':
          return (b?.engagementScore || 0) - (a?.engagementScore || 0);
        case 'comments':
          return (b?.commentCount || 0) - (a?.commentCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getCategoryInfo = (categoryId) => {
    return BUILT_ENVIRONMENT_CATEGORIES.find(cat => cat.id === categoryId) || BUILT_ENVIRONMENT_CATEGORIES[0];
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = dateString => {
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

  const handleLike = articleId => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId);
    } else {
      newLiked.add(articleId);
    }
    setLikedArticles(newLiked);
  };

  const handleBookmark = articleId => {
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

  const handleShare = async article => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: `/news/articles/${article.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard
        .writeText(`${window.location.origin}/news/articles/${article.id}`)
        .then(() => showNotification('Link copied to clipboard!', 'success'));
    }
  };

  const handleNewsletterSubscribe = e => {
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
  const featuredArticle = filteredArticles[0];

  console.log('=== RENDER STATE ===');
  console.log('Articles state:', articles);
  console.log('Filtered articles:', filteredArticles);
  console.log('Featured article:', featuredArticle);
  console.log('Loading:', loading);

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
        {/* Modification Notification Banner */}
        {isAuthenticated && articlesNeedingModification.length > 0 && (
          <div className="modification-alert-banner">
            <div className="alert-content">
              <AlertTriangle size={24} />
              <div className="alert-text">
                <strong>Action Required</strong>
                <p>
                  You have {articlesNeedingModification.length} article{articlesNeedingModification.length > 1 ? 's' : ''} that need{articlesNeedingModification.length === 1 ? 's' : ''} modification.
                </p>
              </div>
            </div>
            <button 
              className="alert-btn"
              onClick={() => navigate('/my-articles')}
            >
              View & Edit Articles
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="news-hero">
          <div className="news-hero-content">
            <div className="hero-badge">
              <Sparkles size={18} />
              <span>Newsroom</span>
            </div>
            <h1 className="news-hero-title">
              Discover <span className="text-gradient">Built Environment</span> Insights
            </h1>
            <p className="news-hero-description">
              Stay updated with cutting-edge insights, research, and discussions shaping the built environment sector
            </p>

            {/* Hero Actions */}
            {isAuthenticated && (
              <div className="hero-actions">
                <button
                  className="btn-primary btn-large pulse"
                  onClick={() => navigate('/news/submit')}
                >
                  <Plus size={20} />
                  Write New Article
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Guest Banner */}
        {!isAuthenticated && (
          <div className="guest-banner">
            <div className="guest-banner-content">
              <div className="guest-icon">
                <Edit3 size={36} />
              </div>
              <div className="guest-text">
                <h3>Join Our Community</h3>
                <p>Sign in to contribute articles, engage with content, and connect with professionals</p>
              </div>
              <button className="btn-primary" onClick={() => navigate('/Login')}>
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Write New Article Modal */}
        {showCollabModal && (
          <div className="modal-overlay" onClick={() => setShowCollabModal(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header-modern">
                <h3>Write New Article</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowCollabModal(false)}
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="modal-form-modern" onSubmit={handleArticleSubmit}>
                {/* Article Title */}
                <div className="form-group-modern">
                  <label htmlFor="article-title">Article Title</label>
                  <input
                    id="article-title"
                    type="text"
                    className="form-input-modern"
                    placeholder="Enter article title"
                    value={newArticle.title}
                    onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group-modern">
                  <label htmlFor="article-category">Category</label>
                  <select
                    id="article-category"
                    className="form-input-modern"
                    value={newArticle.category}
                    onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {BUILT_ENVIRONMENT_CATEGORIES.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Type Selection */}
                <div className="form-group-modern">
                  <label>Content Type</label>
                  <div className="content-type-selector">
                    <button
                      type="button"
                      className={`content-type-btn ${contentType === 'text' ? 'active' : ''}`}
                      onClick={() => handleContentTypeChange('text')}
                    >
                      <Edit3 size={18} />
                      Write Article Content
                    </button>
                    <button
                      type="button"
                      className={`content-type-btn ${contentType === 'file' ? 'active' : ''}`}
                      onClick={() => handleContentTypeChange('file')}
                    >
                      <Upload size={18} />
                      Upload Files
                    </button>
                  </div>
                </div>

                {/* Article Content OR File Upload based on selection */}
                {contentType === 'text' ? (
                  <div className="form-group-modern">
                    <label htmlFor="article-content">Article Content</label>
                    <div className="textarea-wrapper">
                      <textarea
                        id="article-content"
                        className="form-input-modern"
                        placeholder="Write your article..."
                        value={newArticle.content}
                        onChange={handleContentChange}
                        rows="10"
                        required
                      />
                      <div className="content-counter">
                        <span className={`counter-text ${wordCount < 100 ? 'below-minimum' : 'minimum-reached'}`}>
                          {wordCount} / 100 min
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-group-modern">
                    <label>Upload Files</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="file-upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={20} />
                        Upload PDF, Word, Excel files
                      </button>
                      <p className="file-upload-hint">
                        Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT
                      </p>
                    </div>

                    {/* Display Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files-list">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="uploaded-file-item">
                            <div className="file-info">
                              <Paperclip size={16} />
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">
                                ({(file.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              className="file-remove-btn"
                              onClick={() => removeFile(index)}
                              aria-label="Remove file"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="checkbox-group-modern">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={newArticle.agreeTerms}
                    onChange={e => setNewArticle({ ...newArticle, agreeTerms: e.target.checked })}
                    required
                  />
                  <label htmlFor="agree-terms">
                    I agree to the content guidelines and terms
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-modern">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowCollabModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <FileText size={18} />
                    Submit Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Featured Section */}
        {featuredArticle && (
          <section className="featured-section">
            <span className="section-label">
              <Star size={16} />
              Featured Article
            </span>
            <Link to={`/news/articles/${featuredArticle._id || featuredArticle.id}`} className="featured-article-card">
              <div className="featured-image-wrapper">
                <img
                  src={featuredArticle.featuredImage || featuredArticle.image || '/api/placeholder/800/600'}
                  alt={featuredArticle.title}
                  className="featured-image"
                />
                <div className="featured-overlay">
                  <span className="featured-badge">Featured</span>
                </div>
              </div>
              <div className="featured-content">
                <div className="featured-meta">
                  <span className="category-badge">{getCategoryInfo(featuredArticle.category).name}</span>
                  <span className="read-time">
                    <Clock size={14} />
                    {featuredArticle.readTime || '5'} min read
                  </span>
                </div>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <div className="featured-footer">
                  <div className="author-info-small">
                    <User size={16} />
                    {featuredArticle.author?.profile?.firstName || featuredArticle.author?.email || 'Anonymous'}
                  </div>
                  <div className="featured-stats">
                    <span>
                      <Eye size={14} />
                      {featuredArticle.views || 0}
                    </span>
                    <span>
                      <MessageSquare size={14} />
                      {featuredArticle.commentCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Filters Section */}
        <section className="filters-section">
          <div className="categories-wrapper">
            <h3 className="filter-label">Browse by Category</h3>
            <div className="categories-scroll">
              {BUILT_ENVIRONMENT_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon && <category.icon size={16} />}
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="search-sort-row">
            <div className={`search-box-enhanced ${isSearchFocused ? 'focused' : ''}`}>
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon-left" />
                <input
                  type="text"
                  placeholder="Search articles, authors, topics..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="search-input-enhanced"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button type="button" className="search-submit-btn" aria-label="Search">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="filter-controls">
              <div className="filter-dropdown-wrapper">
                <Filter size={18} className="filter-icon" />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
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
                  onChange={e => setSortBy(e.target.value)}
                  className="filter-select-modern"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                  <option value="comments">Most Discussed</option>
                </select>
              </div>

              <button
                className={`advanced-filter-btn ${showAdvancedFilters ? 'active' : ''}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="advanced-filters-panel">
              <div className="advanced-filters-content">
                <div className="filter-group">
                  <label>Date Range</label>
                  <select className="filter-select-modern">
                    <option>All Time</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Reading Time</label>
                  <select className="filter-select-modern">
                    <option>Any Length</option>
                    <option>Quick Read (&lt; 5 min)</option>
                    <option>Medium (5-10 min)</option>
                    <option>Long Read (&gt; 10 min)</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Author Type</label>
                  <select className="filter-select-modern">
                    <option>All Authors</option>
                    <option>Staff Writers</option>
                    <option>Guest Contributors</option>
                    <option>Verified Experts</option>
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
            <span className="article-count">{filteredArticles.length} Articles</span>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="articles-grid-modern">
              {filteredArticles.map(article => (
                <article key={article._id || article.id} className="article-card-modern">
                  <Link to={`/news/articles/${article._id || article.id}`} className="article-image-link">
                    <div className="article-image-modern">
                      <img
                        src={article.featuredImage || article.image || '/api/placeholder/400/300'}
                        alt={article.title}
                      />
                      {article.type && (
                        <span className="article-type-badge">{article.type}</span>
                      )}
                    </div>
                  </Link>

                  <div className="article-body">
                    <div className="article-header-modern">
                      <span className="category-tag">
                        {getCategoryInfo(article.category).name}
                      </span>
                      <div className="article-quick-actions">
                        <button
                          className={`action-icon ${bookmarkedArticles.has(article._id || article.id) ? 'active' : ''}`}
                          onClick={() => handleBookmark(article._id || article.id)}
                          aria-label="Bookmark"
                        >
                          <Bookmark size={16} />
                        </button>
                        <button
                          className="action-icon"
                          onClick={() => handleShare(article)}
                          aria-label="Share"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>

                    <Link to={`/news/articles/${article._id || article.id}`} className="article-title-modern">
                      {article.title}
                    </Link>

                    <p className="article-excerpt-modern">{article.excerpt}</p>

                    <div className="article-footer-modern">
                      <div className="author-meta">
                        <div className="author-avatar-small">
                          <User size={18} />
                        </div>
                        <div className="author-details-small">
                          <span className="author-name">
                            {article.author?.profile?.firstName || article.author?.email || 'Anonymous'}
                          </span>
                          <span className="publish-date-small">
                            {formatRelativeTime(article.publishedAt || article.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="engagement-row">
                        <button
                          className={`like-btn ${likedArticles.has(article._id || article.id) ? 'liked' : ''}`}
                          onClick={() => handleLike(article._id || article.id)}
                        >
                          <Heart size={16} />
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
              <h3>No Articles Found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn-primary" onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className={`newsletter-section ${newsletterSubscribed ? 'success' : ''}`}>
          <div className="newsletter-content-modern">
            <div className={`newsletter-icon ${newsletterSubscribed ? 'success' : ''}`}>
              {newsletterSubscribed ? <Bell size={40} /> : <Zap size={40} />}
            </div>
            {newsletterSubscribed ? (
              <>
                <h3>Thank You for Subscribing!</h3>
                <p>
                  Thank you for subscribing. You'll receive our latest updates directly in your inbox.
                </p>
              </>
            ) : (
              <>
                <h3>Stay in the Loop</h3>
                <p>
                  Get the latest articles, research updates, and industry insights delivered to your inbox
                </p>
                <form className="newsletter-form-modern" onSubmit={handleNewsletterSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="newsletter-input-modern"
                    required
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
    </div>
  );
};

export default News;
