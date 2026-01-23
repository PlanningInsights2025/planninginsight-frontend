import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../../services/api/forum';

// Minimal forum list page wired to backend API
const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadForums = async () => {
      try {
        setLoading(true);
        const data = await forumAPI.getForums();
        // API returns { success, data: { forums, pagination } }
        setForums(data?.data?.forums || []);
      } catch (err) {
        console.error('Error loading forums:', err);
        setError('Failed to load forums. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadForums();
  }, []);

  const handleCreateClick = () => {
    navigate('/forum/create');
  };

  const handleForumClick = (forum) => {
    navigate(`/forum/${forum._id || forum.id}`);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading forums...</div>;

  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '600' }}>Discussion Forums</h1>
        <button onClick={handleCreateClick} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#524393', color: '#fff', cursor: 'pointer' }}>
          Create Forum
        </button>
      </div>

      {forums.length === 0 ? (
        <p>No forums yet. Be the first to create one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {forums.map((forum) => (
            <div
              key={forum._id || forum.id}
              onClick={() => handleForumClick(forum)}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                background: '#fff'
              }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{forum.title}</h2>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.5rem' }}>{forum.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                <span>{forum.category}</span>
                {typeof forum.threadCount === 'number' && (
                  <span style={{ marginLeft: '1rem' }}>{forum.threadCount} threads</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumList;
