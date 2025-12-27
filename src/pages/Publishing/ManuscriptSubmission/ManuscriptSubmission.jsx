import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { publishingAPI } from '../../../services/api/publishing';
import { Upload, FileText, User, Users, Calendar, AlertTriangle, CheckCircle, X, Plus, Download, Mail, Building, Award, Search } from 'lucide-react';
import Loader from '../../../components/common/Loader/Loader';
import './ManuscriptSubmission.css';

const ManuscriptSubmission = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    abstractInputType: 'text',
    abstractFile: null,
    keywords: '',
    authors: [
      {
        id: user?.id,
        authorId: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        affiliation: '',
        isCorresponding: true,
        order: 1,
      },
    ],
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedAuthor, setExpandedAuthor] = useState(0);
  const [loadingAuthorId, setLoadingAuthorId] = useState(null);
  const abstractFileInputRef = useRef(null);

  const { execute: submitManuscriptApi } = useApi(publishingAPI.submitManuscript);
  const { execute: fetchAuthorByIdApi } = useApi(publishingAPI.getAuthorById);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAbstractInputTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      abstractInputType: type,
      abstract: type === 'file' ? '' : prev.abstract,
      abstractFile: type === 'text' ? null : prev.abstractFile,
    }));
    if (errors.abstract) {
      setErrors((prev) => ({ ...prev, abstract: '' }));
    }
  };

  const handleAbstractFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) validateAndSetAbstractFile(file);
  };

  const validateAndSetAbstractFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification('Please upload a PDF, JPG, PNG, or Word document', 'error');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('File size must be less than 5MB', 'error');
      return;
    }

    setFormData((prev) => ({ ...prev, abstractFile: file }));
    if (errors.abstract) {
      setErrors((prev) => ({ ...prev, abstract: '' }));
    }
    showNotification('Abstract file uploaded successfully', 'success');
  };

  const removeAbstractFile = () => {
    setFormData((prev) => ({ ...prev, abstractFile: null }));
    if (abstractFileInputRef.current) {
      abstractFileInputRef.current.value = '';
    }
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, authors: updatedAuthors }));

    // Clear error for this specific field
    if (errors[`author_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`author_${index}_${field}`]: '' }));
    }
  };

  // Fetch Author Details by Author ID - Auto-trigger when authorId changes
  const handleAuthorIdChange = async (index, authorId) => {
    handleAuthorChange(index, 'authorId', authorId);

    // Only fetch if authorId is not empty and index > 0 (not the first author)
    if (index > 0 && authorId.trim()) {
      setLoadingAuthorId(index);

      try {
        // Call API to fetch author details
        const authorData = await fetchAuthorByIdApi({ authorId }, {
          showError: false
        });

        if (authorData) {
          // Auto-fill author details
          const updatedAuthors = [...formData.authors];
          updatedAuthors[index] = {
            ...updatedAuthors[index],
            firstName: authorData.firstName || '',
            lastName: authorData.lastName || '',
            email: authorData.email || '',
            affiliation: authorData.affiliation || '',
            id: authorData.id || '',
          };
          setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
          showNotification('Author details loaded successfully!', 'success');
        } else {
          showNotification('Author ID not found. Please check and try again.', 'error');
        }
      } catch (error) {
        showNotification('Author ID not found. Please check and try again.', 'error');
      } finally {
        setLoadingAuthorId(null);
      }
    }
  };

  const addAuthor = () => {
    const newAuthor = {
      id: '',
      authorId: '',
      firstName: '',
      lastName: '',
      email: '',
      affiliation: '',
      isCorresponding: false,
      order: formData.authors.length + 1,
    };
    setFormData((prev) => ({ ...prev, authors: [...prev.authors, newAuthor] }));
    setExpandedAuthor(formData.authors.length);
  };

  const removeAuthor = (index) => {
    if (formData.authors.length <= 1) {
      showNotification('At least one author is required', 'error');
      return;
    }

    const updatedAuthors = formData.authors
      .filter((_, i) => i !== index)
      .map((author, i) => ({
        ...author,
        order: i + 1,
      }));

    setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
  };

  const setCorrespondingAuthor = (index) => {
    const updatedAuthors = formData.authors.map((author, i) => ({
      ...author,
      isCorresponding: i === index,
    }));
    setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.abstractInputType === 'text') {
      if (!formData.abstract.trim()) {
        newErrors.abstract = 'Abstract is required';
      } else if (formData.abstract.length < 100) {
        newErrors.abstract = 'Abstract must be at least 100 characters';
      }
    } else {
      if (!formData.abstractFile) {
        newErrors.abstract = 'Abstract file is required';
      }
    }

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    }

    formData.authors.forEach((author, index) => {
      // For co-authors (index > 0), authorId is required
      if (index > 0 && !author.authorId.trim()) {
        newErrors[`author_${index}_authorId`] = 'Author ID is required';
      }

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

    const hasCorrespondingAuthor = formData.authors.some((author) => author.isCorresponding);
    if (!hasCorrespondingAuthor) {
      newErrors.authors = 'Please designate a corresponding author';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

      if (formData.abstractInputType === 'text') {
        submissionFormData.append('abstract', formData.abstract);
        submissionFormData.append('abstractType', 'text');
      } else {
        submissionFormData.append('abstractFile', formData.abstractFile);
        submissionFormData.append('abstractType', 'file');
      }

      submissionFormData.append('keywords', formData.keywords);
      submissionFormData.append('authors', JSON.stringify(formData.authors));

      const result = await submitManuscriptApi(submissionFormData, {
        successMessage: 'Manuscript submitted successfully!',
      });

      if (result) {
        navigate('/publishing/submissions', {
          state: { submitted: true, submissionId: result.submissionId },
        });
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false);
    }
  };

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
          <div className="submission-header">
            <div className="header-icon">
              <FileText size={32} />
            </div>
            <h1>Please sign in to submit a manuscript.</h1>
            <p>Share your work with the academic community</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manuscript-submission-page">
      <div className="container">
        <div className="submission-header">
          <div className="header-icon">
            <FileText size={32} />
          </div>
          <h1>Submit Manuscript</h1>
          <p>Share your research with the academic community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="manuscript-card">
            {/* Card Header */}
            <div className="card-header">
              <FileText size={24} />
              <div>
                <h2>Manuscript Details</h2>
                <p>Fill in the details of your manuscript</p>
              </div>
            </div>

            <div className="card-body">
              {/* Title */}
              <div className="form-group">
                <label className="form-label">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter manuscript title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                {errors.title && <p className="error-text">{errors.title}</p>}
              </div>

              {/* Abstract Type Selector */}
              <div className="form-group">
                <label className="form-label">
                  Abstract <span className="text-error">*</span>
                </label>
                <div className="abstract-type-selector">
                  <button
                    type="button"
                    className={`type-option ${formData.abstractInputType === 'text' ? 'active' : ''}`}
                    onClick={() => handleAbstractInputTypeChange('text')}
                  >
                    <FileText size={18} />
                    Write Abstract
                  </button>
                  <button
                    type="button"
                    className={`type-option ${formData.abstractInputType === 'file' ? 'active' : ''}`}
                    onClick={() => handleAbstractInputTypeChange('file')}
                  >
                    <Upload size={18} />
                    Upload Abstract File
                  </button>
                </div>

                {/* Abstract Text Input */}
                {formData.abstractInputType === 'text' && (
                  <div className="abstract-text-input">
                    <textarea
                      className={`form-textarea ${errors.abstract ? 'error' : ''}`}
                      placeholder="Enter abstract (minimum 100 characters)"
                      value={formData.abstract}
                      onChange={(e) => handleInputChange('abstract', e.target.value)}
                      rows="6"
                    />
                    <span className="char-count">{formData.abstract.length} / 100 min</span>
                    {errors.abstract && <p className="error-text">{errors.abstract}</p>}
                  </div>
                )}

                {/* Abstract File Upload */}
                {formData.abstractInputType === 'file' && (
                  <>
                    {!formData.abstractFile ? (
                      <div
                        className="upload-area"
                        onClick={() => abstractFileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={abstractFileInputRef}
                          className="file-input-hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleAbstractFileUpload}
                        />
                        <Upload size={48} color="#667eea" />
                        <p>Click to upload abstract file</p>
                        <p className="text-secondary">PDF, JPG, PNG, Word (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="file-uploaded">
                        <div className="file-info">
                          <FileText size={24} className="file-icon" />
                          <div>
                            <p className="file-name">{formData.abstractFile.name}</p>
                            <p className="file-size">{formatFileSize(formData.abstractFile.size)}</p>
                          </div>
                        </div>
                        <button type="button" className="btn-remove" onClick={removeAbstractFile}>
                          <X size={16} />
                          Remove
                        </button>
                      </div>
                    )}
                    {errors.abstract && <p className="error-text">{errors.abstract}</p>}
                  </>
                )}
              </div>

              {/* Keywords */}
              <div className="form-group">
                <label className="form-label">
                  Keywords <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.keywords ? 'error' : ''}`}
                  placeholder="Enter keywords separated by commas"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                />
                {errors.keywords && <p className="error-text">{errors.keywords}</p>}
              </div>

              {/* Authors Section */}
              <div className="form-group">
                <label className="form-label">
                  Authors <span className="text-error">*</span>
                </label>
                {errors.authors && <p className="error-text">{errors.authors}</p>}

                {formData.authors.map((author, index) => (
                  <div key={index} className="author-card">
                    <div className="author-card-header">
                      <div className="author-header-left">
                        <User size={20} />
                        <h3>Author {index + 1}</h3>
                        {author.isCorresponding && <span className="badge-primary">Corresponding</span>}
                      </div>
                      {formData.authors.length > 1 && (
                        <button
                          type="button"
                          className="btn-icon-remove"
                          onClick={() => removeAuthor(index)}
                          aria-label="Remove author"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    {/* Author ID Field - Only for Author 2 onwards (index > 0) */}
                    {index > 0 && (
                      <div className="author-id-search-section">
                        <label className="form-label-small">
                          Author ID <span className="text-error">*</span>
                        </label>
                        <div className="author-id-input-group">
                          <input
                            type="text"
                            className={`form-input ${errors[`author_${index}_authorId`] ? 'error' : ''}`}
                            placeholder="Enter Author ID to auto-fill details"
                            value={author.authorId || ''}
                            onChange={(e) => handleAuthorIdChange(index, e.target.value)}
                          />
                          {loadingAuthorId === index && (
                            <div className="loading-indicator">
                              <span className="loading-spinner">⏳</span>
                              <span className="loading-text">Loading...</span>
                            </div>
                          )}
                        </div>
                        {errors[`author_${index}_authorId`] && (
                          <p className="error-text">{errors[`author_${index}_authorId`]}</p>
                        )}
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label-small">
                          First Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-input ${errors[`author_${index}_firstName`] ? 'error' : ''}`}
                          placeholder="First name"
                          value={author.firstName}
                          onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                          disabled={loadingAuthorId === index}
                        />
                        {errors[`author_${index}_firstName`] && (
                          <p className="error-text">{errors[`author_${index}_firstName`]}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label-small">
                          Last Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-input ${errors[`author_${index}_lastName`] ? 'error' : ''}`}
                          placeholder="Last name"
                          value={author.lastName}
                          onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                          disabled={loadingAuthorId === index}
                        />
                        {errors[`author_${index}_lastName`] && (
                          <p className="error-text">{errors[`author_${index}_lastName`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label-small">
                          Email <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-input ${errors[`author_${index}_email`] ? 'error' : ''}`}
                          placeholder="Email address"
                          value={author.email}
                          onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                          disabled={loadingAuthorId === index}
                        />
                        {errors[`author_${index}_email`] && (
                          <p className="error-text">{errors[`author_${index}_email`]}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label-small">Affiliation</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Institution or organization"
                          value={author.affiliation}
                          onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                          disabled={loadingAuthorId === index}
                        />
                      </div>
                    </div>

                    {!author.isCorresponding && (
                      <button
                        type="button"
                        className="btn-set-corresponding"
                        onClick={() => setCorrespondingAuthor(index)}
                      >
                        Set as Corresponding Author
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" className="btn-add-author" onClick={addAuthor}>
                  <Plus size={18} />
                  Add Co-Author
                </button>
              </div>

              {/* Terms and Conditions */}
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  />
                  <label htmlFor="agreeToTerms">
                    I agree to the terms and conditions <span className="text-error">*</span>
                  </label>
                </div>
                {errors.agreeToTerms && <p className="error-text">{errors.agreeToTerms}</p>}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-spinner">⏳</span>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManuscriptSubmission;
