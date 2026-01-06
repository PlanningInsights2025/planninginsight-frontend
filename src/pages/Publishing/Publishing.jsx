import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { 
  getPublishingRequirements, 
  submitManuscript, 
  getMyManuscripts,
  deleteManuscript 
} from '../../services/api/publishing'
import './Publishing.css'

const Publishing = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('requirements')
  const [requirements, setRequirements] = useState([])
  const [myManuscripts, setMyManuscripts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    field: '',
    search: ''
  })

  const [submitForm, setSubmitForm] = useState({
    title: '',
    abstract: '',
    authorName: '',
    authorEmail: '',
    affiliation: '',
    phone: '',
    file: null
  })

  useEffect(() => {
    fetchRequirements()
  }, [filters])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyManuscripts()
    }
  }, [isAuthenticated, activeTab])

  const fetchRequirements = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching requirements with filters:', filters)
      const response = await getPublishingRequirements(filters)
      console.log('✅ Requirements response:', response)
      setRequirements(response.data.requirements || [])
    } catch (error) {
      console.error('❌ Error fetching requirements:', error)
      console.error('❌ Error response:', error.response)
      toast.error('Failed to fetch requirements')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyManuscripts = async () => {
    try {
      console.log('🔍 Fetching my manuscripts...')
      const response = await getMyManuscripts()
      console.log('✅ Manuscripts response:', response)
      setMyManuscripts(response.data.manuscripts || [])
      console.log('📝 Total manuscripts:', response.data.manuscripts?.length || 0)
    } catch (error) {
      console.error('❌ Failed to fetch manuscripts:', error)
      console.error('❌ Error response:', error.response)
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch your submissions')
      }
    }
  }

  const handleDeleteManuscript = async (manuscriptId, manuscriptTitle) => {
    if (!window.confirm(`Are you sure you want to remove "${manuscriptTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      console.log('\n=== 🗑️ DELETING MANUSCRIPT ===')
      console.log('Manuscript ID:', manuscriptId)
      console.log('Auth Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing')
      console.log('Current User:', user)
      
      const response = await deleteManuscript(manuscriptId)
      console.log('✅ Delete response:', response)
      
      toast.success('✅ Manuscript removed successfully!')
      
      // Remove from local state immediately
      setMyManuscripts(prev => prev.filter(m => m._id !== manuscriptId))
    } catch (error) {
      console.error('❌ Error deleting manuscript:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove manuscript'
      toast.error(errorMessage)
    }
  }

  const handleSubmitManuscript = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to submit manuscript')
      navigate('/login')
      return
    }

    if (!submitForm.file) {
      toast.error('Please upload a manuscript file')
      return
    }

    try {
      setSubmitting(true)
      console.log('\n=== 📤 MANUSCRIPT SUBMISSION START ===')
      console.log('🔐 Auth Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing')
      console.log('👤 Current User:', user)
      console.log('📋 Form data:', {
        requirementId: selectedRequirement._id,
        requirementTitle: selectedRequirement.title,
        title: submitForm.title,
        authorName: submitForm.authorName,
        authorEmail: submitForm.authorEmail,
        fileSize: submitForm.file.size,
        fileName: submitForm.file.name
      })
      
      const formData = new FormData()
      formData.append('requirementId', selectedRequirement._id)
      formData.append('title', submitForm.title)
      formData.append('abstract', submitForm.abstract)
      formData.append('authorName', submitForm.authorName)
      formData.append('authorEmail', submitForm.authorEmail)
      formData.append('affiliation', submitForm.affiliation || '')
      formData.append('phone', submitForm.phone || '')
      formData.append('file', submitForm.file)

      console.log('📦 FormData created, sending to API...')
      const response = await submitManuscript(formData)
      console.log('✅ API Response:', response)
      
      toast.success('🎉 Manuscript submitted successfully!')
      setShowSubmitModal(false)
      resetSubmitForm()
      
      // Refresh manuscripts list and switch to My Submissions tab
      await fetchMyManuscripts()
      setActiveTab('my-submissions')
      
    } catch (error) {
      console.error('❌ Submission error:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit manuscript'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const resetSubmitForm = () => {
    setSubmitForm({
      title: '',
      abstract: '',
      authorName: '',
      authorEmail: '',
      affiliation: '',
      phone: '',
      file: null
    })
  }

  const openSubmitModal = (requirement) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit manuscript')
      navigate('/login')
      return
    }
    setSelectedRequirement(requirement)
    setSubmitForm({
      ...submitForm,
      authorName: `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim(),
      authorEmail: user?.email || ''
    })
    setShowSubmitModal(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending Review' },
      'under-review': { class: 'badge-info', text: 'Under Review' },
      accepted: { class: 'badge-success', text: 'Accepted' },
      rejected: { class: 'badge-danger', text: 'Rejected' }
    }
    return badges[status] || { class: 'badge-secondary', text: status }
  }

  return (
    <div className="publishing-page">
      <div className="publishing-hero">
        <div className="hero-badge">
          <span>📚</span>
          <span>Publishing House</span>
        </div>
        <h1 className="hero-title">
          Submit Your <span className="text-gradient">Research</span>
        </h1>
        <p className="hero-description">
          Share your research with a global audience of built environment professionals.
          Get published in peer-reviewed academic journals and contribute to the field.
        </p>
        
        <div className="publishing-stats">
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <strong>{requirements.length}</strong>
              <span>Active Requirements</span>
            </div>
          </div>
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <strong>1,200+</strong>
              <span>Authors</span>
            </div>
          </div>
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <strong>50+</strong>
              <span>Journals</span>
            </div>
          </div>
          <div className="stat-card">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <div>
              <strong>10K+</strong>
              <span>Citations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="submission-cta">
        <div className="cta-content">
          <div className="cta-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="cta-text">
            <h3>Ready to Submit Your Research?</h3>
            <p>Browse available requirements and submit your manuscript for peer review</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => {
              if (requirements.length > 0) {
                document.getElementById('requirements-section')?.scrollIntoView({ behavior: 'smooth' })
              } else {
                toast.info('No active requirements available')
              }
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
            View Requirements
          </button>
        </div>
      </div>

      {isAuthenticated && (
        <div className="publishing-tabs">
          <button
            className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Available Requirements
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-submissions')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Submissions
            {myManuscripts.length > 0 && (
              <span className="tab-badge">{myManuscripts.length}</span>
            )}
          </button>
        </div>
      )}

      <div className="search-filter-section" id="requirements-section">
        <div className="search-row">
          <div className="search-box">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search publications, authors, keywords..."
              className="search-input-modern"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="sort-select"
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
          {(filters.field || filters.search) && (
            <button 
              className="filter-toggle"
              onClick={() => setFilters({ field: '', search: '' })}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'requirements' ? (
            <div className="requirements-section">
              <h2 className="section-title">Available Requirements</h2>
              <p className="section-count">{requirements.length} requirement{requirements.length !== 1 ? 's' : ''}</p>
              
              {requirements.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>No Requirements Found</h3>
                  <p>There are currently no publishing requirements available</p>
                </div>
              ) : (
                <div className="requirements-grid">
                  {requirements.map((req) => (
                    <div key={req._id} className="requirement-card">
                      <div className="card-header">
                        <span className="card-field-badge">{req.field}</span>
                        <span className="card-deadline">
                          ⏰ {formatDate(req.submissionDeadline)}
                        </span>
                      </div>
                      
                      <h3 className="card-title">{req.title}</h3>
                      <p className="card-topic"><strong>Topic:</strong> {req.topic}</p>
                      <p className="card-description">{req.description}</p>
                      
                      {req.guidelines && (
                        <div className="card-guidelines">
                          <h4>Guidelines:</h4>
                          <ul>
                            {req.guidelines.format && <li><strong>Format:</strong> {req.guidelines.format}</li>}
                            {req.guidelines.wordLimit && <li><strong>Word Limit:</strong> {req.guidelines.wordLimit}</li>}
                            {req.guidelines.citationStyle && <li><strong>Citation:</strong> {req.guidelines.citationStyle}</li>}
                          </ul>
                        </div>
                      )}
                      
                      <div className="card-footer">
                        <div className="card-meta">
                          <span>📊 {req.manuscriptsCount || 0} submissions</span>
                        </div>
                        <button
                          className="btn-submit-manuscript"
                          onClick={() => openSubmitModal(req)}
                        >
                          Submit Manuscript
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="my-submissions-section">
              <h2 className="section-title">My Submissions</h2>
              <p className="section-count">{myManuscripts.length} manuscript{myManuscripts.length !== 1 ? 's' : ''}</p>
              
              {myManuscripts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No Submissions Yet</h3>
                  <p>You haven't submitted any manuscripts</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveTab('requirements')}
                  >
                    View Requirements
                  </button>
                </div>
              ) : (
                <div className="manuscripts-list">
                  {myManuscripts.map((manuscript) => (
                    <div key={manuscript._id} className="manuscript-card">
                      {manuscript.status === 'accepted' && (
                        <div className="notification-banner success">
                          <span className="notification-icon">🎉</span>
                          <span className="notification-text">
                            <strong>Congratulations!</strong> Your manuscript has been accepted for publication and will appear in the upcoming journal issue.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'rejected' && manuscript.adminRemarks && (
                        <div className="notification-banner danger">
                          <span className="notification-icon">📋</span>
                          <span className="notification-text">
                            <strong>Review Complete:</strong> Please review the feedback below to improve your manuscript.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'under-review' && (
                        <div className="notification-banner info">
                          <span className="notification-icon">⏳</span>
                          <span className="notification-text">
                            <strong>Under Review:</strong> Our editorial team is carefully reviewing your manuscript. You'll be notified once the review is complete.
                          </span>
                        </div>
                      )}
                      {manuscript.status === 'pending' && (
                        <div className="notification-banner warning">
                          <span className="notification-icon">📬</span>
                          <span className="notification-text">
                            <strong>Submission Received:</strong> Your manuscript has been successfully submitted and is in the queue for review.
                          </span>
                        </div>
                      )}
                      
                      <div className="manuscript-header">
                        <h3>{manuscript.title}</h3>
                        <span className={`status-badge ${getStatusBadge(manuscript.status).class}`}>
                          {getStatusBadge(manuscript.status).text}
                        </span>
                      </div>
                      
                      <div className="manuscript-info">
                        <p>
                          <strong>📚 Requirement</strong>
                          <span>{manuscript.requirementId?.title || 'N/A'}</span>
                        </p>
                        <p>
                          <strong>🎯 Topic</strong>
                          <span>{manuscript.requirementId?.topic || 'N/A'}</span>
                        </p>
                        <p>
                          <strong>📅 Submitted</strong>
                          <span>{formatDate(manuscript.submittedAt)}</span>
                        </p>
                        {manuscript.reviewedAt && (
                          <p>
                            <strong>✅ Reviewed</strong>
                            <span>{formatDate(manuscript.reviewedAt)}</span>
                          </p>
                        )}
                      </div>
                      
                      {manuscript.adminRemarks && (
                        <div className="manuscript-remarks">
                          <strong>📝 Admin Feedback</strong>
                          <p>{manuscript.adminRemarks}</p>
                        </div>
                      )}
                      
                      <div className="manuscript-actions">
                        <button
                          className="btn-delete-manuscript"
                          onClick={() => handleDeleteManuscript(manuscript._id, manuscript.title)}
                          title="Remove this submission"
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Submission
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showSubmitModal && selectedRequirement && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content modal-submit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Manuscript</h2>
              <button 
                className="modal-close"
                onClick={() => setShowSubmitModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="requirement-info">
              <h3>{selectedRequirement.title}</h3>
              <p><strong>Topic:</strong> {selectedRequirement.topic}</p>
              <p><strong>Field:</strong> {selectedRequirement.field}</p>
              <p><strong>Deadline:</strong> {formatDate(selectedRequirement.submissionDeadline)}</p>
            </div>

            <form onSubmit={handleSubmitManuscript} className="submit-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Manuscript Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Abstract *</label>
                <textarea
                  className="form-textarea"
                  rows="5"
                  value={submitForm.abstract}
                  onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Author Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={submitForm.authorName}
                    onChange={(e) => setSubmitForm({ ...submitForm, authorName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={submitForm.authorEmail}
                    onChange={(e) => setSubmitForm({ ...submitForm, authorEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Affiliation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="University/Organization"
                    value={submitForm.affiliation}
                    onChange={(e) => setSubmitForm({ ...submitForm, affiliation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={submitForm.phone}
                    onChange={(e) => setSubmitForm({ ...submitForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Upload Manuscript File *</label>
                <input
                  type="file"
                  className="form-file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSubmitForm({ ...submitForm, file: e.target.files[0] })}
                  required
                />
                <p className="form-hint">Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Manuscript'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Publishing
