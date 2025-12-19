import React, { useState } from 'react';
import { X, Users, Globe, Lock, Crown, MessageCircle, Bell, Share2, Settings, ArrowLeft, TrendingUp } from 'lucide-react';
import './GroupDetailsModal.css';

const GroupDetailsModal = ({ isOpen, onClose, group, isJoined }) => {
  const [activeTab, setActiveTab] = useState('about');

  if (!isOpen || !group) return null;

  const mockPosts = [
    {
      id: 1,
      author: 'John Doe',
      content: 'Great discussion about the latest updates!',
      likes: 24,
      comments: 8,
      time: '2 hours ago'
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Looking forward to the next meetup!',
      likes: 15,
      comments: 5,
      time: '5 hours ago'
    }
  ];

  const mockMembers = [
    { id: 1, name: 'John Doe', role: 'Admin', avatar: '/api/placeholder/40/40' },
    { id: 2, name: 'Jane Smith', role: 'Moderator', avatar: '/api/placeholder/40/40' },
    { id: 3, name: 'Mike Johnson', role: 'Member', avatar: '/api/placeholder/40/40' },
    { id: 4, name: 'Sarah Williams', role: 'Member', avatar: '/api/placeholder/40/40' }
  ];

  return (
    <div className="group-details-modal-overlay" onClick={onClose}>
      <div className="group-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="back-btn" onClick={onClose}>
          <ArrowLeft size={20} />
          Back to Groups
        </button>

        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Group Header */}
        <div className="group-details-header">
          <img src={group.image} alt={group.name} className="group-header-image" />
          <div className="group-header-overlay">
            <div className="group-header-content">
              <div className="group-title-section">
                <h1>{group.name}</h1>
                <div className="group-meta">
                  {group.privacy === 'private' ? (
                    <span className="privacy-badge private">
                      <Lock size={16} />
                      Private Group
                    </span>
                  ) : (
                    <span className="privacy-badge public">
                      <Globe size={16} />
                      Public Group
                    </span>
                  )}
                  <span className="members-badge">
                    <Users size={16} />
                    {group.members.toLocaleString()} members
                  </span>
                  {group.role && (
                    <span className="role-badge">
                      <Crown size={16} />
                      {group.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Actions */}
        <div className="group-actions-bar">
          <div className="primary-actions">
            {isJoined ? (
              <>
                <button className="btn-action primary">
                  <MessageCircle size={18} />
                  Discuss
                </button>
                <button className="btn-action secondary">
                  <Bell size={18} />
                  Notifications
                </button>
              </>
            ) : (
              <button className="btn-action primary">
                <Users size={18} />
                Join Group
              </button>
            )}
          </div>
          <div className="secondary-actions">
            <button className="icon-btn">
              <Share2 size={18} />
            </button>
            {group.role === 'admin' && (
              <button className="icon-btn">
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="group-tabs">
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
            {group.unreadPosts > 0 && (
              <span className="tab-badge">{group.unreadPosts}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
        </div>

        {/* Content */}
        <div className="group-details-content">
          {activeTab === 'about' && (
            <div className="about-section">
              <div className="info-card">
                <h3>About This Group</h3>
                <p>{group.description}</p>
                <p>
                  This group brings together professionals who are passionate about {group.name.toLowerCase()}. 
                  Join us to share insights, ask questions, and connect with like-minded individuals from around the world.
                </p>
              </div>

              <div className="info-card">
                <h3>Group Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <Users size={24} />
                    <div className="stat-info">
                      <span className="stat-value">{group.members.toLocaleString()}</span>
                      <span className="stat-label">Members</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <MessageCircle size={24} />
                    <div className="stat-info">
                      <span className="stat-value">234</span>
                      <span className="stat-label">Posts</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <TrendingUp size={24} />
                    <div className="stat-info">
                      <span className="stat-value">+{Math.floor(group.members * 0.05)}</span>
                      <span className="stat-label">This Week</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Group Rules</h3>
                <ul className="rules-list">
                  <li>Be respectful and professional at all times</li>
                  <li>No spam or self-promotion without permission</li>
                  <li>Stay on topic and contribute meaningfully</li>
                  <li>Help others and share your knowledge</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              {mockPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-author">
                    <div className="author-avatar" />
                    <div className="author-info">
                      <span className="author-name">{post.author}</span>
                      <span className="post-time">{post.time}</span>
                    </div>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-stats">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-section">
              <div className="members-list">
                {mockMembers.map((member) => (
                  <div key={member.id} className="member-card">
                    <img src={member.avatar} alt={member.name} className="member-avatar" />
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                    <button className="btn-message">Message</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
