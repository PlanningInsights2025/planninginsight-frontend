import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import io from 'socket.io-client';
import {
  User,
  FileText,
  Briefcase,
  BookOpen,
  MessageSquare,
  Settings,
  TrendingUp,
  Bell,
  LogOut,
  Clock,
  CheckCircle,
  Star,
  Activity,
  GraduationCap,
  Edit3,
  Send,
  ArrowUpCircle,
  Users,
  BarChart3,
  Calendar,
  Target,
  Zap,
  Award,
  Home,
  ClipboardCheck
} from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    articles: 0,
    applications: 0,
    courses: 0,
    forumPosts: 0,
    connections: 0,
    points: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [requestingRole, setRequestingRole] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setupRealTimeConnection();
      startAutoRefresh();
    }

    return () => {
      disconnectRealTime();
      stopAutoRefresh();
    };
  }, [user]);

  const setupRealTimeConnection = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const socketUrl = apiUrl.replace('/api', '');

      socketRef.current = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Real-time connection established');
        setIsRealTimeConnected(true);
        showNotification('Real-time updates enabled', 'success');
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Real-time connection lost');
        setIsRealTimeConnected(false);
      });

      // Listen for stats updates
      socketRef.current.on('stats:updated', (updatedStats) => {
        console.log('📊 Stats updated:', updatedStats);
        setStats(prev => ({ ...prev, ...updatedStats }));
        setLastUpdate(new Date());
      });

      // Listen for new activity
      socketRef.current.on('activity:new', (activity) => {
        console.log('🔔 New activity:', activity);
        setRecentActivity(prev => [activity, ...prev.slice(0, 9)]);
        setLastUpdate(new Date());
      });

      // Listen for notifications
      socketRef.current.on('notification', (notification) => {
        console.log('🔔 Notification received:', notification);
        showNotification(notification.message, notification.type || 'info');
      });

      // Join user's personal room
      if (user?.id) {
        socketRef.current.emit('user:join', user.id);
      }

    } catch (error) {
      console.error('❌ Socket connection error:', error);
    }
  };

  const disconnectRealTime = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsRealTimeConnected(false);
    }
  };

  const startAutoRefresh = () => {
    // Refresh data every 5 minutes
    refreshIntervalRef.current = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      loadDashboardData();
    }, 5 * 60 * 1000);
  };

  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch real-time stats from API
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      try {
        const response = await fetch(`${apiUrl}/api/user/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.stats || {
            articles: 0,
            applications: 0,
            courses: 0,
            forumPosts: 0,
            connections: 0,
            points: 0
          });

          setRecentActivity(data.recentActivity || [
            { type: 'info', title: 'Welcome to Planning Insights!', date: 'Just now', status: 'info' }
          ]);
        } else {
          // Fallback to user data
          setStats({
            articles: user?.stats?.articles || 0,
            applications: user?.stats?.applications || 0,
            courses: user?.stats?.courses || 0,
            forumPosts: user?.stats?.forumPosts || 0,
            connections: user?.stats?.connections || 0,
            points: user?.stats?.points || user?.points || 0
          });

          setRecentActivity(user?.recentActivity || [
            { type: 'info', title: 'Welcome to Planning Insights!', date: 'Just now', status: 'info' }
          ]);
        }
      } catch (fetchError) {
        // Fallback to user data on fetch error
        console.log('Using fallback data:', fetchError.message);
        setStats({
          articles: user?.stats?.articles || 0,
          applications: user?.stats?.applications || 0,
          courses: user?.stats?.courses || 0,
          forumPosts: user?.stats?.forumPosts || 0,
          connections: user?.stats?.connections || 0,
          points: user?.stats?.points || user?.points || 0
        });

        setRecentActivity(user?.recentActivity || [
          { type: 'info', title: 'Welcome to Planning Insights!', date: 'Just now', status: 'info' }
        ]);
      }

      setLastUpdate(new Date());
      console.log('✅ Dashboard data loaded for user:', user?.email);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    showNotification('Refreshing dashboard...', 'info');
    loadDashboardData();
  };

  const roles = [
    {
      id: 'recruiter',
      name: 'Recruiter',
      icon: Briefcase,
      description: 'Post jobs and manage candidate applications.',
      color: 'blue'
    },
    {
      id: 'instructor',
      name: 'Instructor',
      icon: GraduationCap,
      description: 'Create and publish educational courses.',
      color: 'green'
    },
    {
      id: 'editor',
      name: 'Editor',
      icon: Edit3,
      description: 'Review and edit submitted articles.',
      color: 'purple'
    },
    {
      id: 'chiefeditor',
      name: 'Chief Editor',
      icon: Edit3,
      description: 'Manage editorial team and oversee all content.',
      color: 'orange'
    }
  ];

  const handleRoleSelection = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleRoleUpgradeRequest = async () => {
    if (!selectedRole) {
      showNotification('Please select a role to request', 'error');
      return;
    }

    if (!requestReason || !requestReason.trim()) {
      showNotification('Please provide a reason for your request', 'error');
      return;
    }

    setRequestingRole(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        showNotification('Please login to submit role requests', 'error');
        setRequestingRole(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const fullUrl = `${apiUrl}/api/user/role-requests`;

      console.log('📤 Submitting role request:', { selectedRole, reason: requestReason });

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          requestedRole: selectedRole,
          reason: requestReason.trim()
        })
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (response.status === 401) {
        showNotification('Your session has expired. Please logout and login again.', 'error');
        // Clear the invalid token
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (data.success) {
        const role = roles.find(r => r.id === selectedRole);
        showNotification(`Role upgrade request submitted for ${role.name}!`, 'success');
        setSelectedRole(null);
        setRequestReason('');
      } else {
        showNotification(data.message || 'Failed to submit role request', 'error');
      }
    } catch (error) {
      console.error('Error submitting role request:', error);
      showNotification('Failed to submit role request. Please try again.', 'error');
    } finally {
      setRequestingRole(false);
    }
  };

  const handleMenuNavigation = (itemId) => {
    const navigationMap = {
      'home': '/',
      'profile': '/profile',
      'articles': '/my-articles',
      'applications': '/jobs',
      'courses': '/learning',
      'forum': '/forum',
      'editor-dashboard': '/editor/dashboard',
      'check-submission': '/editor/dashboard',
      'settings': '/dashboard',
      'role-upgrade': null
    };

    const targetPath = navigationMap[itemId];
    if (targetPath && targetPath !== '/dashboard') {
      navigate(targetPath);
    } else {
      setActiveTab(itemId);
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Back to Home', icon: Home },
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'articles', label: 'My Articles', icon: FileText },
    { id: 'applications', label: 'Job Applications', icon: Briefcase },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'forum', label: 'Forum Activity', icon: MessageSquare },
    // Show "Check Submission" only for editors and chief editors
    ...(user?.role === 'editor' || user?.role === 'chiefeditor' 
      ? [{ id: 'check-submission', label: 'Check Submission', icon: ClipboardCheck }] 
      : []
    ),
    { id: 'role-upgrade', label: 'Role Upgrade', icon: ArrowUpCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const statCards = [
    { label: 'Published Articles', value: stats.articles, icon: FileText, color: 'blue', change: '+12%' },
    { label: 'Job Applications', value: stats.applications, icon: Briefcase, color: 'green', change: '+5%' },
    { label: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'purple', change: '+2' },
    { label: 'Forum Posts', value: stats.forumPosts, icon: MessageSquare, color: 'orange', change: '+8%' },
    { label: 'Network Connections', value: stats.connections, icon: Users, color: 'pink', change: '+15%' },
    { label: 'Points Earned', value: stats.points, icon: Star, color: 'yellow', change: '+120' }
  ];

  const renderRoleUpgradeRequest = () => (
    <div className="role-upgrade-section">
      <div className="role-upgrade-header">
        <div className="role-upgrade-icon">
          <ArrowUpCircle size={36} />
        </div>
        <div>
          <h2 className="role-upgrade-title">Request Role Upgrade</h2>
          <p className="role-upgrade-subtitle">
            Choose one role to request. Our team will review and notify you upon approval.
          </p>
        </div>
      </div>

      <div className="roles-grid">
        {roles.map((role) => {
          const RoleIcon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <div
              key={role.id}
              className={`role-card role-card-${role.color} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleRoleSelection(role.id)}
            >
              {isSelected && (
                <div className="role-selected-badge">
                  <CheckCircle size={16} />
                  <span>Selected</span>
                </div>
              )}
              <div className={`role-card-icon role-icon-${role.color}`}>
                <RoleIcon size={42} />
              </div>
              <h3 className="role-card-title">{role.name}</h3>
              <p className="role-card-description">{role.description}</p>
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className="role-request-reason">
          <label htmlFor="requestReason" className="reason-label">
            Why do you want this role? <span className="required">*</span>
          </label>
          <textarea
            id="requestReason"
            className="reason-textarea"
            placeholder="Please explain why you're requesting this role and how you plan to contribute to the platform..."
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div className="character-count">
            {requestReason.length}/500 characters
          </div>
        </div>
      )}

      <div className="role-upgrade-footer">
        <p className="role-upgrade-note">
          Select a role and provide a reason to enable the request.
        </p>
        <button
          className="role-upgrade-submit-btn"
          onClick={handleRoleUpgradeRequest}
          disabled={!selectedRole || !requestReason.trim() || requestingRole}
        >
          {requestingRole ? (
            <>
              <span className="spinner-small"></span>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Submit Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <>
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="welcome-subtitle">
            Here's what's happening with your account today
            {isRealTimeConnected && (
              <span className="real-time-badge">
                <span className="pulse-dot"></span>
                Live
              </span>
            )}
            {lastUpdate && (
              <span className="last-update">
                Updated: {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="quick-actions">
          <button 
            className="quick-action-btn refresh" 
            onClick={handleManualRefresh}
            title="Refresh Data"
          >
            <Activity size={18} />
            <span>Refresh</span>
          </button>
          <button className="quick-action-btn primary" onClick={() => navigate('/articles/create')}>
            <Edit3 size={18} />
            <span>Write Article</span>
          </button>
          <button className="quick-action-btn secondary" onClick={() => navigate('/jobs')}>
            <Briefcase size={18} />
            <span>Find Jobs</span>
          </button>
          <button className="quick-action-btn tertiary" onClick={() => navigate('/courses')}>
            <GraduationCap size={18} />
            <span>Browse Courses</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div key={index} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-card-header">
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <StatIcon size={28} />
                </div>
                <div className="stat-change stat-change-positive">{stat.change}</div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content-grid">
        <div className="activity-feed">
          <div className="section-header">
            <h3 className="section-title">Recent Activity</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon activity-icon-${activity.status || 'info'}`}>
                    {activity.status === 'success' ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <div className="activity-icon activity-icon-info">
                  <Bell size={20} />
                </div>
                <div className="activity-content">
                  <p className="activity-title">No recent activity</p>
                  <span className="activity-date">Start exploring to see updates here</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="progress-section">
          <div className="section-header">
            <h3 className="section-title">Your Progress</h3>
          </div>
          <div className="progress-cards">
            <div className="progress-card">
              <div className="progress-header">
                <Target size={20} />
                <span>Profile Completion</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <p className="progress-text">75% Complete</p>
            </div>
            <div className="progress-card">
              <div className="progress-header">
                <Award size={20} />
                <span>Achievements</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <p className="progress-text">12 of 20 Unlocked</p>
            </div>
            <div className="progress-card">
              <div className="progress-header">
                <Zap size={20} />
                <span>Activity Streak</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
              <p className="progress-text">17 Days Active</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar-section">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.firstName} className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
            <div className="user-info">
              <h3 className="user-name">{user?.firstName} {user?.lastName}</h3>
              <p className="user-role">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleMenuNavigation(item.id)}
              >
                <ItemIcon size={20} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'role-upgrade' && renderRoleUpgradeRequest()}
          {activeTab === 'settings' && (
            <div className="coming-soon-section">
              <Settings size={64} className="coming-soon-icon" />
              <h2>Settings Coming Soon</h2>
              <p>Customize your account preferences</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
