import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Network, Users, Link2, Trash2, UserPlus, TrendingUp } from 'lucide-react'
import * as adminService from '../../../../services/api/admin'

const NetworkingManagement = () => {
  const [activeTab, setActiveTab] = useState('connections')
  const [connections, setConnections] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (activeTab === 'connections') {
      loadConnections()
    } else {
      loadGroups()
    }
  }, [activeTab, currentPage])

  const loadConnections = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllConnectionsAdmin({
        page: currentPage,
        limit: 20
      })
      setConnections(response.data.connections)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load connections')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadGroups = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllGroupsAdmin({
        page: currentPage,
        limit: 20
      })
      setGroups(response.data.groups)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      toast.error('Failed to load groups')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return
    try {
      await adminService.deleteGroup(groupId)
      toast.success('Group deleted successfully')
      loadGroups()
    } catch (error) {
      toast.error('Failed to delete group')
    }
  }

  const getStats = () => {
    if (activeTab === 'connections') {
      return {
        total: connections.length,
        active: connections.filter(c => c.status === 'accepted').length,
        pending: connections.filter(c => c.status === 'pending').length
      }
    } else {
      return {
        total: groups.length,
        active: groups.filter(g => g.isActive).length,
        members: groups.reduce((sum, g) => sum + (g.membersCount || 0), 0)
      }
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
            <Network size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Networking Arena Management
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
              Manage connections and professional groups
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
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>Total {activeTab === 'connections' ? 'Connections' : 'Groups'}</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>{activeTab === 'connections' ? 'Active' : 'Active Groups'}</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.active}</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>{activeTab === 'connections' ? 'Pending' : 'Total Members'}</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{activeTab === 'connections' ? stats.pending : stats.members}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '8px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            setActiveTab('connections')
            setCurrentPage(1)
          }}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'connections' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
            color: activeTab === 'connections' ? 'white' : '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Link2 size={18} />
          Connections
        </button>
        <button
          onClick={() => {
            setActiveTab('groups')
            setCurrentPage(1)
          }}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'groups' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
            color: activeTab === 'groups' ? 'white' : '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Users size={18} />
          Groups
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {activeTab === 'connections' ? (
              connections.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neu-text-muted)' }}>
                  No connections found
                </div>
              ) : (
                <div className="neu-table-wrapper">
                  <table className="neu-table">
                    <thead>
                      <tr>
                        <th>Requester</th>
                        <th>Recipient</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connections.map(conn => (
                        <tr key={conn._id}>
                          <td>{conn.requester?.profile?.firstName || 'Unknown'} {conn.requester?.profile?.lastName || ''}</td>
                          <td>{conn.recipient?.profile?.firstName || 'Unknown'} {conn.recipient?.profile?.lastName || ''}</td>
                          <td>
                            <span className="neu-badge">{conn.type}</span>
                          </td>
                          <td>
                            <span className={`neu-badge ${
                              conn.status === 'accepted' ? 'success' :
                              conn.status === 'pending' ? 'warning' :
                              conn.status === 'rejected' ? 'danger' : 'info'
                            }`}>
                              {conn.status}
                            </span>
                          </td>
                          <td>{new Date(conn.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              groups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neu-text-muted)' }}>
                  No groups found
                </div>
              ) : (
                <div className="neu-table-wrapper">
                  <table className="neu-table">
                    <thead>
                      <tr>
                        <th>Group Name</th>
                        <th>Creator</th>
                        <th>Members</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map(group => (
                        <tr key={group._id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>{group.name || 'Untitled Group'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--neu-text-muted)' }}>
                              {group.description?.slice(0, 50)}...
                            </div>
                          </td>
                          <td>{group.creator?.profile?.firstName || 'Unknown'}</td>
                          <td>{group.membersCount || 0}</td>
                          <td>{new Date(group.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="neu-btn-danger action-btn"
                                onClick={() => handleDeleteGroup(group._id)}
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
              )
            )}
          </>
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
  )
}

export default NetworkingManagement
