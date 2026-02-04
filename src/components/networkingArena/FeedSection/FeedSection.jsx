import React, { useState, useEffect, useRef } from 'react';
import { 
  ThumbsUp, MessageCircle, Share2, Bookmark, Send, Image, Video, 
  FileText, BarChart3, MoreHorizontal, Globe, Users, Lock, X, Smile,
  Edit, Trash2, Flag, Copy 
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as feedApi from '@/services/api/feed';
import './FeedSection.css';

const FeedSection = ({ userRole, currentUser }) => {
  const [postText, setPostText] = useState('');
  const [postPrivacy, setPostPrivacy] = useState('public');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [postComments, setPostComments] = useState({});
  const [postType, setPostType] = useState('text');
  const [mediaFile, setMediaFile] = useState(null);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleLink, setArticleLink] = useState('');
  const [showPostMenu, setShowPostMenu] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch feed on mount
  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await feedApi.getFeed({ page: pageNum, limit: 20 });
      
      if (response.success) {
        if (pageNum === 1) {
          setPosts(response.posts);
        } else {
          setPosts(prev => [...prev, ...response.posts]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      // Silently fail - empty state will be shown
    } finally {
      setLoading(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.post-menu-wrapper')) {
        setShowPostMenu({});
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLike = async (postId) => {
    try {
      // Optimistic update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));

      const response = await feedApi.likePost(postId);
      
      if (response.success) {
        // Update with server response
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              liked: response.liked,
              likes: response.likesCount
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Silently fail
      // Revert optimistic update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      }));
    }
  };

  const handleBookmark = async (postId) => {
    try {
      // Optimistic update
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, bookmarked: !post.bookmarked };
        }
        return post;
      }));

      const response = await feedApi.bookmarkPost(postId);
      
      if (response.success) {
        toast.success(response.bookmarked ? 'Post saved' : 'Post removed from saved');
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      // Silently fail
      // Revert
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, bookmarked: !post.bookmarked };
        }
        return post;
      }));
    }
  };

  const handleComment = async (postId) => {
    const isOpen = showComments[postId];
    
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Fetch comments if opening
    if (!isOpen && !postComments[postId]) {
      try {
        const response = await feedApi.getComments(postId);
        if (response.success) {
          setPostComments(prev => ({
            ...prev,
            [postId]: response.comments
          }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };

  const handleAddComment = async (postId) => {
    const comment = commentText[postId];
    if (!comment || !comment.trim()) return;

    try {
      const response = await feedApi.addComment(postId, comment);
      
      if (response.success) {
        // Add comment to UI
        setPostComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), response.comment]
        }));

        // Update post comment count
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: response.commentsCount
            };
          }
          return p;
        }));

        // Clear input
        setCommentText(prev => ({
          ...prev,
          [postId]: ''
        }));

        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Silently fail
    }
  };

  const handleLikeComment = (postId, commentId) => {
    setPostComments(prev => {
      const currentComments = prev[postId] || [];
      return {
        ...prev,
        [postId]: currentComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1
            };
          }
          return comment;
        })
      };
    });
  };

  const handleShare = async (postId) => {
    try {
      const response = await feedApi.sharePost(postId);
      
      if (response.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              shares: response.sharesCount
            };
          }
          return p;
        }));
        toast.success('Post shared');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      // Silently fail
    }
  };

  const handlePollVote = async (postId, optionId) => {
    try {
      const response = await feedApi.votePoll(postId, optionId);
      
      if (response.success) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              poll: response.poll
            };
          }
          return post;
        }));
        toast.success('Vote recorded');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const togglePostMenu = (postId) => {
    setShowPostMenu(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await feedApi.deletePost(postId);
      
      if (response.success) {
        setPosts(posts.filter(post => post.id !== postId));
        setShowPostMenu({});
        toast.success('Post deleted');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // Silently fail
    }
  };

  const handleEditPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setPostText(post.content);
      setShowCreatePost(true);
      setShowPostMenu({});
    }
  };

  const handleReportPost = (postId) => {
    toast.success('Post reported. Our team will review it shortly.');
    setShowPostMenu({});
  };

  const handleCopyLink = (postId) => {
    const link = `${window.location.origin}/networking-arena/post/${postId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
    setShowPostMenu({});
  };

  const handleOpenPostCreator = (type) => {
    setPostType(type);
    setShowCreatePost(true);
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !mediaFile && postType !== 'poll') return;

    try {
      const postData = {
        content: postText,
        type: postType,
        privacy: postPrivacy
      };

      if (postType === 'poll') {
        const validOptions = pollOptions.filter(opt => opt.trim());
        if (validOptions.length < 2) {
          toast.error('Poll must have at least 2 options');
          return;
        }
        postData.poll = {
          question: postText,
          options: validOptions
        };
      }

      if (postType === 'article') {
        if (!articleTitle || !articleLink) {
          toast.error('Article title and link are required');
          return;
        }
        postData.article = {
          title: articleTitle,
          link: articleLink
        };
      }

      const response = await feedApi.createPost(postData);
      
      if (response.success) {
        setPosts([response.post, ...posts]);
        
        // Reset form
        setPostText('');
        setShowCreatePost(false);
        setPostType('text');
        setMediaFile(null);
        setPollOptions(['', '']);
        setArticleTitle('');
        setArticleLink('');
        
        toast.success('Post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // Silently fail
    }
  };

  const resetPostForm = () => {
    setPostText('');
    setShowCreatePost(false);
    setPostType('text');
    setMediaFile(null);
    setPollOptions(['', '']);
    setArticleTitle('');
    setArticleLink('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const reactions = [
    { icon: '👍', label: 'Like', count: 45 },
    { icon: '❤️', label: 'Love', count: 23 },
    { icon: '💡', label: 'Insightful', count: 12 },
    { icon: '🎉', label: 'Celebrate', count: 8 },
  ];

  return (
    <div className="feed-section">
      {/* Create Post Card */}
      <div className="create-post-card">
        <div className="create-post-header">
          <img src="/api/placeholder/50/50" alt="You" className="user-avatar" />
          <button 
            className="create-post-input"
            onClick={() => setShowCreatePost(true)}
          >
            Start a post...
          </button>
        </div>
        <div className="create-post-actions">
          <button className="post-action-btn" onClick={() => handleOpenPostCreator('image')}>
            <Image size={20} className="action-icon photo" />
            Photo
          </button>
          <button className="post-action-btn" onClick={() => handleOpenPostCreator('video')}>
            <Video size={20} className="action-icon video" />
            Video
          </button>
          <button className="post-action-btn" onClick={() => handleOpenPostCreator('article')}>
            <FileText size={20} className="action-icon article" />
            Article
          </button>
          <button className="post-action-btn" onClick={() => handleOpenPostCreator('poll')}>
            <BarChart3 size={20} className="action-icon poll" />
            Poll
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="create-post-modal-overlay">
          <div className="create-post-modal">
            <div className="modal-header">
              <h3>Create a post</h3>
              <button onClick={() => setShowCreatePost(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="post-author-info">
                <img src="/api/placeholder/50/50" alt="You" />
                <div>
                  <h4>Your Name</h4>
                  <select 
                    value={postPrivacy} 
                    onChange={(e) => setPostPrivacy(e.target.value)}
                    className="privacy-select"
                  >
                    <option value="public">
                      🌐 Public
                    </option>
                    <option value="connections">
                      👥 Connections only
                    </option>
                    <option value="private">
                      🔒 Only me
                    </option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder={postType === 'poll' ? 'Ask a question...' : 'What do you want to talk about?'}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                autoFocus
              />

              {/* Photo Upload */}
              {postType === 'image' && (
                <div className="media-upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="photo-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="upload-label">
                    <Image size={48} />
                    <span>Click to upload a photo</span>
                  </label>
                  {mediaFile && (
                    <div className="media-preview">
                      <img src={URL.createObjectURL(mediaFile)} alt="Preview" />
                      <button onClick={() => setMediaFile(null)} className="remove-media">
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Video Upload */}
              {postType === 'video' && (
                <div className="media-upload-section">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    id="video-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="video-upload" className="upload-label">
                    <Video size={48} />
                    <span>Click to upload a video</span>
                  </label>
                  {mediaFile && (
                    <div className="media-preview">
                      <video src={URL.createObjectURL(mediaFile)} controls />
                      <button onClick={() => setMediaFile(null)} className="remove-media">
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Article Input */}
              {postType === 'article' && (
                <div className="article-input-section">
                  <input
                    type="text"
                    placeholder="Article Title"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="article-title-input"
                  />
                  <input
                    type="url"
                    placeholder="Article Link (https://...)"
                    value={articleLink}
                    onChange={(e) => setArticleLink(e.target.value)}
                    className="article-link-input"
                  />
                </div>
              )}

              {/* Poll Options */}
              {postType === 'poll' && (
                <div className="poll-options-section">
                  <h4>Poll Options</h4>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="poll-option-input">
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                      />
                      {pollOptions.length > 2 && (
                        <button onClick={() => removePollOption(index)} className="remove-option">
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 6 && (
                    <button onClick={addPollOption} className="add-poll-option">
                      + Add Option
                    </button>
                  )}
                </div>
              )}
              <div className="post-options">
                <button className="option-btn">
                  <Smile size={20} />
                </button>
                <button className="option-btn">
                  <Image size={20} />
                </button>
                <button className="option-btn">
                  <Video size={20} />
                </button>
                <button className="option-btn">
                  <FileText size={20} />
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="post-btn"
                onClick={handleCreatePost}
                disabled={!postText.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="feed-sort">
        <div className="sort-divider"></div>
        <div className="sort-options">
          <button className="sort-btn active">Recent</button>
          <button className="sort-btn">Top</button>
          <button className="sort-btn">Following</button>
        </div>
        <div className="sort-divider"></div>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {loading && posts.length === 0 ? (
          <div className="loading-state">
            <p>Loading feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Start by creating your first post!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* Post Header */}
            <div className="post-header">
              <img src={post.avatar} alt={post.author} className="post-avatar" />
              <div className="post-author-info">
                <h4>{post.author}</h4>
                <p className="author-title">{post.title}</p>
                <p className="post-timestamp">{post.timestamp}</p>
              </div>
              <div className="post-menu-wrapper">
                <button 
                  className="post-menu-btn"
                  onClick={() => togglePostMenu(post.id)}
                >
                  <MoreHorizontal size={20} />
                </button>
                {showPostMenu[post.id] && (
                  <div className="post-menu-dropdown">
                    {post.author === (currentUser?.name || 'Manish D Gavali') && (
                      <>
                        <button className="menu-item" onClick={() => handleEditPost(post.id)}>
                          <Edit size={16} />
                          <span>Edit Post</span>
                        </button>
                        <button className="menu-item delete" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 size={16} />
                          <span>Delete Post</span>
                        </button>
                        <div className="menu-divider"></div>
                      </>
                    )}
                    <button className="menu-item" onClick={() => handleBookmark(post.id)}>
                      <Bookmark size={16} />
                      <span>{post.bookmarked ? 'Remove Bookmark' : 'Save Post'}</span>
                    </button>
                    <button className="menu-item" onClick={() => handleCopyLink(post.id)}>
                      <Copy size={16} />
                      <span>Copy Link</span>
                    </button>
                    <div className="menu-divider"></div>
                    <button className="menu-item report" onClick={() => handleReportPost(post.id)}>
                      <Flag size={16} />
                      <span>Report Post</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="post-content">
              <p>{post.content}</p>
              
              {/* Image Post */}
              {post.type === 'image' && post.image && (
                <img src={post.image} alt="Post content" className="post-image" />
              )}

              {/* Video Post */}
              {post.type === 'video' && post.video && (
                <video src={post.video} controls className="post-video" />
              )}

              {/* Article Post */}
              {post.type === 'article' && post.article && (
                <a href={post.article.link} target="_blank" rel="noopener noreferrer" className="post-article">
                  <div className="article-preview">
                    <div className="article-icon">
                      <FileText size={24} />
                    </div>
                    <div className="article-details">
                      <h4>{post.article.title}</h4>
                      <p className="article-link">{new URL(post.article.link).hostname}</p>
                    </div>
                  </div>
                </a>
              )}

              {/* Poll Post */}
              {post.type === 'poll' && post.poll && (
                <div className="post-poll">
                  <h4>{post.poll.question}</h4>
                  <div className="poll-options">
                    {post.poll.options.map((option) => (
                      <div 
                        key={option.id} 
                        className={`poll-option ${post.poll.userVoted === option.id ? 'voted' : ''} ${!post.poll.userVoted ? 'clickable' : ''}`}
                        onClick={() => !post.poll.userVoted && handlePollVote(post.id, option.id)}
                      >
                        <div className="poll-option-bar" style={{ width: `${option.percentage}%` }} />
                        <div className="poll-option-content">
                          <span className="option-text">{option.text}</span>
                          <span className="option-percentage">{option.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="poll-votes">{post.poll.totalVotes} votes • {post.poll.userVoted ? 'You voted' : 'Click to vote'}</p>
                </div>
              )}
            </div>

            {/* Reactions Summary */}
            <div className="post-stats">
              <div className="reactions-summary">
                <div className="reaction-icons">
                  <span className="reaction-emoji">👍</span>
                  <span className="reaction-emoji">❤️</span>
                  <span className="reaction-emoji">💡</span>
                </div>
                <span className="reactions-count">{post.likes}</span>
              </div>
              <div className="post-stats-right">
                <span 
                  className="clickable-stat"
                  onClick={() => handleComment(post.id)}
                >
                  {post.comments} comments
                </span>
                <span className="stat-divider">·</span>
                <span 
                  className="clickable-stat"
                  onClick={() => handleShare(post.id)}
                >
                  {post.shares} shares
                </span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <button 
                className={`action-btn ${post.liked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <ThumbsUp size={20} />
                Like
              </button>
              <button 
                className="action-btn"
                onClick={() => handleComment(post.id)}
              >
                <MessageCircle size={20} />
                Comment
              </button>
              <button 
                className="action-btn"
                onClick={() => handleShare(post.id)}
              >
                <Share2 size={20} />
                Share
              </button>
              <button 
                className={`action-btn ${post.bookmarked ? 'bookmarked' : ''}`}
                onClick={() => handleBookmark(post.id)}
              >
                <Bookmark size={20} />
                Save
              </button>
            </div>

            {/* Comments Section */}
            {showComments[post.id] && (
              <div className="comments-section">
                {/* Existing Comments */}
                {postComments[post.id] && postComments[post.id].length > 0 && (
                  <div className="comments-list">
                    {postComments[post.id].map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-timestamp">{comment.timestamp}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                          <div className="comment-actions">
                            <button 
                              className={`comment-like-btn ${comment.liked ? 'liked' : ''}`}
                              onClick={() => handleLikeComment(post.id, comment.id)}
                            >
                              <ThumbsUp size={14} />
                              {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>
                            <button className="comment-reply-btn">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="add-comment">
                  <img src="/api/placeholder/40/40" alt="You" className="comment-avatar" />
                  <div className="comment-input-wrapper">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText(prev => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <button 
                      className="comment-send-btn"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentText[post.id] || !commentText[post.id].trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
            ))}
            
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={() => fetchFeed(page + 1)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Load More */}
      <button className="load-more-btn">
        Load more posts
      </button>
    </div>
  );
};

export default FeedSection;
