import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import {
  FileText,
  Download,
  User,
  Calendar,
  Eye,
  Share2,
  Bookmark,
  Quote,
  TrendingUp,
  Users,
  Clock,
  Building,
  ExternalLink
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './PublicationView.css';

/**
 * Publication View Component
 * Displays published article with full details, metrics, and citation options
 */
const PublicationView = () => {
  const { articleId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [article, setArticle] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('abstract'); // abstract, metrics, citations

  // API hooks
  const [fetchArticleApi] = useApi(publishingAPI.getPublishedArticle);
  const [fetchMetricsApi] = useApi(publishingAPI.getArticleMetrics);
  const [downloadArticleApi] = useApi(publishingAPI.downloadArticle);

  /**
   * Load article and metrics
   */
  useEffect(() => {
    if (articleId) {
      loadArticle();
      loadMetrics();
    }
  }, [articleId]);

  const loadArticle = async () => {
    try {
      const articleData = await fetchArticleApi(articleId, {
        showError: true,
        errorMessage: 'Failed to load article'
      });

      if (articleData) {
        setArticle(articleData);
      }
    } catch (error) {
      // Error handled by useApi
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const metricsData = await fetchMetricsApi(articleId);
      if (metricsData) {
        setMetrics(metricsData);
      }
    } catch (error) {
      // Error handled by useApi
    }
  };

  /**
   * Handle article download
   */
  const handleDownload = async () => {
    if (!article?.downloadUrl) {
      showNotification('Download not available for this article', 'error');
      return;
    }

    setDownloading(true);
    try {
      const blob = await downloadArticleApi(articleId, {
        showError: true
      });

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${article.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showNotification('Article downloaded successfully', 'success');

        // Update download count
        setMetrics(prev => ({
          ...prev,
          downloads: (prev?.downloads || 0) + 1
        }));
      }
    } catch (error) {
      // Error handled by useApi
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Handle article sharing
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.abstract,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Link copied to clipboard', 'success');
      });
    }
  };

  /**
   * Format citation (APA style)
   */
  const formatCitation = () => {
    if (!article) return '';

    const authors = article.authors
      .map(author => `${author.lastName}, ${author.firstName.charAt(0)}.`)
      .join(', ');
    
    const year = new Date(article.publishedDate).getFullYear();
    const journal = article.journal?.name || 'Journal';
    const volume = article.volume;
    const issue = article.issue ? `(${article.issue})` : '';
    const pages = article.pages;

    return `${authors} (${year}). ${article.title}. ${journal}, ${volume}${issue}, ${pages}.`;
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="publication-view-page">
        <div className="container">
          <div className="loading-state">
            <Loader size="lg" text="Loading publication..." />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="publication-view-page">
        <div className="container">
          <div className="error-state">
            <FileText size={48} />
            <h3>Publication Not Found</h3>
            <p>The requested publication could not be found.</p>
            <Link to="/publishing" className="btn btn-primary">
              Browse Publications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publication-view-page">
      <div className="container">
        {/* Publication Header */}
        <div className="publication-header">
          <div className="breadcrumb">
            <Link to="/publishing">Publishing</Link>
            <span>/</span>
            <Link to={`/publishing/journals/${article.journal?.id}`}>
              {article.journal?.name}
            </Link>
            <span>/</span>
            <span>Article</span>
          </div>

          <div className="article-type-badge">
            {article.manuscriptType}
          </div>

          <h1>{article.title}</h1>

          {/* Authors */}
          <div className="authors-list">
            {article.authors?.map((author, index) => (
              <span key={index} className="author">
                {author.firstName} {author.lastName}
                {author.isCorresponding && <sup>*</sup>}
                {index < article.authors.length - 1 && ', '}
              </span>
            ))}
          </div>

          {/* Publication Info */}
          <div className="publication-info">
            <div className="info-item">
              <Building size={16} />
              <span>{article.journal?.name}</span>
            </div>
            <div className="info-item">
              <Calendar size={16} />
              <span>Published: {formatDate(article.publishedDate)}</span>
            </div>
            {article.doi && (
              <div className="info-item">
                <ExternalLink size={16} />
                <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">
                  DOI: {article.doi}
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="article-actions">
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader size="sm" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download PDF
                </>
              )}
            </button>
            <button className="btn btn-outline" onClick={handleShare}>
              <Share2 size={18} />
              Share
            </button>
            <button className="btn btn-outline">
              <Bookmark size={18} />
              Save
            </button>
            <button className="btn btn-outline">
              <Quote size={18} />
              Cite
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        {metrics && (
          <div className="metrics-bar">
            <div className="metric-item">
              <Eye size={20} />
              <div>
                <span className="metric-value">{metrics.views || 0}</span>
                <span className="metric-label">Views</span>
              </div>
            </div>
            <div className="metric-item">
              <Download size={20} />
              <div>
                <span className="metric-value">{metrics.downloads || 0}</span>
                <span className="metric-label">Downloads</span>
              </div>
            </div>
            <div className="metric-item">
              <Quote size={20} />
              <div>
                <span className="metric-value">{metrics.citations || 0}</span>
                <span className="metric-label">Citations</span>
              </div>
            </div>
            <div className="metric-item">
              <TrendingUp size={20} />
              <div>
                <span className="metric-value">{metrics.altmetric || 0}</span>
                <span className="metric-label">Altmetric</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="content-tabs">
          <button
            className={`tab ${activeTab === 'abstract' ? 'active' : ''}`}
            onClick={() => setActiveTab('abstract')}
          >
            Abstract & Keywords
          </button>
          <button
            className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics & Impact
          </button>
          <button
            className={`tab ${activeTab === 'citations' ? 'active' : ''}`}
            onClick={() => setActiveTab('citations')}
          >
            Citations & References
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'abstract' && (
            <div className="abstract-section">
              <div className="section-card">
                <h2>Abstract</h2>
                <p className="abstract-text">{article.abstract}</p>
              </div>

              <div className="section-card">
                <h2>Keywords</h2>
                <div className="keywords-list">
                  {article.keywords?.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {article.highlights && (
                <div className="section-card">
                  <h2>Highlights</h2>
                  <ul className="highlights-list">
                    {article.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="metrics-section">
              <div className="section-card">
                <h2>Article Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <Eye size={32} />
                    <span className="metric-number">{metrics?.views || 0}</span>
                    <span className="metric-name">Total Views</span>
                  </div>
                  <div className="metric-card">
                    <Download size={32} />
                    <span className="metric-number">{metrics?.downloads || 0}</span>
                    <span className="metric-name">Downloads</span>
                  </div>
                  <div className="metric-card">
                    <Quote size={32} />
                    <span className="metric-number">{metrics?.citations || 0}</span>
                    <span className="metric-name">Citations</span>
                  </div>
                  <div className="metric-card">
                    <Users size={32} />
                    <span className="metric-number">{metrics?.readers || 0}</span>
                    <span className="metric-name">Readers</span>
                  </div>
                </div>
              </div>

              {metrics?.impactMetrics && (
                <div className="section-card">
                  <h2>Impact Metrics</h2>
                  <div className="impact-details">
                    <div className="impact-item">
                      <span className="impact-label">Altmetric Score:</span>
                      <span className="impact-value">{metrics.impactMetrics.altmetric}</span>
                    </div>
                    <div className="impact-item">
                      <span className="impact-label">Social Media Mentions:</span>
                      <span className="impact-value">{metrics.impactMetrics.socialMentions}</span>
                    </div>
                    <div className="impact-item">
                      <span className="impact-label">News Coverage:</span>
                      <span className="impact-value">{metrics.impactMetrics.newsCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'citations' && (
            <div className="citations-section">
              <div className="section-card">
                <h2>Cite This Article</h2>
                <div className="citation-formats">
                  <div className="citation-format">
                    <h4>APA</h4>
                    <p className="citation-text">{formatCitation()}</p>
                    <button
                      className="btn btn-outline btn-small"
                      onClick={() => {
                        navigator.clipboard.writeText(formatCitation());
                        showNotification('Citation copied', 'success');
                      }}
                    >
                      Copy
                    </button>
                  </div>

                  <div className="citation-format">
                    <h4>BibTeX</h4>
                    <pre className="bibtex-code">
{`@article{${article.id},
  title={${article.title}},
  author={${article.authors.map(a => `${a.lastName}, ${a.firstName}`).join(' and ')}},
  journal={${article.journal?.name}},
  year={${new Date(article.publishedDate).getFullYear()}},
  volume={${article.volume}},
  number={${article.issue}},
  pages={${article.pages}},
  doi={${article.doi}}
}`}
                    </pre>
                    <button
                      className="btn btn-outline btn-small"
                      onClick={() => {
                        navigator.clipboard.writeText(document.querySelector('.bibtex-code').textContent);
                        showNotification('BibTeX copied', 'success');
                      }}
                    >
                      Copy BibTeX
                    </button>
                  </div>
                </div>
              </div>

              {article.references && (
                <div className="section-card">
                  <h2>References</h2>
                  <ol className="references-list">
                    {article.references.map((ref, index) => (
                      <li key={index}>{ref}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="related-articles">
            <h2>Related Articles</h2>
            <div className="articles-grid">
              {article.relatedArticles.slice(0, 3).map(relatedArticle => (
                <div key={relatedArticle.id} className="article-card">
                  <h3>
                    <Link to={`/publishing/articles/${relatedArticle.id}`}>
                      {relatedArticle.title}
                    </Link>
                  </h3>
                  <div className="article-meta">
                    <span>{relatedArticle.authors[0]?.lastName} et al.</span>
                    <span>{new Date(relatedArticle.publishedDate).getFullYear()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationView;
