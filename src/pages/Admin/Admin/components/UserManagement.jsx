import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import * as adminService from '../../../../services/api/admin'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [currentPage, filterRole, filterStatus, searchTerm])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllUsers({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        role: filterRole,
        status: filterStatus
      })
      setUsers(response.data.users)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (userId, status) => {
    try {
      await adminService.updateUserStatus(userId, status)
      toast.success('User status updated successfully')
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user status')
      console.error(error)
    }
  }

  const handleUpdateRole = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role)
      toast.success('User role updated successfully')
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user role')
      console.error(error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await adminService.deleteUser(userId)
      toast.success('User deleted successfully')
      loadUsers()
    } catch (error) {
      toast.error('Failed to delete user')
      console.error(error)
    }
  }

  const openUserModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setShowModal(false)
  }

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">👥 User Management</h2>
        </div>

        {/* Search and Filters */}
        <div className="search-bar">
          <input
            type="text"
            className="neu-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value)
              setCurrentPage(1)
            }}
            style={{ width: '180px' }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="premium">Premium</option>
          </select>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{ width: '180px' }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="neu-table-wrapper">
            <table className="neu-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--neu-primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {user.profile?.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {user.profile?.firstName || 'User'} {user.profile?.lastName || ''}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--neu-text-muted)' }}>
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="neu-badge"
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="premium">Premium</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className={`neu-badge ${
                          user.status === 'active' ? 'success' :
                          user.status === 'suspended' ? 'danger' :
                          user.status === 'pending' ? 'warning' : 'info'
                        }`}
                        value={user.status}
                        onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="neu-btn action-btn"
                          onClick={() => openUserModal(user)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className="neu-btn-danger action-btn"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete User"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="neu-btn pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ◀
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`neu-btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="neu-btn pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="neu-modal-overlay" onClick={closeModal}>
          <div className="neu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">👤 User Details</h3>
              <button className="neu-btn modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Name</div>
                <div>{selectedUser.profile?.firstName || 'N/A'} {selectedUser.profile?.lastName || ''}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Email</div>
                <div>{selectedUser.email}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Phone</div>
                <div>{selectedUser.profile?.phone || 'N/A'}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Location</div>
                <div>{selectedUser.profile?.location || 'N/A'}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Organization</div>
                <div>{selectedUser.profile?.organization || 'N/A'}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Position</div>
                <div>{selectedUser.profile?.position || 'N/A'}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Bio</div>
                <div>{selectedUser.profile?.bio || 'No bio provided'}</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Member Since</div>
                <div>{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Last Login</div>
                <div>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="neu-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
