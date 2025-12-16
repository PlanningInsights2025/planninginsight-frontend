import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import {
  FileText,
  Download,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Edit3,
  MessageSquare,
  Clock,
  AlertTriangle,
  Send
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';

/**
 * Editorial Review Component
 * Handles manuscript review process for editors
 * Supports decision making and feedback submission
 */
const EditorialReview = () => {
  const { submissionId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // API hooks
  const [fetchSubmissionApi] = useApi(publishingAPI.getSubmission);
  const [makeDecisionApi] = useApi(publishingAPI.makeEditorialDecision);

  /**
   * Load submission details
   */
  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId]);

  const loadSubmission = async () => {
    try {
      const submissionData = await fetchSubmissionApi(submissionId, {
        showError: true,
        errorMessage: 'Failed to load submission details'
      });

      if (submissionData) {
        setSubmission(submissionData);
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle recommendation toggle
   */
  const toggleRecommendation = (rec) => {
    setRecommendations(prev =>
      prev.includes(rec)
        ? prev.filter(r => r !== rec)
        : [...prev, rec]
    );
  };

  /**
   * Handle decision submission
   */
  const handleSubmitDecision = async () => {
    if (!decision) {
      showNotification('Please select a decision', 'error');
      return;
    }

    if (!feedback.trim()) {
      showNotification('Please provide feedback for the author', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const decisionData = {
        decision,
        feedback,
        recommendations,
        decisionDate: new Date().toISOString()
      };

      const result = await makeDecisionApi(submissionId, decisionData, {
        successMessage: 'Decision submitted successfully'
      });

      if (result) {
        // Update local state
        setSubmission(prev => ({
          ...prev,
          status: decision === 'accept' ? 'accepted' : 
                 decision === 'reject' ? 'rejected' : 'revision_requested',
          editorFeedback: feedback,
          decisionDate: new Date().toISOString()
        }));
        
        // Reset form
        setDecision('');
        setFeedback('');
        setRecommendations([]);
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Download manuscript
   */
  const downloadManuscript = () => {
    if (submission?.manuscriptFile?.url) {
      window.open(submission.manuscriptFile.url, '_blank');
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get decision options
   */
  const getDecisionOptions = () => [
    {
      value: 'accept',
      label: 'Accept',
      description: 'Accept manuscript for publication',
      icon: CheckCircle,
      color: 'green'
    },
    {
      value: 'minor_revisions',
      label: 'Minor Revisions',
      description: 'Require minor revisions before acceptance',
      icon: Edit3,
      color: 'blue'
    },
    {
      value: 'major_revisions',
      label: 'Major Revisions',
      description: 'Require significant revisions and re-review',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      value: 'reject',
      label: 'Reject',
      description: 'Reject manuscript from publication',
      icon: XCircle,
      color: 'red'
    }
  ];

  /**
   * Get recommendation options
   */
  const getRecommendationOptions = () => [
    'Improve literature review',
    'Strengthen methodology',
    'Clarify results section',
    'Enhance discussion',
    'Update references',
    'Improve language and grammar',
    'Add more data analysis',
    'Clarify research questions',
    'Improve figures/tables',
    'Address ethical concerns'
  ];

  if (loading) {
    return (
      <div className="editorial-review-page">
        <div className="container">
          <div className="loading-state">
            <Loader size="lg" text="Loading submission details..." />
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="editorial-review-page">
        <div className="container">
          <div className="error-state">
            <AlertTriangle size={48} />
            <h3>Submission Not Found</h3>
            <p>The requested submission could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-review-page">
      <div className="container">
        <div className="review-header">
          <h1>Editorial Review</h1>
          <p>Review manuscript and provide editorial decision</p>
        </div>

        <div className="review-layout">
          {/* Manuscript Details */}
          <div className="manuscript-details">
            <div className="details-card">
              <div className="card-header">
                <h2>Manuscript Details</h2>
                <button
                  onClick={downloadManuscript}
                  className="btn btn-outline btn-small"
                  disabled={!submission.manuscriptFile}
                >
                  <Download size={16} />
                  Download Manuscript
                </button>
              </div>

              <div className="details-content">
                <div className="detail-group">
                  <h3>{submission.title}</h3>
                  <p className="submission-id">ID: {submission.id}</p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Journal:</strong>
                    <span>{submission.journal?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Submitted:</strong>
                    <span>{formatDate(submission.submittedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Manuscript Type:</strong>
                    <span>{submission.manuscriptType?.replace('_', ' ') || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Current Status:</strong>
                    <span className={`status-badge ${submission.status}`}>
                      {submission.status?.replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Abstract</h4>
                  <p>{submission.abstract}</p>
                </div>

                <div className="detail-section">
                  <h4>Keywords</h4>
                  <div className="keywords-list">
                    {submission.keywords?.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authors Information */}
            <div className="authors-card">
              <h3>Authors</h3>
              <div className="authors-list">
                {submission.authors?.map((author, index) => (
                  <div key={index} className="author-item">
                    <div className="author-avatar">
                      <User size={20} />
                    </div>
                    <div className="author-info">
                      <div className="author-name">
                        {author.firstName} {author.lastName}
                        {author.isCorresponding && (
                          <span className="corresponding-badge">Corresponding</span>
                        )}
                      </div>
                      <div className="author-email">{author.email}</div>
                      {author.affiliation && (
                        <div className="author-affiliation">{author.affiliation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="review-form">
            <div className="form-card">
              <h2>Editorial Decision</h2>

              {/* Decision Options */}
              <div className="decision-options">
                <h3>Select Decision</h3>
                <div className="options-grid">
                  {getDecisionOptions().map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <div
                        key={option.value}
                        className={`decision-option ${decision === option.value ? 'selected' : ''} ${option.color}`}
                        onClick={() => setDecision(option.value)}
                      >
                        <div className="option-header">
                          <IconComponent size={20} />
                          <span className="option-label">{option.label}</span>
                        </div>
                        <p className="option-description">{option.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div className="feedback-section">
                <h3>Feedback to Author</h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for the author. Include specific comments about strengths, weaknesses, and suggestions for improvement."
                  rows="8"
                  className="feedback-textarea"
                />
                <div className="character-count">
                  {feedback.length}/2000 characters
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations-section">
                <h3>Recommendations</h3>
                <p className="section-description">
                  Select specific areas that need improvement (optional)
                </p>
                <div className="recommendations-grid">
                  {getRecommendationOptions().map((rec, index) => (
                    <label key={index} className="recommendation-checkbox">
                      <input
                        type="checkbox"
                        checked={recommendations.includes(rec)}
                        onChange={() => toggleRecommendation(rec)}
                      />
                      <span className="checkmark"></span>
                      <span className="recommendation-text">{rec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submission */}
              <div className="submission-section">
                <button
                  onClick={handleSubmitDecision}
                  disabled={!decision || !feedback.trim() || submitting}
                  className="btn btn-primary btn-large"
                >
                  {submitting ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Decision
                    </>
                  )}
                </button>
                
                <div className="submission-note">
                  <AlertTriangle size={16} />
                  <span>
                    This decision will be immediately sent to the author and cannot be undone.
                  </span>
                </div>
              </div>
            </div>

            {/* Review Guidelines */}
            <div className="guidelines-card">
              <h3>Review Guidelines</h3>
              <div className="guidelines-content">
                <div className="guideline-item">
                  <strong>Be Constructive:</strong>
                  <span>Provide specific, actionable feedback</span>
                </div>
                <div className="guideline-item">
                  <strong>Be Professional:</strong>
                  <span>Maintain a respectful and professional tone</span>
                </div>
                <div className="guideline-item">
                  <strong>Be Thorough:</strong>
                  <span>Address all major aspects of the manuscript</span>
                </div>
                <div className="guideline-item">
                  <strong>Be Timely:</strong>
                  <span>Submit your decision within the agreed timeframe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorialReview;