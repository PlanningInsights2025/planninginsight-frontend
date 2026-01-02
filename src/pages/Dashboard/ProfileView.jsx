import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
    ArrowLeft,
    Clock,
    Folder,
    ExternalLink,
    AlertTriangle,
    CheckCircle
  } from 'lucide-react'
<<<<<<< HEAD
=======
=======
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
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
  // Role upgrade request feedback
  const [upgradeToast, setUpgradeToast] = useState(false)
  const [upgradeToastMessage, setUpgradeToastMessage] = useState('')
  const [warningToast, setWarningToast] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  // Role upgrade selection
  const [selectedRole, setSelectedRole] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const ROLE_OPTIONS = [
    { id: 'recruiter', label: 'Recruiter', icon: <Briefcase size={20} /> },
    { id: 'instructor', label: 'Instructor', icon: <GraduationCap size={20} /> },
    { id: 'editor', label: 'Editor', icon: <Edit size={20} /> }
  ]
  const [activeSidebarItem, setActiveSidebarItem] = useState('profile')
  const [contentStats, setContentStats] = useState({
    articles: 0,
    thesisDissertation: 0,
    researchPaper: 0,
    journalPaper: 2,
    project: 0,
    scheme: 0
  })
  const [videoStats, setVideoStats] = useState({
    tutorials: 0,
    lectures: 0,
    presentations: 0,
    webinars: 0,
    interviews: 0,
    documentaries: 0
  })
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'test',
      description: 'asd',
      image: '/assets/images/logo.png',
      status: 'Published',
      date: '2024-12-20'
    },
    {
      id: 2,
      title: 'sdasdas',
      description: 'sadsad',
      image: '/assets/images/logo.png',
      status: 'Published',
      date: '2024-12-15'
    }
  ])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    image: null,
    category: 'project'
  })
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false)
  const [videoUploadForm, setVideoUploadForm] = useState({
    title: '',
    videoFile: null,
    videoType: ''
  })
  const [videoItems, setVideoItems] = useState([])
  const [showVideoViewModal, setShowVideoViewModal] = useState(false)
  const [viewingVideo, setViewingVideo] = useState(null)
  const [showContentUploadModal, setShowContentUploadModal] = useState(false)
  const [contentUploadForm, setContentUploadForm] = useState({
    title: '',
    description: '',
    contentFile: null,
    contentType: ''
  })
  const [contentItems, setContentItems] = useState([])
  const [showContentViewModal, setShowContentViewModal] = useState(false)
  const [viewingContent, setViewingContent] = useState(null)
  
  // Filter states for content sections
  const [contentFilter, setContentFilter] = useState('all')
  const [videoFilter, setVideoFilter] = useState('all')
  const [portfolioFilter, setPortfolioFilter] = useState('all')
  const [dataHubFilter, setDataHubFilter] = useState('all')
  const [questionFilter, setQuestionFilter] = useState('all')
  
  // Data Hub states
  const [dataHubItems, setDataHubItems] = useState([])
  const [showDataUploadModal, setShowDataUploadModal] = useState(false)
  const [dataUploadForm, setDataUploadForm] = useState({
    title: '',
    description: '',
    dataFile: null,
    dataType: ''
  })
  const [showDataViewModal, setShowDataViewModal] = useState(false)
  const [viewingData, setViewingData] = useState(null)
  
  // Question states
  const [questions, setQuestions] = useState([])
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [questionForm, setQuestionForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  })
  const [showQuestionViewModal, setShowQuestionViewModal] = useState(false)
  const [viewingQuestion, setViewingQuestion] = useState(null)
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607

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
<<<<<<< HEAD
        bio: prev.bio || 'Urban planning work experience with passion for sustainable development',
=======
<<<<<<< HEAD
        bio: prev.bio || 'Urban planning work experience with passion for sustainable development',
=======
        bio: prev.bio || 'Urban planning professional with passion for sustainable development',
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
        projects: [
          {
            title: 'Smart City Traffic Analysis',
            role: 'Lead Analyst',
            description: 'Analyzed traffic patterns using GIS data to propose congestion reduction strategies for South Mumbai.',
            technologies: ['GIS', 'Python', 'Data Visualization'],
            link: 'https://github.com/example/traffic-analysis',
            image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=300&h=200'
          },
          {
            title: 'Urban Green Space Mapping',
            role: 'Researcher',
            description: 'Mapping and assessing the quality of public green spaces in developing neighborhoods.',
            technologies: ['Remote Sensing', 'Surveying', 'Community Mapping'],
            link: 'https://example.com/green-spaces',
            image: 'https://images.unsplash.com/photo-1496564203457-11bb12075d90?auto=format&fit=crop&q=80&w=300&h=200'
          }
        ],
        recentActivity: [
          {
            type: 'article',
            title: 'Published "Future of Urban Mobility"',
            date: '2 days ago',
            description: 'Analysis of sustainable transport trends in mega-cities.'
          },
          {
            type: 'course',
            title: 'Completed "GIS Advanced Mapping"',
            date: '1 week ago',
            description: 'Mastered spatial analysis techniques and 3D modeling.'
          },
          {
            type: 'badge',
            title: 'Earned "Active Contributor" Badge',
            date: '2 weeks ago',
            description: 'Recognized for high engagement in community forums.'
          }
        ],
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
        skills: ['Urban Planning', 'GIS', 'Sustainability', 'Project Management', 'Data Analysis', 'Community Engagement'],
        uniqueCode: 'PLAN-20240115-0001'
      }))
    }

