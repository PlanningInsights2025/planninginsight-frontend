import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { newsroomAPI } from '../../../services/api/newsroom';
import { ThumbsUp, ThumbsDown, MessageCircle, Flag, Share2, Eye, Calendar, User, X, ChevronUp, BookOpen, Clock, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { articleId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [userInteractions, setUserInteractions] = useState({ liked: false, disliked: false });
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagDescription, setFlagDescription] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    loadArticle();
    loadStats();
  }, [articleId]);

  // Load recommended articles once we have the main article
  useEffect(() => {
    if (article?.category) {
      loadRecommendedArticles(article.category);
    }
  }, [article?.category]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setReadingProgress(progress);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadArticle = async () => {
    try {
      const response = await newsroomAPI.getArticle(articleId);
      setArticle(response.data.article);
    } catch (error) {
      console.error('Failed to load article:', error);
      toast.error('Failed to load article');
      navigate('/news');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await newsroomAPI.getArticleStats(articleId);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadRecommendedArticles = async (category) => {
    try {
      const response = await newsroomAPI.getArticles({ category, limit: 4 });
      const others = (response.data?.articles || []).filter(a => a._id !== articleId);
      setRecommendedArticles(others.slice(0, 3));
    } catch (error) {
      // Silently fail - recommended articles are supplementary
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like articles');
      return;
    }
    try {
      const response = await newsroomAPI.likeArticle(articleId);
      setUserInteractions({
        liked: response.data.userLiked,
        disliked: response.data.userDisliked
      });
      loadStats();
    } catch (error) {
      toast.error('Failed to like article');
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike articles');
      return;
    }
    try {
      const response = await newsroomAPI.dislikeArticle(articleId);
      setUserInteractions({
        liked: response.data.userLiked,
        disliked: response.data.userDisliked
      });
      loadStats();
    } catch (error) {
      toast.error('Failed to dislike article');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      await newsroomAPI.addComment(articleId, comment);
      setComment('');
      loadArticle();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleFlag = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to flag content');
      return;
    }
    if (!flagReason) {
      toast.error('Please select a reason');
      return;
    }
    try {
      await newsroomAPI.flagArticle(articleId, flagReason, flagDescription);
      setShowFlagModal(false);
      setFlagReason('');
      setFlagDescription('');
      toast.success('Article flagged for review');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to flag article');
    }
  };

  const handleShare = async (platform) => {
    try {
      await newsroomAPI.shareArticle(articleId);
      const authorName = article.author.profile?.firstName
        ? `${article.author.profile.firstName} ${article.author.profile.lastName || ''}`
        : article.author.email;
      const excerpt = article.excerpt ? ` — "${article.excerpt.slice(0, 120)}..."` : '';
      const shareText = `${article.title} by ${authorName}${excerpt}`;
      const shareUrl = window.location.href;

      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=PlanningInsights,BuiltEnvironment`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.excerpt || '')}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'whatsapp':
          url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        default:
          navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard');
          setShowShareMenu(false);
          return;
      }
      window.open(url, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBlurredContent = () => {
    if (!article) return '';
    const paragraphs = article.content.split('</p>').filter(p => p.trim());
    if (paragraphs.length <= 2) return article.content;

    const firstPara = paragraphs[0] + '</p>';
    const lastPara = paragraphs[paragraphs.length - 1] + '</p>';
    const middleParas = paragraphs.slice(1, -1).map(p => p + '</p>').join('');

    return `${firstPara}<div class="blur-overlay">${middleParas}</div>${lastPara}`;
  };

  if (loading) {
    return (
      <div className="article-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-container">
        <div className="error-message">
          <h2>Article not found</h2>
          <button onClick={() => navigate('/news')}>Back to Newsroom</button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }}></div>

      <div className="article-detail-container fade-in">
        {/* Article Header */}
        <header className="article-header slide-up">
          <div className="breadcrumb">
            <Link to="/news">Newsroom</Link>
            <span> / </span>
            <span>{article.category}</span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <div className="meta-item">
              <User size={18} />
              <Link to={`/profile/${article.author._id}`} className="author-link">
                {article.author.profile?.firstName || article.author.email}
              </Link>
              {article.coAuthors?.length > 0 && (
                <span className="co-authors">
                  & {article.coAuthors.map(a => a.profile?.firstName || a.email).join(', ')}
                </span>
              )}
            </div>

            <div className="meta-item">
              <Calendar size={18} />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
            </div>

            {stats && (
              <div className="meta-item">
                <Eye size={18} />
                <span>{stats.views} views</span>
              </div>
            )}

            <div className="meta-item reading-time">
              <span>📖 {article.readingTime || '5'} min read</span>
            </div>
          </div>

          {article.tags?.length > 0 && (
            <div className="article-tags">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Author Top Panel */}
        <div className="author-top-panel slide-up">
          <div className="author-top-avatar">
            {article.author.profile?.profilePicture || article.author.profile?.avatar ? (
              <img
                src={article.author.profile.profilePicture || article.author.profile.avatar}
                alt={article.author.profile?.firstName || 'Author'}
              />
            ) : (
              <span>{(article.author.profile?.firstName?.[0] || 'U').toUpperCase()}</span>
            )}
          </div>
          <div className="author-top-info">
            <div className="author-top-names">
              <Link to={`/profile/${article.author._id}`} className="author-top-name">
                {article.author.profile?.firstName
                  ? `${article.author.profile.firstName} ${article.author.profile.lastName || ''}`
                  : article.author.email}
              </Link>
              {article.coAuthors?.map(ca => (
                <span key={ca._id} className="co-author-chip">
                  &amp; <Link to={`/profile/${ca._id}`}>
                    {ca.profile?.firstName ? `${ca.profile.firstName} ${ca.profile.lastName || ''}` : ca.email}
                  </Link>
                </span>
              ))}
            </div>
            <span className="author-pi-id">
              <Award size={13} /> PI‑{article.author._id?.slice(-8)?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="featured-image zoom-in">
            <img src={article.featuredImage} alt={article.title} />
          </div>
        )}

        {/* Article Excerpt */}
        {article.excerpt && (
          <div className="article-excerpt slide-up">
            <p>{article.excerpt}</p>
          </div>
        )}

        {/* Article Content */}
        <div className="article-content slide-up">
          {isAuthenticated ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <div className="blurred-content">
              <div dangerouslySetInnerHTML={{ __html: getBlurredContent() }} />
              <div className="login-prompt pulse">
                <h3>🔒 Premium Content</h3>
                <p>Login to read the full article</p>
                <button onClick={() => navigate('/login')}>Login / Sign Up</button>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Bar */}
        <div className="interaction-bar slide-up">
          <button
            className={`interaction-btn ${userInteractions.liked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp size={20} />
            <span>{stats?.likes || 0}</span>
          </button>

          <button
            className={`interaction-btn ${userInteractions.disliked ? 'active' : ''}`}
            onClick={handleDislike}
          >
            <ThumbsDown size={20} />
            <span>{stats?.dislikes || 0}</span>
          </button>

          <button
            className="interaction-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} />
            <span>{article.comments?.length || 0} Comments</span>
          </button>

          <div className="share-dropdown">
            <button
              className="interaction-btn"
              onClick={() => setShowShareMenu(prev => !prev)}
            >
              <Share2 size={20} />
              <span>Share</span>
            </button>
            {showShareMenu && (
              <div className="share-menu">
                <button onClick={() => handleShare('twitter')}>𝕏 Twitter</button>
                <button onClick={() => handleShare('linkedin')}>LinkedIn</button>
                <button onClick={() => handleShare('facebook')}>Facebook</button>
                <button onClick={() => handleShare('whatsapp')}>WhatsApp</button>
                <button onClick={() => handleShare('copy')}>📋 Copy Link</button>
              </div>
            )}
          </div>

          <button className="interaction-btn" onClick={() => setShowFlagModal(true)}>
            <Flag size={20} />
            <span>Report</span>
          </button>
        </div>

        {/* Citation Block */}
        {article.citationText && (
          <div className="citation-block slide-up">
            <h4>📚 Cite This Article</h4>
            <p>{article.citationText}</p>
          </div>
        )}

        {/* Author Section - Bottom */}
        <section className="author-section slide-up">
          <h3>About the Author{article.coAuthors?.length > 0 ? 's' : ''}</h3>

          {/* Primary Author */}
          <div className="author-card">
            <div className="author-avatar">
              {article.author.profile?.profilePicture || article.author.profile?.avatar ? (
                <img
                  src={article.author.profile.profilePicture || article.author.profile.avatar}
                  alt={article.author.profile?.firstName || 'Author'}
                />
              ) : (
                <span>{(article.author.profile?.firstName?.[0] || 'U').toUpperCase()}</span>
              )}
            </div>
            <div className="author-details">
              <h4>
                <Link to={`/profile/${article.author._id}`} className="author-name-link">
                  {article.author.profile?.firstName
                    ? `${article.author.profile.firstName} ${article.author.profile.lastName || ''}`
                    : article.author.email}
                </Link>
              </h4>
              <span className="author-unique-id">
                <Award size={13} /> Planning Insights ID: PI‑{article.author._id?.slice(-8)?.toUpperCase()}
              </span>
              <p className="author-bio">{article.author.profile?.bio || 'Planning professional contributing to Planning Insights.'}</p>
              <Link to={`/profile/${article.author._id}`} className="view-profile">
                View Full Profile →
              </Link>
            </div>
          </div>

          {/* Co-Authors */}
          {article.coAuthors?.length > 0 && (
            <div className="co-authors-section">
              <h4 className="co-authors-heading">Co-Authors</h4>
              {article.coAuthors.map(ca => (
                <div key={ca._id} className="author-card co-author-card">
                  <div className="author-avatar">
                    {ca.profile?.profilePicture || ca.profile?.avatar ? (
                      <img
                        src={ca.profile.profilePicture || ca.profile.avatar}
                        alt={ca.profile?.firstName || 'Co-Author'}
                      />
                    ) : (
                      <span>{(ca.profile?.firstName?.[0] || 'C').toUpperCase()}</span>
                    )}
                  </div>
                  <div className="author-details">
                    <h4>
                      <Link to={`/profile/${ca._id}`} className="author-name-link">
                        {ca.profile?.firstName
                          ? `${ca.profile.firstName} ${ca.profile.lastName || ''}`
                          : ca.email}
                      </Link>
                    </h4>
                    <span className="author-unique-id">
                      <Award size={13} /> PI‑{ca._id?.slice(-8)?.toUpperCase()}
                    </span>
                    <p className="author-bio">{ca.profile?.bio || 'Planning professional contributing to Planning Insights.'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Readings */}
        {recommendedArticles.length > 0 && (
          <section className="recommended-readings slide-up">
            <h3 className="recommended-heading">
              <BookOpen size={20} /> Recommended Readings
            </h3>
            <div className="recommended-grid">
              {recommendedArticles.map(rec => (
                <Link
                  key={rec._id}
                  to={`/news/article/${rec._id}`}
                  className="recommended-card"
                >
                  {rec.featuredImage && (
                    <div className="recommended-card-image">
                      <img src={rec.featuredImage} alt={rec.title} />
                    </div>
                  )}
                  <div className="recommended-card-body">
                    <span className="recommended-category">{rec.category}</span>
                    <h4 className="recommended-title">{rec.title}</h4>
                    {rec.excerpt && (
                      <p className="recommended-excerpt">
                        {rec.excerpt.slice(0, 100)}{rec.excerpt.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <div className="recommended-meta">
                      <Clock size={13} />
                      <span>{rec.readingTime || 5} min read</span>
                      {rec.author && (
                        <span className="recommended-author">
                          by {rec.author.profile?.firstName || rec.author.email}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        {showComments && (
          <section className="comments-section slide-up">
            <h3>💬 Comments ({article.comments?.length || 0})</h3>

            {isAuthenticated ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="4"
                />
                <button type="submit">Post Comment</button>
              </form>
            ) : (
              <div className="login-required">
                <p>
                  <Link to="/login">Login</Link> to join the conversation
                </p>
              </div>
            )}

            <div className="comments-list">
              {article.comments?.map((comment) => (
                <div key={comment._id} className="comment fade-in">
                  <div className="comment-header">
                    <strong>{comment.user?.profile?.firstName || comment.user?.email}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="modal-overlay" onClick={() => setShowFlagModal(false)}>
          <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚩 Report Article</h3>
              <button onClick={() => setShowFlagModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <label>
                Reason for reporting:
                <select value={flagReason} onChange={(e) => setFlagReason(e.target.value)}>
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="copyright">Copyright Violation</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Additional details (optional):
                <textarea
                  value={flagDescription}
                  onChange={(e) => setFlagDescription(e.target.value)}
                  rows="4"
                  placeholder="Provide more context..."
                />
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowFlagModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleFlag}>Submit Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top bounce-in" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default ArticleDetail;
