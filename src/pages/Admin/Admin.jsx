<<<<<<< HEAD
import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Admin Dashboard Component
 */
const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Users', value: '1,234', color: '#667eea' },
    { label: 'Active Jobs', value: '45', color: '#764ba2' },
    { label: 'Courses', value: '23', color: '#f093fb' },
    { label: 'Forum Threads', value: '189', color: '#4facfe' }
  ]

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '2rem',
      borderRadius: '15px',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '1rem',
      color: '#666',
      margin: 0
    },
    menuGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    menuCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: 'none',
      textAlign: 'left',
      width: '100%'
    },
    menuIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    menuTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#333'
    },
    menuDescription: {
      fontSize: '0.95rem',
      color: '#666',
      margin: 0
    }
  }

  const menuItems = [
    {
      icon: '👥',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      path: '/admin/users'
    },
    {
      icon: '💼',
      title: 'Job Management',
      description: 'Manage job postings and applications',
      path: '/admin/jobs'
    },
    {
      icon: '📚',
      title: 'Course Management',
      description: 'Manage learning courses and content',
      path: '/admin/courses'
    },
    {
      icon: '💬',
      title: 'Forum Moderation',
      description: 'Moderate forum threads and comments',
      path: '/admin/forum'
    },
    {
      icon: '📰',
      title: 'Content Management',
      description: 'Manage articles and news content',
      path: '/admin/content'
    },
    {
      icon: '⚙️',
      title: 'Settings',
      description: 'System settings and configuration',
      path: '/admin/settings'
    }
  ]

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome back, {user?.profile?.firstName || user?.email || 'Admin'}! 
          Manage your platform from here.
        </p>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ ...styles.statValue, color: stat.color }}>
              {stat.value}
            </div>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu Items */}
      <div style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            style={styles.menuCard}
            onClick={() => navigate(item.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={styles.menuIcon}>{item.icon}</div>
            <h3 style={styles.menuTitle}>{item.title}</h3>
            <p style={styles.menuDescription}>{item.description}</p>
          </button>
        ))}
      </div>
=======
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      // No token, redirect to login
      navigate('/login')
      return
    }

    // Verify admin token
    fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.role === 'admin') {
        setAdminUser(data)
      } else {
        // Not an admin, redirect to user dashboard
        navigate('/dashboard')
      }
      setIsLoading(false)
    })
    .catch(err => {
      console.error('Auth check failed:', err)
      navigate('/login')
    })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div style={{padding: 40, textAlign: 'center'}}>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{padding: 40, maxWidth: 1200, margin: '0 auto'}}>
      <div style={{
        background: '#f8f9fa',
        padding: 30,
        borderRadius: 12,
        marginBottom: 30,
        border: '2px solid #524393'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: 0, color: '#524393', fontSize: 32}}>
              🛡️ Admin Dashboard
            </h1>
            <p style={{margin: '10px 0 0 0', color: '#666'}}>
              Welcome back, {adminUser?.firstName || adminUser?.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 20,
        marginBottom: 30
      }}>
        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>👥</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Users</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>📚</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Courses</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>💼</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Jobs</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>📰</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Articles</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{margin: '0 0 20px 0', fontSize: 20, color: '#374151'}}>
          Quick Actions
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15}}>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            📋 Manage Users
          </button>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            📚 Manage Courses
          </button>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            💼 Manage Jobs
          </button>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 30,
        padding: 20,
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: 8
      }}>
        <p style={{margin: 0, color: '#166534'}}>
          ✅ <strong>Admin Account Active:</strong> {adminUser?.email}
        </p>
      </div>
>>>>>>> 9ca6212b0f3cb517223236cdbdca1eddd13c50f3
    </div>
  )
}

/**
 * Main Admin Component with Routing
 */
const Admin = () => {
  const { user, isAuthenticated } = useAuth()

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<div style={{padding: '2rem'}}>User Management (Coming Soon)</div>} />
      <Route path="jobs" element={<div style={{padding: '2rem'}}>Job Management (Coming Soon)</div>} />
      <Route path="courses" element={<div style={{padding: '2rem'}}>Course Management (Coming Soon)</div>} />
      <Route path="forum" element={<div style={{padding: '2rem'}}>Forum Moderation (Coming Soon)</div>} />
      <Route path="content" element={<div style={{padding: '2rem'}}>Content Management (Coming Soon)</div>} />
      <Route path="settings" element={<div style={{padding: '2rem'}}>Settings (Coming Soon)</div>} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

export default Admin
