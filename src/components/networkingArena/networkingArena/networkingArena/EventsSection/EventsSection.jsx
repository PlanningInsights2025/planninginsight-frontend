import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Video, Plus, Search, Filter, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import * as networkingApi from '@/services/api/networking';
import './EventsSection.css';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch both my events and upcoming events
      const [myEventsResponse, upcomingResponse] = await Promise.all([
        networkingApi.getMyEvents(),
        networkingApi.getUpcomingEvents()
      ]);

      if (myEventsResponse.success) {
        setMyEvents(myEventsResponse.events);
      }

      if (upcomingResponse.success) {
        setUpcomingEvents(upcomingResponse.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Silently fail - empty state will be shown
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };

  const handleCreateEvent = async (newEvent) => {
    try {
      const response = await networkingApi.createEvent(newEvent);
      
      if (response.success) {
        setMyEvents(prev => [response.event, ...prev]);
        toast.success('Event created successfully');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      // Silently fail
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleRegister = async (eventId) => {
    try {
      const response = await networkingApi.registerForEvent(eventId);
      
      if (response.success) {
        // Move event from upcoming to my events
        const event = upcomingEvents.find(e => e.id === eventId);
        if (event) {
          setMyEvents(prev => [{ ...event, status: 'registered' }, ...prev]);
          setUpcomingEvents(prev => prev.filter(e => e.id !== eventId));
        }
        toast.success('Registered for event successfully');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      // Silently fail
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      const response = await networkingApi.cancelEventRegistration(eventId);
      
      if (response.success) {
        setMyEvents(prev => prev.filter(e => e.id !== eventId));
        toast.success('Registration cancelled');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      // Silently fail
    }
  };

  const allEvents = activeTab === 'upcoming' ? [...myEvents, ...upcomingEvents] : myEvents.filter(e => new Date(e.endDate) < new Date());

  return (
    <div className="events-section">
      {/* Header */}
      <div className="events-header">
        <h2>
          <Calendar size={24} />
          Events
        </h2>
        <button className="create-event-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Event
        </button>
      </div>

      {/* Search and Filter */}
      <div className="events-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="events-tabs">
        <button
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({[...myEvents, ...upcomingEvents].length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
        <button
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar View
        </button>
      </div>

      {/* Content */}
      <div className="events-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading events...</p>
          </div>
        ) : activeTab === 'upcoming' ? (
          <div className="events-list">
            {allEvents.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <p>No upcoming events</p>
                <button className="create-event-btn" onClick={() => setShowCreateModal(true)}>
                  Create Your First Event
                </button>
              </div>
            ) : (
              allEvents.map((event) => {
                const isRegistered = myEvents.some(e => e.id === event.id);
                return (
                  <div key={event.id} className="event-card">
                    <div className="event-info">
                      <div className="event-type-badge">
                        {event.mode === 'online' ? (
                          <>
                            <Video size={14} />
                            Virtual
                          </>
                        ) : event.mode === 'offline' ? (
                          <>
                            <MapPin size={14} />
                            In-Person
                          </>
                        ) : (
                          <>
                            <MapPin size={14} />
                            Hybrid
                          </>
                        )}
                      </div>
                      <h3>{event.title}</h3>
                      <p className="event-description">{event.description}</p>
                      <div className="event-details">
                        <div className="detail-item">
                          <Calendar size={16} />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="detail-item">
                          <Clock size={16} />
                          <span>{formatTime(event.startDate, event.endDate)}</span>
                        </div>
                        <div className="detail-item">
                          {event.mode === 'online' ? (
                            <>
                              <Video size={16} />
                              <span>Virtual Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin size={16} />
                              <span>{event.location?.city || event.location?.venue || 'In-Person'}</span>
                            </>
                          )}
                        </div>
                        <div className="detail-item">
                          <Users size={16} />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                      <div className="event-organizer">
                        <span>Organized by {event.organizer?.profile?.firstName} {event.organizer?.profile?.lastName}</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button className="btn-view-details" onClick={() => handleViewDetails(event)}>
                        View Details
                      </button>
                      {isRegistered ? (
                        <button 
                          className="btn-cancel-rsvp" 
                          onClick={() => handleCancelRegistration(event.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button 
                          className="btn-rsvp-going" 
                          onClick={() => handleRegister(event.id)}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : activeTab === 'past' ? (
          <div className="events-list">
            {allEvents.length === 0 ? (
              <div className="empty-state">
                <p>No past events</p>
              </div>
            ) : (
              allEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <div className="event-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        <span>{event.attendees} attended</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="calendar-view">
            <p>Calendar view coming soon...</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />

      <EventDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventsSection;
