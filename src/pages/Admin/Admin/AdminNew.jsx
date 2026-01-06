import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import * as adminService from '../../../services/api/admin'
import './Admin.css'

// Import subcomponents
import DashboardOverview from './components/DashboardOverview'
import UserManagement from './components/UserManagement'
import JobPortalManagement from './components/JobPortalManagement'
import LearningCenterManagement from './components/LearningCenterManagement'
import NewsroomManagement from './components/NewsroomManagement'
import ForumManagement from './components/ForumManagement'
import PublishingManagement from './components/PublishingManagement'
import NetworkingManagement from './components/NetworkingManagement'
import AnalyticsView from './components/AnalyticsView'

const Admin = () => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  useEffect(() => {
    if (adminUser) {
      loadDashboardStats()
    }
  }, [adminUser])

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      console.log('No token found, redirecting to admin login')
      navigate('/admin/login')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        console.log('Auth check failed, clearing token')
        localStorage.removeItem('authToken')
        navigate('/admin/login')
        return
      }

      const data = await response.json()
      console.log('User data:', data)
      
      if (data.role === 'admin') {
        setAdminUser(data)
      } else {
        toast.error('Access denied: Admin privileges required')
        localStorage.removeItem('authToken')
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      toast.error('Authentication failed')
      localStorage.removeItem('authToken')
      navigate('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  const loadDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats()
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Failed to load dashboard statistics')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'jobs', label: 'Job Portal', icon: '💼' },
    { id: 'learning', label: 'Learning Center', icon: '🎓' },
    { id: 'newsroom', label: 'Newsroom', icon: '📰' },
    { id: 'forum', label: 'Discussion Forum', icon: '💬' },
    { id: 'publishing', label: 'Publishing House', icon: '📚' },
    { id: 'networking', label: 'Networking Arena', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview stats={stats} onNavigate={setActiveView} />
      case 'users':
        return <UserManagement />
      case 'jobs':
        return <JobPortalManagement />
      case 'learning':
        return <LearningCenterManagement />
      case 'newsroom':
        return <NewsroomManagement />
      case 'forum':
        return <ForumManagement />
      case 'publishing':
        return <PublishingManagement />
      case 'networking':
        return <NetworkingManagement />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <DashboardOverview stats={stats} onNavigate={setActiveView} />
    }
  }

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="neu-card admin-header">
          <div className="admin-header-left">
            <h1>🛡️ Admin Control Panel</h1>
            <p className="admin-header-subtitle">
              Welcome back, {adminUser?.profile?.firstName || adminUser?.email}
            </p>
          </div>
          <div className="admin-header-actions">
            <button className="neu-btn" onClick={() => window.location.href = '/'}>
              🏠 Home
            </button>
            <button className="neu-btn-danger neu-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="admin-layout">
          {/* Sidebar Navigation */}
          <aside className="admin-sidebar">
            <nav className="neu-card">
              <ul className="admin-nav">
                {navigationItems.map(item => (
                  <li key={item.id} className="admin-nav-item">
                    <a
                      href="#"
                      className={`admin-nav-link ${activeView === item.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveView(item.id)
                      }}
                    >
                      <span className="admin-nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Admin
