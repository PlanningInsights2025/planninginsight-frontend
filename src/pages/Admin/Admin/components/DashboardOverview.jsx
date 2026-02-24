import React, { useState, useEffect } from 'react'
import { useAdminAnalyticsOverview } from '../../../../hooks/useAdminAnalytics'

const GABarChart = ({ trends = [], loading = false }) => {
  const [tooltip, setTooltip] = useState(null)

  const W = 560, H = 190, PAD_T = 8, PAD_B = 30
  const chartH = H - PAD_T - PAD_B
  const data = trends.slice(-14)
  const n = data.length

  const SERIES = [
    { key: 'activeUsers', color: '#a78bfa', label: 'Users' },
    { key: 'sessions', color: '#22d3ee', label: 'Sessions' },
    { key: 'screenPageViews', color: '#2dd4bf', label: 'Page Views' }
  ]

  const maxVal = Math.max(1, ...data.flatMap(d => SERIES.map(s => d[s.key] || 0)))

  const fmtDate = (s) => {
    if (!s) return ''
    const str = String(s)
    return `${str.slice(4, 6)}/${str.slice(6)}`
  }

  if (loading) {
    return (
      <div className="ga-chart-loading">
        <div className="ga-chart-skeleton">
          {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
            <div key={i} className="skeleton-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="ga-chart-loading-text">Fetching live analytics…</p>
      </div>
    )
  }

  if (!n) {
    return (
      <div className="ga-chart-loading">
        <p className="ga-chart-loading-text">No data available for this period</p>
      </div>
    )
  }

  const slotW = W / n
  const GPAD = Math.max(4, slotW * 0.12)
  const innerW = slotW - GPAD * 2
  const barGap = 3
  const barW = Math.max(4, (innerW - barGap * 2) / 3)

  return (
    <div className="ga-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 210, display: 'block' }}
        onMouseLeave={() => setTooltip(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const y = PAD_T + chartH * (1 - f)
          return <line key={f} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        })}

        {data.map((day, gi) => {
          const gx = gi * slotW + GPAD
          return SERIES.map((s, si) => {
            const val = day[s.key] || 0
            const bH = Math.max(3, (val / maxVal) * chartH)
            const bX = gx + si * (barW + barGap)
            const bY = PAD_T + chartH - bH
            const hovered = tooltip?.gi === gi && tooltip?.si === si
            return (
              <rect
                key={`${gi}-${si}`}
                x={bX} y={bY} width={barW} height={bH} rx={3}
                fill={s.color} fillOpacity={hovered ? 1 : 0.72}
                onMouseEnter={() => setTooltip({ gi, si, val, label: s.label, date: fmtDate(day.date), x: gi * slotW + slotW / 2, y: bY })}
                style={{ cursor: 'default', transition: 'fill-opacity 0.15s' }}
              />
            )
          })
        })}

        {data.map((day, gi) => {
          if (n > 10 && gi % 2 !== 0) return null
          return (
            <text
              key={gi}
              x={gi * slotW + slotW / 2}
              y={H - 8}
              textAnchor="middle"
              fill="rgba(148,163,184,0.65)"
              fontSize={8.5}
            >
              {fmtDate(day.date)}
            </text>
          )
        })}

        {tooltip && (() => {
          const tx = Math.min(W - 58, Math.max(58, tooltip.x))
          const ty = Math.max(PAD_T + 2, tooltip.y - 42)
          return (
            <>
              <rect x={tx - 57} y={ty} width={114} height={32} rx={7}
                fill="rgba(10,15,36,0.97)" stroke="rgba(255,255,255,0.13)" strokeWidth={1}
              />
              <text x={tx} y={ty + 13} textAnchor="middle" fill="#f1f5f9" fontSize={10} fontWeight="700">
                {tooltip.label}: {Number(tooltip.val).toLocaleString()}
              </text>
              <text x={tx} y={ty + 26} textAnchor="middle" fill="#94a3b8" fontSize={9}>
                {tooltip.date}
              </text>
            </>
          )
        })()}
      </svg>
    </div>
  )
}

