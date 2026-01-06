import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import * as adminService from '../../../../services/api/admin'

const ForumManagement = () => {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadThreads()
  }, [currentPage, showFlaggedOnly])

  const loadThreads = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllThreadsAdmin({
        page: currentPage,
        limit: 20,
        flagged: showFlaggedOnly
      })
      setThreads(response.data.threads)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load threads')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFlag = async (threadId) => {
    try {
      await adminService.toggleThreadFlag(threadId)
      toast.success('Thread flag toggled')
      loadThreads()
    } catch (error) {
      toast.error('Failed to toggle flag')
    }
  }

  const handleDeleteThread = async (threadId) => {
    if (!window.confirm('Are you sure you want to delete this thread?')) return
    try {
      await adminService.deleteThread(threadId)
      toast.success('Thread deleted successfully')
      loadThreads()
    } catch (error) {
      toast.error('Failed to delete thread')
    }
  }

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">💬 Discussion Forum Management</h2>
        </div>

        <div className="search-bar">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showFlaggedOnly}
              onChange={(e) => {
                setShowFlaggedOnly(e.target.checked)
                setCurrentPage(1)
              }}
            />
            <span>Show Flagged Only</span>
          </label>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : threads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neu-text-muted)' }}>
            No threads found
          </div>
        ) : (
          <div className="neu-table-wrapper">
            <table className="neu-table">
              <thead>
                <tr>
                  <th>Thread</th>
                  <th>Author</th>
                  <th>Replies</th>
                  <th>Flagged</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {threads.map(thread => (
                  <tr key={thread._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{thread.title || 'Untitled Thread'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neu-text-muted)' }}>
                        {thread.category?.name || 'General'} • {new Date(thread.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>{thread.author?.profile?.firstName || 'Unknown'}</td>
                    <td>{thread.repliesCount || 0}</td>
                    <td>
                      <button
                        className={`neu-btn ${thread.flagged ? 'neu-btn-danger' : ''}`}
                        onClick={() => handleToggleFlag(thread._id)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {thread.flagged ? '🚩 Flagged' : '⚑ Flag'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="neu-btn-danger action-btn"
                          onClick={() => handleDeleteThread(thread._id)}
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
            <button className="neu-btn pagination-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>◀</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button key={i} className={`neu-btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="neu-btn pagination-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>▶</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumManagement
