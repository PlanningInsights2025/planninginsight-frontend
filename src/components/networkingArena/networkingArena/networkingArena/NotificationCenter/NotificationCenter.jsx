import React, { useState } from 'react';
import { X, UserPlus, MessageCircle, ThumbsUp, Eye, Briefcase, Users, Calendar, Filter, ArrowLeft } from 'lucide-react';
import './NotificationCenter.css';

const NotificationCenter = ({ onClose, setUnreadCount }) => {
  const [filter, setFilter] = useState('all');

  const [notifications] = useState([
    {
      id: 1,
      type: 'connection',
      icon: UserPlus,
      title: 'New Connection Request',
      message: 'Sarah Johnson wants to connect with you',
      timestamp: '5 minutes ago',
      read: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      type: 'message',
      icon: MessageCircle,
      title: 'New Message',
      message: 'Michael Chen sent you a message',
      timestamp: '15 minutes ago',
      read: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      type: 'like',
      icon: ThumbsUp,
      title: 'Post Interaction',
      message: 'Emily Rodriguez and 12 others liked your post',
      timestamp: '1 hour ago',
      read: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 4,
      type: 'view',
      icon: Eye,
      title: 'Profile View',
      message: 'Your profile was viewed by 5 people today',
      timestamp: '2 hours ago',
      read: true,
      avatar: null
    },
    {
      id: 5,
      type: 'job',
      icon: Briefcase,
      title: 'Job Opportunity',
      message: 'New job posting matches your skills: Senior Developer at Tech Corp',
      timestamp: '3 hours ago',
      read: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 6,
      type: 'group',
      icon: Users,
      title: 'Group Activity',
      message: 'New discussion in "React Developers" group',
      timestamp: '5 hours ago',
      read: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 7,
      type: 'event',
      icon: Calendar,
      title: 'Event Reminder',
      message: 'Tech Conference 2024 starts in 2 days',
      timestamp: '1 day ago',
      read: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 8,
      type: 'connection',
      icon: UserPlus,
      title: 'Connection Accepted',
      message: 'David Kim accepted your connection request',
      timestamp: '2 days ago',
      read: true,
      avatar: '/api/placeholder/40/40'
    }
  ]);

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'connection', label: 'Connections' },
    { value: 'message', label: 'Messages' },
    { value: 'like', label: 'Interactions' },
    { value: 'job', label: 'Jobs' }
  ];

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notif => notif.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const getNotificationColor = (type) => {
    const colors = {
      connection: '#3b82f6',
      message: '#10b981',
      like: '#f59e0b',
      view: '#8b5cf6',
      job: '#ef4444',
      group: '#06b6d4',
      event: '#ec4899'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="notification-center-overlay">
      <div className="notification-center">
        {/* Header */}
        <div className="notification-header">
          <div className="header-left">
            <button className="back-btn" onClick={onClose} title="Back to Networking Arena">
              <ArrowLeft size={20} />
            </button>
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className="unread-count-badge">{unreadCount} new</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Actions */}
        <div className="notification-actions">
          <div className="filter-dropdown">
            <Filter size={16} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {unreadCount > 0 && (
            <button className="mark-read-btn" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div 
                    className="notification-icon"
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  >
                    <Icon size={20} />
                  </div>
                  {notification.avatar && (
                    <img 
                      src={notification.avatar} 
                      alt="" 
                      className="notification-avatar"
                    />
                  )}
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.timestamp}</span>
                  </div>
                  {!notification.read && (
                    <div className="notification-dot"></div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-notifications">
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
