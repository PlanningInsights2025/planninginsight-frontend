import React, { useState } from 'react';
import { UserPlus, UserCheck, UserX, Users, Search, Filter, TrendingUp, Briefcase } from 'lucide-react';
import './ConnectionsPanel.css';
import UserProfileModal from '../UserProfileModal/UserProfileModal';

const ConnectionsPanel = ({ onOpenMessaging }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mock data for connections
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Product Manager',
      company: 'Google',
      mutualConnections: 12,
      avatar: '/api/placeholder/60/60',
      connected: true,
      isFollowing: false,
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
      isFollowing: true,
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
      isFollowing: false,
      industry: 'Design'
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState([
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

  const [suggestions, setSuggestions] = useState([
    {
      id: 6,
      name: 'James Wilson',
      title: 'Software Engineer',
      company: 'Netflix',
      mutualConnections: 18,
      avatar: '/api/placeholder/60/60',
      reason: 'Works in similar industry',
      skills: ['React', 'Node.js'],
      isFollowing: false,
      connected: false
    },
    {
      id: 7,
      name: 'Anna Martinez',
      title: 'Business Analyst',
      company: 'Tesla',
      mutualConnections: 7,
      avatar: '/api/placeholder/60/60',
      reason: 'Mutual connections with Sarah Johnson',
      skills: ['Data Analysis', 'SQL'],
      isFollowing: false,
      connected: false
    },
    {
      id: 8,
      name: 'Robert Taylor',
      title: 'DevOps Engineer',
      company: 'Spotify',
      mutualConnections: 11,
      avatar: '/api/placeholder/60/60',
      reason: 'Similar skills and background',
      skills: ['AWS', 'Docker'],
      isFollowing: false,
      connected: false
    }
  ]);

  const handleAcceptRequest = (id) => {
    console.log('Accepted request:', id);
    
    // Find the request
    const request = pendingRequests.find(req => req.id === id);
    
    if (request) {
      // Add to connections
      const newConnection = {
        ...request,
        connected: true,
        isFollowing: false,
        industry: 'Technology'
      };
      
      setConnections(prevConnections => [...prevConnections, newConnection]);
      
      // Remove from pending requests
      setPendingRequests(prevRequests => 
        prevRequests.filter(req => req.id !== id)
      );
    }
  };

  const handleRejectRequest = (id) => {
    console.log('Rejected request:', id);
    
    // Remove from pending requests
    setPendingRequests(prevRequests => 
      prevRequests.filter(req => req.id !== id)
    );
  };

  const handleSendRequest = (id) => {
    console.log('Sent connection request to:', id);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleFollow = (userId) => {
    console.log('Following user:', userId);
    
    // Check if user is in suggestions
    const userInSuggestions = suggestions.find(sugg => sugg.id === userId);
    
    if (userInSuggestions && !userInSuggestions.connected) {
      // Move from suggestions to connections
      const newConnection = {
        ...userInSuggestions,
        isFollowing: true,
        connected: true
      };
      
      setConnections(prevConnections => [...prevConnections, newConnection]);
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(sugg => sugg.id !== userId)
      );
    } else {
      // Update existing connections
      setConnections(prevConnections => 
        prevConnections.map(conn => 
          conn.id === userId ? { ...conn, isFollowing: true } : conn
        )
      );
      // Update suggestions
      setSuggestions(prevSuggestions => 
        prevSuggestions.map(sugg => 
          sugg.id === userId ? { ...sugg, isFollowing: true } : sugg
        )
      );
    }
    
    // Update selected user if modal is open
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isFollowing: true, connected: true });
    }
  };

  const handleUnfollow = (userId) => {
    console.log('Unfollowing user:', userId);
    
    // Find the connection
    const connection = connections.find(conn => conn.id === userId);
    
    if (connection) {
      // Move back to suggestions and remove from connections
      const newSuggestion = {
        ...connection,
        isFollowing: false,
        connected: false,
        reason: 'Previously connected'
      };
      
      setConnections(prevConnections => 
        prevConnections.filter(conn => conn.id !== userId)
      );
      setSuggestions(prevSuggestions => 
        [...prevSuggestions, newSuggestion]
      );
    } else {
      // Update suggestions
      setSuggestions(prevSuggestions => 
        prevSuggestions.map(sugg => 
          sugg.id === userId ? { ...sugg, isFollowing: false } : sugg
        )
      );
    }
    
    // Update selected user if modal is open
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isFollowing: false, connected: false });
    }
  };

  const handleConnect = (userId) => {
    console.log('Connecting with user:', userId);
    setShowProfileModal(false);
  };

  const handleMessage = (userId) => {
    console.log('Messaging user:', userId);
    console.log('onOpenMessaging function exists:', !!onOpenMessaging);
    setShowProfileModal(false);
    if (onOpenMessaging) {
      onOpenMessaging(userId);
    } else {
      console.error('onOpenMessaging prop is not provided to ConnectionsPanel');
    }
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
                  <button 
                    className={`btn-follow ${connection.isFollowing ? 'following' : ''}`}
                    onClick={() => connection.isFollowing ? handleUnfollow(connection.id) : handleFollow(connection.id)}
                  >
                    {connection.isFollowing ? (
                      <>
                        <UserCheck size={14} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Follow
                      </>
                    )}
                  </button>
                  <button 
                    className="btn-message"
                    onClick={() => handleMessage(connection.id)}
                  >
                    Message
                  </button>
                  <button 
                    className="btn-view-profile"
                    onClick={() => handleViewProfile(connection)}
                  >
                    View Profile
                  </button>
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
                <div className="suggestion-actions">
                  <button
                    className="btn-connect"
                    onClick={() => handleSendRequest(suggestion.id)}
                  >
                    <UserPlus size={16} />
                    Connect
                  </button>
                  <button
                    className="btn-view-profile-small"
                    onClick={() => handleViewProfile(suggestion)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default ConnectionsPanel;
