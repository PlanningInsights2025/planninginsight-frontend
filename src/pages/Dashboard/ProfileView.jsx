import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Award,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Share2,
  Download,
  ArrowLeft
} from 'lucide-react'
import './ProfileView.css'

/**
 * Profile View Page
 * Displays user's profile information with photo and details
 * Allows viewing and editing profile
 */
const ProfileView = () => {
  const { user, isAuthenticated } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [downloadToast, setDownloadToast] = useState(false)
  const [messageToast, setMessageToast] = useState(false)
  const [editToast, setEditToast] = useState(false)

  /**
   * Initialize profile data
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      // If userId param exists and doesn't match current user, load different profile
      // For now, we'll show current user's profile
      setProfile(user)
      setIsOwnProfile(true)
      
      // Mock additional profile data
      setProfile(prev => ({
        ...prev,
        bio: prev.bio || 'Urban planning professional with passion for sustainable development',
        location: prev.location || 'Mumbai, India',
        phone: prev.phone || '+91 XXXXXXXXXX',
        website: prev.website || 'www.example.com',
        linkedin: prev.linkedin || 'linkedin.com/in/example',
        github: prev.github || 'github.com/example',
        joinDate: new Date('2024-01-15'),
        badges: [
          { id: 1, name: 'Verified User', icon: '✓', color: '#10b981' },
          { id: 2, name: 'Active Contributor', icon: '⭐', color: '#f59e0b' },
          { id: 3, name: 'Course Completer', icon: '📚', color: '#8b5cf6' }
        ],
        stats: {
          articlesPublished: 5,
          coursesCompleted: 3,
          jobsApplied: 12,
          forumPosts: 28,
          connections: 156
        },
        education: [
          {
            institution: 'University of Mumbai',
            degree: 'Bachelor of Planning',
            field: 'Urban Planning',
            year: '2022',
            grade: '9.2/10'
          },
          {
            institution: 'IIT Delhi',
            degree: 'Short Course',
            field: 'GIS and Remote Sensing',
            year: '2023'
          }
        ],
        experience: [
          {
            company: 'City Development Corporation',
            position: 'Junior Urban Planner',
            location: 'Mumbai, India',
            startDate: '2022-06',
            endDate: 'Present',
            description: 'Working on sustainable city projects and community development initiatives'
          },
          {
            company: 'Urban Design Institute',
            position: 'Intern',
            location: 'Mumbai, India',
            startDate: '2021-05',
            endDate: '2021-08',
            description: 'Assisted in urban design projects and urban planning research'
          }
        ],
        skills: ['Urban Planning', 'GIS', 'Sustainability', 'Project Management', 'Data Analysis', 'Community Engagement'],
        uniqueCode: 'PLAN-20240115-0001'
      }))
    }

    // Apply dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isAuthenticated, user, userId])

  /**
   * Handle share profile
   */
  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile/${profile.uniqueCode}`
    
    if (navigator.share) {
      navigator.share({
        title: `${profile.displayName}'s Profile`,
        text: `Check out ${profile.displayName}'s profile on Planning Insights`,
        url: profileUrl
      }).catch(err => console.log('Share cancelled'))
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(profileUrl)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 3000)
    }
  }

  /**
   * Handle download profile as PDF/document
   */
  const handleDownload = () => {
    const profileData = `
PROFILE SUMMARY
===============

Name: ${profile.displayName || `${profile.firstName} ${profile.lastName}`}
ID: ${profile.uniqueCode}
Email: ${profile.email}
Location: ${profile.location}
Phone: ${profile.phone}

BIO:
${profile.bio}

STATS:
- Articles Published: ${profile.stats?.articlesPublished || 0}
- Courses Completed: ${profile.stats?.coursesCompleted || 0}
- Jobs Applied: ${profile.stats?.jobsApplied || 0}
- Forum Posts: ${profile.stats?.forumPosts || 0}
- Connections: ${profile.stats?.connections || 0}

SKILLS:
${profile.skills?.join(', ') || 'No skills added'}

EDUCATION:
${profile.education?.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') || 'No education added'}

EXPERIENCE:
${profile.experience?.map(exp => `- ${exp.position} at ${exp.company} (${new Date(exp.startDate).toLocaleDateString()})`).join('\n') || 'No experience added'}
    `
    
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(profileData))
    element.setAttribute('download', `${profile.displayName}-profile.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    setDownloadToast(true)
    setTimeout(() => setDownloadToast(false), 3000)
  }

  /**
   * Handle message button
   */
  const handleMessage = () => {
    setMessageToast(true)
    setTimeout(() => setMessageToast(false), 3000)
  }

  /**
   * Handle connect button
   */
  const handleConnect = () => {
    alert(`Connection request sent to ${profile.displayName}`)
  }

  /**
   * Handle edit profile navigation
   */
  const handleEditProfile = () => {
    setEditToast(true)
    setTimeout(() => setEditToast(false), 3000)
    navigate('/profile/edit')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-view-error">
        <div className="error-message">
          <p>Please log in to view profiles.</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-view-loading">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  /**
   * Render profile header with photo and basic info
   */
  const renderProfileHeader = () => (
    <div className="profile-view-header">
      <div className="profile-header-background"></div>
      
      <div className="profile-header-content">
        <div className="profile-photo-section">
          <div className="profile-photo">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} />
            ) : (
              <div className="profile-photo-placeholder">
                {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="profile-info-section">
          <div className="profile-title-block">
            <h1 className="profile-name">
              {profile.displayName || `${profile.firstName} ${profile.lastName}`}
              {profile.uniqueCode && (
                <span className="unique-code-badge">{profile.uniqueCode}</span>
              )}
            </h1>
            <p className="profile-bio">{profile.bio}</p>
          </div>

          <div className="profile-meta">
            {profile.location && (
              <div className="meta-item">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="meta-item">
                <Mail size={16} />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="meta-item">
                <Phone size={16} />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          <div className="profile-actions">
            {isOwnProfile ? (
              <button 
                onClick={handleEditProfile}
                className="btn btn-primary edit-profile-btn"
                title="Edit your profile"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleConnect}>
                  Connect
                </button>
                <button className="btn btn-outline" onClick={handleMessage}>
                  Message
                </button>
              </>
            )}
            <button 
              className="btn btn-outline btn-icon" 
              onClick={handleShare}
              title="Share profile"
              aria-label="Share profile"
            >
              <Share2 size={16} />
            </button>
            <button 
              className="btn btn-outline btn-icon" 
              onClick={handleDownload}
              title="Download profile"
              aria-label="Download profile"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Render badges
   */
  const renderBadges = () => (
    <div className="badges-container">
      <h3>Badges & Achievements</h3>
      <div className="badges-grid">
        {profile.badges?.map((badge) => (
          <div key={badge.id} className="badge-item" style={{ borderColor: badge.color }}>
            <div className="badge-icon" style={{ color: badge.color }}>
              {badge.icon}
            </div>
            <span className="badge-name">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  )

  /**
   * Render stats
   */
  const renderStats = () => (
    <div className="stats-container">
      <div className="stat-item">
        <div className="stat-number">{profile.stats?.articlesPublished || 0}</div>
        <div className="stat-label">Articles</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{profile.stats?.coursesCompleted || 0}</div>
        <div className="stat-label">Courses</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{profile.stats?.jobsApplied || 0}</div>
        <div className="stat-label">Jobs Applied</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{profile.stats?.forumPosts || 0}</div>
        <div className="stat-label">Forum Posts</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{profile.stats?.connections || 0}</div>
        <div className="stat-label">Connections</div>
      </div>
    </div>
  )

  /**
   * Render social links
   */
  const renderSocialLinks = () => (
    <div className="social-links-container">
      <h3>Connect</h3>
      <div className="social-links">
        {profile.website && (
          <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="social-link">
            <Globe size={18} />
            <span>Website</span>
          </a>
        )}
        {profile.linkedin && (
          <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-link">
            <Linkedin size={18} />
            <span>LinkedIn</span>
          </a>
        )}
        {profile.github && (
          <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="social-link">
            <Github size={18} />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  )

  /**
   * Render education section
   */
  const renderEducation = () => (
    <div className="section-container">
      <div className="section-header">
        <GraduationCap size={20} />
        <h3>Education</h3>
      </div>

      <div className="education-list">
        {profile.education?.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="education-content">
              <h4>{edu.degree}</h4>
              <p className="institution">{edu.institution}</p>
              {edu.field && <p className="field">{edu.field}</p>}
              <div className="education-meta">
                {edu.year && <span>{edu.year}</span>}
                {edu.grade && <span>Grade: {edu.grade}</span>}
              </div>
            </div>
          </div>
        ))}

        {(!profile.education || profile.education.length === 0) && (
          <p className="empty-state">No education information added yet.</p>
        )}
      </div>
    </div>
  )

  /**
   * Render experience section
   */
  const renderExperience = () => (
    <div className="section-container">
      <div className="section-header">
        <Briefcase size={20} />
        <h3>Experience</h3>
      </div>

      <div className="experience-list">
        {profile.experience?.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-timeline">
              <div className="timeline-dot"></div>
              {index < profile.experience.length - 1 && <div className="timeline-line"></div>}
            </div>

            <div className="experience-content">
              <h4>{exp.position}</h4>
              <p className="company">{exp.company}</p>
              {exp.location && (
                <p className="location">
                  <MapPin size={14} /> {exp.location}
                </p>
              )}
              <p className="dates">
                {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -
                {exp.endDate === 'Present' ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
              </p>
              {exp.description && <p className="description">{exp.description}</p>}
            </div>
          </div>
        ))}

        {(!profile.experience || profile.experience.length === 0) && (
          <p className="empty-state">No experience information added yet.</p>
        )}
      </div>
    </div>
  )

  /**
   * Render skills section
   */
  const renderSkills = () => (
    <div className="section-container">
      <div className="section-header">
        <Award size={20} />
        <h3>Skills & Expertise</h3>
      </div>

      <div className="skills-grid">
        {profile.skills?.map((skill, index) => (
          <div key={index} className="skill-badge">
            {skill}
          </div>
        ))}
      </div>

      {(!profile.skills || profile.skills.length === 0) && (
        <p className="empty-state">No skills added yet.</p>
      )}
    </div>
  )

  /**
   * Render overview tab
   */
  const renderOverviewTab = () => (
    <div className="tab-content">
      {renderStats()}
      {renderBadges()}
      {renderSocialLinks()}
    </div>
  )

  /**
   * Render about tab
   */
  const renderAboutTab = () => (
    <div className="tab-content">
      <div className="section-container">
        <h3>About</h3>
        <p className="about-text">{profile.bio}</p>
      </div>
      {renderSkills()}
    </div>
  )

  /**
   * Render experience tab
   */
  const renderExperienceTab = () => (
    <div className="tab-content">
      {renderExperience()}
      {renderEducation()}
    </div>
  )

  return (
    <div className="profile-view-page">
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
        title="Go back"
        aria-label="Go back"
      >
        ←
      </button>

      {/* Profile Header */}
      {renderProfileHeader()}

      {/* Profile Tabs and Content */}
      <div className="profile-view-container">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'about' && renderAboutTab()}
          {activeTab === 'experience' && renderExperienceTab()}
        </div>
      </div>
    </div>
  )
}

export default ProfileView
