import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle, Trash2, Filter, X } from 'lucide-react'
import './Notifications.css'

/**
 * Notifications Page Component
 * Displays all notifications with detailed information
 */
const Notifications = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Apply dark mode from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [])
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: '👤',
      title: 'New Connection Request',
      description: 'Sarah Johnson wants to connect with you',
      time: '5 minutes ago',
      read: false,
      badge: 'connection',
      image: null
    },
    {
      id: 2,
      icon: '💬',
      title: 'New Message',
      description: 'Michael Chen sent you a message',
      time: '15 minutes ago',
      read: false,
      badge: 'message',
      image: null
    },
    {
      id: 3,
      icon: '👍',
      title: 'Post Interaction',
      description: 'Emily Rodriguez and 12 others liked your post',
      time: '1 hour ago',
      read: false,
      badge: 'like',
      image: null
    },
    {
      id: 4,
      icon: '👁️',
      title: 'Profile View',
      description: 'Your profile was viewed by 5 people today',
      time: '2 hours ago',
      read: false,
      badge: 'view',
      image: null
    },
    {
      id: 5,
      icon: '💼',
      title: 'Job Opportunity',
      description: 'New job posting matches your skills: Senior Developer at Tech Corp',
      time: '3 hours ago',
      read: false,
      badge: 'job',
      image: null
    },
    {
      id: 6,
      icon: '👥',
      title: 'Group Activity',
      description: 'New discussion in "React Developers" group',
      time: '5 hours ago',
      read: false,
      badge: 'group',
      image: null
    }
  ])

  const [filterType, setFilterType] = useState('all')

  /**
   * Mark notification as read
   */
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  /**
   * Mark all as read
   */
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  /**
   * Delete notification
   */
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  /**
   * Clear all notifications
   */
  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([])
    }
  }

  /**
   * Get filtered notifications
   */
  const getFilteredNotifications = () => {
    if (filterType === 'all') return notifications
    return notifications.filter(notif => notif.badge === filterType)
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="notifications-page">
      {loading && (
        <div className="loading-alert">
          <div className="loading-content">
            <div className="spinner" />
            <p>Loading all activities...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-alert">
          <div className="error-content">
            <X size={20} color="#dc2626" />
            <p>{error}</p>
            <button 
              className="close-error"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="notifications-header">
        <div className="header-row">
          <button 
            className="back-arrow"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            ←
          </button>
          
          <h1 className="page-title">Notifications</h1>
          
          {unreadCount > 0 && (
            <span className="badge-new">{unreadCount} new</span>
          )}
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="filters-actions-bar">
        <div className="filter-dropdown">
          <Filter size={18} />
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="connection">Connections</option>
            <option value="job">Jobs</option>
            <option value="message">Messages</option>
          </select>
        </div>

        {unreadCount > 0 && (
          <button 
            className="btn-mark-read"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="notifications-list-container">
        {filteredNotifications.length > 0 ? (
          <ul className="notifications-list">
            {filteredNotifications.map((notif) => (
              <li 
                key={notif.id}
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="notification-icon-badge">
                  {notif.icon}
                </div>
                
                <div className="notification-content">
                  <h3 className="notification-title">{notif.title}</h3>
                  <p className="notification-description">{notif.description}</p>
                  <span className="notification-time">{notif.time}</span>
                </div>

                {!notif.read && (
                  <div className="unread-dot" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <Bell size={64} />
            <h2>No Notifications</h2>
            <p>
              {filterType === 'all' 
                ? 'You\'re all caught up! No new notifications.' 
                : `No ${filterType} notifications.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
