import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import * as adminService from '../../../services/api/admin'
import './Admin.css'
import './AdminModern.css'

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
import RoleRequestManagement from './components/RoleRequestManagement'

const BrandMonogram = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="piBadge" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6754ff" />
        <stop offset="1" stopColor="#2bd4ff" />
      </linearGradient>
      <linearGradient id="piAccent" x1="12" y1="10" x2="26" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9a7bff" />
        <stop offset="1" stopColor="#42e9ff" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="24" height="24" rx="11" fill="rgba(6,9,20,0.9)" stroke="url(#piBadge)" strokeWidth="1.4" />
    <path d="M13.5 24V12.25h6c2.7 0 4.5 1.7 4.5 3.95S22.2 20.1 19.5 20.1h-6" stroke="url(#piAccent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21.5 12.25V24" stroke="url(#piAccent)" strokeWidth="2" strokeLinecap="round" />
    <polyline points="12.5,24.2 16.5,19.4 19.2,21.3 23.5,16.8" stroke="#42e9ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

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
    const token = localStorage.getItem('adminToken')
    const isAdminSession = localStorage.getItem('isAdminSession') === 'true'
    
    if (!token) {
      console.log('No token found, redirecting to admin login')
      navigate('/admin/login')
      return
    }

    // If this is not an admin session, redirect to admin login
    if (!isAdminSession && !localStorage.getItem('adminToken')) {
      console.log('Not an admin session, redirecting to admin login')
      navigate('/admin/login')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) {
        console.log('Auth check failed, clearing tokens')
        localStorage.removeItem('authToken')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('isAdminSession')
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
        localStorage.removeItem('adminToken')
        localStorage.removeItem('isAdminSession')
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      toast.error('Authentication failed')
      localStorage.removeItem('authToken')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('isAdminSession')
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
    localStorage.removeItem('adminToken')
    localStorage.removeItem('isAdminSession')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const iconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  const navIcons = {
    dashboard: (
      <svg {...iconProps}>
        <path d="M3 13h6V3H3zM15 21h6V11h-6zM15 3v6h6V3zM3 21h6v-6H3z" />
      </svg>
    ),
    users: (
      <svg {...iconProps}>
        <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M2 21a6 6 0 0 1 12 0" />
        <path d="M14 21a6 6 0 0 1 8 0" />
      </svg>
    ),
    'role-requests': (
      <svg {...iconProps}>
        <path d="M6 10V4h12v6" />
        <path d="M6 14h12v6H6z" />
        <path d="M12 8v4" />
      </svg>
    ),
    jobs: (
      <svg {...iconProps}>
        <path d="M4 9h16l-1 10H5z" />
        <path d="M9 9V6h6v3" />
      </svg>
    ),
    learning: (
      <svg {...iconProps}>
        <path d="M4 7l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4" />
        <path d="M4 17l8 4 8-4" />
      </svg>
    ),
    newsroom: (
      <svg {...iconProps}>
        <path d="M5 4h14v16H5z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
    ),
    forum: (
      <svg {...iconProps}>
        <path d="M4 6h12v8H7l-3 3z" />
        <path d="M16 10h4v8h-3l-1 1" />
      </svg>
    ),
    publishing: (
      <svg {...iconProps}>
        <path d="M6 4h12v16H6z" />
        <path d="M10 8h4M10 12h4M10 16h4" />
      </svg>
    ),
    networking: (
      <svg {...iconProps}>
        <circle cx="6" cy="8" r="3" />
        <circle cx="18" cy="8" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="M8.5 10.5 10 15M15.5 10.5 14 15" />
      </svg>
    ),
    analytics: (
      <svg {...iconProps}>
        <path d="M4 21V9" />
        <path d="M10 21V3" />
        <path d="M16 21v-6" />
        <path d="M20 21v-4" />
      </svg>
    )
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'users', label: 'User Management', icon: 'users' },
    { id: 'role-requests', label: 'Role Upgrade Requests', icon: 'role-requests' },
    { id: 'jobs', label: 'Job Portal', icon: 'jobs' },
    { id: 'learning', label: 'Learning Center', icon: 'learning' },
    { id: 'newsroom', label: 'Newsroom', icon: 'newsroom' },
    { id: 'forum', label: 'Discussion Forum', icon: 'forum' },
    { id: 'publishing', label: 'Publishing House', icon: 'publishing' },
    { id: 'networking', label: 'Networking Arena', icon: 'networking' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' }
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview stats={stats} onNavigate={setActiveView} />
      case 'users':
        return <UserManagement />
      case 'role-requests':
        return <RoleRequestManagement />
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

  const headerIconProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  const headerIcons = {
    home: (
      <svg {...headerIconProps}>
        <path d="M3 10.5 12 4l9 6.5" />
        <path d="M5 10v10h5v-6h4v6h5V10" />
      </svg>
    ),
    logout: (
      <svg {...headerIconProps}>
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
        <path d="M9 5V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4v-2" />
      </svg>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <span className="admin-header-icon" aria-hidden="true">
              <BrandMonogram />
            </span>
            <div className="admin-header-copy">
              <span className="admin-header-eyebrow">Planning Insights</span>
              <h1>Admin Control Panel</h1>
              <p className="admin-header-subtitle">
                Welcome back, {adminUser?.profile?.firstName || adminUser?.email}
              </p>
              <p className="admin-header-tagline">Manage platform analytics &amp; operations</p>
            </div>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className="header-action-btn"
              onClick={() => { window.location.href = '/' }}
            >
              <span className="header-action-icon" aria-hidden="true">
                {headerIcons.home}
              </span>
              <span>Home</span>
            </button>
            <button
              type="button"
              className="header-action-btn danger"
              onClick={handleLogout}
            >
              <span className="header-action-icon" aria-hidden="true">
                {headerIcons.logout}
              </span>
              <span>Logout</span>
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
                      title={item.label}
                      className={`admin-nav-link ${activeView === item.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveView(item.id)
                      }}
                    >
                      <span className="admin-nav-icon" aria-hidden="true">
                        {navIcons[item.icon]}
                      </span>
                      <span className="admin-nav-label">{item.label}</span>
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
