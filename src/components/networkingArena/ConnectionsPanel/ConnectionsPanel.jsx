import React, { useState } from 'react';
import { UserPlus, UserCheck, UserX, Users, Search, Filter, TrendingUp, Briefcase } from 'lucide-react';
import './ConnectionsPanel.css';

const ConnectionsPanel = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for connections
  const [connections] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Product Manager',
      company: 'Google',
      mutualConnections: 12,
      avatar: '/api/placeholder/60/60',
      connected: true,
      industry: 'Technology'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Data Scientist',
      company: 'Amazon',
      mutualConnections: 8,
      avatar: '/api/placeholder/60/60',
      connected: true,
      industry: 'Technology'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'UX Designer',
      company: 'Apple',
      mutualConnections: 15,
      avatar: '/api/placeholder/60/60',
      connected: true,
      industry: 'Design'
    }
  ]);

  const [pendingRequests] = useState([
    {
      id: 4,
      name: 'David Kim',
      title: 'Full Stack Developer',
      company: 'Microsoft',
      mutualConnections: 5,
      avatar: '/api/placeholder/60/60',
      requestDate: '2 days ago'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      title: 'Marketing Manager',
      company: 'Adobe',
      mutualConnections: 9,
      avatar: '/api/placeholder/60/60',
      requestDate: '1 week ago'
    }
  ]);

  const [suggestions] = useState([
    {
      id: 6,
      name: 'James Wilson',
      title: 'Software Engineer',
      company: 'Netflix',
      mutualConnections: 18,
      avatar: '/api/placeholder/60/60',
      reason: 'Works in similar industry',
      skills: ['React', 'Node.js']
    },
    {
      id: 7,
      name: 'Anna Martinez',
      title: 'Business Analyst',
      company: 'Tesla',
      mutualConnections: 7,
      avatar: '/api/placeholder/60/60',
      reason: 'Mutual connections with Sarah Johnson',
      skills: ['Data Analysis', 'SQL']
    },
    {
      id: 8,
      name: 'Robert Taylor',
      title: 'DevOps Engineer',
      company: 'Spotify',
      mutualConnections: 11,
      avatar: '/api/placeholder/60/60',
      reason: 'Similar skills and background',
      skills: ['AWS', 'Docker']
    }
  ]);

  const handleAcceptRequest = (id) => {
    console.log('Accepted request:', id);
  };

  const handleRejectRequest = (id) => {
    console.log('Rejected request:', id);
  };

  const handleSendRequest = (id) => {
    console.log('Sent connection request to:', id);
  };

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="connections-panel">
      {/* Header */}
      <div className="connections-header">
        <h2>
          <Users size={24} />
          My Network
        </h2>
        <p className="connections-subtitle">
          Manage your professional connections and grow your network
        </p>
      </div>

      {/* Stats */}
      <div className="connection-stats">
        <div className="stat-card">
          <UserCheck size={24} />
          <div className="stat-content">
            <span className="stat-number">{connections.length}</span>
            <span className="stat-label">Connections</span>
          </div>
        </div>
        <div className="stat-card">
          <UserPlus size={24} />
          <div className="stat-content">
            <span className="stat-number">{pendingRequests.length}</span>
            <span className="stat-label">Pending Requests</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} />
          <div className="stat-content">
            <span className="stat-number">{suggestions.length}</span>
            <span className="stat-label">Suggestions</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="connections-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Connections ({connections.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({pendingRequests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          People You May Know ({suggestions.length})
        </button>
      </div>

      {/* Search and Filter */}
      {activeTab === 'all' && (
        <div className="connections-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={18} />
            Filter
          </button>
        </div>
      )}

      {/* Content */}
      <div className="connections-content">
        {activeTab === 'all' && (
          <div className="connections-grid">
            {filteredConnections.map((connection) => (
              <div key={connection.id} className="connection-card">
                <img src={connection.avatar} alt={connection.name} className="connection-avatar" />
                <div className="connection-info">
                  <h3>{connection.name}</h3>
                  <p className="connection-title">{connection.title}</p>
                  <p className="connection-company">
                    <Briefcase size={14} />
                    {connection.company}
                  </p>
                  <p className="mutual-connections">
                    {connection.mutualConnections} mutual connections
                  </p>
                </div>
                <div className="connection-actions">
                  <button className="btn-message">Message</button>
                  <button className="btn-view-profile">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-list">
            {pendingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <img src={request.avatar} alt={request.name} className="request-avatar" />
                <div className="request-info">
                  <h3>{request.name}</h3>
                  <p className="request-title">{request.title}</p>
                  <p className="request-company">{request.company}</p>
                  <p className="mutual-connections">
                    {request.mutualConnections} mutual connections
                  </p>
                  <p className="request-date">{request.requestDate}</p>
                </div>
                <div className="request-actions">
                  <button
                    className="btn-accept"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <UserCheck size={16} />
                    Accept
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <UserX size={16} />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="suggestions-grid">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card">
                <img src={suggestion.avatar} alt={suggestion.name} className="suggestion-avatar" />
                <div className="suggestion-info">
                  <h3>{suggestion.name}</h3>
                  <p className="suggestion-title">{suggestion.title}</p>
                  <p className="suggestion-company">{suggestion.company}</p>
                  <p className="suggestion-reason">
                    <TrendingUp size={14} />
                    {suggestion.reason}
                  </p>
                  <p className="mutual-connections">
                    {suggestion.mutualConnections} mutual connections
                  </p>
                  <div className="suggestion-skills">
                    {suggestion.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <button
                  className="btn-connect"
                  onClick={() => handleSendRequest(suggestion.id)}
                >
                  <UserPlus size={16} />
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPanel;
