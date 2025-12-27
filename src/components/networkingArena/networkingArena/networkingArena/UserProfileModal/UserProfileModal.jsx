import React, { useState } from 'react';
import { X, Briefcase, MapPin, Users, Award, ExternalLink, UserPlus, UserCheck, Mail, MessageCircle, Calendar, Link2, TrendingUp } from 'lucide-react';
import './UserProfileModal.css';

const UserProfileModal = ({ user, onClose, onFollow, onUnfollow, onConnect, onMessage }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isConnected, setIsConnected] = useState(user.connected || false);

  if (!user) return null;

  const handleFollow = () => {
    if (isFollowing) {
      onUnfollow && onUnfollow(user.id);
      setIsFollowing(false);
    } else {
      onFollow && onFollow(user.id);
      setIsFollowing(true);
    }
  };

  const handleConnect = () => {
    onConnect && onConnect(user.id);
  };

  const handleMessage = () => {
    onMessage && onMessage(user.id);
  };

  const handleEmail = () => {
    // Create mailto link with user's email
    const email = user.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@${user.company.toLowerCase().replace(/\s+/g, '')}.com`;
    const subject = encodeURIComponent(`Connecting from Planning Insights`);
    const body = encodeURIComponent(`Hi ${user.name.split(' ')[0]},\n\nI'd like to connect with you on Planning Insights.\n\nBest regards`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="user-profile-modal-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Header Section */}
        <div className="profile-modal-header">
          <div className="profile-banner"></div>
          <div className="profile-header-content">
            <img src={user.avatar || '/api/placeholder/120/120'} alt={user.name} className="profile-large-avatar" />
            <div className="profile-header-info">
              <h2>{user.name}</h2>
              <p className="profile-modal-title">{user.title}</p>
              <p className="profile-modal-company">
                <Briefcase size={16} />
                {user.company}
              </p>
              {user.location && (
                <p className="profile-modal-location">
                  <MapPin size={16} />
                  {user.location}
                </p>
              )}
              <div className="profile-stats-mini">
                <span>
                  <Users size={14} />
                  {user.mutualConnections} mutual connections
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-modal-actions">
          {!isConnected ? (
            <button className="btn-primary" onClick={handleConnect}>
              <UserPlus size={18} />
              Connect
            </button>
          ) : (
            <button className="btn-connected" disabled>
              <UserCheck size={18} />
              Connected
            </button>
          )}
          
          <button 
            className={`btn-follow ${isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            {isFollowing ? (
              <>
                <UserCheck size={18} />
                Following
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Follow
              </>
            )}
          </button>

          <button className="btn-message" onClick={handleMessage}>
            <MessageCircle size={18} />
            Message
          </button>

          <button className="btn-more" onClick={handleEmail}>
            <Mail size={18} />
            Email
          </button>
        </div>

        {/* About Section */}
        <div className="profile-modal-section">
          <h3>About</h3>
          <p className="about-text">
            {user.about || `${user.title} at ${user.company} with expertise in ${user.industry || 'various areas'}. Passionate about innovation and growth.`}
          </p>
        </div>

        {/* Experience Section */}
        {user.experience && (
          <div className="profile-modal-section">
            <h3>
              <Briefcase size={20} />
              Experience
            </h3>
            <div className="experience-list">
              <div className="experience-item">
                <div className="experience-icon">
                  <Briefcase size={24} />
                </div>
                <div className="experience-details">
                  <h4>{user.title}</h4>
                  <p className="experience-company">{user.company}</p>
                  <p className="experience-duration">2020 - Present · 4 yrs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="profile-modal-section">
            <h3>
              <Award size={20} />
              Skills
            </h3>
            <div className="skills-grid">
              {user.skills.map((skill, idx) => (
                <div key={idx} className="skill-item-modal">
                  <span className="skill-name">{skill}</span>
                  {user.endorsements && (
                    <span className="skill-endorsements">{user.endorsements[idx] || 0} endorsements</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Section */}
        <div className="profile-modal-section">
          <h3>
            <TrendingUp size={20} />
            Activity & Insights
          </h3>
          <div className="activity-stats">
            <div className="activity-stat">
              <span className="stat-label">Profile Views</span>
              <span className="stat-value">{Math.floor(Math.random() * 500) + 100}</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label">Post Impressions</span>
              <span className="stat-value">{Math.floor(Math.random() * 2000) + 500}</span>
            </div>
            <div className="activity-stat">
              <span className="stat-label">Connections</span>
              <span className="stat-value">{Math.floor(Math.random() * 500) + 100}</span>
            </div>
          </div>
        </div>

        {/* Interests/Reasons Section */}
        {user.reason && (
          <div className="profile-modal-section">
            <h3>Why you might know {user.name.split(' ')[0]}</h3>
            <p className="connection-reason">
              <TrendingUp size={16} />
              {user.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
