import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Briefcase, Search, Filter, Star, Eye, Trash2, Building2, MapPin, TrendingUp } from 'lucide-react'
import * as adminService from '../../../../services/api/admin'

const JobPortalManagement = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadJobs()
  }, [currentPage, filterStatus, searchTerm])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllJobsAdmin({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: filterStatus
      })
      setJobs(response.data.jobs)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load jobs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (jobId, status) => {
    try {
      await adminService.updateJobStatus(jobId, status)
      toast.success('Job status updated')
      loadJobs()
    } catch (error) {
      toast.error('Failed to update job status')
    }
  }

  const handleToggleFeatured = async (jobId) => {
    try {
      await adminService.toggleJobFeatured(jobId)
      toast.success('Featured status toggled')
      loadJobs()
    } catch (error) {
      toast.error('Failed to toggle featured status')
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await adminService.deleteJob(jobId)
      toast.success('Job deleted successfully')
      loadJobs()
    } catch (error) {
      toast.error('Failed to delete job')
    }
  }

  const getStats = () => {
    return {
      total: jobs.length,
      active: jobs.filter(j => j.status === 'active').length,
      featured: jobs.filter(j => j.isFeatured).length,
      applications: jobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0)
    }
  }

  const stats = getStats()

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white',
        boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
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
            <Briefcase size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Job Portal Management
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Manage job postings and applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Jobs</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Active</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.active}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Featured</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.featured}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Applications</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.applications}</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>

        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} style={{ color: '#64748b' }} />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="on-hold">On Hold</option>
            <option value="filled">Filled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading jobs...</p>
        </div>
      ) : (
        <>
          {/* Job Cards Grid */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {jobs.map(job => (
              <div
                key={job._id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                {/* Featured Badge */}
                {job.isFeatured && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={14} />
                    Featured
                  </div>
                )}

                {/* Company */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Building2 size={20} style={{ color: '#64748b' }} />
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#334155' }}>
                    {job.company}
                  </span>
                </div>

                {/* Job Title */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 12px 0',
                  lineHeight: '1.4'
                }}>
                  {job.title}
                </h3>

                {/* Location & Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                    <MapPin size={16} />
                    {job.location?.city || 'Remote'}
                  </div>
                  <div style={{
                    background: '#f1f5f9',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#475569',
                    fontWeight: '500'
                  }}>
                    {job.type}
                  </div>
                </div>

                {/* Applications Count */}
                <div style={{
                  background: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp size={18} style={{ color: '#0ea5e9' }} />
                  <span style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600' }}>
                    {job.applicantsCount || 0} Applications
                  </span>
                </div>

                {/* Status Dropdown */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                    Status
                  </label>
                  <select
                    value={job.status}
                    onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      fontWeight: '500',
                      color: job.status === 'open' ? '#059669' : 
                             job.status === 'filled' ? '#3b82f6' : 
                             job.status === 'closed' ? '#ef4444' : '#f59e0b'
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="filled">Filled</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleToggleFeatured(job._id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: job.isFeatured ? '1px solid #fbbf24' : '1px solid #e2e8f0',
                      background: job.isFeatured ? '#fffbeb' : 'white',
                      color: job.isFeatured ? '#f59e0b' : '#64748b',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = job.isFeatured ? '#fef3c7' : '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = job.isFeatured ? '#fffbeb' : 'white'
                    }}
                  >
                    <Star size={16} fill={job.isFeatured ? '#f59e0b' : 'none'} />
                    {job.isFeatured ? 'Featured' : 'Feature'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: '1px solid #fee2e2',
                      background: 'white',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {jobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Briefcase size={64} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '600' }}>No jobs found</p>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === 1 ? '#f8fafc' : 'white',
                  color: currentPage === 1 ? '#cbd5e1' : '#0f172a',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        border: currentPage === pageNum ? 'none' : '1px solid #e2e8f0',
                        background: currentPage === pageNum 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                          : 'white',
                        color: currentPage === pageNum ? 'white' : '#0f172a',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.background = '#f8fafc'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.background = 'white'
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: currentPage === totalPages ? '#f8fafc' : 'white',
                  color: currentPage === totalPages ? '#cbd5e1' : '#0f172a',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default JobPortalManagement
