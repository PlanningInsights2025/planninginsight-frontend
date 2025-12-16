import React, { useState } from 'react';
import { 
  ThumbsUp, MessageCircle, Share2, Bookmark, Send, Image, Video, 
  FileText, BarChart3, MoreHorizontal, Globe, Users, Lock, X, Smile 
} from 'lucide-react';
import './FeedSection.css';

const FeedSection = ({ userRole }) => {
  const [postText, setPostText] = useState('');
  const [postPrivacy, setPostPrivacy] = useState('public');
  const [showCreatePost, setShowCreatePost] = useState(false);

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
      author: 'Michael Chen',
      avatar: '/api/placeholder/50/50',
      title: 'Data Scientist at Amazon',
      timestamp: '5 hours ago',
      content: 'Just published a new article on Machine Learning best practices! Check it out and let me know your thoughts. Link in comments 👇',
      likes: 89,
      comments: 15,
      shares: 8,
      liked: true,
      bookmarked: true,
      type: 'article',
      poll: null
    },
    {
      id: 3,
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
        userVoted: 3
      }
    }
  ]);

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
  };

  const handleCreatePost = () => {
    if (!postText.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: 'You',
      avatar: '/api/placeholder/50/50',
      title: 'Your Professional Title',
      timestamp: 'Just now',
      content: postText,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false,
      type: 'text'
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setShowCreatePost(false);
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
          <button className="post-action-btn">
            <Image size={20} className="action-icon photo" />
            Photo
          </button>
          <button className="post-action-btn">
            <Video size={20} className="action-icon video" />
            Video
          </button>
          <button className="post-action-btn">
            <FileText size={20} className="action-icon article" />
            Article
          </button>
          <button className="post-action-btn">
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
                placeholder="What do you want to talk about?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                autoFocus
              />
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
              <button className="post-menu-btn">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <div className="post-content">
              <p>{post.content}</p>
              
              {post.type === 'image' && post.image && (
                <img src={post.image} alt="Post content" className="post-image" />
              )}

              {post.type === 'poll' && post.poll && (
                <div className="post-poll">
                  <h4>{post.poll.question}</h4>
                  <div className="poll-options">
                    {post.poll.options.map((option) => (
                      <div 
                        key={option.id} 
                        className={`poll-option ${post.poll.userVoted === option.id ? 'voted' : ''}`}
                      >
                        <div className="poll-option-bar" style={{ width: `${option.percentage}%` }} />
                        <div className="poll-option-content">
                          <span className="option-text">{option.text}</span>
                          <span className="option-percentage">{option.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="poll-votes">{post.poll.totalVotes} votes</p>
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
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
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
              <button className="action-btn">
                <MessageCircle size={20} />
                Comment
              </button>
              <button className="action-btn">
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
