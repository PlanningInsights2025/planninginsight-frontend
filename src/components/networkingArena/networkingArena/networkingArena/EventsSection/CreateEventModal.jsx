import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, FileText, Users, Image } from 'lucide-react';
import './CreateEventModal.css';

const CreateEventModal = ({ isOpen, onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    eventType: 'in-person',
    maxAttendees: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: `${formData.startTime} - ${formData.endTime}`,
      location: formData.location,
      type: formData.eventType,
      attendees: 0,
      image: '/api/placeholder/400/200',
      rsvp: null,
      organizer: 'You',
      maxAttendees: parseInt(formData.maxAttendees) || null
    };
    
    onCreateEvent(newEvent);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      eventType: 'in-person',
      maxAttendees: '',
      image: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-event-modal-overlay" onClick={handleClose}>
      <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Calendar size={24} />
            Create New Event
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>
              <FileText size={18} />
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Calendar size={18} />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Clock size={18} />
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Clock size={18} />
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Event Type *</label>
            <div className="event-type-selector">
              <label className={`type-option ${formData.eventType === 'in-person' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="eventType"
                  value="in-person"
                  checked={formData.eventType === 'in-person'}
                  onChange={handleChange}
                />
                <MapPin size={18} />
                In-Person
              </label>
              <label className={`type-option ${formData.eventType === 'virtual' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="eventType"
                  value="virtual"
                  checked={formData.eventType === 'virtual'}
                  onChange={handleChange}
                />
                <Video size={18} />
                Virtual
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>
              {formData.eventType === 'virtual' ? <Video size={18} /> : <MapPin size={18} />}
              {formData.eventType === 'virtual' ? 'Meeting Link *' : 'Location *'}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={formData.eventType === 'virtual' ? 'https://meet.example.com/event' : 'Enter venue address'}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Users size={18} />
              Max Attendees (Optional)
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              <Calendar size={18} />
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
