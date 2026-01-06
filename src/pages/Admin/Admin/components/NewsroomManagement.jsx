import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import adminAPI from '../../../../services/api/admin'

const NewsroomManagement = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterApproval, setFilterApproval] = useState('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [modificationNotes, setModificationNotes] = useState('')
  const [modalType, setModalType] = useState('') // 'reject' or 'modify'

  useEffect(() => {
    loadArticles()
  }, [currentPage, filterStatus, filterApproval])

  const loadArticles = async () => {
    setLoading(true)
    try {
      console.log('=== LOADING ARTICLES ===')
      console.log('Params:', {
        page: currentPage,
        limit: 20,
        status: filterStatus,
        approvalStatus: filterApproval
      })
      
      const response = await adminAPI.getAllArticlesAdmin({
        page: currentPage,
        limit: 20,
        status: filterStatus,
        approvalStatus: filterApproval
      })
      
      console.log('Response:', response)
      console.log('Articles received:', response.articles?.length || 0)
      
      setArticles(response.articles || [])
      setTotalPages(response.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to load articles:', error)
      toast.error('Failed to load articles: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleApproveArticle = async (articleId) => {
    try {
      await adminAPI.updateArticleStatus(articleId, {
        approvalStatus: 'approved'
      })
      toast.success('Article approved and published!')
      loadArticles()
    } catch (error) {
      toast.error('Failed to approve article')
      console.error(error)
    }
  }

  const handleRejectArticle = async (articleId, reason) => {
    try {
      await adminAPI.updateArticleStatus(articleId, {
        approvalStatus: 'rejected',
        reason: reason || 'Content did not meet publication standards'
      })
      toast.success('Article rejected')
      setSelectedArticle(null)
      setRejectionReason('')
      setModalType('')
      loadArticles()
    } catch (error) {
      toast.error('Failed to reject article')
      console.error(error)
    }
  }

  const handleRequestModification = async (articleId, notes) => {
    try {
      await adminAPI.updateArticleStatus(articleId, {
        approvalStatus: 'needsModification',
        modificationNotes: notes || 'Please review and modify your article'
      })
      toast.success('Modification requested - author will be notified')
      setSelectedArticle(null)
      setModificationNotes('')
      setModalType('')
      loadArticles()
    } catch (error) {
      toast.error('Failed to request modification')
      console.error(error)
    }
  }

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    try {
      await adminService.deleteArticle(articleId)
      toast.success('Article deleted successfully')
      loadArticles()
    } catch (error) {
      toast.error('Failed to delete article')
    }
  }

  const openRejectModal = (article) => {
    setSelectedArticle(article)
    setRejectionReason('')
    setModalType('reject')
  }

  const openModifyModal = (article) => {
    setSelectedArticle(article)
    setModificationNotes('')
    setModalType('modify')
  }

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">📰 Newsroom Management</h2>
        </div>

        <div className="search-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select
            className="form-select"
            value={filterApproval}
            onChange={(e) => {
              setFilterApproval(e.target.value)
              setCurrentPage(1)
            }}
            style={{ width: '200px' }}
          >
            <option value="">All Approval Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needsModification">Needs Modification</option>
          </select>

          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{ width: '200px' }}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neu-text-muted)' }}>
            No articles found
          </div>
        ) : (
          <div className="neu-table-wrapper">
            <table className="neu-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Plagiarism</th>
                  <th>Status</th>
                  <th>Approval</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{article.title || 'Untitled Article'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neu-text-muted)' }}>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      {article.author?.profile?.firstName || article.author?.email || 'Unknown'}
                    </td>
                    <td>{article.category || 'N/A'}</td>
                    <td>
                      {article.plagiarismScore !== undefined ? (
                        <span style={{
                          color: article.plagiarismScore < 15 ? 'green' :
                                 article.plagiarismScore < 30 ? 'orange' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {article.plagiarismScore}%
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <span className={`neu-badge ${
                        article.status === 'published' ? 'success' :
                        article.status === 'pending' ? 'warning' :
                        article.status === 'draft' ? 'info' : 'default'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td>
                      <span className={`neu-badge ${
                        article.approvalStatus === 'approved' ? 'success' :
                        article.approvalStatus === 'rejected' ? 'danger' :
                        article.approvalStatus === 'needsModification' ? 'warning' :
                        article.approvalStatus === 'pending' ? 'info' : 'default'
                      }`}>
                        {article.approvalStatus === 'needsModification' ? 'Needs Modification' : article.approvalStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {article.approvalStatus === 'pending' && (
                          <>
                            <button
                              className="neu-btn-success action-btn"
                              onClick={() => handleApproveArticle(article._id)}
                              title="Approve & Publish"
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="neu-btn-warning action-btn"
                              onClick={() => openModifyModal(article)}
                              title="Request Modification"
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: '#f59e0b' }}
                            >
                              🔄 Modify
                            </button>
                            <button
                              className="neu-btn-danger action-btn"
                              onClick={() => openRejectModal(article)}
                              title="Reject"
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}
                        <button
                          className="neu-btn-danger action-btn"
                          onClick={() => handleDeleteArticle(article._id)}
                          title="Delete"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
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
            <button className="neu-btn pagination-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>◀</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button key={i} className={`neu-btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="neu-btn pagination-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>▶</button>
          </div>
        )}
      </div>

      {/* Rejection/Modification Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => { setSelectedArticle(null); setModalType('') }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === 'reject' ? 'Reject Article' : 'Request Modification'}: {selectedArticle.title}
              </h3>
              <button onClick={() => { setSelectedArticle(null); setModalType('') }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <p>Author: {selectedArticle.author?.profile?.firstName || selectedArticle.author?.email}</p>
              <p>Plagiarism Score: <strong>{selectedArticle.plagiarismScore}%</strong></p>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {modalType === 'reject' ? 'Rejection Reason:' : 'Modification Notes:'}
                </label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={modalType === 'reject' ? rejectionReason : modificationNotes}
                  onChange={(e) => modalType === 'reject' ? setRejectionReason(e.target.value) : setModificationNotes(e.target.value)}
                  placeholder={modalType === 'reject' 
                    ? "Explain why this article is being rejected..." 
                    : "Explain what changes are needed..."}
                  style={{ width: '100%', padding: '0.75rem' }}
                />
              </div>
              {modalType === 'modify' && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fffbeb', borderRadius: '6px', border: '1px solid #fbbf24' }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                    ℹ️ The author will receive an email notification with your modification notes and can resubmit after making changes.
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="neu-btn" onClick={() => { setSelectedArticle(null); setModalType('') }}>Cancel</button>
              {modalType === 'reject' ? (
                <button 
                  className="neu-btn-danger" 
                  onClick={() => handleRejectArticle(selectedArticle._id, rejectionReason)}
                >
                  Reject Article
                </button>
              ) : (
                <button 
                  className="neu-btn-warning" 
                  onClick={() => handleRequestModification(selectedArticle._id, modificationNotes)}
                  style={{ background: '#f59e0b', color: 'white' }}
                >
                  Request Modification
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsroomManagement
