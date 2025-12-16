import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { jobsAPI } from '../../../services/api/jobs'
import { validateJobApplication } from '../../../utils/validators'
import { 
  X, 
  FileText, 
  Upload, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Loader from '../../../components/common/Loader/Loader'
import Modal from '../../../components/common/Modal/Modal'

/**
 * Job Application Form Component
 * Handles job application submission with cover letter, salary details, and file uploads
 * Includes validation and success/error handling
 */
const ApplicationForm = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    contactMethod: 'email',
    coverLetter: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '',
    additionalInfo: '',
    resume: user?.resume || '',
    portfolio: user?.portfolio || ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [portfolioFile, setPortfolioFile] = useState(null)

  // API hooks
  const [applyForJobApi] = useApi(jobsAPI.applyForJob)

  /**
   * Initialize form with user data
   */
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        resume: user.resume || '',
        portfolio: user.portfolio || ''
      }))
    }
  }, [user])

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
   * Handle file upload for resume
   */
  const handleResumeUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a PDF or Word document', 'error')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error')
      return
    }

    setResumeFile(file)
    
    // Simulate file upload and get URL (in real app, this would be an API call)
    const fileUrl = URL.createObjectURL(file)
    setFormData(prev => ({
      ...prev,
      resume: fileUrl
    }))

    showNotification('Resume uploaded successfully', 'success')
  }

  /**
   * Handle file upload for portfolio
   */
  const handlePortfolioUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf']
    
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a PDF document for portfolio', 'error')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('Portfolio file size must be less than 10MB', 'error')
      return
    }

    setPortfolioFile(file)
    
    // Simulate file upload and get URL
    const fileUrl = URL.createObjectURL(file)
    setFormData(prev => ({
      ...prev,
      portfolio: fileUrl
    }))

    showNotification('Portfolio uploaded successfully', 'success')
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Validate form
    const { errors: validationErrors, isValid } = validateJobApplication(formData)
    
    if (!isValid) {
      setErrors(validationErrors)
      showNotification('Please fix the errors in the form', 'error')
      return
    }

    setSubmitting(true)

    try {
      const applicationData = {
        ...formData,
        jobId: job.id,
        applicantId: user.id,
        appliedAt: new Date().toISOString()
      }

      const result = await applyForJobApi(job.id, applicationData, {
        successMessage: 'Application submitted successfully!',
        showError: true
      })

      if (result) {
        onSuccess()
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Format currency for display
   */
  const formatCurrency = (amount) => {
    if (!amount) return ''
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  /**
   * Calculate suggested expected CTC (15-30% hike)
   */
  const getSuggestedCTC = () => {
    if (!formData.currentCTC) return { min: 0, max: 0 }
    
    const current = parseInt(formData.currentCTC.replace(/\D/g, ''))
    const min = Math.round(current * 1.15)
    const max = Math.round(current * 1.30)
    
    return { min, max }
  }

  /**
   * Render application summary
   */
  const renderApplicationSummary = () => (
    <div className="application-summary">
      <h3>Application Summary</h3>
      
      <div className="summary-grid">
        <div className="summary-item">
          <span className="label">Job Title:</span>
          <span className="value">{job.title}</span>
        </div>
        
        <div className="summary-item">
          <span className="label">Company:</span>
          <span className="value">{job.company}</span>
        </div>
        
        <div className="summary-item">
          <span className="label">Location:</span>
          <span className="value">{job.location}</span>
        </div>
        
        <div className="summary-item">
          <span className="label">Application Date:</span>
          <span className="value">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )

  /**
   * Render personal details (stacked vertically)
   */
  const renderPersonalDetails = () => (
    <div className="form-section">
      <h3>Personal Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className={`form-input ${errors.fullName ? 'error' : ''}`}
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Your full name"
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Mobile number"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Contact Method</label>
          <select
            value={formData.contactMethod}
            onChange={(e) => handleInputChange('contactMethod', e.target.value)}
            className="form-input"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>
    </div>
  )

  /**
   * Render cover letter section
   */
  const renderCoverLetterSection = () => (
    <div className="form-section">
      <h3>Cover Letter</h3>
      <p className="section-description">
        Introduce yourself and explain why you're interested in this position. 
        Mention how your skills and experience match the job requirements.
      </p>
      
      <div className="form-group">
        <label className="form-label">
          Your Cover Letter *
          <span className="char-count">
            {formData.coverLetter.length}/1000 characters
          </span>
        </label>
        <textarea
          value={formData.coverLetter}
          onChange={(e) => handleInputChange('coverLetter', e.target.value)}
          className={`form-input ${errors.coverLetter ? 'error' : ''}`}
          placeholder="Write a compelling cover letter that highlights your qualifications and enthusiasm for this role..."
          rows="8"
          maxLength="1000"
        />
        {errors.coverLetter && (
          <span className="error-message">{errors.coverLetter}</span>
        )}
        
        <div className="writing-tips">
          <h4>Writing Tips:</h4>
          <ul>
            <li>Address the hiring manager by name if possible</li>
            <li>Mention specific job requirements and how you meet them</li>
            <li>Highlight your most relevant achievements</li>
            <li>Keep it professional and concise</li>
          </ul>
        </div>
      </div>
    </div>
  )

  /**
   * Render salary information section
   */
  const renderSalarySection = () => {
    const suggestedCTC = getSuggestedCTC()
    
    return (
      <div className="form-section">
        <h3>Salary Information</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Current CTC (Annual)
              <div className="input-with-icon">
                <DollarSign size={16} />
                <input
                  type="text"
                  value={formData.currentCTC}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange('currentCTC', value)
                  }}
                  className="form-input"
                  placeholder="Enter current salary"
                />
              </div>
            </label>
            <p className="field-note">Your current cost to company</p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Expected CTC (Annual) *
              <div className="input-with-icon">
                <DollarSign size={16} />
                <input
                  type="text"
                  value={formData.expectedCTC}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange('expectedCTC', value)
                  }}
                  className={`form-input ${errors.expectedCTC ? 'error' : ''}`}
                  placeholder="Enter expected salary"
                />
              </div>
            </label>
            {formData.currentCTC && (
              <p className="suggestion-note">
                Suggested range: {formatCurrency(suggestedCTC.min)} - {formatCurrency(suggestedCTC.max)}
                (15-30% hike)
              </p>
            )}
            {errors.expectedCTC && (
              <span className="error-message">{errors.expectedCTC}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Notice Period (Days) *
              <div className="input-with-icon">
                <Calendar size={16} />
                <input
                  type="number"
                  value={formData.noticePeriod}
                  onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                  className={`form-input ${errors.noticePeriod ? 'error' : ''}`}
                  placeholder="Enter notice period"
                  min="0"
                  max="90"
                />
              </div>
            </label>
            {errors.noticePeriod && (
              <span className="error-message">{errors.noticePeriod}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render documents section
   */
  const renderDocumentsSection = () => (
    <div className="form-section">
      <h3>Documents</h3>
      
      <div className="documents-grid">
        {/* Resume */}
        <div className="document-upload">
          <label className="document-label">
            <FileText size={20} />
            <span>Resume *</span>
            {formData.resume && (
              <span className="upload-status success">
                <CheckCircle size={14} />
                Uploaded
              </span>
            )}
          </label>
          
          <p className="document-description">
            Your most recent resume. PDF or Word format.
          </p>
          
          <input
            type="file"
            onChange={handleResumeUpload}
            accept=".pdf,.doc,.docx"
            className="file-input"
            id="resume-upload"
          />
          
          <label htmlFor="resume-upload" className="btn btn-outline btn-small">
            <Upload size={16} />
            {formData.resume ? 'Change Resume' : 'Upload Resume'}
          </label>
          
          {resumeFile && (
            <div className="file-info">
              <span className="file-name">{resumeFile.name}</span>
              <span className="file-size">
                ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="document-upload">
          <label className="document-label">
            <FileText size={20} />
            <span>Portfolio (Optional)</span>
            {formData.portfolio && (
              <span className="upload-status success">
                <CheckCircle size={14} />
                Uploaded
              </span>
            )}
          </label>
          
          <p className="document-description">
            Your portfolio showcasing relevant work. PDF format only.
          </p>
          
          <input
            type="file"
            onChange={handlePortfolioUpload}
            accept=".pdf"
            className="file-input"
            id="portfolio-upload"
          />
          
          <label htmlFor="portfolio-upload" className="btn btn-outline btn-small">
            <Upload size={16} />
            {formData.portfolio ? 'Change Portfolio' : 'Upload Portfolio'}
          </label>
          
          {portfolioFile && (
            <div className="file-info">
              <span className="file-name">{portfolioFile.name}</span>
              <span className="file-size">
                ({(portfolioFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  /**
   * Render additional information section
   */
  const renderAdditionalInfoSection = () => (
    <div className="form-section">
      <h3>Additional Information</h3>
      
      <div className="form-group">
        <label className="form-label">
          Anything else you'd like to share?
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          className="form-input"
          placeholder="Add any additional information that might be relevant to your application..."
          rows="4"
        />
        <p className="field-note">
          Optional: Links to your work, references, or other supporting materials.
        </p>
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
        onClick={onClose}
        className="btn btn-outline"
        disabled={submitting}
      >
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
            <CheckCircle size={18} />
            Submit Application
          </>
        )}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Job"
      size="xl"
      closeOnOverlay={!submitting}
    >
      <form onSubmit={handleSubmit} className="application-form">
        {renderApplicationSummary()}
        {renderCoverLetterSection()}
        {renderSalarySection()}
        {renderDocumentsSection()}
        {renderAdditionalInfoSection()}
        {renderFormActions()}
      </form>
    </Modal>
  )
}

export default ApplicationForm