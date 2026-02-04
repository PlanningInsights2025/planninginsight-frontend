import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsroomAPI } from '../../../services/api/newsroom';
import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import './HomeNewsPreview.css';

/**
 * Home News Preview Component
 * Displays latest newsroom articles on the homepage
 */
const HomeNewsPreview = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    try {
      setLoading(true);
      const response = await newsroomAPI.getPublicArticles({ 
        page: 1, 
        limit: 3,
        status: 'published',
        approvalStatus: 'approved'
      });
      
      setArticles(response.data.articles || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleReadMore = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  const handleViewAll = () => {
    navigate('/news');
  };

  if (loading) {
    return (
      <section className="home-news-preview">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading latest insights...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || articles.length === 0) {
    return null; // Don't show section if there are no articles
  }

  return (
    <section className="home-news-preview">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <div className="trending-badge">
              <TrendingUp size={20} />
              <span>Latest Insights</span>
            </div>
            <h2>From Our Newsroom</h2>
            <p>Explore the latest articles, research, and perspectives from industry experts</p>
          </div>
          <button className="view-all-btn" onClick={handleViewAll}>
            View All Articles
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {articles.map((article) => (
            <article key={article._id} className="article-card">
              {/* Featured Image */}
              {article.featuredImage && (
                <div className="article-image">
                  <img 
                    src={article.featuredImage} 
                    alt={article.title}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <span className="category-badge">{article.category}</span>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="article-content">
                {/* Meta Info */}
                <div className="article-meta">
                  <div className="author-info">
                    <User size={14} />
                    <span>{article.authorName || 'Anonymous'}</span>
                  </div>
                  <div className="date-info">
                    <Calendar size={14} />
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="article-title">{article.title}</h3>

                {/* Excerpt */}
                <p className="article-excerpt">
                  {article.excerpt || article.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                </p>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="article-tags">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Read More Button */}
                <button 
                  className="read-more-btn"
                  onClick={() => handleReadMore(article._id)}
                >
                  Read Article
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="section-footer">
          <p>Have insights to share with the community?</p>
          <button 
            className="submit-article-btn"
            onClick={() => navigate('/news/submit')}
          >
            Submit Your Article
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeNewsPreview;
