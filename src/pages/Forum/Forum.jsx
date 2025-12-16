import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import {
  Search,
  Plus,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  ThumbsUp,
  Star,
  Award,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import './Forum.css';

/**
 * Mock data for development/testing
 */
const mockForums = [
  { id: '1', name: 'General Discussion', description: 'General topics and announcements', icon: '💬', threadCount: 245, memberCount: 1240 },
  { id: '2', name: 'Technical Help', description: 'Get help with technical issues', icon: '🔧', threadCount: 189, memberCount: 890 },
  { id: '3', name: 'Career Advice', description: 'Career guidance and job hunting', icon: '💼', threadCount: 156, memberCount: 1050 },
  { id: '4', name: 'Project Showcase', description: 'Share your projects and get feedback', icon: '🚀', threadCount: 98, memberCount: 670 }
];

const mockThreads = [
  {
    id: '1',
    title: 'How to improve project management skills?',
    content: 'Looking for advice on improving my project management abilities and leadership qualities in the workplace. Any recommendations for courses or books?',
    forumId: '3',
    author: { id: '1', name: 'John Doe', points: 245 },
    isQuestion: true,
    isAnonymous: false,
    isPinned: false,
    tags: ['career', 'skills', 'management'],
    likes: 45,
    commentCount: 12,
    viewCount: 234,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Best practices for remote team collaboration',
    content: 'What tools and strategies work best for remote teams? Looking to improve our team productivity and communication.',
    forumId: '1',
    author: { id: '2', name: 'Jane Smith', points: 189 },
    isQuestion: false,
    isAnonymous: false,
    isPinned: true,
    tags: ['remote', 'collaboration', 'tools'],
    likes: 78,
    commentCount: 23,
    viewCount: 456,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Need help with React state management',
    content: 'Struggling with complex state in my React application. Should I use Context API or Redux for a medium-sized app?',
    forumId: '2',
    author: { id: '3', name: 'Anonymous', points: 0 },
    isQuestion: true,
    isAnonymous: true,
    isPinned: false,
    tags: ['react', 'javascript', 'help'],
    likes: 34,
    commentCount: 18,
    viewCount: 289,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Completed my first full-stack project!',
    content: 'Just finished building a complete e-commerce platform using MERN stack. Would love to get feedback from the community.',
    forumId: '4',
    author: { id: '4', name: 'Alex Chen', points: 156 },
    isQuestion: false,
    isAnonymous: false,
    isPinned: false,
    tags: ['project', 'mern', 'showcase'],
    likes: 92,
    commentCount: 31,
    viewCount: 567,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: 'Tips for technical interview preparation',
    content: 'Share your best strategies for preparing for coding interviews at top tech companies.',
    forumId: '3',
    author: { id: '5', name: 'Sarah Johnson', points: 312 },
    isQuestion: true,
    isAnonymous: false,
    isPinned: false,
    tags: ['interview', 'career', 'coding'],
    likes: 67,
    commentCount: 28,
    viewCount: 412,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockContributors = [
  { id: '1', name: 'Sarah Johnson', avatar: null, points: 2450 },
  { id: '2', name: 'Mike Chen', avatar: null, points: 1890 },
  { id: '3', name: 'Emily Davis', avatar: null, points: 1654 },
  { id: '4', name: 'David Wilson', avatar: null, points: 1432 },
  { id: '5', name: 'Lisa Anderson', avatar: null, points: 1298 }
];

/**
 * Enhanced Forum Main Page
 */
const Forum = () => {
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // State management
  const [threads, setThreads] = useState([]);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForum, setSelectedForum] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeContributors, setActiveContributors] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  // Refs for scroll animations
  const observerRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  /**
   * Load data on component mount
   */
  useEffect(() => {
    loadData();
    
    if (isAuthenticated && user) {
      setUserPoints(user.points || 0);
    }
  }, [isAuthenticated, user]);

  /**
   * Scroll animations
   */
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

  /**
   * Scroll to top button logic
   */
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Load all forum data with fallback to mock data
   */
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Use mock data - replace with API calls when backend is ready
      setTimeout(() => {
        setThreads(mockThreads);
        setForums(mockForums);
        setActiveContributors(mockContributors);
        extractTrendingTopics(mockThreads);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading forum data:', error);
      // Use mock data as fallback
      setThreads(mockThreads);
      setForums(mockForums);
      setActiveContributors(mockContributors);
      extractTrendingTopics(mockThreads);
      setLoading(false);
    }
  };

  /**
   * Extract trending topics from threads
   */
  const extractTrendingTopics = (threadsData) => {
    const topics = {};
    
    threadsData.forEach(thread => {
      thread.tags?.forEach(tag => {
        if (!topics[tag]) {
          topics[tag] = { name: tag, count: 0 };
        }
        topics[tag].count++;
      });
    });

    const sorted = Object.values(topics)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setTrendingTopics(sorted);
  };

  /**
   * Filter and sort threads
   */
  const getFilteredThreads = () => {
    let filtered = [...threads];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        thread =>
          thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply forum filter
    if (selectedForum !== 'all') {
      filtered = filtered.filter(thread => thread.forumId === selectedForum);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'trending':
          return (b.likes || 0) + (b.commentCount || 0) - ((a.likes || 0) + (a.commentCount || 0));
        case 'mostCommented':
          return (b.commentCount || 0) - (a.commentCount || 0);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  /**
   * Format relative time
   */
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMins = Math.floor(diffTime / 60000);
    const diffHours = Math.floor(diffTime / 3600000);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const filteredThreads = getFilteredThreads();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="forum-page">
      <div className="container">
        {/* Hero Header */}
        <section className="page-header animate-slide-down">
          <div className="header-content">
            <div className="header-text">
              <div className="header-badge">
                <MessageSquare size={20} />
                <span>Discussion Forum</span>
              </div>
              <h1>Connect & Share Knowledge</h1>
              <p>Ask questions, share insights, and engage with professionals worldwide</p>
            </div>
            {isAuthenticated ? (
              <div className="header-actions">
                <button onClick={() => navigate('/forum/create')} className="btn-get-started">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Get Started
                </button>
                <div className="user-points-card">
                  <Award size={24} className="points-icon" />
                  <div className="points-info">
                    <span className="points-label">Your Points</span>
                    <span className="points-value">{userPoints}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="header-actions">
                <button onClick={() => navigate('/login')} className="btn-get-started">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Get Started
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Forum Controls */}
        <section className="forum-controls animate-fade-in">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search discussions, topics, people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-options">
            <select
              className="filter-select"
              value={selectedForum}
              onChange={(e) => setSelectedForum(e.target.value)}
            >
              <option value="all">All Forums</option>
              {forums.map(forum => (
                <option key={forum.id} value={forum.id}>
                  {forum.name}
                </option>
              ))}
            </select>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="popular">Most Popular</option>
              <option value="mostCommented">Most Discussed</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>
        </section>

        <div className="forum-layout">
          {/* Main Content */}
          <div className="forum-main">
            {/* Threads Section */}
            <section className="threads-section">
              <div className="section-header">
                <h2>Discussions</h2>
                <span className="thread-count">{filteredThreads.length} threads</span>
              </div>

              {filteredThreads.length > 0 ? (
                <div className="threads-list">
                  {filteredThreads.map((thread, index) => {
                    const threadId = thread.id || `thread-${index}`;
                    const isVisible = visibleCards.has(threadId);
                    
                    return (
                      <div
                        key={threadId}
                        ref={(el) => {
                          if (el && observerRef.current) {
                            el.dataset.id = threadId;
                            observerRef.current.observe(el);
                          }
                        }}
                        className={`thread-card ${isVisible ? 'visible' : ''}`}
                        style={{ '--card-index': index }}
                        onClick={() => navigate(`/forum/thread/${threadId}`)}
                      >
                        {/* Thread Meta */}
                        <div className="thread-meta">
                          <span className="forum-tag">
                            {forums.find(f => f.id === thread.forumId)?.name || 'General'}
                          </span>
                          {thread.isQuestion && (
                            <span className="question-badge">
                              <MessageSquare size={12} />
                              Question
                            </span>
                          )}
                          {thread.isPinned && (
                            <span className="pinned-badge">
                              <Star size={12} />
                              Pinned
                            </span>
                          )}
                        </div>

                        {/* Thread Header */}
                        <div className="thread-header">
                          <h3 className="thread-title">{thread.title}</h3>
                        </div>

                        {/* Thread Excerpt */}
                        <p className="thread-excerpt">
                          {thread.content?.substring(0, 200)}
                          {thread.content?.length > 200 && '...'}
                        </p>

                        {/* Thread Tags */}
                        {thread.tags && thread.tags.length > 0 && (
                          <div className="thread-tags">
                            {thread.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="tag-pill">{tag}</span>
                            ))}
                            {thread.tags.length > 3 && (
                              <span className="tag-more">+{thread.tags.length - 3} more</span>
                            )}
                          </div>
                        )}

                        {/* Thread Footer */}
                        <div className="thread-footer">
                          <div className="author-info">
                            <div className="author-avatar placeholder">
                              {thread.isAnonymous ? '?' : (
                                thread.author?.name?.charAt(0).toUpperCase() || 'U'
                              )}
                            </div>
                            <div className="author-details">
                              <span className="author-name">
                                {thread.isAnonymous ? 'Anonymous' : thread.author?.name || 'User'}
                              </span>
                              <span className="post-time">{formatRelativeTime(thread.createdAt)}</span>
                            </div>
                          </div>

                          <div className="thread-stats">
                            <span className="stat">
                              <ThumbsUp size={16} />
                              {thread.likes || 0}
                            </span>
                            <span className="stat">
                              <MessageSquare size={16} />
                              {thread.commentCount || 0}
                            </span>
                            <span className="stat">
                              <Eye size={16} />
                              {thread.viewCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <MessageSquare size={64} />
                  <h3>No discussions found</h3>
                  <p>Be the first to start a conversation!</p>
                  {isAuthenticated && (
                    <button onClick={() => navigate('/forum/create')} className="btn-primary">
                      <Plus size={18} />
                      Create Thread
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="forum-sidebar">
            {/* Active Contributors */}
            {activeContributors.length > 0 && (
              <div className="sidebar-card animate-slide-left">
                <h3>
                  <Users size={20} />
                  Top Contributors
                </h3>
                <div className="contributors-list">
                  {activeContributors.slice(0, 5).map((contributor, index) => (
                    <div key={contributor.id} className="contributor-item">
                      <div className="contributor-rank">#{index + 1}</div>
                      <div className="contributor-avatar">
                        {contributor.avatar ? (
                          <img src={contributor.avatar} alt={contributor.name} />
                        ) : (
                          contributor.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="contributor-info">
                        <div className="contributor-name">{contributor.name}</div>
                        <div className="contributor-points">
                          <Award size={12} />
                          {contributor.points} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Topics */}
            {trendingTopics.length > 0 && (
              <div className="sidebar-card animate-slide-left">
                <h3>
                  <TrendingUp size={20} />
                  Trending Topics
                </h3>
                <div className="trending-list">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="trending-item"
                      onClick={() => setSearchTerm(topic.name)}
                    >
                      <span className="trending-name">#{topic.name}</span>
                      <span className="trending-count">{topic.count} threads</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forum Guidelines */}
            <div className="sidebar-card animate-slide-left">
              <h3>
                <Sparkles size={20} />
                Community Guidelines
              </h3>
              <ul className="guidelines-list">
                <li>Be respectful and constructive</li>
                <li>Stay on topic</li>
                <li>No spam or self-promotion</li>
                <li>Report inappropriate content</li>
                <li>Help others learn and grow</li>
              </ul>
            </div>
          </aside>
        </div>
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

export default Forum;
