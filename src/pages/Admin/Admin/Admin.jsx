import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminModern.css'

const Admin = () => {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState(null)

  const fetchDashboardStats = async (authToken) => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/dashboard-stats', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }

      const data = await response.json()
      if (data?.success && data?.stats) {
        setDashboardStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken')
    
    if (!token) {
      // No token, redirect to login
      navigate('/login')
      return
    }

    const verifyAdmin = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to verify admin user')
        }

        const data = await response.json()

        if (data.role === 'admin') {
          setAdminUser(data)
          await fetchDashboardStats(token)
        } else {
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    verifyAdmin()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  const formatStatValue = (value) =>
    typeof value === 'number' ? value.toLocaleString() : '--'

  const heroMetrics = [
    { label: 'Active Users', value: formatStatValue(dashboardStats?.users) },
    { label: 'Courses Live', value: formatStatValue(dashboardStats?.courses) },
    { label: 'Open Jobs', value: formatStatValue(dashboardStats?.jobs) },
    { label: 'Articles Published', value: formatStatValue(dashboardStats?.articles) }
  ]

  const overviewStats = [
    { icon: '👥', label: 'Users', value: formatStatValue(dashboardStats?.users) },
    { icon: '📚', label: 'Courses', value: formatStatValue(dashboardStats?.courses) },
    { icon: '💼', label: 'Jobs', value: formatStatValue(dashboardStats?.jobs) },
    { icon: '📰', label: 'Articles', value: formatStatValue(dashboardStats?.articles) }
  ]

  const quickActions = [
    { icon: '📋', label: 'Manage Users' },
    { icon: '📚', label: 'Manage Courses' },
    { icon: '💼', label: 'Manage Jobs' },
    { icon: '⚙️', label: 'Settings' }
  ]

  if (isLoading) {
    return (
      <div style={{padding: 40, textAlign: 'center'}}>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <section className="hero-card glass-card">
          <div className="hero-copy">
            <p className="hero-eyebrow">Control Center</p>
            <h1 className="hero-title">Admin Dashboard</h1>
            <p className="hero-subtitle">
              Welcome back, {adminUser?.firstName || adminUser?.email}
            </p>
            <div className="hero-actions">
              <button type="button" className="cta-btn">Review Submissions</button>
              <button type="button" className="ghost-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          <div className="hero-metrics">
            {heroMetrics.map(metric => (
              <div key={metric.label}>
                <span className="hero-metric-label">{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-grid premium-grid">
          {overviewStats.map(stat => (
            <div key={stat.label} className="glass-card stat-card">
              <div className="stat-header">
                <div className="stat-icon-circle" aria-hidden="true">
                  <span>{stat.icon}</span>
                </div>
              </div>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="glass-card quick-actions">
          <div className="panel-header">
            <div className="panel-title">
              <div className="panel-title-icon" aria-hidden="true">⚡️</div>
              <div>
                <p className="eyebrow">Workflow</p>
                <h2>Quick Actions</h2>
              </div>
            </div>
          </div>
          <div className="quick-actions-row">
            {quickActions.map(action => (
              <button key={action.label} type="button" className="action-pill">
                <span className="pill-icon" aria-hidden="true">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </section>

        <section className="glass-card status-card">
          <p>
            ✅ <strong>Admin Account Active:</strong> {adminUser?.email}
          </p>
        </section>
      </div>
    </div>
  )
}

export default Admin
