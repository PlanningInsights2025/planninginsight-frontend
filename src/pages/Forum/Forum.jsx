import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import socketService from '../../services/socketService';
import api from '../../services/api/api';
import CreateForumModal from '../../components/forum/CreateForumModal';
import {
  Search,
  Plus,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  ThumbsUp,
  Star,
  Award,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Tag
} from 'lucide-react';

/* ========================================
   MOCK DATA FOR DEMO
   ======================================== */

const mockForumsData = [
  {
    id: '1',
    title: 'Urban Planning Best Practices 2026',
    description: 'Discussing modern approaches to sustainable urban development and community engagement strategies.',
    author: { name: 'Sarah Johnson', avatar: 'SJ', reputation: 2450 },
    tags: ['urban-planning', 'sustainability', 'community'],
    stats: { questions: 45, replies: 234, views: 12500, followers: 890 },
    status: 'approved',
    createdAt: '2 hours ago',
    isPinned: true
  },
  {
    id: '2',
    title: 'Transportation Infrastructure Challenges',
    description: 'Share insights on managing complex transportation projects in growing metropolitan areas.',
    author: { name: 'Michael Chen', avatar: 'MC', reputation: 1890 },
    tags: ['transportation', 'infrastructure', 'metro'],
    stats: { questions: 32, replies: 156, views: 8900, followers: 567 },
    status: 'approved',
    createdAt: '5 hours ago',
    isPinned: false
  },
  {
    id: '3',
    title: 'Green Building Standards Discussion',
    description: 'Latest trends in eco-friendly construction and LEED certification processes.',
    author: { name: 'Anonymous', avatar: 'A', reputation: 0 },
    tags: ['green-building', 'leed', 'sustainability'],
    stats: { questions: 28, replies: 189, views: 7200, followers: 423 },
    status: 'pending',
    createdAt: '1 day ago',
    isPinned: false
  },
  {
    id: '4',
    title: 'Smart Cities Technology Integration',
    description: 'IoT, AI, and data-driven solutions for modern urban management.',
    author: { name: 'Alex Rodriguez', avatar: 'AR', reputation: 3120 },
    tags: ['smart-cities', 'iot', 'technology'],
    stats: { questions: 67, replies: 412, views: 15600, followers: 1240 },
    status: 'approved',
    createdAt: '3 days ago',
    isPinned: false
  },
  {
    id: '5',
    title: 'Affordable Housing Initiatives',
    description: 'Strategies for addressing housing affordability crisis in major cities.',
    author: { name: 'Emma Williams', avatar: 'EW', reputation: 1567 },
    tags: ['housing', 'policy', 'affordability'],
    stats: { questions: 89, replies: 523, views: 18900, followers: 1567 },
    status: 'approved',
    createdAt: '4 days ago',
    isPinned: false
  }
];

const trendingTopics = [
  { title: 'Climate-Resilient Design', replies: 45, trend: '+12%' },
  { title: 'Zoning Law Updates', replies: 32, trend: '+8%' },
  { title: 'Public Transit Optimization', replies: 28, trend: '+15%' },
  { title: 'Heritage Conservation', replies: 21, trend: '+5%' }
];

/* ========================================
   COMPONENT: ForumHeader
   ======================================== */

