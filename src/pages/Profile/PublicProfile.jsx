import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, MapPin, Briefcase, BookOpen, Calendar, Eye, ArrowLeft } from 'lucide-react';
import './PublicProfile.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Fetch user's published articles to derive profile info
      const res = await fetch(`${API_BASE}/newsroom/articles?author=${userId}&status=published&limit=20`);
      const data = await res.json();

      if (data.success && data.data.articles.length > 0) {
        const firstArticle = data.data.articles[0];
        setProfile(firstArticle.author);
        setArticles(data.data.articles);
      } else {
        // Try fetching with approvalStatus approved
        const res2 = await fetch(`${API_BASE}/newsroom/articles?author=${userId}&approvalStatus=approved&limit=20`);
        const data2 = await res2.json();
        if (data2.success && data2.data.articles.length > 0) {
          setProfile(data2.data.articles[0].author);
          setArticles(data2.data.articles);
        } else {
          setError('No public profile found for this author.');
        }
      }
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pp-loading">
        <div className="pp-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pp-error">
        <h2>Profile not available</h2>
        <p>{error || 'This author has no published articles yet.'}</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const displayName = profile.profile?.firstName
    ? `${profile.profile.firstName} ${profile.profile.lastName || ''}`.trim()
    : profile.email;

  const uniqueId = `PI‑${profile._id?.toString().slice(-8).toUpperCase()}`;

  return (
    <div className="pp-page">
      <div className="pp-container">

        {/* Back Nav */}
        <button className="pp-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Profile Hero */}
        <div className="pp-hero">
          <div className="pp-avatar-wrap">
            {profile.profile?.avatar ? (
              <img src={profile.profile.avatar} alt={displayName} className="pp-avatar" />
            ) : (
              <div className="pp-avatar-placeholder">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="pp-hero-info">
            <h1 className="pp-name">{displayName}</h1>
            <div className="pp-uid">
              <Award size={15} />
              <span>{uniqueId}</span>
            </div>

            {profile.profile?.position && (
              <div className="pp-meta-item">
                <Briefcase size={15} />
                <span>{profile.profile.position}</span>
              </div>
            )}
            {profile.profile?.organization && (
              <div className="pp-meta-item">
                <BookOpen size={15} />
                <span>{profile.profile.organization}</span>
              </div>
            )}
            {profile.profile?.location && (
              <div className="pp-meta-item">
                <MapPin size={15} />
                <span>{profile.profile.location}</span>
              </div>
            )}

            {profile.profile?.bio && (
              <p className="pp-bio">{profile.profile.bio}</p>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="pp-stats">
          <div className="pp-stat">
            <span className="pp-stat-value">{articles.length}</span>
            <span className="pp-stat-label">Articles</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-value">
              {articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
            </span>
            <span className="pp-stat-label">Total Views</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-value">
              {articles.reduce((sum, a) => sum + (a.likesCount || 0), 0)}
            </span>
            <span className="pp-stat-label">Total Likes</span>
          </div>
        </div>

        {/* Published Articles */}
        <section className="pp-articles-section">
          <h2 className="pp-section-title">
            <BookOpen size={20} /> Published Articles
          </h2>

          {articles.length === 0 ? (
            <p className="pp-no-articles">No published articles yet.</p>
          ) : (
            <div className="pp-articles-grid">
              {articles.map(article => (
                <Link
                  key={article._id}
                  to={`/news/article/${article._id}`}
                  className="pp-article-card"
                >
                  {article.featuredImage && (
                    <div className="pp-article-img">
                      <img src={article.featuredImage} alt={article.title} />
                    </div>
                  )}
                  <div className="pp-article-body">
                    <span className="pp-article-category">{article.category}</span>
                    <h3 className="pp-article-title">{article.title}</h3>
                    {article.excerpt && (
                      <p className="pp-article-excerpt">
                        {article.excerpt.slice(0, 120)}{article.excerpt.length > 120 ? '...' : ''}
                      </p>
                    )}
                    <div className="pp-article-meta">
                      <span><Calendar size={13} /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                      <span><Eye size={13} /> {article.views || 0} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default PublicProfile;
