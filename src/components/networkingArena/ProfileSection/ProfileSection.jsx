import React, { useState } from 'react';
import { User, Award, Eye, TrendingUp, Link2, Edit, Check, Star, Shield } from 'lucide-react';
import './ProfileSection.css';

const ProfileSection = ({ userRole, setUserRole }) => {
  const [profileData] = useState({
    name: 'John Smith',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    profileViews: 1234,
    connections: 234,
    postImpressions: 5432,
    profileStrength: 85,
    customUrl: 'johnsmith-tech',
    verified: userRole === 'premium' || userRole === 'recruiter',
    skills: [
      { name: 'React', endorsements: 45 },
      { name: 'Node.js', endorsements: 38 },
      { name: 'Python', endorsements: 32 },
      { name: 'AWS', endorsements: 28 },
    ],
    badges: []
  });

  // Set badges based on user role
  if (userRole === 'premium') {
    profileData.badges = ['Premium Member', 'Industry Expert'];
  } else if (userRole === 'recruiter') {
    profileData.badges = ['Verified Recruiter', 'Top Hiring Manager'];
  }

  const getStrengthColor = (strength) => {
    if (strength >= 80) return '#10b981';
    if (strength >= 60) return '#3b82f6';
    if (strength >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="profile-section">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/api/placeholder/80/80" alt={profileData.name} />
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

        <button className="edit-profile-btn">
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
    </div>
  );
};

export default ProfileSection;
