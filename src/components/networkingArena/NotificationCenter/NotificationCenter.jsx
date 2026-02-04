import React, { useState, useEffect } from 'react';
import { X, UserPlus, MessageCircle, ThumbsUp, Eye, Briefcase, Users, Calendar, Filter, ArrowLeft, Bell } from 'lucide-react';
import './NotificationCenter.css';
import * as networkingAPI from '@/services/api/networking';
import toast from 'react-hot-toast';

const NotificationCenter = ({ onClose, setUnreadCount }) => {
  console.log('NotificationCenter rendered!'); // Debug log
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await networkingAPI.getNotifications(filter, 50, 1);
      
      if (response && response.success) {
        setNotifications(response.notifications || []);
        // Calculate unread count from fetched notifications
        const unread = (response.notifications || []).filter(n => !n.read).length;
        setLocalUnreadCount(unread);
      } else {
        // If response is not successful, set empty notifications
        setNotifications([]);
        setLocalUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set empty notifications even on error
      setNotifications([]);
      setLocalUnreadCount(0);
      // toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type) => {
    const iconMap = {
      connection: UserPlus,
      message: MessageCircle,
      like: ThumbsUp,
      comment: ThumbsUp,
      view: Eye,
      job: Briefcase,
      group: Users,
      event: Calendar,
      system: Eye
    };
    return iconMap[type] || Eye;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'connection', label: 'Connections' },
    { value: 'message', label: 'Messages' },
    { value: 'like', label: 'Interactions' },
    { value: 'job', label: 'Jobs' },
    { value: 'event', label: 'Events' },
    { value: 'group', label: 'Groups' }
  ];

  const handleMarkAllRead = async () => {
    try {
      const response = await networkingAPI.markAllNotificationsAsRead();
      
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
        setLocalUnreadCount(0);
        
        // Update parent component
        if (setUnreadCount) {
          setUnreadCount(0);
        }
        
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      try {
        await networkingAPI.markNotificationAsRead(notification.id);
        
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        
        setLocalUnreadCount(prev => Math.max(0, prev - 1));
        
        // Update parent component
        if (setUnreadCount) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Navigate to link if available
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      connection: '#3b82f6',
      message: '#10b981',
      like: '#f59e0b',
      comment: '#f59e0b',
      view: '#8b5cf6',
      job: '#ef4444',
      group: '#06b6d4',
      event: '#ec4899',
      system: '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div 
      className="notification-center-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(66, 153, 225, 0.8)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '80px 20px 20px',
        zIndex: 9999
      }}
    >
      <div 
        className="notification-center"
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(66, 153, 225, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          border: '3px solid #4299e1',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        {/* Header */}
        <div 
          className="notification-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '2px solid #4299e1',
            background: 'linear-gradient(135deg, #4299e1, #3b82f6)',
            color: '#FFFFFF'
          }}
        >
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="back-btn" 
              onClick={onClose} 
              title="Back to Networking Arena"
              style={{
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#FFFFFF' }}>
              Notifications
            </h2>
            {!isLoading && localUnreadCount > 0 && (
              <span className="unread-count-badge">{localUnreadCount} new</span>
            )}
          </div>
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div 
            className="loading-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 2rem',
              minHeight: '400px'
            }}
          >
            <div className="spinner" style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(66, 153, 225, 0.2)',
              borderTopColor: '#4299e1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>Loading notifications...</p>
          </div>
        ) : (
          <>
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
              {localUnreadCount > 0 && (
                <button className="mark-read-btn" onClick={handleMarkAllRead}>
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icon = getIconForType(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      style={{ cursor: notification.link ? 'pointer' : 'default' }}
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
                        <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      {!notification.read && (
                        <div className="notification-dot"></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div 
                  className="no-notifications"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    minHeight: '400px'
                  }}
                >
                  <div 
                    className="empty-notification-icon"
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #f5f8fb, #e8ecf0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      boxShadow: '0 8px 16px rgba(66, 153, 225, 0.1), inset 0 -2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Bell size={48} style={{ color: '#4299e1', opacity: 0.4 }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                    No Notifications
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: '#64748b', margin: 0, maxWidth: '300px' }}>
                    You're all caught up! Check back later for new updates.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
