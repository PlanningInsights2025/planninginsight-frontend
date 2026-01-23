import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Newspaper, Search, Filter, CheckCircle, XCircle, Edit3, Trash2, Eye, TrendingUp, Clock, AlertCircle, FileText } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')

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

  const getStats = () => {
    return {
      total: articles.length,
      pending: articles.filter(a => a.approvalStatus === 'pending').length,
      approved: articles.filter(a => a.approvalStatus === 'approved').length,
      rejected: articles.filter(a => a.approvalStatus === 'rejected').length,
      needsModification: articles.filter(a => a.approvalStatus === 'needsModification').length
    }
  }

  const stats = getStats()

  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author?.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <Newspaper size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Newsroom Management
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Review, approve, and manage submitted articles
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
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Articles</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Pending Review</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.pending}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Approved</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.approved}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Needs Changes</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.needsModification}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Rejected</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.rejected}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
          <Search size={20} color="#6b7280" />
          <input
            type="text"
            placeholder="Search articles by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              background: 'transparent'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="#6b7280" />
          <select
            value={filterApproval}
            onChange={(e) => {
              setFilterApproval(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            <option value="">All Approvals</option>
            <option value="pending">⏳ Pending</option>
            <option value="approved">✓ Approved</option>
            <option value="rejected">✗ Rejected</option>
            <option value="needsModification">🔄 Needs Changes</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            <option value="">All Status</option>
            <option value="published">📰 Published</option>
            <option value="draft">📝 Draft</option>
            <option value="pending">⏳ Pending</option>
            <option value="archived">📦 Archived</option>
          </select>
        </div>

        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          padding: '8px 16px',
          background: '#f3f4f6',
          borderRadius: '8px',
          fontWeight: '500'
        }}>
          {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '80px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#f59e0b',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading articles...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b20 0%, #d9770620 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Newspaper size={36} color="#f59e0b" />
          </div>
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No articles found
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {searchQuery ? "Try adjusting your search query" : "No articles have been submitted yet"}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))'
        }}>
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Status Badges */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '6px',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  ...(article.approvalStatus === 'pending' && {
                    background: '#fef3c7',
                    color: '#92400e'
                  }),
                  ...(article.approvalStatus === 'approved' && {
                    background: '#d1fae5',
                    color: '#065f46'
                  }),
                  ...(article.approvalStatus === 'rejected' && {
                    background: '#fee2e2',
                    color: '#991b1b'
                  }),
                  ...(article.approvalStatus === 'needsModification' && {
                    background: '#dbeafe',
                    color: '#1e40af'
                  })
                }}>
                  {article.approvalStatus === 'pending' && <Clock size={14} />}
                  {article.approvalStatus === 'approved' && <CheckCircle size={14} />}
                  {article.approvalStatus === 'rejected' && <XCircle size={14} />}
                  {article.approvalStatus === 'needsModification' && <Edit3 size={14} />}
                  {article.approvalStatus === 'needsModification' ? 'NEEDS CHANGES' : (article.approvalStatus || 'pending').toUpperCase()}
                </div>
                
                {/* Plagiarism Score Badge */}
                {article.plagiarismScore !== undefined && (
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: article.plagiarismScore < 15 ? '#d1fae5' :
                                article.plagiarismScore < 30 ? '#fef3c7' : '#fee2e2',
                    color: article.plagiarismScore < 15 ? '#065f46' :
                           article.plagiarismScore < 30 ? '#92400e' : '#991b1b'
                  }}>
                    {article.plagiarismScore < 15 && '✓ '}
                    {article.plagiarismScore >= 30 && '⚠ '}
                    Plagiarism: {article.plagiarismScore}%
                  </div>
                )}
              </div>

              {/* Article Title */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px',
                marginRight: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4'
              }}>
                {article.title || 'Untitled Article'}
              </h3>

              {/* Meta Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Author</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                    {article.author?.profile?.firstName || article.author?.email || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#f59e0b',
                    background: '#fef3c7',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    {article.category || 'General'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                    {article.status || 'Draft'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submitted</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {article.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproveArticle(article._id)}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => openModifyModal(article)}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Edit3 size={16} />
                      Request Changes
                    </button>
                    <button
                      onClick={() => openRejectModal(article)}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setSelectedArticle(article)}
                  style={{
                    padding: '10px 16px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    ...(article.approvalStatus !== 'pending' && { flex: 1, minWidth: '120px' })
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb'
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <Eye size={16} />
                  View Details
                </button>

                <button
                  onClick={() => handleDeleteArticle(article._id)}
                  style={{
                    padding: '10px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fecaca'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fee2e2'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '24px'
        }}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              fontWeight: '600'
            }}
          >
            ◀
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: currentPage === i + 1 ? '#f59e0b' : 'white',
                color: currentPage === i + 1 ? 'white' : '#1f2937',
                cursor: 'pointer',
                fontWeight: currentPage === i + 1 ? '600' : '400'
              }}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              fontWeight: '600'
            }}
          >
            ▶
          </button>
        </div>
      )}
      {/* Rejection/Modification Modal */}
      {selectedArticle && modalType && (
        <div
          onClick={() => { setSelectedArticle(null); setModalType('') }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#1f2937', 
                  margin: '0 0 8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {modalType === 'reject' ? (
                    <>
                      <XCircle size={28} color="#dc2626" />
                      Reject Article
                    </>
                  ) : (
                    <>
                      <Edit3 size={28} color="#3b82f6" />
                      Request Modification
                    </>
                  )}
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {selectedArticle.title}
                </p>
              </div>
              <button
                onClick={() => { setSelectedArticle(null); setModalType('') }}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb'
                  e.currentTarget.style.transform = 'rotate(90deg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.transform = 'rotate(0deg)'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Author</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedArticle.author?.profile?.firstName || selectedArticle.author?.email || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedArticle.category || 'N/A'}
                  </div>
                </div>
                {selectedArticle.plagiarismScore !== undefined && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Plagiarism Score</div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: selectedArticle.plagiarismScore < 15 ? '#059669' :
                             selectedArticle.plagiarismScore < 30 ? '#d97706' : '#dc2626'
                    }}>
                      {selectedArticle.plagiarismScore}%
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Submitted</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                {modalType === 'reject' ? 'Rejection Reason' : 'Modification Notes'}
                <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>
              </label>
              <textarea
                rows="5"
                value={modalType === 'reject' ? rejectionReason : modificationNotes}
                onChange={(e) => modalType === 'reject' ? setRejectionReason(e.target.value) : setModificationNotes(e.target.value)}
                placeholder={modalType === 'reject' 
                  ? "Explain why this article is being rejected..." 
                  : "Explain what changes are needed..."}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = modalType === 'reject' ? '#dc2626' : '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {modalType === 'modify' && (
              <div style={{
                padding: '16px',
                background: '#dbeafe',
                borderRadius: '12px',
                border: '1px solid #3b82f6',
                marginBottom: '24px',
                display: 'flex',
                gap: '12px'
              }}>
                <AlertCircle size={20} color="#1e40af" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>
                  The author will receive an email notification with your modification notes and can resubmit after making changes.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => { setSelectedArticle(null); setModalType('') }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Cancel
              </button>
              {modalType === 'reject' ? (
                <button 
                  onClick={() => handleRejectArticle(selectedArticle._id, rejectionReason)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <XCircle size={18} />
                  Reject Article
                </button>
              ) : (
                <button 
                  onClick={() => handleRequestModification(selectedArticle._id, modificationNotes)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Edit3 size={18} />
                  Request Modification
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedArticle && !modalType && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <FileText size={28} color="#f59e0b" />
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    Article Details
                  </h2>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#4b5563', margin: 0 }}>
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Author</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {selectedArticle.author?.profile?.firstName || selectedArticle.author?.email || 'Unknown'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {selectedArticle.category || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {selectedArticle.status || 'Draft'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Approval Status</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {selectedArticle.approvalStatus === 'needsModification' ? 'Needs Changes' : selectedArticle.approvalStatus}
                </div>
              </div>
              {selectedArticle.plagiarismScore !== undefined && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Plagiarism Score</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: selectedArticle.plagiarismScore < 15 ? '#059669' :
                           selectedArticle.plagiarismScore < 30 ? '#d97706' : '#dc2626'
                  }}>
                    {selectedArticle.plagiarismScore}%
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Submitted</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  {new Date(selectedArticle.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {selectedArticle.approvalStatus === 'pending' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    handleApproveArticle(selectedArticle._id)
                    setSelectedArticle(null)
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle size={18} />
                  Approve Article
                </button>
                <button
                  onClick={() => {
                    setModalType('modify')
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Edit3 size={18} />
                  Request Changes
                </button>
                <button
                  onClick={() => {
                    setModalType('reject')
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsroomManagement
