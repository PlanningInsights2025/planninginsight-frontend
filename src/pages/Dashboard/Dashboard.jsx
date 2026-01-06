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
  ChevronRight,
  Edit3
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
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your CV has been viewed 5 times', time: '2 hours ago', read: false },
    { id: 2, message: 'New job posting matching your profile', time: '4 hours ago', read: false },
    { id: 3, message: 'Course enrollment confirmed', time: '1 day ago', read: true }
  ])
  const [settings, setSettings] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    return {
      emailNotifications: true,
      pushNotifications: true,
      jobAlerts: true,
      courseUpdates: true,
      forumMentions: true,
      articleUpdates: false,
      darkMode: savedDarkMode === 'true',
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
  const [articlesNeedingModification, setArticlesNeedingModification] = useState([])

  /**
   * Check if user is first-time and redirect to profile completion
   */
  useEffect(() => {
    console.log('📊 Dashboard: Auth State:', { isAuthenticated, user: user ? 'exists' : 'null', userEmail: user?.email })
    
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
  }, [user, location, showNotification, isAuthenticated])

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
   * Check URL params to open settings modal
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('openSettings') === 'true') {
      setShowSettingsModal(true)
      // Clean up URL
      navigate('/dashboard', { replace: true })
    }
  }, [location.search, navigate])

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
    setShowSettingsModal(true)
  }

  /**
   * Update settings
   */
  const updateSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    showToastNotification(`✓ ${key} updated`)
  }

  /**
   * Save settings
   */
  const saveSettings = () => {
    showToastNotification('✓ Settings saved successfully!')
    setShowSettingsModal(false)
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
  const loadUserData = async () => {
    // Mock data - in real app, this would come from API
    setStats({
      jobsApplied: 12,
      coursesEnrolled: 3,
      articlesPublished: 2,
      forumPosts: 8
    })
    
    // Load user's articles to check for modifications needed
    try {
      const { newsroomAPI } = await import('../../services/api/newsroom')
      const response = await newsroomAPI.getUserArticles()
      const userArticles = response.data?.articles || response.articles || []
      const needsModification = userArticles.filter(
        article => article.approvalStatus === 'needsModification'
      )
      setArticlesNeedingModification(needsModification)
    } catch (error) {
      console.error('Error loading user articles:', error)
    }
    
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
    { id: 'newsroom', label: 'Newsroom', icon: MessageSquare, path: '/news' }
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
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
              title="Go back"
              aria-label="Go back"
            >
              ←
            </button>
            <h1>
              Welcome back, {user.firstName}!
              {user.uniqueCode && (
                <span className="user-code">({user.uniqueCode})</span>
              )}
            </h1>
            <p>Here's what's happening with your account today.</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="icon-button notification-btn" 
              aria-label="Notifications"
              onClick={handleNotificationClick}
              style={{ cursor: 'pointer' }}
              title="View notifications"
            >
              <Bell size={20} />
              <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
            </button>
            <button 
              className="icon-button" 
              aria-label="Settings"
              onClick={handleSettingsClick}
              style={{ cursor: 'pointer' }}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        {/* Dashboard Navigation */}
        <nav className="dashboard-nav">
          <ul className="nav-tabs">
            {dashboardTabs.map((tab) => {
              const IconComponent = tab.icon
              
              return (
                <li key={tab.id} className="nav-item">
                  <button
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
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
      <div className="dashboard-content">
        <div className="content-grid">
          {/* Main Content Area */}
          <div className="main-content">
            {/* Article Modification Alert */}
            {articlesNeedingModification.length > 0 && (
              <div className="dashboard-alert modification-alert">
                <div className="alert-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="alert-content">
                  <h3>Articles Need Your Attention</h3>
                  <p>
                    You have {articlesNeedingModification.length} article{articlesNeedingModification.length > 1 ? 's' : ''} that require modification.
                    Please review the admin feedback and update your content.
                  </p>
                </div>
                <button 
                  className="alert-action-btn"
                  onClick={() => navigate('/my-articles')}
                >
                  <Edit3 size={18} />
                  Review Articles
                </button>
              </div>
            )}

            {/* Profile Completion */}
            {profileCompletion < 100 && renderProfileCompletion()}
            
            {/* Statistics */}
            {renderStats()}
            
            {/* Quick Actions */}
            {renderQuickActions()}
          </div>
          
          {/* Sidebar */}
          <div className="sidebar">
            {/* Recent Activity */}
            {renderRecentActivity()}
            
            {/* Upcoming Events (placeholder) */}
            <div className="events-card">
              <div className="card-header">
                <h3>Upcoming Events</h3>
                <button
                  onClick={() => navigate('/learning/events')}
                  className="calendar-icon-btn"
                  title="View all events"
                  aria-label="View all events"
                >
                  <Calendar size={18} />
                </button>
              </div>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-date">
                    <span className="day">20</span>
                    <span className="month">Feb</span>
                  </div>
                  <div className="event-content">
                    <div className="event-title">Urban Planning Webinar</div>
                    <div className="event-time">2:00 PM - 3:30 PM</div>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-date">
                    <span className="day">25</span>
                    <span className="month">Feb</span>
                  </div>
                  <div className="event-content">
                    <div className="event-title">Course Submission Deadline</div>
                    <div className="event-time">11:59 PM</div>
                  </div>
                </div>
              </div>
              <Link to="/learning/events" className="btn btn-outline btn-small w-full">
                View All Events
              </Link>
            </div>
            
            {/* Achievements (placeholder) */}
            <div className="achievements-card">
              <div className="card-header">
                <h3>Achievements</h3>
                <Award size={18} />
              </div>
              <div className="achievements-list">
                {achievementsData.map((achievement) => {
                  const IconComponent = achievement.icon
                  return (
                    <button
                      key={achievement.id}
                      className="achievement-item"
                      onClick={() => navigate(achievement.path)}
                      title={`Go to ${achievement.title}`}
                      type="button"
                    >
                      <div className={`achievement-icon ${achievement.status}`}>
                        <IconComponent size={16} />
                      </div>
                      <span>{achievement.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <div className="modal-title-section">
                <Settings size={24} />
                <h2>Settings</h2>
              </div>
              <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="settings-modal-body">
              <div className="settings-left-section">
                {/* Profile Completion Card */}
                <div className="settings-profile-card">
                  <div className="profile-card-header">
                    <User size={20} />
                    <h3>Profile Completion</h3>
                  </div>
                  <div className="profile-completion-percentage">{profileCompletion}%</div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <p className="profile-completion-text">
                    {profileCompletion === 100 
                      ? 'Your profile is complete! Great job.' 
                      : 'Complete your profile to unlock all features.'}
                  </p>
                  {profileCompletion < 100 && (
                    <Link 
                      to="/profile" 
                      className="btn-complete-profile"
                      onClick={() => setShowSettingsModal(false)}
                    >
                      Complete Profile
                    </Link>
                  )}
                </div>

                {/* Account Security Card */}
                <div className="settings-security-card">
                  <h3>Account Security</h3>
                  <div className="security-status">
                    <div className="security-item">
                      <CheckCircle size={16} />
                      <span>Email Verified</span>
                    </div>
                    <div className="security-item">
                      {settings.twoFactorAuth ? (
                        <><CheckCircle size={16} /><span>2FA Enabled</span></>
                      ) : (
                        <><AlertCircle size={16} /><span>2FA Disabled</span></>
                      )}
                    </div>
                    <div className="security-item">
                      <CheckCircle size={16} />
                      <span>Strong Password</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="settings-activity-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-items">
                    {recentActivity.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="activity-item-small">
                        <div className="activity-icon-wrapper">
                          <Briefcase size={16} />
                        </div>
                        <div className="activity-details">
                          <p className="activity-title">{activity.title}</p>
                          <p className="activity-subtitle">{activity.description}</p>
                          <p className="activity-time">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="settings-right-section">
                {/* Account Management */}
                <div className="settings-section">
                  <h3 className="settings-section-title">Account Management</h3>
                  <div className="settings-options">
                    <button 
                      className="setting-action-btn"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <Settings size={18} />
                      <div>
                        <div className="setting-label">Change Password</div>
                        <div className="setting-description">Update your account password</div>
                      </div>
                    </button>

                    <button 
                      className="setting-action-btn"
                      onClick={handleEmailChange}
                    >
                      <Bell size={18} />
                      <div>
                        <div className="setting-label">Change Email</div>
                        <div className="setting-description">Update your email address</div>
                      </div>
                    </button>

                    <div className="setting-option">
                      <div className="setting-info">
                        <CheckCircle size={18} />
                        <div>
                          <div className="setting-label">Two-Factor Authentication</div>
                          <div className="setting-description">Add an extra layer of security</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.twoFactorAuth}
                          onChange={() => updateSetting('twoFactorAuth')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <button 
                      className="setting-action-btn"
                      onClick={() => setShowSessionsModal(true)}
                    >
                      <Clock size={18} />
                      <div>
                        <div className="setting-label">Active Sessions</div>
                        <div className="setting-description">Manage your logged-in devices</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="settings-section">
                  <h3 className="settings-section-title">Notification Preferences</h3>
                  <div className="settings-options">
                    <div className="setting-option">
                      <div className="setting-info">
                        <Bell size={18} />
                        <div>
                          <div className="setting-label">Email Notifications</div>
                          <div className="setting-description">Receive notifications via email</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.emailNotifications}
                          onChange={() => updateSetting('emailNotifications')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <Bell size={18} />
                        <div>
                          <div className="setting-label">Push Notifications</div>
                          <div className="setting-description">Enable browser push notifications</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.pushNotifications}
                          onChange={() => updateSetting('pushNotifications')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <Briefcase size={18} />
                        <div>
                          <div className="setting-label">Job Alerts</div>
                          <div className="setting-description">Get notified about new job postings</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.jobAlerts}
                          onChange={() => updateSetting('jobAlerts')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <Book size={18} />
                        <div>
                          <div className="setting-label">Course Updates</div>
                          <div className="setting-description">Updates on enrolled courses</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.courseUpdates}
                          onChange={() => updateSetting('courseUpdates')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <MessageSquare size={18} />
                        <div>
                          <div className="setting-label">Forum Mentions</div>
                          <div className="setting-description">When someone mentions you in forums</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.forumMentions}
                          onChange={() => updateSetting('forumMentions')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <FileText size={18} />
                        <div>
                          <div className="setting-label">Article Updates</div>
                          <div className="setting-description">Newsletter and article publications</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.articleUpdates}
                          onChange={() => updateSetting('articleUpdates')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Appearance Section */}
                <div className="settings-section">
                  <h3 className="settings-section-title">Appearance & Display</h3>
                  <div className="settings-options">
                    <div className="setting-option">
                      <div className="setting-info">
                        <Settings size={18} />
                        <div>
                          <div className="setting-label">Dark Mode</div>
                          <div className="setting-description">Switch to dark theme</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.darkMode}
                          onChange={() => updateSetting('darkMode')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <TrendingUp size={18} />
                        <div>
                          <div className="setting-label">Compact Mode</div>
                          <div className="setting-description">Show more content in less space</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.compactMode}
                          onChange={() => updateSetting('compactMode')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-option">
                      <div className="setting-info">
                        <Award size={18} />
                        <div>
                          <div className="setting-label">Animations</div>
                          <div className="setting-description">Enable smooth animations and transitions</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.animationsEnabled}
                          onChange={() => updateSetting('animationsEnabled')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security Section */}
                <div className="settings-section">
                  <h3 className="settings-section-title">Privacy & Security</h3>
                  <div className="settings-options">
                    <div className="setting-option">
                      <div className="setting-info">
                        <User size={18} />
                        <div>
                          <div className="setting-label">Public Profile</div>
                          <div className="setting-description">Make your profile visible to others</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.publicProfile}
                          onChange={() => updateSetting('publicProfile')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Language & Region */}
                <div className="settings-section">
                  <h3 className="settings-section-title">Language & Region</h3>
                  <div className="settings-options">
                    <div className="setting-option-full">
                      <div className="setting-info">
                        <Settings size={18} />
                        <div className="setting-full-width">
                          <div className="setting-label">Language</div>
                          <div className="setting-description">Choose your preferred language</div>
                          <select 
                            className="setting-select"
                            value={settings.language}
                            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                          >
                            <option value="en">English</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="es">Español (Spanish)</option>
                            <option value="fr">Français (French)</option>
                            <option value="de">Deutsch (German)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="setting-option-full">
                      <div className="setting-info">
                        <Clock size={18} />
                        <div className="setting-full-width">
                          <div className="setting-label">Timezone</div>
                          <div className="setting-description">Your local timezone for dates and times</div>
                          <select 
                            className="setting-select"
                            value={settings.timezone}
                            onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                          >
                            <option value="Asia/Kolkata">India Standard Time (IST) - {getTimeInTimezone('Asia/Kolkata')}</option>
                            <option value="America/New_York">Eastern Time (ET) - {getTimeInTimezone('America/New_York')}</option>
                            <option value="America/Los_Angeles">Pacific Time (PT) - {getTimeInTimezone('America/Los_Angeles')}</option>
                            <option value="Europe/London">London (GMT) - {getTimeInTimezone('Europe/London')}</option>
                            <option value="Asia/Dubai">Dubai (GST) - {getTimeInTimezone('Asia/Dubai')}</option>
                            <option value="Asia/Singapore">Singapore (SGT) - {getTimeInTimezone('Asia/Singapore')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div className="settings-section settings-section-danger">
                  <h3 className="settings-section-title">Data Management</h3>
                  <div className="settings-options">
                    <button 
                      className="setting-action-btn setting-action-export"
                      onClick={handleDataExport}
                    >
                      <File size={18} />
                      <div>
                        <div className="setting-label">Export Your Data</div>
                        <div className="setting-description">Download a copy of your profile and activity</div>
                      </div>
                    </button>

                    <button 
                      className="setting-action-btn setting-action-delete"
                      onClick={handleAccountDeletion}
                    >
                      <AlertCircle size={18} />
                      <div>
                        <div className="setting-label">Delete Account</div>
                        <div className="setting-description">Permanently remove your account and data</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowSettingsModal(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={saveSettings}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

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