const DashboardOverview = ({ stats, onNavigate }) => {
  const { overview = {}, jobs = {}, learning = {}, newsroom = {}, forum = {}, publishing = {}, networking = {} } = stats || {}

  const [period, setPeriod] = useState('7d')
  const { data: gaOverview, loading: gaLoading, refresh: refreshGA } = useAdminAnalyticsOverview({ period })

  useEffect(() => {
    const id = setInterval(refreshGA, 60000)
    return () => clearInterval(id)
  }, [refreshGA])

  const gaTrends = gaOverview?.trends ?? []
  const gaTotals = gaOverview?.totals ?? {}

  const iconProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  const icons = {
    users: (
      <svg {...iconProps}>
        <circle cx="9" cy="9" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3 21c0-3.5 3.5-5.5 6-5.5s6 2 6 5.5" />
        <path d="M14 21c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" />
      </svg>
    ),
    courses: (
      <svg {...iconProps}>
        <path d="M4 7l8-3 8 3-8 3-8-3z" />
        <path d="M4 7v9l8 3 8-3V7" />
        <path d="M12 10v9" />
      </svg>
    ),
    role: (
      <svg {...iconProps}>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    ),
    jobs: (
      <svg {...iconProps}>
        <path d="M4 9h16l-1 11H5L4 9z" />
        <path d="M9 9V6h6v3" />
      </svg>
    ),
    plus: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    approve: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    target: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
      </svg>
    ),
    briefcase: (
      <svg {...iconProps}>
        <path d="M4 8h16v11H4z" />
        <path d="M9 8V6h6v2" />
      </svg>
    ),
    shieldCheck: (
      <svg {...iconProps}>
        <path d="M12 22s-7-3.5-7-10V6l7-3 7 3v6c0 6.5-7 10-7 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    analytics: (
      <svg {...iconProps}>
        <path d="M4 20V8" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M20 20v-4" />
      </svg>
    ),
    activity: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
    spark: (
      <svg {...iconProps}>
        <path d="M12 2v5" />
        <path d="M12 17v5" />
        <path d="M4.93 4.93l3.54 3.54" />
        <path d="M15.53 15.53l3.54 3.54" />
        <path d="M2 12h5" />
        <path d="M17 12h5" />
      </svg>
    ),
    news: (
      <svg {...iconProps}>
        <path d="M4 6h14v12H4z" />
        <path d="M8 9h6" />
        <path d="M8 13h6" />
        <path d="M4 18h16v2H4z" />
      </svg>
    ),
    forum: (
      <svg {...iconProps}>
        <path d="M4 6h12v7H9l-3 3z" />
        <path d="M16 10h4v8h-3l-1 1" />
      </svg>
    ),
    book: (
      <svg {...iconProps}>
        <path d="M5 4h7v16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M19 4h-7v16h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      </svg>
    ),
    network: (
      <svg {...iconProps}>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M7.5 7.5 11 16" />
        <path d="M16.5 7.5 13 16" />
      </svg>
    ),
    bolt: (
      <svg {...iconProps}>
        <path d="M11 2 5 14h6v8l6-12h-6z" />
      </svg>
    )
  }

  const overviewStats = [
    {
      title: 'Total Users',
      value: overview?.totalUsers?.count ?? 0,
      trend: overview?.totalUsers?.growth ?? '+0%',
      icon: icons.users,
      accent: 'var(--accent-purple)'
    },
    {
      title: 'Active Courses',
      value: learning?.activeCourses ?? 0,
      trend: learning?.trend ?? '+0%',
      icon: icons.courses,
      accent: 'var(--accent-cyan)'
    },
    {
      title: 'Role Requests',
      value: overview?.roleRequests?.count ?? 0,
      trend: overview?.roleRequests?.growth ?? '+0%',
      icon: icons.role,
      accent: 'var(--accent-blue)'
    },
    {
      title: 'Job Listings',
      value: jobs?.active ?? 0,
      trend: jobs?.trend ?? '+0%',
      icon: icons.jobs,
      accent: 'var(--accent-teal)'
    }
  ]

  const quickActions = [
    { label: 'Add User', desc: 'Register a new platform member', icon: icons.plus, target: 'users' },
    { label: 'Approve Requests', desc: 'Process pending role upgrades', icon: icons.approve, target: 'role-requests' },
    { label: 'Create Course', desc: 'Publish a new learning module', icon: icons.target, target: 'learning' },
    { label: 'Post Job', desc: 'List a new job opportunity', icon: icons.briefcase, target: 'jobs' },
    { label: 'Review Content', desc: 'Moderate forum & reported posts', icon: icons.shieldCheck, target: 'forum' },
    { label: 'View Analytics', desc: 'Explore traffic & engagement', icon: icons.analytics, target: 'analytics' }
  ]

  const activityFeed = [
    { icon: icons.bolt, text: 'New user onboarding optimized', time: '2m ago' },
    { icon: icons.news, text: 'Course “AI Essentials” published', time: '45m ago' },
    { icon: icons.approve, text: '12 role upgrades approved', time: '1h ago' },
    { icon: icons.briefcase, text: 'Frontend Developer posting created', time: '3h ago' },
    { icon: icons.shieldCheck, text: 'Forum moderation queue cleared', time: '5h ago' }
  ]

  const modules = [
    {
      id: 'jobs',
      title: 'Job Portal',
      icon: icons.briefcase,
      description: 'Monitor postings & approvals',
      stats: [
        { label: 'Total Jobs', value: jobs?.total ?? 0 },
        { label: 'Active', value: jobs?.active ?? 0 },
        { label: 'Pending', value: jobs?.pending ?? 0 }
      ]
    },
    {
      id: 'learning',
      title: 'Learning Center',
      icon: icons.courses,
      description: 'Courses & enrollments',
      stats: [
        { label: 'Courses', value: learning?.totalCourses ?? 0 },
        { label: 'Active', value: learning?.activeCourses ?? 0 },
        { label: 'Enrollments', value: learning?.totalEnrollments ?? 0 }
      ]
    },
    {
      id: 'newsroom',
      title: 'Newsroom',
      icon: icons.news,
      description: 'Editorial planning',
      stats: [
        { label: 'Articles', value: newsroom?.totalArticles ?? 0 },
        { label: 'Published', value: newsroom?.published ?? 0 },
        { label: 'Drafts', value: newsroom?.drafts ?? 0 }
      ]
    },
    {
      id: 'forum',
      title: 'Discussion Forum',
      icon: icons.forum,
      description: 'Threads & reports',
      stats: [
        { label: 'Threads', value: forum?.totalThreads ?? 0 },
        { label: 'Active', value: forum?.activeThreads ?? 0 },
        { label: 'Flagged', value: forum?.flaggedContent ?? 0 }
      ]
    },
    {
      id: 'publishing',
      title: 'Publishing',
      icon: icons.book,
      description: 'Manuscripts in review',
      stats: [
        { label: 'Manuscripts', value: publishing?.totalManuscripts ?? 0 },
        { label: 'Under Review', value: publishing?.underReview ?? 0 },
        { label: 'Published', value: publishing?.published ?? 0 }
      ]
    },
    {
      id: 'networking',
      title: 'Networking',
      icon: icons.network,
      description: 'Groups & connections',
      stats: [
        { label: 'Connections', value: networking?.totalConnections ?? 0 },
        { label: 'Groups', value: networking?.totalGroups ?? 0 },
        { label: 'Active Groups', value: networking?.activeGroups ?? 0 }
      ]
    }
  ]

  const heroMetrics = [
    {
      label: 'Active Workflows',
      value: overview?.activeWorkflows ?? overview?.roleRequests?.count ?? 12
    },
    {
      label: 'Pending Reviews',
      value: publishing?.underReview ?? overview?.pendingReviews ?? 6
    },
    {
      label: 'Live Campaigns',
      value: newsroom?.published ?? jobs?.active ?? 4
    }
  ]

  const sectionIcons = {
    analytics: icons.analytics,
    recent: icons.activity,
    actions: icons.spark
  }

  return (
    <div className="dashboard-analytics">
      <section className="glass-card hero-card hero-card--overview">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Platform Pulse</p>
          <h1 className="hero-title">Welcome back, {overview?.adminName || 'Admin'}</h1>
          <p className="hero-subtitle">Keep approvals moving and surface insights for every team in one streamlined view.</p>
          <div className="hero-metrics">
            {heroMetrics.map(metric => (
              <div key={metric.label}>
                <span className="hero-metric-label">{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-actions">
          <button className="cta-btn" onClick={() => onNavigate('analytics')}>View Insights</button>
          <button className="ghost-btn" onClick={() => onNavigate('users')}>Manage Users</button>
        </div>
      </section>

      <section className="stats-grid premium-grid">
        {overviewStats.map(stat => (
          <article key={stat.title} className="glass-card stat-card">
            <div className="stat-header">
              <div className="stat-icon-circle" style={{ color: stat.accent }}>
                {stat.icon}
              </div>
              <span className={`stat-trend ${stat.trend?.includes('-') ? 'down' : 'up'}`}>{stat.trend}</span>
            </div>
            <div className="stat-body">
              <p className="stat-label">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="analytics-grid">
        <article className="glass-card analytics-panel">
          <header className="panel-header">
            <div className="panel-title">
              <span className="panel-title-icon" aria-hidden="true">{sectionIcons.analytics}</span>
              <div>
                <p className="eyebrow">Analytics</p>
                <h2>User Engagement Overview</h2>
              </div>
            </div>
            <button className="chip-btn" onClick={() => onNavigate('analytics')}>Download Report</button>
          </header>
          <div className="period-pills">
            {['7d', '30d'].map(p => (
              <button
                key={p}
                className={`period-pill${period === p ? ' active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
            {gaOverview?.configured && (
              <span className="ga-live-badge"><span className="ga-live-dot" />Live</span>
            )}
          </div>
          <GABarChart trends={gaTrends} loading={gaLoading} />
          <div className="ga-chart-summary">
            <div>
              <span className="ga-summary-dot" style={{ background: '#a78bfa' }} />
              <span className="ga-summary-label">Users</span>
              <strong>{(gaTotals.users ?? 0).toLocaleString()}</strong>
            </div>
            <div>
              <span className="ga-summary-dot" style={{ background: '#22d3ee' }} />
              <span className="ga-summary-label">Sessions</span>
              <strong>{(gaTotals.sessions ?? 0).toLocaleString()}</strong>
            </div>
            <div>
              <span className="ga-summary-dot" style={{ background: '#2dd4bf' }} />
              <span className="ga-summary-label">Page Views</span>
              <strong>{(gaTotals.pageViews ?? 0).toLocaleString()}</strong>
            </div>
          </div>
        </article>

        <article className="glass-card activity-panel">
          <header className="panel-header">
            <div className="panel-title">
              <span className="panel-title-icon" aria-hidden="true">{sectionIcons.recent}</span>
              <div>
                <p className="eyebrow">Recent</p>
                <h2>Activity Feed</h2>
              </div>
            </div>
          </header>
          <ul className="activity-list">
            {activityFeed.map(item => (
              <li key={item.text}>
                <div className="activity-icon" aria-hidden="true">{item.icon}</div>
                <div>
                  <p>{item.text}</p>
                  <span>{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="glass-card quick-actions">
        <header className="panel-header">
          <div className="panel-title">
            <span className="panel-title-icon" aria-hidden="true">{sectionIcons.actions}</span>
            <div>
              <p className="eyebrow">Actions</p>
              <h2>Quick Shortcuts</h2>
            </div>
          </div>
        </header>
        <div className="quick-actions-row">
          {quickActions.map(action => (
            <button key={action.label} className="action-pill" onClick={() => onNavigate(action.target)}>
              <span className="pill-icon" aria-hidden="true">{action.icon}</span>
              <div className="pill-body">
                <span className="pill-label">{action.label}</span>
                <span className="pill-desc">{action.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="modules-grid premium-modules">
        {modules.map(module => (
          <article key={module.id} className="glass-card module-card" onClick={() => onNavigate(module.id)}>
            <header>
              <div className="module-icon" aria-hidden="true">{module.icon}</div>
              <div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
            </header>
            <ul>
              {module.stats.map(stat => (
                <li key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}

export default DashboardOverview
