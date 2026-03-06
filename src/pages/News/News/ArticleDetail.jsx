import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { newsroomAPI } from '../../../services/api/newsroom';
import useArticleSocket from '../../../hooks/useArticleSocket';
import { ThumbsUp, ThumbsDown, MessageCircle, Flag, Share2, Eye, Calendar, User, X, ChevronUp, BookOpen, Clock, Award, Lock, Send, Trash2, CornerDownRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ArticleDetail.css';

/** Format a timestamp as relative time (e.g. "2 hours ago") */
const relativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ArticleDetail = () => {
  const { articleId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Real-time socket connection for this article
  const { liveStats, newComment, deletedCommentId } = useArticleSocket(articleId);

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
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [replyTexts, setReplyTexts] = useState({}); // { [commentId]: string }

  useEffect(() => {
    loadArticle();
    loadStats();
  }, [articleId]);

  // Seed userInteractions once article loads — check if current user already liked/disliked
  useEffect(() => {
    if (!article || !user) return;
    const uid = user._id?.toString() || user.id?.toString();
    const liked = (article.likes || []).some(id => id?.toString() === uid);
    const disliked = (article.dislikes || []).some(id => id?.toString() === uid);
    setUserInteractions({ liked, disliked });
  }, [article?._id, user?._id]);

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

  // ─── Real-time socket updates ───────────────────────────────────────

  // Sync live like/dislike counts from socket (updates ALL viewers in real-time)
  useEffect(() => {
    if (!liveStats) return;
    setStats(prev => ({
      ...prev,
      likesCount: liveStats.likesCount,
      likes: liveStats.likesCount,
      dislikesCount: liveStats.dislikesCount,
      dislikes: liveStats.dislikesCount,
    }));
  }, [liveStats]);

  // Append incoming comment in real-time
  useEffect(() => {
    if (!newComment) return;
    setArticle(prev => {
      if (!prev) return prev;
      // Avoid duplicates (our own comment may have already been added by loadArticle)
      const alreadyExists = prev.comments?.some(c => c._id === newComment._id);
      if (alreadyExists) return prev;
      return { ...prev, comments: [...(prev.comments || []), newComment] };
    });
  }, [newComment]);

  // Remove deleted comment in real-time
  useEffect(() => {
    if (!deletedCommentId) return;
    setArticle(prev => {
      if (!prev) return prev;
      return { ...prev, comments: (prev.comments || []).filter(c => c._id !== deletedCommentId) };
    });
  }, [deletedCommentId]);

  // ─── Content protection ──────────────────────────────────────────────────

  useEffect(() => {
    if (!article?.preventCopy) return;
    const block = (e) => e.preventDefault();
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('contextmenu', block);
    document.addEventListener('selectstart', block);
    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('selectstart', block);
    };
  }, [article?.preventCopy]);

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
    if (!isAuthenticated) { toast.error('Please login to like articles'); return; }
    // Optimistic update — instant visual feedback
    const wasLiked = userInteractions.liked;
    const wasDisliked = userInteractions.disliked;
    setUserInteractions({ liked: !wasLiked, disliked: false });
    setStats(prev => ({
      ...prev,
      likesCount: (prev?.likesCount ?? 0) + (wasLiked ? -1 : 1),
      dislikesCount: wasDisliked ? Math.max(0, (prev?.dislikesCount ?? 0) - 1) : (prev?.dislikesCount ?? 0),
    }));
    try {
      const response = await newsroomAPI.likeArticle(articleId);
      // Reconcile with authoritative server state
      setUserInteractions({ liked: response.data.userLiked, disliked: response.data.userDisliked });
      setStats(prev => ({ ...prev, likesCount: response.data.likesCount, dislikesCount: response.data.dislikesCount }));
    } catch (error) {
      // Revert on failure
      setUserInteractions({ liked: wasLiked, disliked: wasDisliked });
      loadStats();
      toast.error('Failed to like article');
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) { toast.error('Please login to dislike articles'); return; }
    const wasLiked = userInteractions.liked;
    const wasDisliked = userInteractions.disliked;
    setUserInteractions({ liked: false, disliked: !wasDisliked });
    setStats(prev => ({
      ...prev,
      dislikesCount: (prev?.dislikesCount ?? 0) + (wasDisliked ? -1 : 1),
      likesCount: wasLiked ? Math.max(0, (prev?.likesCount ?? 0) - 1) : (prev?.likesCount ?? 0),
    }));
    try {
      const response = await newsroomAPI.dislikeArticle(articleId);
      setUserInteractions({ liked: response.data.userLiked, disliked: response.data.userDisliked });
      setStats(prev => ({ ...prev, likesCount: response.data.likesCount, dislikesCount: response.data.dislikesCount }));
    } catch (error) {
      setUserInteractions({ liked: wasLiked, disliked: wasDisliked });
      loadStats();
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
      await newsroomAPI.addComment(articleId, { content: comment });
      setComment('');
      // Socket pushes the new comment in real-time — no reload needed
      toast.success('Comment posted');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await newsroomAPI.deleteComment(articleId, commentId);
      setArticle(prev => ({
        ...prev,
        comments: (prev.comments || []).filter(c => c._id !== commentId)
      }));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to reply'); return; }
    const replyContent = replyTexts[commentId]?.trim();
    if (!replyContent) { toast.error('Reply cannot be empty'); return; }
    try {
      const res = await newsroomAPI.addReply(articleId, commentId, replyContent);
      const newReply = res.data?.reply;
      setArticle(prev => ({
        ...prev,
        comments: (prev.comments || []).map(c =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      }));
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
      setReplyingTo(null);
      toast.success('Reply posted');
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await newsroomAPI.deleteReply(articleId, commentId, replyId);
      setArticle(prev => ({
        ...prev,
        comments: (prev.comments || []).map(c =>
          c._id === commentId
            ? { ...c, replies: (c.replies || []).filter(r => r._id !== replyId) }
            : c
        )
      }));
      toast.success('Reply deleted');
    } catch (error) {
      toast.error('Failed to delete reply');
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
      <div className="article-skeleton-page">
        <div className="skeleton-reading-bar" />
        <div className="article-skeleton-container">
          {/* Header card skeleton */}
          <div className="sk-header-card">
            <div className="skeleton sk-breadcrumb" />
            <div className="skeleton sk-title" />
            <div className="skeleton sk-title sk-title-short" />
            <div className="sk-meta-row">
              <div className="skeleton sk-meta-chip" />
              <div className="skeleton sk-meta-chip" />
              <div className="skeleton sk-meta-chip sk-meta-chip-sm" />
            </div>
          </div>
          {/* Author panel skeleton */}
          <div className="sk-author-panel">
            <div className="skeleton sk-avatar" />
            <div className="sk-author-text">
              <div className="skeleton sk-author-name" />
              <div className="skeleton sk-author-id" />
            </div>
          </div>
          {/* Body card skeleton */}
          <div className="sk-body-card">
            <div className="skeleton sk-featured-img" />
            <div className="sk-content">
              {[1,2,3].map(i => (
                <div key={i} className="sk-paragraph">
                  <div className="skeleton sk-line sk-line-full" />
                  <div className="skeleton sk-line sk-line-full" />
                  <div className="skeleton sk-line sk-line-3q" />
                </div>
              ))}
              <div className="skeleton sk-heading" />
              {[1,2].map(i => (
                <div key={i} className="sk-paragraph">
                  <div className="skeleton sk-line sk-line-full" />
                  <div className="skeleton sk-line sk-line-half" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-error-page">
        <div className="article-error-box">
          <div className="article-error-icon">📄</div>
          <h2>Article not found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/news')}>← Back to Newsroom</button>
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
              {article.coAuthors?.filter(ca => ca.user).length > 0 && (
                <span className="co-authors">
                  & {article.coAuthors.filter(ca => ca.user).map(ca => ca.user?.profile?.firstName ? `${ca.user.profile.firstName} ${ca.user.profile.lastName || ''}`.trim() : ca.email).join(', ')}
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
              {article.coAuthors?.filter(ca => ca.user).map(ca => (
                <span key={ca.user._id} className="co-author-chip">
                  &amp; <Link to={`/profile/${ca.user._id}`}>
                    {ca.user.profile?.firstName ? `${ca.user.profile.firstName} ${ca.user.profile.lastName || ''}`.trim() : ca.email}
                  </Link>
                </span>
              ))}
            </div>
            <span className="author-pi-id">
              <Award size={13} /> PI‑{article.author._id?.slice(-8)?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Body Card: image + content */}
        <div className="article-body-card">
          {/* Featured Image — only render when URL exists */}
          {article.featuredImage && (
            <div className="article-featured-image">
              <img
                src={article.featuredImage}
                alt={article.title}
                onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="article-inner">
            {/* Article Excerpt */}
            {article.excerpt && (
              <div className="article-excerpt">
                <p>{article.excerpt}</p>
              </div>
            )}

            {/* Article Content */}
            <div className={`article-content${article.preventCopy ? ' no-select' : ''}`}>
              {(() => {
                const PRIVILEGED = ['admin', 'moderator', 'premium', 'editor', 'chiefeditor'];
                const isRestricted = article.subscriptionOnly || article.isPremium;
                const canReadFull = !isRestricted || (isAuthenticated && PRIVILEGED.includes(user?.role));

                if (!isAuthenticated) {
                  return (
                    <div className="blurred-content">
                      <div dangerouslySetInnerHTML={{ __html: getBlurredContent() }} />
                      <div className="login-prompt">
                        <h3>🔒 Members Only</h3>
                        <p>Login to read the full article</p>
                        <button onClick={() => navigate('/login')}>Login / Sign Up</button>
                      </div>
                    </div>
                  );
                }

                if (!canReadFull) {
                  return (
                    <div className="blurred-content">
                      <div dangerouslySetInnerHTML={{ __html: getBlurredContent() }} />
                      <div className="login-prompt premium-gate">
                        <Lock size={32} />
                        <h3>Premium Content</h3>
                        <p>This article is available to Premium members only.</p>
                        <button onClick={() => navigate('/upgrade')}>Upgrade to Premium</button>
                      </div>
                    </div>
                  );
                }

                return (
                  article.preventScreenshot
                    ? <div className="article-watermark-wrap">
                        <div
                          className="article-watermark"
                          data-watermark={user?.email || 'Planning Insights'}
                        />
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                      </div>
                    : <div dangerouslySetInnerHTML={{ __html: article.content }} />
                );
              })()}
            </div>
          </div>

          {/* Interaction Bar — inside body card */}
          <div className="interaction-bar">
          <button
            className={`interaction-btn ${userInteractions.liked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp size={20} />
            <span>{stats?.likesCount ?? stats?.likes ?? 0}</span>
          </button>

          <button
            className={`interaction-btn ${userInteractions.disliked ? 'active' : ''}`}
            onClick={handleDislike}
          >
            <ThumbsDown size={20} />
            <span>{stats?.dislikesCount ?? stats?.dislikes ?? 0}</span>
          </button>

          <button
            className="interaction-btn"
            onClick={() => document.querySelector('.comments-section')?.scrollIntoView({ behavior: 'smooth' })}
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

          {/* Citation Block — always shown, auto-generated if not set */}
          {(() => {
            const authorName = article.author?.profile?.firstName
              ? `${article.author.profile.firstName} ${article.author.profile.lastName || ''}`.trim()
              : article.author?.email?.split('@')[0] || 'Author';
            const year = new Date(article.publishedAt || article.createdAt).getFullYear();
            const doi = article.doi ? ` DOI: ${article.doi}` : '';
            const citation = article.citationText ||
              `${authorName} (${year}). ${article.title}. Planning Insights. Retrieved from ${window.location.href}${doi}`;
            return (
              <div className="citation-block">
                <h4>📚 Cite This Article</h4>
                <p className="citation-text">{citation}</p>
                <button
                  className="citation-copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(citation);
                    toast.success('Citation copied to clipboard');
                  }}
                >
                  📋 Copy Citation
                </button>
              </div>
            );
          })()}

          {/* Author Section - Bottom */}
          <section className="author-section">
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
          {article.coAuthors?.filter(ca => ca.user).length > 0 && (
            <div className="co-authors-section">
              <h4 className="co-authors-heading">Co-Authors</h4>
              {article.coAuthors.filter(ca => ca.user).map(ca => (
                <div key={ca.user._id} className="author-card co-author-card">
                  <div className="author-avatar">
                    {ca.user.profile?.avatar ? (
                      <img
                        src={ca.user.profile.avatar}
                        alt={ca.user.profile?.firstName || 'Co-Author'}
                      />
                    ) : (
                      <span>{(ca.user.profile?.firstName?.[0] || 'C').toUpperCase()}</span>
                    )}
                  </div>
                  <div className="author-details">
                    <h4>
                      <Link to={`/profile/${ca.user._id}`} className="author-name-link">
                        {ca.user.profile?.firstName
                          ? `${ca.user.profile.firstName} ${ca.user.profile.lastName || ''}`.trim()
                          : ca.email}
                      </Link>
                    </h4>
                    <span className="author-unique-id">
                      <Award size={13} /> PI‑{ca.user._id?.toString().slice(-8).toUpperCase()}
                    </span>
                    <p className="author-bio">{ca.user.profile?.bio || 'Planning professional contributing to Planning Insights.'}</p>
                    <Link to={`/profile/${ca.user._id}`} className="view-profile">View Full Profile →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          </section>

          {/* Recommended Readings */}
          {recommendedArticles.length > 0 && (
          <section className="recommended-readings">
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

          {/* Comments Section — professional social-media style */}
          <section className="comments-section">
            {/* Header */}
            <div className="comments-header">
              <h3 className="comments-title">
                <MessageCircle size={20} />
                <span>Comments</span>
                <span className="comments-count-badge">{article.comments?.length || 0}</span>
              </h3>
            </div>

            {/* Compose box */}
            {isAuthenticated ? (
              <form className="comment-compose" onSubmit={handleAddComment}>
                <div className="compose-avatar">
                  {user?.profile?.profilePicture || user?.profile?.avatar ? (
                    <img src={user.profile.profilePicture || user.profile.avatar} alt={user.profile?.firstName || 'You'} />
                  ) : (
                    <span>{(user?.profile?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                  )}
                </div>
                <div className="compose-right">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment…"
                    rows="3"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment(e);
                    }}
                  />
                  <div className="compose-actions">
                    <span className="compose-hint">Ctrl+Enter to post</span>
                    <button type="submit" className="compose-submit" disabled={!comment.trim()}>
                      <Send size={15} /> Post
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="comments-login-prompt">
                <MessageCircle size={20} />
                <span><Link to="/login">Sign in</Link> to join the conversation</span>
              </div>
            )}

            {/* Comments list */}
            <div className="comments-list">
              {(article.comments?.length || 0) === 0 ? (
                <div className="comments-empty">
                  <MessageCircle size={32} />
                  <p>Be the first to comment</p>
                </div>
              ) : (
                [...(article.comments || [])].reverse().map((c) => {
                  // Support both populated user object and raw ObjectId
                  const commentUser = c.user;
                  const commentUserId = commentUser?._id?.toString() || commentUser?.toString();
                  const commenterName = commentUser?.profile?.firstName
                    ? `${commentUser.profile.firstName} ${commentUser.profile.lastName || ''}`.trim()
                    : commentUser?.email?.split('@')[0] || 'Anonymous';
                  const commenterInitial = commenterName[0]?.toUpperCase() || 'A';
                  const avatar = commentUser?.profile?.profilePicture || commentUser?.profile?.avatar;
                  const currentUserId = user?._id?.toString() || user?.id?.toString();
                  const isOwn = !!currentUserId && commentUserId === currentUserId;
                  const piId = commentUserId ? `PI-${commentUserId.slice(-6).toUpperCase()}` : null;

                  return (
                    <div key={c._id} className={`comment-item fade-in${isOwn ? ' comment-own' : ''}`}>
                      <div className="comment-avatar">
                        {avatar ? (
                          <img src={avatar} alt={commenterName} />
                        ) : (
                          <span>{commenterInitial}</span>
                        )}
                      </div>
                      <div className="comment-body">
                        <div className="comment-meta">
                          <Link to={commentUserId ? `/profile/${commentUserId}` : '#'} className="comment-author-name">
                            {commenterName}
                          </Link>
                          {piId && <span className="comment-pi-id">{piId}</span>}
                          <span className="comment-time">{relativeTime(c.createdAt)}</span>
                          <div className="comment-actions-inline">
                            {isAuthenticated && (
                              <button
                                className="comment-reply-btn"
                                onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                                title="Reply"
                              >
                                <CornerDownRight size={13} /> Reply
                              </button>
                            )}
                            {isOwn && (
                              <button
                                className="comment-delete-btn"
                                onClick={() => handleDeleteComment(c._id)}
                                title="Delete comment"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="comment-text">{c.content}</p>

                        {/* Replies */}
                        {(c.replies?.length > 0) && (
                          <div className="replies-list">
                            {c.replies.map(r => {
                              const replyUser = r.user;
                              const replyUserId = replyUser?._id?.toString() || replyUser?.toString();
                              const replyName = replyUser?.profile?.firstName
                                ? `${replyUser.profile.firstName} ${replyUser.profile.lastName || ''}`.trim()
                                : replyUser?.email?.split('@')[0] || 'Anonymous';
                              const replyInitial = replyName[0]?.toUpperCase() || 'A';
                              const replyAvatar = replyUser?.profile?.profilePicture || replyUser?.profile?.avatar;
                              const isOwnReply = !!currentUserId && replyUserId === currentUserId;
                              return (
                                <div key={r._id} className={`reply-item${isOwnReply ? ' reply-own' : ''}`}>
                                  <div className="reply-avatar">
                                    {replyAvatar ? (
                                      <img src={replyAvatar} alt={replyName} />
                                    ) : (
                                      <span>{replyInitial}</span>
                                    )}
                                  </div>
                                  <div className="reply-body">
                                    <div className="reply-meta">
                                      <Link to={replyUserId ? `/profile/${replyUserId}` : '#'} className="reply-author-name">
                                        {replyName}
                                      </Link>
                                      <span className="comment-time">{relativeTime(r.createdAt)}</span>
                                      {isOwnReply && (
                                        <button className="comment-delete-btn" onClick={() => handleDeleteReply(c._id, r._id)} title="Delete reply">
                                          <Trash2 size={12} />
                                        </button>
                                      )}
                                    </div>
                                    <p className="reply-text">{r.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Reply compose */}
                        {replyingTo === c._id && (
                          <form className="reply-compose" onSubmit={(e) => handleAddReply(e, c._id)}>
                            <textarea
                              value={replyTexts[c._id] || ''}
                              onChange={(e) => setReplyTexts(prev => ({ ...prev, [c._id]: e.target.value }))}
                              placeholder={`Reply to ${commenterName}…`}
                              rows="2"
                              autoFocus
                              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddReply(e, c._id); }}
                            />
                            <div className="reply-compose-actions">
                              <button type="button" className="reply-cancel-btn" onClick={() => setReplyingTo(null)}>Cancel</button>
                              <button type="submit" className="compose-submit" disabled={!replyTexts[c._id]?.trim()}>
                                <Send size={13} /> Reply
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>{/* end article-body-card */}
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
