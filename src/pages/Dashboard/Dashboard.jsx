import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { calculateProfileCompletion, formatDate } from '../../utils/helpers'
import { 
  User, 
  Briefcase, 
  Book, 
  FileText, 
  MessageSquare, 
  Settings,
  Bell,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  File,
  Sparkles,
  ChevronRight
} from 'lucide-react'

/**
 * User Dashboard Component
 * Main dashboard with overview, profile completion, and quick access to features
 * Shows personalized content based on user role and activity
 */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [recentActivity, setRecentActivity] = useState([])
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your CV has been viewed 5 times', time: '2 hours ago', read: false },
    { id: 2, message: 'New job posting matching your profile', time: '4 hours ago', read: false },
    { id: 3, message: 'Course enrollment confirmed', time: '1 day ago', read: true }
  ])
  const [settings, setSettings] = useState(() => {
    // Force light mode
    localStorage.setItem('darkMode', 'false')
    return {
      emailNotifications: true,
      pushNotifications: true,
      jobAlerts: true,
      courseUpdates: true,
      forumMentions: true,
      articleUpdates: false,
      darkMode: false,
      compactMode: false,
      animationsEnabled: true,
      publicProfile: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
      twoFactorAuth: false
    }
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [newEmail, setNewEmail] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    jobsApplied: 0,
    coursesEnrolled: 0,
    articlesPublished: 0,
    forumPosts: 0
  })
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  /**
   * Check if user is first-time and redirect to profile completion
   */
  useEffect(() => {
    if (location.state?.firstTime) {
      showNotification('Please complete your profile to get started', 'info')
    }
    
    // Calculate profile completion
    if (user) {
      const completion = calculateProfileCompletion(user)
      setProfileCompletion(completion)
      
      // Load user stats and activity (would come from API in real implementation)
      loadUserData()
    }
  }, [user, location, showNotification])

  /**
   * Update current time every second for timezone display
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  /**
   * Apply dark mode to document
   */
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'false')
    }
  }, [settings.darkMode])

  /**
   * Show toast notification
   */
  const showToastNotification = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  /**
   * Handle notification click - navigate to notifications page
   */
  const handleNotificationClick = () => {
    navigate('/notifications')
    showToastNotification('📬 Opening notifications...')
  }

  /**
   * Handle notification read
   */
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  /**
   * Clear all notifications
   */
  const clearAllNotifications = () => {
    setNotifications([])
    showToastNotification('🗑️ All notifications cleared')
    setShowNotificationModal(false)
  }

  /**
   * Handle settings modal open
   */
  const handleSettingsClick = () => {
    navigate('/settings')
  }

  /**
   * Handle password change
   */
  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToastNotification('⚠️ Please fill all password fields')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToastNotification('⚠️ Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      showToastNotification('⚠️ Password must be at least 8 characters')
      return
    }
    // In real implementation, send to backend
    showToastNotification('✓ Password changed successfully')
    setShowPasswordModal(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  /**
   * Handle email change
   */
  const handleEmailChange = () => {
    setShowEmailModal(true)
  }

  /**
   * Submit email change
   */
  const submitEmailChange = () => {
    if (!newEmail || !newEmail.includes('@')) {
      showToastNotification('⚠️ Please enter a valid email address')
      return
    }
    showToastNotification('📧 Email change request sent. Check your inbox.')
    setShowEmailModal(false)
    setNewEmail('')
  }

  /**
   * Handle account deletion
   */
  const handleAccountDeletion = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showToastNotification('⚠️ Account deletion initiated. You will receive a confirmation email.')
    }
  }

  /**
   * Handle data export
   */
  const handleDataExport = () => {
    showToastNotification('📥 Preparing your data export. This may take a few minutes.')
  }

  /**
   * Get current time in specific timezone
   */
  const getTimeInTimezone = (timezone) => {
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      return ''
    }
  }

  /**
   * Simulate loading user data from API
   */
  const loadUserData = () => {
    // Mock data - in real app, this would come from API
    setStats({
      jobsApplied: 12,
      coursesEnrolled: 3,
      articlesPublished: 2,
      forumPosts: 8
    })
    
    setRecentActivity([
      {
        id: 1,
        type: 'job_application',
        title: 'Applied for Urban Planner position',
        description: 'City Development Authority',
        timestamp: new Date('2024-02-15T10:30:00'),
        icon: Briefcase,
        color: '#2563eb'
      },
      {
        id: 2,
        type: 'course_enrollment',
        title: 'Enrolled in Smart City Planning',
        description: 'Course started successfully',
        timestamp: new Date('2024-02-14T14:20:00'),
        icon: Book,
        color: '#059669'
      },
      {
        id: 3,
        type: 'article_published',
        title: 'Article published in Newsroom',
        description: 'Sustainable Urban Development Trends',
        timestamp: new Date('2024-02-12T09:15:00'),
        icon: FileText,
        color: '#dc2626'
      },
      {
        id: 4,
        type: 'forum_post',
        title: 'Posted in Discussion Forum',
        description: 'Heritage Conservation thread',
        timestamp: new Date('2024-02-10T16:45:00'),
        icon: MessageSquare,
        color: '#ea580c'
      }
    ])
  }

  /**
   * Achievements data with navigation
   */
  const achievementsData = [
    {
      id: 1,
      title: 'Profile Completer',
      icon: CheckCircle,
      status: 'completed',
      path: '/profile',
      color: '#059669'
    },
    {
      id: 2,
      title: 'First Course',
      icon: Book,
      status: 'pending',
      path: '/learning',
      color: '#f59e0b'
    },
    {
      id: 3,
      title: 'Published Author',
      icon: FileText,
      status: 'locked',
      path: '/publishing',
      color: '#6b7280'
    }
  ]

  /**
   * Dashboard navigation items
   */
  const dashboardTabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, path: '/dashboard' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { id: 'learning', label: 'Learning', icon: Book, path: '/learning' },
    { id: 'publishing', label: 'Publishing', icon: FileText, path: '/publishing' },
    { id: 'newsroom', label: 'Newsroom', icon: MessageSquare, path: '/news' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile-view' },
  ]

  /**
   * Quick action items for dashboard
   */
  const quickActions = [
    {
      title: 'Complete Profile',
      description: 'Finish setting up your profile',
      icon: User,
      path: '/profile',
      color: '#2563eb',
      progress: profileCompletion,
      required: profileCompletion < 100,
      info: 'Get discovered faster',
      stat: `${profileCompletion}% done`
    },
    {
      title: 'CV Generator',
      description: 'Create professional CVs',
      icon: File,
      path: '/cv-generator',
      color: '#667eea',
      info: 'Multiple templates',
      stat: '5+ designs'
    },
    {
      title: 'Browse Jobs',
      description: 'Find your next opportunity',
      icon: Briefcase,
      path: '/jobs',
      color: '#059669',
      info: 'Active listings',
      stat: '500+ jobs'
    },
    {
      title: 'Explore Courses',
      description: 'Enhance your skills',
      icon: Book,
      path: '/learning',
      color: '#dc2626',
      info: 'Get certified',
      stat: '50+ courses'
    },
    {
      title: 'Write Article',
      description: 'Share your insights',
      icon: FileText,
      path: '/publishing',
      color: '#7c3aed',
      info: 'Build reputation',
      stat: 'Publishing'
    }
  ]

  /**
   * Render profile completion card
   */
  const renderProfileCompletion = () => (
    <div className="completion-card">
      <div className="completion-header">
        <div className="completion-title">
          <User size={20} />
          <h3>Profile Completion</h3>
        </div>
        <span className="completion-percentage">{profileCompletion}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${profileCompletion}%` }}
        ></div>
      </div>
      
      <p className="completion-message">
        {profileCompletion === 100 ? (
          <>
            <CheckCircle size={16} />
            Your profile is complete! Great job.
          </>
        ) : (
          <>
            <AlertCircle size={16} />
            Complete your profile to unlock all features.
          </>
        )}
      </p>
      
      {profileCompletion < 100 && (
        <Link to="/profile" className="btn btn-primary btn-small">
          Complete Profile
        </Link>
      )}
    </div>
  )

  /**
   * Render stats cards with click handlers
   */
  const renderStats = () => (
    <div className="stats-grid">
      <div 
        className="stat-card clickable"
        onClick={() => {
          navigate('/jobs')
          showToastNotification('Navigating to Jobs...')
        }}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate('/jobs')}
      >
        <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
          <Briefcase size={24} color="#2563eb" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.jobsApplied}</div>
          <div className="stat-label">Jobs Applied</div>
        </div>
      </div>
      
      <div 
        className="stat-card clickable"
        onClick={() => {
          navigate('/learning')
          showToastNotification('Navigating to Learning Center...')
        }}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate('/learning')}
      >
        <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
          <Book size={24} color="#059669" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.coursesEnrolled}</div>
          <div className="stat-label">Courses Enrolled</div>
        </div>
      </div>
      
      <div 
        className="stat-card clickable"
        onClick={() => {
          navigate('/publishing')
          showToastNotification('Navigating to Publishing House...')
        }}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate('/publishing')}
      >
        <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
          <FileText size={24} color="#dc2626" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.articlesPublished}</div>
          <div className="stat-label">Articles Published</div>
        </div>
      </div>
      
      <div 
        className="stat-card clickable"
        onClick={() => {
          navigate('/forum')
          showToastNotification('Navigating to Forum...')
        }}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && navigate('/forum')}
      >
        <div className="stat-icon" style={{ backgroundColor: '#ffedd5' }}>
          <MessageSquare size={24} color="#ea580c" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.forumPosts}</div>
          <div className="stat-label">Forum Posts</div>
        </div>
      </div>
    </div>
  )

  /**
   * Render recent activity
   */
  const renderRecentActivity = () => {
    // Map activity types to navigation paths
    const getActivityPath = (activityType) => {
      const pathMap = {
        'job_application': '/jobs',
        'course_enrollment': '/learning',
        'article_published': '/publishing',
        'forum_post': '/forum'
      }
      return pathMap[activityType] || '/dashboard'
    }

    const handleActivityClick = (activity) => {
      const path = getActivityPath(activity.type)
      navigate(path)
    }

    return (
      <div className="activity-card">
        <div className="card-header">
          <h3>Recent Activity</h3>
          <button 
            className="text-link"
            onClick={() => navigate('/notifications')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontSize: '0.9rem', fontWeight: 600 }}
          >
            View All
          </button>
        </div>
        
        <div className="activity-list-horizontal">
          {recentActivity.length > 0 ? recentActivity.map((activity) => {
            const IconComponent = activity.icon
            const activityType = activity.badge || 'general'
            
            return (
              <div 
                key={activity.id} 
                className="activity-card-item"
                data-type={activityType}
                onClick={() => handleActivityClick(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleActivityClick(activity)
                  }
                }}
                title={`Go to ${activity.type.replace('_', ' ')}`}
              >
                <div 
                  className="activity-icon-small"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  <IconComponent size={24} color={activity.color} />
                </div>
                
                <div className="activity-content-small">
                  <div className="activity-title-small">{activity.title}</div>
                  <div className="activity-description-small">{activity.description}</div>
                  <div className="activity-time-small">
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="empty-activity">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /**
   * Render quick actions
   */
  const renderQuickActions = () => (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon
          
          return (
            <Link 
              key={index} 
              to={action.path} 
              className="action-card"
            >
              <div 
                className="action-icon"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <IconComponent size={26} color={action.color} strokeWidth={2.5} />
              </div>
              
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
                
                {action.progress !== undefined && (
                  <div className="action-progress">
                    <div className="progress-bar small">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${action.progress}%` }}
                      ></div>
                    </div>
                    <span>{action.progress}%</span>
                  </div>
                )}
              </div>
              
              <div className="action-footer">
                {action.info && (
                  <div className="action-info">
                    <Sparkles size={13} />
                    <span>{action.info}</span>
                  </div>
                )}
                {action.stat && (
                  <div className="action-stat">
                    {action.stat}
                  </div>
                )}
              </div>
              
              {!action.required && (
                <div className="action-arrow-btn">
                  <ChevronRight />
                </div>
              )}
              
              {action.required && (
                <div className="action-badge">Required</div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-message">
          <p>Please log in to access your dashboard.</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header-new">
        <div className="header-top">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            title="Go back"
            aria-label="Go back"
          >
            ←
          </button>
          
          <div className="welcome-section-new">
            <h1>Welcome back, {user.firstName || 'sneha'}!</h1>
            <p>Here's what's happening with your account today.</p>
          </div>
          
          <div className="header-actions-new">
            <button 
              className="icon-button notification-btn" 
              aria-label="Notifications"
              onClick={handleNotificationClick}
              title="View notifications"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
              )}
            </button>
            <button 
              className="icon-button" 
              aria-label="Settings"
              onClick={handleSettingsClick}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        {/* Dashboard Navigation Tabs */}
        <nav className="dashboard-nav-new">
          <ul className="nav-tabs-new">
            {dashboardTabs.map((tab) => {
              const IconComponent = tab.icon
              
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-tab-new ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id)
                      navigate(tab.path)
                    }}
                  >
                    <IconComponent size={18} />
                    {tab.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content-new">
        <div className="content-wrapper-new">
          {/* Left Side - Main Content */}
          <div className="main-section-new">
            {/* Profile Completion and Stats Row */}
            <div className="top-section-new">
              {/* Profile Completion */}
              <div className="profile-completion-new">
                <div className="completion-header-new">
                  <div className="completion-title-new">
                    <User size={20} />
                    <h3>Profile Completion</h3>
                  </div>
                  <span className="completion-percentage-new">{profileCompletion}%</span>
                </div>
                
                <div className="progress-bar-new">
                  <div 
                    className="progress-fill-new" 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                
                <p className="completion-message-new">
                  {profileCompletion === 100 ? (
                    <>
                      <CheckCircle size={16} />
                      Your profile is complete!
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      Complete your profile to unlock all features.
                    </>
                  )}
                </p>
                
                {profileCompletion < 100 && (
                  <Link to="/profile" className="btn-complete-profile">
                    Complete Profile
                  </Link>
                )}
              </div>
              
              {/* Statistics Grid */}
              <div className="stats-grid-new">
                <div 
                  className="stat-card-new"
                  onClick={() => navigate('/jobs')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon-new">
                    <Briefcase size={24} color="#2563eb" />
                  </div>
                  <div className="stat-info-new">
                    <div className="stat-number-new">{stats.jobsApplied}</div>
                    <div className="stat-label-new">JOBS APPLIED</div>
                  </div>
                </div>
                
                <div 
                  className="stat-card-new"
                  onClick={() => navigate('/learning')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon-new">
                    <Book size={24} color="#059669" />
                  </div>
                  <div className="stat-info-new">
                    <div className="stat-number-new">{stats.coursesEnrolled}</div>
                    <div className="stat-label-new">COURSES ENROLLED</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Second Row - Stats */}
            <div className="stats-row-new">
              <div 
                className="stat-card-new"
                onClick={() => navigate('/publishing')}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-icon-new">
                  <FileText size={24} color="#dc2626" />
                </div>
                <div className="stat-info-new">
                  <div className="stat-number-new">{stats.articlesPublished}</div>
                  <div className="stat-label-new">ARTICLES PUBLISHED</div>
                </div>
              </div>
              
              <div 
                className="stat-card-new"
                onClick={() => navigate('/forum')}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-icon-new">
                  <MessageSquare size={24} color="#ea580c" />
                </div>
                <div className="stat-info-new">
                  <div className="stat-number-new">{stats.forumPosts}</div>
                  <div className="stat-label-new">FORUM POSTS</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Section */}
            <div className="quick-actions-new">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                {/* CV Generator Card */}
                <div className="quick-action-card" onClick={() => navigate('/cv-generator')} style={{ cursor: 'pointer' }}>
                  <div className="qa-header">
                    <div className="qa-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                      <File size={24} color="#6366f1" />
                    </div>
                    <button className="qa-arrow">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <h4 className="qa-title">CV Generator</h4>
                  <p className="qa-description">Create professional CVs</p>
                  <div className="qa-footer">
                    <span className="qa-info">✨ Multiple templates</span>
                    <span className="qa-stat">5+ designs</span>
                  </div>
                </div>

                {/* Browse Jobs Card */}
                <div className="quick-action-card" onClick={() => navigate('/jobs')} style={{ cursor: 'pointer' }}>
                  <div className="qa-header">
                    <div className="qa-icon-wrapper" style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)' }}>
                      <Briefcase size={24} color="#059669" />
                    </div>
                    <button className="qa-arrow">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <h4 className="qa-title">Browse Jobs</h4>
                  <p className="qa-description">Find your next opportunity</p>
                  <div className="qa-footer">
                    <span className="qa-info">✨ Active listings</span>
                    <span className="qa-stat">500+ jobs</span>
                  </div>
                </div>

                {/* Explore Courses Card */}
                <div className="quick-action-card" onClick={() => navigate('/learning')} style={{ cursor: 'pointer' }}>
                  <div className="qa-header">
                    <div className="qa-icon-wrapper" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
                      <Book size={24} color="#dc2626" />
                    </div>
                    <button className="qa-arrow">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <h4 className="qa-title">Explore Courses</h4>
                  <p className="qa-description">Enhance your skills</p>
                  <div className="qa-footer">
                    <span className="qa-info">✨ Get certified</span>
                    <span className="qa-stat">50+ courses</span>
                  </div>
                </div>

                {/* Write Article Card */}
                <div className="quick-action-card" onClick={() => navigate('/publishing')} style={{ cursor: 'pointer' }}>
                  <div className="qa-header">
                    <div className="qa-icon-wrapper" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                      <FileText size={24} color="#7c3aed" />
                    </div>
                    <button className="qa-arrow">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <h4 className="qa-title">Write Article</h4>
                  <p className="qa-description">Share your insights</p>
                  <div className="qa-footer">
                    <span className="qa-info">✨ Build reputation</span>
                    <span className="qa-stat">Publishing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Activity and Events */}
          <div className="sidebar-new">
            {/* Recent Activity */}
            <div className="recent-activity-new">
              <div className="card-header-new">
                <h3>Recent Activity</h3>
                <button 
                  className="view-all-link"
                  onClick={() => navigate('/notifications')}
                >
                  View All
                </button>
              </div>
              
              <div className="activity-list-new">
                {recentActivity.length > 0 ? recentActivity.map((activity) => {
                  const IconComponent = activity.icon
                  
                  return (
                    <div 
                      key={activity.id} 
                      className="activity-item-new"
                      onClick={() => {
                        const pathMap = {
                          'job_application': '/jobs',
                          'course_enrollment': '/learning',
                          'article_published': '/publishing',
                          'forum_post': '/forum'
                        }
                        navigate(pathMap[activity.type] || '/dashboard')
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div 
                        className="activity-icon-new"
                        style={{ backgroundColor: `${activity.color}20` }}
                      >
                        <IconComponent size={20} color={activity.color} />
                      </div>
                      
                      <div className="activity-content-new">
                        <div className="activity-title-new">{activity.title}</div>
                        <div className="activity-description-new">{activity.description}</div>
                        <div className="activity-time-new">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="empty-activity">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="upcoming-events-new">
              <div className="card-header-new">
                <h3 style={{cursor: 'pointer'}} onClick={() => navigate('/networking-arena', { state: { activeTab: 'events' } })}>Upcoming Events</h3>
                <button
                  onClick={() => navigate('/networking-arena', { state: { activeTab: 'events' } })}
                  className="icon-link-btn"
                  title="View all events"
                >
                  <Calendar size={18} color="#2563eb" />
                </button>
              </div>
              <div className="events-list-new">
                <div className="event-item-new">
                  <div className="event-date-box">
                    <div className="event-day">20</div>
                    <div className="event-month">FEB</div>
                  </div>
                  <div className="event-details">
                    <div className="event-title-new">Urban Planning Webinar</div>
                    <div className="event-time-new">2:00 PM - 3:30 PM</div>
                  </div>
                </div>
                <div className="event-item-new">
                  <div className="event-date-box">
                    <div className="event-day">25</div>
                    <div className="event-month">FEB</div>
                  </div>
                  <div className="event-details">
                    <div className="event-title-new">Course Submission Deadline</div>
                    <div className="event-time-new">11:59 PM</div>
                  </div>
                </div>
              </div>
              <button className="view-all-events-btn" onClick={() => navigate('/networking-arena', { state: { activeTab: 'events' } })}>
                View All Events
              </button>
            </div>

            {/* Achievements */}
            <div className="achievements-new">
              <div className="card-header-new">
                <h3>Achievements</h3>
                <Award size={18} color="#6b7280" />
              </div>
              <div className="achievements-list-new">
                <div className="achievement-item-new completed">
                  <CheckCircle size={18} color="#10b981" />
                  <span>Profile Completer</span>
                </div>
                <div className="achievement-item-new pending">
                  <Book size={18} color="#f59e0b" />
                  <span>First Course</span>
                </div>
                <div className="achievement-item-new locked">
                  <FileText size={18} color="#9ca3af" />
                  <span>Published Author</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {/* Settings Modal removed as we now have a dedicated Settings page */}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="password-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <div className="modal-title-section">
                <Settings size={24} />
                <h2>Change Password</h2>
              </div>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="password-modal-body">
              <p className="password-info">
                Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </p>
              
              <div className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="password-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="password-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="password-input"
                  />
                </div>
                
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: passwordData.newPassword.length >= 8 ? '100%' : '33%' }}></div>
                  </div>
                  <span className="strength-text">
                    {passwordData.newPassword.length === 0 ? 'No password entered' : 
                     passwordData.newPassword.length < 8 ? 'Weak password' : 'Strong password'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="password-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={handlePasswordChange}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard