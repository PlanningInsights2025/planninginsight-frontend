import React, { useState, useRef } from 'react';
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
  Download
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';

/**
 * Manuscript Submission Component
 * Handles manuscript submission with author management and file upload
 * Enforces anonymity policy and validates submission requirements
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
    keywords: '',
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
    file: null,
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // API hooks
  const [submitManuscriptApi, submitLoading] = useApi(publishingAPI.submitManuscript);

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
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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
    if (formData.authors.length <= 1) {
      showNotification('At least one author is required', 'error');
      return;
    }

    const updatedAuthors = formData.authors.filter((_, i) => i !== index)
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
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  /**
   * Handle drag and drop events
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  /**
   * Validate and set manuscript file
   */
  const validateAndSetFile = (file) => {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification('Please upload a PDF or Word document', 'error');
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('File size must be less than 10MB', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file
    }));

    // Clear file error
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  /**
   * Remove selected file
   */
  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    }

    if (!formData.manuscriptType) {
      newErrors.manuscriptType = 'Manuscript type is required';
    }

    // Validate authors
    formData.authors.forEach((author, index) => {
      if (!author.firstName.trim()) {
        newErrors[`author_${index}_firstName`] = 'First name is required';
      }
      if (!author.lastName.trim()) {
        newErrors[`author_${index}_lastName`] = 'Last name is required';
      }
      if (!author.email.trim()) {
        newErrors[`author_${index}_email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email)) {
        newErrors[`author_${index}_email`] = 'Valid email is required';
      }
    });

    // Check for corresponding author
    const hasCorrespondingAuthor = formData.authors.some(author => author.isCorresponding);
    if (!hasCorrespondingAuthor) {
      newErrors.authors = 'Please designate a corresponding author';
    }

    // File validation
    if (!formData.file) {
      newErrors.file = 'Manuscript file is required';
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
      const submissionData = {
        journalId,
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        manuscriptType: formData.manuscriptType,
        version: formData.version,
        authors: formData.authors,
        file: formData.file
      };

      const result = await submitManuscriptApi(submissionData, {
        successMessage: 'Manuscript submitted successfully!'
      });

      if (result) {
        // Redirect to submission tracking page
        navigate('/publishing/submissions', {
          state: { 
            submitted: true,
            submissionId: result.submissionId 
          }
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
      <div className="auth-required">
        <div className="auth-message">
          <h2>Authentication Required</h2>
          <p>Please sign in to submit a manuscript.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manuscript-submission-page">
      <div className="container">
        <div className="submission-header">
          <h1>Submit Manuscript</h1>
          <p>Submit your research for publication consideration</p>
        </div>

        <div className="submission-layout">
          {/* Main Form */}
          <div className="submission-form">
            <form onSubmit={handleSubmit}>
              {/* Manuscript Details */}
              <div className="form-section">
                <h3>Manuscript Details</h3>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label required">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`form-input ${errors.title ? 'error' : ''}`}
                      placeholder="Enter manuscript title"
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label required">Abstract</label>
                    <textarea
                      value={formData.abstract}
                      onChange={(e) => handleInputChange('abstract', e.target.value)}
                      className={`form-textarea ${errors.abstract ? 'error' : ''}`}
                      placeholder="Provide a comprehensive abstract of your manuscript..."
                      rows="6"
                    />
                    {errors.abstract && <span className="error-message">{errors.abstract}</span>}
                    <div className="field-note">
                      {formData.abstract.length}/100 characters minimum
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label required">Keywords</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      className={`form-input ${errors.keywords ? 'error' : ''}`}
                      placeholder="Enter comma-separated keywords"
                    />
                    {errors.keywords && <span className="error-message">{errors.keywords}</span>}
                    <div className="field-note">
                      Separate keywords with commas (e.g., urban planning, sustainability, GIS)
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Manuscript Type</label>
                    <select
                      value={formData.manuscriptType}
                      onChange={(e) => handleInputChange('manuscriptType', e.target.value)}
                      className={`form-select ${errors.manuscriptType ? 'error' : ''}`}
                    >
                      <option value="research">Research Article</option>
                      <option value="review">Review Article</option>
                      <option value="case_study">Case Study</option>
                      <option value="short_communication">Short Communication</option>
                      <option value="book_review">Book Review</option>
                    </select>
                    {errors.manuscriptType && <span className="error-message">{errors.manuscriptType}</span>}
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
                    <div className="field-note">
                      Optional version identifier
                    </div>
                  </div>
                </div>
              </div>

              {/* Authors Section */}
              <div className="form-section">
                <div className="authors-section">
                  <h3>Authors</h3>
                  
                  {formData.authors.map((author, index) => (
                    <div key={index} className="author-item">
                      <div className="author-header">
                        <span className="author-type">
                          {author.isCorresponding ? 'Corresponding Author' : `Author ${author.order}`}
                        </span>
                        {formData.authors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="remove-author"
                            aria-label="Remove author"
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
                            onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                            className={`form-input ${errors[`author_${index}_firstName`] ? 'error' : ''}`}
                            placeholder="First name"
                            disabled={author.id === user?.id}
                          />
                          {errors[`author_${index}_firstName`] && (
                            <span className="error-message">{errors[`author_${index}_firstName`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label required">Last Name</label>
                          <input
                            type="text"
                            value={author.lastName}
                            onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                            className={`form-input ${errors[`author_${index}_lastName`] ? 'error' : ''}`}
                            placeholder="Last name"
                            disabled={author.id === user?.id}
                          />
                          {errors[`author_${index}_lastName`] && (
                            <span className="error-message">{errors[`author_${index}_lastName`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label required">Email</label>
                          <input
                            type="email"
                            value={author.email}
                            onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                            className={`form-input ${errors[`author_${index}_email`] ? 'error' : ''}`}
                            placeholder="Email address"
                            disabled={author.id === user?.id}
                          />
                          {errors[`author_${index}_email`] && (
                            <span className="error-message">{errors[`author_${index}_email`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Affiliation</label>
                          <input
                            type="text"
                            value={author.affiliation}
                            onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                            className="form-input"
                            placeholder="Institution or organization"
                          />
                        </div>
                      </div>

                      <div className="author-actions">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={author.isCorresponding}
                            onChange={() => setCorrespondingAuthor(index)}
                            className="checkbox-input"
                          />
                          <span className="checkbox-text">Corresponding Author</span>
                        </label>
                      </div>
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

                <div
                  className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${formData.file ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!formData.file ? (
                    <>
                      <div className="file-upload-icon">
                        <Upload size={48} />
                      </div>
                      <div className="file-upload-text">
                        <h4>Upload Manuscript</h4>
                        <p>Click to browse or drag and drop your file here</p>
                      </div>
                    </>
                  ) : (
                    <div className="uploaded-file">
                      <FileText size={24} />
                      <div className="file-info">
                        <div className="file-name">{formData.file.name}</div>
                        <div className="file-size">{formatFileSize(formData.file.size)}</div>
                      </div>
                      <div className="file-status success">
                        <CheckCircle size={16} />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="remove-file"
                        aria-label="Remove file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  className="file-input"
                />

                <div className="file-requirements">
                  <p>
                    <strong>Supported formats:</strong> PDF, DOC, DOCX<br />
                    <strong>Maximum file size:</strong> 10MB
                  </p>
                </div>

                {errors.file && <span className="error-message">{errors.file}</span>}
              </div>

              {/* Anonymity Warning */}
              <div className="anonymity-warning">
                <div className="warning-header">
                  <AlertTriangle size={20} />
                  <h4>Anonymity Policy</h4>
                </div>
                <div className="warning-content">
                  <p>
                    To ensure blind peer review, please ensure your manuscript file does not contain:
                  </p>
                  <ul>
                    <li>Author names or affiliations</li>
                    <li>Personal identifiers in the text</li>
                    <li>Acknowledgements that reveal identity</li>
                    <li>Funding information that reveals identity</li>
                  </ul>
                  <p>
                    Manuscripts violating the anonymity policy will be automatically rejected.
                  </p>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="terms-agreement">
                <div className="agreement-text">
                  <p>
                    By submitting this manuscript, you agree to the following terms and conditions:
                  </p>
                  <ul>
                    <li>The manuscript is your original work and has not been published elsewhere</li>
                    <li>All authors have approved the submission</li>
                    <li>The research complies with ethical standards</li>
                    <li>You agree to the peer review process</li>
                    <li>You understand that submission fees may apply for accepted manuscripts</li>
                  </ul>
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    I have read and agree to the terms and conditions, and confirm that 
                    the manuscript adheres to the anonymity policy.
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <span className="error-message">{errors.agreeToTerms}</span>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline btn-large"
                  disabled={loading || submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || submitLoading || !formData.agreeToTerms}
                  className="btn btn-primary btn-large"
                >
                  {(loading || submitLoading) ? (
                    <Loader size="sm" />
                  ) : (
                    'Submit Manuscript'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="submission-sidebar">
            <div className="journal-info-card">
              <h3>Journal Information</h3>
              <div className="journal-details">
                <div className="detail-row">
                  <span className="detail-label">Journal:</span>
                  <span className="detail-value">Urban Planning Review</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Impact Factor:</span>
                  <span className="detail-value">3.2</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Submission Fee:</span>
                  <span className="detail-value">$50 USD</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Review Time:</span>
                  <span className="detail-value">4-6 weeks</span>
                </div>
              </div>
            </div>

            <div className="timeline-card">
              <h3>Submission Timeline</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Initial Review</div>
                    <div className="timeline-description">
                      Editorial check for completeness and anonymity
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Peer Review</div>
                    <div className="timeline-description">
                      Assessment by 2-3 expert reviewers
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Decision</div>
                    <div className="timeline-description">
                      Accept, revise, or reject decision
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">Publication</div>
                    <div className="timeline-description">
                      Online publication upon acceptance
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