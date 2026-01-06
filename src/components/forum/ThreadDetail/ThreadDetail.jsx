import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { forumAPI } from '../../../services/api/forum';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Bookmark,
  User,
  Clock,
  Eye,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  Reply,
  X,
  ChevronUp,
  Award,
  Heart,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Image,
  Film,
  Link as LinkIcon
} from 'lucide-react';
import Loader from '../../../components/common/Loader/Loader';
import Modal from '../../../components/common/Modal/Modal';
import './ThreadDetail.css';

// Mock thread data for fallback when API fails
const MOCK_THREADS = {
  '1': {
    id: '1',
    title: 'How to improve project management skills?',
    content: 'Looking for advice on improving my project management abilities and leadership qualities in the workplace. Any recommendations for courses or books?\n\nI have been working as a project coordinator for the past 2 years, and I feel like I need to develop my skills further to move into a project manager role. Specifically, I am interested in:\n\n1. Leadership and team management\n2. Budgeting and resource allocation\n3. Risk management strategies\n4. Stakeholder communication\n\nWhat certifications, courses, or books would you recommend? Also, any practical tips for someone looking to transition from coordinator to manager?',
    forumName: 'Career Advice',
    author: { id: '1', name: 'John Doe', points: 245, avatar: null },
    isQuestion: true,
    isAnonymous: false,
    tags: ['career', 'skills', 'management', 'leadership'],
    upvotes: 45,
    downvotes: 3,
    commentCount: 12,
    viewCount: 234,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  '2': {
    id: '2',
    title: 'Best practices for remote team collaboration',
    content: 'What tools and strategies work best for remote teams? Looking to improve our team productivity and communication.\n\nOur team has been working remotely for 6 months now, and we are facing some challenges with collaboration and keeping everyone aligned. We currently use Slack and Zoom, but I feel like we need better project management tools.\n\nWhat has worked well for your remote teams?',
    forumName: 'General Discussion',
    author: { id: '2', name: 'Jane Smith', points: 189, avatar: null },
    isQuestion: false,
    isAnonymous: false,
    isPinned: true,
    tags: ['remote', 'collaboration', 'tools', 'productivity'],
    upvotes: 78,
    downvotes: 5,
    commentCount: 23,
    viewCount: 456,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  '3': {
    id: '3',
    title: 'Need help with React state management',
    content: 'Struggling with complex state in my React application. Should I use Context API or Redux for a medium-sized app?\n\nMy application has about 20-25 components and I am finding prop drilling becoming a problem. I have heard good things about both Context API and Redux, but I am not sure which one would be better for my use case.\n\nAny advice would be appreciated!',
    forumName: 'Technical Help',
    author: { id: '3', name: 'Anonymous', points: 0, avatar: null },
    isQuestion: true,
    isAnonymous: true,
    tags: ['react', 'javascript', 'help', 'state-management'],
    upvotes: 34,
    downvotes: 2,
    commentCount: 18,
    viewCount: 289,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  '4': {
    id: '4',
    title: 'Completed my first full-stack project!',
    content: 'Just finished building a complete e-commerce platform using MERN stack. Would love to get feedback from the community.\n\nThe project took me about 3 months to complete, and I learned so much during the process. It includes user authentication, product catalog, shopping cart, payment integration with Stripe, and an admin dashboard.\n\nTech stack:\n- MongoDB for database\n- Express.js for backend\n- React for frontend\n- Node.js runtime\n\nWould appreciate any feedback or suggestions for improvements!',
    forumName: 'Project Showcase',
    author: { id: '4', name: 'Alex Kumar', points: 156, avatar: null },
    isQuestion: false,
    isAnonymous: false,
    tags: ['showcase', 'mern', 'fullstack', 'project'],
    upvotes: 92,
    downvotes: 1,
    commentCount: 15,
    viewCount: 378,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
};

/**
 * Enhanced Thread Detail Component
 * Features:
 * - Like/Dislike functionality
 * - Comment system with nested replies
 * - Share functionality
 * - Report functionality
 * - Bookmark/Save
 * - Media support (images, videos, GIFs)
 * - Points system
 * - Reminders
 */
const ThreadDetail = () => {
  const { id: threadId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // Mock user for testing when not authenticated
  const currentUser = user || {
    id: 'temp_user',
    name: 'Guest User',
    points: 0,
    avatar: null
  };

  // State management
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [relatedThreads, setRelatedThreads] = useState([]);

  // Refs
  const commentInputRef = useRef(null);

  // API hooks
  const { execute: fetchThreadApi } = useApi(forumAPI.getThread);
  const { execute: fetchCommentsApi } = useApi(forumAPI.getThreadComments);
  const { execute: addCommentApi } = useApi(forumAPI.addComment);
  const { execute: voteApi } = useApi(forumAPI.vote);
  const { execute: deleteCommentApi } = useApi(forumAPI.deleteComment);
  const { execute: updateCommentApi } = useApi(forumAPI.updateComment);
  const { execute: reportApi } = useApi(forumAPI.reportContent);
  const { execute: bookmarkApi } = useApi(forumAPI.bookmarkThread);
  const { execute: shareApi } = useApi(forumAPI.shareThread);
  const { execute: fetchRelatedApi } = useApi(forumAPI.getRelatedThreads);

  /**
   * Load thread data on mount
   */
  useEffect(() => {
    loadThreadData();
  }, [threadId]);

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
   * Load thread and comments
   */
  const loadThreadData = async () => {
    if (!threadId) {
      showNotification('Thread not found', 'error');
      navigate('/forum');
      return;
    }

    try {
      setLoading(true);
      
      const [threadData, commentsData, relatedData] = await Promise.all([
        fetchThreadApi(threadId),
        fetchCommentsApi(threadId),
        fetchRelatedApi(threadId)
      ]);

      if (threadData) {
        setThread(threadData);
        setUserVote(threadData.userVote || null);
        setIsBookmarked(threadData.isBookmarked || false);
      } else {
        // API returned null, use mock data
        console.log('API returned no data, using mock data for thread:', threadId);
        const mockThread = MOCK_THREADS[threadId];
        
        if (mockThread) {
          setThread(mockThread);
          setUserVote(null);
          setIsBookmarked(false);
        } else {
          showNotification('Thread not found', 'error');
          navigate('/forum');
          return;
        }
      }

      if (commentsData) {
        setComments(commentsData);
      }

      if (relatedData) {
        setRelatedThreads(relatedData);
      }
    } catch (error) {
      // On error, try to use mock data
      console.log('API error, using mock data for thread:', threadId);
      const mockThread = MOCK_THREADS[threadId];
      
      if (mockThread) {
        setThread(mockThread);
        setUserVote(null);
        setIsBookmarked(false);
        setComments([]);
        setRelatedThreads([]);
        showNotification('Loaded thread in offline mode', 'info');
      } else {
        showNotification('Failed to load thread', 'error');
        console.error('Error loading thread:', error);
        navigate('/forum');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle voting (like/dislike)
   */
  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to vote', 'info');
      navigate('/login');
      return;
    }

    try {
      // Optimistic update
      const previousVote = userVote;
      const newVote = userVote === voteType ? null : voteType;
      setUserVote(newVote);

      // Update counts
      setThread(prev => {
        const newThread = { ...prev };
        
        // Undo previous vote
        if (previousVote === 'up') newThread.upvotes--;
        if (previousVote === 'down') newThread.downvotes--;
        
        // Apply new vote
        if (newVote === 'up') newThread.upvotes++;
        if (newVote === 'down') newThread.downvotes++;
        
        return newThread;
      });

      const result = await voteApi({
        itemId: threadId,
        itemType: 'thread',
        voteType: newVote
      });

      if (result) {
        // Award points
        if (newVote === 'up' && !thread.isAnonymous) {
          showNotification('Vote recorded! Thread author earned +5 points 🎉', 'success');
        } else {
          showNotification('Vote recorded!', 'success');
        }
      }
    } catch (error) {
      // Revert on error
      setUserVote(userVote);
      showNotification('Failed to record vote', 'error');
    }
  };

  /**
   * Handle comment vote
   */
  const handleCommentVote = async (commentId, voteType) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to vote', 'info');
      navigate('/login');
      return;
    }

    try {
      const result = await voteApi({
        itemId: commentId,
        itemType: 'comment',
        voteType
      });

      if (result) {
        // Update comment in state
        setComments(prev =>
          prev.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                upvotes: result.upvotes,
                downvotes: result.downvotes,
                userVote: result.userVote
              };
            }
            
            // Check nested replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        upvotes: result.upvotes,
                        downvotes: result.downvotes,
                        userVote: result.userVote
                      }
                    : reply
                )
              };
            }
            
            return comment;
          })
        );

        showNotification('Vote recorded!', 'success');
      }
    } catch (error) {
      showNotification('Failed to record vote', 'error');
    }
  };

  /**
   * Handle adding a new comment
   */
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      showNotification('Please enter a comment', 'warning');
      return;
    }

    // Allow commenting even without full authentication for testing
    if (!isAuthenticated && !currentUser) {
      showNotification('Please sign in to comment', 'info');
      navigate('/login');
      return;
    }

    try {
      // Try API first
      const newComment = await addCommentApi({
        threadId,
        content: commentText,
        isAnonymous: false
      });

      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        
        // Update thread comment count
        setThread(prev => ({
          ...prev,
          commentCount: prev.commentCount + 1
        }));

        showNotification('Comment added! You earned +3 points 🎉', 'success');
      }
    } catch (error) {
      // API failed, create comment locally
      const localComment = {
        id: Date.now().toString(),
        content: commentText,
        author: {
          id: currentUser?.id || '999',
          name: currentUser?.name || 'Guest User',
          points: currentUser?.points || 0,
          avatar: currentUser?.avatar || null
        },
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        replies: [],
        createdAt: new Date().toISOString(),
        edited: false,
        isAnonymous: false
      };

      setComments(prev => [localComment, ...prev]);
      setCommentText('');
      
      // Update thread comment count
      setThread(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));

      showNotification('Comment added!', 'success');
    }
  };

  /**
   * Handle adding a reply to a comment
   */
  const handleAddReply = async (parentCommentId) => {
    if (!replyText.trim()) {
      showNotification('Please enter a reply', 'warning');
      return;
    }

    // Allow replying even without full authentication for testing
    if (!isAuthenticated && !currentUser) {
      showNotification('Please sign in to reply', 'info');
      navigate('/login');
      return;
    }

    try {
      const newReply = await addCommentApi({
        threadId,
        content: replyText,
        parentId: parentCommentId,
        isAnonymous: false
      });

      if (newReply) {
        // Add reply to parent comment
        setComments(prev =>
          prev.map(comment =>
            comment.id === parentCommentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), newReply]
                }
              : comment
          )
        );

        setReplyText('');
        setReplyingTo(null);
        showNotification('Reply added! You earned +3 points 🎉', 'success');
      }
    } catch (error) {
      // API failed, create reply locally
      const localReply = {
        id: Date.now().toString(),
        content: replyText,
        author: {
          id: currentUser?.id || '999',
          name: currentUser?.name || 'Guest User',
          points: currentUser?.points || 0,
          avatar: currentUser?.avatar || null
        },
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        replies: [],
        createdAt: new Date().toISOString(),
        edited: false,
        isAnonymous: false
      };

      // Add reply to parent comment
      setComments(prev =>
        prev.map(comment =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), localReply]
              }
            : comment
        )
      );

      setReplyText('');
      setReplyingTo(null);
      showNotification('Reply added!', 'success');
    }
  };

  /**
   * Handle comment deletion
   */
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const result = await deleteCommentApi(commentToDelete);

      if (result) {
        // Remove comment from state
        setComments(prev => prev.filter(comment => comment.id !== commentToDelete));
        setShowDeleteModal(false);
        setCommentToDelete(null);
        
        // Update thread comment count
        setThread(prev => ({
          ...prev,
          commentCount: prev.commentCount - 1
        }));

        showNotification('Comment deleted successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to delete comment', 'error');
    }
  };

  /**
   * Handle comment editing
   */
  const handleEditComment = async () => {
    if (!editingComment || !editText.trim()) return;

    try {
      const updatedComment = await updateCommentApi({
        commentId: editingComment.id,
        content: editText
      });

      if (updatedComment) {
        // Update comment in state
        setComments(prev =>
          prev.map(comment =>
            comment.id === editingComment.id
              ? { ...comment, content: editText, edited: true }
              : comment
          )
        );

        setEditingComment(null);
        setEditText('');
        showNotification('Comment updated successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to update comment', 'error');
    }
  };

  /**
   * Handle bookmark/save
   */
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to bookmark', 'info');
      navigate('/login');
      return;
    }

    try {
      const result = await bookmarkApi(threadId);
      
      if (result) {
        setIsBookmarked(!isBookmarked);
        showNotification(
          isBookmarked ? 'Bookmark removed' : 'Thread bookmarked!',
          'success'
        );
      }
    } catch (error) {
      showNotification('Failed to bookmark thread', 'error');
    }
  };

  /**
   * Handle share functionality
   */
  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareTitle = thread.title;
    const shareText = `Check out this discussion: ${shareTitle}`;

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareUrl);
        showNotification('Link copied to clipboard!', 'success');
        setShowShareModal(false);
      } else if (platform === 'native' && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        setShowShareModal(false);
      } else {
        // Open share window for social platforms
        let shareLink = '';
        
        switch (platform) {
          case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            break;
          case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
          case 'linkedin':
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            break;
          case 'whatsapp':
            shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            break;
          default:
            return;
        }

        window.open(shareLink, '_blank', 'width=600,height=400');
        setShowShareModal(false);
      }

      // Track share
      await shareApi({ threadId, platform });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  /**
   * Handle report submission
   */
  const handleReport = async () => {
    if (!reportReason) {
      showNotification('Please select a reason', 'warning');
      return;
    }

    if (!isAuthenticated) {
      showNotification('Please sign in to report', 'info');
      navigate('/login');
      return;
    }

    try {
      const result = await reportApi({
        itemId: threadId,
        itemType: 'thread',
        reason: reportReason,
        details: reportDetails
      });

      if (result) {
        setShowReportModal(false);
        setReportReason('');
        setReportDetails('');
        showNotification('Report submitted. Our team will review it shortly.', 'success');
      }
    } catch (error) {
      showNotification('Failed to submit report', 'error');
    }
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
    return date.toLocaleDateString();
  };

  /**
   * Render comment component recursively for nested replies
   */
  const renderComment = (comment, depth = 0) => {
    const isOwner = currentUser && comment.author.id === currentUser.id;
    const canModerate = currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin');
    const isEditing = editingComment?.id === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
      <div
        key={comment.id}
        className={`comment ${depth > 0 ? 'comment-reply' : ''}`}
        style={{ marginLeft: depth > 0 ? '2rem' : '0' }}
      >
        {/* Comment Header */}
        <div className="comment-header">
          <div className="comment-author">
            <div className="author-avatar placeholder">
              {comment.isAnonymous ? '?' : comment.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="author-info">
              <span className="author-name">
                {comment.isAnonymous ? 'Anonymous User' : comment.author.name}
              </span>
              {!comment.isAnonymous && comment.author.points > 0 && (
                <span className="author-points">
                  <Award size={12} />
                  {comment.author.points} pts
                </span>
              )}
              <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
              {comment.edited && <span className="edited-badge">(edited)</span>}
            </div>
          </div>

          {/* Comment Actions Dropdown */}
          {(isOwner || canModerate) && (
            <div className="comment-actions">
              <div className="dropdown">
                <button className="action-btn">
                  <MoreVertical size={18} />
                </button>
                <div className="dropdown-menu">
                  {isOwner && (
                    <>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setEditingComment(comment);
                          setEditText(comment.content);
                        }}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          setCommentToDelete(comment.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                  {canModerate && !isOwner && (
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        setCommentToDelete(comment.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={16} />
                      Remove (Moderator)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="comment-edit">
            <textarea
              className="form-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
            <div className="edit-actions">
              <button onClick={handleEditComment} className="btn-primary btn-sm">
                <CheckCircle size={16} />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingComment(null);
                  setEditText('');
                }}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="comment-content">
            <p>{comment.content}</p>
          </div>
        )}

        {/* Comment Footer */}
        <div className="comment-footer">
          {/* Vote Buttons */}
          <div className="vote-buttons">
            <button
              className={`vote-btn ${comment.userVote === 'up' ? 'active upvote' : ''}`}
              onClick={() => handleCommentVote(comment.id, 'up')}
              disabled={!isAuthenticated}
            >
              <ThumbsUp size={16} />
              <span>{comment.upvotes || 0}</span>
            </button>
            <button
              className={`vote-btn ${comment.userVote === 'down' ? 'active downvote' : ''}`}
              onClick={() => handleCommentVote(comment.id, 'down')}
              disabled={!isAuthenticated}
            >
              <ThumbsDown size={16} />
              <span>{comment.downvotes || 0}</span>
            </button>
          </div>

          {/* Reply Button */}
          <button
            className="reply-btn"
            onClick={() => {
              if (!isAuthenticated) {
                showNotification('Please sign in to reply', 'info');
                navigate('/login');
                return;
              }
              setReplyingTo(isReplying ? null : comment.id);
              setReplyText('');
            }}
          >
            <Reply size={16} />
            Reply
          </button>

          {/* Report Button */}
          {!isOwner && (
            <button
              className="report-btn"
              onClick={() => {
                if (!isAuthenticated) {
                  showNotification('Please sign in to report', 'info');
                  navigate('/login');
                  return;
                }
                showNotification('Comment reported for review', 'info');
              }}
            >
              <Flag size={16} />
              Report
            </button>
          )}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="reply-input">
            <textarea
              className="form-textarea"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
            <div className="reply-actions">
              <button onClick={() => handleAddReply(comment.id)} className="btn-primary btn-sm">
                <Send size={16} />
                Post Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="thread-detail-loading">
        <Loader />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="thread-not-found">
        <div className="not-found-content">
          <AlertCircle size={64} />
          <h2>Thread Not Found</h2>
          <p>The thread you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/forum')} className="btn-primary">
            <ArrowLeft size={18} />
            Back to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="thread-detail-page">
      <div className="container">
        {/* Back Button */}
        <button onClick={() => navigate('/forum')} className="back-button">
          <ArrowLeft size={18} />
          Back to Forum
        </button>

        {/* Thread Header */}
        <section className="thread-header animate-slide-down">
          <div className="thread-meta">
            <span className="forum-badge">{thread.forumName || 'General'}</span>
            {thread.isQuestion && (
              <span className="question-badge">
                <MessageSquare size={14} />
                Question
              </span>
            )}
            {thread.isAnonymous ? (
              <span className="anonymous-badge">
                <User size={14} />
                Posted Anonymously
              </span>
            ) : (
              <span className="author-badge">
                <User size={14} />
                by {thread.author?.name || 'Unknown'}
              </span>
            )}
            <span className="thread-time">
              <Clock size={14} />
              {formatRelativeTime(thread.createdAt)}
            </span>
          </div>

          <h1 className="thread-title">{thread.title}</h1>

          <div className="thread-stats">
            <span className="stat">
              <Eye size={18} />
              {thread.viewCount || 0} views
            </span>
            <span className="stat">
              <MessageSquare size={18} />
              {thread.commentCount || 0} comments
            </span>
            <span className="stat">
              <ThumbsUp size={18} />
              {thread.upvotes || 0} likes
            </span>
          </div>
        </section>

        <div className="thread-layout">
          {/* Main Content */}
          <div className="thread-main">
            {/* Thread Content */}
            <section className="thread-content animate-slide-up">
              <div className="content-section">
                <div
                  className="thread-body"
                  dangerouslySetInnerHTML={{ __html: thread.content }}
                />

                {/* Thread Media */}
                {thread.media && thread.media.length > 0 && (
                  <div className="thread-media">
                    {thread.media.map((item, index) => (
                      <div key={index} className="media-item">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.name || `Media ${index + 1}`} />
                        ) : (
                          <video src={item.url} controls />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Thread Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="thread-tags">
                    {thread.tags.map((tag, index) => (
                      <span key={index} className="tag-pill">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thread Actions */}
              <div className="thread-actions">
                <div className="vote-section">
                  <button
                    className={`vote-btn large upvote ${userVote === 'up' ? 'active' : ''}`}
                    onClick={() => handleVote('up')}
                    disabled={!isAuthenticated}
                  >
                    <ThumbsUp size={20} />
                    <span>{thread.upvotes || 0}</span>
                  </button>
                  <button
                    className={`vote-btn large downvote ${userVote === 'down' ? 'active' : ''}`}
                    onClick={() => handleVote('down')}
                    disabled={!isAuthenticated}
                  >
                    <ThumbsDown size={20} />
                    <span>{thread.downvotes || 0}</span>
                  </button>
                </div>

                <div className="action-buttons">
                  <button onClick={() => setShowShareModal(true)} className="action-btn">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`action-btn ${isBookmarked ? 'active' : ''}`}
                    disabled={!isAuthenticated}
                  >
                    <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => setShowReportModal(true)} className="action-btn">
                    <Flag size={18} />
                    Report
                  </button>
                </div>
              </div>
            </section>

            {/* Comments Section */}
            <section className="comments-section animate-fade-in">
              <div className="comments-header">
                <h2>
                  <MessageSquare size={24} />
                  Discussion ({comments.length})
                </h2>
              </div>

              {/* Add Comment - Always show for testing */}
              <div className="add-comment">
                <textarea
                  ref={commentInputRef}
                  className="form-textarea"
                  placeholder="Share your thoughts or ask a question..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                />
                <div className="comment-actions">
                  <button onClick={handleAddComment} className="btn-primary" disabled={!commentText.trim()}>
                    <Send size={18} />
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="comments-list">
                  {comments.map(comment => renderComment(comment))}
                </div>
              ) : (
                <div className="no-comments">
                  <MessageSquare size={48} />
                  <h3>No comments yet</h3>
                  <p>Be the first to share your thoughts!</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="thread-sidebar">
            {/* Author Info */}
            {!thread.isAnonymous && thread.author && (
              <div className="sidebar-card author-card animate-slide-left">
                <h3>About the Author</h3>
                <div className="author-profile">
                  <div className="author-avatar-large">
                    {thread.author.avatar ? (
                      <img src={thread.author.avatar} alt={thread.author.name} />
                    ) : (
                      thread.author.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h4>{thread.author.name}</h4>
                  {thread.author.title && <p className="author-title">{thread.author.title}</p>}
                  <div className="author-stats">
                    <div className="stat-item">
                      <Award size={16} />
                      <span>{thread.author.points || 0} points</span>
                    </div>
                    <div className="stat-item">
                      <MessageSquare size={16} />
                      <span>{thread.author.postsCount || 0} posts</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Threads */}
            {relatedThreads.length > 0 && (
              <div className="sidebar-card animate-slide-left">
                <h3>Related Discussions</h3>
                <div className="related-threads">
                  {relatedThreads.slice(0, 5).map(related => (
                    <div
                      key={related.id}
                      className="related-item"
                      onClick={() => navigate(`/forum/thread/${related.id}`)}
                    >
                      <h4>{related.title}</h4>
                      <div className="related-meta">
                        <span>
                          <MessageSquare size={12} />
                          {related.commentCount || 0}
                        </span>
                        <span>
                          <ThumbsUp size={12} />
                          {related.upvotes || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forum Guidelines */}
            <div className="sidebar-card animate-slide-left">
              <h3>Community Guidelines</h3>
              <ul className="guidelines-list">
                <li>Be respectful and constructive</li>
                <li>Stay on topic</li>
                <li>Provide helpful responses</li>
                <li>Report inappropriate content</li>
                <li>Follow forum rules</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <Modal onClose={() => setShowShareModal(false)}>
          <div className="share-modal">
            <h2>Share This Thread</h2>
            <div className="share-options">
              <button onClick={() => handleShare('copy')} className="share-btn">
                <LinkIcon size={24} />
                Copy Link
              </button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Twitter
              </button>
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
                Facebook
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <Modal onClose={() => setShowReportModal(false)}>
          <div className="report-modal">
            <h2>Report This Thread</h2>
            <p>Help us maintain a positive community by reporting inappropriate content.</p>
            
            <div className="form-group">
              <label className="form-label required">Reason for reporting</label>
              <select
                className="form-select"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="spam">Spam or misleading</option>
                <option value="harassment">Harassment or hate speech</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="offtopic">Off-topic or irrelevant</option>
                <option value="copyright">Copyright violation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional details (optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Provide more context about this report..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={4}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleReport} className="btn-primary" disabled={!reportReason}>
                <Flag size={18} />
                Submit Report
              </button>
              <button onClick={() => setShowReportModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Comment Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="delete-modal-content">
            <AlertCircle size={48} color="#dc2626" />
            <h2>Delete Comment?</h2>
            <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={handleDeleteComment} className="btn-danger">
                <Trash2 size={18} />
                Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

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

export default ThreadDetail;
