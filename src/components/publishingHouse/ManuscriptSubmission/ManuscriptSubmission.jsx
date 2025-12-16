import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import {
  Upload,
  FileText,
  User,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Download,
  Trash2
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './ManuscriptSubmission.css';

/**
 * Manuscript Submission Component
 * Handles complete manuscript submission workflow
 * Features:
 * - Multi-author management
 * - File upload with validation
 * - Anonymity enforcement
 * - Cover letter
 * - Terms agreement
 */
const ManuscriptSubmission = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: [],
    manuscriptType: 'research',
    version: '',
    authors: [
      {
        id: user?.id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        affiliation: '',
        isCorresponding: true,
        order: 1
      }
    ],
    manuscriptFile: null,
    coverLetter: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempKeyword, setTempKeyword] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // API hooks
  const [submitManuscriptApi] = useApi(publishingAPI.submitManuscript);
  const [fetchJournalApi] = useApi(publishingAPI.getJournalById);

  // Journal details
  const [journal, setJournal] = useState(null);

  /**
   * Load journal details
   */
  useEffect(() => {
    if (journalId) {
      loadJournalDetails();
    }
  }, [journalId]);

  const loadJournalDetails = async () => {
    try {
      const journalData = await fetchJournalApi(journalId, {
        showError: true
      });
      if (journalData) {
        setJournal(journalData);
      }
    } catch (error) {
      // Error handled by useApi
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Handle author field changes
   */
  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      authors: updatedAuthors
    }));
  };

  /**
   * Add new co-author
   */
  const addAuthor = () => {
    const newAuthor = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      affiliation: '',
      isCorresponding: false,
      order: formData.authors.length + 1
    };
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, newAuthor]
    }));
  };

  /**
   * Remove author
   */
  const removeAuthor = (index) => {
    if (formData.authors.length === 1) {
      showNotification('At least one author is required', 'error');
      return;
    }

    const updatedAuthors = formData.authors
      .filter((_, i) => i !== index)
      .map((author, i) => ({
        ...author,
        order: i + 1
      }));

    setFormData(prev => ({
      ...prev,
      authors: updatedAuthors
    }));
  };

  /**
   * Set corresponding author
   */
  const setCorrespondingAuthor = (index) => {
    const updatedAuthors = formData.authors.map((author, i) => ({
      ...author,
      isCorresponding: i === index
    }));

    setFormData(prev => ({
      ...prev,
      authors: updatedAuthors
    }));
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification('Please upload a PDF or Word document', 'error');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('File size must be less than 10MB', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      manuscriptFile: file
    }));

    // Clear error
    if (errors.manuscriptFile) {
      setErrors(prev => ({ ...prev, manuscriptFile: undefined }));
    }
  };

  /**
   * Add keyword
   */
  const handleAddKeyword = () => {
    if (!tempKeyword.trim()) return;

    if (formData.keywords.includes(tempKeyword.trim())) {
      showNotification('Keyword already added', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      keywords: [...prev.keywords, tempKeyword.trim()]
    }));

    setTempKeyword('');

    // Clear error
    if (errors.keywords) {
      setErrors(prev => ({ ...prev, keywords: undefined }));
    }
  };

  /**
   * Remove keyword
   */
  const handleRemoveKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.abstract.trim()) {
      newErrors.abstract = 'Abstract is required';
    } else if (formData.abstract.length < 100) {
      newErrors.abstract = 'Abstract must be at least 100 characters';
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }

    if (!formData.manuscriptType) {
      newErrors.manuscriptType = 'Manuscript type is required';
    }

    // Validate authors
    formData.authors.forEach((author, index) => {
      if (!author.firstName.trim()) {
        newErrors[`author[${index}].firstName`] = 'First name is required';
      }

      if (!author.lastName.trim()) {
        newErrors[`author[${index}].lastName`] = 'Last name is required';
      }

      if (!author.email.trim()) {
        newErrors[`author[${index}].email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(author.email)) {
        newErrors[`author[${index}].email`] = 'Valid email is required';
      }
    });

    // Check for corresponding author
    const hasCorrespondingAuthor = formData.authors.some(
      author => author.isCorresponding
    );
    if (!hasCorrespondingAuthor) {
      newErrors.authors = 'Please designate a corresponding author';
    }

    // File validation
    if (!formData.manuscriptFile) {
      newErrors.manuscriptFile = 'Manuscript file is required';
    }

    // Cover letter
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showNotification('Please fix the errors before submitting', 'error');
      return;
    }

    setLoading(true);

    try {
      const submissionFormData = new FormData();
      submissionFormData.append('journalId', journalId);
      submissionFormData.append('title', formData.title);
      submissionFormData.append('abstract', formData.abstract);
      submissionFormData.append('keywords', JSON.stringify(formData.keywords));
      submissionFormData.append('manuscriptType', formData.manuscriptType);
      submissionFormData.append('version', formData.version);
      submissionFormData.append('authors', JSON.stringify(formData.authors));
      submissionFormData.append('coverLetter', formData.coverLetter);
      submissionFormData.append('manuscriptFile', formData.manuscriptFile);

      const result = await submitManuscriptApi(submissionFormData, {
        successMessage: 'Manuscript submitted successfully!',
        showError: true
      });

      if (result) {
        // Redirect to submissions tracking page
        navigate('/publishing/submissions', {
          state: { submitted: true, submissionId: result.submissionId }
        });
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isAuthenticated) {
    return (
      <div className="manuscript-submission-page">
        <div className="container">
          <div className="auth-required">
            <FileText size={48} />
            <h2>Authentication Required</h2>
            <p>Please sign in to submit a manuscript.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manuscript-submission-page">
      <div className="container">
        {/* Submission Header */}
        <div className="submission-header">
          <h1>Submit Manuscript</h1>
          <p>Submit your research for peer review and publication</p>
          {journal && (
            <div className="journal-info">
              <span>Submitting to: <strong>{journal.title}</strong></span>
            </div>
          )}
        </div>

        {/* Submission Layout */}
        <div className="submission-layout">
          {/* Main Form */}
          <div className="submission-form">
            <form onSubmit={handleSubmit}>
              {/* Manuscript Details */}
              <div className="form-section">
                <h3>Manuscript Details</h3>

                <div className="form-group">
                  <label className="form-label required">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter manuscript title"
                  />
                  {errors.title && (
                    <span className="error-message">{errors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Abstract</label>
                  <textarea
                    value={formData.abstract}
                    onChange={(e) => handleInputChange('abstract', e.target.value)}
                    className={`form-textarea ${errors.abstract ? 'error' : ''}`}
                    placeholder="Provide a comprehensive abstract..."
                    rows="6"
                  />
                  {errors.abstract && (
                    <span className="error-message">{errors.abstract}</span>
                  )}
                  <div className="field-note">
                    {formData.abstract.length}/100 characters minimum
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Keywords</label>
                  <div className="keyword-input">
                    <input
                      type="text"
                      value={tempKeyword}
                      onChange={(e) => setTempKeyword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                      placeholder="Add a keyword"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="btn btn-primary"
                      disabled={!tempKeyword.trim()}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                  <div className="keywords-list">
                    {formData.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(index)}
                          className="keyword-remove"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.keywords && (
                    <span className="error-message">{errors.keywords}</span>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Manuscript Type</label>
                    <select
                      value={formData.manuscriptType}
                      onChange={(e) =>
                        handleInputChange('manuscriptType', e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="research">Research Article</option>
                      <option value="review">Review Article</option>
                      <option value="case-study">Case Study</option>
                      <option value="short-communication">
                        Short Communication
                      </option>
                      <option value="book-review">Book Review</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      className="form-input"
                      placeholder="e.g., 1.0, Initial Submission"
                    />
                    <div className="field-note">Optional version identifier</div>
                  </div>
                </div>
              </div>

              {/* Authors Section */}
              <div className="form-section">
                <h3>Authors</h3>
                <div className="authors-section">
                  {formData.authors.map((author, index) => (
                    <div key={index} className="author-item">
                      <div className="author-header">
                        <span className="author-type">
                          {author.isCorresponding
                            ? 'Corresponding Author'
                            : `Author ${author.order}`}
                        </span>
                        {formData.authors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="remove-author"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label required">First Name</label>
                          <input
                            type="text"
                            value={author.firstName}
                            onChange={(e) =>
                              handleAuthorChange(index, 'firstName', e.target.value)
                            }
                            className="form-input"
                            placeholder="First name"
                            disabled={author.id === user?.id}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label required">Last Name</label>
                          <input
                            type="text"
                            value={author.lastName}
                            onChange={(e) =>
                              handleAuthorChange(index, 'lastName', e.target.value)
                            }
                            className="form-input"
                            placeholder="Last name"
                            disabled={author.id === user?.id}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label required">Email</label>
                          <input
                            type="email"
                            value={author.email}
                            onChange={(e) =>
                              handleAuthorChange(index, 'email', e.target.value)
                            }
                            className="form-input"
                            placeholder="Email address"
                            disabled={author.id === user?.id}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Affiliation</label>
                          <input
                            type="text"
                            value={author.affiliation}
                            onChange={(e) =>
                              handleAuthorChange(index, 'affiliation', e.target.value)
                            }
                            className="form-input"
                            placeholder="Institution or organization"
                          />
                        </div>
                      </div>

                      {!author.isCorresponding && (
                        <div className="author-actions">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={author.isCorresponding}
                              onChange={() => setCorrespondingAuthor(index)}
                              className="checkbox-input"
                            />
                            <span className="checkbox-text">
                              Set as Corresponding Author
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}

                  {errors.authors && (
                    <span className="error-message">{errors.authors}</span>
                  )}

                  <button
                    type="button"
                    onClick={addAuthor}
                    className="btn btn-outline"
                  >
                    <Plus size={16} />
                    Add Co-author
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-section">
                <h3>Manuscript File</h3>

                <div className="form-group">
                  <label className="form-label">Upload Manuscript</label>
                  {!formData.manuscriptFile ? (
                    <div className="file-upload-area">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                        id="manuscript-file"
                        ref={fileInputRef}
                      />
                      <label htmlFor="manuscript-file" className="upload-prompt">
                        <Upload size={32} />
                        <div>
                          <h4>Upload your manuscript</h4>
                          <p>PDF or Word document, max 10MB</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="file-uploaded">
                      <div className="file-info">
                        <FileText size={24} />
                        <div>
                          <h5>{formData.manuscriptFile.name}</h5>
                          <p>{formatFileSize(formData.manuscriptFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            manuscriptFile: null
                          }));
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="btn btn-danger btn-small"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  )}
                  {errors.manuscriptFile && (
                    <span className="error-message">{errors.manuscriptFile}</span>
                  )}
                </div>

                {/* Anonymity Warning */}
                <div className="anonymity-warning">
                  <div className="warning-header">
                    <AlertTriangle size={20} />
                    <h4>Anonymity Requirement</h4>
                  </div>
                  <div className="warning-content">
                    <p>
                      Please ensure your manuscript file does not contain any author
                      names, affiliations, or identifying information. Submissions with
                      identifying information will be automatically rejected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="form-section">
                <h3>Cover Letter</h3>
                <div className="form-group">
                  <label className="form-label required">
                    Cover Letter to Editors
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    placeholder="Explain the significance of your research and why it's suitable for this journal..."
                    className={`form-textarea ${errors.coverLetter ? 'error' : ''}`}
                    rows="6"
                  />
                  {errors.coverLetter && (
                    <span className="error-message">{errors.coverLetter}</span>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-section">
                <div className="terms-agreement">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        handleInputChange('agreeToTerms', e.target.checked)
                      }
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      I agree to the terms and conditions and confirm that this
                      manuscript is original work and has not been published elsewhere.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <span className="error-message">{errors.agreeToTerms}</span>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/publishing')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-large"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Submit Manuscript
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="submission-sidebar">
            {/* Journal Info */}
            {journal && (
              <div className="journal-info-card">
                <h3>Submission Guidelines</h3>
                <div className="journal-details">
                  <div className="detail-row">
                    <span className="detail-label">Review Time:</span>
                    <span className="detail-value">{journal.reviewTime} days</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Acceptance Rate:</span>
                    <span className="detail-value">{journal.acceptanceRate}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Publication Fee:</span>
                    <span className="detail-value">
                      {journal.publicationFee || 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="timeline-card">
              <h3>Submission Process</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Step 1</div>
                    <div className="timeline-description">
                      Submit manuscript and complete form
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Step 2</div>
                    <div className="timeline-description">
                      Editorial screening (3-5 days)
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Step 3</div>
                    <div className="timeline-description">
                      Peer review process (4-6 weeks)
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Step 4</div>
                    <div className="timeline-description">
                      Final decision and publication
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptSubmission;
