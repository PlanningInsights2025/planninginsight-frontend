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
  Download,
  Mail,
  Building,
  Award
} from 'lucide-react';
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
    authors: [{
      id: user?.id,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      affiliation: '',
      isCorresponding: true,
      order: 1
    }],
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedAuthor, setExpandedAuthor] = useState(0);
  const abstractFileInputRef = useRef(null);
  const [submitManuscriptApi] = useApi(publishingAPI.submitManuscript);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAbstractInputTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      abstractInputType: type,
      abstract: type === 'file' ? '' : prev.abstract,
      abstractFile: type === 'text' ? null : prev.abstractFile
    }));
    if (errors.abstract) {
      setErrors(prev => ({ ...prev, abstract: '' }));
    }
  };

  const handleAbstractFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) validateAndSetAbstractFile(file);
  };

  const validateAndSetAbstractFile = (file) => {
    const allowedTypes = [
      'application/pdf', 'image/jpeg', 'image/jpg', 'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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

    setFormData(prev => ({ ...prev, abstractFile: file }));
    if (errors.abstract) {
      setErrors(prev => ({ ...prev, abstract: '' }));
    }
    showNotification('Abstract file uploaded successfully', 'success');
  };

  const removeAbstractFile = () => {
    setFormData(prev => ({ ...prev, abstractFile: null }));
    if (abstractFileInputRef.current) {
      abstractFileInputRef.current.value = '';
    }
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
  };

  const addAuthor = () => {
    const newAuthor = {
      id: '', firstName: '', lastName: '', email: '',
      affiliation: '', isCorresponding: false,
      order: formData.authors.length + 1
    };
    setFormData(prev => ({ ...prev, authors: [...prev.authors, newAuthor] }));
    setExpandedAuthor(formData.authors.length);
  };

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

  const setCorrespondingAuthor = (index) => {
    const updatedAuthors = formData.authors.map((author, i) => ({
      ...author,
      isCorresponding: i === index
    }));
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
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

    const hasCorrespondingAuthor = formData.authors.some(
      author => author.isCorresponding
    );
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
        <div className="submission-header">
          <div className="header-icon">
            <FileText size={32} />
          </div>
          <h1>Submit Manuscript</h1>
          <p>Share your work with the academic community</p>
        </div>

        <div className="submission-content">
          <div className="manuscript-card">
            <div className="card-header">
              <FileText size={24} />
              <h2>Manuscript Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="submission-form">
              {/* Title */}
              <div className="form-group">
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

              {/* Abstract */}
              <div className="form-group">
                <label className="form-label">
                  Abstract <span className="required">*</span>
                </label>
                
                <div className="abstract-type-selector">
                  <button
                    type="button"
                    className={`type-option ${formData.abstractInputType === 'text' ? 'active' : ''}`}
                    onClick={() => handleAbstractInputTypeChange('text')}
                  >
                    <FileText size={18} />
                    <span>Write Abstract</span>
                  </button>
                  <button
                    type="button"
                    className={`type-option ${formData.abstractInputType === 'file' ? 'active' : ''}`}
                    onClick={() => handleAbstractInputTypeChange('file')}
                  >
                    <Upload size={18} />
                    <span>Upload File</span>
                  </button>
                </div>

                {formData.abstractInputType === 'text' && (
                  <div className="abstract-text-input">
                    <textarea
                      id="abstract"
                      className={`form-textarea ${errors.abstract ? 'error' : ''}`}
                      placeholder="Provide a concise summary of your research (minimum 100 characters)"
                      rows={6}
                      value={formData.abstract}
                      onChange={(e) => handleInputChange('abstract', e.target.value)}
                    />
                    <div className="char-count">
                      {formData.abstract.length} / 100 min
                    </div>
                  </div>
                )}

                {formData.abstractInputType === 'file' && (
                  <div className="abstract-file-upload">
                    {!formData.abstractFile ? (
                      <div className="upload-area">
                        <input
                          type="file"
                          id="abstractFile"
                          ref={abstractFileInputRef}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleAbstractFileUpload}
                          className="file-input-hidden"
                        />
                        <label htmlFor="abstractFile" className="upload-label">
                          <Upload size={32} />
                          <div className="upload-text">
                            <p className="upload-title">Upload Abstract File</p>
                            <p className="upload-subtitle">
                              PDF, JPG, PNG, or Word document (max 5MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="file-uploaded">
                        <div className="file-info">
                          <FileText size={24} className="file-icon" />
                          <div className="file-details">
                            <h5>{formData.abstractFile.name}</h5>
                            <p>{formatFileSize(formData.abstractFile.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeAbstractFile}
                          className="btn-remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {errors.abstract && <span className="error-message">{errors.abstract}</span>}
              </div>

              {/* Keywords */}
              <div className="form-group">
                <label htmlFor="keywords" className="form-label">
                  Keywords <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="keywords"
                  className={`form-input ${errors.keywords ? 'error' : ''}`}
                  placeholder="Enter keywords separated by commas"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                />
                {errors.keywords && <span className="error-message">{errors.keywords}</span>}
                <p className="field-hint">
                  Add relevant keywords to help readers discover your work (separate with commas)
                </p>
              </div>

              {/* Authors */}
              <div className="form-section">
                <div className="section-header">
                  <Users size={20} />
                  <h3>Authors</h3>
                </div>

                {formData.authors.map((author, index) => (
                  <div key={index} className="author-card">
                    <div className="author-card-header">
                      <div className="author-info">
                        <User size={16} />
                        <span>
                          {author.firstName || author.lastName
                            ? `${author.firstName} ${author.lastName}`
                            : `Author ${index + 1}`}
                        </span>
                        {author.isCorresponding && (
                          <span className="badge badge-primary">Corresponding</span>
                        )}
                      </div>
                      <div className="author-actions">
                        {formData.authors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                            className="btn-icon btn-danger"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="author-card-body">
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">
                            First Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-input ${errors[`author_${index}_firstName`] ? 'error' : ''}`}
                            placeholder="First name"
                            value={author.firstName}
                            onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                            disabled={index === 0 && user?.firstName}
                          />
                          {errors[`author_${index}_firstName`] && (
                            <span className="error-message">{errors[`author_${index}_firstName`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Last Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-input ${errors[`author_${index}_lastName`] ? 'error' : ''}`}
                            placeholder="Last name"
                            value={author.lastName}
                            onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                            disabled={index === 0 && user?.lastName}
                          />
                          {errors[`author_${index}_lastName`] && (
                            <span className="error-message">{errors[`author_${index}_lastName`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Email <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-input ${errors[`author_${index}_email`] ? 'error' : ''}`}
                            placeholder="Email address"
                            value={author.email}
                            onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                            disabled={index === 0 && user?.email}
                          />
                          {errors[`author_${index}_email`] && (
                            <span className="error-message">{errors[`author_${index}_email`]}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Affiliation</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Institution or organization"
                            value={author.affiliation}
                            onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                          />
                        </div>
                      </div>

                      {!author.isCorresponding && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setCorrespondingAuthor(index)}
                        >
                          Set as Corresponding Author
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {errors.authors && <span className="error-message">{errors.authors}</span>}

                <button type="button" onClick={addAuthor} className="btn btn-outline">
                  <Plus size={16} />
                  Add Co-Author
                </button>
              </div>

              {/* Terms */}
              <div className="form-section">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    />
                    <span>
                      I agree to the terms and conditions and confirm that this
                      manuscript is original work <span className="required">*</span>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <span className="error-message">{errors.agreeToTerms}</span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size="sm" />
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptSubmission;
