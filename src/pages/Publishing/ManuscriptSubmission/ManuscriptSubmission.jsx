import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import { 
  Upload, FileText, User, Users, Calendar, AlertTriangle, 
  CheckCircle, X, Plus, Download, Mail, Building, Award 
} from 'lucide-react';
import Loader from '../../../components/common/Loader/Loader';
import './ManuscriptSubmission.css';

/**
 * Manuscript Submission Component
 * Modern, interactive UI with animations and enhanced user experience
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
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedAuthor, setExpandedAuthor] = useState(0);

  // Refs
  const fileInputRef = useRef(null);

  // API hooks
  const [submitManuscriptApi, submitLoading] = useApi(publishingAPI.submitManuscript);

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Handle author field changes
   */
  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
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
    setFormData(prev => ({ ...prev, authors: [...prev.authors, newAuthor] }));
    setExpandedAuthor(formData.authors.length);
  };

  /**
   * Remove author
   */
  const removeAuthor = (index) => {
    if (formData.authors.length <= 1) {
      showNotification('At least one author is required', 'error');
      return;
    }
    const updatedAuthors = formData.authors
      .filter((_, i) => i !== index)
      .map((author, i) => ({ ...author, order: i + 1 }));
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
  };

  /**
   * Set corresponding author
   */
  const setCorrespondingAuthor = (index) => {
    const updatedAuthors = formData.authors.map((author, i) => ({
      ...author,
      isCorresponding: i === index
    }));
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
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
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification('Please upload a PDF or Word document', 'error');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('File size must be less than 10MB', 'error');
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  /**
   * Remove selected file
   */
  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

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

    const hasCorrespondingAuthor = formData.authors.some(author => author.isCorresponding);
    if (!hasCorrespondingAuthor) {
      newErrors.authors = 'Please designate a corresponding author';
    }

    if (!formData.file) {
      newErrors.file = 'Manuscript file is required';
    }

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
      <div className="manuscript-auth-required">
        <div className="auth-card">
          <AlertTriangle className="auth-icon" />
          <h2>Authentication Required</h2>
          <p>Please sign in to submit a manuscript.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/login', { state: { from: `/publishing/submit/${journalId}` } })}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading || submitLoading) {
    return <Loader message="Submitting your manuscript..." />;
  }

  return (
    <div className="manuscript-submission-container">
      {/* Header Section */}
      <div className="submission-header">
        <div className="header-content">
          <div className="header-icon">
            <FileText />
          </div>
          <div className="header-text">
            <h1>Submit Your Research</h1>
            <p>Share your work with the academic community</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">1</div>
            <span>Manuscript Details</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">2</div>
            <span>Authors</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Upload & Review</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="submission-form">
        {/* Manuscript Details Section */}
        <div className="form-section animate-slide-up">
          <div className="section-header">
            <FileText className="section-icon" />
            <h2>Manuscript Information</h2>
          </div>

          <div className="form-grid">
            {/* Title */}
            <div className="form-group full-width">
              <label htmlFor="title" className="form-label">
                Manuscript Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter your manuscript title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Manuscript Type */}
            <div className="form-group">
              <label htmlFor="manuscriptType" className="form-label">
                Manuscript Type <span className="required">*</span>
              </label>
              <select
                id="manuscriptType"
                className={`form-select ${errors.manuscriptType ? 'error' : ''}`}
                value={formData.manuscriptType}
                onChange={(e) => handleInputChange('manuscriptType', e.target.value)}
              >
                <option value="research">Research Article</option>
                <option value="review">Review Article</option>
                <option value="case-study">Case Study</option>
                <option value="short-communication">Short Communication</option>
                <option value="letter">Letter to Editor</option>
              </select>
              {errors.manuscriptType && <span className="error-message">{errors.manuscriptType}</span>}
            </div>

            {/* Version */}
            <div className="form-group">
              <label htmlFor="version" className="form-label">
                Version (Optional)
              </label>
              <input
                type="text"
                id="version"
                className="form-input"
                placeholder="e.g., 1.0, Revised"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
              />
            </div>

            {/* Abstract */}
            <div className="form-group full-width">
              <label htmlFor="abstract" className="form-label">
                Abstract <span className="required">*</span>
                <span className="char-count">{formData.abstract.length} / 100 min</span>
              </label>
              <textarea
                id="abstract"
                className={`form-textarea ${errors.abstract ? 'error' : ''}`}
                placeholder="Provide a concise summary of your research (minimum 100 characters)"
                rows="6"
                value={formData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
              />
              {errors.abstract && <span className="error-message">{errors.abstract}</span>}
            </div>

            {/* Keywords */}
            <div className="form-group full-width">
              <label htmlFor="keywords" className="form-label">
                Keywords <span className="required">*</span>
              </label>
              <input
                type="text"
                id="keywords"
                className={`form-input ${errors.keywords ? 'error' : ''}`}
                placeholder="Separate keywords with commas (e.g., machine learning, AI, neural networks)"
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
              />
              {errors.keywords && <span className="error-message">{errors.keywords}</span>}
            </div>
          </div>
        </div>

        {/* Authors Section */}
        <div className="form-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <Users className="section-icon" />
            <h2>Author Information</h2>
          </div>

          <div className="authors-list">
            {formData.authors.map((author, index) => (
              <div 
                key={index} 
                className={`author-card ${expandedAuthor === index ? 'expanded' : ''}`}
              >
                <div className="author-card-header" onClick={() => setExpandedAuthor(expandedAuthor === index ? -1 : index)}>
                  <div className="author-info">
                    <div className="author-avatar">
                      {author.firstName?.[0] || '?'}{author.lastName?.[0] || ''}
                    </div>
                    <div>
                      <h3>
                        {author.firstName && author.lastName 
                          ? `${author.firstName} ${author.lastName}` 
                          : `Author ${index + 1}`}
                      </h3>
                      {author.isCorresponding && (
                        <span className="badge badge-primary">Corresponding Author</span>
                      )}
                    </div>
                  </div>
                  <div className="author-actions">
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAuthor(index);
                        }}
                        title="Remove Author"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {expandedAuthor === index && (
                  <div className="author-card-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          First Name <span className="required">*</span>
                        </label>
                        <div className="input-with-icon">
                          <User size={18} />
                          <input
                            type="text"
                            className={`form-input ${errors[`author_${index}_firstName`] ? 'error' : ''}`}
                            placeholder="First name"
                            value={author.firstName}
                            onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                          />
                        </div>
                        {errors[`author_${index}_firstName`] && (
                          <span className="error-message">{errors[`author_${index}_firstName`]}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Last Name <span className="required">*</span>
                        </label>
                        <div className="input-with-icon">
                          <User size={18} />
                          <input
                            type="text"
                            className={`form-input ${errors[`author_${index}_lastName`] ? 'error' : ''}`}
                            placeholder="Last name"
                            value={author.lastName}
                            onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                          />
                        </div>
                        {errors[`author_${index}_lastName`] && (
                          <span className="error-message">{errors[`author_${index}_lastName`]}</span>
                        )}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">
                          Email <span className="required">*</span>
                        </label>
                        <div className="input-with-icon">
                          <Mail size={18} />
                          <input
                            type="email"
                            className={`form-input ${errors[`author_${index}_email`] ? 'error' : ''}`}
                            placeholder="Email address"
                            value={author.email}
                            onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                          />
                        </div>
                        {errors[`author_${index}_email`] && (
                          <span className="error-message">{errors[`author_${index}_email`]}</span>
                        )}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Affiliation</label>
                        <div className="input-with-icon">
                          <Building size={18} />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="University or organization"
                            value={author.affiliation}
                            onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={author.isCorresponding}
                            onChange={() => setCorrespondingAuthor(index)}
                          />
                          <span>Set as Corresponding Author</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary btn-add-author"
            onClick={addAuthor}
          >
            <Plus size={20} />
            Add Co-Author
          </button>

          {errors.authors && <span className="error-message">{errors.authors}</span>}
        </div>

        {/* File Upload Section */}
        <div className="form-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <Upload className="section-icon" />
            <h2>Upload Manuscript</h2>
          </div>

          <div
            className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${formData.file ? 'has-file' : ''} ${errors.file ? 'error' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !formData.file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {!formData.file ? (
              <div className="upload-placeholder">
                <Upload className="upload-icon" />
                <h3>Drop your manuscript here</h3>
                <p>or click to browse files</p>
                <span className="file-types">Supported: PDF, DOC, DOCX (Max 10MB)</span>
              </div>
            ) : (
              <div className="uploaded-file">
                <FileText className="file-icon" />
                <div className="file-details">
                  <h4>{formData.file.name}</h4>
                  <p>{formatFileSize(formData.file.size)}</p>
                </div>
                <button
                  type="button"
                  className="btn-icon btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
          {errors.file && <span className="error-message">{errors.file}</span>}

          {/* Anonymity Notice */}
          <div className="info-box">
            <AlertTriangle className="info-icon" />
            <div>
              <h4>Anonymity Policy</h4>
              <p>
                Please ensure your manuscript does not contain any author-identifying information
                to maintain the integrity of the peer review process.
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="form-section animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="terms-section">
            <label className="checkbox-label large">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              />
              <span>
                I confirm that this manuscript is original, has not been published elsewhere, 
                and complies with all submission guidelines and ethical standards.
              </span>
            </label>
            {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size="small" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Submit Manuscript
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManuscriptSubmission;
