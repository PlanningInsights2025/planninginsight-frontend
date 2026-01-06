import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { adminAPI } from '../../../../services/api/admin'
import '../Admin.css'

const PublishingManagement = () => {
  const [activeTab, setActiveTab] = useState('requirements') // 'requirements' or 'manuscripts'
  const [requirements, setRequirements] = useState([])
  const [manuscripts, setManuscripts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showRequirementModal, setShowRequirementModal] = useState(false)
  const [showManuscriptModal, setShowManuscriptModal] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [selectedManuscript, setSelectedManuscript] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  })

  const [requirementForm, setRequirementForm] = useState({
    title: '',
    topic: '',
    field: '',
    description: '',
    guidelines: {
      format: '',
      wordLimit: '',
      citationStyle: '',
      other: ''
    },
    submissionDeadline: '',
    status: 'active'
  })

  const [reviewForm, setReviewForm] = useState({
    action: 'accepted',
    remarks: ''
  })

  const [filters, setFilters] = useState({
    status: '',
    field: '',
    requirementId: ''
  })

  useEffect(() => {
    if (activeTab === 'requirements') {
      fetchRequirements()
    } else {
      fetchManuscripts()
    }
  }, [activeTab, filters])

  const fetchRequirements = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllPublishingRequirements(filters)
      setRequirements(response.data.requirements || [])
    } catch (error) {
      toast.error('Failed to fetch requirements')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchManuscripts = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllManuscriptsOverview(filters)
      console.log('📄 Manuscripts response:', response)
      setManuscripts(response.data.manuscripts || [])
      setStats(response.data.stats || stats)
    } catch (error) {
      console.error('❌ Failed to fetch manuscripts:', error)
      console.error('❌ Error details:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to fetch manuscripts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRequirement = async (e) => {
    e.preventDefault()
    try {
      console.log('📝 Creating requirement with data:', requirementForm)
      
      // Ensure proper data format
      const formattedData = {
        ...requirementForm,
        submissionDeadline: requirementForm.submissionDeadline ? new Date(requirementForm.submissionDeadline).toISOString() : null
      }
      
      console.log('📝 Formatted data:', formattedData)
      
      const response = await adminAPI.createPublishingRequirement(formattedData)
      console.log('✅ Create response:', response)
      toast.success('Publishing requirement created successfully')
      setShowRequirementModal(false)
      resetRequirementForm()
      fetchRequirements()
    } catch (error) {
      console.error('❌ Create error:', error)
      console.error('❌ Error response:', error.response)
      console.error('❌ Error message:', error.response?.data?.message)
      toast.error(error.response?.data?.message || error.message || 'Failed to create requirement')
    }
  }

  const handleUpdateRequirement = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.updatePublishingRequirement(selectedRequirement._id, requirementForm)
      toast.success('Publishing requirement updated successfully')
      setShowRequirementModal(false)
      setSelectedRequirement(null)
      resetRequirementForm()
      fetchRequirements()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update requirement')
    }
  }

  const handleDeleteRequirement = async (requirementId) => {
    if (!window.confirm('Are you sure you want to delete this requirement?')) return
    
    try {
      await adminAPI.deletePublishingRequirement(requirementId)
      toast.success('Publishing requirement deleted successfully')
      fetchRequirements()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete requirement')
    }
  }

  const handleReviewManuscript = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.reviewManuscript(
        selectedManuscript._id, 
        {
          status: reviewForm.action,
          reviewComments: reviewForm.remarks
        }
      )
      toast.success(`Manuscript ${reviewForm.action} successfully`)
      setShowManuscriptModal(false)
      setSelectedManuscript(null)
      setReviewForm({ action: 'accepted', remarks: '' })
      fetchManuscripts()
    } catch (error) {
      console.error('Review manuscript error:', error)
      toast.error(error.response?.data?.message || 'Failed to review manuscript')
    }
  }

  const openEditRequirement = (requirement) => {
    setSelectedRequirement(requirement)
    setRequirementForm({
      title: requirement.title,
      topic: requirement.topic,
      field: requirement.field,
      description: requirement.description,
      guidelines: requirement.guidelines || {
        format: '',
        wordLimit: '',
        citationStyle: '',
        other: ''
      },
      submissionDeadline: requirement.submissionDeadline?.split('T')[0] || '',
      status: requirement.status
    })
    setShowRequirementModal(true)
  }

  const openReviewManuscript = (manuscript) => {
    setSelectedManuscript(manuscript)
    setReviewForm({
      action: manuscript.status === 'pending' ? 'accepted' : manuscript.status,
      remarks: manuscript.adminRemarks || ''
    })
    setShowManuscriptModal(true)
  }

  const handleDeleteManuscript = async (manuscriptId) => {
    if (!window.confirm('Are you sure you want to delete this manuscript? This action cannot be undone.')) {
      return
    }

    try {
      console.log('🗑️ Deleting manuscript:', manuscriptId)
      const response = await adminAPI.deleteManuscript(manuscriptId)
      console.log('✅ Delete response:', response)
      toast.success('Manuscript deleted successfully')
      fetchManuscripts()
    } catch (error) {
      console.error('❌ Failed to delete manuscript:', error)
      console.error('❌ Error response:', error.response)
      console.error('❌ Error data:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to delete manuscript')
    }
  }

  const resetRequirementForm = () => {
    setRequirementForm({
      title: '',
      topic: '',
      field: '',
      description: '',
      guidelines: {
        format: '',
        wordLimit: '',
        citationStyle: '',
        other: ''
      },
      submissionDeadline: '',
      status: 'active'
    })
  }

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'status-badge-warning',
      'accepted': 'status-badge-success',
      'rejected': 'status-badge-danger',
      'under-review': 'status-badge-info',
      'active': 'status-badge-success',
      'closed': 'status-badge-secondary',
      'draft': 'status-badge-secondary'
    }
    return `status-badge ${statusClasses[status] || 'status-badge-secondary'}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="publishing-management">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h2 className="section-title">Publishing House Management</h2>
          <p className="section-subtitle">
            Manage research paper requirements and manuscript submissions
          </p>
        </div>
        {activeTab === 'requirements' && (
          <button 
            className="neu-btn neu-btn-primary"
            onClick={() => {
              setSelectedRequirement(null)
              resetRequirementForm()
              setShowRequirementModal(true)
            }}
          >
            <span className="btn-icon">+</span>
            Post New Requirement
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="neu-card tab-container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            <span className="tab-icon">📄</span>
            Publishing Requirements
          </button>
          <button
            className={`tab-btn ${activeTab === 'manuscripts' ? 'active' : ''}`}
            onClick={() => setActiveTab('manuscripts')}
          >
            <span className="tab-icon">📝</span>
            Submitted Manuscripts
            {stats.pending > 0 && (
              <span className="badge-count">{stats.pending}</span>
            )}
          </button>
        </div>
      </div>

      {/* Manuscripts Stats */}
      {activeTab === 'manuscripts' && (
        <div className="stats-grid">
          <div className="stat-card neu-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              📊
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total || 0}</div>
              <div className="stat-label">Total Manuscripts</div>
            </div>
          </div>
          <div className="stat-card neu-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              ⏳
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending || 0}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          <div className="stat-card neu-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              ✅
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.accepted || 0}</div>
              <div className="stat-label">Accepted</div>
            </div>
          </div>
          <div className="stat-card neu-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              ❌
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected || 0}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="neu-card filters-section">
        <h3 className="filter-title">Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status</label>
            <select
              className="neu-input"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              {activeTab === 'requirements' ? (
                <>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="under-review">Under Review</option>
                </>
              )}
            </select>
          </div>
          {activeTab === 'requirements' && (
            <div className="filter-group">
              <label>Field</label>
              <select
                className="neu-input"
                value={filters.field}
                onChange={(e) => setFilters({ ...filters, field: e.target.value })}
              >
                <option value="">All Fields</option>
                <option value="Urban Planning">Urban Planning</option>
                <option value="Architecture">Architecture</option>
                <option value="Environmental Planning">Environmental Planning</option>
                <option value="Transportation Planning">Transportation Planning</option>
                <option value="Regional Planning">Regional Planning</option>
                <option value="Housing Policy">Housing Policy</option>
              </select>
            </div>
          )}
          <div className="filter-actions">
            <button 
              className="neu-btn neu-btn-secondary"
              onClick={() => setFilters({ status: '', field: '', requirementId: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <div className="neu-loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'requirements' ? (
            <div className="requirements-list">
              {requirements.length === 0 ? (
                <div className="neu-card empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>No Requirements Posted</h3>
                  <p>Start by posting a new research paper requirement</p>
                  <button 
                    className="neu-btn neu-btn-primary"
                    onClick={() => setShowRequirementModal(true)}
                  >
                    Post Requirement
                  </button>
                </div>
              ) : (
                <div className="requirements-grid">
                  {requirements.map((req) => (
                    <div key={req._id} className="requirement-card neu-card">
                      <div className="card-header">
                        <h3 className="card-title">{req.title}</h3>
                        <span className={getStatusBadgeClass(req.status)}>
                          {req.status}
                        </span>
                      </div>
                      <div className="card-meta">
                        <span className="meta-item">
                          <strong>Topic:</strong> {req.topic}
                        </span>
                        <span className="meta-item">
                          <strong>Field:</strong> {req.field}
                        </span>
                        <span className="meta-item">
                          <strong>Deadline:</strong> {formatDate(req.submissionDeadline)}
                        </span>
                        <span className="meta-item">
                          <strong>Submissions:</strong> {req.manuscriptsCount || 0}
                        </span>
                      </div>
                      <div className="card-description">
                        <p>{req.description.substring(0, 150)}...</p>
                      </div>
                      {req.guidelines && (
                        <div className="card-guidelines">
                          {req.guidelines.format && (
                            <div className="guideline-item">
                              <strong>Format:</strong> {req.guidelines.format}
                            </div>
                          )}
                          {req.guidelines.wordLimit && (
                            <div className="guideline-item">
                              <strong>Word Limit:</strong> {req.guidelines.wordLimit}
                            </div>
                          )}
                          {req.guidelines.citationStyle && (
                            <div className="guideline-item">
                              <strong>Citation:</strong> {req.guidelines.citationStyle}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="card-actions">
                        <button
                          className="neu-btn neu-btn-primary"
                          onClick={() => openEditRequirement(req)}
                        >
                          Edit
                        </button>
                        <button
                          className="neu-btn neu-btn-danger"
                          onClick={() => handleDeleteRequirement(req._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="manuscripts-list">
              {manuscripts.length === 0 ? (
                <div className="neu-card empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No Manuscripts Submitted</h3>
                  <p>Waiting for authors to submit manuscripts</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="neu-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Requirement</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manuscripts.map((manuscript) => (
                        <tr key={manuscript._id}>
                          <td>
                            <div className="manuscript-title">
                              {manuscript.title}
                            </div>
                          </td>
                          <td>
                            <div className="author-info">
                              <div className="author-name">{manuscript.author.name}</div>
                              <div className="author-email">{manuscript.author.email}</div>
                            </div>
                          </td>
                          <td>
                            <div className="requirement-info">
                              <div>{manuscript.requirementId?.title}</div>
                              <div className="text-muted">{manuscript.requirementId?.topic}</div>
                            </div>
                          </td>
                          <td>{formatDate(manuscript.submittedAt)}</td>
                          <td>
                            <span className={getStatusBadgeClass(manuscript.status)}>
                              {manuscript.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="neu-btn neu-btn-sm neu-btn-primary"
                                onClick={() => openReviewManuscript(manuscript)}
                                title="Review manuscript"
                              >
                                📝 Review
                              </button>
                              {manuscript.file?.url ? (
                                <a
                                  href={manuscript.file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="neu-btn neu-btn-sm neu-btn-secondary"
                                  title="Download manuscript file"
                                >
                                  📥 Download
                                </a>
                              ) : (
                                <button
                                  className="neu-btn neu-btn-sm neu-btn-disabled"
                                  disabled
                                  title="No file uploaded"
                                >
                                  📥 No File
                                </button>
                              )}
                              <button
                                className="neu-btn neu-btn-sm neu-btn-danger"
                                onClick={() => handleDeleteManuscript(manuscript._id)}
                                title="Delete manuscript"
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Requirement Modal */}
      {showRequirementModal && (
        <div className="modal-overlay" onClick={() => setShowRequirementModal(false)}>
          <div className="modal-content neu-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRequirement ? 'Edit Requirement' : 'Post New Requirement'}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowRequirementModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={selectedRequirement ? handleUpdateRequirement : handleCreateRequirement}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    className="neu-input"
                    value={requirementForm.title}
                    onChange={(e) => setRequirementForm({ ...requirementForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Research Topic *</label>
                  <input
                    type="text"
                    className="neu-input"
                    value={requirementForm.topic}
                    onChange={(e) => setRequirementForm({ ...requirementForm, topic: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Field/Domain *</label>
                  <select
                    className="neu-input"
                    value={requirementForm.field}
                    onChange={(e) => setRequirementForm({ ...requirementForm, field: e.target.value })}
                    required
                  >
                    <option value="">Select Field</option>
                    <option value="Urban Planning">Urban Planning</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Environmental Planning">Environmental Planning</option>
                    <option value="Transportation Planning">Transportation Planning</option>
                    <option value="Regional Planning">Regional Planning</option>
                    <option value="Housing Policy">Housing Policy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Submission Deadline *</label>
                  <input
                    type="date"
                    className="neu-input"
                    value={requirementForm.submissionDeadline}
                    onChange={(e) => setRequirementForm({ ...requirementForm, submissionDeadline: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    className="neu-input"
                    rows="4"
                    value={requirementForm.description}
                    onChange={(e) => setRequirementForm({ ...requirementForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Format Guidelines</label>
                  <input
                    type="text"
                    className="neu-input"
                    placeholder="e.g., PDF, DOCX"
                    value={requirementForm.guidelines.format}
                    onChange={(e) => setRequirementForm({
                      ...requirementForm,
                      guidelines: { ...requirementForm.guidelines, format: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Word Limit</label>
                  <input
                    type="text"
                    className="neu-input"
                    placeholder="e.g., 5000-8000 words"
                    value={requirementForm.guidelines.wordLimit}
                    onChange={(e) => setRequirementForm({
                      ...requirementForm,
                      guidelines: { ...requirementForm.guidelines, wordLimit: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Citation Style</label>
                  <input
                    type="text"
                    className="neu-input"
                    placeholder="e.g., APA, MLA, Chicago"
                    value={requirementForm.guidelines.citationStyle}
                    onChange={(e) => setRequirementForm({
                      ...requirementForm,
                      guidelines: { ...requirementForm.guidelines, citationStyle: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="neu-input"
                    value={requirementForm.status}
                    onChange={(e) => setRequirementForm({ ...requirementForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Other Guidelines</label>
                  <textarea
                    className="neu-input"
                    rows="3"
                    placeholder="Any additional guidelines..."
                    value={requirementForm.guidelines.other}
                    onChange={(e) => setRequirementForm({
                      ...requirementForm,
                      guidelines: { ...requirementForm.guidelines, other: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="neu-btn neu-btn-secondary"
                  onClick={() => setShowRequirementModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="neu-btn neu-btn-primary">
                  {selectedRequirement ? 'Update Requirement' : 'Post Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manuscript Review Modal */}
      {showManuscriptModal && selectedManuscript && (
        <div className="modal-overlay" onClick={() => setShowManuscriptModal(false)}>
          <div className="modal-content neu-card modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Manuscript</h2>
              <button 
                className="modal-close"
                onClick={() => setShowManuscriptModal(false)}
              >
                ×
              </button>
            </div>
            <div className="manuscript-details">
              <div className="detail-row">
                <strong>Title:</strong> {selectedManuscript.title}
              </div>
              <div className="detail-row">
                <strong>Author:</strong> {selectedManuscript.author.name} ({selectedManuscript.author.email})
              </div>
              <div className="detail-row">
                <strong>Requirement:</strong> {selectedManuscript.requirementId?.title}
              </div>
              <div className="detail-row">
                <strong>Topic:</strong> {selectedManuscript.requirementId?.topic}
              </div>
              <div className="detail-row">
                <strong>Submitted:</strong> {formatDate(selectedManuscript.submittedAt)}
              </div>
              <div className="detail-row">
                <strong>Current Status:</strong> 
                <span className={getStatusBadgeClass(selectedManuscript.status)}>
                  {selectedManuscript.status}
                </span>
              </div>
              <div className="detail-row full-width">
                <strong>Abstract:</strong>
                <p className="abstract-text">{selectedManuscript.abstract}</p>
              </div>
            </div>
            <form onSubmit={handleReviewManuscript}>
              <div className="form-group">
                <label>Decision *</label>
                <select
                  className="neu-input"
                  value={reviewForm.action}
                  onChange={(e) => setReviewForm({ ...reviewForm, action: e.target.value })}
                  required
                >
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                  <option value="under-review">Under Review</option>
                </select>
              </div>
              <div className="form-group">
                <label>Admin Remarks / Feedback</label>
                <textarea
                  className="neu-input"
                  rows="4"
                  placeholder="Provide feedback to the author..."
                  value={reviewForm.remarks}
                  onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="neu-btn neu-btn-secondary"
                  onClick={() => setShowManuscriptModal(false)}
                >
                  Cancel
                </button>
                {selectedManuscript.file?.url ? (
                  <a
                    href={selectedManuscript.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="neu-btn neu-btn-secondary"
                    title={`Download ${selectedManuscript.file.filename || 'manuscript'}`}
                  >
                    📥 Download File
                  </a>
                ) : (
                  <button
                    type="button"
                    className="neu-btn neu-btn-disabled"
                    disabled
                    title="No file uploaded"
                  >
                    📥 No File
                  </button>
                )}
                <button type="submit" className="neu-btn neu-btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublishingManagement
