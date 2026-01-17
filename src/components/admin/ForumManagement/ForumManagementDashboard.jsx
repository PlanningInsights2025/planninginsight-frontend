import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import socketService from '../../../../services/socketService';
import axios from 'axios';

/**
 * Admin Forum Management Dashboard
 * Real-time approval queue, moderation, and analytics
 */
const ForumManagementDashboard = () => {
  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingForums, setPendingForums] = useState([]);
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalForums: 0,
    pendingApprovals: 0,
    activeThreads: 0,
    flaggedContent: 0,
    activeUsers: 0,
    onlineUsers: 0,
    totalThreads: 0,
    totalAnswers: 0
  });
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [liveUpdateCount, setLiveUpdateCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'masterAdmin')) {
      // Connect to Socket.io with admin rooms
      const token = localStorage.getItem('token');
      socketService.connect(token);

      // Fetch initial data
      fetchPendingForums();
      fetchAnalytics();
      fetchOnlineUsers();
      fetchRecentActivity();

      // Subscribe to real-time events
      socketService.on('forum:created', handleForumCreated);
      socketService.on('forum:pending', handleForumPending);
      socketService.on('forum:approved', handleForumApproved);
      socketService.on('forum:rejected', handleForumRejected);
      socketService.on('report:created', handleReportCreated);
      socketService.on('analytics:update', handleAnalyticsUpdate);
      socketService.on('user:online', handleUserOnline);
      socketService.on('user:offline', handleUserOffline);
      socketService.on('thread:new', handleNewThread);
      socketService.on('answer:new', handleNewAnswer);
      socketService.on('activity:new', handleNewActivity);

      // Auto-refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        fetchAnalytics();
        fetchOnlineUsers();
      }, 30000);

      return () => {
        socketService.off('forum:created');
        socketService.off('forum:pending');
        socketService.off('forum:approved');
        socketService.off('forum:rejected');
        socketService.off('report:created');
        socketService.off('analytics:update');
        socketService.off('user:online');
        socketService.off('user:offline');
        socketService.off('thread:new');
        socketService.off('answer:new');
        socketService.off('activity:new');
        clearInterval(refreshInterval);
      };
    }
  }, [user]);

  const fetchPendingForums = async () => {
    try {
      const response = await axios.get('/api/admin/forum/forums/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPendingForums(response.data.data.forums || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending forums:', error);
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setAnalytics({
          totalForums: response.data.stats.forums || 0,
          pendingApprovals: pendingForums.length,
          activeThreads: response.data.stats.threads || 0,
          flaggedContent: 0,
          activeUsers: response.data.stats.users || 0,
          onlineUsers: response.data.stats.onlineUsers || 0,
          totalThreads: response.data.stats.totalThreads || 0,
          totalAnswers: response.data.stats.totalAnswers || 0
        });
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users/online', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setOnlineUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('/api/admin/forum/activities/recent', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setRecentActivity(response.data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  // Real-time event handlers
  const handleForumCreated = (data) => {
    console.log('New forum created:', data);
    setPendingForums(prev => [data, ...prev]);
    setAnalytics(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals + 1 }));
    setLiveUpdateCount(prev => prev + 1);
    addActivity('forum_created', data);
  };

  const handleForumPending = (data) => {
    console.log('Forum pending approval:', data);
    // Update pending queue if not already there
    setPendingForums(prev => {
      const exists = prev.some(f => f.forumId === data.forumId);
      return exists ? prev : [data, ...prev];
    });
    setLiveUpdateCount(prev => prev + 1);
  };

  const handleForumApproved = (data) => {
    console.log('Forum approved:', data);
    setPendingForums(prev => prev.filter(f => f.forumId !== data.forumId));
    setAnalytics(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      totalForums: prev.totalForums + 1
    }));
    setLiveUpdateCount(prev => prev + 1);
    addActivity('forum_approved', data);
  };

  const handleForumRejected = (data) => {
    console.log('Forum rejected:', data);
    setPendingForums(prev => prev.filter(f => f.forumId !== data.forumId));
    setAnalytics(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));
    setLiveUpdateCount(prev => prev + 1);
    addActivity('forum_rejected', data);
  };

  const handleReportCreated = (data) => {
    console.log('New report created:', data);
    setFlaggedContent(prev => [data, ...prev]);
    setAnalytics(prev => ({ ...prev, flaggedContent: prev.flaggedContent + 1 }));
    setLiveUpdateCount(prev => prev + 1);
    addActivity('report_created', data);
  };

  const handleAnalyticsUpdate = (data) => {
    console.log('Analytics updated:', data);
    setAnalytics(prev => ({ ...prev, ...data }));
    setLastUpdateTime(new Date());
    setLiveUpdateCount(prev => prev + 1);
  };

  const handleUserOnline = (data) => {
    console.log('User came online:', data);
    setOnlineUsers(prev => {
      const exists = prev.some(u => u._id === data.userId);
      if (!exists && data.user) {
        return [data.user, ...prev];
      }
      return prev;
    });
    setAnalytics(prev => ({ ...prev, onlineUsers: prev.onlineUsers + 1 }));
  };

  const handleUserOffline = (data) => {
    console.log('User went offline:', data);
    setOnlineUsers(prev => prev.filter(u => u._id !== data.userId));
    setAnalytics(prev => ({ ...prev, onlineUsers: Math.max(0, prev.onlineUsers - 1) }));
  };

  const handleNewThread = (data) => {
    console.log('New thread created:', data);
    setAnalytics(prev => ({
      ...prev,
      activeThreads: prev.activeThreads + 1,
      totalThreads: prev.totalThreads + 1
    }));
    setLiveUpdateCount(prev => prev + 1);
    addActivity('thread_created', data);
  };

  const handleNewAnswer = (data) => {
    console.log('New answer posted:', data);
    setAnalytics(prev => ({ ...prev, totalAnswers: prev.totalAnswers + 1 }));
    setLiveUpdateCount(prev => prev + 1);
    addActivity('answer_posted', data);
  };

  const handleNewActivity = (data) => {
    addActivity(data.type, data);
  };

  const addActivity = (type, data) => {
    const activity = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date()
    };
    setRecentActivity(prev => [activity, ...prev.slice(0, 19)]);
  };

  const handleApprove = async (forumId) => {
    try {
      const response = await axios.put(
        `/api/admin/forum/forum/${forumId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        // Real-time event will handle UI update
        console.log('Forum approved successfully');
      }
    } catch (error) {
      console.error('Error approving forum:', error);
      alert('Failed to approve forum');
    }
  };

  const handleReject = async (forumId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await axios.put(
        `/api/admin/forum/forum/${forumId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        // Real-time event will handle UI update
        console.log('Forum rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting forum:', error);
      alert('Failed to reject forum');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  // Helper functions
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getActivityIcon = (type) => {
    const icons = {
      forum_created: '📝',
      forum_approved: '✅',
      forum_rejected: '❌',
      thread_created: '💬',
      answer_posted: '💡',
      report_created: '🚩',
      default: '📌'
    };
    return icons[type] || icons.default;
  };

  const getActivityText = (activity) => {
    const { type, data } = activity;
    switch (type) {
      case 'forum_created':
        return `New forum "${data.title || 'Untitled'}" created by ${data.creator?.name || 'User'}`;
      case 'forum_approved':
        return `Forum "${data.title || 'Forum'}" was approved`;
      case 'forum_rejected':
        return `Forum "${data.title || 'Forum'}" was rejected`;
      case 'thread_created':
        return `New thread "${data.title || 'Thread'}" created in ${data.forumName || 'forum'}`;
      case 'answer_posted':
        return `New answer posted in thread "${data.threadTitle || 'Thread'}"`;
      case 'report_created':
        return `Content reported: ${data.reason || 'Violation'}`;
      default:
        return 'New activity';
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Forum Management Dashboard</h1>
        <div style={styles.headerRight}>
          <div style={styles.realtimeIndicator}>
            <span style={styles.pulseDot}></span>
            <span>Live Updates Active</span>
          </div>
          <div style={styles.updateCounter}>
            {liveUpdateCount > 0 && (
              <span style={styles.updateBadge}>{liveUpdateCount} new</span>
            )}
            <span style={styles.lastUpdate}>
              Updated {getTimeAgo(lastUpdateTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Live Status Bar - Prominent at the top */}
      <div style={styles.liveStatusBar}>
        <div style={styles.liveStatusItem}>
          <div style={styles.liveStatusIcon}>
            <span style={styles.greenPulseDot}></span>
            👥
          </div>
          <div>
            <div style={styles.liveStatusValue}>{analytics.onlineUsers}</div>
            <div style={styles.liveStatusLabel}>Online Now</div>
          </div>
        </div>

        <div style={styles.liveStatusItem}>
          <div style={styles.liveStatusIcon}>
            <span style={styles.bluePulseDot}></span>
            💬
          </div>
          <div>
            <div style={styles.liveStatusValue}>{analytics.activeThreads}</div>
            <div style={styles.liveStatusLabel}>Active Threads</div>
          </div>
        </div>

        <div style={styles.liveStatusItem}>
          <div style={styles.liveStatusIcon}>
            <span style={styles.orangePulseDot}></span>
            ⏳
          </div>
          <div>
            <div style={styles.liveStatusValue}>{analytics.pendingApprovals}</div>
            <div style={styles.liveStatusLabel}>Pending</div>
          </div>
        </div>

        <div style={styles.liveStatusItem}>
          <div style={styles.liveStatusIcon}>📊</div>
          <div>
            <div style={styles.liveStatusValue}>{analytics.totalThreads}</div>
            <div style={styles.liveStatusLabel}>Total Threads</div>
          </div>
        </div>

        <div style={styles.liveStatusItem}>
          <div style={styles.liveStatusIcon}>✅</div>
          <div>
            <div style={styles.liveStatusValue}>{analytics.totalAnswers}</div>
            <div style={styles.liveStatusLabel}>Total Answers</div>
          </div>
        </div>
      </div>

      {/* Live Activity & Online Users Section */}
      <div style={styles.liveSection}>
        <div style={styles.liveActivityPanel}>
          <div style={styles.livePanelHeader}>
            <h3 style={styles.livePanelTitle}>
              <span style={styles.activityPulseDot}></span>
              Live Activity Feed
            </h3>
            <button
              style={styles.refreshButton}
              onClick={() => {
                fetchRecentActivity();
                setLiveUpdateCount(0);
              }}
            >
              🔄 Refresh
            </button>
          </div>
          <div style={styles.activityList}>
            {recentActivity.length === 0 ? (
              <div style={styles.emptyActivityState}>No recent activity</div>
            ) : (
              recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} style={styles.activityItem}>
                  <div style={styles.activityIcon}>{getActivityIcon(activity.type)}</div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityText}>{getActivityText(activity)}</div>
                    <div style={styles.activityTime}>{getTimeAgo(activity.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.onlineUsersPanel}>
          <div style={styles.livePanelHeader}>
            <h3 style={styles.livePanelTitle}>
              <span style={styles.greenPulseDot}></span>
              Online Users ({onlineUsers.length})
            </h3>
          </div>
          <div style={styles.onlineUsersList}>
            {onlineUsers.length === 0 ? (
              <div style={styles.emptyActivityState}>No users online</div>
            ) : (
              onlineUsers.slice(0, 15).map((user) => (
                <div key={user._id} style={styles.onlineUserItem}>
                  <div style={styles.userAvatar}>
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} style={styles.avatarImg} />
                    ) : (
                      <div style={styles.avatarPlaceholder}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={styles.onlineDot}></span>
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{user.name}</div>
                    <div style={styles.userRole}>{user.role || 'User'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div style={styles.analytics}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📊</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{analytics.totalForums}</div>
            <div style={styles.cardLabel}>Total Forums</div>
          </div>
        </div>

        <div style={{...styles.card, ...styles.cardWarning}}>
          <div style={styles.cardIcon}>⏳</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{analytics.pendingApprovals}</div>
            <div style={styles.cardLabel}>Pending Approvals</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>💬</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{analytics.activeThreads}</div>
            <div style={styles.cardLabel}>Active Threads</div>
          </div>
        </div>

        <div style={{...styles.card, ...styles.cardDanger}}>
          <div style={styles.cardIcon}>🚩</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{analytics.flaggedContent}</div>
            <div style={styles.cardLabel}>Flagged Content</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>👥</div>
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{analytics.activeUsers}</div>
            <div style={styles.cardLabel}>Active Users</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{...styles.tab, ...(activeTab === 'approvals' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('approvals')}
        >
          Approval Queue ({pendingForums.length})
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'moderation' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('moderation')}
        >
          Moderation ({flaggedContent.length})
        </button>
        <button
          style={{...styles.tab, ...(activeTab === 'analytics' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'approvals' && (
          <div style={styles.approvalQueue}>
            <h2 style={styles.sectionTitle}>Pending Forum Approvals</h2>
            {pendingForums.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>✅</div>
                <div>No pending approvals</div>
              </div>
            ) : (
              <div style={styles.forumList}>
                {pendingForums.map(forum => (
                  <div key={forum.forumId || forum._id} style={styles.forumCard}>
                    <div style={styles.forumHeader}>
                      <div>
                        <h3 style={styles.forumTitle}>{forum.title}</h3>
                        <div style={styles.forumMeta}>
                          <span style={styles.badge}>{forum.category}</span>
                          <span>by {forum.creator?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={styles.statusBadge}>Pending</div>
                    </div>

                    <p style={styles.forumDescription}>{forum.description}</p>

                    {forum.motivation && (
                      <div style={styles.forumDetail}>
                        <strong>Motivation:</strong> {forum.motivation}
                      </div>
                    )}

                    {forum.intent && (
                      <div style={styles.forumDetail}>
                        <strong>Intent:</strong> {forum.intent}
                      </div>
                    )}

                    <div style={styles.forumActions}>
                      <button
                        style={{...styles.button, ...styles.approveButton}}
                        onClick={() => handleApprove(forum.forumId || forum._id)}
                      >
                        ✓ Approve
                      </button>
                      <button
                        style={{...styles.button, ...styles.rejectButton}}
                        onClick={() => handleReject(forum.forumId || forum._id)}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'moderation' && (
          <div style={styles.moderationQueue}>
            <h2 style={styles.sectionTitle}>Flagged Content</h2>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🛡️</div>
              <div>No flagged content</div>
              <div style={styles.emptySubtext}>Moderation queue is clear</div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={styles.analyticsView}>
            <h2 style={styles.sectionTitle}>Forum Analytics</h2>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📈</div>
              <div>Analytics Dashboard</div>
              <div style={styles.emptySubtext}>Coming soon</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  dashboard: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    color: '#1a1a1a'
  },
  realtimeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#e8f5e9',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#2e7d32',
    fontWeight: '500'
  },
  updateCounter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  updateBadge: {
    background: '#ff5722',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    animation: 'bounce 0.5s ease'
  },
  lastUpdate: {
    fontSize: '11px',
    color: '#666'
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    background: '#4caf50',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },
  greenPulseDot: {
    width: '8px',
    height: '8px',
    background: '#4caf50',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    marginRight: '5px'
  },
  bluePulseDot: {
    width: '8px',
    height: '8px',
    background: '#2196f3',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    marginRight: '5px'
  },
  orangePulseDot: {
    width: '8px',
    height: '8px',
    background: '#ff9800',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    marginRight: '5px'
  },
  activityPulseDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    background: '#2196f3',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    marginRight: '8px'
  },
  liveStatusBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '25px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
  },
  liveStatusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  liveStatusIcon: {
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  liveStatusValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: '1'
  },
  liveStatusLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginTop: '4px'
  },
  liveSection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '30px'
  },
  liveActivityPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    maxHeight: '450px',
    display: 'flex',
    flexDirection: 'column'
  },
  onlineUsersPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    maxHeight: '450px',
    display: 'flex',
    flexDirection: 'column'
  },
  livePanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0'
  },
  livePanelTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center'
  },
  refreshButton: {
    background: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  activityList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid transparent'
  },
  activityIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  activityContent: {
    flex: 1,
    minWidth: 0
  },
  activityText: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '4px',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  activityTime: {
    fontSize: '12px',
    color: '#999'
  },
  onlineUsersList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  onlineUserItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  },
  userAvatar: {
    position: 'relative',
    width: '40px',
    height: '40px',
    flexShrink: 0
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#2196f3',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '12px',
    height: '12px',
    background: '#4caf50',
    border: '2px solid white',
    borderRadius: '50%'
  },
  userInfo: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  userRole: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'capitalize'
  },
  emptyActivityState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999',
    fontSize: '14px'
  },
  analytics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  cardWarning: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
  },
  cardDanger: {
    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
  },
  cardIcon: {
    fontSize: '32px'
  },
  cardContent: {
    flex: 1
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  cardLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0'
  },
  tab: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  tabActive: {
    color: '#1976d2',
    borderBottom: '3px solid #1976d2',
    fontWeight: '600'
  },
  tabContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minHeight: '400px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1a1a1a'
  },
  forumList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  forumCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.3s ease'
  },
  forumHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  forumTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#1a1a1a'
  },
  forumMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '13px',
    color: '#666',
    alignItems: 'center'
  },
  badge: {
    background: '#e3f2fd',
    color: '#1976d2',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  statusBadge: {
    background: '#fff3e0',
    color: '#f57c00',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500'
  },
  forumDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#444',
    marginBottom: '12px'
  },
  forumDetail: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
    lineHeight: '1.5'
  },
  forumActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  approveButton: {
    background: '#4caf50',
    color: 'white'
  },
  rejectButton: {
    background: '#f44336',
    color: 'white'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptySubtext: {
    fontSize: '14px',
    marginTop: '8px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  }
};

export default ForumManagementDashboard;
