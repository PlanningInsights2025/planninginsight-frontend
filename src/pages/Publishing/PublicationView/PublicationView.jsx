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
  Citation,
  TrendingUp,
  Users,
  Clock,
  Building
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';

/**
 * Publication View Component
 * Displays published article with metrics, citations, and download options
 */
const PublicationView = () => {
  const { articleId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [article, setArticle] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('abstract');

  // API hooks
  const [fetchArticleApi] = useApi(publishingAPI.getPublishedArticles);
  const [fetchMetricsApi] = useApi(publishingAPI.getArticleMetrics);
  const [downloadArticleApi] = useApi(publishingAPI.downloadArticle);

  /**
   * Load article details and metrics
   */
  useEffect(() => {
    if (articleId) {
      loadArticle();
      loadMetrics();
    }
  }, [articleId]);

  const loadArticle = async () => {
    try {
      const articlesData = await fetchArticleApi({ id: articleId }, {
        showError: true,
        errorMessage: 'Failed to load article'
      });

      if (articlesData && articlesData.length > 0) {
        setArticle(articlesData[0]);
      }
    } catch (error) {
      // Error handled by useApi hook
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
      // Error handled by useApi hook
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
        showError: true,
        errorMessage: 'Failed to download article'
      });

      if (blob) {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${article.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Update download count
        setMetrics(prev => ({
          ...prev,
          downloads: (prev?.downloads || 0) + 1
        }));

        showNotification('Article downloaded successfully', 'success');
      }
    } catch (error) {
      // Error handled by useApi hook
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
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Link copied to clipboard', 'success');
      });
    }
  };

  /**
   * Format citation in APA style
   */
  const formatCitation = () => {
    if (!article) return '';

    const authors = article.authors.map(author => 
      `${author.lastName}, ${author.firstName.charAt(0)}.`
    ).join(', ');

    const year = new Date(article.publishedDate).getFullYear();
    const journal = article.journal?.name || 'Journal';
    const volume = article.volume || '';
    const issue = article.issue ? `(${article.issue})` : '';
    const pages = article.pages || '';

    return `${authors} (${year}). ${article.title}. ${journal}, ${volume}${issue}, ${pages}.`;
  };

  /**
   * Format date for display
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
          <div className="header-content">
            <div className="publication-meta">
              <Link to={`/publishing/journals/${article.journal?.id}`} className="journal-link">
                <Building size={16} />
                {article.journal?.name}
              </Link>
              <span className="publication-date">
                <Calendar size={16} />
                Published {formatDate(article.publishedDate)}
              </span>
              {article.volume && (
                <span className="volume-info">
                  Volume {article.volume}
                  {article.issue && `, Issue ${article.issue}`}
                </span>
              )}
            </div>

            <h1>{article.title}</h1>

            <div className="authors-list">
              {article.authors.map((author, index) => (
                <span key={index} className="author-name">
                  {author.firstName} {author.lastName}
                  {author.affiliation && (
                    <span className="author-affiliation">, {author.affiliation}</span>
                  )}
                  {index < article.authors.length - 1 && ' • '}
                </span>
              ))}
            </div>

            <div className="header-actions">
              <button
                onClick={handleDownload}
                disabled={!article.downloadUrl || downloading}
                className="btn btn-primary"
              >
                {downloading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <Download size={16} />
                    Download PDF
                  </>
                )}
              </button>

              <button onClick={handleShare} className="btn btn-outline">
                <Share2 size={16} />
                Share
              </button>

              <button className="btn btn-outline">
                <Bookmark size={16} />
                Save
              </button>

              <button className="btn btn-outline">
                <Citation size={16} />
                Cite
              </button>
            </div>
          </div>

          {/* Metrics Sidebar */}
          <div className="metrics-sidebar">
            <div className="metrics-card">
              <h3>Article Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <Eye size={20} />
                  <div className="metric-value">{metrics?.views || 0}</div>
                  <div className="metric-label">Views</div>
                </div>
                <div className="metric-item">
                  <Download size={20} />
                  <div className="metric-value">{metrics?.downloads || 0}</div>
                  <div className="metric-label">Downloads</div>
                </div>
                <div className="metric-item">
                  <Citation size={20} />
                  <div className="metric-value">{metrics?.citations || 0}</div>
                  <div className="metric-label">Citations</div>
                </div>
                <div className="metric-item">
                  <TrendingUp size={20} />
                  <div className="metric-value">
                    {metrics?.altmetricScore ? metrics.altmetricScore.toFixed(1) : 'N/A'}
                  </div>
                  <div className="metric-label">Impact Score</div>
                </div>
              </div>
            </div>

            {article.doi && (
              <div className="doi-card">
                <h4>Digital Object Identifier</h4>
                <code className="doi-code">{article.doi}</code>
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doi-link"
                >
                  Resolve DOI
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Publication Tabs */}
        <div className="publication-tabs">
          <nav className="tabs-navigation">
            <button
              className={`tab-button ${activeTab === 'abstract' ? 'active' : ''}`}
              onClick={() => setActiveTab('abstract')}
            >
              Abstract
            </button>
            <button
              className={`tab-button ${activeTab === 'fulltext' ? 'active' : ''}`}
              onClick={() => setActiveTab('fulltext')}
            >
              Full Text
            </button>
            <button
              className={`tab-button ${activeTab === 'references' ? 'active' : ''}`}
              onClick={() => setActiveTab('references')}
            >
              References
            </button>
            <button
              className={`tab-button ${activeTab === 'citation' ? 'active' : ''}`}
              onClick={() => setActiveTab('citation')}
            >
              Citation
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'abstract' && (
              <div className="abstract-content">
                <h2>Abstract</h2>
                <p>{article.abstract}</p>

                {article.keywords && article.keywords.length > 0 && (
                  <div className="keywords-section">
                    <h3>Keywords</h3>
                    <div className="keywords-list">
                      {article.keywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fulltext' && (
              <div className="fulltext-content">
                {article.accessType === 'open' || (isAuthenticated && article.accessType === 'sso') ? (
                  <iframe
                    src={article.downloadUrl}
                    className="pdf-viewer"
                    title="Article PDF"
                  />
                ) : article.accessType === 'paid' ? (
                  <div className="access-restricted">
                    <FileText size={48} />
                    <h3>Full Text Access</h3>
                    <p>This article requires a subscription or purchase to access the full text.</p>
                    <div className="access-actions">
                      <button className="btn btn-primary">
                        Purchase Access
                      </button>
                      <button className="btn btn-outline">
                        Institutional Login
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="access-restricted">
                    <FileText size={48} />
                    <h3>Authentication Required</h3>
                    <p>Please sign in to access the full text of this article.</p>
                    <Link to="/login" className="btn btn-primary">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'references' && (
              <div className="references-content">
                <h2>References</h2>
                {article.references && article.references.length > 0 ? (
                  <ol className="references-list">
                    {article.references.map((reference, index) => (
                      <li key={index} className="reference-item">
                        {reference}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No references available for this article.</p>
                )}
              </div>
            )}

            {activeTab === 'citation' && (
              <div className="citation-content">
                <h2>How to Cite</h2>
                <div className="citation-formats">
                  <div className="citation-format">
                    <h3>APA Format</h3>
                    <div className="citation-text">
                      {formatCitation()}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(formatCitation())}
                      className="btn btn-outline btn-small"
                    >
                      Copy Citation
                    </button>
                  </div>

                  <div className="citation-format">
                    <h3>BibTeX</h3>
                    <pre className="bibtex-code">
{`@article{${article.id},
  title = {${article.title}},
  author = {${article.authors.map(a => `${a.lastName}, ${a.firstName}`).join(' and ')}},
  journal = {${article.journal?.name}},
  year = {${new Date(article.publishedDate).getFullYear()}},
  volume = {${article.volume || ''}},
  number = {${article.issue || ''}},
  pages = {${article.pages || ''}},
  doi = {${article.doi || ''}}
}`}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(document.querySelector('.bibtex-code').textContent)}
                      className="btn btn-outline btn-small"
                    >
                      Copy BibTeX
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="related-articles">
            <h2>Related Articles</h2>
            <div className="articles-grid">
              {article.relatedArticles.slice(0, 3).map((relatedArticle) => (
                <div key={relatedArticle.id} className="article-card">
                  <h3>
                    <Link to={`/publishing/articles/${relatedArticle.id}`}>
                      {relatedArticle.title}
                    </Link>
                  </h3>
                  <div className="article-meta">
                    <span className="authors">
                      {relatedArticle.authors.slice(0, 2).map(a => a.lastName).join(', ')}
                      {relatedArticle.authors.length > 2 && ' et al.'}
                    </span>
                    <span className="journal">{relatedArticle.journal?.name}</span>
                    <span className="date">{formatDate(relatedArticle.publishedDate)}</span>
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