const ForumHeader = ({ onCreateClick }) => {
  return (
    <>
      <div className="forum-header">
        <div className="header-content-wrapper">
          <div className="header-text-section">
            <div className="header-badge">
              <MessageSquare size={18} />
              <span>Discussion Forum</span>
            </div>
            <h1 className="forum-main-title">Discussion Forum</h1>
            <p className="forum-subtitle">Ask questions, share insights, and learn from peers.</p>
          </div>
          <button className="create-forum-btn" onClick={onCreateClick}>
            <Plus size={20} />
            <span>Create Forum</span>
          </button>
        </div>
      </div>

      <style>{`
        .forum-header {
          background: #524393;
          border-radius: 24px;
          padding: 40px 36px;
          margin-bottom: 32px;
          box-shadow: 0 18px 40px rgba(82, 67, 147, 0.35);
          position: relative;
          overflow: hidden;
          border: none;
        }

        .forum-header::before {
          content: none;
        }

        .header-content-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          position: relative;
          z-index: 2;
        }

        .header-text-section {
          flex: 1;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.12);
          padding: 8px 16px;
          border-radius: 999px;
          color: #f9fafb;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.28);
        }

        .header-badge svg {
          color: #f9fafb;
        }

        .forum-main-title {
          font-size: 40px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .forum-subtitle {
          font-size: 16px;
          color: rgba(249, 250, 251, 0.88);
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        .create-forum-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #BDD337 0%, #a8c91f 100%);
          color: #1B1528;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(189, 211, 55, 0.3);
          white-space: nowrap;
        }

        .create-forum-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(189, 211, 55, 0.4);
        }

        .create-forum-btn:active {
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .forum-header {
            padding: 32px 24px;
            border-radius: 16px;
          }

          .header-content-wrapper {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .forum-main-title {
            font-size: 32px;
          }

          .forum-subtitle {
            font-size: 16px;
          }

          .create-forum-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .forum-header {
            padding: 24px 16px;
          }

          .forum-main-title {
            font-size: 28px;
          }

          .forum-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: FilterBar
   ======================================== */

const FilterBar = ({ searchTerm, onSearchChange, sortBy, onSortChange, activeFilter, onFilterChange, statusCounts }) => {
  const sortOptions = ['trending', 'newest', 'most-answered', 'most-followed'];
  const filterOptions = ['all', 'my-forums', 'followed', 'pending', 'approved'];

  const getFilterCount = (option) => {
    if (!statusCounts) return 0;
    switch (option) {
      case 'all':
        return statusCounts.all;
      case 'my-forums':
        return statusCounts.myForums;
      case 'followed':
        return statusCounts.followed;
      case 'pending':
        return statusCounts.pending;
      case 'approved':
        return statusCounts.approved;
      default:
        return 0;
    }
  };

  return (
    <>
      <div className="filter-bar">
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search topics, users, tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-controls">
          <div className="sort-buttons">
            {sortOptions.map(option => (
              <button
                key={option}
                className={`sort-btn ${sortBy === option ? 'active' : ''}`}
                onClick={() => onSortChange(option)}
              >
                {option === 'trending' && <TrendingUp size={16} />}
                {option === 'newest' && <Clock size={16} />}
                {option === 'most-answered' && <MessageSquare size={16} />}
                {option === 'most-followed' && <Users size={16} />}
                <span>{option.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
              </button>
            ))}
          </div>

          <div className="filter-chips">
            {filterOptions.map(option => (
              <button
                key={option}
                className={`filter-chip ${activeFilter === option ? 'active' : ''}`}
                onClick={() => onFilterChange(option)}
              >
                {option === 'my-forums' && <Star size={14} />}
                {option === 'followed' && <Users size={14} />}
                {option === 'pending' && <Clock size={14} />}
                {option === 'approved' && <CheckCircle size={14} />}
                <span>{option.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                {getFilterCount(option) > 0 && (
                  <span className="filter-chip-count">{getFilterCount(option)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .filter-bar {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 4px 12px rgba(82, 67, 147, 0.08);
          border: 1px solid #e9e0f0;
        }

        .search-section {
          margin-bottom: 20px;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: #f8f7fc;
          border: 2px solid #ddd4e4;
          border-radius: 12px;
          transition: all 200ms;
        }

        .search-input-wrapper:focus-within {
          background: white;
          border-color: #524393;
          box-shadow: 0 0 0 4px rgba(82, 67, 147, 0.08);
        }

        .search-icon {
          color: #8b7c9e;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 15px;
          color: #1B1528;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: #8b7c9e;
        }

        .filter-controls {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sort-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sort-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #f8f7fc;
          border: 2px solid #ddd4e4;
          border-radius: 10px;
          color: #4b5563;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 200ms;
        }

        .sort-btn:hover {
          background: white;
          border-color: #524393;
          color: #524393;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(82, 67, 147, 0.12);
        }

        .sort-btn.active {
          background: linear-gradient(135deg, #524393, #7c5ba8);
          border-color: #524393;
          color: white;
          box-shadow: 0 4px 12px rgba(82, 67, 147, 0.2);
        }

        .filter-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 2px solid #e9e0f0;
          border-radius: 50px;
          color: #4b5563;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 200ms;
        }

        .filter-chip-count {
          min-width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #f97316;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }

        .filter-chip:hover {
          border-color: #BDD337;
          color: #1B1528;
          transform: scale(1.05);
        }

        .filter-chip.active {
          background: #BDD337;
          border-color: #BDD337;
          color: #1B1528;
          box-shadow: 0 2px 8px rgba(189, 211, 55, 0.3);
        }

        @media (max-width: 768px) {
          .filter-bar {
            padding: 20px;
          }

          .sort-buttons {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
          }

          .sort-btn {
            white-space: nowrap;
          }

          .filter-chips {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
          }

          .filter-chip {
            white-space: nowrap;
          }
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: StatusBadge
   ======================================== */

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Approved', icon: CheckCircle };
      case 'pending':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', label: 'Pending', icon: Clock };
      case 'closed':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Closed', icon: XCircle };
      default:
        return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', label: 'Unknown', icon: MessageSquare };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <>
      <span className={`status-badge status-${status}`}>
        <Icon size={14} />
        <span>{config.label}</span>
      </span>

      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-approved {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-closed {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: TagBadge
   ======================================== */

const TagBadge = ({ tag }) => {
  return (
    <>
      <span className="tag-badge">
        <Tag size={12} />
        <span>{tag}</span>
      </span>

      <style>{`
        .tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          background: rgba(82, 67, 147, 0.08);
          border: 1px solid rgba(82, 67, 147, 0.15);
          border-radius: 6px;
          color: #524393;
          font-size: 12px;
          font-weight: 600;
          transition: all 200ms;
        }

        .tag-badge:hover {
          background: rgba(82, 67, 147, 0.15);
          border-color: #524393;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: ForumCard
   ======================================== */

const ForumCard = ({ forum, onFollow, onCardClick }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    onFollow(forum.id);
  };

  return (
    <>
      <div className="forum-card" onClick={() => onCardClick(forum.id)}>
        <div className="card-header-section">
          <div className="author-info">
            <div className="author-avatar">{forum.author.avatar}</div>
            <div className="author-details">
              <div className="author-name">{forum.author.name}</div>
              <div className="author-meta">
                {forum.author.reputation > 0 && (
                  <span className="reputation">
                    <Award size={12} />
                    {forum.author.reputation} pts
                  </span>
                )}
                <span className="post-time">{forum.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="card-status-row">
            <StatusBadge status={forum.status} />
            {forum.isPinned && (
              <span className="pinned-badge">
                <Star size={12} fill="currentColor" />
                Pinned
              </span>
            )}
          </div>
        </div>

        <div className="card-content">
          <h3 className="forum-title">{forum.title}</h3>
          <p className="forum-description">{forum.description}</p>

          <div className="tags-row">
            {forum.tags.map((tag, idx) => (
              <TagBadge key={idx} tag={tag} />
            ))}
          </div>
        </div>

        <div className="card-footer">
          <div className="stats-row">
            <div className="stat-item">
              <MessageSquare size={16} />
              <span>{forum.stats.questions} Questions</span>
            </div>
            <div className="stat-item">
              <ThumbsUp size={16} />
              <span>{forum.stats.replies} Replies</span>
            </div>
            <div className="stat-item">
              <Eye size={16} />
              <span>{forum.stats.views.toLocaleString()} Views</span>
            </div>
            <div className="stat-item">
              <Users size={16} />
              <span>{forum.stats.followers} Followers</span>
            </div>
          </div>

          <button
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            <Star size={16} fill={isFollowing ? 'currentColor' : 'none'} />
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .forum-card {
          background: white;
          border: 1px solid #e9e0f0;
          border-radius: 16px;
          padding: 24px;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .forum-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #524393, #A2A2D0);
          opacity: 0;
          transition: opacity 300ms;
        }

        .forum-card:hover {
          border-color: #524393;
          box-shadow: 0 12px 24px rgba(82, 67, 147, 0.15);
          transform: translateY(-4px);
        }

        .forum-card:hover::before {
          opacity: 1;
        }

        .card-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #524393, #A2A2D0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .author-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .author-name {
          font-weight: 700;
          color: #1B1528;
          font-size: 14px;
        }

        .author-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #8b7c9e;
        }

        .reputation {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #f59e0b;
          font-weight: 600;
        }

        .post-time {
          color: #8b7c9e;
        }

        .card-status-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pinned-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: rgba(244, 63, 94, 0.1);
          color: #be123c;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .card-content {
          margin-bottom: 20px;
        }

        .forum-title {
          font-size: 20px;
          font-weight: 700;
          color: #1B1528;
          margin: 0 0 12px 0;
          line-height: 1.4;
          transition: color 200ms;
        }

        .forum-card:hover .forum-title {
          color: #524393;
        }

        .forum-description {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .tags-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #e9e0f0;
          gap: 16px;
        }

        .forum-card .stats-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .forum-card .stats-row .stat-item {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          padding: 10px 16px;
          background: #f9fbff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          color: #4b5563;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 6px 12px rgba(15, 23, 42, 0.04);
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
        }

        .forum-card .stats-row .stat-item:hover {
          transform: translateY(-1px);
          border-color: #cbd5f5;
          box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
        }

        .forum-card .stats-row .stat-item svg {
          color: #524393;
          background: none;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          border: none;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .follow-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 2px solid #ddd4e4;
          border-radius: 10px;
          color: #524393;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 200ms;
          white-space: nowrap;
        }

        .follow-btn:hover {
          background: #f8f7fc;
          border-color: #524393;
          transform: scale(1.05);
        }

        .follow-btn.following {
          background: #BDD337;
          border-color: #BDD337;
          color: #1B1528;
        }

        @media (max-width: 768px) {
          .forum-card {
            padding: 20px;
          }

          .card-header-section {
            flex-direction: column;
            gap: 12px;
          }

          .card-status-row {
            align-self: flex-start;
          }

          .forum-title {
            font-size: 18px;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .stats-row {
            flex-wrap: wrap;
            gap: 12px;
          }

          .follow-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: Sidebar - Trending
   ======================================== */

const TrendingList = ({ topics }) => {
  return (
    <>
      <div className="trending-widget">
        <div className="widget-header">
          <TrendingUp size={20} />
          <h3>Trending Topics</h3>
        </div>
        <div className="trending-list">
          {topics.map((topic, idx) => (
            <div key={idx} className="trending-item">
              <div className="trending-info">
                <div className="trending-title">{topic.title}</div>
                <div className="trending-meta">
                  <MessageSquare size={12} />
                  <span>{topic.replies} replies</span>
                </div>
              </div>
              <div className="trending-badge">{topic.trend}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trending-widget {
          background: white;
          border: 1px solid #e9e0f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(82, 67, 147, 0.08);
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e9e0f0;
        }

        .widget-header svg {
          color: #524393;
        }

        .widget-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #1B1528;
        }

        .trending-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trending-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f8f7fc;
          border-radius: 10px;
          transition: all 200ms;
          cursor: pointer;
        }

        .trending-item:hover {
          background: #ede8f5;
          transform: translateX(4px);
        }

        .trending-info {
          flex: 1;
        }

        .trending-title {
          font-size: 14px;
          font-weight: 600;
          color: #1B1528;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .trending-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #8b7c9e;
        }

        .trending-meta svg {
          color: #524393;
        }

        .trending-badge {
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: Sidebar - Quick Actions
   ======================================== */

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'created', label: 'My Created Forums', icon: Star, count: 3 },
    { id: 'followed', label: 'My Followed Forums', icon: Users, count: 12 }
  ];

  return (
    <>
      <div className="quick-actions-widget">
        <div className="widget-header">
          <Filter size={20} />
          <h3>Quick Actions</h3>
        </div>
        <div className="actions-list">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="action-item"
                onClick={() => onActionClick(action.id)}
              >
                <div className="action-info">
                  <Icon size={18} />
                  <span className="action-label">{action.label}</span>
                </div>
                <div className="action-count">{action.count}</div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .quick-actions-widget {
          background: white;
          border: 1px solid #e9e0f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(82, 67, 147, 0.08);
        }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: #f8f7fc;
          border: 2px solid #e9e0f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 200ms;
          text-align: left;
          width: 100%;
        }

        .action-item:hover {
          background: white;
          border-color: #524393;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(82, 67, 147, 0.12);
        }

        .action-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1B1528;
        }

        .action-info svg {
          color: #524393;
        }

        .action-label {
          font-size: 14px;
          font-weight: 600;
        }

        .action-count {
          padding: 4px 12px;
          background: #BDD337;
          color: #1B1528;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
        }
      `}</style>
    </>
  );
};

/* ========================================
   COMPONENT: Sidebar Container
   ======================================== */

const Sidebar = ({ trendingTopics, onActionClick }) => {
  return (
    <>
      <div className="sidebar-container">
        <TrendingList topics={trendingTopics} />
        <QuickActions onActionClick={onActionClick} />
      </div>

      <style>{`
        .sidebar-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .sidebar-container {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </>
  );
};

/* ========================================
   MAIN COMPONENT: Forum Page
   ======================================== */

const Forum = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    myForums: 0,
    followed: 0,
    pending: 0,
    approved: 0
  });

  // Fetch forums from API
  const fetchForums = async () => {
    try {
      setLoading(true);
      let response;
      
      // Handle different filter types
      if (activeFilter === 'my-forums') {
        // Fetch user's own forums
        response = await api.get('/forum/user/my-forums', {
          params: { sort: sortBy, search: searchTerm }
        });
      } else {
        // Fetch all forums with filters
        const params = {
          sort: sortBy,
          search: searchTerm
        };
        
        // Apply status filter
        if (activeFilter === 'pending') {
          params.status = 'pending';
        } else if (activeFilter === 'approved') {
          params.status = 'approved';
        } else if (activeFilter === 'all') {
          // Show both approved and pending (user can see their own pending forums)
          params.status = 'approved';
        }
        // Note: 'followed' filter would need backend support
        
        response = await api.get('/forum', { params });
      }
      
      if (response.data.success) {
        const forumsData = response.data.data.forums.map(forum => ({
          id: forum._id,
          title: forum.title,
          description: forum.description,
          author: {
            name: forum.creator?.name || `${forum.creator?.firstName || ''} ${forum.creator?.lastName || ''}`.trim() || 'Anonymous',
            avatar: (forum.creator?.firstName?.substring(0, 1) || '') + (forum.creator?.lastName?.substring(0, 1) || '') || 'A',
            reputation: forum.creator?.reputation || 0
          },
          tags: [forum.category.toLowerCase().replace(' ', '-')],
          stats: {
            questions: forum.threadCount || 0,
            replies: 0,
            views: 0,
            followers: forum.followerCount || 0
          },
          status: forum.status,
          createdAt: formatDate(forum.createdAt),
          isPinned: forum.isPinned || false
        }));
        setForums(forumsData);

        // When we have the current page of data, we can at least keep the
        // "all" count in sync with what the user is seeing.
        setStatusCounts(prev => ({
          ...prev,
          all: response.data.data.pagination?.total || forumsData.length
        }));
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
      // Show error to user
      if (error.response?.status === 401) {
        console.log('Please login to view forums');
      }
      setForums([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch aggregated status counts (overall + per-user)
  const fetchStatusCounts = async () => {
    try {
      const response = await api.get('/forum/status/counts');
      if (response.data.success) {
        const { overall, user: userCounts } = response.data.data;

        setStatusCounts({
          all: overall.approved + (userCounts?.pending || 0),
          myForums: (userCounts?.approved || 0) + (userCounts?.pending || 0),
          followed: userCounts?.followed || 0,
          pending: userCounts?.pending || overall.pending || 0,
          approved: overall.approved || 0
        });
      }
    } catch (error) {
      console.error('Error fetching forum status counts:', error);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Fetch forums on mount and when filters change
  useEffect(() => {
    fetchForums();
  }, [sortBy, searchTerm, activeFilter]);

  // Fetch status counts once on mount and whenever auth state changes
  useEffect(() => {
    fetchStatusCounts();
  }, [isAuthenticated]);

  // Initialize Socket.io connection for real-time updates
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isAuthenticated) {
      socketService.connect(token);
      
      // Listen for new forum created
      socketService.on('forum:created', (data) => {
        console.log('New forum created:', data);
        fetchForums(); // Refresh forum list
        fetchStatusCounts(); // Refresh counts
      });
      
      // Listen for forum status changes
      socketService.on('forum:approved', (data) => {
        console.log('Forum approved:', data);
        fetchForums(); // Refresh forum list
        fetchStatusCounts(); // Refresh counts
      });
      
      socketService.on('forum:rejected', (data) => {
        console.log('Forum rejected:', data);
        fetchForums(); // Refresh forum list
        fetchStatusCounts(); // Refresh counts
      });
    }

    return () => {
      if (isAuthenticated) {
        socketService.off('forum:created');
        socketService.off('forum:approved');
        socketService.off('forum:rejected');
        socketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  const handleCreateForum = () => {
    if (!isAuthenticated) {
      alert('Please login to create a forum');
      navigate('/login');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleForumCardClick = (id) => {
    navigate(`/forum/threads/${id}`);
  };

  const handleFollow = (forumId) => {
    console.log('Following forum:', forumId);
  };

  const handleActionClick = (actionId) => {
    console.log('Quick action:', actionId);
    setActiveFilter(actionId === 'created' ? 'my-forums' : 'followed');
  };

  return (
    <>
      <CreateForumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          console.log('Forum created successfully');
          fetchForums(); // Refresh forum list
          fetchStatusCounts(); // Refresh counts
        }}
      />

      <div className="forum-page-wrapper">
        <div className="forum-container">
          <ForumHeader onCreateClick={handleCreateForum} />

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            statusCounts={statusCounts}
          />

          <div className="forum-layout">
            <div className="forum-main-content">
              <div className="forums-grid">
                {forums.map((forum) => (
                  <ForumCard
                    key={forum.id}
                    forum={forum}
                    onFollow={handleFollow}
                    onCardClick={handleForumCardClick}
                  />
                ))}
              </div>
            </div>

            <div className="forum-sidebar">
              <Sidebar
                trendingTopics={trendingTopics}
                onActionClick={handleActionClick}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .forum-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #f8f7fc 50%, #ede8f5 100%);
          padding: 40px 0 80px;
        }

        .forum-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .forum-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }

        .forum-main-content {
          min-width: 0;
        }

        .forums-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeInUp 600ms ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .forum-sidebar {
          position: sticky;
          top: 24px;
        }

        /* Responsive Layouts */
        @media (max-width: 1200px) {
          .forum-layout {
            grid-template-columns: 1fr 320px;
            gap: 24px;
          }
        }

        @media (max-width: 1024px) {
          .forum-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .forum-sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .forum-page-wrapper {
            padding: 24px 0 60px;
          }

          .forum-container {
            padding: 0 16px;
          }

          .forum-layout {
            gap: 24px;
          }

          .forums-grid {
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .forum-page-wrapper {
            padding: 16px 0 40px;
          }

          .forum-container {
            padding: 0 12px;
          }
        }
      `}</style>
    </>
  );
};

export default Forum;
