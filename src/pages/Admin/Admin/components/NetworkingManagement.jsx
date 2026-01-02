import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
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

  return (
    <div>
      <div className="neu-card">
        <div className="section-header">
          <h2 className="section-title">🤝 Networking Arena Management</h2>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            className={`neu-btn ${activeTab === 'connections' ? 'neu-btn-primary' : ''}`}
            onClick={() => {
              setActiveTab('connections')
              setCurrentPage(1)
            }}
          >
            Connections
          </button>
          <button
            className={`neu-btn ${activeTab === 'groups' ? 'neu-btn-primary' : ''}`}
            onClick={() => {
              setActiveTab('groups')
              setCurrentPage(1)
            }}
          >
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
    </div>
  )
}

export default NetworkingManagement