<<<<<<< HEAD
    // Force light mode - remove dark mode
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('darkMode', 'false')
=======
<<<<<<< HEAD
    // Force light mode - remove dark mode
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('darkMode', 'false')
=======
    // Apply dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
   * Handle make public toggle
   */
  const handleMakePublic = () => {
    setIsPublic(!isPublic)
    // Here you would typically make an API call to update visibility
    alert(`Profile is now ${!isPublic ? 'Public' : 'Private'}`)
  }

  /**
   * Handle edit profile navigation
   */
  const handleEditProfile = () => {
    navigate('/profile')
  }

  /**
   * Handle instructor navigation
   */
  const handleInstructor = () => {
    navigate('/instructor')
  }

  /**
   * Handle editor navigation
   */
  const handleEditor = () => {
    navigate('/editor');
  }

  /**
   * Handle recruiter navigation
   */
  /**
   * Handle recruiter navigation
   */
  const handleRecruiter = () => {
    navigate('/recruiter')
  }



  /**
   * Handle role upgrade request - show confirmation modal
   */
  const handleRoleUpgradeRequest = () => {
    if (!selectedRole) {
      setWarningToast(true)
      setRequestSubmitted(false)
      setUpgradeToast(false)
      setUpgradeToastMessage('')
      setTimeout(() => setWarningToast(false), 3000)
      return
    }
    // Show confirmation modal
    setShowConfirmModal(true)
  }

  /**
   * Handle confirm upgrade after user confirms in modal
   */
  const handleConfirmUpgrade = () => {
    // In a real app, this would call an API to submit the request with selectedRole
    setShowConfirmModal(false)
    setWarningToast(false)
    setRequestSubmitted(true)
    setUpgradeToastMessage('We will update you soon. Admin will review your request.')
    setUpgradeToast(true)
    setTimeout(() => setUpgradeToast(false), 3000)
  }

  /**
   * Handle cancel confirmation modal
   */
  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
  }

  /**
   * Sidebar navigation items
   */
  const sidebarItems = [
    { id: 'write-for-us', label: 'WRITE FOR US', icon: '✍️' },
    { id: 'video', label: 'VIDEO', icon: '🎥' },
    { id: 'portfolio', label: 'PORTFOLIO', icon: '💼' },
    { id: 'data-hub', label: 'DATA HUB', icon: '📊' },
    { id: 'question', label: 'QUESTION', icon: '❓' },
    { id: 'my-purchase', label: 'MY PURCHASE', icon: '🛒' },
    { id: 'role-upgrade', label: 'ROLE UPGRADE REQUEST', icon: '⬆️' }
  ]

  /**
   * Handle sidebar item click
   */
  const handleSidebarItemClick = (itemId) => {
    setActiveSidebarItem(itemId)
    
    // Navigate to appropriate page based on sidebar item
    // For write-for-us and others, just change the active state to show content inline
<<<<<<< HEAD
=======
=======
   * Handle edit profile navigation
   */
  const handleEditProfile = () => {
    setEditToast(true)
    setTimeout(() => setEditToast(false), 3000)
    navigate('/profile/edit')
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
                <span className="unique-code-badge" style={{
                  background: 'linear-gradient(90deg, #6c63ff 0%, #5f2eea 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1em',
                  borderRadius: '22px',
                  padding: '0.35em 1.2em',
                  marginLeft: '1em',
                  boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  lineHeight: '1.2',
                }}>{profile.uniqueCode}</span>
<<<<<<< HEAD
=======
=======
                <span className="unique-code-badge">{profile.uniqueCode}</span>
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
              <>
                <button 
                  onClick={handleEditProfile}
                  className="btn btn-primary edit-profile-btn"
                  title="Edit your profile"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
                <button 
                  onClick={handleInstructor}
                  className="btn btn-primary edit-profile-btn"
                  title="Instructor"
                >
                  <Edit size={16} />
                  Instructor
                </button>
                <button 
                  onClick={handleEditor}
                  className="btn btn-primary edit-profile-btn"
                  title="Editor"
                >
                  <Edit size={16} />
                  Editor
                </button>
                <button 
                  onClick={handleRecruiter}
                  className="btn btn-primary edit-profile-btn"
                  title="Recruiter"
                >
                  <Edit size={16} />
                  Recruiter
                </button>

              </>
<<<<<<< HEAD
=======
=======
              <button 
                onClick={handleEditProfile}
                className="btn btn-primary edit-profile-btn"
                title="Edit your profile"
              >
                <Edit size={16} />
                Edit Profile
              </button>
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
          </div>
          
          <div className="profile-utility-buttons">
=======
<<<<<<< HEAD
          </div>
          
          <div className="profile-utility-buttons">
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      <h3 style={{ color: '#222', fontWeight: 600 }}>Badges & Achievements</h3>
      <div className="badges-grid">
        {profile.badges?.map((badge) => (
          <div key={badge.id} className="badge-item" style={{ borderColor: badge.color, background: '#f8f9fa' }}>
            <div className="badge-icon" style={{ color: badge.color, fontSize: '1.5em' }}>
              {badge.icon}
            </div>
            <span className="badge-name" style={{ color: '#333', fontWeight: 500 }}>{badge.name}</span>
<<<<<<< HEAD
=======
=======
      <h3>Badges & Achievements</h3>
      <div className="badges-grid">
        {profile.badges?.map((badge) => (
          <div key={badge.id} className="badge-item" style={{ borderColor: badge.color }}>
            <div className="badge-icon" style={{ color: badge.color }}>
              {badge.icon}
            </div>
            <span className="badge-name">{badge.name}</span>
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
   * Render recent activity
   */
  const renderRecentActivity = () => (
    <div className="section-container">
      <div className="section-header">
        <Clock size={20} />
        <h3>Recent Activity</h3>
      </div>

      <div className="activity-list">
        {profile.recentActivity?.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon-wrapper">
              <div className="activity-dot"></div>
              {index < profile.recentActivity.length - 1 && <div className="activity-line"></div>}
            </div>
            <div className="activity-content">
              <h4>{activity.title}</h4>
              <p className="activity-desc">{activity.description}</p>
              <span className="activity-date">{activity.date}</span>
            </div>
          </div>
        ))}
        {(!profile.recentActivity || profile.recentActivity.length === 0) && (
          <p className="empty-state">No recent activity.</p>
        )}
      </div>
    </div>
  )

  /**
   * Render projects section
   */
  const renderProjects = () => (
    <div className="section-container">
      <div className="section-header">
        <Folder size={20} />
        <h3>Projects</h3>
      </div>

      <div className="projects-grid">
        {profile.projects?.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-content">
              <h4>{project.title}</h4>
              <p className="project-role">{project.role}</p>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLink size={14} /> View Project
                </a>
              )}
            </div>
          </div>
        ))}
        {(!profile.projects || profile.projects.length === 0) && (
          <p className="empty-state">No projects added yet.</p>
        )}
      </div>
    </div>
  )

  /**
   * Render Write For Us content
   */
  const renderWriteForUsContent = () => {
    const handleContentUpload = (contentType) => {
      setContentUploadForm(prev => ({ ...prev, contentType }))
      setShowContentUploadModal(true)
    }

    const handleCloseContentModal = () => {
      setShowContentUploadModal(false)
      setContentUploadForm({ title: '', description: '', contentFile: null, contentType: '' })
    }

    const handleContentFormChange = (e) => {
      const { name, value } = e.target
      setContentUploadForm(prev => ({ ...prev, [name]: value }))
    }

    const handleContentFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setContentUploadForm(prev => ({ ...prev, contentFile: file }))
      }
    }

    const handleSubmitContentUpload = (e, isDraft = false) => {
      e.preventDefault()
      if (contentUploadForm.title && contentUploadForm.description && contentUploadForm.contentType) {
        const newContent = {
          id: contentItems.length + 1,
          title: contentUploadForm.title,
          description: contentUploadForm.description,
          contentFile: contentUploadForm.contentFile,
          contentType: contentUploadForm.contentType,
          status: isDraft ? 'Draft' : 'Published',
          date: new Date().toISOString().split('T')[0]
        }
        
        setContentItems([...contentItems, newContent])
        
        const statKey = {
          'article': 'articles',
          'thesis': 'thesisDissertation',
          'research': 'researchPaper',
          'journal': 'journalPaper',
          'project': 'project',
          'scheme': 'scheme'
        }[contentUploadForm.contentType]
        
        setContentStats(prev => ({
          ...prev,
          [statKey]: prev[statKey] + 1
        }))
        
        handleCloseContentModal()
        alert(`Content ${isDraft ? 'saved as draft' : 'published'} successfully!`)
      }
    }

    const handleSaveDraftContent = (e) => {
      handleSubmitContentUpload(e, true)
    }

    const handleViewContent = (content) => {
      setViewingContent(content)
      setShowContentViewModal(true)
    }

    const handleCloseContentViewModal = () => {
      setShowContentViewModal(false)
      setViewingContent(null)
    }

    const contentTypes = [
      {
        id: 'article',
        title: 'Article',
        count: contentStats.articles,
        buttonText: 'WRITE ARTICLE',
        action: () => handleContentUpload('article')
      },
      {
        id: 'thesis',
        title: 'Thesis/Dissertation',
        count: contentStats.thesisDissertation,
        buttonText: 'WRITE THESIS/DISSERTATION',
        action: () => handleContentUpload('thesis')
      },
      {
        id: 'research',
        title: 'Research Paper',
        count: contentStats.researchPaper,
        buttonText: 'WRITE RESEARCH PAPER',
        action: () => handleContentUpload('research')
      },
      {
        id: 'journal',
        title: 'International Journal Paper',
        count: contentStats.journalPaper,
        buttonText: 'WRITE JOURNAL PAPER',
        action: () => handleContentUpload('journal')
      },
      {
        id: 'project',
        title: 'Project',
        count: contentStats.project,
        buttonText: 'WRITE PROJECT',
        action: () => handleContentUpload('project')
      },
      {
        id: 'scheme',
        title: 'Scheme',
        count: contentStats.scheme,
        buttonText: 'WRITE SCHEME',
        action: () => handleContentUpload('scheme')
      }
    ]

    return (
      <div className="write-for-us-content">
        {/* Header Section */}
        <div className="portfolio-header">
          <div className="portfolio-title-section">
            <h2 className="portfolio-main-title">Write For Us</h2>
            <p className="portfolio-subtitle">Share your knowledge and research</p>
          </div>
          <button 
            className="portfolio-upload-btn"
            onClick={() => {
              const firstContentType = contentTypes[0];
              handleContentUpload(firstContentType.id);
            }}
          >
            Write Content
          </button>
        </div>

        {/* Stats Section */}
        <div className="portfolio-header-section">
          <div className="portfolio-stats-row">
            <div 
              className={`portfolio-stat-card ${contentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setContentFilter('all')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-number">{contentItems.length}</div>
              <div className="stat-label">TOTAL ITEMS</div>
            </div>
            <div 
              className={`portfolio-stat-card ${contentFilter === 'published' ? 'active' : ''}`}
              onClick={() => setContentFilter('published')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-number">{contentItems.filter(item => item.status === 'Published').length}</div>
              <div className="stat-label">PUBLISHED</div>
            </div>
            <div 
              className={`portfolio-stat-card ${contentFilter === 'draft' ? 'active' : ''}`}
              onClick={() => setContentFilter('draft')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-number">{contentItems.filter(item => item.status === 'Draft').length}</div>
              <div className="stat-label">DRAFT</div>
            </div>
          </div>
        </div>

        <div className="write-content-grid">
          {contentTypes.map((content) => {
            const categoryContent = contentItems
              .filter(item => {
                if (contentFilter === 'all') return item.contentType === content.id;
                if (contentFilter === 'published') return item.contentType === content.id && item.status === 'Published';
                if (contentFilter === 'draft') return item.contentType === content.id && item.status === 'Draft';
                return item.contentType === content.id;
              })
            
            return (
              <div key={content.id} className="write-content-card">
                <div className="write-card-header">
                  <div className="write-count">{content.count}</div>
                  <div className="write-title">{content.title}</div>
                </div>
                <button 
                  className="write-action-btn"
                  onClick={content.action}
                >
                  {content.buttonText}
                </button>
                
                {/* Display written content for this category */}
                {categoryContent.length > 0 && (
                  <div className="category-videos-list">
                    {categoryContent.map((item) => (
                      <div key={item.id} className="category-video-item">
                        <div className="category-video-icon">📄</div>
                        <div className="category-video-info">
                          <h4 className="category-video-title">{item.title}</h4>
                          <p className="category-video-status">{item.status}</p>
                        </div>
                        <button 
                          className="category-video-view"
                          onClick={() => handleViewContent(item)}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* All Content Items Grid */}
        {contentItems.length > 0 && (
          <div className="video-items-section">
            <h3 className="section-title">My Content</h3>
            <div className="portfolio-grid">
              {contentItems
                .filter(item => {
                  if (contentFilter === 'all') return true;
                  if (contentFilter === 'published') return item.status === 'Published';
                  if (contentFilter === 'draft') return item.status === 'Draft';
                  return true;
                })
                .map((content) => (
                <div key={content.id} className="portfolio-card" data-status={content.status}>
                  <div className="portfolio-card-image-wrapper">
                    <div className="video-placeholder" style={{ background: 'linear-gradient(135deg, #0d7377 0%, #14919b 100%)' }}>
                      <div className="video-icon">📄</div>
                      <p className="video-type-label">{content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)}</p>
                    </div>
                    <div className="portfolio-card-overlay">
                      <button className="overlay-view-btn" onClick={() => handleViewContent(content)}>
                        <ExternalLink size={24} />
                      </button>
                    </div>
                    <div className="portfolio-status-badge">{content.status}</div>
                  </div>
                  
                  <div className="portfolio-card-content">
                    <div className="portfolio-card-header-info">
                      <h3 className="portfolio-card-title">{content.title}</h3>
                      <p className="portfolio-card-date">{new Date(content.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <p className="portfolio-card-description">{content.description}</p>
                    
                    <div className="portfolio-card-actions">
                      <button 
                        className="portfolio-action-btn view-action-btn"
                        onClick={() => handleViewContent(content)}
                      >
                        VIEW
                      </button>
                      {content.status === 'Published' ? (
                        <button 
                          className="portfolio-action-btn draft-action-btn"
                          onClick={() => setContentItems(contentItems.map(item => 
                            item.id === content.id ? { ...item, status: 'Draft' } : item
                          ))}
                        >
                          SAVE DRAFT
                        </button>
                      ) : (
                        <button 
                          className="portfolio-action-btn publish-action-btn"
                          onClick={() => setContentItems(contentItems.map(item => 
                            item.id === content.id ? { ...item, status: 'Published' } : item
                          ))}
                        >
                          PUBLISH
                        </button>
                      )}
                      <button 
                        className="portfolio-action-btn delete-action-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this content?')) {
                            setContentItems(contentItems.filter(item => item.id !== content.id))
                            const statKey = {
                              'article': 'articles',
                              'thesis': 'thesisDissertation',
                              'research': 'researchPaper',
                              'journal': 'journalPaper',
                              'project': 'project',
                              'scheme': 'scheme'
                            }[content.contentType]
                            setContentStats(prev => ({
                              ...prev,
                              [statKey]: Math.max(0, prev[statKey] - 1)
                            }))
                          }
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Upload Modal */}
        {showContentUploadModal && (
          <div className="portfolio-modal-overlay" onClick={handleCloseContentModal}>
            <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Write {contentUploadForm.contentType.charAt(0).toUpperCase() + contentUploadForm.contentType.slice(1)}</h3>
                <button className="modal-close-btn" onClick={handleCloseContentModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmitContentUpload} className="modal-form">
                <div className="form-group">
                  <label htmlFor="content-title">Title *</label>
                  <input
                    type="text"
                    id="content-title"
                    name="title"
                    value={contentUploadForm.title}
                    onChange={handleContentFormChange}
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content-description">Description *</label>
                  <textarea
                    id="content-description"
                    name="description"
                    value={contentUploadForm.description}
                    onChange={handleContentFormChange}
                    placeholder="Describe your content"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="content-file">Upload File (PDF, DOCX)</label>
                  <input
                    type="file"
                    id="content-file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleContentFileChange}
                  />
                  {contentUploadForm.contentFile && (
                    <div className="file-info">
                      <p>Selected: {contentUploadForm.contentFile.name}</p>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseContentModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn-draft" onClick={handleSaveDraftContent}>
                    Save Draft
                  </button>
                  <button type="submit" className="btn-submit">
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content View Modal */}
        {showContentViewModal && viewingContent && (
          <div className="portfolio-modal-overlay" onClick={handleCloseContentViewModal}>
            <div className="portfolio-modal video-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{viewingContent.title}</h3>
                <button className="modal-close-btn" onClick={handleCloseContentViewModal}>&times;</button>
              </div>
              <div className="video-view-content">
                <div className="video-info-section">
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{viewingContent.contentType.charAt(0).toUpperCase() + viewingContent.contentType.slice(1)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className="info-value" style={{ color: viewingContent.status === 'Published' ? '#10b981' : '#f59e0b' }}>
                      {viewingContent.status}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{new Date(viewingContent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="video-description-section">
                  <h4>Description</h4>
                  <p>{viewingContent.description}</p>
                </div>

                {viewingContent.contentFile && (
                  <div className="video-player-section">
                    <h4>Attached File</h4>
                    <div className="video-file-info">
                      <p><strong>File:</strong> {viewingContent.contentFile.name}</p>
                      <p><strong>Size:</strong> {(viewingContent.contentFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <p><strong>Type:</strong> {viewingContent.contentFile.type || 'Document'}</p>
                    </div>
                  </div>
                )}

                <div className="video-view-actions">
                  <button className="btn-cancel" onClick={handleCloseContentViewModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render Video content
   */
  const renderVideoContent = () => {
    const handleVideoUpload = (videoType) => {
      setVideoUploadForm(prev => ({ ...prev, videoType }))
      setShowVideoUploadModal(true)
    }

    const handleCloseVideoModal = () => {
      setShowVideoUploadModal(false)
      setVideoUploadForm({ title: '', videoFile: null, videoType: '' })
    }

    const handleVideoFormChange = (e) => {
      const { name, value } = e.target
      setVideoUploadForm(prev => ({ ...prev, [name]: value }))
    }

    const handleVideoFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setVideoUploadForm(prev => ({ ...prev, videoFile: file }))
      }
    }

    const handleSubmitVideoUpload = (e, isDraft = false) => {
      e.preventDefault()
      if (videoUploadForm.title && videoUploadForm.videoFile && videoUploadForm.videoType) {
        // Create new video item
        const newVideo = {
          id: videoItems.length + 1,
          title: videoUploadForm.title,
          videoFile: videoUploadForm.videoFile,
          videoType: videoUploadForm.videoType,
          status: isDraft ? 'Draft' : 'Published',
          date: new Date().toISOString().split('T')[0]
        }
        // Add to video items
        setVideoItems([...videoItems, newVideo])
        // Update the count for the specific video type
        setVideoStats(prev => ({
          ...prev,
          [videoUploadForm.videoType + 's']: prev[videoUploadForm.videoType + 's'] + 1
        }))
        handleCloseVideoModal()
        alert(`Video ${isDraft ? 'saved as draft' : 'uploaded'} successfully to ${videoUploadForm.videoType} category!`)
      }
    }

    const handleSaveDraftVideoUpload = (e) => {
      handleSubmitVideoUpload(e, true)
    }

    const handleViewVideo = (video) => {
      setViewingVideo(video)
      setShowVideoViewModal(true)
    }

    const handleCloseVideoViewModal = () => {
      setShowVideoViewModal(false)
      setViewingVideo(null)
    }

    const videoTypes = [
      {
        id: 'tutorial',
        title: 'Tutorial',
        count: videoStats.tutorials,
        buttonText: 'UPLOAD VIDEO',
        action: () => handleVideoUpload('tutorial')
      },
      {
        id: 'lecture',
        title: 'Lecture',
        count: videoStats.lectures,
        buttonText: 'UPLOAD VIDEO',
        action: () => handleVideoUpload('lecture')
      },
      {
        id: 'presentation',
        title: 'Presentation',
        count: videoStats.presentations,
        buttonText: 'UPLOAD VIDEO',
        action: () => handleVideoUpload('presentation')
      },
      {
        id: 'webinar',
        title: 'Webinar',
        count: videoStats.webinars,
        buttonText: 'UPLOAD VIDEO',
        action: () => handleVideoUpload('webinar')
      },
      {
        id: 'interview',
        title: 'Interview',
        count: videoStats.interviews,
        buttonText: 'UPLOAD VIDEO',
        action: () => handleVideoUpload('interview')
      },
      {
        id: 'documentary',
        title: 'Documentary',
        count: videoStats.documentaries,
        buttonText: 'UPLOAD VIDEO',
        action: () => handleVideoUpload('documentary')
      }
    ]

    return (
      <div className="write-for-us-content">
        {/* Header Section */}
        <div className="portfolio-header">
          <div className="portfolio-title-section">
            <h2 className="portfolio-main-title">My Videos</h2>
            <p className="portfolio-subtitle">Showcase your video content</p>
          </div>
          <button 
            className="portfolio-upload-btn"
            onClick={() => {
              const firstVideoType = videoTypes[0];
              handleVideoUpload(firstVideoType.id);
            }}
          >
            Upload Video
          </button>
        </div>

        {/* Stats Section */}
        <div className="portfolio-header-section">
          <div className="portfolio-stats-row">
            <div 
              className={`portfolio-stat-card ${videoFilter === 'all' ? 'active' : ''}`}
              onClick={() => setVideoFilter('all')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-number">{videoItems.length}</div>
              <div className="stat-label">TOTAL ITEMS</div>
            </div>
            <div 
              className={`portfolio-stat-card ${videoFilter === 'published' ? 'active' : ''}`}
              onClick={() => setVideoFilter('published')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-number">{videoItems.filter(item => item.status === 'Published').length}</div>
              <div className="stat-label">PUBLISHED</div>
            </div>
            <div 
              className={`portfolio-stat-card ${videoFilter === 'draft' ? 'active' : ''}`}
              onClick={() => setVideoFilter('draft')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-number">{videoItems.filter(item => item.status === 'Draft').length}</div>
              <div className="stat-label">DRAFT</div>
            </div>
          </div>
        </div>

        <div className="write-content-grid">
          {videoTypes.map((video) => {
            const categoryVideos = videoItems
              .filter(item => {
                if (videoFilter === 'all') return item.videoType === video.id;
                if (videoFilter === 'published') return item.videoType === video.id && item.status === 'Published';
                if (videoFilter === 'draft') return item.videoType === video.id && item.status === 'Draft';
                return item.videoType === video.id;
              })
            
            return (
              <div key={video.id} className="write-content-card">
                <div className="write-card-header">
                  <div className="write-count">{video.count}</div>
                  <div className="write-title">{video.title}</div>
                </div>
                <button 
                  className="write-action-btn"
                  onClick={video.action}
                >
                  {video.buttonText}
                </button>
                
                {/* Display uploaded videos for this category */}
                {categoryVideos.length > 0 && (
                  <div className="category-videos-list">
                    {categoryVideos.map((item) => (
                      <div key={item.id} className="category-video-item">
                        <div className="category-video-icon">🎥</div>
                        <div className="category-video-info">
                          <h4 className="category-video-title">{item.title}</h4>
                          <p className="category-video-status">{item.status}</p>
                        </div>
                        <button 
                          className="category-video-view"
                          onClick={() => handleViewVideo(item)}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Video Upload Modal */}
        {showVideoUploadModal && (
          <div className="portfolio-modal-overlay" onClick={handleCloseVideoModal}>
            <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload {videoUploadForm.videoType.charAt(0).toUpperCase() + videoUploadForm.videoType.slice(1)} Video</h3>
                <button className="modal-close-btn" onClick={handleCloseVideoModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmitVideoUpload} className="modal-form">
                <div className="form-group">
                  <label htmlFor="video-title">Title *</label>
                  <input
                    type="text"
                    id="video-title"
                    name="title"
                    value={videoUploadForm.title}
                    onChange={handleVideoFormChange}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="video-file">Upload Video</label>
                  <input
                    type="file"
                    id="video-file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                  />
                  {videoUploadForm.videoFile && (
                    <div className="file-info">
                      <p>Selected: {videoUploadForm.videoFile.name}</p>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseVideoModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn-draft" onClick={handleSaveDraftVideoUpload}>
                    Save Draft
                  </button>
                  <button type="submit" className="btn-submit">
                    Upload Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Uploaded Videos Grid */}
        {videoItems.length > 0 && (
          <div className="video-items-section">
            <h3 className="section-title">My Videos</h3>
            <div className="portfolio-grid">
              {videoItems
                .filter(item => {
                  if (videoFilter === 'all') return true;
                  if (videoFilter === 'published') return item.status === 'Published';
                  if (videoFilter === 'draft') return item.status === 'Draft';
                  return true;
                })
                .map((video) => (
                <div key={video.id} className="portfolio-card" data-status={video.status}>
                  <div className="portfolio-card-image-wrapper">
                    <div className="video-placeholder">
                      <div className="video-icon">🎥</div>
                      <p className="video-type-label">{video.videoType.charAt(0).toUpperCase() + video.videoType.slice(1)}</p>
                    </div>
                    <div className="portfolio-card-overlay">
                      <button className="overlay-view-btn" onClick={() => handleViewVideo(video)}>
                        <ExternalLink size={24} />
                      </button>
                    </div>
                    <div className="portfolio-status-badge">{video.status}</div>
                  </div>
                  
                  <div className="portfolio-card-content">
                    <div className="portfolio-card-header-info">
                      <h3 className="portfolio-card-title">{video.title}</h3>
                      <p className="portfolio-card-date">{new Date(video.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <p className="portfolio-card-description">{video.description}</p>
                    
                    <div className="portfolio-card-actions">
                      <button 
                        className="portfolio-action-btn view-action-btn"
                        onClick={() => handleViewVideo(video)}
                      >
                        VIEW
                      </button>
                      {video.status === 'Published' ? (
                        <button 
                          className="portfolio-action-btn draft-action-btn"
                          onClick={() => setVideoItems(videoItems.map(item => 
                            item.id === video.id ? { ...item, status: 'Draft' } : item
                          ))}
                        >
                          SAVE DRAFT
                        </button>
                      ) : (
                        <button 
                          className="portfolio-action-btn publish-action-btn"
                          onClick={() => setVideoItems(videoItems.map(item => 
                            item.id === video.id ? { ...item, status: 'Published' } : item
                          ))}
                        >
                          PUBLISH
                        </button>
                      )}
                      <button 
                        className="portfolio-action-btn delete-action-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this video?')) {
                            setVideoItems(videoItems.filter(item => item.id !== video.id))
                            setVideoStats(prev => ({
                              ...prev,
                              [video.videoType + 's']: Math.max(0, prev[video.videoType + 's'] - 1)
                            }))
                          }
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video View Modal */}
        {showVideoViewModal && viewingVideo && (
          <div className="portfolio-modal-overlay" onClick={handleCloseVideoViewModal}>
            <div className="portfolio-modal video-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{viewingVideo.title}</h3>
                <button className="modal-close-btn" onClick={handleCloseVideoViewModal}>&times;</button>
              </div>
              <div className="video-view-content">
                <div className="video-info-section">
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{viewingVideo.videoType.charAt(0).toUpperCase() + viewingVideo.videoType.slice(1)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className="info-value" style={{ color: viewingVideo.status === 'Published' ? '#10b981' : '#f59e0b' }}>
                      {viewingVideo.status}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{new Date(viewingVideo.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="video-description-section">
                  <h4>Description</h4>
                  <p>{viewingVideo.description}</p>
                </div>

                {viewingVideo.videoFile && (
                  <div className="video-player-section">
                    <h4>Video Preview</h4>
                    <video 
                      controls 
                      className="video-player"
                      src={URL.createObjectURL(viewingVideo.videoFile)}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="video-file-info">
                      <p><strong>File:</strong> {viewingVideo.videoFile.name}</p>
                      <p><strong>Size:</strong> {(viewingVideo.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}

                <div className="video-view-actions">
                  <button className="btn-cancel" onClick={handleCloseVideoViewModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render Data Hub content
   */
  const renderDataHubContent = () => {
    const handleDataUpload = (dataType) => {
      setDataUploadForm(prev => ({ ...prev, dataType }))
      setShowDataUploadModal(true)
    }

    const handleCloseDataModal = () => {
      setShowDataUploadModal(false)
      setDataUploadForm({ title: '', description: '', dataFile: null, dataType: '' })
    }

    const handleDataFormChange = (e) => {
      const { name, value } = e.target
      setDataUploadForm(prev => ({ ...prev, [name]: value }))
    }

    const handleDataFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setDataUploadForm(prev => ({ ...prev, dataFile: file }))
      }
    }

    const handleSubmitDataUpload = (e, isDraft = false) => {
      e.preventDefault()
      if (dataUploadForm.title && dataUploadForm.description && dataUploadForm.dataFile) {
        const newData = {
          id: dataHubItems.length + 1,
          title: dataUploadForm.title,
          description: dataUploadForm.description,
          dataFile: dataUploadForm.dataFile,
          dataType: dataUploadForm.dataType,
          status: isDraft ? 'Draft' : 'Published',
          uploadDate: new Date().toISOString().split('T')[0]
        }
        setDataHubItems([...dataHubItems, newData])
        handleCloseDataModal()
      }
    }

    const handleSaveDraftData = (e) => {
      handleSubmitDataUpload(e, true)
    }

    const handleViewData = (data) => {
      setViewingData(data)
      setShowDataViewModal(true)
    }

    const handleCloseDataViewModal = () => {
      setShowDataViewModal(false)
      setViewingData(null)
    }

    const dataTypes = [
      { id: 'open-source', title: 'Open Source Data', count: dataHubItems.filter(i => i.dataType === 'open-source').length, action: () => handleDataUpload('open-source'), buttonText: 'UPLOAD' },
      { id: 'study-material', title: 'Study Material/Literature', count: dataHubItems.filter(i => i.dataType === 'study-material').length, action: () => handleDataUpload('study-material'), buttonText: 'UPLOAD' },
      { id: 'legislation', title: 'Legislation', count: dataHubItems.filter(i => i.dataType === 'legislation').length, action: () => handleDataUpload('legislation'), buttonText: 'UPLOAD' },
      { id: 'ebook', title: 'E-Book', count: dataHubItems.filter(i => i.dataType === 'ebook').length, action: () => handleDataUpload('ebook'), buttonText: 'UPLOAD' }
    ]

    return (
      <div className="portfolio-content">
        {/* Data Hub Header */}
        <div className="portfolio-header">
          <div className="portfolio-header-left">
            <h2 className="portfolio-main-title">Data Hub</h2>
            <p className="portfolio-subtitle">Upload and manage your data resources</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="portfolio-stats-grid">
          <div 
            className={`portfolio-stat-card ${dataHubFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDataHubFilter('all')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{dataHubItems.length}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div 
            className={`portfolio-stat-card ${dataHubFilter === 'published' ? 'active' : ''}`}
            onClick={() => setDataHubFilter('published')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{dataHubItems.filter(item => item.status === 'Published').length}</div>
            <div className="stat-label">Published</div>
          </div>
          <div 
            className={`portfolio-stat-card ${dataHubFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setDataHubFilter('draft')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{dataHubItems.filter(item => item.status === 'Draft').length}</div>
            <div className="stat-label">Draft</div>
          </div>
        </div>

        {/* Data Types Grid */}
        <div className="data-hub-grid">
          {dataTypes.map((data) => {
            const categoryData = dataHubItems
              .filter(item => {
                if (dataHubFilter === 'all') return item.dataType === data.id;
                if (dataHubFilter === 'published') return item.dataType === data.id && item.status === 'Published';
                if (dataHubFilter === 'draft') return item.dataType === data.id && item.status === 'Draft';
                return item.dataType === data.id;
              })
            
            return (
              <div key={data.id} className="data-hub-card">
                <div className="data-hub-header">
                  <div className="data-hub-count">{data.count}</div>
                  <div className="data-hub-title">{data.title}</div>
                </div>
                <button 
                  className="data-hub-upload-btn"
                  onClick={data.action}
                >
                  {data.buttonText}
                </button>
                
                {/* Display uploaded data for this category */}
                {categoryData.length > 0 && (
                  <div className="category-videos-list">
                    {categoryData.map((item) => (
                      <div key={item.id} className="category-video-item">
                        <div className="category-video-icon">📊</div>
                        <div className="category-video-info">
                          <h4 className="category-video-title">{item.title}</h4>
                          <p className="category-video-status">{item.status}</p>
                        </div>
                        <button 
                          className="category-video-view"
                          onClick={() => handleViewData(item)}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Upload Modal */}
        {showDataUploadModal && (
          <div className="portfolio-modal-overlay" onClick={handleCloseDataModal}>
            <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload Data</h3>
                <button className="modal-close-btn" onClick={handleCloseDataModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmitDataUpload} className="modal-form">
                <div className="form-group">
                  <label htmlFor="data-title">Title *</label>
                  <input
                    type="text"
                    id="data-title"
                    name="title"
                    value={dataUploadForm.title}
                    onChange={handleDataFormChange}
                    placeholder="Enter data title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="data-description">Description *</label>
                  <textarea
                    id="data-description"
                    name="description"
                    value={dataUploadForm.description}
                    onChange={handleDataFormChange}
                    placeholder="Enter description"
                    rows="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="data-file">Upload File *</label>
                  <input
                    type="file"
                    id="data-file"
                    onChange={handleDataFileChange}
                    accept=".pdf,.csv,.xlsx,.xls,.doc,.docx,.zip"
                    required
                  />
                  {dataUploadForm.dataFile && (
                    <p className="file-name">Selected: {dataUploadForm.dataFile.name}</p>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleSaveDraftData}>
                    Save Draft
                  </button>
                  <button type="submit" className="btn-primary">
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showDataViewModal && viewingData && (
          <div className="portfolio-modal-overlay" onClick={handleCloseDataViewModal}>
            <div className="portfolio-modal video-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{viewingData.title}</h3>
                <button className="modal-close-btn" onClick={handleCloseDataViewModal}>&times;</button>
              </div>
              
              <div className="video-view-content">
                <div className="video-view-info">
                  <p><strong>Description:</strong></p>
                  <p>{viewingData.description}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${viewingData.status.toLowerCase()}`}>{viewingData.status}</span></p>
                  <p><strong>Upload Date:</strong> {new Date(viewingData.uploadDate).toLocaleDateString()}</p>
                </div>

                {viewingData.dataFile && (
                  <div className="video-player-section">
                    <h4>Attached File</h4>
                    <div className="video-file-info">
                      <p><strong>File:</strong> {viewingData.dataFile.name}</p>
                      <p><strong>Size:</strong> {(viewingData.dataFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <p><strong>Type:</strong> {viewingData.dataFile.type || 'Document'}</p>
                    </div>
                  </div>
                )}

                <div className="video-view-actions">
                  <button className="btn-primary" onClick={handleCloseDataViewModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render Question content
   */
  const renderQuestionContent = () => {
    const handleAskQuestion = (category) => {
      setQuestionForm(prev => ({ ...prev, category }))
      setShowQuestionModal(true)
    }

    const handleCloseQuestionModal = () => {
      setShowQuestionModal(false)
      setQuestionForm({ title: '', description: '', category: '', tags: '' })
    }

    const handleQuestionFormChange = (e) => {
      const { name, value } = e.target
      setQuestionForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmitQuestion = (e, isDraft = false) => {
      e.preventDefault()
      if (questionForm.title && questionForm.description && questionForm.category) {
        const newQuestion = {
          id: questions.length + 1,
          title: questionForm.title,
          description: questionForm.description,
          category: questionForm.category,
          tags: questionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status: isDraft ? 'Draft' : 'Published',
          answered: false,
          answers: 0,
          views: 0,
          askedDate: new Date().toISOString().split('T')[0]
        }
        setQuestions([...questions, newQuestion])
        handleCloseQuestionModal()
      }
    }

    const handleSaveDraftQuestion = (e) => {
      handleSubmitQuestion(e, true)
    }

    const handleViewQuestion = (question) => {
      setViewingQuestion(question)
      setShowQuestionViewModal(true)
    }

    const handleCloseQuestionViewModal = () => {
      setShowQuestionViewModal(false)
      setViewingQuestion(null)
    }

    const handleDeleteQuestion = (id) => {
      if (window.confirm('Are you sure you want to delete this question?')) {
        setQuestions(questions.filter(q => q.id !== id))
      }
    }

    const questionCategories = [
      { id: 'academic', title: 'Academic Questions', icon: '🎓', color: '#3b82f6' },
      { id: 'technical', title: 'Technical/GIS', icon: '🗺️', color: '#10b981' },
      { id: 'career', title: 'Career Guidance', icon: '💼', color: '#f59e0b' },
      { id: 'research', title: 'Research Help', icon: '🔬', color: '#8b5cf6' },
      { id: 'urban-planning', title: 'Urban Planning', icon: '🏙️', color: '#ec4899' },
      { id: 'general', title: 'General Discussion', icon: '💬', color: '#6b7280' }
    ]

    return (
      <div className="portfolio-content">
        {/* Question Header */}
        <div className="portfolio-header">
          <div className="portfolio-header-left">
            <h2 className="portfolio-main-title">My Questions</h2>
            <p className="portfolio-subtitle">Ask questions and get answers from the community</p>
          </div>
          <button className="portfolio-upload-btn" onClick={() => setShowQuestionModal(true)}>
            <span className="upload-icon">+</span>
            Ask Question
          </button>
        </div>

        {/* Stats Cards */}
        <div className="portfolio-stats-grid">
          <div 
            className={`portfolio-stat-card ${questionFilter === 'all' ? 'active' : ''}`}
            onClick={() => setQuestionFilter('all')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{questions.length}</div>
            <div className="stat-label">Total Questions</div>
          </div>
          <div 
            className={`portfolio-stat-card ${questionFilter === 'answered' ? 'active' : ''}`}
            onClick={() => setQuestionFilter('answered')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{questions.filter(q => q.answered).length}</div>
            <div className="stat-label">Answered</div>
          </div>
          <div 
            className={`portfolio-stat-card ${questionFilter === 'unanswered' ? 'active' : ''}`}
            onClick={() => setQuestionFilter('unanswered')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{questions.filter(q => !q.answered).length}</div>
            <div className="stat-label">Unanswered</div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="questions-section">
            <h3 className="section-title">My Questions</h3>
            <div className="questions-list">
              {questions
                .filter(q => {
                  if (questionFilter === 'all') return true;
                  if (questionFilter === 'answered') return q.answered;
                  if (questionFilter === 'unanswered') return !q.answered;
                  return true;
                })
                .map((question) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header-row">
                      <div className="question-category-badge" style={{ background: questionCategories.find(c => c.id === question.category)?.color || '#6b7280' }}>
                        {questionCategories.find(c => c.id === question.category)?.icon || '💬'}
                        <span>{questionCategories.find(c => c.id === question.category)?.title || 'General'}</span>
                      </div>
                      <div className="question-status-badge" style={{ background: question.answered ? '#10b981' : '#f59e0b' }}>
                        {question.answered ? 'Answered' : 'Unanswered'}
                      </div>
                    </div>
                    
                    <h4 className="question-title">{question.title}</h4>
                    <p className="question-description">{question.description}</p>
                    
                    <div className="question-meta">
                      <span className="question-meta-item">
                        <span className="meta-icon">👁️</span> {question.views} views
                      </span>
                      <span className="question-meta-item">
                        <span className="meta-icon">💬</span> {question.answers} answers
                      </span>
                      <span className="question-meta-item">
                        <span className="meta-icon">📅</span> {new Date(question.askedDate).toLocaleDateString()}
                      </span>
                    </div>

                    {question.tags.length > 0 && (
                      <div className="question-tags">
                        {question.tags.map((tag, index) => (
                          <span key={index} className="question-tag">{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="question-actions">
                      <button 
                        className="question-action-btn view-btn"
                        onClick={() => handleViewQuestion(question)}
                      >
                        View Details
                      </button>
                      <button 
                        className="question-action-btn delete-btn"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {questions.length === 0 && (
          <div className="portfolio-empty-state">
            <div className="empty-icon">❓</div>
            <h3>No Questions Yet</h3>
            <p>Start by asking your first question to the community</p>
            <button className="empty-upload-btn" onClick={() => setShowQuestionModal(true)}>
              Ask Your First Question
            </button>
          </div>
        )}

        {/* Ask Question Modal */}
        {showQuestionModal && (
          <div className="portfolio-modal-overlay" onClick={handleCloseQuestionModal}>
            <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Ask a Question</h3>
                <button className="modal-close-btn" onClick={handleCloseQuestionModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmitQuestion} className="modal-form">
                <div className="form-group">
                  <label htmlFor="question-title">Question Title *</label>
                  <input
                    type="text"
                    id="question-title"
                    name="title"
                    value={questionForm.title}
                    onChange={handleQuestionFormChange}
                    placeholder="Enter your question title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="question-category">Category *</label>
                  <select
                    id="question-category"
                    name="category"
                    value={questionForm.category}
                    onChange={handleQuestionFormChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {questionCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="question-description">Question Details *</label>
                  <textarea
                    id="question-description"
                    name="description"
                    value={questionForm.description}
                    onChange={handleQuestionFormChange}
                    placeholder="Describe your question in detail"
                    rows="6"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="question-tags">Tags (comma separated)</label>
                  <input
                    type="text"
                    id="question-tags"
                    name="tags"
                    value={questionForm.tags}
                    onChange={handleQuestionFormChange}
                    placeholder="e.g., urban planning, GIS, research"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleSaveDraftQuestion}>
                    Save Draft
                  </button>
                  <button type="submit" className="btn-primary">
                    Post Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Question Modal */}
        {showQuestionViewModal && viewingQuestion && (
          <div className="portfolio-modal-overlay" onClick={handleCloseQuestionViewModal}>
            <div className="portfolio-modal question-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{viewingQuestion.title}</h3>
                <button className="modal-close-btn" onClick={handleCloseQuestionViewModal}>&times;</button>
              </div>
              
              <div className="question-view-content">
                <div className="question-view-badges">
                  <span className="badge" style={{ background: questionCategories.find(c => c.id === viewingQuestion.category)?.color || '#6b7280' }}>
                    {questionCategories.find(c => c.id === viewingQuestion.category)?.icon || '💬'}
                    {questionCategories.find(c => c.id === viewingQuestion.category)?.title || 'General'}
                  </span>
                  <span className="badge" style={{ background: viewingQuestion.answered ? '#10b981' : '#f59e0b' }}>
                    {viewingQuestion.answered ? 'Answered' : 'Unanswered'}
                  </span>
                </div>

                <div className="question-view-description">
                  <h4>Question Details:</h4>
                  <p>{viewingQuestion.description}</p>
                </div>

                <div className="question-view-meta">
                  <p><strong>Asked on:</strong> {new Date(viewingQuestion.askedDate).toLocaleDateString()}</p>
                  <p><strong>Views:</strong> {viewingQuestion.views}</p>
                  <p><strong>Answers:</strong> {viewingQuestion.answers}</p>
                </div>

                {viewingQuestion.tags.length > 0 && (
                  <div className="question-view-tags">
                    <strong>Tags:</strong>
                    <div className="tags-container">
                      {viewingQuestion.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button className="btn-primary" onClick={handleCloseQuestionViewModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render Portfolio content
   */
  const renderPortfolioContent = () => {
    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this portfolio item?')) {
        setPortfolioItems(portfolioItems.filter(item => item.id !== id))
      }
    }

    const handleView = (id) => {
      const item = portfolioItems.find(p => p.id === id)
      if (item) {
        alert(`Viewing: ${item.title}\n${item.description}`)
      }
    }

    const handleSaveDraft = (id) => {
      setPortfolioItems(portfolioItems.map(item => 
        item.id === id ? { ...item, status: 'Draft' } : item
      ))
    }

    const handlePublish = (id) => {
      setPortfolioItems(portfolioItems.map(item => 
        item.id === id ? { ...item, status: 'Published' } : item
      ))
    }

    const handleUpload = () => {
      setShowUploadModal(true)
    }

    const handleCloseModal = () => {
      setShowUploadModal(false)
      setUploadForm({ title: '', description: '', image: null, category: 'project' })
    }

    const handleFormChange = (e) => {
      const { name, value } = e.target
      setUploadForm(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setUploadForm(prev => ({ ...prev, image: reader.result }))
        }
        reader.readAsDataURL(file)
      }
    }

    const handleSubmitUpload = (e, isDraft = false) => {
      e.preventDefault()
      if (uploadForm.title && uploadForm.description) {
        const newItem = {
          id: portfolioItems.length + 1,
          title: uploadForm.title,
          description: uploadForm.description,
          image: uploadForm.image || '/assets/images/logo.png',
          status: isDraft ? 'Draft' : 'Published',
          date: new Date().toISOString().split('T')[0]
        }
        setPortfolioItems([...portfolioItems, newItem])
        handleCloseModal()
      }
    }

    const handleSaveDraftUpload = (e) => {
      handleSubmitUpload(e, true)
    }

    return (
      <div className="portfolio-content">
        {/* Portfolio Header */}
        <div className="portfolio-header">
          <div className="portfolio-header-left">
            <h2 className="portfolio-title-main">My Portfolio</h2>
            <p className="portfolio-subtitle">Showcase your work and achievements</p>
          </div>
          <button className="portfolio-upload-btn" onClick={handleUpload}>
            <span className="upload-icon">+</span>
            Upload Portfolio
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="portfolio-stats-grid">
          <div 
            className={`portfolio-stat-card ${portfolioFilter === 'all' ? 'active' : ''}`}
            onClick={() => setPortfolioFilter('all')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{portfolioItems.length}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div 
            className={`portfolio-stat-card ${portfolioFilter === 'published' ? 'active' : ''}`}
            onClick={() => setPortfolioFilter('published')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{portfolioItems.filter(i => i.status === 'Published').length}</div>
            <div className="stat-label">Published</div>
          </div>
          <div 
            className={`portfolio-stat-card ${portfolioFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setPortfolioFilter('draft')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-number">{portfolioItems.filter(i => i.status === 'Draft').length}</div>
            <div className="stat-label">Draft</div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="portfolio-grid">
          {portfolioItems
            .filter(item => {
              if (portfolioFilter === 'all') return true;
              if (portfolioFilter === 'published') return item.status === 'Published';
              if (portfolioFilter === 'draft') return item.status === 'Draft';
              return true;
            })
            .map((item) => (
            <div key={item.id} className="portfolio-card" data-status={item.status}>
              <div className="portfolio-card-image-wrapper">
                <img src={item.image} alt={item.title} className="portfolio-card-image" />
                <div className="portfolio-card-overlay">
                  <button className="overlay-view-btn" onClick={() => handleView(item.id)}>
                    <ExternalLink size={24} />
                  </button>
                </div>
                <div className="portfolio-status-badge">{item.status}</div>
              </div>
              
              <div className="portfolio-card-content">
                <div className="portfolio-card-header-info">
                  <h3 className="portfolio-card-title">{item.title}</h3>
                  <p className="portfolio-card-date">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <p className="portfolio-card-description">{item.description}</p>
                
                <div className="portfolio-card-actions">
                  <button 
                    className="portfolio-action-btn view-action-btn"
                    onClick={() => handleView(item.id)}
                  >
                    VIEW
                  </button>
                  {item.status === 'Published' ? (
                    <button 
                      className="portfolio-action-btn draft-action-btn"
                      onClick={() => handleSaveDraft(item.id)}
                    >
                      SAVE DRAFT
                    </button>
                  ) : (
                    <button 
                      className="portfolio-action-btn publish-action-btn"
                      onClick={() => handlePublish(item.id)}
                    >
                      PUBLISH
                    </button>
                  )}
                  <button 
                    className="portfolio-action-btn delete-action-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {portfolioItems.length === 0 && (
          <div className="portfolio-empty-state">
            <div className="empty-icon">📁</div>
            <h3>No Portfolio Items Yet</h3>
            <p>Start showcasing your work by uploading your first portfolio item</p>
            <button className="empty-upload-btn" onClick={handleUpload}>
              Upload Your First Item
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="portfolio-modal-overlay" onClick={handleCloseModal}>
            <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload Portfolio Item</h3>
                <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmitUpload} className="modal-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleFormChange}
                    placeholder="Enter portfolio title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={uploadForm.description}
                    onChange={handleFormChange}
                    placeholder="Describe your portfolio item"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={uploadForm.category}
                    onChange={handleFormChange}
                  >
                    <option value="project">Project</option>
                    <option value="design">Design</option>
                    <option value="research">Research</option>
                    <option value="publication">Publication</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Upload Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      setUploadForm(prev => ({
                        ...prev,
                        images: files.map(file => URL.createObjectURL(file)),
                        imageFiles: files
                      }));
                    }}
                  />
                  {uploadForm.images && uploadForm.images.length > 0 && (
                    <div className="image-grid-preview">
                      {uploadForm.images.map((img, idx) => (
                        <div className="image-grid-item" key={idx}>
                          <img src={img} alt={`Preview ${idx+1}`} style={{objectFit: uploadForm.objectFit || 'cover'}} />
                          <div className="img-controls">
                            <button type="button" onClick={() => setUploadForm(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                              imageFiles: prev.imageFiles.filter((_, i) => i !== idx)
                            }))}>Remove</button>
                          </div>
                        </div>
                      ))}
                      <div className="img-fit-controls">
                        <label>Fit:
                          <select value={uploadForm.objectFit || 'cover'} onChange={e => setUploadForm(prev => ({...prev, objectFit: e.target.value}))}>
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="fill">Fill</option>
                            <option value="none">None</option>
                            <option value="scale-down">Scale Down</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn-draft" onClick={handleSaveDraftUpload}>
                    Save Draft
                  </button>
                  <button type="submit" className="btn-submit">
                    Upload Portfolio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  /**
   * Render My Work tab
   */
  const renderMyWorkTab = () => (
    <div className="tab-content">
      {renderProjects()}
      {renderRecentActivity()}
    </div>
  )

  /**
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
   * Render role upgrade request section (sidebar page)
   */
  const renderRoleUpgradeContent = () => (
    <div className="role-upgrade-section">
      <div className="role-upgrade-header">
        <Edit size={20} />
        <h3>Role Upgrade Request</h3>
      </div>
      <p className="role-upgrade-help">
        Choose one role to request. Our team will review and notify you upon approval.
      </p>
      {/* Inline banners removed; messages shown in global top-right toast */}

      <div className="role-options-grid">
        {ROLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`role-card ${selectedRole === opt.id ? 'active' : ''}`}
            onClick={() => setSelectedRole(opt.id)}
            aria-pressed={selectedRole === opt.id}
          >
            <div className="role-card-icon">{opt.icon}</div>
            <div className="role-card-title">{opt.label}</div>
            <div className="role-card-desc">
              {opt.id === 'recruiter' && 'Manage postings and candidate outreach.'}
              {opt.id === 'instructor' && 'Create courses and publish learning content.'}
              {opt.id === 'editor' && 'Edit, curate, and improve submitted content.'}

            </div>
          </button>
        ))}
      </div>

      <div className="role-submit">
        <button
          className="btn btn-primary edit-profile-btn"
          onClick={handleRoleUpgradeRequest}
        >
          <Edit size={16} /> {selectedRole ? `Request ${selectedRole}` : 'Send Request'}
        </button>
        {!selectedRole && (
          <span className="role-submit-hint">Select a role to enable the request.</span>
        )}
      </div>
    </div>
  )

  /**
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
    </div>
  )

  /**
   * Render education tab
   */
  const renderEducationTab = () => (
    <div className="tab-content">
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      {renderEducation()}
    </div>
  )

  return (
<<<<<<< HEAD
    <>
      <div className="profile-view-page">
=======
<<<<<<< HEAD
    <>
      <div className="profile-view-page">
=======
    <div className="profile-view-page">
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
      {/* Main Content with Sidebar */}
      <div className="profile-main-wrapper">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeSidebarItem === item.id ? 'active' : ''}`}
              onClick={() => handleSidebarItemClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tabs and Content */}
        <div className="profile-view-container">

          {activeSidebarItem === 'profile' && (
            <>
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
                <button
                  className={`tab-button ${activeTab === 'my-work' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-work')}
                >
                  My Work
                </button>
                <button
                  className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  Education
                </button>
              </div>

              <div className="profile-content">
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'about' && renderAboutTab()}
                {activeTab === 'experience' && renderExperienceTab()}
                {activeTab === 'my-work' && renderMyWorkTab()}
                {activeTab === 'education' && renderEducationTab()}
              </div>
            </>
          )}

          {activeSidebarItem === 'write-for-us' && (
            <div className="profile-content">
              {renderWriteForUsContent()}
            </div>
          )}

          {activeSidebarItem === 'video' && (
            <div className="profile-content">
              {renderVideoContent()}
            </div>
          )}

          {activeSidebarItem === 'portfolio' && (
            <div className="profile-content">
              {renderPortfolioContent()}
            </div>
          )}

          {activeSidebarItem === 'data-hub' && (
            <div className="profile-content">
              {renderDataHubContent()}
            </div>
          )}

          {activeSidebarItem === 'question' && (
            <div className="profile-content">
              {renderQuestionContent()}
            </div>
          )}

          {activeSidebarItem === 'my-purchase' && (
            <div className="profile-content">
              <h3>My Purchases</h3>
              {/* Example purchase data, replace with real data as needed */}
              {(() => {
                const purchases = [
                  { id: 'ORD-1001', item: 'Urban Analytics Course', amount: 2499, date: '2025-11-15', type: 'Course' },
                  { id: 'ORD-1002', item: 'GIS Mapping eBook', amount: 799, date: '2025-10-02', type: 'eBook' },
                  { id: 'ORD-1003', item: 'Premium Membership', amount: 4999, date: '2025-09-20', type: 'Membership' },
                ];
                const total = purchases.reduce((sum, p) => sum + p.amount, 0);
                return (
                  <div className="purchase-table-container">
                    <div style={{ marginBottom: '1rem', fontWeight: 600 }}>
                      Total Purchases: {purchases.length} &nbsp;|&nbsp; Total Amount: ₹{total.toLocaleString()}
                    </div>
                    <table className="purchase-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Item</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((purchase) => (
                          <tr key={purchase.id}>
                            <td className="payment-id">{purchase.id}</td>
                            <td>{purchase.item}</td>
                            <td><span className="purchase-type-badge">{purchase.type}</span></td>
                            <td className="purchase-amount">₹{purchase.amount.toLocaleString()}</td>
                            <td className="purchase-date">{new Date(purchase.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {activeSidebarItem === 'role-upgrade' && (
            <div className="profile-content">
              {renderRoleUpgradeContent()}
            </div>
          )}

          {activeSidebarItem !== 'profile' && activeSidebarItem !== 'write-for-us' && activeSidebarItem !== 'video' && activeSidebarItem !== 'portfolio' && activeSidebarItem !== 'data-hub' && activeSidebarItem !== 'question' && activeSidebarItem !== 'role-upgrade' && activeSidebarItem !== 'my-purchase' && (
            <div className="profile-content">
              <div className="coming-soon">
                <h3>Coming Soon</h3>
                <p>This section is under development.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {(upgradeToast || warningToast) && (
        <div className="toast-stack top-right">
          {warningToast && (
            <div className="toast-item warn">
              <AlertTriangle size={16} /> Please choose one role.
            </div>
          )}
          {upgradeToast && (
            <div className="toast-item ok">
              <CheckCircle size={16} /> {upgradeToastMessage || 'We will update you soon.'}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelConfirm}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Role Upgrade Request</h3>
              <button className="modal-close" onClick={handleCancelConfirm}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to request the <strong>{selectedRole}</strong> role?</p>
              <p className="modal-info">Our team will review your request and notify you upon approval.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleCancelConfirm}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmUpgrade}>
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

<<<<<<< HEAD
export default ProfileView
=======
export default ProfileView
=======
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
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
