import React from 'react';
import { X, Calendar, Clock, MapPin, Video, Users, ExternalLink, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import './EventDetailsModal.css';

const EventDetailsModal = ({ isOpen, onClose, event, onRSVP }) => {
  if (!isOpen || !event) return null;

  const handleRSVP = (status) => {
    onRSVP(event.id, status);
  };

  return (
    <div className="event-details-modal-overlay" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="back-btn" onClick={onClose}>
          <ArrowLeft size={20} />
          Back to Events
        </button>

        {/* Event Image */}
        <div className="event-details-image-wrapper">
          <img src={event.image} alt={event.title} className="event-details-image" />
          <div className="event-type-badge-large">
            {event.type === 'virtual' ? (
              <>
                <Video size={18} />
                Virtual Event
              </>
            ) : (
              <>
                <MapPin size={18} />
                In-Person Event
              </>
            )}
          </div>
        </div>

        {/* Event Content */}
        <div className="event-details-content">
          {/* Header */}
          <div className="event-details-header">
            <h1>{event.title}</h1>
            <p className="event-organizer-info">
              Organized by <strong>{event.organizer}</strong>
            </p>
          </div>

          {/* Quick Info */}
          <div className="event-quick-info">
            <div className="info-item">
              <div className="info-icon">
                <Calendar size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Date</span>
                <span className="info-value">{event.date}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Clock size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Time</span>
                <span className="info-value">{event.time}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                {event.type === 'virtual' ? <Video size={20} /> : <MapPin size={20} />}
              </div>
              <div className="info-content">
                <span className="info-label">{event.type === 'virtual' ? 'Platform' : 'Location'}</span>
                <span className="info-value">{event.location}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Users size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Attendees</span>
                <span className="info-value">{event.attendees} going</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="event-description-section">
            <h3>About This Event</h3>
            <p>{event.description}</p>
            <p>
              Join us for an exciting event where professionals from various industries come together to learn, 
              network, and share insights. This event promises to be engaging with expert speakers, interactive 
              sessions, and plenty of networking opportunities.
            </p>
          </div>

          {/* Additional Details */}
          <div className="event-additional-info">
            <h3>Event Details</h3>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">Technology & Innovation</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Language:</span>
                <span className="detail-value">English</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Registration Deadline:</span>
                <span className="detail-value">{event.date}</span>
              </div>
              {event.maxAttendees && (
                <div className="detail-row">
                  <span className="detail-label">Max Capacity:</span>
                  <span className="detail-value">{event.maxAttendees} people</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="event-details-actions">
            <div className="rsvp-actions">
              {event.rsvp === 'going' ? (
                <button className="btn-rsvp-large going">
                  ✓ You're Going
                </button>
              ) : event.rsvp === 'interested' ? (
                <>
                  <button className="btn-rsvp-large interested">
                    ⭐ Interested
                  </button>
                  <button className="btn-rsvp-large secondary" onClick={() => handleRSVP('going')}>
                    Confirm Going
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-rsvp-large primary" onClick={() => handleRSVP('going')}>
                    RSVP - I'm Going
                  </button>
                  <button className="btn-rsvp-large secondary" onClick={() => handleRSVP('interested')}>
                    Mark as Interested
                  </button>
                </>
              )}
            </div>

            <div className="secondary-actions">
              <button className="icon-btn" title="Share Event">
                <Share2 size={20} />
              </button>
              <button className="icon-btn" title="Save Event">
                <Bookmark size={20} />
              </button>
              {event.type === 'virtual' && (
                <button className="icon-btn" title="Add to Calendar">
                  <Calendar size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
