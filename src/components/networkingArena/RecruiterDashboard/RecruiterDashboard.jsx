import React, { useState } from 'react';
import { 
  BarChart3, Users, Eye, TrendingUp, Briefcase, Download, 
  Calendar, Filter, Search, UserCheck, MessageSquare 
} from 'lucide-react';
import './RecruiterDashboard.css';
import UserProfileModal from '../UserProfileModal/UserProfileModal';

const RecruiterDashboard = ({ onOpenMessaging }) => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const stats = {
    activeJobs: 12,
    totalApplicants: 345,
    profileViews: 2340,
    hires: 8
  };

  const [jobPostings] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      status: 'active',
      applicants: 45,
      views: 234,
      posted: '2 days ago',
      interviews: 8
    },
    {
      id: 2,
      title: 'Product Manager',
      status: 'active',
      applicants: 67,
      views: 456,
      posted: '1 week ago',
      interviews: 12
    },
    {
      id: 3,
      title: 'UX Designer',
      status: 'closed',
      applicants: 34,
      views: 189,
      posted: '2 weeks ago',
      interviews: 5
    }
  ]);

  const [recentApplicants, setRecentApplicants] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      avatar: '/api/placeholder/40/40',
      appliedDate: '2 hours ago',
      match: 95,
      status: 'new',
      isFollowing: false,
      connected: false,
      mutualConnections: 15
    },
    {
      id: 2,
      name: 'Bob Smith',
      title: 'Product Manager',
      company: 'Innovation Inc',
      position: 'Product Manager',
      avatar: '/api/placeholder/40/40',
      appliedDate: '5 hours ago',
      match: 88,
      status: 'reviewed',
      isFollowing: true,
      connected: true,
      mutualConnections: 8
    },
    {
      id: 3,
      name: 'Carol Williams',
      title: 'UX Designer',
      company: 'Design Studio',
      position: 'UX Designer',
      avatar: '/api/placeholder/40/40',
      appliedDate: '1 day ago',
      match: 92,
      status: 'shortlisted',
      isFollowing: false,
      connected: false,
      mutualConnections: 22
    }
  ]);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleFollow = (userId) => {
    console.log('Following user:', userId);
    setRecentApplicants(prevApplicants => 
      prevApplicants.map(applicant => 
        applicant.id === userId ? { ...applicant, isFollowing: true } : applicant
      )
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isFollowing: true });
    }
  };

  const handleUnfollow = (userId) => {
    console.log('Unfollowing user:', userId);
    setRecentApplicants(prevApplicants => 
      prevApplicants.map(applicant => 
        applicant.id === userId ? { ...applicant, isFollowing: false } : applicant
      )
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isFollowing: false });
    }
  };

  const handleConnect = (userId) => {
    console.log('Connecting with user:', userId);
    setShowProfileModal(false);
  };

  const handleMessage = (userId) => {
    console.log('Messaging user:', userId);
    setShowProfileModal(false);
    if (onOpenMessaging) {
      onOpenMessaging(userId);
    }
  };

  return (
    <div className="recruiter-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>
            <BarChart3 size={24} />
            Recruiter Dashboard
          </h2>
          <p>Manage your job postings and track applicants</p>
        </div>
        <div className="header-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button className="export-btn">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon active-jobs">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeJobs}</h3>
            <p>Active Job Posts</p>
            <span className="stat-change positive">+2 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon applicants">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalApplicants}</h3>
            <p>Total Applicants</p>
            <span className="stat-change positive">+45 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.profileViews}</h3>
            <p>Profile Views</p>
            <span className="stat-change positive">+12% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hires">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.hires}</h3>
            <p>Successful Hires</p>
            <span className="stat-change positive">+3 this month</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Job Postings Performance */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <TrendingUp size={20} />
              Job Postings Performance
            </h3>
            <button className="btn-view-all">View All</button>
          </div>
          <div className="job-performance-list">
            {jobPostings.map((job) => (
              <div key={job.id} className="job-performance-card">
                <div className="job-info">
                  <div className="job-title-status">
                    <h4>{job.title}</h4>
                    <span className={`status-badge ${job.status}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="posted-date">
                    <Calendar size={14} />
                    Posted {job.posted}
                  </p>
                </div>
                <div className="job-metrics">
                  <div className="metric">
                    <Eye size={16} />
                    <span>{job.views} views</span>
                  </div>
                  <div className="metric">
                    <Users size={16} />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <div className="metric">
                    <MessageSquare size={16} />
                    <span>{job.interviews} interviews</span>
                  </div>
                </div>
                <div className="job-actions">
                  <button className="btn-manage">Manage</button>
                  <button className="btn-view-applicants">View Applicants</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <Users size={20} />
              Recent Applicants
            </h3>
            <div className="section-actions">
              <button className="btn-icon">
                <Search size={18} />
              </button>
              <button className="btn-icon">
                <Filter size={18} />
              </button>
            </div>
          </div>
          <div className="applicants-list">
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="applicant-card">
                <img src={applicant.avatar} alt={applicant.name} className="applicant-avatar" />
                <div className="applicant-info">
                  <h4>{applicant.name}</h4>
                  <p className="applied-position">{applicant.position}</p>
                  <p className="applied-time">{applicant.appliedDate}</p>
                </div>
                <div className="match-score">
                  <div className="score-circle" style={{
                    background: `conic-gradient(#10b981 ${applicant.match * 3.6}deg, #e5e7eb 0deg)`
                  }}>
                    <span>{applicant.match}%</span>
                  </div>
                  <p>Match</p>
                </div>
                <div className="applicant-status">
                  <span className={`status-badge ${applicant.status}`}>
                    {applicant.status}
                  </span>
                </div>
                <div className="applicant-actions">
                  <button 
                    className="btn-view-profile"
                    onClick={() => handleViewProfile(applicant)}
                  >
                    View Profile
                  </button>
                  <button 
                    className="btn-message"
                    onClick={() => handleMessage(applicant.id)}
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Chart Placeholder */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <BarChart3 size={20} />
              Application Trends
            </h3>
          </div>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Application trends visualization</p>
            <p className="chart-subtitle">Track your hiring funnel performance</p>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setShowProfileModal(false)}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onConnect={handleConnect}
          onMessage={handleMessage}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;
