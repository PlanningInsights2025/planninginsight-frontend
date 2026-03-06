import React, { useEffect, useMemo, useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { TrendingUp, Activity, Users, Eye, MousePointerClick, Clock3, ArrowUpRight, Zap } from 'lucide-react'
import { useAdminAnalyticsOverview, useRealtimeAnalytics } from '../../../../hooks/useAdminAnalytics'

/* ─────────────────────────────────────────────
   UserTrendChart — Premium SVG Area Chart
   ───────────────────────────────────────────── */
const CHART_W = 560
const CHART_H = 160
const PAD_L = 8
const PAD_R = 8
const PAD_T = 18
const PAD_B = 0

function buildPath(points, close = false) {
  if (!points.length) return ''
  const [first, ...rest] = points
  let d = `M ${first[0]} ${first[1]}`
  rest.forEach(([x, y]) => { d += ` L ${x} ${y}` })
  if (close) d += ` L ${points[points.length - 1][0]} ${CHART_H + PAD_T} L ${points[0][0]} ${CHART_H + PAD_T} Z`
  return d
}

const UserTrendChart = ({ trends, trendMax, formatNumber, formatTrendDate, period }) => {
  const [hovered, setHovered] = useState(null)
  const svgRef = useRef(null)

  const safeMax = trendMax < 1 ? 1 : trendMax

  /* compute (x, y) for each data point inside the SVG viewport */
  const points = useMemo(() => {
    const n = trends.length
    return trends.map((item, i) => {
      const x = PAD_L + (i / Math.max(n - 1, 1)) * (CHART_W - PAD_L - PAD_R)
      const ratio = Math.min((item.activeUsers || 0) / safeMax, 1)
      const y = PAD_T + (1 - ratio) * CHART_H
      return { x, y, item, index: i }
    })
  }, [trends, safeMax])

  const linePath = buildPath(points.map(p => [p.x, p.y]))
  const areaPath = buildPath(points.map(p => [p.x, p.y]), true)

  /* y-axis grid lines (4 levels) */
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    y: PAD_T + (1 - ratio) * CHART_H,
    label: Math.round(ratio * safeMax)
  }))

  /* peak point */
  const peakIndex = useMemo(() =>
    trends.reduce((pi, item, i) => (item.activeUsers || 0) > (trends[pi].activeUsers || 0) ? i : pi, 0),
    [trends]
  )

  /* total for mini stat */
  const totalUsers = trends.reduce((s, t) => s + (t.activeUsers || 0), 0)

  const gradId = 'trendFill'
  const strokeId = 'trendStroke'
  const glowId = 'trendGlow'

  return (
    <div style={{ marginTop: '30px' }}>
      <style>{`
        .trend-tooltip {
          pointer-events: none;
          position: absolute;
          background: rgba(13, 17, 35, 0.97);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 10px;
          padding: 9px 13px;
          font-size: 12px;
          color: #cbd5e1;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.35);
          transform: translate(-50%, -110%) translateY(-8px);
          z-index: 20;
          transition: opacity 0.12s;
        }
        .trend-tooltip-date {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 5px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .trend-tooltip-row {
          display: flex;
          align-items: center;
          gap: 7px;
          line-height: 1.6;
        }
        .trend-tooltip-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .trend-dot {
          cursor: pointer;
        }
        @keyframes trendFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .trend-card-in { animation: trendFadeIn 0.4s ease both; }
      `}</style>

      <div
        className="trend-card-in"
        style={{
          borderRadius: '20px',
          padding: '24px 24px 20px',
          background: 'linear-gradient(160deg, #111827 0%, #0d1220 50%, #0a0f1c 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >

        {/* ── Header Row ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '9px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingUp size={16} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                Website User Trend
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#4b5563' }}>
                Daily active users · {period} window
              </p>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              padding: '5px 12px', borderRadius: '8px',
              background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.18)',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              <Zap size={11} color="#6366f1" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#818cf8' }}>
                Peak {formatNumber(safeMax)}
              </span>
            </div>
            <div style={{
              padding: '5px 12px', borderRadius: '8px',
              background: 'rgba(148,163,184,0.07)', border: '1px solid rgba(148,163,184,0.14)',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              <ArrowUpRight size={11} color="#64748b" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>
                {formatNumber(totalUsers)} total
              </span>
            </div>
          </div>
        </div>

        {/* ── SVG Chart ── */}
        <div style={{ position: 'relative', width: '100%', height: 210, overflowX: 'auto' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CHART_W} ${CHART_H + PAD_T + 32}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', minWidth: '300px', display: 'block' }}
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={strokeId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <filter id={glowId} x="-30%" y="-80%" width="160%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {gridLines.map((g, i) => (
              <g key={i}>
                <line
                  x1={PAD_L + 28} y1={g.y} x2={CHART_W - PAD_R} y2={g.y}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                />
                <text x={PAD_L} y={g.y + 4} fill="rgba(100,116,139,0.55)" fontSize="9" textAnchor="start"
                  style={{ fontFamily: 'system-ui,sans-serif', fontWeight: 500 }}>
                  {g.label > 0 ? g.label : ''}
                </text>
              </g>
            ))}

            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradId})`} />

            {/* Stroke line */}
            <path d={linePath} fill="none" stroke={`url(#${strokeId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots + X-axis labels */}
            {points.map((p) => {
              const isPeak = p.index === peakIndex
              const isHovered = hovered === p.index
              return (
                <g key={p.index}>
                  {/* X-axis date label */}
                  <text
                    x={p.x} y={CHART_H + PAD_T + 18}
                    fill={isHovered ? '#94a3b8' : 'rgba(100,116,139,0.5)'}
                    fontSize="8.5" textAnchor="middle"
                    style={{ fontFamily: 'system-ui,sans-serif', fontWeight: isHovered ? 600 : 400 }}
                  >
                    {formatTrendDate(p.item.date)}
                  </text>

                  {/* Vertical tick on hover */}
                  {isHovered && (
                    <line
                      x1={p.x} y1={PAD_T} x2={p.x} y2={CHART_H + PAD_T}
                      stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3 5"
                    />
                  )}

                  {/* Peak outer ring only */}
                  {isPeak && (
                    <circle cx={p.x} cy={p.y} r="8"
                      fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
                  )}

                  {/* Main dot — only show on peak or hover, rest are tiny */}
                  <circle
                    className="trend-dot"
                    cx={p.x} cy={p.y}
                    r={isPeak ? 5 : isHovered ? 4 : 2.5}
                    fill={isPeak ? '#6366f1' : isHovered ? '#818cf8' : '#334155'}
                    stroke={isPeak || isHovered ? '#c7d2fe' : 'transparent'}
                    strokeWidth="1.5"
                    filter={isPeak ? `url(#${glowId})` : undefined}
                    onMouseEnter={() => setHovered(p.index)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          {hovered !== null && points[hovered] && (() => {
            const p = points[hovered]
            const xPct = ((p.x - PAD_L) / (CHART_W - PAD_L - PAD_R)) * 100
            const yPct = (p.y / (CHART_H + PAD_T + 32)) * 100
            return (
              <div
                className="trend-tooltip"
                style={{ left: `${Math.min(Math.max(xPct, 8), 92)}%`, top: `${Math.max(yPct - 4, 0)}%` }}
              >
                <div className="trend-tooltip-date">{formatTrendDate(p.item.date)}</div>
                <div className="trend-tooltip-row">
                  <span className="trend-tooltip-dot" style={{ background: '#6366f1' }} />
                  <span>{formatNumber(p.item.activeUsers || 0)} users</span>
                </div>
                {p.item.sessions != null && (
                  <div className="trend-tooltip-row">
                    <span className="trend-tooltip-dot" style={{ background: '#475569' }} />
                    <span>{formatNumber(p.item.sessions)} sessions</span>
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* ── Bottom stat row ── */}
        <div style={{
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)'
        }}>
          {[
            { label: 'Avg / Day', value: formatNumber(Math.round(totalUsers / Math.max(trends.length, 1))) },
            { label: 'Peak Day', value: formatTrendDate(trends[peakIndex]?.date) },
            { label: 'Data Points', value: trends.length }
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                display: 'flex', flexDirection: 'column', gap: 3,
                padding: '0 16px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                ...(i === 0 ? { paddingLeft: 0 } : {})
              }}
            >
              <span style={{ fontSize: '10px', color: '#4b5563', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '-0.01em' }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AnalyticsView = () => {
  const [period, setPeriod] = useState('7d')
  const [stream] = useState('public')

  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError
  } = useAdminAnalyticsOverview({ period, stream })

  const {
    data: realtime,
    loading: realtimeLoading,
    error: realtimeError,
    lastUpdated
  } = useRealtimeAnalytics({ stream, refreshIntervalMs: 30000 })

  useEffect(() => {
    // Only fire toast for genuine unexpected errors, not "GA not configured" state
    if (overviewError || realtimeError) {
      const err = overviewError || realtimeError;
      const isAuthError = err?.response?.status === 401 || err?.response?.status === 403;
      if (isAuthError) {
        toast.error('Analytics: insufficient permissions');
      } else {
        toast.error('Failed to load website analytics');
      }
      console.error(err);
    }
  }, [overviewError, realtimeError])

  const loading = (overviewLoading && !overview) || (realtimeLoading && !realtime)

  const formatNumber = (value) => Number(value || 0).toLocaleString()

  const formatTrendDate = (value) => {
    if (!value) return '--'
    const raw = String(value)

    if (raw.length === 8) {
      const year = Number(raw.slice(0, 4))
      const month = Number(raw.slice(4, 6)) - 1
      const day = Number(raw.slice(6, 8))
      const parsed = new Date(year, month, day)

      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      }
    }

    const parsed = new Date(raw)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    }

    return raw
  }

  const trendMax = useMemo(() => {
    const values = (overview?.trends || []).map(item => item.activeUsers || 0)
    return values.length ? Math.max(...values) : 1
  }, [overview?.trends])

  const summaryCards = [
    {
      title: 'Active Users (Realtime)',
      value: formatNumber(realtime?.activeUsers),
      icon: <Activity size={18} />
    },
    {
      title: 'Users',
      value: formatNumber(overview?.totals?.users),
      icon: <Users size={18} />
    },
    {
      title: 'Sessions',
      value: formatNumber(overview?.totals?.sessions),
      icon: <Clock3 size={18} />
    },
    {
      title: 'Page Views',
      value: formatNumber(overview?.totals?.pageViews || realtime?.pageViews),
      icon: <Eye size={18} />
    },
    {
      title: 'Events',
      value: formatNumber(overview?.totals?.eventCount || realtime?.eventCount),
      icon: <MousePointerClick size={18} />
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        color: '#ffffff',
        boxShadow: '0 10px 40px rgba(79, 70, 229, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '-0.01em' }}>
                Analytics Dashboard
              </h2>
              <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.82)', fontWeight: '500' }}>
                Platform insights and statistics
              </p>
            </div>
          </div>
          
          {/* Period Selector */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '4px' }}>
            <button
              onClick={() => setPeriod('24h')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: period === '24h' ? 'white' : 'transparent',
                color: period === '24h' ? '#4338ca' : 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              24h
            </button>
            <button
              onClick={() => setPeriod('7d')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: period === '7d' ? 'white' : 'transparent',
                color: period === '7d' ? '#4338ca' : 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              7d
            </button>
            <button
              onClick={() => setPeriod('30d')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: period === '30d' ? 'white' : 'transparent',
                color: period === '30d' ? '#4338ca' : 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              30d
            </button>
            <button
              onClick={() => setPeriod('90d')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: period === '90d' ? 'white' : 'transparent',
                color: period === '90d' ? '#4338ca' : 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              90d
            </button>
          </div>
        </div>
      </div>

      {/* Google Analytics not configured — info banner */}
      {!loading && overview?.configured === false && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#94a3b8'
        }}>
          <span style={{ fontSize: '28px' }}>📡</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#e2e8f0', marginBottom: '4px' }}>
              Google Analytics not connected
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
              Set <code style={{ background: '#1e293b', padding: '1px 6px', borderRadius: '4px', color: '#67e8f9' }}>GA_PROPERTY_ID</code>,{' '}
              <code style={{ background: '#1e293b', padding: '1px 6px', borderRadius: '4px', color: '#67e8f9' }}>GA_SERVICE_ACCOUNT_EMAIL</code> and{' '}
              <code style={{ background: '#1e293b', padding: '1px 6px', borderRadius: '4px', color: '#67e8f9' }}>GA_SERVICE_ACCOUNT_PRIVATE_KEY</code> in your Vercel environment to enable live website analytics.
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {summaryCards.map(card => (
                <div key={card.title} className="neu-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neu-text-muted)' }}>{card.title}</span>
                    <span style={{ color: '#818cf8' }}>{card.icon}</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.02em' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* User Trend — Premium SVG Area Chart */}
            {overview?.trends && overview.trends.length > 0 && (
              <UserTrendChart
                trends={overview.trends}
                trendMax={trendMax}
                formatNumber={formatNumber}
                formatTrendDate={formatTrendDate}
                period={period}
              />
            )}

            {/* Top Pages */}
            {overview?.topPages && overview.topPages.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  🔝 Top Website Pages
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {overview.topPages.map((item, index) => (
                    <div key={`${item.pagePath}-${index}`} className="neu-card" style={{ padding: '16px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--neu-text-muted)', marginBottom: '6px' }}>Page</div>
                      <div style={{ fontWeight: '600', wordBreak: 'break-all' }}>{item.pagePath || '/'}</div>
                      <div style={{ marginTop: '10px', fontSize: '14px' }}>
                        {formatNumber(item.screenPageViews)} views • {formatNumber(item.activeUsers)} users
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traffic Channels */}
            {overview?.channels && overview.channels.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  🌐 Traffic Channels
                </h3>
                <div className="neu-card-pressed" style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {overview.channels.map((item, index) => (
                      <div key={`${item.sessionDefaultChannelGroup}-${index}`} className="neu-card" style={{ padding: '14px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--neu-text-muted)' }}>
                          {item.sessionDefaultChannelGroup || 'Unassigned'}
                        </div>
                        <div style={{ marginTop: '8px', fontWeight: '700' }}>{formatNumber(item.sessions)} sessions</div>
                        <div style={{ fontSize: '13px', color: 'var(--neu-text-muted)' }}>{formatNumber(item.activeUsers)} users</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Data Message */}
            {(!overview?.trends || overview.trends.length === 0) &&
             (!overview?.topPages || overview.topPages.length === 0) &&
             (!overview?.channels || overview.channels.length === 0) && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--neu-text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>No analytics data available</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Data will appear once there's activity on the platform
                </div>
              </div>
            )}

            <div style={{ marginTop: '22px', fontSize: '12px', color: 'var(--neu-text-muted)' }}>
              {lastUpdated ? `Realtime refreshed at ${lastUpdated.toLocaleTimeString()}` : 'Waiting for realtime update...'}
            </div>
          </>
        )}
    </div>
  )
}

export default AnalyticsView
