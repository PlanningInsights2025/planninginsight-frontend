import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  AlertCircle
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
  
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [recentActivity, setRecentActivity] = useState([])
  const [stats, setStats] = useState({
    jobsApplied: 0,
    coursesEnrolled: 0,
    articlesPublished: 0,
    forumPosts: 0
  })

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
   * Dashboard navigation items
   */
  const dashboardTabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'learning', label: 'Learning', icon: Book },
    { id: 'publishing', label: 'Publishing', icon: FileText },
    { id: 'newsroom', label: 'Newsroom', icon: MessageSquare }
  ]

  /**
   * Quick action items for dashboard
   */
  const quickActions = [
    {
      title: 'Complete Profile',
      description: 'Finish setting up your profile',
      icon: User,
      path: '/dashboard/profile',
      color: '#2563eb',
      progress: profileCompletion,
      required: profileCompletion < 100
    },
    {
      title: 'Browse Jobs',
      description: 'Find your next opportunity',
      icon: Briefcase,
      path: '/jobs',
      color: '#059669'
    },
    {
      title: 'Explore Courses',
      description: 'Enhance your skills',
      icon: Book,
      path: '/learning',
      color: '#dc2626'
    },
    {
      title: 'Write Article',
      description: 'Share your insights',
      icon: FileText,
      path: '/news/submit',
      color: '#7c3aed'
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
        <Link to="/dashboard/profile" className="btn btn-primary btn-small">
          Complete Profile
        </Link>
      )}
    </div>
  )

  /**
   * Render stats cards
   */
  const renderStats = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
          <Briefcase size={24} color="#2563eb" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.jobsApplied}</div>
          <div className="stat-label">Jobs Applied</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
          <Book size={24} color="#059669" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.coursesEnrolled}</div>
          <div className="stat-label">Courses Enrolled</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
          <FileText size={24} color="#dc2626" />
        </div>
        <div className="stat-content">
          <div className="stat-number">{stats.articlesPublished}</div>
          <div className="stat-label">Articles Published</div>
        </div>
      </div>
      
      <div className="stat-card">
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
  const renderRecentActivity = () => (
    <div className="activity-card">
      <div className="card-header">
        <h3>Recent Activity</h3>
        <Link to="/dashboard/activity" className="text-link">
          View All
        </Link>
      </div>
      
      <div className="activity-list">
        {recentActivity.map((activity) => {
          const IconComponent = activity.icon
          
          return (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ backgroundColor: `${activity.color}15` }}
              >
                <IconComponent size={16} color={activity.color} />
              </div>
              
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-time">
                  <Clock size={12} />
                  {formatDate(activity.timestamp)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

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
                <IconComponent size={24} color={action.color} />
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
            <h1>
              Welcome back, {user.firstName}!
              {user.uniqueCode && (
                <span className="user-code">({user.uniqueCode})</span>
              )}
            </h1>
            <p>Here's what's happening with your account today.</p>
          </div>
          
          <div className="header-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <Link to="/dashboard/settings" className="icon-button" aria-label="Settings">
              <Settings size={20} />
            </Link>
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
                    onClick={() => setActiveTab(tab.id)}
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
                <Calendar size={18} />
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
                <div className="achievement-item">
                  <div className="achievement-icon completed">
                    <CheckCircle size={16} />
                  </div>
                  <span>Profile Completer</span>
                </div>
                <div className="achievement-item">
                  <div className="achievement-icon pending">
                    <Book size={16} />
                  </div>
                  <span>First Course</span>
                </div>
                <div className="achievement-item">
                  <div className="achievement-icon locked">
                    <FileText size={16} />
                  </div>
                  <span>Published Author</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard