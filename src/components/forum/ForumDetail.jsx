import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forumAPI } from '../../services/api/forum';

// Simple forum detail page that lists questions/threads
const ForumDetail = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [forumRes, questionsRes] = await Promise.all([
          forumAPI.getForum(forumId),
          forumAPI.getQuestions(forumId)
        ]);

        setForum(forumRes?.data || forumRes?.forum || null);
        setQuestions(questionsRes?.data?.questions || []);
      } catch (err) {
        console.error('Error loading forum detail:', err);
        setError('Failed to load forum.');
      } finally {
        setLoading(false);
      }
    };

    if (forumId) {
      loadData();
    }
  }, [forumId]);

  const handleBack = () => navigate('/forum');

  if (loading) return <div style={{ padding: '2rem' }}>Loading forum...</div>;

  if (error) return (
    <div style={{ padding: '2rem' }}>
      <button onClick={handleBack} style={{ marginBottom: '1rem' }}>← Back</button>
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );

  if (!forum) return (
    <div style={{ padding: '2rem' }}>
      <button onClick={handleBack} style={{ marginBottom: '1rem' }}>← Back</button>
      <div>Forum not found.</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem' }}>
      <button onClick={handleBack} style={{ marginBottom: '1rem' }}>← Back to forums</button>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>{forum.title}</h1>
      <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{forum.description}</p>
      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>{forum.category}</div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Questions</h2>
      {questions.length === 0 ? (
        <p>No questions yet in this forum.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {questions.map((q) => (
            <div
              key={q._id || q.id}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: '#fff'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{q.title}</div>
              {q.content && (
                <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                  {q.content.length > 160 ? `${q.content.slice(0, 160)}...` : q.content}
                </p>
              )}
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {q.answerCount != null && <span>{q.answerCount} answers</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumDetail;
