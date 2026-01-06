import React from 'react'

const DashboardOverview = ({ stats, onNavigate }) => {
  if (!stats) {
    return (
      <div className="neu-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  const { overview, jobs, learning, newsroom, forum, publishing, networking } = stats

  const overviewStats = [
    { 
      title: 'Total Users', 
      value: overview?.totalUsers?.count || 0, 
      growth: overview?.totalUsers?.growth || '0%',
      icon: '👥',
      color: '#524393'
    },
    { 
      title: 'Active Users', 
      value: overview?.activeUsers?.count || 0, 
      growth: overview?.activeUsers?.growth || '0%',
      icon: '✅',
      color: '#4CAF50'
    },
    { 
      title: 'New Today', 
      value: overview?.newUsersToday?.count || 0, 
      growth: overview?.newUsersToday?.growth || '0%',
      icon: '🆕',
      color: '#2196F3'
    },
    { 
      title: 'Revenue', 
      value: overview?.revenue?.count || '₹0', 
      growth: overview?.revenue?.growth || '0%',
      icon: '💰',
      color: '#FF9800'
    }
  ]

  const modules = [
    {
      id: 'jobs',
      title: 'Job Portal',
      icon: '💼',
      stats: [
        { label: 'Total Jobs', value: jobs?.total || 0 },
        { label: 'Active', value: jobs?.active || 0 },
        { label: 'Pending', value: jobs?.pending || 0 }
      ]
    },
    {
      id: 'learning',
      title: 'Learning Center',
      icon: '🎓',
      stats: [
        { label: 'Total Courses', value: learning?.totalCourses || 0 },
        { label: 'Active Courses', value: learning?.activeCourses || 0 },
        { label: 'Enrollments', value: learning?.totalEnrollments || 0 }
      ]
    },
    {
      id: 'newsroom',
      title: 'Newsroom',
      icon: '📰',
      stats: [
        { label: 'Total Articles', value: newsroom?.totalArticles || 0 },
        { label: 'Published', value: newsroom?.published || 0 },
        { label: 'Drafts', value: newsroom?.drafts || 0 }
      ]
    },
    {
      id: 'forum',
      title: 'Forum',
      icon: '💬',
      stats: [
        { label: 'Total Threads', value: forum?.totalThreads || 0 },
        { label: 'Active', value: forum?.activeThreads || 0 },
        { label: 'Flagged', value: forum?.flaggedContent || 0 }
      ]
    },
    {
      id: 'publishing',
      title: 'Publishing House',
      icon: '📚',
      stats: [
        { label: 'Total Manuscripts', value: publishing?.totalManuscripts || 0 },
        { label: 'Under Review', value: publishing?.underReview || 0 },
        { label: 'Published', value: publishing?.published || 0 }
      ]
    },
    {
      id: 'networking',
      title: 'Networking Arena',
      icon: '🤝',
      stats: [
        { label: 'Connections', value: networking?.totalConnections || 0 },
        { label: 'Pending', value: networking?.pendingRequests || 0 },
        { label: 'Groups', value: networking?.totalGroups || 0 }
      ]
    }
  ]

  return (
    <div>
      {/* Overview Stats */}
      <div className="stats-grid">
        {overviewStats.map((stat, index) => (
          <div key={index} className="neu-card stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className={`stat-growth ${stat.growth.includes('+') ? 'positive' : 'negative'}`}>
                {stat.growth}
              </div>
            </div>
            <h3 className="stat-title">{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Modules Overview */}
      <div className="neu-card" style={{ marginTop: '30px' }}>
        <div className="section-header">
          <h2 className="section-title">📦 Modules Overview</h2>
        </div>
        <div className="modules-grid">
          {modules.map(module => (
            <div 
              key={module.id} 
              className="neu-card module-card"
              onClick={() => onNavigate(module.id)}
            >
              <div className="module-icon">{module.icon}</div>
              <h3 className="module-title">{module.title}</h3>
              <div style={{ marginTop: '16px' }}>
                {module.stats.map((stat, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: idx < module.stats.length - 1 ? '1px solid var(--neu-shadow-dark)' : 'none'
                  }}>
                    <span style={{ fontSize: '13px', color: 'var(--neu-text-muted)' }}>
                      {stat.label}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--neu-primary)' }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="neu-card" style={{ marginTop: '30px' }}>
        <div className="section-header">
          <h2 className="section-title">⚡ Quick Actions</h2>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px',
          marginTop: '20px'
        }}>
          <button className="neu-btn-primary neu-btn" onClick={() => onNavigate('users')}>
            👥 Manage Users
          </button>
          <button className="neu-btn-primary neu-btn" onClick={() => onNavigate('jobs')}>
            💼 Review Jobs
          </button>
          <button className="neu-btn-primary neu-btn" onClick={() => onNavigate('forum')}>
            🚩 Check Flagged Content
          </button>
          <button className="neu-btn-primary neu-btn" onClick={() => onNavigate('analytics')}>
            📊 View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
