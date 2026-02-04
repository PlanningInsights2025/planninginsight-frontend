import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const RoleRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const fetchRoleRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/admin/role-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      console.log('📥 Role requests fetched:', data);
      console.log('📋 First request full data:', data.data?.requests?.[0]);
      console.log('👤 First request userId:', data.data?.requests?.[0]?.userId);
      console.log('📧 User email:', data.data?.requests?.[0]?.userId?.email);
      console.log('📋 User profile:', data.data?.requests?.[0]?.userId?.profile);
      
      if (data.success) {
        setRequests(data.data.requests);
        setStats(data.data.stats);
      } else {
        toast.error(data.message || 'Failed to fetch role requests');
      }
    } catch (error) {
      console.error('Error fetching role requests:', error);
      toast.error('Failed to load role requests');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = async (requestId, status, adminNotes = '') => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/admin/role-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNotes })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Request ${status} successfully!`);
        fetchRoleRequests(); // Refresh the list
      } else {
        toast.error(data.message || `Failed to ${status} request`);
      }
    } catch (error) {
      console.error('Error reviewing request:', error);
      toast.error('Failed to process request');
    }
  };

  const handleDeleteRequest = async (request) => {
    console.log('🗑️ Delete button clicked for request:', {
      id: request._id,
      status: request.status,
      requestedRole: request.requestedRole,
      userEmail: request.userId?.email,
      userCurrentRole: request.userId?.role
    });

    // Check if this is an approved request and user still has the role
    if (request.status === 'approved') {
      const userStillHasRole = request.userId?.role === request.requestedRole;
      
      if (userStillHasRole) {
        toast.error(
          `Cannot delete this request. The user still has the ${request.requestedRole} role active. Please revoke the role first before deleting the request.`,
          { duration: 6000 }
        );
        return;
      }
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this role request from ${request.userId?.email || 'this user'}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      console.log('❌ Delete cancelled by user');
      return;
    }

    try {
      console.log('🗑️ Proceeding with deletion for request:', request._id);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const url = `${apiUrl}/api/admin/role-requests/${request._id}`;
      console.log('DELETE URL:', url);
      console.log('Auth token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        toast.success('Role request deleted successfully!');
        fetchRoleRequests(); // Refresh the list
      } else {
        console.error('Delete failed:', data);
        toast.error(data.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request: ' + error.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      editor: 'bg-purple-500',
      instructor: 'bg-teal-500',
      recruiter: 'bg-blue-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      editor: 'Editor',
      chiefeditor: 'Chief Editor',
      instructor: 'Instructor',
      recruiter: 'Recruiter'
    };
    return names[role] || role;
  };

  const handleViewDetails = (request) => {
    console.log('📋 Viewing request details:', request);
    console.log('📝 Reason field:', request.reason);
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleApproveFromModal = async () => {
    if (selectedRequest) {
      await handleReviewRequest(selectedRequest._id, 'approved');
      handleCloseModal();
    }
  };

  const handleRejectFromModal = async () => {
    if (selectedRequest) {
      await handleReviewRequest(selectedRequest._id, 'rejected');
      handleCloseModal();
    }
  };

  const handleRevokeRole = async (request) => {
    console.log('🚫 Attempting to revoke role for request:', request);
    console.log('User ID:', request.userId?._id);
    console.log('Requested Role:', request.requestedRole);

    if (!request.userId?._id) {
      toast.error('User information is missing. Cannot revoke role.');
      return;
    }

    if (!window.confirm(`Are you sure you want to revoke ${getRoleDisplayName(request.requestedRole)} role from ${request.userId?.name || 'this user'}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Admin authentication required. Please login again.');
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = `${apiUrl}/api/admin/users/${request.userId._id}/revoke-role`;
      
      console.log('🔗 Request URL:', url);
      console.log('📝 Request body:', { roleToRevoke: request.requestedRole });
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roleToRevoke: request.requestedRole
        })
      });

      console.log('📤 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (data.success) {
        toast.success(`${getRoleDisplayName(request.requestedRole)} role revoked successfully!`);
        fetchRoleRequests(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to revoke role');
      }
    } catch (error) {
      console.error('❌ Error revoking role:', error);
      toast.error('Failed to revoke role: ' + error.message);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (loading) {
    return (
      <div className="role-requests-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading role requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-requests-container">
      <div className="role-requests-header">
        <h2>Role Upgrade Requests</h2>
        <p>Review and manage user role upgrade requests</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card neu-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>⏳</div>
          <div className="stat-details">
            <p className="stat-label">Pending</p>
            <h3 className="stat-value">{stats.pending}</h3>
          </div>
        </div>
        <div className="stat-card neu-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>✓</div>
          <div className="stat-details">
            <p className="stat-label">Approved</p>
            <h3 className="stat-value">{stats.approved}</h3>
          </div>
        </div>
        <div className="stat-card neu-card">
          <div className="stat-icon" style={{ background: '#ef4444' }}>✗</div>
          <div className="stat-details">
            <p className="stat-label">Rejected</p>
            <h3 className="stat-value">{stats.rejected}</h3>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs neu-card">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({requests.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button 
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({stats.approved})
        </button>
        <button 
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Requests Table */}
      <div className="requests-table-container neu-card">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <p>No {filter !== 'all' ? filter : ''} requests found</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Requested Role</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {request.userId?.profile?.avatar ? (
                          <img src={request.userId.profile.avatar} alt="User" />
                        ) : (
                          request.userId?.profile?.firstName?.charAt(0) || 
                          request.userId?.email?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <span>
                        {request.userId?.profile?.firstName && request.userId?.profile?.lastName
                          ? `${request.userId.profile.firstName} ${request.userId.profile.lastName}`
                          : request.userId?.email || 'Unknown User'}
                      </span>
                    </div>
                  </td>
                  <td>{request.userId?.email || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeColor(request.requestedRole)}`}>
                      {getRoleDisplayName(request.requestedRole)}
                    </span>
                  </td>
                  <td>
                    <div className="reason-cell" title={request.reason || 'No reason provided'}>
                      {request.reason ? (
                        <span className="reason-text">
                          {request.reason.length > 50 
                            ? `${request.reason.substring(0, 50)}...` 
                            : request.reason}
                        </span>
                      ) : (
                        <span className="no-reason">No reason provided</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="neu-btn-info"
                        onClick={() => handleViewDetails(request)}
                        title="View Full Details"
                      >
                        👁 View Details
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button 
                            className="neu-btn-success"
                            onClick={() => handleReviewRequest(request._id, 'approved')}
                            title="Approve Request"
                          >
                            ✓ Approve
                          </button>
                          <button 
                            className="neu-btn-danger"
                            onClick={() => handleReviewRequest(request._id, 'rejected')}
                            title="Reject Request"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <button 
                          className="neu-btn-warning"
                          onClick={() => handleRevokeRole(request)}
                          title="Revoke Editor Role"
                        >
                          🚫 Revoke Role
                        </button>
                      )}
                      <button 
                        className="neu-btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(request);
                        }}
                        title="Delete Request"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    {request.status !== 'pending' && (
                      <span className="reviewed-text">
                        {request.status === 'approved' ? 'Approved' : 'Rejected'}
                        {request.reviewedAt && ` on ${new Date(request.reviewedAt).toLocaleDateString()}`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="details-modal-overlay" onClick={handleCloseModal}>
          <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>Role Request Details</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="details-modal-body">
              <div className="detail-section">
                <h3>User Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    {selectedRequest.userId?.profile?.firstName && selectedRequest.userId?.profile?.lastName
                      ? `${selectedRequest.userId.profile.firstName} ${selectedRequest.userId.profile.lastName}`
                      : selectedRequest.userId?.email || 'Unknown User'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedRequest.userId?.email || 'N/A'}</span>
                </div>
                {selectedRequest.userId?.profile?.organization && (
                  <div className="detail-row">
                    <span className="detail-label">Organization:</span>
                    <span className="detail-value">{selectedRequest.userId.profile.organization}</span>
                  </div>
                )}
                {selectedRequest.userId?.profile?.position && (
                  <div className="detail-row">
                    <span className="detail-label">Position:</span>
                    <span className="detail-value">{selectedRequest.userId.profile.position}</span>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Request Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Requested Role:</span>
                  <span className={`role-badge ${getRoleBadgeColor(selectedRequest.requestedRole)}`}>
                    {getRoleDisplayName(selectedRequest.requestedRole)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Request Date:</span>
                  <span className="detail-value">
                    {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${getStatusBadgeColor(selectedRequest.status)}`}>
                    {selectedRequest.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Why User Wants This Role</h3>
                <div className="reason-box">
                  {selectedRequest.reason && selectedRequest.reason.trim() ? (
                    selectedRequest.reason
                  ) : (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                      No reason provided (This request was submitted before the reason field was required)
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.status !== 'pending' && selectedRequest.reviewedAt && (
                <div className="detail-section">
                  <h3>Review Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Reviewed On:</span>
                    <span className="detail-value">
                      {new Date(selectedRequest.reviewedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div className="detail-row">
                      <span className="detail-label">Admin Notes:</span>
                      <span className="detail-value">{selectedRequest.adminNotes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="details-modal-footer">
              {selectedRequest.status === 'pending' ? (
                <>
                  <button className="modal-btn-reject" onClick={handleRejectFromModal}>
                    ✗ Reject Request
                  </button>
                  <button className="modal-btn-approve" onClick={handleApproveFromModal}>
                    ✓ Approve Request
                  </button>
                </>
              ) : selectedRequest.status === 'approved' ? (
                <>
                  <button className="modal-btn-close" onClick={handleCloseModal}>
                    Close
                  </button>
                  <button className="modal-btn-revoke" onClick={() => {
                    handleRevokeRole(selectedRequest);
                    handleCloseModal();
                  }}>
                    🚫 Revoke Editor Role
                  </button>
                </>
              ) : (
                <button className="modal-btn-close" onClick={handleCloseModal}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .role-requests-container {
          padding: 20px;
        }

        .role-requests-header {
          margin-bottom: 30px;
        }

        .role-requests-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .role-requests-header p {
          color: #64748b;
          font-size: 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        }

        .stat-details {
          flex: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .filter-tab {
          padding: 10px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #64748b;
          transition: all 0.3s;
        }

        .filter-tab:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .filter-tab.active {
          background: #8b5cf6;
          color: white;
        }

        .requests-table-container {
          padding: 0;
          overflow-x: auto;
        }

        .requests-table {
          width: 100%;
          border-collapse: collapse;
        }

        .requests-table th,
        .requests-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .requests-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .role-badge,
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          display: inline-block;
        }

        .bg-purple-500 { background: #8b5cf6; }
        .bg-teal-500 { background: #14b8a6; }
        .bg-blue-500 { background: #3b82f6; }
        .bg-yellow-500 { background: #f59e0b; }
        .bg-green-500 { background: #10b981; }
        .bg-red-500 { background: #ef4444; }
        .bg-gray-500 { background: #6b7280; }

        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .neu-btn-success,
        .neu-btn-danger,
        .neu-btn-info,
        .neu-btn-warning {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }

        .neu-btn-success {
          background: #10b981;
          color: white;
        }

        .neu-btn-success:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .neu-btn-danger {
          background: #ef4444;
          color: white;
        }

        .neu-btn-danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .neu-btn-info {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          background: #3b82f6;
          color: white;
        }

        .neu-btn-info:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .neu-btn-warning {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          background: #f59e0b;
          color: white;
        }

        .neu-btn-warning:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .reviewed-text {
          color: #64748b;
          font-size: 13px;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          gap: 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .reason-cell {
          max-width: 250px;
        }

        .reason-text {
          display: block;
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: help;
        }

        .no-reason {
          color: #94a3b8;
          font-style: italic;
          font-size: 13px;
        }

        /* Details Modal Styles */
        .details-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .details-modal-content {
          background: white;
          border-radius: 16px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .details-modal-header {
          padding: 24px 30px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px 16px 0 0;
        }

        .details-modal-header h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 28px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .details-modal-body {
          padding: 30px;
        }

        .detail-section {
          margin-bottom: 28px;
        }

        .detail-section:last-child {
          margin-bottom: 0;
        }

        .detail-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }

        .detail-row {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 600;
          color: #6b7280;
          min-width: 150px;
          font-size: 14px;
        }

        .detail-value {
          color: #1f2937;
          font-size: 14px;
          flex: 1;
        }

        .reason-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          color: #374151;
          font-size: 14px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-wrap: break-word;
          min-height: 100px;
        }

        .details-modal-footer {
          padding: 20px 30px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          background: #f9fafb;
          border-radius: 0 0 16px 16px;
        }

        .modal-btn-approve,
        .modal-btn-reject,
        .modal-btn-close {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-btn-approve {
          background: #10b981;
          color: white;
        }

        .modal-btn-approve:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .modal-btn-reject {
          background: #ef4444;
          color: white;
        }

        .modal-btn-reject:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .modal-btn-close {
          background: #6b7280;
          color: white;
        }

        .modal-btn-close:hover {
          background: #4b5563;
          transform: translateY(-2px);
        }

        .modal-btn-revoke {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f59e0b;
          color: white;
        }

        .modal-btn-revoke:hover {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        @media (max-width: 768px) {
          .details-modal-content {
            max-width: 95%;
            margin: 10px;
          }

          .details-modal-header,
          .details-modal-body,
          .details-modal-footer {
            padding: 20px;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .detail-label {
            min-width: auto;
          }

          .details-modal-footer {
            flex-direction: column;
          }

          .modal-btn-approve,
          .modal-btn-reject,
          .modal-btn-close {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default RoleRequestManagement;
