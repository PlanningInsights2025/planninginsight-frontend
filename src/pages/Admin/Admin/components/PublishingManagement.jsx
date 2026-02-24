import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { adminAPI } from '../../../../services/api/admin'
import '../Admin.css'

const PublishingManagement = () => {
  const [activeTab, setActiveTab] = useState('requirements') // 'requirements' or 'manuscripts'
  const [submissionType, setSubmissionType] = useState('manuscripts') // 'manuscripts' or 'papers'
  const [requirements, setRequirements] = useState([])
  const [manuscripts, setManuscripts] = useState([])
  const [researchPapers, setResearchPapers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showRequirementModal, setShowRequirementModal] = useState(false)
  const [showManuscriptModal, setShowManuscriptModal] = useState(false)
  const [showPaperModal, setShowPaperModal] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState(null)
  const [selectedManuscript, setSelectedManuscript] = useState(null)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  })
  const [paperStats, setPaperStats] = useState({
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
    } else if (activeTab === 'manuscripts') {
      if (submissionType === 'manuscripts') {
        fetchManuscripts()
      } else {
        fetchResearchPapers()
      }
    }
  }, [activeTab, submissionType, filters])

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

  const fetchResearchPapers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllResearchPapersOverview(filters)
      console.log('📝 Research Papers response:', response)
      setResearchPapers(response.data.papers || [])
      setPaperStats(response.data.stats || paperStats)
    } catch (error) {
      console.error('❌ Failed to fetch research papers:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch research papers')
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
    
    // Optimistic UI update - close modal and show success immediately
    const manuscriptId = selectedManuscript._id
    const action = reviewForm.action
    const remarks = reviewForm.remarks
    
    // Update UI immediately
    toast.success(`Manuscript ${action} successfully`)
    setShowManuscriptModal(false)
    setSelectedManuscript(null)
    setReviewForm({ action: 'accepted', remarks: '' })
    
    // Update manuscripts list optimistically
    setManuscripts(prev => prev.map(m => 
      m._id === manuscriptId 
        ? { ...m, status: action, adminRemarks: remarks }
        : m
    ))
    
    try {
      // Make API call in background
      await adminAPI.reviewManuscript(
        manuscriptId, 
        {
          status: action,
          reviewComments: remarks
        }
      )
      // Silently refresh data in background
      fetchManuscripts()
    } catch (error) {
      console.error('Review manuscript error:', error)
      // Revert optimistic update on error
      toast.error(error.response?.data?.message || 'Failed to review manuscript')
      fetchManuscripts() // Refresh to get correct state
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

  const openReviewPaper = (paper) => {
    setSelectedPaper(paper)
    setReviewForm({
      action: paper.status || 'pending',
      remarks: paper.adminRemarks || ''
    })
    setShowPaperModal(true)
  }

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this research paper? This action cannot be undone.')) {
      return
    }

    try {
      console.log('🗑️ Deleting research paper:', paperId)
      // Use manuscript delete API since research papers are stored as manuscripts with type='research-paper'
      const response = await adminAPI.deleteManuscript(paperId)
      console.log('✅ Delete response:', response)
      toast.success('Research paper deleted successfully')
      fetchResearchPapers()
    } catch (error) {
      console.error('❌ Failed to delete research paper:', error)
      toast.error(error.response?.data?.message || 'Failed to delete research paper')
    }
  }

  const handleReviewPaper = async (e) => {
    e.preventDefault()
    try {
      console.log('📝 Reviewing research paper:', selectedPaper._id, reviewForm)
      // Use manuscript review API since research papers are stored as manuscripts
      const response = await adminAPI.reviewManuscript(selectedPaper._id, {
        status: reviewForm.action,
        reviewComments: reviewForm.remarks
      })
      console.log('✅ Review response:', response)
      toast.success(`Research paper ${reviewForm.action} successfully`)
      setShowPaperModal(false)
      fetchResearchPapers()
    } catch (error) {
      console.error('❌ Failed to review research paper:', error)
      console.error('❌ Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to review research paper')
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

  const statusColor = (status) => {
    const map = {
      pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
      accepted: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
      rejected: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
      'under-review': { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
      'update-changes': { bg: 'rgba(251,146,60,0.15)', color: '#fb923c', border: 'rgba(251,146,60,0.3)' },
      active: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
      closed: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
      draft: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
    }
    return map[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,23,42,0.6)',
    color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  }
  const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }

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
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '28px' }}>🏛️</span>
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff', letterSpacing: '-0.01em' }}>
                Publishing House Management
              </h2>
              <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.82)', fontWeight: '500' }}>
                Manage research paper requirements and manuscript submissions
              </p>
            </div>
          </div>
          {activeTab === 'requirements' && (
            <button
              onClick={() => { setSelectedRequirement(null); resetRequirementForm(); setShowRequirementModal(true) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '12px', border: 'none',
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
                color: '#ffffff', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Post New Requirement
            </button>
          )}
        </div>

        {/* Stats row — always visible inside header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginTop: '28px' }}>
          {[
            { label: 'Total', value: submissionType === 'manuscripts' ? (stats.total || 0) : (paperStats.total || 0) },
            { label: 'Pending', value: submissionType === 'manuscripts' ? (stats.pending || 0) : (paperStats.pending || 0) },
            { label: 'Accepted', value: submissionType === 'manuscripts' ? (stats.accepted || 0) : (paperStats.accepted || 0) },
            { label: 'Rejected', value: submissionType === 'manuscripts' ? (stats.rejected || 0) : (paperStats.rejected || 0) },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', padding: '16px',
              border: '1px solid rgba(255,255,255,0.18)'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Tabs */}
      <div style={{
        background: 'rgba(15,23,42,0.85)', borderRadius: '16px', padding: '6px',
        marginBottom: '16px', display: 'flex', gap: '4px',
        border: '1px solid rgba(99,102,241,0.18)'
      }}>
        {[
          { key: 'requirements', label: '📄 Publishing Requirements' },
          { key: 'manuscripts', label: `📝 Submission Review${stats.pending > 0 ? ` (${stats.pending})` : ''}` }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: '12px 20px', borderRadius: '11px', border: 'none',
            background: activeTab === tab.key ? 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)' : 'transparent',
            color: activeTab === tab.key ? '#ffffff' : '#64748b',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Submission Sub-tabs */}
      {activeTab === 'manuscripts' && (
        <div style={{
          background: 'rgba(15,23,42,0.85)', borderRadius: '16px', padding: '6px',
          marginBottom: '16px', display: 'flex', gap: '4px',
          border: '1px solid rgba(99,102,241,0.18)'
        }}>
          {[
            { key: 'manuscripts', label: `📝 Manuscripts${stats.pending > 0 ? ` (${stats.pending})` : ''}` },
            { key: 'papers', label: `📄 Research Papers${paperStats.pending > 0 ? ` (${paperStats.pending})` : ''}` }
          ].map(tab => (
            <button key={tab.key} onClick={() => setSubmissionType(tab.key)} style={{
              flex: 1, padding: '11px 20px', borderRadius: '11px', border: 'none',
              background: submissionType === tab.key ? 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)' : 'transparent',
              color: submissionType === tab.key ? '#ffffff' : '#64748b',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
            }}>{tab.label}</button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: 'rgba(15,23,42,0.85)', borderRadius: '16px', padding: '20px 24px',
        marginBottom: '20px', border: '1px solid rgba(99,102,241,0.18)'
      }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Filters</div>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '0 0 200px' }}>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Status</option>
              {activeTab === 'requirements' ? (
                <><option value="active">Active</option><option value="closed">Closed</option><option value="draft">Draft</option></>
              ) : (
                <><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="under-review">Under Review</option><option value="update-changes">Update Changes</option></>
              )}
            </select>
          </div>
          {activeTab === 'requirements' && (
            <div style={{ flex: '0 0 220px' }}>
              <label style={labelStyle}>Field</label>
              <select style={inputStyle} value={filters.field} onChange={(e) => setFilters({ ...filters, field: e.target.value })}>
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
          <button
            onClick={() => setFilters({ status: '', field: '', requirementId: '' })}
            style={{
              padding: '10px 20px', borderRadius: '10px',
              border: '1px solid rgba(99,102,241,0.3)', background: 'transparent',
              color: '#818cf8', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
            }}
          >Clear Filters</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: '14px' }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {activeTab === 'requirements' ? (
            <div>
              {requirements.length === 0 ? (
                <div style={{
                  background: 'rgba(15,23,42,0.85)', borderRadius: '16px', padding: '60px 32px',
                  textAlign: 'center', border: '1px solid rgba(99,102,241,0.18)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <h3 style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>No Requirements Posted</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Start by posting a new research paper requirement</p>
                  <button onClick={() => setShowRequirementModal(true)} style={{
                    padding: '11px 24px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                    color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer'
                  }}>Post Requirement</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                  {requirements.map((req) => {
                    const sc = statusColor(req.status)
                    return (
                      <div key={req._id} style={{
                        background: 'rgba(15,23,42,0.88)', borderRadius: '16px', padding: '24px',
                        border: '1px solid rgba(99,102,241,0.18)', display: 'flex', flexDirection: 'column', gap: '14px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <h3 style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '16px', margin: 0, lineHeight: 1.4 }}>{req.title}</h3>
                          <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{req.status}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {[['Topic', req.topic], ['Field', req.field], ['Deadline', formatDate(req.submissionDeadline)], ['Submissions', req.manuscriptsCount || 0]].map(([k, v]) => (
                            <div key={k} style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '8px', padding: '8px 12px' }}>
                              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                              <div style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginTop: '2px' }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{req.description.substring(0, 150)}...</p>
                        {req.guidelines && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {req.guidelines.format && <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: '12px', fontWeight: '600' }}>📄 {req.guidelines.format}</span>}
                            {req.guidelines.wordLimit && <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: '12px', fontWeight: '600' }}>📝 {req.guidelines.wordLimit}</span>}
                            {req.guidelines.citationStyle && <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: '12px', fontWeight: '600' }}>📚 {req.guidelines.citationStyle}</span>}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '4px' }}>
                          <button onClick={() => openEditRequirement(req)} style={{ flex: 1, padding: '9px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeleteRequirement(req._id)} style={{ flex: 1, padding: '9px', borderRadius: '9px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {submissionType === 'manuscripts' ? (
                <>
                  {manuscripts.length === 0 ? (
                    <div style={{ background: 'rgba(15,23,42,0.85)', borderRadius: '16px', padding: '60px 32px', textAlign: 'center', border: '1px solid rgba(99,102,241,0.18)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                      <h3 style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>No Manuscripts Submitted</h3>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>Waiting for authors to submit manuscripts</p>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(15,23,42,0.88)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.18)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(99,102,241,0.12)' }}>
                            {['Title', 'Author', 'Requirement', 'Submitted', 'Reviewed By', 'Status', 'Actions'].map(h => (
                              <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {manuscripts.map((manuscript, i) => {
                            const sc = statusColor(manuscript.status)
                            return (
                              <tr key={manuscript._id} style={{ borderTop: '1px solid rgba(99,102,241,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.03)' }}>
                                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: '13px', fontWeight: '600', maxWidth: '200px' }}>{manuscript.title}</td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{manuscript.author.name}</div>
                                  <div style={{ color: '#64748b', fontSize: '12px' }}>{manuscript.author.email}</div>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ color: '#cbd5e1', fontSize: '13px' }}>{manuscript.requirementId?.title}</div>
                                  <div style={{ color: '#64748b', fontSize: '12px' }}>{manuscript.requirementId?.topic}</div>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(manuscript.submittedAt)}</td>
                                <td style={{ padding: '14px 16px' }}>
                                  {manuscript.reviewedBy || manuscript.assignedEditor ? (
                                    <div>
                                      <div style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>
                                        {manuscript.reviewedBy ? `${manuscript.reviewedBy.profile?.firstName || ''} ${manuscript.reviewedBy.profile?.lastName || manuscript.reviewedBy.email}`.trim() : `${manuscript.assignedEditor.profile?.firstName || ''} ${manuscript.assignedEditor.profile?.lastName || manuscript.assignedEditor.email}`.trim()}
                                      </div>
                                      {manuscript.editorReviewedAt && <div style={{ color: '#64748b', fontSize: '11px' }}>{formatDate(manuscript.editorReviewedAt)}</div>}
                                    </div>
                                  ) : <span style={{ color: '#475569', fontSize: '13px' }}>Not assigned</span>}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{manuscript.status}</span>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    <button onClick={() => openReviewManuscript(manuscript)} style={{ padding: '6px 12px', borderRadius: '7px', border: 'none', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>📝 Review</button>
                                    {manuscript.file?.url ? (
                                      <a href={manuscript.file.url} target="_blank" rel="noopener noreferrer" download style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(99,102,241,0.3)', background: 'transparent', color: '#818cf8', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>📥 Download</a>
                                    ) : (
                                      <button disabled style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(100,116,139,0.2)', background: 'transparent', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: 'not-allowed' }}>📥 No File</button>
                                    )}
                                    <button onClick={() => handleDeleteManuscript(manuscript._id)} style={{ padding: '6px 10px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {researchPapers.length === 0 ? (
                    <div style={{ background: 'rgba(15,23,42,0.85)', borderRadius: '16px', padding: '60px 32px', textAlign: 'center', border: '1px solid rgba(99,102,241,0.18)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                      <h3 style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>No Research Papers Submitted</h3>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>Waiting for researchers to submit papers</p>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(15,23,42,0.88)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.18)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(99,102,241,0.12)' }}>
                            {['Title', 'Author', 'Requirement', 'Submitted', 'Reviewed By', 'Status', 'Actions'].map(h => (
                              <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {researchPapers.map((paper, i) => {
                            const sc = statusColor(paper.status || 'pending')
                            return (
                              <tr key={paper._id} style={{ borderTop: '1px solid rgba(99,102,241,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.03)' }}>
                                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: '13px', fontWeight: '600', maxWidth: '200px' }}>{paper.title}</td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{paper.author?.name || 'N/A'}</div>
                                  <div style={{ color: '#64748b', fontSize: '12px' }}>{paper.author?.email || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ color: '#cbd5e1', fontSize: '13px' }}>{paper.requirementId?.title || 'N/A'}</div>
                                  <div style={{ color: '#64748b', fontSize: '12px' }}>{paper.requirementId?.topic || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(paper.submittedAt || paper.createdAt)}</td>
                                <td style={{ padding: '14px 16px' }}>
                                  {paper.reviewedBy || paper.assignedEditor ? (
                                    <div>
                                      <div style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>
                                        {paper.reviewedBy ?
                                          `${paper.reviewedBy.profile?.firstName || ''} ${paper.reviewedBy.profile?.lastName || paper.reviewedBy.email}`.trim() :
                                          `${paper.assignedEditor.profile?.firstName || ''} ${paper.assignedEditor.profile?.lastName || paper.assignedEditor.email}`.trim()
                                        }
                                      </div>
                                      {paper.editorReviewedAt && <div style={{ color: '#64748b', fontSize: '11px' }}>{formatDate(paper.editorReviewedAt)}</div>}
                                    </div>
                                  ) : <span style={{ color: '#475569', fontSize: '13px' }}>Not assigned</span>}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{paper.status || 'pending'}</span>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    <button onClick={() => openReviewPaper(paper)} style={{ padding: '6px 12px', borderRadius: '7px', border: 'none', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>📝 Review</button>
                                    {paper.file?.url ? (
                                      <a href={paper.file.url} target="_blank" rel="noopener noreferrer" download style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(99,102,241,0.3)', background: 'transparent', color: '#818cf8', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>📥 Download</a>
                                    ) : (
                                      <button disabled style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(100,116,139,0.2)', background: 'transparent', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: 'not-allowed' }}>📥 No File</button>
                                    )}
                                    <button onClick={() => handleDeletePaper(paper._id)} style={{ padding: '6px 10px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Requirement Modal ── */}
      {showRequirementModal && (
        <div onClick={() => setShowRequirementModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#0f172a', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#ffffff', fontWeight: '800', fontSize: '20px', margin: 0 }}>{selectedRequirement ? 'Edit Requirement' : 'Post New Requirement'}</h2>
              <button onClick={() => setShowRequirementModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(99,102,241,0.15)', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <form onSubmit={selectedRequirement ? handleUpdateRequirement : handleCreateRequirement}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Title *', key: 'title', type: 'text', required: true },
                  { label: 'Research Topic *', key: 'topic', type: 'text', required: true },
                ].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} style={inputStyle} value={requirementForm[key]} onChange={(e) => setRequirementForm({ ...requirementForm, [key]: e.target.value })} required={required} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Field/Domain *</label>
                  <select style={inputStyle} value={requirementForm.field} onChange={(e) => setRequirementForm({ ...requirementForm, field: e.target.value })} required>
                    <option value="">Select Field</option>
                    {['Urban Planning','Architecture','Environmental Planning','Transportation Planning','Regional Planning','Housing Policy'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Submission Deadline *</label>
                  <input type="date" style={inputStyle} value={requirementForm.submissionDeadline} onChange={(e) => setRequirementForm({ ...requirementForm, submissionDeadline: e.target.value })} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea rows="4" style={{ ...inputStyle, resize: 'vertical' }} value={requirementForm.description} onChange={(e) => setRequirementForm({ ...requirementForm, description: e.target.value })} required />
                </div>
                {[
                  { label: 'Format Guidelines', key: 'format', ph: 'e.g., PDF, DOCX' },
                  { label: 'Word Limit', key: 'wordLimit', ph: 'e.g., 5000-8000 words' },
                  { label: 'Citation Style', key: 'citationStyle', ph: 'e.g., APA, MLA, Chicago' },
                ].map(({ label, key, ph }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type="text" style={inputStyle} placeholder={ph} value={requirementForm.guidelines[key]} onChange={(e) => setRequirementForm({ ...requirementForm, guidelines: { ...requirementForm.guidelines, [key]: e.target.value } })} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={requirementForm.status} onChange={(e) => setRequirementForm({ ...requirementForm, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Other Guidelines</label>
                  <textarea rows="3" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Any additional guidelines..." value={requirementForm.guidelines.other} onChange={(e) => setRequirementForm({ ...requirementForm, guidelines: { ...requirementForm.guidelines, other: e.target.value } })} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowRequirementModal(false)} style={{ padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.25)', background: 'transparent', color: '#94a3b8', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>{selectedRequirement ? 'Update Requirement' : 'Post Requirement'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Manuscript Review Modal ── */}
      {showManuscriptModal && selectedManuscript && (
        <div onClick={() => setShowManuscriptModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#0f172a', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#ffffff', fontWeight: '800', fontSize: '20px', margin: 0 }}>Review Manuscript</h2>
              <button onClick={() => setShowManuscriptModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(99,102,241,0.15)', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
              {[
                ['Title', selectedManuscript.title],
                ['Author', `${selectedManuscript.author.name} (${selectedManuscript.author.email})`],
                ['Requirement', selectedManuscript.requirementId?.title],
                ['Topic', selectedManuscript.requirementId?.topic],
                ['Submitted', formatDate(selectedManuscript.submittedAt)],
                ['Current Status', null],
              ].map(([k, v]) => k === 'Current Status' ? (
                <div key={k} style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{k}</div>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: statusColor(selectedManuscript.status).bg, color: statusColor(selectedManuscript.status).color, border: `1px solid ${statusColor(selectedManuscript.status).border}` }}>{selectedManuscript.status}</span>
                </div>
              ) : (
                <div key={k} style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{k}</div>
                  <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{v}</div>
                </div>
              ))}
              {selectedManuscript.abstract && (
                <div style={{ gridColumn: '1 / -1', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Abstract</div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{selectedManuscript.abstract}</p>
                </div>
              )}
            </div>
            <form onSubmit={handleReviewManuscript}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Decision *</label>
                <select style={inputStyle} value={reviewForm.action} onChange={(e) => setReviewForm({ ...reviewForm, action: e.target.value })} required>
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                  <option value="under-review">Under Review</option>
                  <option value="update-changes">Update Changes</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Admin Remarks / Feedback</label>
                <textarea rows="4" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Provide feedback to the author..." value={reviewForm.remarks} onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowManuscriptModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.25)', background: 'transparent', color: '#94a3b8', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                {selectedManuscript.file?.url ? (
                  <a href={selectedManuscript.file.url} target="_blank" rel="noopener noreferrer" download style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)', background: 'transparent', color: '#818cf8', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>📥 Download</a>
                ) : (
                  <button type="button" disabled style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(100,116,139,0.2)', background: 'transparent', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'not-allowed' }}>📥 No File</button>
                )}
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Research Paper Review Modal ── */}
      {showPaperModal && selectedPaper && (
        <div onClick={() => setShowPaperModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#0f172a', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#ffffff', fontWeight: '800', fontSize: '20px', margin: 0 }}>Review Research Paper</h2>
              <button onClick={() => setShowPaperModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(99,102,241,0.15)', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
              {[
                ['Title', selectedPaper.title],
                ['Author', selectedPaper.author?.name || 'N/A'],
                ['Email', selectedPaper.author?.email || 'N/A'],
                ['Affiliation', selectedPaper.author?.affiliation || 'N/A'],
                ['Requirement', selectedPaper.requirementId?.title || 'N/A'],
                ['Topic', selectedPaper.requirementId?.topic || 'N/A'],
                ['Submitted', formatDate(selectedPaper.submittedAt || selectedPaper.createdAt)],
                ['Current Status', null],
              ].map(([k, v]) => k === 'Current Status' ? (
                <div key={k} style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{k}</div>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: statusColor(selectedPaper.status || 'pending').bg, color: statusColor(selectedPaper.status || 'pending').color, border: `1px solid ${statusColor(selectedPaper.status || 'pending').border}` }}>{selectedPaper.status || 'pending'}</span>
                </div>
              ) : (
                <div key={k} style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{k}</div>
                  <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{v}</div>
                </div>
              ))}
              {(selectedPaper.abstract) && (
                <div style={{ gridColumn: '1 / -1', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Abstract</div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{selectedPaper.abstract || 'No abstract available'}</p>
                </div>
              )}
            </div>
            <form onSubmit={handleReviewPaper}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Decision *</label>
                <select style={inputStyle} value={reviewForm.action} onChange={(e) => setReviewForm({ ...reviewForm, action: e.target.value })} required>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                  <option value="under-review">Under Review</option>
                  <option value="update-changes">Update Changes</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Admin Remarks / Feedback</label>
                <textarea rows="4" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Provide feedback to the author..." value={reviewForm.remarks} onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowPaperModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.25)', background: 'transparent', color: '#94a3b8', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                {selectedPaper.file?.url ? (
                  <a href={selectedPaper.file.url} target="_blank" rel="noopener noreferrer" download style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)', background: 'transparent', color: '#818cf8', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>📥 Download</a>
                ) : (
                  <button type="button" disabled style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(100,116,139,0.2)', background: 'transparent', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'not-allowed' }}>📥 No File</button>
                )}
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublishingManagement
