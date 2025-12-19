import React, { useState } from 'react';
import { X, Users, FileText, Lock, Globe, Image as ImageIcon } from 'lucide-react';
import './CreateGroupModal.css';

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: 'technology',
    rules: ''
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
    
    const newGroup = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      privacy: formData.privacy,
      category: formData.category,
      members: 1,
      image: '/api/placeholder/100/100',
      unreadPosts: 0,
      role: 'admin'
    };
    
    onCreateGroup(newGroup);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      privacy: 'public',
      category: 'technology',
      rules: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="create-group-modal-overlay" onClick={handleClose}>
      <div className="create-group-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Users size={24} />
            Create New Group
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="group-form">
          <div className="form-group">
            <label>
              <FileText size={18} />
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter group name"
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
              placeholder="Describe what your group is about..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Privacy Setting *</label>
            <div className="privacy-selector">
              <label className={`privacy-option ${formData.privacy === 'public' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={formData.privacy === 'public'}
                  onChange={handleChange}
                />
                <Globe size={18} />
                <div className="privacy-info">
                  <span className="privacy-title">Public</span>
                  <span className="privacy-desc">Anyone can find and join</span>
                </div>
              </label>
              <label className={`privacy-option ${formData.privacy === 'private' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={formData.privacy === 'private'}
                  onChange={handleChange}
                />
                <Lock size={18} />
                <div className="privacy-info">
                  <span className="privacy-title">Private</span>
                  <span className="privacy-desc">Requires approval to join</span>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              Group Rules (Optional)
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Set guidelines for your group members..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              <Users size={18} />
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
