import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { newsroomAPI } from '../../../services/api/newsroom';
import './CollaborateEvent.css';

const CollaborateEvent = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [createEventApi] = useApi(newsroomAPI.createEvent);

  const [form, setForm] = useState({
    title: '',
    theme: '',
    rules: '',
    tags: '',
    crossList: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.theme.trim()) e.theme = 'Short description is required';
    // rules optional
    return e;
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) {
      setErrors(eObj);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        theme: form.theme,
        rules: form.rules,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        crossList: form.crossList,
        createdAt: new Date().toISOString(),
      };

      await createEventApi(payload, { successMessage: 'Event submitted for review' });
      showNotification('Event submitted successfully', 'success');
      navigate('/news');
    } catch (err) {
      showNotification('Failed to submit event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="collaborate-page">
      <div className="container">
        <div className="collab-panel">
          <header className="collab-header">
            <h1>Create Sponsored Event / Collaboration</h1>
            <p className="muted">Fill out the details below to submit an event for review. Required fields are marked.</p>
          </header>

          <form className="collab-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label className="form-label">Title <span className="required">*</span></label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Event title"
              />
              {errors.title && <div className="field-error">{errors.title}</div>}
            </div>

            <div className="form-row">
              <label className="form-label">Theme / Short Description <span className="required">*</span></label>
              <textarea
                className={`form-textarea ${errors.theme ? 'has-error' : ''}`}
                value={form.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                placeholder="Briefly describe the theme or goals of the collaboration"
              />
              {errors.theme && <div className="field-error">{errors.theme}</div>}
            </div>

            <div className="form-row">
              <label className="form-label">Rules / Word Limits</label>
              <textarea
                className="form-textarea"
                value={form.rules}
                onChange={(e) => handleChange('rules', e.target.value)}
                placeholder="Optional: submission rules, word limits or eligibility"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="e.g. sustainability, retrofit, policy"
              />
            </div>

            <div className="form-row small">
              <label className="form-label">Cross-list under Learning Centre</label>
              <div className="toggle-row">
                <label className="toggle">
                  <input type="checkbox" checked={form.crossList} onChange={(e) => handleChange('crossList', e.target.checked)} />
                  <span className="toggle-track" />
                </label>
                <span className="small-meta muted">Cross-posting will list this event in the Learning Centre where applicable.</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-news btn-secondary" onClick={() => navigate('/news')}>Cancel</button>
              <button type="reset" className="btn-news btn-ghost" onClick={() => setForm({ title: '', theme: '', rules: '', tags: '', crossList: false })}>Reset</button>
              <button type="submit" className="btn-news btn-primary" disabled={submitting}>
                <Check size={16} />
                {submitting ? 'Submitting...' : 'Submit Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollaborateEvent;
