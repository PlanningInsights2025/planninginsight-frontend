import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Sparkles,
  Trash2,
  Film
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
  const location = useLocation();

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
  const [likedThreads, setLikedThreads] = useState(new Set());
  const [threadStats, setThreadStats] = useState({});
  const [expandedThread, setExpandedThread] = useState(null); // For Quora-style inline comments
  const [threadComments, setThreadComments] = useState({}); // Store comments for each thread
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
  const [replyText, setReplyText] = useState(''); // Store reply text
  const [collapsedReplies, setCollapsedReplies] = useState(new Set()); // Track which comments have collapsed replies
  const [deletedItems, setDeletedItems] = useState({}); // Track deleted comments/replies for undo
  const [undoTimeouts, setUndoTimeouts] = useState({}); // Timeouts for permanent deletion
  const [showLikePrompt, setShowLikePrompt] = useState(null); // Track which thread shows like prompt
  const [selectedMedia, setSelectedMedia] = useState(null); // Track selected media for lightbox
  const [showMediaModal, setShowMediaModal] = useState(false); // Show media modal

  // Refs for scroll animations
  const observerRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const commentsRef = useRef(null); // Reference to the expanded comments section

  /**
   * Close comments when clicking outside
   */
  useEffect(() => {
    if (!expandedThread) return;

    const handleClickOutside = (event) => {
      if (commentsRef.current && !commentsRef.current.contains(event.target)) {
        // Check if the click is on the comment button itself
        const isCommentButton = event.target.closest('.stat-button');
        if (isCommentButton) return;

        // Stop propagation to prevent card navigation
        event.stopPropagation();
        event.preventDefault();
        
        // Close comments
        setExpandedThread(null);
      }
    };

    // Use capture phase to handle before other event handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [expandedThread]);

  /**
   * Load data on component mount
   */
  useEffect(() => {
    loadData();
    loadInteractionData();
    
    if (isAuthenticated && user) {
      setUserPoints(user.points || 0);
    }
  }, [isAuthenticated, user]);

  /**
   * Reload data when component becomes visible
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * Reload data when location changes (e.g., returning from /forum/create)
   */
  useEffect(() => {
    if (location.pathname === '/forum') {
      console.log('🔄 Forum route detected, reloading data...');
      loadData();
    }
  }, [location.pathname]);

  /**
   * Listen for custom thread creation events
   */
  useEffect(() => {
    const handleThreadCreated = (event) => {
      console.log('📢 Thread creation event received, reloading data...');
      // If event has thread data with videos, store temporarily
      if (event.detail?.thread) {
        const thread = event.detail.thread;
        console.log('📹 New thread with media:', thread.media?.length);
      }
      loadData();
    };
    
    window.addEventListener('forumThreadCreated', handleThreadCreated);
    
    return () => {
      window.removeEventListener('forumThreadCreated', handleThreadCreated);
    };
  }, []);

  /**
   * Load user interaction data from localStorage
   */
  const loadInteractionData = () => {
    try {
      if (!user) return;
      
      const userId = user.id || 'guest';
      const liked = localStorage.getItem(`liked_threads_${userId}`);
      if (liked) {
        setLikedThreads(new Set(JSON.parse(liked)));
      }
    } catch (error) {
      console.error('Error loading interaction data:', error);
    }
  };

  /**
   * Update thread stats from localStorage
   */
  useEffect(() => {
    if (threads.length > 0) {
      const stats = {};
      threads.forEach(thread => {
        const likes = localStorage.getItem(`thread_likes_${thread.id}`);
        const comments = localStorage.getItem(`thread_comments_${thread.id}`);
        const views = localStorage.getItem(`thread_views_${thread.id}`);
        
        stats[thread.id] = {
          likes: likes ? JSON.parse(likes).length : thread.likes || 0,
          comments: comments ? JSON.parse(comments).length : thread.commentCount || 0,
          views: views ? parseInt(views, 10) : thread.viewCount || 0
        };
      });
      setThreadStats(stats);
    }
  }, [threads]);

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
    console.log('🔄 loadData() called at', new Date().toLocaleTimeString());
    try {
      setLoading(true);
      
      // Load threads from localStorage first
      const storedThreads = localStorage.getItem('forum_threads');
      let allThreads = [];
      
      if (storedThreads) {
        try {
          const parsedThreads = JSON.parse(storedThreads);
          console.log('✅ Loaded threads from localStorage:', parsedThreads.length, 'threads');
          
          // Restore video URLs from sessionStorage if available
          parsedThreads.forEach((t, idx) => {
            console.log(`  ${idx + 1}. "${t.title}" - Created: ${new Date(t.createdAt).toLocaleString()}`);
            if (t.media?.length) {
              console.log(`     📷 Has ${t.media.length} media items`);
              
              // Check if we have full media in sessionStorage (for videos)
              try {
                const sessionMedia = sessionStorage.getItem(`thread_${t.id}_media`);
                if (sessionMedia) {
                  const fullMedia = JSON.parse(sessionMedia);
                  t.media = fullMedia;
                  console.log(`     🎬 Restored video URLs from session for thread ${t.id}`);
                }
              } catch (e) {
                console.warn('Could not restore session media for thread', t.id);
              }
            }
          });
          
          // Put stored threads first (newest user threads at top)
          allThreads = [...parsedThreads, ...mockThreads];
        } catch (e) {
          console.error('❌ Error parsing stored threads:', e);
          allThreads = [...mockThreads];
        }
      } else {
        console.log('ℹ️ No stored threads found, using mock data only');
        allThreads = [...mockThreads];
      }
      
      console.log(`📊 Total threads to display: ${allThreads.length}`);
      
      // Set data immediately without delay
      setThreads(allThreads);
      setForums(mockForums);
      setActiveContributors(mockContributors);
      extractTrendingTopics(allThreads);
      setLoading(false);
      
      console.log('✅ Forum data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading forum data:', error);
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

    // Filter out deleted threads
    filtered = filtered.filter(thread => {
      const deletedKey = `thread-${thread.id}`;
      return !deletedItems[deletedKey];
    });

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
   * Handle like button click
   */
  const handleLike = (e, threadId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setExpandedThread(null); // Close comment section
      setShowLikePrompt(threadId);
      showNotification('Please sign in to like threads', 'info');
      return;
    }

    try {
      const userId = user?.id || 'guest';
      const likesKey = `thread_likes_${threadId}`;
      const userLikesKey = `liked_threads_${userId}`;
      
      const currentLikes = localStorage.getItem(likesKey);
      let likesArray = currentLikes ? JSON.parse(currentLikes) : [];
      const userLikes = new Set(likedThreads);
      
      if (userLikes.has(threadId)) {
        // Unlike
        likesArray = likesArray.filter(id => id !== userId);
        userLikes.delete(threadId);
      } else {
        // Like
        if (!likesArray.includes(userId)) {
          likesArray.push(userId);
        }
        userLikes.add(threadId);
      }
      
      localStorage.setItem(likesKey, JSON.stringify(likesArray));
      localStorage.setItem(userLikesKey, JSON.stringify([...userLikes]));
      setLikedThreads(userLikes);
      
      // Update stats
      setThreadStats(prev => ({
        ...prev,
        [threadId]: {
          ...prev[threadId],
          likes: likesArray.length
        }
      }));
    } catch (error) {
      console.error('Error handling like:', error);
      showNotification('Failed to update like', 'error');
    }
  };

  /**
   * Handle comment button click
   */
  const handleComment = (e, threadId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle expanded thread - Quora style
    if (expandedThread === threadId) {
      setExpandedThread(null); // Collapse if already expanded
    } else {
      setShowLikePrompt(null); // Close like prompt
      setExpandedThread(threadId); // Expand to show comments
      
      // Increment view count when opening thread
      incrementViewCount(threadId);
      
      // Load comments for this thread if not already loaded
      if (!threadComments[threadId]) {
        // Initialize with empty array - will load from localStorage or API
        loadThreadComments(threadId);
      }
    }
  };

  /**
   * Increment view count for a thread
   */
  const incrementViewCount = (threadId) => {
    try {
      // Get current view count
      const viewKey = `thread_views_${threadId}`;
      const currentViews = localStorage.getItem(viewKey);
      const viewCount = currentViews ? parseInt(currentViews, 10) : 0;
      
      // Check if user already viewed this thread (within session)
      const viewedKey = `user_viewed_${threadId}`;
      const alreadyViewed = sessionStorage.getItem(viewedKey);
      
      if (!alreadyViewed) {
        // Increment view count
        const newViewCount = viewCount + 1;
        localStorage.setItem(viewKey, newViewCount.toString());
        sessionStorage.setItem(viewedKey, 'true');
        
        // Update thread stats
        updateThreadStat(threadId, 'views', newViewCount);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  /**
   * Load comments for a specific thread
   */
  const loadThreadComments = (threadId) => {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem(`thread_comments_data_${threadId}`);
      if (stored) {
        const comments = JSON.parse(stored);
        setThreadComments(prev => ({ ...prev, [threadId]: comments }));
      } else {
        // Initialize with empty array
        setThreadComments(prev => ({ ...prev, [threadId]: [] }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setThreadComments(prev => ({ ...prev, [threadId]: [] }));
    }
  };

  /**
   * Add a new comment to a thread
   */
  const addComment = (threadId, commentText) => {
    if (!commentText.trim()) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      showNotification('Please sign in to comment', 'info');
      window.scrollTo(0, 0);
      navigate('/login', { state: { returnTo: '/forum' } });
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      content: commentText,
      author: {
        id: user.id,
        name: user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email,
        points: user.points || 0,
        avatar: user.photoURL || user.avatar || null
      },
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      replies: [],
      createdAt: new Date().toISOString(),
      edited: false,
      isAnonymous: false
    };

    // Update state
    setThreadComments(prev => ({
      ...prev,
      [threadId]: [newComment, ...(prev[threadId] || [])]
    }));

    // Update comment count
    updateThreadStat(threadId, 'comments', (threadStats[threadId]?.comments || 0) + 1);

    // Save to localStorage
    try {
      const comments = [newComment, ...(threadComments[threadId] || [])];
      localStorage.setItem(`thread_comments_data_${threadId}`, JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving comment:', error);
    }

    showNotification('Comment added!', 'success');
  };

  /**
   * Handle comment like/unlike
   */
  const handleCommentLike = (threadId, commentId) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      showNotification('Please sign in to like comments', 'info');
      window.scrollTo(0, 0);
      navigate('/login', { state: { returnTo: '/forum' } });
      return;
    }

    setThreadComments(prev => {
      const threadCommentsCopy = [...(prev[threadId] || [])];
      const commentIndex = threadCommentsCopy.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        const comment = { ...threadCommentsCopy[commentIndex] };
        const userId = user?.id || 'guest';
        
        // Toggle like
        if (comment.userVote === 'up') {
          // Unlike
          comment.upvotes = Math.max(0, (comment.upvotes || 0) - 1);
          comment.userVote = null;
        } else {
          // Like
          comment.upvotes = (comment.upvotes || 0) + 1;
          comment.userVote = 'up';
        }
        
        threadCommentsCopy[commentIndex] = comment;
        
        // Save to localStorage
        try {
          localStorage.setItem(`thread_comments_data_${threadId}`, JSON.stringify(threadCommentsCopy));
        } catch (error) {
          console.error('Error saving comment like:', error);
        }
      }
      
      return {
        ...prev,
        [threadId]: threadCommentsCopy
      };
    });
  };

  /**
   * Handle comment reply
   */
  const handleCommentReply = (threadId, parentCommentId, replyText) => {
    if (!replyText.trim()) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      showNotification('Please sign in to reply', 'info');
      window.scrollTo(0, 0);
      navigate('/login', { state: { returnTo: '/forum' } });
      return;
    }

    const newReply = {
      id: `${Date.now()}-reply`,
      content: replyText,
      author: {
        id: user.id,
        name: user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email,
        points: user.points || 0,
        avatar: user.photoURL || user.avatar || null
      },
      upvotes: 0,
      userVote: null,
      createdAt: new Date().toISOString(),
      isAnonymous: false
    };

    setThreadComments(prev => {
      const threadCommentsCopy = [...(prev[threadId] || [])];
      const commentIndex = threadCommentsCopy.findIndex(c => c.id === parentCommentId);
      
      if (commentIndex !== -1) {
        const comment = { ...threadCommentsCopy[commentIndex] };
        comment.replies = [...(comment.replies || []), newReply];
        threadCommentsCopy[commentIndex] = comment;
        
        // Save to localStorage
        try {
          localStorage.setItem(`thread_comments_data_${threadId}`, JSON.stringify(threadCommentsCopy));
        } catch (error) {
          console.error('Error saving reply:', error);
        }
      }
      
      return {
        ...prev,
        [threadId]: threadCommentsCopy
      };
    });

    showNotification('Reply added!', 'success');
  };

  /**
   * Handle comment deletion with undo (Instagram style)
   */
  const handleDeleteComment = (threadId, commentId) => {
    const deletedKey = `comment-${threadId}-${commentId}`;
    
    // Store the comment data before marking as deleted
    const comment = threadComments[threadId]?.find(c => c.id === commentId);
    
    setDeletedItems(prev => ({
      ...prev,
      [deletedKey]: {
        type: 'comment',
        threadId,
        commentId,
        data: comment,
        timestamp: Date.now()
      }
    }));

    // Set timeout for permanent deletion (5 seconds)
    const timeout = setTimeout(() => {
      permanentlyDeleteComment(threadId, commentId);
      setDeletedItems(prev => {
        const newDeleted = { ...prev };
        delete newDeleted[deletedKey];
        return newDeleted;
      });
      setUndoTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[deletedKey];
        return newTimeouts;
      });
    }, 5000);

    setUndoTimeouts(prev => ({
      ...prev,
      [deletedKey]: timeout
    }));
  };

  /**
   * Undo deletion
   */
  const handleUndoDelete = (e, deletedKey) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Clear the timeout
    if (undoTimeouts[deletedKey]) {
      clearTimeout(undoTimeouts[deletedKey]);
    }

    // Remove from deleted items
    setDeletedItems(prev => {
      const newDeleted = { ...prev };
      delete newDeleted[deletedKey];
      return newDeleted;
    });

    setUndoTimeouts(prev => {
      const newTimeouts = { ...prev };
      delete newTimeouts[deletedKey];
      return newTimeouts;
    });
  };

  /**
   * Check if comment is marked for deletion
   */
  const isCommentDeleted = (threadId, commentId) => {
    return !!deletedItems[`comment-${threadId}-${commentId}`];
  };

  /**
   * Check if reply is marked for deletion
   */
  const isReplyDeleted = (threadId, commentId, replyId) => {
    return !!deletedItems[`reply-${threadId}-${commentId}-${replyId}`];
  };

  /**
   * Confirm and execute deletion
   */
  const confirmDelete = () => {
    if (!deleteConfirmation) return;

    const { type, threadId, commentId, replyId } = deleteConfirmation;
    setIsDeleting(true);

    // Simulate a brief delay for professional feel
    setTimeout(() => {
      if (type === 'comment') {
        permanentlyDeleteComment(threadId, commentId);
        showNotification('Comment permanently deleted', 'success');
      } else if (type === 'reply') {
        permanentlyDeleteReply(threadId, commentId, replyId);
        showNotification('Reply permanently deleted', 'success');
      }

      setIsDeleting(false);
      setDeleteConfirmation(null);
    }, 600);
  };

  /**
   * Cancel deletion
   */
  const cancelDelete = () => {
    setDeleteConfirmation(null);
    setIsDeleting(false);
  };

  /**
   * Permanently delete comment from storage
   */
  const permanentlyDeleteComment = (threadId, commentId) => {
    setThreadComments(prev => {
      const threadCommentsCopy = [...(prev[threadId] || [])];
      const filteredComments = threadCommentsCopy.filter(c => c.id !== commentId);
      
      // Save to localStorage
      try {
        localStorage.setItem(`thread_comments_data_${threadId}`, JSON.stringify(filteredComments));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
      
      // Update comment count
      updateThreadStat(threadId, 'comments', Math.max(0, (threadStats[threadId]?.comments || 0) - 1));
      
      return {
        ...prev,
        [threadId]: filteredComments
      };
    });
  };

  /**
   * Handle reply deletion with undo (Instagram style)
   */
  const handleDeleteReply = (threadId, commentId, replyId) => {
    const deletedKey = `reply-${threadId}-${commentId}-${replyId}`;
    
    // Store the reply data before marking as deleted
    const comment = threadComments[threadId]?.find(c => c.id === commentId);
    const reply = comment?.replies?.find(r => r.id === replyId);
    
    setDeletedItems(prev => ({
      ...prev,
      [deletedKey]: {
        type: 'reply',
        threadId,
        commentId,
        replyId,
        data: reply,
        timestamp: Date.now()
      }
    }));

    // Set timeout for permanent deletion (5 seconds)
    const timeout = setTimeout(() => {
      permanentlyDeleteReply(threadId, commentId, replyId);
      setDeletedItems(prev => {
        const newDeleted = { ...prev };
        delete newDeleted[deletedKey];
        return newDeleted;
      });
      setUndoTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[deletedKey];
        return newTimeouts;
      });
    }, 5000);

    setUndoTimeouts(prev => ({
      ...prev,
      [deletedKey]: timeout
    }));
  };

  /**
   * Permanently delete reply from storage
   */
  const permanentlyDeleteReply = (threadId, commentId, replyId) => {
    setThreadComments(prev => {
      const threadCommentsCopy = [...(prev[threadId] || [])];
      const commentIndex = threadCommentsCopy.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        const comment = { ...threadCommentsCopy[commentIndex] };
        comment.replies = (comment.replies || []).filter(r => r.id !== replyId);
        threadCommentsCopy[commentIndex] = comment;
        
        // Save to localStorage
        try {
          localStorage.setItem(`thread_comments_data_${threadId}`, JSON.stringify(threadCommentsCopy));
        } catch (error) {
          console.error('Error deleting reply:', error);
        }
      }
      
      return {
        ...prev,
        [threadId]: threadCommentsCopy
      };
    });
  };



  /**
   * Handle thread deletion with undo
   */
  const handleDeleteThread = (threadId) => {
    const deletedKey = `thread-${threadId}`;
    
    // Find the thread data
    const thread = threads.find(t => t.id === threadId);
    
    if (!thread) return;
    
    // Store the thread data before marking as deleted
    setDeletedItems(prev => ({
      ...prev,
      [deletedKey]: {
        type: 'thread',
        threadId,
        data: thread,
        timestamp: Date.now()
      }
    }));

    // Show toast with undo option
    showNotification(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <span>Thread deleted</span>
        <button 
          onClick={() => {
            // Cancel deletion
            setDeletedItems(prev => {
              const newDeleted = { ...prev };
              delete newDeleted[deletedKey];
              return newDeleted;
            });
            // Clear the timeout
            if (undoTimeouts[deletedKey]) {
              clearTimeout(undoTimeouts[deletedKey]);
              setUndoTimeouts(prev => {
                const newTimeouts = { ...prev };
                delete newTimeouts[deletedKey];
                return newTimeouts;
              });
            }
            showNotification('Thread restored', 'success');
          }}
          style={{
            background: 'white',
            color: '#2563eb',
            border: 'none',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}
        >
          Undo
        </button>
      </div>,
      'info',
      5000
    );

    // Set timeout for permanent deletion (5 seconds)
    const timeout = setTimeout(() => {
      permanentlyDeleteThread(threadId);
      setDeletedItems(prev => {
        const newDeleted = { ...prev };
        delete newDeleted[deletedKey];
        return newDeleted;
      });
      setUndoTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[deletedKey];
        return newTimeouts;
      });
    }, 5000);

    setUndoTimeouts(prev => ({
      ...prev,
      [deletedKey]: timeout
    }));
  };

  /**
   * Permanently delete thread from storage
   */
  const permanentlyDeleteThread = (threadId) => {
    // Remove from threads state
    setThreads(prev => prev.filter(t => t.id !== threadId));
    
    // Remove from localStorage
    try {
      const storedThreads = localStorage.getItem('forum_threads');
      if (storedThreads) {
        const parsedThreads = JSON.parse(storedThreads);
        const updatedThreads = parsedThreads.filter(t => t.id !== threadId);
        localStorage.setItem('forum_threads', JSON.stringify(updatedThreads));
        console.log(`🗑️ Thread ${threadId} permanently deleted`);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
    
    // Also clean up associated data
    try {
      localStorage.removeItem(`thread_comments_data_${threadId}`);
      localStorage.removeItem(`thread_likes_${threadId}`);
      localStorage.removeItem(`thread_views_${threadId}`);
    } catch (error) {
      console.error('Error cleaning up thread data:', error);
    }
  };

  /**
   * Handle reply like/unlike
   */
  const handleReplyLike = (threadId, commentId, replyId) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      showNotification('Please sign in to like replies', 'info');
      window.scrollTo(0, 0);
      navigate('/login', { state: { returnTo: '/forum' } });
      return;
    }

    setThreadComments(prev => {
      const threadCommentsCopy = [...(prev[threadId] || [])];
      const commentIndex = threadCommentsCopy.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        const comment = { ...threadCommentsCopy[commentIndex] };
        const replies = [...(comment.replies || [])];
        const replyIndex = replies.findIndex(r => r.id === replyId);
        
        if (replyIndex !== -1) {
          const reply = { ...replies[replyIndex] };
          
          // Toggle like
          if (reply.userVote === 'up') {
            // Unlike
            reply.upvotes = Math.max(0, (reply.upvotes || 0) - 1);
            reply.userVote = null;
          } else {
            // Like
            reply.upvotes = (reply.upvotes || 0) + 1;
            reply.userVote = 'up';
          }
          
          replies[replyIndex] = reply;
          comment.replies = replies;
          threadCommentsCopy[commentIndex] = comment;
          
          // Save to localStorage
          try {
            localStorage.setItem(`thread_comments_data_${threadId}`, JSON.stringify(threadCommentsCopy));
          } catch (error) {
            console.error('Error saving reply like:', error);
          }
        }
      }
      
      return {
        ...prev,
        [threadId]: threadCommentsCopy
      };
    });
  };

  /**
   * Update thread stat (likes, comments, views)
   */
  const updateThreadStat = (threadId, statType, newValue) => {
    setThreadStats(prev => ({
      ...prev,
      [threadId]: {
        ...prev[threadId],
        [statType]: newValue
      }
    }));

    // Save to localStorage
    try {
      localStorage.setItem(`thread_${statType}_${threadId}`, newValue.toString());
    } catch (error) {
      console.error('Error saving stat:', error);
    }
  };

  /**
   * Get thread stat value
   */
  const getThreadStat = (threadId, statType, defaultValue) => {
    return threadStats[threadId]?.[statType] ?? defaultValue;
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
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>Ask questions, share insights, and engage with professionals worldwide</p>
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
                <button onClick={() => { window.scrollTo(0, 0); navigate('/login', { state: { returnTo: '/forum' } }); }} className="btn-get-started">
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
              id="forum-filter"
              className="select filter-select"
              value={selectedForum}
              onChange={(e) => setSelectedForum(e.target.value)}
              aria-label="Filter discussions by forum"
            >
              <option value="all">All Forums</option>
              {forums.map(forum => (
                <option key={forum.id} value={forum.id}>
                  {forum.name}
                </option>
              ))}
            </select>

            <select
              id="sort-filter"
              className="select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort discussions by criteria"
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
                        onClick={(e) => {
                          // Don't navigate if comments are open for this thread
                          if (expandedThread === threadId) {
                            return;
                          }
                          // Only navigate if not clicking on interactive elements
                          if (!e.target.closest('.stat-button') && !e.target.closest('.tag-pill')) {
                            // Increment view count when navigating to thread detail
                            incrementViewCount(threadId);
                            navigate(`/forum/thread/${threadId}`);
                          }
                        }}
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
                          {/* Delete button - only show for thread author */}
                          {isAuthenticated && user && thread.author?.id === user.id && (
                            <button
                              type="button"
                              className="thread-delete-btn"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation to thread detail
                                handleDeleteThread(threadId);
                              }}
                              aria-label="Delete thread"
                              title="Delete thread"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Thread Media Preview - Inline Video */}
                        {thread.media && Array.isArray(thread.media) && thread.media.length > 0 && (
                          <div className="thread-images-preview">
                            {thread.media.slice(0, 4).map((mediaItem, i) => {
                              if (!mediaItem?.url && !mediaItem?.thumbnail) return null;
                              const isLastItem = i === 3 && thread.media.length > 4;
                              const displayUrl = mediaItem.thumbnail || mediaItem.url;
                              return (
                                <div 
                                  key={i} 
                                  className="preview-image-wrapper"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // For images, open in modal; for videos, do nothing (play inline)
                                    if (mediaItem.type !== 'video') {
                                      setSelectedMedia(mediaItem);
                                      setShowMediaModal(true);
                                    }
                                  }}
                                >
                                  {mediaItem.type === 'video' ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                      {mediaItem.url ? (
                                        <video
                                          src={mediaItem.url}
                                          controls
                                          className="preview-image"
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          onError={(e) => {
                                            console.error('Video load error:', mediaItem.name);
                                          }}
                                        />
                                      ) : mediaItem.thumbnail ? (
                                        <img 
                                          src={mediaItem.thumbnail} 
                                          alt={mediaItem.name || 'Video thumbnail'}
                                          className="preview-image"
                                          loading="lazy"
                                          onError={(e) => {
                                            console.error('Video thumbnail load error:', mediaItem.name);
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="preview-image" style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <Film size={48} color="#fff" opacity={0.5} />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <img 
                                      src={displayUrl} 
                                      alt={mediaItem.name || `Preview ${i + 1}`}
                                      className="preview-image"
                                      loading="lazy"
                                      onError={(e) => {
                                        console.error('Image load error:', mediaItem.name);
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  {isLastItem && (
                                    <div className="more-images-overlay">
                                      +{thread.media.length - 4}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Thread Caption/Excerpt - Below Media */}
                        <div className="thread-excerpt" style={{ marginTop: '1rem' }}>
                          {/* Strip HTML tags for excerpt display */}
                          {thread.content?.replace(/<[^>]*>/g, '').substring(0, 200)}
                          {thread.content?.replace(/<[^>]*>/g, '').length > 200 && '...'}
                        </div>

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
                            {isAuthenticated ? (
                              <button
                                type="button"
                                className={`stat stat-button ${likedThreads.has(threadId) ? 'liked' : ''}`}
                                onClick={(e) => handleLike(e, threadId)}
                                aria-label={likedThreads.has(threadId) ? 'Unlike' : 'Like'}
                              >
                                <ThumbsUp size={16} className={likedThreads.has(threadId) ? 'filled' : ''} />
                                {getThreadStat(threadId, 'likes', thread.likes || 0)}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="stat stat-button stat-disabled"
                                onClick={(e) => handleLike(e, threadId)}
                                aria-label="Sign in to like"
                                title="Please sign in to like"
                              >
                                <ThumbsUp size={16} />
                                {getThreadStat(threadId, 'likes', thread.likes || 0)}
                              </button>
                            )}
                            {isAuthenticated ? (
                              <button
                                type="button"
                                className="stat stat-button"
                                onClick={(e) => handleComment(e, threadId)}
                                aria-label="Comment"
                              >
                                <MessageSquare size={16} />
                                {getThreadStat(threadId, 'comments', thread.commentCount || 0)}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="stat stat-button stat-disabled"
                                onClick={(e) => handleComment(e, threadId)}
                                aria-label="Sign in to comment"
                                title="Please sign in to comment"
                              >
                                <MessageSquare size={16} />
                                {getThreadStat(threadId, 'comments', thread.commentCount || 0)}
                              </button>
                            )}
                            <span className="stat">
                              <Eye size={16} />
                              {getThreadStat(threadId, 'views', thread.viewCount || 0)}
                            </span>
                          </div>
                        </div>

                        {/* Inline Like Prompt */}
                        {showLikePrompt === threadId && !isAuthenticated && (
                          <div className="login-prompt-inline" style={{ marginTop: '12px' }}>
                            <span>Please <button 
                              className="inline-link-button" 
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                window.scrollTo(0, 0); 
                                navigate('/login', { state: { returnTo: '/forum' } }); 
                              }}
                            >sign in</button> to like</span>
                          </div>
                        )}

                        {/* Inline Comments Section - Quora Style */}
                        {expandedThread === threadId && (
                          <div 
                            ref={commentsRef}
                            className="inline-comments-section" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="comments-divider"></div>
                            
                            {/* Add Comment Input */}
                            {isAuthenticated ? (
                              <div className="add-comment-inline">
                                <div className="comment-user-avatar">
                                  {user?.photoURL || user?.avatar ? (
                                    <img src={user.photoURL || user.avatar} alt={user.displayName || user.email} className="avatar-sm" />
                                  ) : (
                                    <div className="avatar-placeholder-sm">
                                      {(user?.displayName?.[0] || user?.firstName?.[0] || user?.email?.[0])?.toUpperCase() || 'U'}
                                    </div>
                                  )}
                                </div>
                                <div className="comment-input-wrapper">
                                  <textarea
                                    placeholder="Add a comment..."
                                    className="comment-textarea-inline"
                                    rows={2}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (e.target.value.trim()) {
                                          addComment(threadId, e.target.value);
                                          e.target.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    className="btn-post-comment-inline"
                                    onClick={(e) => {
                                      const textarea = e.target.previousElementSibling;
                                      if (textarea.value.trim()) {
                                        addComment(threadId, textarea.value);
                                        textarea.value = '';
                                      }
                                    }}
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="login-prompt-inline">
                                <span className="prompt-text">Please <button className="login-link-inline" onClick={() => { window.scrollTo(0, 0); navigate('/login', { state: { returnTo: '/forum' } }); }}>sign in</button> to comment</span>
                              </div>
                            )}

                            {/* Comments List */}
                            {isAuthenticated && (
                              <div className="comments-list-inline">
                                {threadComments[threadId]?.length > 0 ? (
                                threadComments[threadId]
                                  .filter(comment => !isCommentDeleted(threadId, comment.id))
                                  .map(comment => (
                                  <div key={comment.id} className="comment-item-inline">
                                    <div className="comment-avatar">
                                      {comment.author.avatar ? (
                                        <img src={comment.author.avatar} alt={comment.author.name} className="avatar-sm" />
                                      ) : (
                                        <div className="avatar-placeholder-sm">
                                          {comment.author.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                      )}
                                    </div>
                                    <div className="comment-content-inline">
                                      <div className="comment-header-inline">
                                        <span className="comment-author-name">{comment.author.name}</span>
                                        <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                                      </div>
                                      <p className="comment-text">{comment.content}</p>
                                      <div className="comment-actions-inline">
                                        <button 
                                          className={`comment-action-btn ${comment.userVote === 'up' ? 'liked' : ''}`}
                                          onClick={() => handleCommentLike(threadId, comment.id)}
                                        >
                                          <ThumbsUp size={14} fill={comment.userVote === 'up' ? 'currentColor' : 'none'} />
                                          <span>{comment.upvotes || 0}</span>
                                        </button>
                                        <button 
                                          className="comment-action-btn"
                                          onClick={() => {
                                            if (replyingTo === comment.id) {
                                              setReplyingTo(null);
                                              setReplyText('');
                                            } else {
                                              setReplyingTo(comment.id);
                                              setReplyText('');
                                            }
                                          }}
                                        >
                                          Reply
                                        </button>
                                        {user && comment.author.id === user.id && (
                                          <button 
                                            className="comment-action-btn delete-btn"
                                            onClick={() => handleDeleteComment(threadId, comment.id)}
                                          >
                                            <Trash2 size={14} />
                                            Delete
                                          </button>
                                        )}
                                      </div>

                                      {/* View Replies Button (Instagram style) */}
                                      {comment.replies && comment.replies.length > 0 && (
                                        <button
                                          className="view-replies-btn"
                                          onClick={() => {
                                            setCollapsedReplies(prev => {
                                              const newSet = new Set(prev);
                                              if (newSet.has(comment.id)) {
                                                newSet.delete(comment.id);
                                              } else {
                                                newSet.add(comment.id);
                                              }
                                              return newSet;
                                            });
                                          }}
                                        >
                                          {collapsedReplies.has(comment.id) 
                                            ? `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                                            : `Hide ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                                          }
                                        </button>
                                      )}

                                      {/* Replies List */}
                                      {comment.replies && comment.replies.length > 0 && !collapsedReplies.has(comment.id) && (
                                        <div className="replies-list">
                                          {comment.replies
                                            .filter(reply => !isReplyDeleted(threadId, comment.id, reply.id))
                                            .map(reply => (
                                            <div key={reply.id} className="reply-item">
                                              <div className="comment-avatar">
                                                {reply.author.avatar ? (
                                                  <img src={reply.author.avatar} alt={reply.author.name} className="avatar-xs" />
                                                ) : (
                                                  <div className="avatar-placeholder-xs">
                                                    {reply.author.name?.[0]?.toUpperCase() || 'U'}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="reply-content">
                                                <div className="reply-header">
                                                  <span className="reply-author-name">{reply.author.name}</span>
                                                  <span className="reply-time">{formatRelativeTime(reply.createdAt)}</span>
                                                </div>
                                                <p className="reply-text">{reply.content}</p>
                                                <div className="reply-actions">
                                                  <button 
                                                    className={`reply-like-btn ${reply.userVote === 'up' ? 'liked' : ''}`}
                                                    onClick={() => handleReplyLike(threadId, comment.id, reply.id)}
                                                  >
                                                    <ThumbsUp size={12} fill={reply.userVote === 'up' ? 'currentColor' : 'none'} />
                                                    <span>{reply.upvotes || 0}</span>
                                                  </button>
                                                  {user && reply.author.id === user.id && (
                                                    <button 
                                                      className="reply-delete-btn"
                                                      onClick={() => handleDeleteReply(threadId, comment.id, reply.id)}
                                                    >
                                                      <Trash2 size={12} />
                                                      Delete
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))
                                ) : (
                                  <div className="no-comments-inline">
                                    <MessageSquare size={32} />
                                    <p>No comments yet. Be the first to comment!</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Instagram-Style Reply Bar at Bottom */}
                            {replyingTo && (
                              <div className="reply-bottom-bar">
                                <div className="reply-header-bar">
                                  <span className="replying-to-text">Replying to {threadComments[threadId]?.find(c => c.id === replyingTo)?.author.name || 'user'}</span>
                                  <button
                                    className="btn-close-reply-bar"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText('');
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="reply-input-bar">
                                  <textarea
                                    placeholder="Write your reply..."
                                    className="reply-textarea-bar"
                                    rows={1}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (replyText.trim()) {
                                          handleCommentReply(threadId, replyingTo, replyText);
                                          setReplyingTo(null);
                                          setReplyText('');
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    className="btn-send-reply"
                                    onClick={() => {
                                      if (replyText.trim()) {
                                        handleCommentReply(threadId, replyingTo, replyText);
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }
                                    }}
                                  >
                                    ↑
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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

      {/* Instagram-Style Undo Toast */}
      {Object.keys(deletedItems).length > 0 && (
        <div className="instagram-undo-toast" onClick={(e) => e.stopPropagation()}>
          {Object.entries(deletedItems).map(([key, item]) => (
            <div key={key} className="undo-toast-bar" onClick={(e) => e.stopPropagation()}>
              <span className="undo-message">
                {item.type === 'comment' ? 'Comment' : 'Reply'} deleted.
              </span>
              <button 
                className="undo-button"
                onClick={(e) => handleUndoDelete(e, key)}
              >
                Undo
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Media Modal/Lightbox */}
      {showMediaModal && selectedMedia && (
        <div 
          className="media-modal-overlay"
          onClick={() => {
            setShowMediaModal(false);
            setSelectedMedia(null);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              cursor: 'default'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowMediaModal(false);
                setSelectedMedia(null);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              ×
            </button>

            {/* Media content */}
            {selectedMedia.type === 'video' ? (
              selectedMedia.url ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  style={{
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                  onError={(e) => {
                    console.error('Video playback error');
                  }}
                />
              ) : (
                <div style={{
                  background: '#222',
                  padding: '3rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <Film size={64} color="#fff" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Video Not Available</h3>
                  <p style={{ opacity: 0.7 }}>This video is only available during the current session</p>
                </div>
              )
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name || 'Image'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }}
              />
            )}

            {/* Media info */}
            {selectedMedia.name && (
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '0',
                color: 'white',
                fontSize: '14px',
                opacity: 0.8
              }}>
                {selectedMedia.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
