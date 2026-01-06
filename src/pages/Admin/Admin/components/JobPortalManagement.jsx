import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
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

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">💼 Job Portal Management</h2>
        </div>

        <div className="search-bar">
          <input
            type="text"
            className="neu-input"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{ width: '180px' }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="on-hold">On Hold</option>
            <option value="filled">Filled</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="neu-table-wrapper">
            <table className="neu-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neu-text-muted)' }}>
                        {job.type} • {job.location?.city || 'Remote'}
                      </div>
                    </td>
                    <td>{job.company}</td>
                    <td>{job.applicantsCount || 0}</td>
                    <td>
                      <select
                        className={`neu-badge ${
                          job.status === 'open' ? 'success' :
                          job.status === 'filled' ? 'primary' : 'warning'
                        }`}
                        value={job.status}
                        onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="filled">Filled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={`neu-btn ${job.featured ? 'neu-btn-success' : ''}`}
                        onClick={() => handleToggleFeatured(job._id)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {job.featured ? '⭐ Featured' : '☆ Feature'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="neu-btn-danger action-btn"
                          onClick={() => handleDeleteJob(job._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="neu-btn pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ◀
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i}
                className={`neu-btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="neu-btn pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobPortalManagement
