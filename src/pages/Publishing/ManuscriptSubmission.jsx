import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { useApi } from '../../hooks/useApi'
import { publishingAPI } from '../../services/api/publishing'
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  User,
  Users,
  AlertCircle,
  CheckCircle,
  X,
  BookOpen,
  Calendar,
  FileCheck
} from 'lucide-react'
import Loader from '../../components/common/Loader/Loader'

/**
 * Manuscript Submission Page Component
 * Handles academic manuscript submission with co-author management and file uploads
 * Includes plagiarism check and submission workflow
 */
const ManuscriptSubmission = () => {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: [],
    manuscriptType: 'research_paper',
    journal: '',
    category: '',
    authors: [{ 
      id: user?.id, 
      name: `${user?.firstName} ${user?.lastName}`.trim(), 
      email: user?.email, 
      affiliation: user?.affiliation || '',
      corresponding: true,
      order: 1 
    }],
    files: {
      manuscript: null,
      coverLetter: null,
      supplementary: null
    },
    agreeToTerms: false,
    agreeToOriginality: false
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [journals, setJournals] = useState([])
  const [tempKeyword, setTempKeyword] = useState('')
  const [coAuthorEmail, setCoAuthorEmail] = useState('')

  // API hooks
  const [submitManuscriptApi] = useApi(publishingAPI.submitManuscript)
  const [fetchJournalsApi] = useApi(publishingAPI.getJournals)

  /**
   * Fetch available journals on component mount
   */
  useEffect(() => {
    loadJournals()
  }, [])

  /**
   * Load available journals for submission
   */
  const loadJournals = async () => {
    try {
      const journalsData = await fetchJournalsApi(null, {
        showError: true,
        errorMessage: 'Failed to load journals'
      })
      
      if (journalsData) {
        setJournals(journalsData)
      }
    } catch (error) {
      // Error handled by useApi hook
    }
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  /**
   * Handle file upload
   */
  const handleFileUpload = (fileType, file) => {
    // Validate file type and size
    const validTypes = {
      manuscript: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      coverLetter: ['application/pdf'],
      supplementary: ['application/pdf', 'application/zip']
    }
    
    const maxSizes = {
      manuscript: 10 * 1024 * 1024, // 10MB
      coverLetter: 5 * 1024 * 1024, // 5MB
      supplementary: 20 * 1024 * 1024 // 20MB
    }

    if (!validTypes[fileType].includes(file.type)) {
      showNotification(`Invalid file type for ${fileType}. Please upload supported formats.`, 'error')
      return false
    }

    if (file.size > maxSizes[fileType]) {
      showNotification(`File size too large for ${fileType}. Maximum size is ${maxSizes[fileType] / 1024 / 1024}MB.`, 'error')
      return false
    }

    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: file
      }
    }))

    showNotification(`${fileType.replace('_', ' ')} uploaded successfully`, 'success')
    return true
  }

  /**
   * Add keyword to manuscript
   */
  const addKeyword = () => {
    if (tempKeyword.trim() && !formData.keywords.includes(tempKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, tempKeyword.trim()]
      }))
      setTempKeyword('')
    }
  }

  /**
   * Remove keyword from manuscript
   */
  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }))
  }

  /**
   * Add co-author by email
   */
  const addCoAuthor = () => {
    if (!coAuthorEmail.trim()) {
      showNotification('Please enter co-author email', 'error')
      return
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(coAuthorEmail)) {
      showNotification('Please enter a valid email address', 'error')
      return
    }

    // Check if author already exists
    if (formData.authors.some(author => author.email === coAuthorEmail)) {
      showNotification('This author is already added', 'error')
      return
    }

    const newAuthor = {
      id: null, // Will be set when user registers
      name: '',
      email: coAuthorEmail,
      affiliation: '',
      corresponding: false,
      order: formData.authors.length + 1
    }

    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, newAuthor]
    }))

    setCoAuthorEmail('')
    showNotification('Co-author added. They will receive an invitation to complete their profile.', 'success')
  }

  /**
   * Remove co-author
   */
  const removeCoAuthor = (index) => {
    if (formData.authors[index].corresponding) {
      showNotification('Cannot remove corresponding author', 'error')
      return
    }

    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }))
  }

  /**
   * Update co-author information
   */
  const updateCoAuthor = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) =>
        i === index ? { ...author, [field]: value } : author
      )
    }))
  }

  /**
   * Set corresponding author
   */
  const setCorrespondingAuthor = (index) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) => ({
        ...author,
        corresponding: i === index
      }))
    }))
  }

  /**
   * Validate form data
   */
  const validateForm = () => {
    const validationErrors = {}

    // Basic validations
    if (!formData.title.trim()) {
      validationErrors.title = 'Title is required'
    }

    if (!formData.abstract.trim()) {
      validationErrors.abstract = 'Abstract is required'
    } else if (formData.abstract.length < 150) {
      validationErrors.abstract = 'Abstract must be at least 150 characters'
    }

    if (formData.keywords.length === 0) {
      validationErrors.keywords = 'At least one keyword is required'
    }

    if (!formData.journal) {
      validationErrors.journal = 'Please select a journal'
    }

    if (!formData.category) {
      validationErrors.category = 'Please select a category'
    }

    // File validations
    if (!formData.files.manuscript) {
      validationErrors.manuscript = 'Manuscript file is required'
    }

    if (!formData.files.coverLetter) {
      validationErrors.coverLetter = 'Cover letter is required'
    }

    // Author validations
    formData.authors.forEach((author, index) => {
      if (!author.name.trim()) {
        validationErrors[`author_${index}_name`] = 'Author name is required'
      }
      if (!author.affiliation.trim()) {
        validationErrors[`author_${index}_affiliation`] = 'Author affiliation is required'
      }
    })

    // Terms agreement
    if (!formData.agreeToTerms) {
      validationErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    if (!formData.agreeToOriginality) {
      validationErrors.agreeToOriginality = 'You must confirm the originality of your work'
    }

    return validationErrors
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Validate form
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showNotification('Please fix the errors in the form', 'error')
      return
    }

    setSubmitting(true)

    try {
      // Simulate plagiarism check
      showNotification('Checking manuscript for plagiarism...', 'info')
      
      const plagiarismResult = await simulatePlagiarismCheck()
      
      if (!plagiarismResult.passed) {
        showNotification(`Plagiarism check failed: ${plagiarismResult.reason}`, 'error')
        setSubmitting(false)
        return
      }

      // Submit manuscript
      const submissionData = {
        ...formData,
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        status: 'under_review',
        plagiarismScore: plagiarismResult.score
      }

      const result = await submitManuscriptApi(submissionData, {
        successMessage: 'Manuscript submitted successfully! It is now under review.'
      })

      if (result) {
        // Reset form or redirect
        showNotification('Manuscript submitted successfully! You can track its status in your dashboard.', 'success')
        // In real app, would redirect to dashboard or submission status page
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Simulate plagiarism check
   */
  const simulatePlagiarismCheck = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate various checks
        const checks = [
          { check: 'similarity_threshold', passed: Math.random() > 0.1 },
          { check: 'proper_citation', passed: Math.random() > 0.05 },
          { check: 'original_content', passed: Math.random() > 0.02 }
        ]

        const failedCheck = checks.find(check => !check.passed)
        
        if (failedCheck) {
          resolve({
            passed: false,
            score: Math.floor(Math.random() * 30) + 10,
            reason: getPlagiarismReason(failedCheck.check)
          })
        } else {
          resolve({
            passed: true,
            score: Math.floor(Math.random() * 10),
            reason: null
          })
        }
      }, 3000)
    })
  }

  /**
   * Get plagiarism check reason
   */
  const getPlagiarismReason = (check) => {
    const reasons = {
      similarity_threshold: 'High similarity with existing publications',
      proper_citation: 'Insufficient or improper citations',
      original_content: 'Potential issues with content originality'
    }
    return reasons[check] || 'Plagiarism check failed'
  }

  /**
   * Render manuscript details section
   */
  const renderManuscriptDetails = () => (
    <div className="form-section">
      <h2>Manuscript Details</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter the title of your manuscript"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Manuscript Type *</label>
          <select
            value={formData.manuscriptType}
            onChange={(e) => handleInputChange('manuscriptType', e.target.value)}
            className="form-input"
          >
            <option value="research_paper">Research Paper</option>
            <option value="review_article">Review Article</option>
            <option value="case_study">Case Study</option>
            <option value="short_communication">Short Communication</option>
            <option value="book_review">Book Review</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Journal *</label>
          <select
            value={formData.journal}
            onChange={(e) => handleInputChange('journal', e.target.value)}
            className={`form-input ${errors.journal ? 'error' : ''}`}
          >
            <option value="">Select a Journal</option>
            {journals.map(journal => (
              <option key={journal.id} value={journal.id}>
                {journal.name}
              </option>
            ))}
          </select>
          {errors.journal && <span className="error-message">{errors.journal}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`form-input ${errors.category ? 'error' : ''}`}
          >
            <option value="">Select Category</option>
            <option value="urban_planning">Urban Planning</option>
            <option value="sustainable_development">Sustainable Development</option>
            <option value="transportation">Transportation</option>
            <option value="heritage_conservation">Heritage Conservation</option>
            <option value="gis_mapping">GIS & Mapping</option>
            <option value="data_analytics">Data Analytics</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group full-width">
          <label className="form-label">Abstract *</label>
          <textarea
            value={formData.abstract}
            onChange={(e) => handleInputChange('abstract', e.target.value)}
            className={`form-input ${errors.abstract ? 'error' : ''}`}
            placeholder="Provide a comprehensive abstract of your manuscript (minimum 150 characters)"
            rows="6"
          />
          {errors.abstract && <span className="error-message">{errors.abstract}</span>}
          <div className="char-count">
            {formData.abstract.length}/150 characters minimum
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Render keywords section
   */
  const renderKeywordsSection = () => (
    <div className="form-section">
      <h3>Keywords</h3>
      <p className="section-description">
        Add relevant keywords to help readers discover your work (3-6 keywords recommended)
      </p>
      
      <div className="keywords-input">
        <div className="input-with-button">
          <input
            type="text"
            value={tempKeyword}
            onChange={(e) => setTempKeyword(e.target.value)}
            className="form-input"
            placeholder="Enter a keyword"
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          />
          <button
            type="button"
            onClick={addKeyword}
            className="btn btn-primary"
            disabled={!tempKeyword.trim()}
          >
            Add
          </button>
        </div>
      </div>

      <div className="keywords-list">
        {formData.keywords.map((keyword, index) => (
          <div key={index} className="keyword-tag">
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="keyword-remove"
              aria-label={`Remove ${keyword}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {formData.keywords.length === 0 && (
          <p className="empty-state">No keywords added yet. Add your first keyword above.</p>
        )}
      </div>

      {errors.keywords && <span className="error-message">{errors.keywords}</span>}
    </div>
  )

  /**
   * Render authors section
   */
  const renderAuthorsSection = () => (
    <div className="form-section">
      <h3>Authors</h3>
      
      <div className="authors-list">
        {formData.authors.map((author, index) => (
          <div key={index} className="author-card">
            <div className="author-header">
              <h4>Author {index + 1}</h4>
              {!author.corresponding && (
                <button
                  type="button"
                  onClick={() => removeCoAuthor(index)}
                  className="remove-author"
                  aria-label={`Remove author ${index + 1}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="author-fields">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  value={author.name}
                  onChange={(e) => updateCoAuthor(index, 'name', e.target.value)}
                  className={`form-input ${errors[`author_${index}_name`] ? 'error' : ''}`}
                  placeholder="Enter author's full name"
                  disabled={index === 0} // Primary author name from profile
                />
                {errors[`author_${index}_name`] && (
                  <span className="error-message">{errors[`author_${index}_name`]}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={author.email}
                  className="form-input"
                  disabled
                />
                <p className="field-note">Co-authors will receive invitation emails</p>
              </div>

              <div className="form-group">
                <label className="form-label">Affiliation *</label>
                <input
                  type="text"
                  value={author.affiliation}
                  onChange={(e) => updateCoAuthor(index, 'affiliation', e.target.value)}
                  className={`form-input ${errors[`author_${index}_affiliation`] ? 'error' : ''}`}
                  placeholder="Enter institutional affiliation"
                />
                {errors[`author_${index}_affiliation`] && (
                  <span className="error-message">{errors[`author_${index}_affiliation`]}</span>
                )}
              </div>

              <div className="author-actions">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="corresponding"
                    checked={author.corresponding}
                    onChange={() => setCorrespondingAuthor(index)}
                  />
                  <span className="checkbox-custom radio"></span>
                  <span className="checkbox-text">Corresponding Author</span>
                </label>
                
                {author.corresponding && (
                  <div className="corresponding-badge">
                    <CheckCircle size={14} />
                    <span>Corresponding Author</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-coauthor">
        <h4>Add Co-Author</h4>
        <div className="input-with-button">
          <input
            type="email"
            value={coAuthorEmail}
            onChange={(e) => setCoAuthorEmail(e.target.value)}
            className="form-input"
            placeholder="Enter co-author's email address"
          />
          <button
            type="button"
            onClick={addCoAuthor}
            className="btn btn-outline"
            disabled={!coAuthorEmail.trim()}
          >
            <User size={16} />
            Add Co-Author
          </button>
        </div>
        <p className="field-note">
          Co-authors will receive an invitation to register and complete their profile
        </p>
      </div>
    </div>
  )

  /**
   * Render files section
   */
  const renderFilesSection = () => (
    <div className="form-section">
      <h3>Required Files</h3>
      
      <div className="files-grid">
        {/* Manuscript File */}
        <div className="file-upload-card">
          <div className="file-header">
            <FileText size={20} />
            <div>
              <h4>Manuscript File *</h4>
              <p>Your complete manuscript in PDF or Word format</p>
            </div>
            {formData.files.manuscript && (
              <span className="file-status success">
                <CheckCircle size={16} />
                Uploaded
              </span>
            )}
          </div>
          
          <input
            type="file"
            onChange={(e) => handleFileUpload('manuscript', e.target.files[0])}
            accept=".pdf,.doc,.docx"
            className="file-input"
            id="manuscript-upload"
          />
          
          <label htmlFor="manuscript-upload" className="btn btn-outline">
            <Upload size={16} />
            {formData.files.manuscript ? 'Change File' : 'Upload Manuscript'}
          </label>
          
          {formData.files.manuscript && (
            <div className="file-info">
              <span className="file-name">{formData.files.manuscript.name}</span>
              <span className="file-size">
                ({(formData.files.manuscript.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
          
          {errors.manuscript && <span className="error-message">{errors.manuscript}</span>}
          
          <div className="file-requirements">
            <h5>Requirements:</h5>
            <ul>
              <li>PDF or Word document format</li>
              <li>Maximum file size: 10MB</li>
              <li>Anonymous submission (no author names in file)</li>
              <li>Include abstract, keywords, and references</li>
            </ul>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="file-upload-card">
          <div className="file-header">
            <FileText size={20} />
            <div>
              <h4>Cover Letter *</h4>
              <p>Letter to the editor explaining your submission</p>
            </div>
            {formData.files.coverLetter && (
              <span className="file-status success">
                <CheckCircle size={16} />
                Uploaded
              </span>
            )}
          </div>
          
          <input
            type="file"
            onChange={(e) => handleFileUpload('coverLetter', e.target.files[0])}
            accept=".pdf"
            className="file-input"
            id="coverletter-upload"
          />
          
          <label htmlFor="coverletter-upload" className="btn btn-outline">
            <Upload size={16} />
            {formData.files.coverLetter ? 'Change File' : 'Upload Cover Letter'}
          </label>
          
          {formData.files.coverLetter && (
            <div className="file-info">
              <span className="file-name">{formData.files.coverLetter.name}</span>
              <span className="file-size">
                ({(formData.files.coverLetter.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
          
          {errors.coverLetter && <span className="error-message">{errors.coverLetter}</span>}
        </div>

        {/* Supplementary Materials */}
        <div className="file-upload-card">
          <div className="file-header">
            <FileText size={20} />
            <div>
              <h4>Supplementary Materials (Optional)</h4>
              <p>Additional data, images, or supporting documents</p>
            </div>
            {formData.files.supplementary && (
              <span className="file-status success">
                <CheckCircle size={16} />
                Uploaded
              </span>
            )}
          </div>
          
          <input
            type="file"
            onChange={(e) => handleFileUpload('supplementary', e.target.files[0])}
            accept=".pdf,.zip"
            className="file-input"
            id="supplementary-upload"
          />
          
          <label htmlFor="supplementary-upload" className="btn btn-outline">
            <Upload size={16} />
            {formData.files.supplementary ? 'Change File' : 'Upload Supplementary'}
          </label>
          
          {formData.files.supplementary && (
            <div className="file-info">
              <span className="file-name">{formData.files.supplementary.name}</span>
              <span className="file-size">
                ({(formData.files.supplementary.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  /**
   * Render terms and conditions
   */
  const renderTermsSection = () => (
    <div className="form-section">
      <h3>Terms and Declaration</h3>
      
      <div className="terms-list">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-custom"></span>
          <span className="checkbox-text">
            I agree to the{' '}
            <a href="/publishing/terms" target="_blank" rel="noopener noreferrer">
              Author Guidelines
            </a>
            ,{' '}
            <a href="/publishing/policy" target="_blank" rel="noopener noreferrer">
              Publication Policy
            </a>
            , and understand that the submission will undergo peer review.
          </span>
        </label>
        {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.agreeToOriginality}
            onChange={(e) => handleInputChange('agreeToOriginality', e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-custom"></span>
          <span className="checkbox-text">
            I confirm that this manuscript is original work, has not been published previously, 
            and is not under consideration for publication elsewhere.
          </span>
        </label>
        {errors.agreeToOriginality && <span className="error-message">{errors.agreeToOriginality}</span>}
      </div>

      <div className="submission-notice">
        <AlertCircle size={20} />
        <div>
          <h4>Important Notice</h4>
          <p>
            Your submission will undergo automated plagiarism check and editorial review. 
            You will be notified of the decision within 4-6 weeks. Ensure all author information 
            is accurate as it cannot be changed after submission.
          </p>
        </div>
      </div>
    </div>
  )

  /**
   * Render form actions
   */
  const renderFormActions = () => (
    <div className="form-actions">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => window.history.back()}
        disabled={submitting}
      >
        <ArrowLeft size={18} />
        Cancel
      </button>
      
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
      >
        {submitting ? (
          <Loader size="sm" />
        ) : (
          <>
            <FileCheck size={18} />
            Submit Manuscript
          </>
        )}
      </button>
    </div>
  )

  return (
    <div className="manuscript-submission-page">
      <div className="container">
        <div className="page-header">
          <h1>Submit Manuscript</h1>
          <p>Submit your research for publication in our peer-reviewed journals</p>
        </div>

        <form onSubmit={handleSubmit} className="manuscript-form">
          {renderManuscriptDetails()}
          {renderKeywordsSection()}
          {renderAuthorsSection()}
          {renderFilesSection()}
          {renderTermsSection()}
          {renderFormActions()}
        </form>
      </div>
    </div>
  )
}

export default ManuscriptSubmission