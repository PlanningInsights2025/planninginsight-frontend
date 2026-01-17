import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../../services/api/forum';

// Simple standalone forum creation page (in addition to modal)
const ForumCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Urban Design',
    motivation: '',
    intent: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
      };
      if (formData.motivation.trim()) payload.motivation = formData.motivation.trim();
      if (formData.intent.trim()) payload.intent = formData.intent.trim();

      const res = await forumAPI.createForum(payload);
      if (res?.success) {
        navigate('/forum');
      } else {
        setError(res?.message || 'Failed to create forum');
      }
    } catch (err) {
      console.error('Error creating forum:', err);
      setError(err.response?.data?.message || 'Failed to create forum');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' }}>Create Forum</h1>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Motivation (optional)</label>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Intent (optional)</label>
          <textarea
            name="intent"
            value={formData.intent}
            onChange={handleChange}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => navigate('/forum')}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#524393', color: '#fff', cursor: 'pointer' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForumCreate;
