import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { newsroomAPI } from '../../../services/api/newsroom';
import {
  ArrowLeft,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Flag,
  MessageSquare,
  User,
  Download
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';

/**
 * Article Detail Component
 * Displays full article content with interactions and related articles
 */
const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [recommended, setRecommended] = useState([]);

  // API hooks
  const [fetchArticleApi] = useApi(newsroomAPI.getArticle);
  const [fetchRelatedApi] = useApi(newsroomAPI.getRelatedArticles);
  const [fetchCommentsApi] = useApi(newsroomAPI.getArticleComments);
  const [addCommentApi] = useApi(newsroomAPI.addComment);
  const [likeArticleApi] = useApi(newsroomAPI.likeArticle);
  const [fetchRecommendedApi] = useApi(newsroomAPI.getRecommended);
  const [flagArticleApi] = useApi(newsroomAPI.flagArticle);

  /**
   * Load article data
   */
  useEffect(() => {
    loadArticleData();
  }, [articleId]);

  const loadArticleData = async () => {
    try {
      setLoading(true);
      const [articleData, relatedData, commentsData] = await Promise.all([
        fetchArticleApi(articleId),
        fetchRelatedApi(articleId),
        fetchCommentsApi(articleId)
      ]);

      if (articleData) {
        setArticle(articleData);
        setAuthor(articleData.author);
        
        // Check if user has access to premium content
        if (articleData.isPremium && !user?.subscription?.isActive) {
          setShowFullContent(false);
        } else {
          setShowFullContent(true);
        }
      }

      if (relatedData) {
        setRelatedArticles(relatedData);
      }

      if (commentsData) {
        setComments(commentsData);
      }
    } catch (error) {
      showNotification('Failed to load article', 'error');
    } finally {
      setLoading(false);
    }
  };

  // load recommended readings
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const rec = await fetchRecommendedApi(articleId);
        if (rec) setRecommended(rec);
      } catch (err) {
        // ignore
      }
    };

    if (articleId) loadRecommended();
  }, [articleId]);

  /**
   * Handle article like/dislike
   */
  const handleLike = async (action) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to interact with articles', 'error');
      return;
    }

    try {
      const result = await likeArticleApi(articleId, action);

      if (result) {
        setArticle(prev => ({
          ...prev,
          likes: result.likes,
          dislikes: result.dislikes,
          userReaction: action
        }));
      }
    } catch (error) {
      // Error handled by useApi hook
    }
  };

  /**
   * Handle comment submission
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      showNotification('Please enter a comment', 'error');
      return;
    }

    if (!isAuthenticated) {
      showNotification('Please sign in to comment', 'error');
      return;
    }

    setSubmittingComment(true);

    try {
      const newComment = await addCommentApi(articleId, {
        content: commentText,
        isAnonymous: false
      });

      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        showNotification('Comment added successfully', 'success');
        
        // Update comment count
        setArticle(prev => ({
          ...prev,
          commentCount: prev.commentCount + 1
        }));
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSubmittingComment(false);
    }
  };

  /**
   * Handle article sharing
   */
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this article: ${article.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        showNotification('Link copied to clipboard', 'success');
      } catch (error) {
        showNotification('Failed to copy link', 'error');
      }
    }
  };

  const handleFlag = async (reason) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to flag content', 'error');
      return;
    }

    try {
      await flagArticleApi(articleId, { reason });
      showNotification('Article flagged for review', 'success');
    } catch (err) {
      showNotification('Failed to flag article', 'error');
    }
  };

  /**
   * Handle bookmark
   */
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to bookmark articles', 'error');
      return;
    }

    // Toggle bookmark
    showNotification(
      article.isBookmarked ? 'Article removed from bookmarks' : 'Article bookmarked',
      'success'
    );
  };

  /**
   * Format relative time
   */
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  /**
   * Render article content with premium restrictions
   */
  const renderArticleContent = () => {
    if (article.isPremium && !showFullContent) {
      return (
        <div className="premium-content-restricted">
          <div className="premium-overlay">
            <div className="premium-message">
              <h3>Premium Content</h3>
              <p>This article is available to premium subscribers only.</p>
              <div className="premium-actions">
                <button className="btn btn-primary">
                  Subscribe Now
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/subscription')}
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
          <div className="content-preview">
            <p>{article.excerpt}</p>
          </div>
        </div>
      );
    }

    // If user is not authenticated, show first & last paragraphs only, blur the middle
    if (!isAuthenticated && !showFullContent) {
      // Split paragraphs
      const tmp = document.createElement('div');
      tmp.innerHTML = article.content || '';
      const paragraphs = Array.from(tmp.querySelectorAll('p')).map(p => p.innerHTML).filter(Boolean);

      const first = paragraphs[0] || '';
      const last = paragraphs[paragraphs.length - 1] || '';

      return (
        <div
          className="article-content content-protect"
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="preview-paragraph" dangerouslySetInnerHTML={{ __html: first }} />
          {paragraphs.length > 2 && (
            <div className="blurred" aria-hidden>
              {/* show blurred middle content */}
              <div dangerouslySetInnerHTML={{ __html: paragraphs.slice(1, paragraphs.length - 1).map(p=>`<p>${p}</p>`).join('') }} />
            </div>
          )}
          {last && <div className="preview-paragraph" dangerouslySetInnerHTML={{ __html: last }} />}

          <div className="signin-prompt">
            <p>Sign in to read the full article and interact with content.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      );
    }

    return (
      <div className="article-content content-protect"
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {article.content}
        
        {article.attachments && article.attachments.length > 0 && (
          <div className="article-attachments">
            <h4>Attachments</h4>
            <div className="attachments-list">
              {article.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <FileText size={16} />
                  <span>{attachment.name}</span>
                  <button className="btn btn-outline btn-small">
                    <Download size={14} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Citation / reference link */}
        {article.referenceUrl && (
          <div className="article-citation">
            <strong>Reference:</strong> <a href={article.referenceUrl} target="_blank" rel="noopener noreferrer">{article.referenceUrl}</a>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render comments section
   */
  const renderComments = () => (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Comments ({article.commentCount})</h3>
      </div>

      {/* Add Comment */}
      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="add-comment">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="comment-textarea"
            rows="3"
          />
          <div className="comment-actions">
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="btn btn-primary"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Please sign in to leave a comment.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <MessageSquare size={48} />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-author">
                  {comment.author.profilePicture ? (
                    <img 
                      src={comment.author.profilePicture} 
                      alt={comment.author.name}
                      className="author-avatar"
                    />
                  ) : (
                    <div className="author-avatar placeholder">
                      <User size={16} />
                    </div>
                  )}
                  <div className="author-info">
                    <span className="author-name">
                      {comment.isAnonymous ? 'Anonymous' : comment.author.name}
                    </span>
                    <span className="comment-time">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
              <div className="comment-actions">
                <button className="action-btn">
                  <ThumbsUp size={14} />
                  <span>{comment.likes}</span>
                </button>
                <button className="action-btn">
                  <ThumbsDown size={14} />
                  <span>{comment.dislikes}</span>
                </button>
                <button className="action-btn">
                  <Flag size={14} />
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  /**
   * Render related articles
   */
  const renderRelatedArticles = () => (
    <div className="related-articles">
      <h3>Related Articles</h3>
      <div className="related-grid">
        {relatedArticles.slice(0, 3).map(relatedArticle => (
          <div key={relatedArticle.id} className="related-article">
            <div className="related-image">
              <img src={relatedArticle.thumbnail} alt={relatedArticle.title} />
            </div>
            <div className="related-content">
              <h4>
                <a href={`/news/${relatedArticle.id}`}>{relatedArticle.title}</a>
              </h4>
              <p>{relatedArticle.excerpt}</p>
              <div className="related-meta">
                <span>{formatRelativeTime(relatedArticle.publishedAt)}</span>
                <span>•</span>
                <span>{relatedArticle.readTime} min read</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="article-detail-loading">
        <Loader size="lg" text="Loading article..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-not-found">
        <div className="not-found-content">
          <h2>Article Not Found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/news')}
          >
            Back to Newsroom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="container">
        {/* Back Navigation */}
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Back to Newsroom
        </button>

        {/* Article Header */}
        <div className="article-header">
          <div className="article-meta">
            <div className="category-badge">{article.category}</div>
            {article.isPremium && (
              <div className="premium-badge">Premium</div>
            )}
            <span className="publish-date">
              <Calendar size={16} />
              {formatRelativeTime(article.publishedAt)}
            </span>
            <span className="read-time">{article.readTime} min read</span>
            <span className="view-count">
              <Eye size={16} />
              {article.viewCount} views
            </span>
          </div>

          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>

          {/* Author Info */}
          <div className="author-info">
            <div className="author-avatar">
              {author.profilePicture ? (
                <img src={author.profilePicture} alt={author.name} />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="author-details">
              <div className="author-name">
                {author.name}
                {author.uniqueCode && (
                  <span className="author-code">({author.uniqueCode})</span>
                )}
              </div>
              <div className="author-title">{author.title}</div>
            </div>
          </div>
          {/* Co-authors (if any) */}
          {article.coAuthors && article.coAuthors.length > 0 && (
            <div className="coauthors-list">
              <h4>Co-authors</h4>
              <div className="coauthors">
                {article.coAuthors.map((c, i) => (
                  <div key={i} className="coauthor-item">
                    <a href={c.portfolioUrl || '#'} target="_blank" rel="noopener noreferrer">
                      <img src={c.profilePicture} alt={c.name} className="author-avatar small" />
                    </a>
                    <div className="coauthor-meta">
                      <a href={c.portfolioUrl || '#'} target="_blank" rel="noopener noreferrer">{c.name}</a>
                      {c.uniqueCode && <span className="author-code">({c.uniqueCode})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Article Hero Image */}
        {article.heroImage && (
          <div className="article-hero">
            <img src={article.heroImage} alt={article.title} />
            {article.imageCaption && (
              <div className="image-caption">{article.imageCaption}</div>
            )}
          </div>
        )}

        {/* Article Content and Sidebar */}
        <div className="article-layout">
          {/* Main Content */}
          <div className="article-main">
            {/* Article Actions */}
            <div className="article-actions">
              <div className="reaction-buttons">
                <button
                  className={`reaction-btn like ${article.userReaction === 'like' ? 'active' : ''}`}
                  onClick={() => handleLike('like')}
                >
                  <ThumbsUp size={20} />
                  <span>{article.likes}</span>
                </button>
                <button
                  className={`reaction-btn dislike ${article.userReaction === 'dislike' ? 'active' : ''}`}
                  onClick={() => handleLike('dislike')}
                >
                  <ThumbsDown size={20} />
                  <span>{article.dislikes}</span>
                </button>
              </div>

              <div className="action-buttons">
                <button 
                  className="action-btn"
                  onClick={handleBookmark}
                >
                  <Bookmark 
                    size={20} 
                    fill={article.isBookmarked ? 'currentColor' : 'none'}
                  />
                  {article.isBookmarked ? 'Saved' : 'Save'}
                </button>
                <button 
                  className="action-btn"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                  Share
                </button>
                <button className="action-btn">
                  <Flag size={20} />
                  Report
                </button>
              </div>
            </div>

            {/* Article Content */}
            {renderArticleContent()}

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                <h4>Tags</h4>
                <div className="tags-list">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            {renderComments()}
          </div>

          {/* Sidebar */}
          <div className="article-sidebar">
            {/* Author Bio */}
            <div className="author-bio-card">
              <h4>About the Author</h4>
              <div className="author-bio">
                <div className="author-avatar large">
                  {author.profilePicture ? (
                    <img src={author.profilePicture} alt={author.name} />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div className="author-info">
                  <h5>{author.name}</h5>
                  <p className="author-title">{author.title}</p>
                  <p className="author-bio-text">{author.bio}</p>
                  <div className="author-stats">
                    <div className="stat">
                      <strong>{author.articleCount}</strong>
                      <span>Articles</span>
                    </div>
                    <div className="stat">
                      <strong>{author.followerCount}</strong>
                      <span>Followers</span>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-small">
                    Follow Author
                  </button>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            {article.tableOfContents && (
              <div className="toc-card">
                <h4>Table of Contents</h4>
                <nav className="toc-nav">
                  {article.tableOfContents.map((item, index) => (
                    <a 
                      key={index}
                      href={`#${item.id}`}
                      className="toc-item"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="newsletter-card">
              <h4>Stay Updated</h4>
              <p>Get the latest articles and insights delivered to your inbox.</p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                />
                <button type="submit" className="btn btn-primary btn-small">
                  Subscribe
                </button>
              </form>
            </div>

            {/* Recommended Readings */}
            {recommended && recommended.length > 0 && (
              <div className="recommended-card">
                <h4>Recommended For You</h4>
                <div className="recommended-list">
                  {recommended.slice(0,5).map(rec => (
                    <a key={rec.id} href={`/news/articles/${rec.id}`} className="recommended-item">
                      <div className="rec-title">{rec.title}</div>
                      <div className="rec-meta">{rec.author?.name} • {new Date(rec.publishedAt).toLocaleDateString()}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && renderRelatedArticles()}
      </div>
    </div>
  );
};

export default ArticleDetail;