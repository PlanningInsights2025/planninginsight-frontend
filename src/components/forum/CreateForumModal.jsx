import React, { useState } from 'react';
import api from '../../services/api/api';

const CreateForumModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Urban Design',
    motivation: '',
    intent: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Urban Design',
    'Mobility',
    'Heritage',
    'Sustainability',
    'Infrastructure',
    'Housing',
    'Policy',
    'Technology',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Forum title is required');
      // Scroll to top of modal to show title field
      const modal = document.querySelector('[data-modal="create-forum"]');
      if (modal) {
        modal.scrollTop = 0;
      }
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    // Validate minimum length for optional fields if provided
    if (formData.motivation.trim() && formData.motivation.trim().length < 10) {
      setError('Motivation must be at least 10 characters or leave it empty');
      return;
    }
    
    if (formData.intent.trim() && formData.intent.trim().length < 10) {
      setError('Intent must be at least 10 characters or leave it empty');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('Please login to create a forum');
        setLoading(false);
        return;
      }

      // Prepare data - only include optional fields if they have content
      const dataToSend = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category
      };
      
      // Only include motivation and intent if they have content
      if (formData.motivation.trim()) {
        dataToSend.motivation = formData.motivation.trim();
      }
      if (formData.intent.trim()) {
        dataToSend.intent = formData.intent.trim();
      }

      const response = await api.post('/forum/create', dataToSend);

      if (response.data.success) {
        alert('Forum submitted for approval! You will be notified once it is reviewed.');
        setFormData({
          title: '',
          description: '',
          category: 'Urban Design',
          motivation: '',
          intent: ''
        });
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error creating forum:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.data?.message) {
        // Show the exact backend validation error
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create forum. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} data-modal="create-forum">
        <div style={styles.header}>
          <h2 style={styles.title}>Create New Forum</h2>
          <button style={styles.closeButton} onClick={onClose} type="button">×</button>
        </div>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Forum Title <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Urban Planning Best Practices 2026"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category <span style={styles.required}>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.select}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Description <span style={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this forum is about and what topics will be discussed..."
              required
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Motivation (Why create this forum?)
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              placeholder="Explain why this forum is needed and what gap it fills..."
              rows="3"
              style={styles.textarea}
            />
            <small style={styles.hint}>Optional but recommended for faster approval (min 10 characters if provided)</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Intent (What discussions will this enable?)
            </label>
            <textarea
              name="intent"
              value={formData.intent}
              onChange={handleChange}
              placeholder="What kind of discussions and collaborations do you envision..."
              rows="3"
              style={styles.textarea}
            />
            <small style={styles.hint}>Optional but recommended for faster approval (min 10 characters if provided)</small>
          </div>

          <div style={styles.infoBox}>
            <strong>ℹ️ Approval Process:</strong>
            <p style={styles.infoText}>
              Your forum will be submitted for admin review. You'll be notified via email and real-time notification once it's approved or if any changes are needed.
            </p>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.3s ease'
  },
  error: {
    margin: '0 24px',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '6px',
    fontSize: '14px'
  },
  form: {
    padding: '24px',
    overflow: 'auto',
    flex: 1
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  required: {
    color: '#f44336'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  },
  hint: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    color: '#666'
  },
  infoBox: {
    padding: '16px',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#1976d2'
  },
  infoText: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#555'
  },
  actions: {
    display: 'flex',
    paddingTop: '16px',
    borderTop: '1px solid #e0e0e0',
    marginTop: '24px',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '12px 24px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#666',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#8bc34a',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#7cb342'
    },
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    }
  }
};

export default CreateForumModal;
