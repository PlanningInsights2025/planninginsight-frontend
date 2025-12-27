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
