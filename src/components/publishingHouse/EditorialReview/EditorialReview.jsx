import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './EditorialReview.css';

/**
 * Editorial Review Component
 * For editors and reviewers to assess manuscripts
 */
const EditorialReview = () => {
  const { manuscriptId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({
    decision: '', // accept, minor-revision, major-revision, reject
    comments: '',
    strengths: '',
    weaknesses: '',
    recommendations: [],
    confidentialComments: ''
  });
  const [errors, setErrors] = useState({});

  // API hooks
  const [fetchManuscriptApi] = useApi(publishingAPI.getManuscriptForReview);
  const [submitReviewApi] = useApi(publishingAPI.submitReview);
  const [downloadManuscriptApi] = useApi(publishingAPI.downloadManuscript);

  /**
   * Load manuscript details
   */
  useEffect(() => {
    if (manuscriptId && isAuthenticated) {
      loadManuscript();
    }
  }, [manuscriptId, isAuthenticated]);

  const loadManuscript = async () => {
    try {
      const manuscriptData = await fetchManuscriptApi(manuscriptId, {
        showError: true,
        errorMessage: 'Failed to load manuscript'
      });

      if (manuscriptData) {
        setManuscript(manuscriptData);
      }
    } catch (error) {
      // Error handled by useApi
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Toggle recommendation
   */
  const toggleRecommendation = (recommendation) => {
    setReviewData(prev => {
      const recommendations = prev.recommendations.includes(recommendation)
        ? prev.recommendations.filter(r => r !== recommendation)
        : [...prev.recommendations, recommendation];
      
      return { ...prev, recommendations };
    });
  };

  /**
   * Validate review form
   */
  const validateReview = () => {
    const newErrors = {};

    if (!reviewData.decision) {
      newErrors.decision = 'Please select a decision';
    }

    if (!reviewData.comments.trim()) {
      newErrors.comments = 'Comments for authors are required';
    }

    if (!reviewData.strengths.trim()) {
      newErrors.strengths = 'Please list the strengths';
    }

    if (!reviewData.weaknesses.trim()) {
      newErrors.weaknesses = 'Please list the weaknesses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle review submission
   */
  const handleSubmitReview = async () => {
    if (!validateReview()) {
      showNotification('Please complete all required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitReviewApi(
        { manuscriptId, ...reviewData },
        {
          successMessage: 'Review submitted successfully',
          showError: true
        }
      );

      if (result) {
        navigate('/publishing/editorial');
      }
    } catch (error) {
      // Error handled by useApi
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle manuscript download
   */
  const handleDownloadManuscript = async () => {
    try {
      const blob = await downloadManuscriptApi(manuscriptId, {
        showError: true
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `manuscript-${manuscriptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      // Error handled by useApi
    }
  };

  /**
   * Get decision badge color
   */
  const getDecisionBadge = (decision) => {
    const badges = {
      accept: { label: 'Accept', color: 'success', icon: CheckCircle },
      'minor-revision': { label: 'Minor Revision', color: 'warning', icon: AlertTriangle },
      'major-revision': { label: 'Major Revision', color: 'warning', icon: AlertTriangle },
      reject: { label: 'Reject', color: 'error', icon: XCircle }
    };
    return badges[decision] || { label: decision, color: 'secondary', icon: FileText };
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

  if (!isAuthenticated) {
    return (
      <div className="editorial-review-page">
        <div className="container">
          <div className="auth-required">
            <FileText size={48} />
            <h2>Authentication Required</h2>
            <p>Please sign in to access editorial review.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="editorial-review-loading">
        <Loader size="lg" text="Loading manuscript..." />
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="editorial-review-page">
        <div className="container">
          <div className="error-state">
            <FileText size={48} />
            <h3>Manuscript Not Found</h3>
            <p>The requested manuscript could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const recommendationOptions = [
    { id: 'originality', label: 'Original Research' },
    { id: 'methodology', label: 'Sound Methodology' },
    { id: 'analysis', label: 'Strong Analysis' },
    { id: 'writing', label: 'Clear Writing' },
    { id: 'significance', label: 'Significant Contribution' },
    { id: 'references', label: 'Comprehensive References' }
  ];

  return (
    <div className="editorial-review-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Editorial Review</h1>
          <p>Provide your assessment and recommendations</p>
        </div>

        {/* Review Layout */}
        <div className="review-layout">
          {/* Manuscript Details */}
          <div className="manuscript-details">
            <div className="card">
              <div className="card-header">
                <h2>Manuscript Details</h2>
                <button
                  className="btn btn-outline btn-small"
                  onClick={handleDownloadManuscript}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{manuscript.title}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Manuscript Type:</span>
                  <span className="detail-value">{manuscript.manuscriptType}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Submitted Date:</span>
                  <span className="detail-value">
                    {formatDate(manuscript.submittedDate)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Journal:</span>
                  <span className="detail-value">{manuscript.journal?.name}</span>
                </div>

                <div className="detail-item full-width">
                  <span className="detail-label">Abstract:</span>
                  <p className="abstract-text">{manuscript.abstract}</p>
                </div>

                <div className="detail-item full-width">
                  <span className="detail-label">Keywords:</span>
                  <div className="keywords-list">
                    {manuscript.keywords?.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authors (Anonymous during review) */}
            <div className="card authors-card">
              <h3>Authors</h3>
              <div className="authors-note">
                <AlertTriangle size={16} />
                <p>Author information is anonymized during the review process.</p>
              </div>
              <div className="author-count">
                <User size={20} />
                <span>{manuscript.authors?.length || 0} Authors</span>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="review-form-section">
            <div className="card">
              <h2>Your Review</h2>

              {/* Decision */}
              <div className="form-group">
                <label className="form-label required">Decision</label>
                <div className="decision-options">
                  {['accept', 'minor-revision', 'major-revision', 'reject'].map(
                    (decision) => {
                      const badge = getDecisionBadge(decision);
                      const Icon = badge.icon;
                      return (
                        <label
                          key={decision}
                          className={`decision-option ${
                            reviewData.decision === decision ? 'selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="decision"
                            value={decision}
                            checked={reviewData.decision === decision}
                            onChange={(e) =>
                              handleInputChange('decision', e.target.value)
                            }
                          />
                          <div className="option-content">
                            <Icon size={24} />
                            <span>{badge.label}</span>
                          </div>
                        </label>
                      );
                    }
                  )}
                </div>
                {errors.decision && (
                  <span className="error-message">{errors.decision}</span>
                )}
              </div>

              {/* Comments for Authors */}
              <div className="form-group">
                <label className="form-label required">
                  Comments for Authors
                </label>
                <textarea
                  value={reviewData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  className={`form-textarea ${errors.comments ? 'error' : ''}`}
                  placeholder="Provide constructive feedback for the authors..."
                  rows="6"
                />
                {errors.comments && (
                  <span className="error-message">{errors.comments}</span>
                )}
              </div>

              {/* Strengths */}
              <div className="form-group">
                <label className="form-label required">Strengths</label>
                <textarea
                  value={reviewData.strengths}
                  onChange={(e) => handleInputChange('strengths', e.target.value)}
                  className={`form-textarea ${errors.strengths ? 'error' : ''}`}
                  placeholder="List the main strengths of this manuscript..."
                  rows="4"
                />
                {errors.strengths && (
                  <span className="error-message">{errors.strengths}</span>
                )}
              </div>

              {/* Weaknesses */}
              <div className="form-group">
                <label className="form-label required">Weaknesses</label>
                <textarea
                  value={reviewData.weaknesses}
                  onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                  className={`form-textarea ${errors.weaknesses ? 'error' : ''}`}
                  placeholder="List areas that need improvement..."
                  rows="4"
                />
                {errors.weaknesses && (
                  <span className="error-message">{errors.weaknesses}</span>
                )}
              </div>

              {/* Recommendations */}
              <div className="form-group">
                <label className="form-label">Assessment Criteria</label>
                <div className="recommendations-section">
                  <h4>Select applicable criteria:</h4>
                  <div className="recommendations-grid">
                    {recommendationOptions.map((option) => (
                      <label
                        key={option.id}
                        className="recommendation-checkbox"
                      >
                        <input
                          type="checkbox"
                          checked={reviewData.recommendations.includes(
                            option.id
                          )}
                          onChange={() => toggleRecommendation(option.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="recommendation-text">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confidential Comments */}
              <div className="form-group">
                <label className="form-label">
                  Confidential Comments (For Editors Only)
                </label>
                <textarea
                  value={reviewData.confidentialComments}
                  onChange={(e) =>
                    handleInputChange('confidentialComments', e.target.value)
                  }
                  className="form-textarea"
                  placeholder="Comments that will only be visible to editors..."
                  rows="4"
                />
                <div className="field-note">
                  These comments will not be shared with the authors
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/publishing/editorial')}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleSubmitReview}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader size="sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorialReview;
