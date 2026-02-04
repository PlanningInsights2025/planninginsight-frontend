import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  FileText, 
  BookOpen, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Download,
  MessageSquare,
  User,
  Calendar,
  TrendingUp,
  BarChart3,
  Users,
  UserPlus,
  Send,
  RefreshCw
} from 'lucide-react';
import './EditorDashboard.css';

const EditorDashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const isChiefEditor = user?.role === 'chiefeditor';
  
  const [activeTab, setActiveTab] = useState('manuscripts');
  const [manuscripts, setManuscripts] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [editors, setEditors] = useState([]);
  const [stats, setStats] = useState({
    manuscripts: { total: 0, pending: 0, 'under-review': 0, accepted: 0, rejected: 0 },
    researchPapers: { total: 0, pending: 0, 'under-review': 0, accepted: 0, rejected: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewComments, setReviewComments] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoAssigning, setAutoAssigning] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    if (isChiefEditor) {
      fetchEditors();
    }
  }, [activeTab, filterStatus, isChiefEditor]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      if (isChiefEditor) {
        // Chief editor sees all submissions
        const response = await fetch(`${baseURL}/chief-editor/all-submissions?status=${filterStatus !== 'all' ? filterStatus : ''}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setManuscripts(data.data.manuscripts || []);
          setResearchPapers(data.data.researchPapers || []);
          
          // Calculate stats from the data
          const manuscriptStats = {
            total: data.data.manuscripts.length,
            pending: data.data.manuscripts.filter(m => m.status === 'pending').length,
            'under-review': data.data.manuscripts.filter(m => m.status === 'under-review').length,
            accepted: data.data.manuscripts.filter(m => m.status === 'accepted').length,
            rejected: data.data.manuscripts.filter(m => m.status === 'rejected').length
          };
          
          const paperStats = {
            total: data.data.researchPapers.length,
            pending: data.data.researchPapers.filter(p => p.status === 'pending').length,
            'under-review': data.data.researchPapers.filter(p => p.status === 'under-review').length,
            accepted: data.data.researchPapers.filter(p => p.status === 'accepted').length,
            rejected: data.data.researchPapers.filter(p => p.status === 'rejected').length
          };
          
          setStats({
            manuscripts: manuscriptStats,
            researchPapers: paperStats
          });
        }
      } else {
        // Regular editor sees only assigned submissions
        const statsResponse = await fetch(`${baseURL}/editor/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        }

        const endpoint = activeTab === 'manuscripts' ? 'manuscripts' : 'research-papers';
        const statusParam = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
        
        const response = await fetch(`${baseURL}/editor/${endpoint}${statusParam}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          if (activeTab === 'manuscripts') {
            setManuscripts(data.data.manuscripts || []);
          } else {
            setResearchPapers(data.data.papers || []);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEditors = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${baseURL}/chief-editor/editors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setEditors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching editors:', error);
    }
  };

  const handleAssign = (item) => {
    setSelectedItem(item);
    setSelectedEditor('');
    setShowAssignModal(true);
  };

  const handleReassign = (item) => {
    setSelectedItem(item);
    setSelectedEditor(item.assignedEditor?._id || '');
    setShowReassignModal(true);
  };

  const submitAssignment = async () => {
    if (!selectedEditor) {
      showNotification('Please select an editor', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const endpoint = activeTab === 'manuscripts' ? 'assign-manuscript' : 'assign-paper';
      
      const response = await fetch(
        `${baseURL}/chief-editor/${endpoint}/${selectedItem._id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ editorId: selectedEditor })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        showNotification('Assignment successful', 'success');
        setShowAssignModal(false);
        fetchDashboardData();
        if (isChiefEditor) fetchEditors();
      } else {
        showNotification(data.message || 'Failed to assign', 'error');
      }
    } catch (error) {
      console.error('Error assigning:', error);
      showNotification('Failed to assign', 'error');
    }
  };

  const submitReassignment = async () => {
    if (!selectedEditor) {
      showNotification('Please select an editor', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const endpoint = activeTab === 'manuscripts' ? 'reassign-manuscript' : 'reassign-paper';
      
      const response = await fetch(
        `${baseURL}/chief-editor/${endpoint}/${selectedItem._id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ editorId: selectedEditor })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        showNotification('Reassignment successful', 'success');
        setShowReassignModal(false);
        fetchDashboardData();
        if (isChiefEditor) fetchEditors();
      } else {
        showNotification(data.message || 'Failed to reassign', 'error');
      }
    } catch (error) {
      console.error('Error reassigning:', error);
      showNotification('Failed to reassign', 'error');
    }
  };

  const handleAutoAssign = async () => {
    if (!window.confirm('Auto-assign all unassigned submissions to available editors?\n\nDistribution: Submissions will be divided evenly among all editors.')) {
      return;
    }

    setAutoAssigning(true);
    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${baseURL}/chief-editor/auto-assign`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        const distributionMsg = data.data.distribution 
          ? `\n\n📊 Distribution: ${data.data.distribution}`
          : '';
        showNotification(data.message + distributionMsg, 'success');
        fetchDashboardData();
        if (isChiefEditor) fetchEditors();
      } else {
        showNotification(data.message || 'Failed to auto-assign', 'error');
      }
    } catch (error) {
      console.error('Error auto-assigning:', error);
      showNotification('Failed to auto-assign', 'error');
    } finally {
      setAutoAssigning(false);
    }
  };

  const handleReview = async (item) => {
    setSelectedItem(item);
    setReviewStatus(item.status || 'under-review');
    setReviewComments(item.adminRemarks || item.reviewComments || '');
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!reviewStatus) {
      showNotification('Please select a status', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const endpoint = activeTab === 'manuscripts' ? 'manuscripts' : 'research-papers';
      
      const response = await fetch(
        `${baseURL}/editor/${endpoint}/${selectedItem._id}/review`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: reviewStatus,
            reviewComments: reviewComments
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        showNotification('Review submitted successfully', 'success');
        setShowReviewModal(false);
        fetchDashboardData();
      } else {
        showNotification(data.message || 'Failed to submit review', 'error');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotification('Failed to submit review', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { color: '#f59e0b', icon: Clock, label: 'Pending' },
      'under-review': { color: '#3b82f6', icon: AlertCircle, label: 'Under Review' },
      'accepted': { color: '#10b981', icon: CheckCircle, label: 'Accepted' },
      'rejected': { color: '#ef4444', icon: XCircle, label: 'Rejected' }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '12px',
        background: `${badge.color}20`,
        color: badge.color,
        fontSize: '13px',
        fontWeight: '500'
      }}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const currentItems = activeTab === 'manuscripts' ? manuscripts : researchPapers;
  const currentStats = activeTab === 'manuscripts' ? stats.manuscripts : stats.researchPapers;

  const filteredItems = currentItems.filter(item => {
    if (searchTerm) {
      return item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="editor-dashboard">
      <div className="editor-header">
        <div>
          <h1>{isChiefEditor ? 'Chief Editor Dashboard' : 'Editor Dashboard'}</h1>
          <p>Review and manage manuscript and research paper submissions</p>
        </div>
        {isChiefEditor && (
          <button 
            className="auto-assign-button"
            onClick={handleAutoAssign}
            disabled={autoAssigning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#524393',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: autoAssigning ? 'not-allowed' : 'pointer',
              opacity: autoAssigning ? 0.6 : 1,
              fontWeight: '500'
            }}
          >
            <RefreshCw size={18} className={autoAssigning ? 'spinning' : ''} />
            {autoAssigning ? 'Auto-Assigning...' : 'Auto-Assign All'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-icon" style={{ background: '#3b82f620' }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-value">{currentStats.total}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: '#f59e0b20' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div>
            <div className="stat-value">{currentStats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-icon" style={{ background: '#3b82f620' }}>
            <AlertCircle size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-value">{currentStats['under-review']}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: '#10b98120' }}>
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div>
            <div className="stat-value">{currentStats.accepted}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="editor-tabs">
        <button
          className={`tab-button ${activeTab === 'manuscripts' ? 'active' : ''}`}
          onClick={() => setActiveTab('manuscripts')}
        >
          <FileText size={18} />
          Manuscripts
        </button>
        <button
          className={`tab-button ${activeTab === 'research-papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('research-papers')}
        >
          <BookOpen size={18} />
          Research Papers
        </button>
        {isChiefEditor && (
          <button
            className={`tab-button ${activeTab === 'editors' ? 'active' : ''}`}
            onClick={() => setActiveTab('editors')}
          >
            <Users size={18} />
            Editors ({editors.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Submissions List or Editors List */}
      {activeTab === 'editors' ? (
        <div className="editors-grid">
          {editors.length === 0 ? (
            <div className="empty-state">
              <Users size={48} color="#cbd5e1" />
              <p>No editors found</p>
            </div>
          ) : (
            editors.map(editor => (
              <div key={editor._id} className="editor-card">
                <div className="editor-avatar">
                  {editor.profile?.avatar ? (
                    <img src={editor.profile.avatar} alt={editor.profile?.firstName} />
                  ) : (
                    <User size={32} color="#524393" />
                  )}
                </div>
                <div className="editor-info">
                  <h3>{editor.profile?.firstName} {editor.profile?.lastName}</h3>
                  <p className="editor-email">{editor.email}</p>
                  <div className="editor-workload">
                    <div className="workload-item">
                      <FileText size={16} />
                      <span>{editor.workload?.manuscripts || 0} Manuscripts</span>
                    </div>
                    <div className="workload-item">
                      <BookOpen size={16} />
                      <span>{editor.workload?.papers || 0} Papers</span>
                    </div>
                    <div className="workload-total">
                      Total: {editor.workload?.total || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="submissions-list">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} color="#cbd5e1" />
            <p>No submissions found</p>
            {!isChiefEditor && (
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
                You will see submissions here once they are assigned to you by the Chief Editor.
              </p>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className="submission-card">
              <div className="submission-header">
                <div>
                  <h3>{item.title}</h3>
                  <div className="submission-meta">
                    <span>
                      <User size={14} />
                      {item.author?.name || 'Unknown'}
                    </span>
                    <span>
                      <Calendar size={14} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.requirementId && (
                      <span>
                        <FileText size={14} />
                        {item.requirementId.title}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {item.abstract && (
                <p className="submission-abstract">{item.abstract.substring(0, 200)}...</p>
              )}

              {item.adminRemarks && (
                <div className="review-comments">
                  <MessageSquare size={16} />
                  <span>{item.adminRemarks}</span>
                </div>
              )}

              <div className="submission-actions">
                {item.document?.url && (
                  <a 
                    href={item.document.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-button secondary"
                  >
                    <Download size={16} />
                    Download
                  </a>
                )}
                {isChiefEditor && !item.assignedEditor && (
                  <button
                    className="action-button assign"
                    onClick={() => handleAssign(item)}
                    style={{ background: '#524393', color: 'white' }}
                  >
                    <UserPlus size={16} />
                    Assign Editor
                  </button>
                )}
                {item.assignedEditor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                    <UserPlus size={14} />
                    <span>Assigned to: {item.assignedEditor.profile?.firstName} {item.assignedEditor.profile?.lastName}</span>
                    {isChiefEditor && (
                      <button
                        onClick={() => handleReassign(item)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RefreshCw size={12} />
                        Change
                      </button>
                    )}
                  </div>
                )}
                <button
                  className="action-button primary"
                  onClick={() => handleReview(item)}
                >
                  <Eye size={16} />
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign to Editor</h2>
              <button onClick={() => setShowAssignModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="review-info">
                <h3>{selectedItem.title}</h3>
                <p><strong>Type:</strong> {activeTab === 'manuscripts' ? 'Manuscript' : 'Research Paper'}</p>
                <p><strong>Status:</strong> {selectedItem.status}</p>
              </div>

              <div className="form-group">
                <label>Select Editor *</label>
                <select 
                  value={selectedEditor}
                  onChange={(e) => setSelectedEditor(e.target.value)}
                  required
                >
                  <option value="">Choose an editor...</option>
                  {editors.map(editor => (
                    <option key={editor._id} value={editor._id}>
                      {editor.profile?.firstName} {editor.profile?.lastName} ({editor.email}) - 
                      Workload: {editor.workload?.total || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#64748b' }}>
                <p><strong>Tip:</strong> Editors with lower workload are recommended for better distribution.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="button secondary"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button 
                className="button primary"
                onClick={submitAssignment}
                style={{ background: '#524393' }}
              >
                <Send size={16} />
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassignment Modal */}
      {showReassignModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowReassignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Editor Assignment</h2>
              <button onClick={() => setShowReassignModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="review-info">
                <h3>{selectedItem.title}</h3>
                <p><strong>Type:</strong> {activeTab === 'manuscripts' ? 'Manuscript' : 'Research Paper'}</p>
                <p><strong>Status:</strong> {selectedItem.status}</p>
                <p style={{ marginTop: '12px', padding: '8px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px' }}>
                  <strong>Currently assigned to:</strong> {selectedItem.assignedEditor?.profile?.firstName} {selectedItem.assignedEditor?.profile?.lastName}
                </p>
              </div>

              <div className="form-group">
                <label>Reassign to Different Editor *</label>
                <select 
                  value={selectedEditor}
                  onChange={(e) => setSelectedEditor(e.target.value)}
                  required
                >
                  <option value="">Choose an editor...</option>
                  {editors.map(editor => (
                    <option key={editor._id} value={editor._id}>
                      {editor.profile?.firstName} {editor.profile?.lastName} ({editor.email}) - 
                      Workload: {editor.workload?.total || 0}
                      {editor._id === selectedItem.assignedEditor?._id ? ' (Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#64748b' }}>
                <p><strong>Note:</strong> Changing the editor will update the workload immediately. The previous editor's workload will decrease by 1, and the new editor's workload will increase by 1.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="button secondary"
                onClick={() => setShowReassignModal(false)}
              >
                Cancel
              </button>
              <button 
                className="button primary"
                onClick={submitReassignment}
                style={{ background: '#f59e0b' }}
              >
                <RefreshCw size={16} />
                Change Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Submission</h2>
              <button onClick={() => setShowReviewModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="review-info">
                <h3>{selectedItem.title}</h3>
                <p><strong>Author:</strong> {selectedItem.author?.name}</p>
                <p><strong>Type:</strong> {selectedItem.type === 'research-paper' ? 'Research Paper' : 'Manuscript'}</p>
                {selectedItem.requirementId && (
                  <p><strong>Requirement:</strong> {selectedItem.requirementId.title}</p>
                )}
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select 
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="under-review">Under Review</option>
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>

              <div className="form-group">
                <label>Review Comments</label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Enter your review comments..."
                  rows={5}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="button secondary"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button 
                className="button primary"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorDashboard;
