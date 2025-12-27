import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Calendar, Clock, MapPin, Bell, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react'
import './Events.css'

/**
 * Events Page Component
 * Displays all upcoming events with filtering and details
 */
const Events = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  /**
   * Load events data
   */
  useEffect(() => {
    loadEvents()
  }, [])

  /**
   * Filter events by category
   */
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredEvents(events)
    } else {
      setFilteredEvents(events.filter(event => event.category === selectedCategory))
    }
  }, [selectedCategory, events])

  /**
   * Show toast notification
   */
  const showToastNotification = (message) => {
    if (message.includes('Unregistered')) {
      toast(message, {
        icon: '✓',
        style: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#fff',
          padding: '1rem 1.25rem',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }
      })
    } else {
      toast.success(message, {
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
          padding: '1rem 1.25rem',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }
      })
    }
  }

  /**
   * Handle notifications button click
   */
  const handleEnableNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    if (!notificationsEnabled) {
      showToastNotification('✓ Notifications enabled! You will receive updates for new events.')
    } else {
      showToastNotification('✓ Notifications disabled')
    }
  }

  /**
   * Load mock events data
   */
  const loadEvents = () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Urban Planning Webinar',
        description: 'Learn about latest trends in sustainable urban planning and smart cities',
        date: '2025-02-20',
        time: '2:00 PM - 3:30 PM',
        location: 'Online',
        category: 'webinar',
        type: 'Webinar',
        attendees: 245,
        registered: false,
        image: '🏙️'
      },
      {
        id: 2,
        title: 'Course Submission Deadline',
        description: 'Final submission deadline for Smart Cities course projects',
        date: '2025-02-25',
        time: '11:59 PM',
        location: 'Learning Centre',
        category: 'deadline',
        type: 'Deadline',
        attendees: 0,
        registered: false,
        image: '📝'
      },
      {
        id: 3,
        title: 'Networking Meetup',
        description: 'Connect with urban planners, architects, and city officials',
        date: '2025-03-05',
        time: '5:30 PM - 7:30 PM',
        location: 'Convention Center, Downtown',
        category: 'networking',
        type: 'Meetup',
        attendees: 156,
        registered: false,
        image: '🤝'
      },
      {
        id: 4,
        title: 'Workshop: GIS Analysis',
        description: 'Hands-on workshop on Geographic Information Systems for urban planning',
        date: '2025-03-10',
        time: '10:00 AM - 1:00 PM',
        location: 'Tech Hub Building',
        category: 'workshop',
        type: 'Workshop',
        attendees: 89,
        registered: true,
        image: '🗺️'
      },
      {
        id: 5,
        title: 'Publication Release: Urban Future',
        description: 'Launch of new book on innovative approaches to urban sustainability',
        date: '2025-03-15',
        time: '3:00 PM - 4:30 PM',
        location: 'Community Library',
        category: 'seminar',
        type: 'Seminar',
        attendees: 320,
        registered: false,
        image: '📚'
      },
      {
        id: 6,
        title: 'Forum Discussion: Green Spaces',
        description: 'Discuss strategies for increasing green spaces in urban areas',
        date: '2025-03-20',
        time: '6:00 PM - 7:30 PM',
        location: 'Online',
        category: 'forum',
        type: 'Discussion',
        attendees: 412,
        registered: true,
        image: '💬'
      },
      {
        id: 7,
        title: 'Certification Exam',
        description: 'Urban Planning Professional Certification Examination',
        date: '2025-03-25',
        time: '9:00 AM - 12:00 PM',
        location: 'Testing Center',
        category: 'exam',
        type: 'Exam',
        attendees: 45,
        registered: false,
        image: '🎓'
      },
      {
        id: 8,
        title: 'Case Study Presentation',
        description: 'Real-world case studies of successful urban development projects',
        date: '2025-04-02',
        time: '2:00 PM - 3:30 PM',
        location: 'Online',
        category: 'seminar',
        type: 'Presentation',
        attendees: 267,
        registered: false,
        image: '📊'
      }
    ]
    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
  }

  /**
   * Handle event registration
   */
  const handleRegister = (eventId) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, registered: !event.registered } : event
      )
    )
    
    const event = events.find(e => e.id === eventId)
    const message = event?.registered ? 'Unregistered from event' : 'Registered for event'
    showToastNotification(message)
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  /**
   * Get category color
   */
  const getCategoryColor = (category) => {
    const colors = {
      webinar: '#3b82f6',
      deadline: '#ef4444',
      networking: '#10b981',
      workshop: '#f59e0b',
      seminar: '#8b5cf6',
      forum: '#ec4899',
      exam: '#14b8a6',
      course: '#06b6d4'
    }
    return colors[category] || '#6366f1'
  }

  /**
   * Filter categories
   */
  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'webinar', label: 'Webinars' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'networking', label: 'Networking' },
    { id: 'deadline', label: 'Deadlines' },
    { id: 'seminar', label: 'Seminars' },
    { id: 'forum', label: 'Discussions' },
    { id: 'exam', label: 'Exams' }
  ]

  return (
    <div className="events-page">
      <div className="events-container">
        {/* Header */}
        <div className="events-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            title="Go back"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="header-top">
            <div className="header-content">
              <h1>Upcoming Events</h1>
              <p>Stay updated with webinars, workshops, and networking events</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <Calendar size={24} />
              <div>
                <span className="stat-label">Total Events</span>
                <span className="stat-value">{events.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <CheckCircle size={24} />
              <div>
                <span className="stat-label">Registered</span>
                <span className="stat-value">{events.filter(e => e.registered).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <div className="event-image">{event.image}</div>
                  <div className="event-badge" style={{ backgroundColor: getCategoryColor(event.category) }}>
                    {event.type}
                  </div>
                </div>

                <div className="event-card-body">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>

                  <div className="event-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="event-stats">
                    <span className="attendee-count">
                      {event.attendees > 0 ? `${event.attendees} attending` : 'New event'}
                    </span>
                  </div>
                </div>

                <div className="event-card-footer">
                  <button
                    className={`btn ${event.registered ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleRegister(event.id)}
                  >
                    {event.registered ? 'Cancel Registration' : 'Register'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <AlertCircle size={48} />
              <h3>No events found</h3>
              <p>Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Subscribe Section */}
        <div className="subscribe-section">
          <div className="subscribe-content">
            <Bell size={32} />
            <div>
              <h3>Stay Updated</h3>
              <p>Get notifications for new events and registration reminders</p>
            </div>
          </div>
          <button 
            className={`btn ${notificationsEnabled ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleEnableNotifications}
          >
            {notificationsEnabled ? '✓ Notifications Enabled' : 'Enable Notifications'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Events
