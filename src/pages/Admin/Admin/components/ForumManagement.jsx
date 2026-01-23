import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { forumAdminAPI } from '../../../../services/api/forum'
import { MessageSquare, Filter, Search, CheckCircle, XCircle, Clock, Trash2, Eye, Users, TrendingUp } from 'lucide-react'

const ForumManagement = () => {
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // pending, approved, rejected, all
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedForum, setSelectedForum] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadForums()
  }, [currentPage, filter])

  const loadForums = async () => {
    setLoading(true)
    try {
      let response
      if (filter === 'pending') {
        response = await forumAdminAPI.getPendingForums()
        console.log('Pending forums response:', response)
        // Handle both response.data as array or response.data.forums as array
        const forumsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.forums || [])
        setForums(forumsData)
        setTotalPages(1)
      } else {
        response = await forumAdminAPI.getAllForums({
          page: currentPage,
          limit: 20,
          status: filter === 'all' ? undefined : filter
        })
        console.log('All forums response:', response)
        // Handle both response.data as array or response.data.forums as array
        const forumsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.forums || [])
        setForums(forumsData)
        setTotalPages(response.data?.pagination?.pages || 1)
      }
    } catch (error) {
      toast.error('Failed to load forums')
      console.error('Load forums error:', error)
      setForums([]) // Ensure forums is always an array
    } finally {
      setLoading(false)
    }
  }

  const handleApproveForum = async (forumId) => {
    try {
      await forumAdminAPI.approveForum(forumId)
      toast.success('Forum approved successfully')
      loadForums()
    } catch (error) {
      toast.error('Failed to approve forum')
      console.error(error)
    }
  }

  const handleRejectForum = async (forumId) => {
    const reason = window.prompt('Reason for rejection (optional):')
    try {
      await forumAdminAPI.rejectForum(forumId, reason)
      toast.success('Forum rejected')
      loadForums()
    } catch (error) {
      toast.error('Failed to reject forum')
      console.error(error)
    }
  }

  const handleDeleteForum = async (forumId) => {
    if (!window.confirm('Are you sure you want to delete this forum? This action cannot be undone.')) return
    try {
      await forumAdminAPI.deleteForum(forumId)
      toast.success('Forum deleted successfully')
      loadForums()
    } catch (error) {
      toast.error('Failed to delete forum')
      console.error(error)
    }
  }

  const getStats = () => {
    return {
      total: forums.length,
      pending: forums.filter(f => f.status === 'pending').length,
      approved: forums.filter(f => f.status === 'approved').length,
      rejected: forums.filter(f => f.status === 'rejected').length
    }
  }

  const stats = getStats()
  
  const filteredForums = forums.filter(forum => 
    forum.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.category?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <MessageSquare size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Forum Management
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Review, approve, and manage all discussion forums
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
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
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Forums</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Pending Approval</div>
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
            placeholder="Search forums by title, description, or category..."
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
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
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
            <option value="pending">⏳ Pending</option>
            <option value="approved">✓ Approved</option>
            <option value="rejected">✗ Rejected</option>
            <option value="all">All Status</option>
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
          {filteredForums.length} result{filteredForums.length !== 1 ? 's' : ''}
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
                borderTopColor: '#667eea',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading forums...</p>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        ) : forums.length === 0 ? (
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
              background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <MessageSquare size={36} color="#667eea" />
            </div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              No forums found
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {filter === 'pending' && "There are no pending forums awaiting approval"}
              {filter === 'approved' && "There are no approved forums"}
              {filter === 'rejected' && "There are no rejected forums"}
              {filter === 'all' && searchQuery && "Try adjusting your search query"}
              {filter === 'all' && !searchQuery && "No forums have been created yet"}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
          }}>
            {filteredForums.map((forum) => (
              <div
                key={forum._id}
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
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.15)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  ...(forum.status === 'pending' && {
                    background: '#fef3c7',
                    color: '#92400e'
                  }),
                  ...(forum.status === 'approved' && {
                    background: '#d1fae5',
                    color: '#065f46'
                  }),
                  ...(forum.status === 'rejected' && {
                    background: '#fee2e2',
                    color: '#991b1b'
                  })
                }}>
                  {forum.status === 'pending' && <Clock size={14} />}
                  {forum.status === 'approved' && <CheckCircle size={14} />}
                  {forum.status === 'rejected' && <XCircle size={14} />}
                  {(forum.status || 'pending').toUpperCase()}
                </div>

                {/* Forum Title */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px',
                  marginRight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {forum.title}
                </h3>

                {/* Description */}
                {forum.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5'
                  }}>
                    {forum.description}
                  </p>
                )}

                {/* Meta Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    padding: '6px 12px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#667eea'
                  }}>
                    {forum.category || 'General'}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <Users size={14} />
                    {forum.creator?.username || forum.creator?.email || 'Unknown'}
                  </div>

                  <div style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    {new Date(forum.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  {forum.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApproveForum(forum._id)
                        }}
                        style={{
                          flex: 1,
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
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRejectForum(forum._id)
                        }}
                        style={{
                          flex: 1,
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
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedForum(forum)
                    }}
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
                      ...(forum.status !== 'pending' && { flex: 1 })
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
                    View
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteForum(forum._id)
                    }}
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

        {/* Detail Modal */}
        {selectedForum && (
          <div
            onClick={() => setSelectedForum(null)}
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
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0, flex: 1 }}>
                  {selectedForum.title}
                </h2>
                <button
                  onClick={() => setSelectedForum(null)}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  {selectedForum.description || 'No description provided'}
                </div>
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
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedForum.category || 'General'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: selectedForum.status === 'approved' ? '#059669' : selectedForum.status === 'rejected' ? '#dc2626' : '#92400e'
                  }}>
                    {selectedForum.status === 'approved' ? '✓ Approved' : selectedForum.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Creator</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedForum.creator?.username || selectedForum.creator?.email || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Created</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(selectedForum.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {selectedForum.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      handleApproveForum(selectedForum._id)
                      setSelectedForum(null)
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
                    Approve Forum
                  </button>
                  <button
                    onClick={() => {
                      handleRejectForum(selectedForum._id)
                      setSelectedForum(null)
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
                    Reject Forum
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Detail Modal */}
        {selectedForum && (
          <div
            onClick={() => setSelectedForum(null)}
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
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0, flex: 1 }}>
                  {selectedForum.title}
                </h2>
                <button
                  onClick={() => setSelectedForum(null)}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  {selectedForum.description || 'No description provided'}
                </div>
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
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedForum.category || 'General'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: selectedForum.status === 'approved' ? '#059669' : selectedForum.status === 'rejected' ? '#dc2626' : '#92400e'
                  }}>
                    {selectedForum.status === 'approved' ? '✓ Approved' : selectedForum.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Creator</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedForum.creator?.username || selectedForum.creator?.email || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Created</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(selectedForum.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {selectedForum.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      handleApproveForum(selectedForum._id)
                      setSelectedForum(null)
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
                    Approve Forum
                  </button>
                  <button
                    onClick={() => {
                      handleRejectForum(selectedForum._id)
                      setSelectedForum(null)
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
                    Reject Forum
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      {totalPages > 1 && (
        <div className="pagination" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '24px'
        }}>
          <button 
            className="neu-btn pagination-btn" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            ◀
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => (
            <button 
              key={i} 
              className={`neu-btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} 
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: currentPage === i + 1 ? '#667eea' : 'white',
                color: currentPage === i + 1 ? 'white' : '#1f2937',
                cursor: 'pointer',
                fontWeight: currentPage === i + 1 ? '600' : '400'
              }}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="neu-btn pagination-btn" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  )
}

export default ForumManagement
