import React, { useState } from 'react';
import { Users, Plus, Search, TrendingUp, Lock, Globe, MessageCircle, Crown, Settings } from 'lucide-react';
import './GroupsPanel.css';

const GroupsPanel = () => {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [searchQuery, setSearchQuery] = useState('');

  const [myGroups] = useState([
    {
      id: 1,
      name: 'React Developers Community',
      members: 15420,
      image: '/api/placeholder/100/100',
      description: 'A community for React developers to share knowledge and best practices',
      privacy: 'public',
      unreadPosts: 5,
      role: 'admin'
    },
    {
      id: 2,
      name: 'Product Management Network',
      members: 8900,
      image: '/api/placeholder/100/100',
      description: 'Connect with product managers worldwide',
      privacy: 'private',
      unreadPosts: 12,
      role: 'member'
    },
    {
      id: 3,
      name: 'AI & Machine Learning',
      members: 23400,
      image: '/api/placeholder/100/100',
      description: 'Latest trends and discussions on AI/ML',
      privacy: 'public',
      unreadPosts: 8,
      role: 'moderator'
    }
  ]);

  const [discoverGroups] = useState([
    {
      id: 4,
      name: 'Startup Founders Hub',
      members: 12300,
      image: '/api/placeholder/100/100',
      description: 'Network for startup founders and entrepreneurs',
      privacy: 'private',
      trending: true
    },
    {
      id: 5,
      name: 'UX/UI Designers',
      members: 18700,
      image: '/api/placeholder/100/100',
      description: 'Share design inspiration and get feedback',
      privacy: 'public',
      trending: true
    },
    {
      id: 6,
      name: 'DevOps Engineers',
      members: 9800,
      image: '/api/placeholder/100/100',
      description: 'Best practices in DevOps and cloud infrastructure',
      privacy: 'public',
      trending: false
    }
  ]);

  return (
    <div className="groups-panel">
      {/* Header */}
      <div className="groups-header">
        <h2>
          <Users size={24} />
          Groups
        </h2>
        <button className="create-group-btn">
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
        {activeTab === 'myGroups' && (
          <div className="groups-list">
            {myGroups.map((group) => (
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
                  <button className="btn-view-group">View Group</button>
                  {group.role === 'admin' && (
                    <button className="btn-icon">
                      <Settings size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="discover-groups">
            <div className="discover-header">
              <h3>
                <TrendingUp size={20} />
                Trending Groups
              </h3>
            </div>
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
                  <button className="btn-join-group">
                    <Plus size={16} />
                    Join Group
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPanel;
