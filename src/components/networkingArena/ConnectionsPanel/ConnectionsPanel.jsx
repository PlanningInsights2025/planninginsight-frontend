import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, UserX, Users, Search, Filter, TrendingUp, Briefcase } from 'lucide-react';
import './ConnectionsPanel.css';
import UserProfileModal from '../UserProfileModal/UserProfileModal';
import * as networkingAPI from '@/services/api/networking';
import toast from 'react-hot-toast';

const ConnectionsPanel = ({ onOpenMessaging }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Real data from backend
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch all data on component mount
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchConnections(),
        fetchPendingRequests(),
        fetchSuggestions()
      ]);
    } catch (error) {
      console.error('Error fetching networking data:', error);
      toast.error('Failed to load networking data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await networkingAPI.getMyConnections();
      if (response.success) {
        setConnections(response.connections || []);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await networkingAPI.getPendingRequests();
      if (response.success) {
        setPendingRequests(response.requests || []);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await networkingAPI.getSuggestions(10);
      if (response.success) {
        setSuggestions(response.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await networkingAPI.acceptConnectionRequest(requestId);
      
      if (response.success) {
        toast.success('Connection request accepted!');
        
        // Refresh data
        await fetchConnections();
        await fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await networkingAPI.rejectConnectionRequest(requestId);
      
      if (response.success) {
        toast.success('Connection request declined');
        
        // Remove from pending requests
        setPendingRequests(prevRequests => 
          prevRequests.filter(req => req.id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to decline connection request');
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      const response = await networkingAPI.sendConnectionRequest(userId, 'connection');
      
      if (response.success) {
        toast.success('Connection request sent!');
        
        // Remove from suggestions
        setSuggestions(prevSuggestions => 
          prevSuggestions.filter(sugg => sugg.userId !== userId)
        );
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error(error.response?.data?.message || 'Failed to send connection request');
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleFollow = async (userId) => {
    try {
      const response = await networkingAPI.sendConnectionRequest(userId, 'follow');
      
      if (response.success) {
        toast.success('Now following user');
        
        // Refresh connections
        await fetchConnections();
        
        // Remove from suggestions if present
        setSuggestions(prevSuggestions => 
          prevSuggestions.filter(sugg => sugg.userId !== userId)
        );
        
        // Update selected user if modal is open
        if (selectedUser && selectedUser.userId === userId) {
          setSelectedUser({ ...selectedUser, isFollowing: true, connected: true });
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (connectionId) => {
    try {
      const response = await networkingAPI.removeConnection(connectionId);
      
      if (response.success) {
        toast.success('Unfollowed user');
        
        // Refresh data
        await fetchConnections();
        await fetchSuggestions();
        
        // Update selected user if modal is open
        if (selectedUser) {
          setSelectedUser({ ...selectedUser, isFollowing: false, connected: false });
        }
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const handleConnect = async (userId) => {
    await handleSendRequest(userId);
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

  if (isLoading) {
    return (
      <div className="connections-panel">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading networking data...</p>
        </div>
      </div>
    );
  }

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
            {filteredConnections.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <h3>No Connections Yet</h3>
                <p>Start building your network by connecting with professionals</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('suggestions')}
                >
                  Find People to Connect
                </button>
              </div>
            ) : (
              filteredConnections.map((connection) => (
                <div key={connection.id} className="connection-card">
                  <img src={connection.avatar} alt={connection.name} className="connection-avatar" />
                  <div className="connection-info">
                    <h3>{connection.name}</h3>
                    <p className="connection-title">{connection.title}</p>
                    <p className="connection-company">
                      <Briefcase size={14} />
                      {connection.company}
                    </p>
                    {connection.mutualConnections > 0 && (
                      <p className="mutual-connections">
                        {connection.mutualConnections} mutual connections
                      </p>
                    )}
                  </div>
                  <div className="connection-actions">
                    <button 
                      className={`btn-follow ${connection.isFollowing ? 'following' : ''}`}
                      onClick={() => connection.isFollowing ? handleUnfollow(connection.id) : handleFollow(connection.userId)}
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
                      onClick={() => handleMessage(connection.userId)}
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
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-list">
            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <UserPlus size={48} />
                <h3>No Pending Requests</h3>
                <p>You don't have any connection requests at the moment</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <img src={request.avatar} alt={request.name} className="request-avatar" />
                  <div className="request-info">
                    <h3>{request.name}</h3>
                    <p className="request-title">{request.title}</p>
                    <p className="request-company">{request.company}</p>
                    {request.mutualConnections > 0 && (
                      <p className="mutual-connections">
                        {request.mutualConnections} mutual connections
                      </p>
                    )}
                    <p className="request-date">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
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
              ))
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="suggestions-grid">
            {suggestions.length === 0 ? (
              <div className="empty-state">
                <TrendingUp size={48} />
                <h3>No Suggestions Available</h3>
                <p>Check back later for new connection suggestions</p>
              </div>
            ) : (
              suggestions.map((suggestion) => (
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
                    {suggestion.mutualConnections > 0 && (
                      <p className="mutual-connections">
                        {suggestion.mutualConnections} mutual connections
                      </p>
                    )}
                    {suggestion.skills && suggestion.skills.length > 0 && (
                      <div className="suggestion-skills">
                        {suggestion.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="suggestion-actions">
                    <button
                      className="btn-connect"
                      onClick={() => handleSendRequest(suggestion.userId)}
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
              ))
            )}
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
