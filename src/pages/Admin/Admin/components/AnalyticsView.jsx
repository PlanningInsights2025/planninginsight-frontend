import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import * as adminService from '../../../../services/api/admin'

const AnalyticsView = () => {
  const [analytics, setAnalytics] = useState(null)
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAnalytics(period)
      setAnalytics(response.data.analytics)
    } catch (error) {
      toast.error('Failed to load analytics')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">📈 Analytics Dashboard</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`neu-btn ${period === '24h' ? 'neu-btn-primary' : ''}`}
              onClick={() => setPeriod('24h')}
            >
              24h
            </button>
            <button
              className={`neu-btn ${period === '7d' ? 'neu-btn-primary' : ''}`}
              onClick={() => setPeriod('7d')}
            >
              7d
            </button>
            <button
              className={`neu-btn ${period === '30d' ? 'neu-btn-primary' : ''}`}
              onClick={() => setPeriod('30d')}
            >
              30d
            </button>
            <button
              className={`neu-btn ${period === '90d' ? 'neu-btn-primary' : ''}`}
              onClick={() => setPeriod('90d')}
            >
              90d
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* User Growth Chart */}
            {analytics?.userGrowth && analytics.userGrowth.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  👥 User Growth
                </h3>
                <div className="neu-card-pressed" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analytics.userGrowth.map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '100px', fontSize: '13px', color: 'var(--neu-text-muted)' }}>
                          {item._id}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              height: '24px',
                              background: 'linear-gradient(90deg, var(--neu-primary), var(--neu-secondary))',
                              borderRadius: '12px',
                              width: `${(item.count / Math.max(...analytics.userGrowth.map(i => i.count))) * 100}%`,
                              minWidth: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              padding: '0 8px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {item.count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Job Applications Chart */}
            {analytics?.jobApplications && analytics.jobApplications.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  💼 Job Applications
                </h3>
                <div className="neu-card-pressed" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analytics.jobApplications.map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '100px', fontSize: '13px', color: 'var(--neu-text-muted)' }}>
                          {item._id}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              height: '24px',
                              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                              borderRadius: '12px',
                              width: `${(item.count / Math.max(...analytics.jobApplications.map(i => i.count))) * 100}%`,
                              minWidth: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              padding: '0 8px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {item.count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Popular Categories */}
            {analytics?.popularCategories && analytics.popularCategories.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  📊 Popular Job Categories
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {analytics.popularCategories.map((cat, index) => (
                    <div key={index} className="neu-card" style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--neu-primary)' }}>
                        {cat.count}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--neu-text-muted)', marginTop: '8px' }}>
                        {cat._id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Data Message */}
            {(!analytics?.userGrowth || analytics.userGrowth.length === 0) &&
             (!analytics?.jobApplications || analytics.jobApplications.length === 0) &&
             (!analytics?.popularCategories || analytics.popularCategories.length === 0) && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--neu-text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>No analytics data available</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Data will appear once there's activity on the platform
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AnalyticsView
