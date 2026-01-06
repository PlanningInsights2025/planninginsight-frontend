import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, TrendingUp, Lock, Globe, MessageCircle, Crown, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import * as networkingApi from '@/services/api/networking';
import './GroupsPanel.css';
import CreateGroupModal from './CreateGroupModal';
import GroupDetailsModal from './GroupDetailsModal';

const GroupsPanel = () => {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Fetch both my groups and discover groups in parallel
      const [myGroupsResponse, discoverResponse] = await Promise.all([
        networkingApi.getMyGroups(),
        networkingApi.discoverGroups()
      ]);

      if (myGroupsResponse.success) {
        setMyGroups(myGroupsResponse.groups);
      }

      if (discoverResponse.success) {
        setDiscoverGroups(discoverResponse.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      // Silently fail - empty state will be shown
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (newGroup) => {
    try {
      const response = await networkingApi.createGroup(newGroup);
      
      if (response.success) {
        setMyGroups(prevGroups => [response.group, ...prevGroups]);
        toast.success('Group created successfully');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      // Silently fail
    }
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    setShowDetailsModal(true);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await networkingApi.joinGroup(groupId);
      
      if (response.success) {
        // Move group from discover to my groups
        const groupToJoin = discoverGroups.find(g => g.id === groupId);
        if (groupToJoin) {
          const joinedGroup = {
            ...groupToJoin,
            role: 'member',
            unreadPosts: 0
          };
          setMyGroups(prevGroups => [joinedGroup, ...prevGroups]);
          setDiscoverGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
        }
        toast.success('Joined group successfully');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      // Silently fail
    }
  };

  return (
    <div className="groups-panel">
      {/* Header */}
      <div className="groups-header">
        <h2>
          <Users size={24} />
          Groups
        </h2>
        <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Group
        </button>
      </div>

      {/* Search */}
      <div className="groups-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="groups-tabs">
        <button
          className={`tab-btn ${activeTab === 'myGroups' ? 'active' : ''}`}
          onClick={() => setActiveTab('myGroups')}
        >
          My Groups ({myGroups.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
      </div>

      {/* Content */}
      <div className="groups-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading groups...</p>
          </div>
        ) : activeTab === 'myGroups' ? (
          <div className="groups-list">
            {myGroups.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>You haven't joined any groups yet</p>
                <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>
                  Create Your First Group
                </button>
              </div>
            ) : (
              myGroups.map((group) => (
              <div key={group.id} className="group-card">
                <img src={group.image} alt={group.name} className="group-image" />
                <div className="group-info">
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    <div className="group-badges">
                      {group.privacy === 'private' ? (
                        <Lock size={16} className="privacy-icon" />
                      ) : (
                        <Globe size={16} className="privacy-icon" />
                      )}
                      {group.role === 'admin' && <Crown size={16} className="role-icon" />}
                    </div>
                  </div>
                  <p className="group-description">{group.description}</p>
                  <div className="group-stats">
                    <span className="members-count">
                      <Users size={14} />
                      {group.members.toLocaleString()} members
                    </span>
                    {group.unreadPosts > 0 && (
                      <span className="unread-badge">
                        {group.unreadPosts} new posts
                      </span>
                    )}
                  </div>
                </div>
                <div className="group-actions">
                  <button className="btn-view-group" onClick={() => handleViewGroup(group)}>View Group</button>
                  {group.role === 'admin' && (
                    <button className="btn-icon">
                      <Settings size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
            )}
          </div>
        ) : (
          <div className="discover-groups">
            <div className="discover-header">
              <h3>
                <TrendingUp size={20} />
                Trending Groups
              </h3>
            </div>
            {discoverGroups.length === 0 ? (
              <div className="empty-state">
                <p>No new groups to discover</p>
              </div>
            ) : (
              <div className="groups-grid">
                {discoverGroups.map((group) => (
                <div key={group.id} className="discover-group-card">
                  <img src={group.image} alt={group.name} className="group-image" />
                  {group.trending && (
                    <div className="trending-badge">
                      <TrendingUp size={14} />
                      Trending
                    </div>
                  )}
                  <div className="group-info">
                    <h3>{group.name}</h3>
                    <p className="group-description">{group.description}</p>
                    <div className="group-stats">
                      <span className="members-count">
                        <Users size={14} />
                        {group.members.toLocaleString()} members
                      </span>
                      {group.privacy === 'private' ? (
                        <Lock size={14} className="privacy-icon" />
                      ) : (
                        <Globe size={14} className="privacy-icon" />
                      )}
                    </div>
                  </div>
                  <button className="btn-join-group" onClick={() => handleJoinGroup(group.id)}>
                    <Plus size={16} />
                    Join Group
                  </button>
                </div>
              ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />

      <GroupDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        group={selectedGroup}
        isJoined={selectedGroup && myGroups.some(g => g.id === selectedGroup.id)}
      />
    </div>
  );
};

export default GroupsPanel;
