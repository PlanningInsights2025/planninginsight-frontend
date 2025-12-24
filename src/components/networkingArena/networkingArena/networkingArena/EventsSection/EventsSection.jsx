import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Video, Plus, Search, Filter, ExternalLink } from 'lucide-react';
import './EventsSection.css';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tech Conference 2024',
      date: 'Dec 15, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'San Francisco, CA',
      type: 'in-person',
      attendees: 234,
      image: '/api/placeholder/400/200',
      rsvp: 'going',
      organizer: 'Tech Events Inc.',
      description: 'Annual technology conference featuring the latest innovations'
    },
    {
      id: 2,
      title: 'Web Development Workshop',
      date: 'Dec 20, 2024',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual Event',
      type: 'virtual',
      attendees: 456,
      image: '/api/placeholder/400/200',
      rsvp: 'interested',
      organizer: 'Dev Community',
      description: 'Hands-on workshop covering React and Next.js best practices'
    },
    {
      id: 3,
      title: 'Networking Mixer',
      date: 'Jan 5, 2025',
      time: '6:00 PM - 9:00 PM',
      location: 'New York, NY',
      type: 'in-person',
      attendees: 89,
      image: '/api/placeholder/400/200',
      rsvp: null,
      organizer: 'Professional Network Group',
      description: 'Connect with professionals in your industry over drinks'
    }
  ]);

  const [pastEvents] = useState([
    {
      id: 4,
      title: 'AI Summit 2024',
      date: 'Nov 10, 2024',
      attendees: 567,
      type: 'virtual',
      rsvp: 'attended'
    }
  ]);

  const handleCreateEvent = (newEvent) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleRSVP = (eventId, status) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, rsvp: status } : event
      )
    );
    setSelectedEvent(prev => prev ? { ...prev, rsvp: status } : null);
  };

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
          Upcoming ({events.length})
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
        {activeTab === 'upcoming' && (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <img src={event.image} alt={event.title} className="event-image" />
                <div className="event-info">
                  <div className="event-type-badge">
                    {event.type === 'virtual' ? (
                      <>
                        <Video size={14} />
                        Virtual
                      </>
                    ) : (
                      <>
                        <MapPin size={14} />
                        In-Person
                      </>
                    )}
                  </div>
                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="detail-item">
                      {event.type === 'virtual' ? (
                        <>
                          <Video size={16} />
                          <span>{event.location}</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>
                    <div className="detail-item">
                      <Users size={16} />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                  <div className="event-organizer">
                    <span>Organized by {event.organizer}</span>
                  </div>
                </div>
                <div className="event-actions">
                  {event.rsvp === 'going' && (
                    <button className="btn-rsvp going">
                      ✓ Going
                    </button>
                  )}
                  {event.rsvp === 'interested' && (
                    <button className="btn-rsvp interested">
                      ⭐ Interested
                    </button>
                  )}
                  {!event.rsvp && (
                    <div className="rsvp-buttons">
                      <button className="btn-rsvp going">
                        RSVP
                      </button>
                      <button className="btn-rsvp interested">
                        Interested
                      </button>
                    </div>
                  )}
                  <button className="btn-view-event" onClick={() => handleViewDetails(event)}>
                    <ExternalLink size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="past-events-list">
            {pastEvents.map((event) => (
              <div key={event.id} className="past-event-card">
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <span>
                      <Calendar size={14} />
                      {event.date}
                    </span>
                    <span>
                      <Users size={14} />
                      {event.attendees} attendees
                    </span>
                    {event.type === 'virtual' && (
                      <span className="event-type-badge virtual">
                        <Video size={14} />
                        Virtual
                      </span>
                    )}
                  </div>
                </div>
                <button className="btn-view-recording">
                  View Recording
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <div className="calendar-placeholder">
              <Calendar size={48} />
              <p>Calendar view coming soon</p>
              <p className="calendar-subtitle">View all your events in a calendar format</p>
            </div>
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
        onRSVP={handleRSVP}
      />
    </div>
  );
};

export default EventsSection;
