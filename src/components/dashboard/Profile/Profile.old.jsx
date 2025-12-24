import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { authAPI } from '../../../services/api/auth'
import { calculateProfileCompletion, generateUniqueCode } from '../../../utils/helpers'
import { 
  User, 
  Camera, 
  Upload, 
  FileText, 
  Briefcase, 
  GraduationCap,
  MapPin,
  Phone,
  Globe,
  Linkedin,
  Github,
  Save,
  Edit3,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import Loader from '../../common/Loader/Loader'

/**
 * User Profile Component
 * Handles profile completion, file uploads, and AI-powered auto-fill
 * Includes profile picture moderation and resume parsing
 */
const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    bio: '',
    skills: [],
    education: [],
    experience: []
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [activeSection, setActiveSection] = useState('basic')
  const [editingField, setEditingField] = useState(null)
  const [tempSkill, setTempSkill] = useState('')
  
  // File upload refs
  const profilePicRef = useRef(null)
  const resumeRef = useRef(null)
  const portfolioRef = useRef(null)

  // API hooks
  const [updateProfileApi, updateLoading] = useApi(authAPI.updateProfile)
  const [uploadFileApi, uploadLoading] = useApi(authAPI.uploadFile)

  /**
   * Initialize form with user data
   */
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        bio: user.bio || '',
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || []
      })
      
      // Calculate initial completion
      setProfileCompletion(calculateProfileCompletion(user))
    }
  }, [user])

  /**
   * Update completion percentage when form data changes
   */
  useEffect(() => {
    const completion = calculateProfileCompletion({ ...user, ...formData })
    setProfileCompletion(completion)
  }, [formData, user])

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
   * Handle array field changes (skills, education, experience)
   */
  const handleArrayFieldChange = (field, index, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subField]: value } : item
      )
    }))
  }

  /**
   * Add new item to array field
   */
  const addArrayItem = (field, template = {}) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }))
  }

  /**
   * Remove item from array field
   */
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  /**
   * Handle skill addition
   */
  const handleAddSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, tempSkill.trim()]
      }))
      setTempSkill('')
    }
  }

  /**
   * Handle skill removal
   */
  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  /**
   * Handle profile picture upload
   */
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image (JPEG, PNG, GIF)', 'error')
      return
    }

    if (file.size > maxSize) {
      showNotification('Image size must be less than 5MB', 'error')
      return
    }

    setLoading(true)

    try {
      // Simulate AI moderation (in real app, this would be an API call)
      const moderationResult = await simulateAIModeration(file)
      
      if (!moderationResult.approved) {
        showNotification(`Profile picture rejected: ${modificationResult.reason}`, 'error')
        return
      }

      // Upload file (simulated)
      const uploadResult = await uploadFileApi(file, {
        successMessage: 'Profile picture uploaded successfully'
      })

      if (uploadResult) {
        // Update user profile with new picture URL
        await updateProfileApi({ profilePicture: uploadResult.url })
        showNotification('Profile picture updated successfully', 'success')
      }
    } catch (error) {
      showNotification('Failed to upload profile picture', 'error')
    } finally {
      setLoading(false)
      event.target.value = '' // Reset input
    }
  }

  /**
   * Simulate AI moderation for profile picture
   */
  const simulateAIModeration = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate various moderation checks
        const checks = [
          { check: 'appropriate_content', passed: Math.random() > 0.1 },
          { check: 'real_person', passed: Math.random() > 0.05 },
          { check: 'no_logos', passed: Math.random() > 0.1 },
          { check: 'clear_image', passed: Math.random() > 0.05 }
        ]

        const failedCheck = checks.find(check => !check.passed)
        
        if (failedCheck) {
          resolve({
            approved: false,
            reason: getModerationReason(failedCheck.check)
          })
        } else {
          resolve({ approved: true })
        }
      }, 2000)
    })
  }

  /**
   * Get human-readable moderation reason
   */
  const getModerationReason = (check) => {
    const reasons = {
      appropriate_content: 'Image contains inappropriate content',
      real_person: 'Image does not appear to be a real person',
      no_logos: 'Image contains logos or branding',
      clear_image: 'Image is blurry or low quality'
    }
    return reasons[check] || 'Image did not meet requirements'
  }

  /**
   * Handle resume upload and auto-fill
   */
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a PDF or Word document', 'error')
      return
    }

    setLoading(true)

    try {
      // Upload resume
      const uploadResult = await uploadFileApi(file, {
        successMessage: 'Resume uploaded successfully'
      })

      if (uploadResult) {
        // Simulate AI-powered resume parsing and auto-fill
        const parsedData = await simulateResumeParsing(file)
        
        // Update form with parsed data
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }))

        showNotification('Resume uploaded and profile auto-filled', 'success')
      }
    } catch (error) {
      showNotification('Failed to process resume', 'error')
    } finally {
      setLoading(false)
      event.target.value = '' // Reset input
    }
  }

  /**
   * Simulate AI resume parsing
   */
  const simulateResumeParsing = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock parsed data based on user's existing data
        const mockParsedData = {
          skills: ['Urban Planning', 'GIS', 'Sustainability', 'Project Management', 'Data Analysis'],
          education: [
            {
              institution: 'University of Mumbai',
              degree: 'Bachelor of Planning',
              field: 'Urban Planning',
              startYear: '2018',
              endYear: '2022',
              description: 'Specialized in sustainable urban development'
            }
          ],
          experience: [
            {
              company: 'City Development Corporation',
              position: 'Junior Urban Planner',
              location: 'Mumbai, India',
              startDate: '2022-06',
              endDate: '2024-01',
              current: false,
              description: 'Worked on sustainable city projects and community development initiatives'
            }
          ],
          bio: 'Urban planning professional with 2+ years of experience in sustainable city development and community engagement.'
        }
        resolve(mockParsedData)
      }, 3000)
    })
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Basic validation
    const validationErrors = {}
    
    if (!formData.firstName.trim()) {
      validationErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      validationErrors.lastName = 'Last name is required'
    }
    
    if (!formData.bio.trim()) {
      validationErrors.bio = 'Bio is required'
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showNotification('Please fill in all required fields', 'error')
      return
    }

    setSaving(true)

    try {
      const result = await updateProfileApi(formData, {
        successMessage: 'Profile updated successfully'
      })

      if (result) {
        // Update local user context
        updateProfile(result.user)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setSaving(false)
    }
  }

  /**
   * Profile sections configuration
   */
  const profileSections = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: CheckCircle },
    { id: 'social', label: 'Social Links', icon: Globe }
  ]

  /**
   * Render completion progress
   */
  const renderCompletionProgress = () => (
    <div className="completion-card">
      <div className="completion-header">
        <h3>Profile Completion</h3>
        <span className="completion-percentage">{profileCompletion}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${profileCompletion}%` }}
        ></div>
      </div>
      
      <div className="completion-message">
        {profileCompletion === 100 ? (
          <div className="completion-success">
            <CheckCircle size={16} />
            Your profile is complete! Great job.
          </div>
        ) : (
          <div className="completion-warning">
            <AlertCircle size={16} />
            Complete your profile to unlock all features and improve your job matching.
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Render file upload section
   */
  const renderFileUploads = () => (
    <div className="upload-section">
      <h3>Profile Media</h3>
      
      <div className="upload-grid">
        {/* Profile Picture Upload */}
        <div className="upload-card">
          <div className="upload-header">
            <Camera size={20} />
            <h4>Profile Picture</h4>
          </div>
          
          <div className="upload-content">
            <div className="profile-pic-preview">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <div className="profile-pic-placeholder">
                  <User size={32} />
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={profilePicRef}
              onChange={handleProfilePicUpload}
              accept="image/*"
              className="file-input"
              id="profile-pic"
            />
            
            <label htmlFor="profile-pic" className="btn btn-outline btn-small">
              <Upload size={16} />
              Upload Photo
            </label>
            
            <p className="upload-note">
              Clear, professional photo. AI moderation will check for appropriate content.
            </p>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="upload-card">
          <div className="upload-header">
            <FileText size={20} />
            <h4>Resume</h4>
          </div>
          
          <div className="upload-content">
            <div className="file-icon">
              <FileText size={32} />
            </div>
            
            <input
              type="file"
              ref={resumeRef}
              onChange={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              className="file-input"
              id="resume"
            />
            
            <label htmlFor="resume" className="btn btn-outline btn-small">
              <Upload size={16} />
              Upload Resume
            </label>
            
            <p className="upload-note">
              PDF or Word document. AI will auto-fill your profile fields.
            </p>
          </div>
        </div>

        {/* Portfolio Upload */}
        <div className="upload-card">
          <div className="upload-header">
            <FileText size={20} />
            <h4>Portfolio</h4>
          </div>
          
          <div className="upload-content">
            <div className="file-icon">
              <FileText size={32} />
            </div>
            
            <input
              type="file"
              ref={portfolioRef}
              onChange={handleResumeUpload} // Same handler for now
              accept=".pdf,.doc,.docx"
              className="file-input"
              id="portfolio"
            />
            
            <label htmlFor="portfolio" className="btn btn-outline btn-small">
              <Upload size={16} />
              Upload Portfolio
            </label>
            
            <p className="upload-note">
              Showcase your work (PDF format recommended)
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Render basic info section
   */
  const renderBasicInfo = () => (
    <div className="form-section">
      <h3>Basic Information</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            disabled
          />
          <p className="field-note">Email cannot be changed</p>
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <div className="input-with-icon">
            <Phone size={16} />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <div className="input-with-icon">
            <MapPin size={16} />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="form-input"
              placeholder="Enter your location"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label className="form-label">Bio *</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className={`form-input ${errors.bio ? 'error' : ''}`}
            placeholder="Tell us about yourself, your experience, and your interests..."
            rows="4"
          />
          {errors.bio && <span className="error-message">{errors.bio}</span>}
          <p className="field-note">Write a brief professional summary (minimum 50 characters)</p>
        </div>
      </div>
    </div>
  )

  /**
   * Render skills section
   */
  const renderSkillsSection = () => (
    <div className="form-section">
      <h3>Skills & Expertise</h3>
      
      <div className="skills-input">
        <div className="input-with-button">
          <input
            type="text"
            value={tempSkill}
            onChange={(e) => setTempSkill(e.target.value)}
            className="form-input"
            placeholder="Add a skill (e.g., Urban Planning, GIS, Sustainability)"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn btn-primary"
            disabled={!tempSkill.trim()}
          >
            Add
          </button>
        </div>
      </div>

      <div className="skills-list">
        {formData.skills.map((skill, index) => (
          <div key={index} className="skill-tag">
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(index)}
              className="skill-remove"
              aria-label={`Remove ${skill}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {formData.skills.length === 0 && (
          <p className="empty-state">No skills added yet. Add your first skill above.</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Complete Your Profile</h1>
        <p>Build your professional presence on Planning Insights</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          {renderCompletionProgress()}
          
          <nav className="profile-nav">
            {profileSections.map((section) => {
              const IconComponent = section.icon
              
              return (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <IconComponent size={18} />
                  {section.label}
                </button>
              )
            })}
          </nav>

          {renderFileUploads()}
        </div>

        {/* Main Content */}
        <div className="profile-content">
          <form onSubmit={handleSubmit}>
            {activeSection === 'basic' && renderBasicInfo()}
            {activeSection === 'skills' && renderSkillsSection()}
            {/* Other sections would be implemented similarly */}

            <div className="form-actions">
              <button
                type="submit"
                disabled={saving || updateLoading}
                className="btn btn-primary btn-large"
              >
                {saving || updateLoading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
              
              <div className="action-info">
                <p>
                  <strong>Unique Code:</strong> {user?.uniqueCode || 'Generating...'}
                </p>
                <p className="code-note">
                  This code will be displayed as a prefix to your name and cannot be changed
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile