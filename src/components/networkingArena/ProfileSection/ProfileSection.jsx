import React, { useState, useEffect } from 'react';
import { User, Award, Eye, TrendingUp, Link2, Edit, Check, Star, Shield, X } from 'lucide-react';
import './ProfileSection.css';
import { useAuth } from '../../../contexts/AuthContext';

const ProfileSection = ({ userRole, setUserRole }) => {
  const { user } = useAuth();
  
  // Fix undefined name issue
  let userName = 'User';
  if (user?.displayName) {
    userName = user.displayName;
  } else if (user?.firstName) {
    userName = user.firstName + (user.lastName ? ' ' + user.lastName : '');
  }
  
  const userPhoto = user?.photoURL || '/api/placeholder/80/80';
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: userName,
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    profileViews: 1234,
    connections: 234,
    postImpressions: 5432,
    profileStrength: 85,
    customUrl: (userName.toLowerCase().replace(/\s+/g, '') || 'user') + '-tech',
    verified: userRole === 'premium' || userRole === 'recruiter',
    skills: [
      { name: 'React', endorsements: 45 },
      { name: 'Node.js', endorsements: 38 },
      { name: 'Python', endorsements: 32 },
      { name: 'AWS', endorsements: 28 },
    ],
    badges: []
  });

  // Update profile data when user role changes
  useEffect(() => {
    let newBadges = [];
    let isVerified = false;
    
    if (userRole === 'premium') {
      newBadges = ['Premium Member', 'Industry Expert'];
      isVerified = true;
    } else if (userRole === 'recruiter') {
      newBadges = ['Verified Recruiter', 'Top Hiring Manager'];
      isVerified = true;
    } else {
      newBadges = [];
      isVerified = false;
    }
    
    setProfileData(prev => ({
      ...prev,
      badges: newBadges,
      verified: isVerified
    }));
  }, [userRole]);

  const getStrengthColor = (strength) => {
    if (strength >= 80) return '#10b981';
    if (strength >= 60) return '#3b82f6';
    if (strength >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const handleSaveProfile = () => {
    // Save profile data
    alert('Profile updated successfully!');
    setShowEditModal(false);
  };

  return (
    <div className="profile-section">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={userPhoto} alt={profileData.name} />
          {profileData.verified && (
            <div className="verified-badge">
              <Check size={16} />
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">
            {profileData.name}
            {profileData.verified && <Shield size={18} className="verify-icon" />}
          </h2>
          <p className="profile-title">{profileData.title}</p>
          <p className="profile-company">{profileData.company}</p>
          <p className="profile-location">{profileData.location}</p>
        </div>

        <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}>
          <Edit size={16} />
        </button>
      </div>

      {/* Profile Strength */}
      <div className="profile-strength">
        <div className="strength-header">
          <span className="strength-label">Profile Strength</span>
          <span className="strength-value">{profileData.profileStrength}%</span>
        </div>
        <div className="strength-bar">
          <div 
            className="strength-fill"
            style={{ 
              width: `${profileData.profileStrength}%`,
              backgroundColor: getStrengthColor(profileData.profileStrength)
            }}
          />
        </div>
        <p className="strength-tip">
          {profileData.profileStrength >= 80 
            ? '🎉 Your profile is looking great!' 
            : '💡 Add more skills and endorsements to improve'}
        </p>
      </div>

      {/* Custom URL */}
      <div className="custom-url">
        <Link2 size={16} />
        <span className="url-text">linkedin.com/in/{profileData.customUrl}</span>
      </div>

      {/* Badges */}
      {profileData.badges.length > 0 && (
        <div className="profile-badges">
          <h4>Badges & Achievements</h4>
          <div className="badges-list">
            {profileData.badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <Award size={16} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <Eye size={18} />
          <div className="stat-info">
            <span className="stat-value">{profileData.profileViews}</span>
            <span className="stat-label">Profile Views</span>
          </div>
        </div>
        <div className="stat-item">
          <User size={18} />
          <div className="stat-info">
            <span className="stat-value">{profileData.connections}</span>
            <span className="stat-label">Connections</span>
          </div>
        </div>
        <div className="stat-item">
          <TrendingUp size={18} />
          <div className="stat-info">
            <span className="stat-value">{profileData.postImpressions}</span>
            <span className="stat-label">Post Impressions</span>
          </div>
        </div>
      </div>

      {/* Top Skills with Endorsements */}
      <div className="profile-skills">
        <h4>Top Skills</h4>
        <div className="skills-list">
          {profileData.skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-endorsements">
                  <Star size={14} />
                  {skill.endorsements}
                </span>
              </div>
              <div className="skill-bar">
                <div 
                  className="skill-fill"
                  style={{ width: `${(skill.endorsements / 50) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Switcher (Demo Purpose) */}
      <div className="role-switcher">
        <h4>View As:</h4>
        <div className="role-buttons">
          <button 
            className={`role-btn ${userRole === 'professional' ? 'active' : ''}`}
            onClick={() => setUserRole('professional')}
          >
            Professional
          </button>
          <button 
            className={`role-btn ${userRole === 'recruiter' ? 'active' : ''}`}
            onClick={() => setUserRole('recruiter')}
          >
            Recruiter
          </button>
          <button 
            className={`role-btn ${userRole === 'premium' ? 'active' : ''}`}
            onClick={() => setUserRole('premium')}
          >
            Premium
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="edit-modal-body">
              <div className="edit-field">
                <label>Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="Your full name"
                />
              </div>

              <div className="edit-field">
                <label>Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                  placeholder="Your professional title"
                />
              </div>

              <div className="edit-field">
                <label>Company</label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  placeholder="Your company"
                />
              </div>

              <div className="edit-field">
                <label>Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  placeholder="Your location"
                />
              </div>

              <div className="edit-field">
                <label>Custom URL</label>
                <div className="url-input-wrapper">
                  <span className="url-prefix">linkedin.com/in/</span>
                  <input
                    type="text"
                    value={profileData.customUrl}
                    onChange={(e) => setProfileData({...profileData, customUrl: e.target.value})}
                    placeholder="your-custom-url"
                  />
                </div>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
