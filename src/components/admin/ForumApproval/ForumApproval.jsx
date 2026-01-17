import React, { useState, useEffect } from 'react'
import { forumAdminAPI } from '../../../services/api/forum'
import './ForumApproval.css'

const ForumApproval = () => {
  const [pendingForums, setpendingForums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchPendingForums()
  }, [])

  const fetchPendingForums = async () => {
    try {
      setLoading(true)
      const response = await forumAdminAPI.getPendingForums()
      setpendingForums(response.data || [])
    } catch (err) {
      console.error('Error fetching pending forums:', err)
      setError(err.response?.data?.message || 'Failed to load pending forums')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (forumId) => {
    setProcessingId(forumId)
    try {
      await forumAdminAPI.approveForum(forumId)
      await fetchPendingForums()
      alert('Forum approved successfully!')
    } catch (err) {
      console.error('Error approving forum:', err)
      alert(err.response?.data?.message || 'Failed to approve forum')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (forumId) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    setProcessingId(forumId)
    try {
      await forumAdminAPI.rejectForum(forumId, reason)
      await fetchPendingForums()
      alert('Forum rejected successfully!')
    } catch (err) {
      console.error('Error rejecting forum:', err)
      alert(err.response?.data?.message || 'Failed to reject forum')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div className="forum-approval-loading">Loading pending forums...</div>
  }

  return (
    <div className="forum-approval-container">
      <div className="approval-header">
        <h2>Forum Approval</h2>
        <p>Review and approve new forum requests</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {pendingForums.length === 0 ? (
        <div className="no-pending">
          <h3>No Pending Forums</h3>
          <p>All forums have been reviewed!</p>
        </div>
      ) : (
        <div className="pending-forums-list">
          {pendingForums.map(forum => (
            <div key={forum._id} className="forum-approval-card">
              <div className="forum-info">
                <h3>{forum.title}</h3>
                <p className="forum-description">{forum.description}</p>
                
                <div className="forum-meta">
                  <span className="meta-item">
                    <strong>Category:</strong> {forum.category}
                  </span>
                  <span className="meta-item">
                    <strong>Creator:</strong> {forum.creator?.username || forum.creator?.email || 'Unknown'}
                  </span>
                  <span className="meta-item">
                    <strong>Created:</strong> {new Date(forum.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="forum-actions">
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(forum._id)}
                  disabled={processingId === forum._id}
                >
                  {processingId === forum._id ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReject(forum._id)}
                  disabled={processingId === forum._id}
                >
                  {processingId === forum._id ? 'Processing...' : '✕ Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ForumApproval
