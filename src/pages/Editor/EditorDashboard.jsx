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
  BarChart3
} from 'lucide-react';
import './EditorDashboard.css';

const EditorDashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('manuscripts');
  const [manuscripts, setManuscripts] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [stats, setStats] = useState({
    manuscripts: { total: 0, pending: 0, 'under-review': 0, accepted: 0, rejected: 0 },
    researchPapers: { total: 0, pending: 0, 'under-review': 0, accepted: 0, rejected: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewComments, setReviewComments] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, filterStatus]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch stats
      const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/editor/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch manuscripts or research papers based on active tab
      const endpoint = activeTab === 'manuscripts' ? 'manuscripts' : 'research-papers';
      const statusParam = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/editor/${endpoint}${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        if (activeTab === 'manuscripts') {
          setManuscripts(data.data.manuscripts || []);
        } else {
          setResearchPapers(data.data.papers || []);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (item) => {
    setSelectedItem(item);
    setReviewStatus(item.status || 'under-review');
    setReviewComments(item.adminRemarks || '');
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!reviewStatus) {
      showNotification('Please select a status', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const endpoint = activeTab === 'manuscripts' ? 'manuscripts' : 'research-papers';
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/editor/${endpoint}/${selectedItem._id}/review`,
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
          <h1>Editor Dashboard</h1>
          <p>Review and manage manuscript and research paper submissions</p>
        </div>
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

      {/* Submissions List */}
      <div className="submissions-list">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} color="#cbd5e1" />
            <p>No submissions found</p>
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
