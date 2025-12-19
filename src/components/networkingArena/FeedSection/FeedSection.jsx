import React, { useState, useEffect, useRef } from 'react';
import { 
  ThumbsUp, MessageCircle, Share2, Bookmark, Send, Image, Video, 
  FileText, BarChart3, MoreHorizontal, Globe, Users, Lock, X, Smile,
  Edit, Trash2, Flag, Copy 
} from 'lucide-react';
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

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: '/api/placeholder/50/50',
      title: 'Product Manager at Google',
      timestamp: '2 hours ago',
      content: 'Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform! 🚀 The journey from concept to launch was incredible, and I\'m grateful for the amazing team that made it possible.',
      image: '/api/placeholder/600/400',
      likes: 145,
      comments: 23,
      shares: 12,
      liked: false,
      bookmarked: false,
      type: 'image'
    },
    {
      id: 2,
      author: 'David Wilson',
      avatar: '/api/placeholder/50/50',
      title: 'Tech Entrepreneur',
      timestamp: '3 hours ago',
      content: 'Check out our latest product demo! This is going to change everything in the industry. 🎥',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      likes: 178,
      comments: 32,
      shares: 19,
      liked: false,
      bookmarked: false,
      type: 'video'
    },
    {
      id: 4,
      author: 'Michael Chen',
      avatar: '/api/placeholder/50/50',
      title: 'Data Scientist at Amazon',
      timestamp: '5 hours ago',
      content: 'Just published a new article on Machine Learning best practices! Check it out and let me know your thoughts. 📊',
      likes: 89,
      comments: 15,
      shares: 8,
      liked: true,
      bookmarked: true,
      type: 'article',
      article: {
        title: 'Machine Learning Best Practices for 2024',
        link: 'https://medium.com/@example/ml-best-practices'
      }
    },
    {
      id: 5,
      author: 'Emily Rodriguez',
      avatar: '/api/placeholder/50/50',
      title: 'UX Designer at Apple',
      timestamp: '1 day ago',
      content: 'What\'s the most important skill for designers in 2024?',
      likes: 234,
      comments: 67,
      shares: 34,
      liked: false,
      bookmarked: false,
      type: 'poll',
      poll: {
        question: 'Most important design skill?',
        options: [
          { id: 1, text: 'User Research', votes: 45, percentage: 30 },
          { id: 2, text: 'Prototyping', votes: 35, percentage: 23 },
          { id: 3, text: 'AI/ML Integration', votes: 50, percentage: 33 },
          { id: 4, text: 'Accessibility', votes: 20, percentage: 14 }
        ],
        totalVotes: 150,
        userVoted: null
      }
    }
  ]);

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

  const handleLike = (postId) => {
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
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, bookmarked: !post.bookmarked };
      }
      return post;
    }));
    
    // Show feedback message
    const post = posts.find(p => p.id === postId);
    if (post) {
      alert(post.bookmarked ? 'Post removed from saved items' : 'Post saved successfully!');
    }
  };

  const handleComment = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId) => {
    const comment = commentText[postId];
    if (comment && comment.trim()) {
      const newComment = {
        id: Date.now(),
        author: currentUser?.name || 'User',
        avatar: currentUser?.avatar || '/api/placeholder/40/40',
        text: comment,
        timestamp: 'Just now',
        likes: 0,
        liked: false
      };

      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));

      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments + 1
          };
        }
        return p;
      }));

      setCommentText(prev => ({
        ...prev,
        [postId]: ''
      }));
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

  const handleShare = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const options = [
        'Share on your feed',
        'Share in a message',
        'Copy link to post',
        'Share via email'
      ];
      
      const choice = prompt(
        `Share ${post.author}'s post:\n\n` +
        '1. Share on your feed\n' +
        '2. Share in a message\n' +
        '3. Copy link to post\n' +
        '4. Share via email\n\n' +
        'Enter your choice (1-4):'
      );
      
      if (choice) {
        const choiceNum = parseInt(choice);
        if (choiceNum >= 1 && choiceNum <= 4) {
          setPosts(posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                shares: p.shares + 1
              };
            }
            return p;
          }));
          alert(`Post shared: ${options[choiceNum - 1]}`);
        }
      }
    }
  };

  const handlePollVote = (postId, optionId) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.type === 'poll' && post.poll) {
        // Check if user already voted
        if (post.poll.userVoted) {
          alert('You have already voted in this poll!');
          return post;
        }

        // Calculate new votes
        const updatedOptions = post.poll.options.map(option => {
          if (option.id === optionId) {
            return {
              ...option,
              votes: option.votes + 1
            };
          }
          return option;
        });

        const newTotalVotes = post.poll.totalVotes + 1;

        // Recalculate percentages
        const optionsWithPercentages = updatedOptions.map(option => ({
          ...option,
          percentage: Math.round((option.votes / newTotalVotes) * 100)
        }));

        return {
          ...post,
          poll: {
            ...post.poll,
            options: optionsWithPercentages,
            totalVotes: newTotalVotes,
            userVoted: optionId
          }
        };
      }
      return post;
    }));
  };

  const togglePostMenu = (postId) => {
    setShowPostMenu(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
      setShowPostMenu({});
    }
  };

  const handleEditPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setPostText(post.content);
      setShowCreatePost(true);
      setShowPostMenu({});
      // You could add more logic here to pre-fill other fields
    }
  };

  const handleReportPost = (postId) => {
    alert('Post reported. Our team will review it shortly.');
    setShowPostMenu({});
  };

  const handleCopyLink = (postId) => {
    const link = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
    setShowPostMenu({});
  };

  const handleOpenPostCreator = (type) => {
    setPostType(type);
    setShowCreatePost(true);
  };

  const handleCreatePost = () => {
    if (!postText.trim() && !mediaFile && postType !== 'poll') return;

    const newPost = {
      id: Date.now(),
      author: currentUser?.name || 'User',
      avatar: currentUser?.avatar || '/api/placeholder/50/50',
      title: 'Your Professional Title',
      timestamp: 'Just now',
      content: postText,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false,
      type: postType
    };

    if (postType === 'image' && mediaFile) {
      newPost.image = URL.createObjectURL(mediaFile);
    }

    if (postType === 'video' && mediaFile) {
      newPost.video = URL.createObjectURL(mediaFile);
    }

    if (postType === 'article') {
      newPost.articleTitle = articleTitle;
      newPost.articleLink = articleLink;
    }

    if (postType === 'poll') {
      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length >= 2) {
        newPost.poll = {
          question: postText,
          options: validOptions.map((text, index) => ({
            id: index + 1,
            text,
            votes: 0,
            percentage: 0
          })),
          totalVotes: 0,
          userVoted: null
        };
      }
    }

    setPosts([newPost, ...posts]);
    resetPostForm();
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
      </div>

      {/* Load More */}
      <button className="load-more-btn">
        Load more posts
      </button>
    </div>
  );
};

export default FeedSection;
