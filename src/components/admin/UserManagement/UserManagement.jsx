import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { adminAPI } from '../../../services/api/admin';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  UserX,
  Shield,
  Download,
  Plus,
  Eye
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import Modal from '../../common/Modal/Modal';

/**
 * User Management Component
 * Admin interface for managing platform users, roles, and permissions
 */
const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    verification: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // API hooks
  const [fetchUsersApi] = useApi(adminAPI.getUsers);
  const [updateUserApi] = useApi(adminAPI.updateUser);
  const [deleteUserApi] = useApi(adminAPI.deleteUser);

  /**
   * Load users on component mount
   */
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Filter users when search term or filters change
   */
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await fetchUsersApi();

      if (usersData) {
        setUsers(usersData);
      }
    } catch (error) {
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.uniqueCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Apply verification filter
    if (filters.verification) {
      filtered = filtered.filter(user => 
        filters.verification === 'verified' ? user.isVerified : !user.isVerified
      );
    }

    setFilteredUsers(filtered);
  };

  /**
   * Handle user role update
   */
  const handleRoleUpdate = async (userId, newRole) => {
    if (!currentUser || currentUser.role !== 'master_admin') {
      showNotification('Only master admins can update user roles', 'error');
      return;
    }

    setActionLoading(true);

    try {
      const updatedUser = await updateUserApi(userId, { role: newRole });

      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ));
        showNotification(`User role updated to ${newRole}`, 'success');
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle user status toggle
   */
  const handleStatusToggle = async (userId, currentStatus) => {
    setActionLoading(true);

    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const updatedUser = await updateUserApi(userId, { status: newStatus });

      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ));
        showNotification(`User ${newStatus}`, 'success');
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle user deletion
   */
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);

    try {
      const result = await deleteUserApi(selectedUser.id);

      if (result) {
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        showNotification('User deleted successfully', 'success');
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle user verification
   */
  const handleVerificationToggle = async (userId, isCurrentlyVerified) => {
    setActionLoading(true);

    try {
      const updatedUser = await updateUserApi(userId, { 
        isVerified: !isCurrentlyVerified 
      });

      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ));
        showNotification(
          `User ${!isCurrentlyVerified ? 'verified' : 'unverified'}`,
          'success'
        );
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Export users data
   */
  const handleExportUsers = () => {
    // In a real app, this would generate and download a CSV/Excel file
    showNotification('Export feature coming soon', 'info');
  };

  /**
   * Get role badge color
   */
  const getRoleBadge = (role) => {
    const roles = {
      master_admin: { label: 'Master Admin', color: 'danger' },
      admin: { label: 'Admin', color: 'warning' },
      moderator: { label: 'Moderator', color: 'info' },
      editor: { label: 'Editor', color: 'primary' },
      instructor: { label: 'Instructor', color: 'success' },
      recruiter: { label: 'Recruiter', color: 'secondary' },
      user: { label: 'User', color: 'default' }
    };
    return roles[role] || { label: role, color: 'default' };
  };

  /**
   * Get status badge color
   */
  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: 'Active', color: 'success' },
      suspended: { label: 'Suspended', color: 'danger' },
      pending: { label: 'Pending', color: 'warning' }
    };
    return statuses[status] || { label: status, color: 'default' };
  };

  /**
   * Render user row
   */
  const renderUserRow = (user) => {
    const roleBadge = getRoleBadge(user.role);
    const statusBadge = getStatusBadge(user.status);
    const canEdit = currentUser?.role === 'master_admin' || 
                   (currentUser?.role === 'admin' && user.role !== 'master_admin');

    return (
      <tr key={user.id} className="user-row">
        <td>
          <div className="user-info">
            <div className="user-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-code">{user.uniqueCode}</div>
            </div>
          </div>
        </td>
        <td>
          <span className={`badge badge-${roleBadge.color}`}>
            {roleBadge.label}
          </span>
        </td>
        <td>
          <span className={`badge badge-${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </td>
        <td>
          <div className="verification-status">
            {user.isVerified ? (
              <span className="verified">
                <UserCheck size={16} />
                Verified
              </span>
            ) : (
              <span className="not-verified">
                <UserX size={16} />
                Not Verified
              </span>
            )}
          </div>
        </td>
        <td>
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td>
          <div className="user-actions">
            <button
              className="icon-button"
              onClick={() => {
                setSelectedUser(user);
                setShowUserModal(true);
              }}
              title="View Details"
            >
              <Eye size={16} />
            </button>

            {canEdit && (
              <>
                <button
                  className="icon-button"
                  onClick={() => handleVerificationToggle(user.id, user.isVerified)}
                  disabled={actionLoading}
                  title={user.isVerified ? 'Unverify User' : 'Verify User'}
                >
                  <Shield size={16} />
                </button>

                <button
                  className="icon-button"
                  onClick={() => handleStatusToggle(user.id, user.status)}
                  disabled={actionLoading}
                  title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                >
                  {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                </button>

                {currentUser?.role === 'master_admin' && (
                  <button
                    className="icon-button"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    disabled={actionLoading}
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  /**
   * Render role selector
   */
  const renderRoleSelector = (user) => {
    if (currentUser?.role !== 'master_admin') return null;

    const roles = [
      'user',
      'recruiter',
      'instructor',
      'editor',
      'moderator',
      'admin'
    ];

    return (
      <select
        value={user.role}
        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
        className="role-select"
        disabled={actionLoading}
      >
        {roles.map(role => (
          <option key={role} value={role}>
            {getRoleBadge(role).label}
          </option>
        ))}
      </select>
    );
  };

  /**
   * Render search and filters
   */
  const renderSearchAndFilters = () => (
    <div className="users-header">
      <div className="search-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users by name, email, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="recruiter">Recruiter</option>
            <option value="instructor">Instructor</option>
            <option value="editor">Editor</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filters.verification}
            onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Verification</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
        </div>
      </div>

      <div className="actions">
        <button 
          className="btn btn-outline"
          onClick={handleExportUsers}
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );

  /**
   * Render users table
   */
  const renderUsersTable = () => {
    if (loading) {
      return (
        <div className="users-loading">
          <Loader size="lg" text="Loading users..." />
        </div>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="no-users-found">
          <div className="no-users-icon">
            <UserX size={48} />
          </div>
          <h3>No users found</h3>
          <p>
            {searchTerm || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters.'
              : 'No users registered yet.'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verification</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(renderUserRow)}
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Render user details modal
   */
  const renderUserModal = () => {
    if (!selectedUser) return null;

    return (
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        <div className="user-details-modal">
          <div className="user-header">
            <div className="user-avatar large">
              {selectedUser.profilePicture ? (
                <img src={selectedUser.profilePicture} alt={selectedUser.name} />
              ) : (
                <div className="avatar-placeholder large">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.email}</p>
              <div className="user-meta">
                <span className="user-code">{selectedUser.uniqueCode}</span>
                <span className={`badge badge-${getRoleBadge(selectedUser.role).color}`}>
                  {getRoleBadge(selectedUser.role).label}
                </span>
                <span className={`badge badge-${getStatusBadge(selectedUser.status).color}`}>
                  {getStatusBadge(selectedUser.status).label}
                </span>
              </div>
            </div>
          </div>

          <div className="user-details-grid">
            <div className="detail-group">
              <label>Registration Date</label>
              <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="detail-group">
              <label>Last Active</label>
              <p>{selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : 'Never'}</p>
            </div>
            <div className="detail-group">
              <label>Email Verified</label>
              <p>{selectedUser.isEmailVerified ? 'Yes' : 'No'}</p>
            </div>
            <div className="detail-group">
              <label>Profile Complete</label>
              <p>{selectedUser.profileCompletion || 0}%</p>
            </div>
          </div>

          {currentUser?.role === 'master_admin' && (
            <div className="admin-actions">
              <h4>Admin Actions</h4>
              <div className="action-buttons">
                {renderRoleSelector(selectedUser)}
                <button
                  className={`btn ${selectedUser.isVerified ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => handleVerificationToggle(selectedUser.id, selectedUser.isVerified)}
                  disabled={actionLoading}
                >
                  {selectedUser.isVerified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  className={`btn ${selectedUser.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => handleStatusToggle(selectedUser.id, selectedUser.status)}
                  disabled={actionLoading}
                >
                  {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowUserModal(false);
                    setShowDeleteModal(true);
                  }}
                  disabled={actionLoading}
                >
                  Delete User
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage platform users, roles, and permissions</p>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(u => u.role !== 'user').length}
          </div>
          <div className="stat-label">Staff Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(u => u.isVerified).length}
          </div>
          <div className="stat-label">Verified Users</div>
        </div>
      </div>

      {/* Search and Filters */}
      {renderSearchAndFilters()}

      {/* Users Table */}
      {renderUsersTable()}

      {/* User Details Modal */}
      {renderUserModal()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="sm"
      >
        <div className="delete-modal">
          <p>
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
            This action cannot be undone and will permanently remove all user data.
          </p>
          <div className="modal-actions">
            <button
              className="btn btn-danger"
              onClick={handleDeleteUser}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Delete User'}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;