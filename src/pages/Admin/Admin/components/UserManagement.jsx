import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Users, Search, Filter, UserCheck, UserX, Eye, Trash2, Shield, Crown, User as UserIcon } from 'lucide-react'
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

  const getStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      pending: users.filter(u => u.status === 'pending').length
    }
  }

  const stats = getStats()

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
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
              User Management
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Manage user accounts, roles, and permissions
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
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total Users</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Active Users</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.active}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Suspended</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.suspended}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Pending</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.pending}</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
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
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value)
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
            <option value="">All Roles</option>
            <option value="user">👤 User</option>
            <option value="admin">🛡️ Admin</option>
            <option value="moderator">⚡ Moderator</option>
            <option value="premium">👑 Premium</option>
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
            <option value="active">✓ Active</option>
            <option value="inactive">○ Inactive</option>
            <option value="suspended">✗ Suspended</option>
            <option value="pending">⏳ Pending</option>
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
          {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Users Table/Cards */}
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
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading users...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Users size={48} color="#3b82f6" />
          <p style={{ fontSize: '18px', fontWeight: '600', marginTop: '16px' }}>No users found</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Joined</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ background: '#f9fafb', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f9fafb'}>
                  <td style={{ padding: '16px', borderRadius: '8px 0 0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                          {user.profile?.firstName || 'User'} {user.profile?.lastName || ''}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        background: user.role === 'admin' ? '#fee2e2' : user.role === 'premium' ? '#fef3c7' : '#f3f4f6',
                        color: user.role === 'admin' ? '#991b1b' : user.role === 'premium' ? '#92400e' : '#374151'
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={user.status}
                      onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        background: user.status === 'active' ? '#d1fae5' : 
                                   user.status === 'suspended' ? '#fee2e2' : 
                                   user.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                        color: user.status === 'active' ? '#065f46' : 
                               user.status === 'suspended' ? '#991b1b' : 
                               user.status === 'pending' ? '#92400e' : '#6b7280'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openUserModal(user)}
                        style={{
                          padding: '8px',
                          background: '#dbeafe',
                          color: '#1e40af',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        style={{
                          padding: '8px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={16} />
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
                background: currentPage === i + 1 ? '#3b82f6' : 'white',
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
      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div onClick={closeModal} style={{
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
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '24px', fontWeight: '700' }}>
                <UserIcon size={28} color="#3b82f6" />
                User Details
              </h3>
              <button onClick={closeModal} style={{
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
              }}>
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Name</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.profile?.firstName || 'N/A'} {selectedUser.profile?.lastName || ''}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Phone</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.profile?.phone || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Location</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.profile?.location || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Organization</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.profile?.organization || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Position</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.profile?.position || 'N/A'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bio</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.profile?.bio || 'No bio provided'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Member Since</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Last Login</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={closeModal} style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
