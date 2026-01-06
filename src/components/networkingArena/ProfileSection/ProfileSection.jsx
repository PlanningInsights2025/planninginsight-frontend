import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User, Award, Eye, TrendingUp, Link2, Edit, Check, Star, Shield, X } from 'lucide-react';
import './ProfileSection.css';
import { useAuth } from '@/contexts/AuthContext';
import * as profileAPI from '@/services/api/profile';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    name: userName,
    firstName: '',
    lastName: '',
    title: '',
    company: '',
    location: '',
    bio: '',
    profileViews: 0,
    connections: 0,
    postImpressions: 0,
    profileStrength: 0,
    linkedinUrl: '',
    verified: false,
    skills: [],
    badges: []
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.getProfileStats();
      
      if (response.success && response.stats) {
        // Merge response stats with existing profileData
        setProfileData(prev => ({
          ...prev,
          ...response.stats,
          connections: response.stats.connections || 0,
          postImpressions: response.stats.posts || 0,
          profileViews: response.stats.views || 0
        }));
        
        // Update userRole based on actual role from backend if available
        if (response.stats.role === 'premium' || response.stats.role === 'admin') {
          setUserRole(response.stats.role === 'admin' ? 'premium' : response.stats.role);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Silently fail - default values will be used
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength >= 80) return '#10b981';
    if (strength >= 60) return '#3b82f6';
    if (strength >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const handleSaveProfile = async () => {
    try {
      const response = await profileAPI.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        position: profileData.title,
        organization: profileData.company,
        location: profileData.location,
        bio: profileData.bio,
        linkedinUrl: profileData.linkedinUrl,
        skills: profileData.skills
      });
      
      if (response.success) {
        setShowEditModal(false);
        setShowSuccessMessage(true);
        toast.success('Profile updated successfully!');
        
        // Refresh profile data
        await fetchProfileData();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Silently fail
    }
  };

  if (isLoading) {
    return (
      <div className="profile-section">
        <div className="profile-main-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="success-toast">
          <Check size={20} />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Single Main Container Box */}
      <div className="profile-main-container">
        
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

        {/* Divider */}
        <div className="profile-divider"></div>

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

      {/* Divider */}
      <div className="profile-divider"></div>

      {/* Custom URL */}
      <div className="custom-url">
        <Link2 size={16} />
        <span className="url-text">
          {profileData.linkedinUrl || 'No LinkedIn profile added'}
        </span>
      </div>

      {/* Divider */}
      <div className="profile-divider"></div>

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

      {/* Divider */}
      {profileData.badges.length > 0 && <div className="profile-divider"></div>}

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

      {/* Divider */}
      <div className="profile-divider"></div>

      {/* Top Skills with Endorsements */}
      <div className="profile-skills">
        <h4>Top Skills</h4>
        {profileData.skills && profileData.skills.length > 0 ? (
          <div className="skills-list">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-endorsements">
                    <Star size={14} />
                    {skill.endorsements || 0}
                  </span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-fill"
                    style={{ width: `${Math.min((skill.endorsements / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-skills">No skills added yet. Add skills to your profile!</p>
        )}
      </div>

      {/* Divider */}
      <div className="profile-divider"></div>

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

      {/* Close Main Container */}
      </div>

      {/* Edit Profile Modal - Rendered via Portal */}
      {showEditModal && ReactDOM.createPortal(
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
                <label>First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  placeholder="Your first name"
                />
              </div>

              <div className="edit-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  placeholder="Your last name"
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
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  value={profileData.linkedinUrl}
                  onChange={(e) => setProfileData({...profileData, linkedinUrl: e.target.value})}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>

              <div className="edit-field">
                <label>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProfileSection;
