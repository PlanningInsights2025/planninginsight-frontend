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

  const getRoleBadgeStyle = (role) => {
    const map = {
      editor:      { bg: 'rgba(139,92,246,0.15)',  color: '#c4b5fd', border: 'rgba(139,92,246,0.35)' },
      chiefeditor: { bg: 'rgba(79,70,229,0.15)',   color: '#818cf8', border: 'rgba(79,70,229,0.35)'  },
      instructor:  { bg: 'rgba(20,184,166,0.15)',  color: '#5eead4', border: 'rgba(20,184,166,0.35)' },
      recruiter:   { bg: 'rgba(59,130,246,0.15)',  color: '#93c5fd', border: 'rgba(59,130,246,0.35)' },
    };
    const c = map[role] || { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: 'rgba(107,114,128,0.35)' };
    return { background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block', whiteSpace: 'nowrap' };
  };

  const getStatusBadgeStyle = (status) => {
    const map = {
      pending:  { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', border: 'rgba(245,158,11,0.35)'  },
      approved: { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', border: 'rgba(16,185,129,0.35)'  },
      rejected: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.35)'   },
    };
    const c = map[status] || { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: 'rgba(107,114,128,0.35)' };
    return { background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block', whiteSpace: 'nowrap' };
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
      <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#94a3b8' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 0.9s linear infinite' }} />
        <p style={{ fontSize: '14px', fontWeight: '500' }}>Loading role requests…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#0f172a', minHeight: '100vh', fontFamily: 'inherit' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Header Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', borderRadius: '20px', padding: '36px 40px 32px', marginBottom: '28px', boxShadow: '0 10px 40px rgba(79,70,229,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', position: 'relative' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Role Upgrade Requests</h2>
            <p style={{ margin: '8px 0 0', fontSize: '15px', color: 'rgba(255,255,255,0.82)', fontWeight: '500' }}>Review and manage user role upgrade requests</p>
          </div>

          {/* Stats inside banner */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {/* Total */}
            <div style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: '14px', padding: '14px 20px', minWidth: '90px', textAlign: 'center', backdropFilter: 'blur(6px)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>{requests.length}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
            </div>
            {/* Pending */}
            <div style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '14px', padding: '14px 20px', minWidth: '90px', textAlign: 'center', backdropFilter: 'blur(6px)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>{stats.pending}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</div>
            </div>
            {/* Approved */}
            <div style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '14px', padding: '14px 20px', minWidth: '90px', textAlign: 'center', backdropFilter: 'blur(6px)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>{stats.approved}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approved</div>
            </div>
            {/* Rejected */}
            <div style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '14px', padding: '14px 20px', minWidth: '90px', textAlign: 'center', backdropFilter: 'blur(6px)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>{stats.rejected}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rejected</div>
            </div>
          </div>
        </div>
      </div>


      {/* ── Filter Tabs ── */}
      <div style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '14px', padding: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { key: 'all',      label: `All (${requests.length})`    },
          { key: 'pending',  label: `Pending (${stats.pending})`  },
          { key: 'approved', label: `Approved (${stats.approved})` },
          { key: 'rejected', label: `Rejected (${stats.rejected})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s',
              background: filter === tab.key ? 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)' : 'transparent',
              color: filter === tab.key ? '#ffffff' : '#94a3b8',
              boxShadow: filter === tab.key ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Requests Table ── */}
      <div style={{ background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
        {filteredRequests.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>📋</div>
            <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '500', margin: 0 }}>No {filter !== 'all' ? filter : ''} requests found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                  {['User', 'Email', 'Requested Role', 'Reason', 'Status', 'Requested Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(99,102,241,0.15)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, idx) => (
                  <tr key={request._id} style={{ borderBottom: '1px solid rgba(99,102,241,0.10)', background: idx % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.03)', transition: 'background 0.15s' }}>
                    {/* User */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0, overflow: 'hidden' }}>
                          {request.userId?.profile?.avatar
                            ? <img src={request.userId.profile.avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (request.userId?.profile?.firstName?.charAt(0) || request.userId?.email?.charAt(0)?.toUpperCase() || 'U')}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                          {request.userId?.profile?.firstName && request.userId?.profile?.lastName
                            ? `${request.userId.profile.firstName} ${request.userId.profile.lastName}`
                            : request.userId?.email || 'Unknown User'}
                        </span>
                      </div>
                    </td>
                    {/* Email */}
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8' }}>{request.userId?.email || 'N/A'}</td>
                    {/* Role */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={getRoleBadgeStyle(request.requestedRole)}>{getRoleDisplayName(request.requestedRole)}</span>
                    </td>
                    {/* Reason */}
                    <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                      {request.reason
                        ? <span title={request.reason} style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'help' }}>
                            {request.reason.length > 50 ? `${request.reason.substring(0, 50)}…` : request.reason}
                          </span>
                        : <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No reason provided</span>}
                    </td>
                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={getStatusBadgeStyle(request.status)}>{request.status.toUpperCase()}</span>
                    </td>
                    {/* Date */}
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                          onClick={() => handleViewDetails(request)}
                          title="View Full Details"
                          style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >👁 View</button>
                        {request.status === 'pending' && (<>
                          <button
                            onClick={() => handleReviewRequest(request._id, 'approved')}
                            title="Approve Request"
                            style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >✓ Approve</button>
                          <button
                            onClick={() => handleReviewRequest(request._id, 'rejected')}
                            title="Reject Request"
                            style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >✗ Reject</button>
                        </>)}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleRevokeRole(request)}
                            title="Revoke Role"
                            style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >🚫 Revoke</button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteRequest(request); }}
                          title="Delete Request"
                          style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.12)', color: '#f87171', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >🗑️</button>
                      </div>
                      {request.status !== 'pending' && request.reviewedAt && (
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                          {request.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(request.reviewedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Details Modal ── */}
      {showDetailsModal && selectedRequest && (
        <div
          onClick={handleCloseModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '18px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          >
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', padding: '24px 28px', borderRadius: '18px 18px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>Role Request Details</h2>
              <button
                onClick={handleCloseModal}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', fontSize: '22px', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              {/* User Info */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(99,102,241,0.18)' }}>User Information</h3>
                {[
                  { label: 'Name', value: selectedRequest.userId?.profile?.firstName && selectedRequest.userId?.profile?.lastName ? `${selectedRequest.userId.profile.firstName} ${selectedRequest.userId.profile.lastName}` : selectedRequest.userId?.email || 'Unknown User' },
                  { label: 'Email', value: selectedRequest.userId?.email || 'N/A' },
                  ...(selectedRequest.userId?.profile?.organization ? [{ label: 'Organization', value: selectedRequest.userId.profile.organization }] : []),
                  ...(selectedRequest.userId?.profile?.position ? [{ label: 'Position', value: selectedRequest.userId.profile.position }] : []),
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ minWidth: '130px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{row.label}</span>
                    <span style={{ fontSize: '14px', color: '#e2e8f0', flex: 1 }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Request Info */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(99,102,241,0.18)' }}>Request Information</h3>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ minWidth: '130px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Requested Role</span>
                  <span style={getRoleBadgeStyle(selectedRequest.requestedRole)}>{getRoleDisplayName(selectedRequest.requestedRole)}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ minWidth: '130px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Request Date</span>
                  <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{new Date(selectedRequest.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0' }}>
                  <span style={{ minWidth: '130px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Status</span>
                  <span style={getStatusBadgeStyle(selectedRequest.status)}>{selectedRequest.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(99,102,241,0.18)' }}>Why User Wants This Role</h3>
                <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '12px', padding: '18px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '90px' }}>
                  {selectedRequest.reason && selectedRequest.reason.trim()
                    ? selectedRequest.reason
                    : <span style={{ color: '#64748b', fontStyle: 'italic' }}>No reason provided (submitted before the reason field was required)</span>}
                </div>
              </div>

              {/* Review Info */}
              {selectedRequest.status !== 'pending' && selectedRequest.reviewedAt && (
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(99,102,241,0.18)' }}>Review Information</h3>
                  <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ minWidth: '130px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Reviewed On</span>
                    <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{new Date(selectedRequest.reviewedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div style={{ display: 'flex', gap: '16px', padding: '10px 0' }}>
                      <span style={{ minWidth: '130px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Admin Notes</span>
                      <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{selectedRequest.adminNotes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '18px 28px', borderTop: '1px solid rgba(99,102,241,0.18)', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {selectedRequest.status === 'pending' ? (<>
                <button onClick={handleRejectFromModal} style={{ padding: '11px 22px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>✗ Reject Request</button>
                <button onClick={handleApproveFromModal} style={{ padding: '11px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>✓ Approve Request</button>
              </>) : selectedRequest.status === 'approved' ? (<>
                <button onClick={handleCloseModal} style={{ padding: '11px 22px', borderRadius: '10px', border: '1px solid rgba(100,116,139,0.3)', background: 'rgba(100,116,139,0.15)', color: '#94a3b8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
                <button onClick={() => { handleRevokeRole(selectedRequest); handleCloseModal(); }} style={{ padding: '11px 22px', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>🚫 Revoke Role</button>
              </>) : (
                <button onClick={handleCloseModal} style={{ padding: '11px 22px', borderRadius: '10px', border: '1px solid rgba(100,116,139,0.3)', background: 'rgba(100,116,139,0.15)', color: '#94a3b8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleRequestManagement;
