import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useNotification } from '../../../contexts/NotificationContext'
import { useApi } from '../../../hooks/useApi'
import { useNavigate } from 'react-router-dom'
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
  X,
  ChevronLeft,
  Plus
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
  const navigate = useNavigate()
  
  // State management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    sex: '',
    country: '',
    state: '',
    city: '',
    dob: '',
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
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [showProfilePicMenu, setShowProfilePicMenu] = useState(false)
  
  // File upload state
  const [uploadProgress, setUploadProgress] = useState({
    profilePicture: 0,
    resume: 0,
    portfolio: 0
  })
  const [uploadedFiles, setUploadedFiles] = useState({
    profilePicture: null,
    resume: null,
    portfolio: null
  })
  
  // File upload refs
  const profilePicRef = useRef(null)
  const resumeRef = useRef(null)
  const portfolioRef = useRef(null)
  const profilePicMenuRef = useRef(null)

  // API hooks
  const [updateProfileApi, updateLoading] = useApi(authAPI.updateProfile)
  const [uploadFileApi, uploadLoading] = useApi(authAPI.uploadFile)

  /**
   * Show toast notification
   */
  const showToastNotification = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

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
        whatsapp: user.whatsapp || '',
        sex: user.sex || '',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
        dob: user.dob || '',
        location: user.location || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        bio: user.bio || '',
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || [],
        uniqueCode: user.uniqueCode || ''
      });
      setProfileCompletion(calculateProfileCompletion(user));
    }
    document.documentElement.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }, [user]);

  /**
   * Update completion percentage when form data changes
   */
  useEffect(() => {
    const completion = calculateProfileCompletion({ ...user, ...formData })
    setProfileCompletion(completion)
  }, [formData, user])

  /**
   * Handle click outside profile picture menu
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePicMenuRef.current && !profilePicMenuRef.current.contains(event.target) &&
          !event.target.closest('.profile-pic-preview')) {
        setShowProfilePicMenu(false)
      }
    }

    if (showProfilePicMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfilePicMenu])

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
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image (JPEG, PNG, GIF, WebP)', 'error')
      return
    }

    if (file.size > maxSize) {
      showNotification('Image size must be less than 5MB', 'error')
      return
    }

    setLoading(true)
    showToastNotification('Uploading profile picture...')

    try {
      // Upload file to server/cloud storage
      const uploadResult = await uploadFileApi(file, 'profilePicture', {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(prev => ({
            ...prev,
            profilePicture: percentCompleted
          }))
        }
      })

      if (uploadResult?.data?.url) {
        // Update form data with new picture URL
        setUploadedFiles(prev => ({
          ...prev,
          profilePicture: uploadResult.data.url
        }))

        // Update user profile (optional - may fail if backend not fully set up)
        try {
          const updateResult = await updateProfileApi({ 
            profilePicture: uploadResult.data.url 
          })

          if (updateResult?.user) {
            updateProfile(updateResult.user)
          }
        } catch (updateError) {
          console.warn('Profile update skipped:', updateError.message)
        }

        showToastNotification('Profile picture updated! 🎉')
        showNotification('Profile picture uploaded successfully', 'success')
      } else {
        throw new Error('No URL in upload response')
      }
    } catch (error) {
      console.error('Profile picture upload error:', error)
      showNotification(
        error?.response?.data?.message || 'Failed to upload profile picture',
        'error'
      )
      showToastNotification('Upload failed. Try again.')
    } finally {
      setLoading(false)
      setUploadProgress(prev => ({
        ...prev,
        profilePicture: 0
      }))
      event.target.value = '' // Reset input
    }
  }

  /**
   * Handle remove profile picture
   */
  const handleRemoveProfilePic = async () => {
    setShowProfilePicMenu(false)
    
    if (!uploadedFiles.profilePicture && !user?.profilePicture) {
      showNotification('No profile picture to remove', 'info')
      return
    }

    try {
      // Clear the uploaded file
      setUploadedFiles(prev => ({
        ...prev,
        profilePicture: null
      }))

      // Update user profile to remove picture
      try {
        const updateResult = await updateProfileApi({ 
          profilePicture: null 
        })

        if (updateResult?.user) {
          updateProfile(updateResult.user)
        }
      } catch (updateError) {
        console.warn('Profile update skipped:', updateError.message)
      }

      showToastNotification('Profile picture removed! 🗑️')
      showNotification('Profile picture has been removed', 'success')
    } catch (error) {
      console.error('Remove profile picture error:', error)
      showNotification('Failed to remove profile picture', 'error')
    }
  }

  /**
   * Simulate AI moderation for profile picture (optional - remove if using backend moderation)
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

    // Validate file type and size
    const validTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                       'application/vnd.ms-excel',
                       'text/plain']
    const maxSize = 10 * 1024 * 1024 // 10MB for documents
    
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a PDF, Word document, or text file', 'error')
      return
    }

    if (file.size > maxSize) {
      showNotification('Resume size must be less than 10MB', 'error')
      return
    }

    setLoading(true)
    showToastNotification('Processing resume...')

    try {
      // Upload resume file
      const uploadResult = await uploadFileApi(file, 'resume', {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(prev => ({
            ...prev,
            resume: percentCompleted
          }))
        }
      })

      if (uploadResult?.data?.url) {
        // Store resume file URL
        setUploadedFiles(prev => ({
          ...prev,
          resume: uploadResult.data.url
        }))

        // Simulate AI-powered resume parsing and auto-fill
        showToastNotification('Parsing resume data...')
        const parsedData = await simulateResumeParsing(file)
        
        // Update form with parsed data
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          resumeUrl: uploadResult.data.url
        }))

        showToastNotification('Resume uploaded and profile auto-filled! 📄')
        showNotification('Resume processed successfully. Profile fields updated.', 'success')
      } else {
        throw new Error('No URL in upload response')
      }
    } catch (error) {
      console.error('Resume upload error:', error)
      showNotification(
        error?.response?.data?.message || 'Failed to process resume',
        'error'
      )
      showToastNotification('Upload failed. Try again.')
    } finally {
      setLoading(false)
      setUploadProgress(prev => ({
        ...prev,
        resume: 0
      }))
      event.target.value = '' // Reset input
    }
  }

  /**
   * Handle portfolio upload
   */
  const handlePortfolioUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type and size
    const validTypes = ['application/pdf', 'text/html', 'application/zip',
                       'application/msword',
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 50 * 1024 * 1024 // 50MB for portfolio files
    
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a PDF, HTML, ZIP, or Word document', 'error')
      return
    }

    if (file.size > maxSize) {
      showNotification('Portfolio size must be less than 50MB', 'error')
      return
    }

    setLoading(true)
    showToastNotification('Uploading portfolio...')

    try {
      // Upload portfolio file
      const uploadResult = await uploadFileApi(file, 'portfolio', {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(prev => ({
            ...prev,
            portfolio: percentCompleted
          }))
        }
      })

      if (uploadResult?.data?.url) {
        // Store portfolio file URL
        setUploadedFiles(prev => ({
          ...prev,
          portfolio: uploadResult.data.url
        }))

        // Update user profile with portfolio URL (optional)
        try {
          const updateResult = await updateProfileApi({ 
            portfolioUrl: uploadResult.data.url 
          })

          if (updateResult?.user) {
            updateProfile(updateResult.user)
          }
        } catch (updateError) {
          console.warn('Profile update skipped:', updateError.message)
        }

        showToastNotification('Portfolio uploaded successfully! 🎨')
        showNotification('Portfolio uploaded and saved to your profile', 'success')
      } else {
        throw new Error('No URL in upload response')
      }
    } catch (error) {
      console.error('Portfolio upload error:', error)
      showNotification(
        error?.response?.data?.message || 'Failed to upload portfolio',
        'error'
      )
      showToastNotification('Upload failed. Try again.')
    } finally {
      setLoading(false)
      setUploadProgress(prev => ({
        ...prev,
        portfolio: 0
      }))
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
      showToastNotification('Please complete required fields')
      return
    }

    setSaving(true)
    showToastNotification('Saving your profile...')

    try {
      const result = await updateProfileApi(formData, {
        successMessage: 'Profile updated successfully'
      })

      if (result) {
        // Update local user context
        updateProfile(result.user)
        showToastNotification('Profile saved! 🎉')
      }
    } catch (error) {
      showToastNotification('Failed to save profile')
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
    { id: 'professional', label: 'Work Experience', icon: Briefcase },
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
            <div 
              className="profile-pic-preview"
              onClick={() => setShowProfilePicMenu(!showProfilePicMenu)}
              style={{ cursor: 'pointer' }}
            >
              {uploadedFiles.profilePicture || user?.profilePicture ? (
                <img 
                  src={uploadedFiles.profilePicture || user?.profilePicture} 
                  alt="Profile" 
                />
              ) : (
                <div className="profile-pic-placeholder">
                  <User size={32} />
                </div>
              )}
            </div>

            {/* Profile Picture Menu */}
            {showProfilePicMenu && (
              <div className="profile-pic-menu" ref={profilePicMenuRef}>
                <button 
                  className="pic-menu-item edit"
                  onClick={() => {
                    setShowProfilePicMenu(false)
                    profilePicRef.current?.click()
                  }}
                >
                  <Camera size={16} />
                  <span>Update profile photo</span>
                </button>
                <button 
                  className="pic-menu-item remove"
                  onClick={handleRemoveProfilePic}
                >
                  <X size={16} />
                  <span>Remove profile picture</span>
                </button>
              </div>
            )}
            
            <input
              type="file"
              ref={profilePicRef}
              onChange={handleProfilePicUpload}
              accept="image/*"
              className="file-input"
              id="profile-pic"
              disabled={loading}
            />
            
            <label 
              htmlFor="profile-pic" 
              className={`btn btn-outline btn-small ${loading ? 'disabled' : ''}`}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <Upload size={16} />
              {loading ? 'Uploading...' : 'Upload Photo'}
            </label>
            
            <p className="upload-note">
              Clear, professional photo. PNG, JPG, GIF or WebP (max 5MB)
            </p>
            
            {uploadProgress.profilePicture > 0 && uploadProgress.profilePicture < 100 && (
              <div className="upload-progress">
                <div className="progress-bar small">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress.profilePicture}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress.profilePicture}%</span>
              </div>
            )}
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
              accept=".pdf,.doc,.docx,.txt"
              className="file-input"
              id="resume"
              disabled={loading}
            />
            
            <label 
              htmlFor="resume" 
              className={`btn btn-outline btn-small ${loading ? 'disabled' : ''}`}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <Upload size={16} />
              {loading ? 'Processing...' : 'Upload Resume'}
            </label>
            
            <p className="upload-note">
              PDF, Word, or text file. AI will auto-fill your profile (max 10MB)
            </p>
            
            {uploadProgress.resume > 0 && uploadProgress.resume < 100 && (
              <div className="upload-progress">
                <div className="progress-bar small">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress.resume}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress.resume}%</span>
              </div>
            )}
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
              onChange={handlePortfolioUpload}
              accept=".pdf,.zip,.html,.doc,.docx"
              className="file-input"
              id="portfolio"
            />
            
            <label 
              htmlFor="portfolio" 
              className={`btn btn-outline btn-small ${loading ? 'disabled' : ''}`}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <Upload size={16} />
              {loading ? 'Uploading...' : 'Upload Portfolio'}
            </label>
            
            <p className="upload-note">
              Showcase your work (PDF, ZIP, or HTML format recommended)
            </p>
            
            {uploadProgress.portfolio > 0 && uploadProgress.portfolio < 100 && (
              <div className="upload-progress">
                <div className="progress-bar small">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress.portfolio}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress.portfolio}%</span>
              </div>
            )}
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
      <h3>Profile</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={formData.firstName + (formData.lastName ? ' ' + formData.lastName : '')}
            onChange={e => {
              const [first, ...rest] = e.target.value.split(' ');
              handleInputChange('firstName', first);
              handleInputChange('lastName', rest.join(' '));
            }}
            className="form-input"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={formData.email}
            className="form-input"
            disabled
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contact No</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            className="form-input"
            placeholder="Enter contact number"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Whats App No</label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={e => handleInputChange('whatsapp', e.target.value)}
            className="form-input"
            placeholder="Enter WhatsApp number"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Sex</label>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', cursor: 'pointer', color: formData.sex === 'male' ? '#6c63ff' : '#222' }}>
              <input
                type="radio"
                name="sex"
                value="male"
                checked={formData.sex === 'male'}
                onChange={() => handleInputChange('sex', 'male')}
                style={{ accentColor: '#6c63ff', width: '18px', height: '18px' }}
              />
              Male
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', cursor: 'pointer', color: formData.sex === 'female' ? '#6c63ff' : '#222' }}>
              <input
                type="radio"
                name="sex"
                value="female"
                checked={formData.sex === 'female'}
                onChange={() => handleInputChange('sex', 'female')}
                style={{ accentColor: '#6c63ff', width: '18px', height: '18px' }}
              />
              Female
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', cursor: 'pointer', color: formData.sex === 'other' ? '#6c63ff' : '#222' }}>
              <input
                type="radio"
                name="sex"
                value="other"
                checked={formData.sex === 'other'}
                onChange={() => handleInputChange('sex', 'other')}
                style={{ accentColor: '#6c63ff', width: '18px', height: '18px' }}
              />
              Other
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">D.O.B</label>
          <input
            type="date"
            value={formData.dob}
            onChange={e => handleInputChange('dob', e.target.value)}
            className="form-input"
          />
        </div>
        {/* Country/State/City dynamic dropdowns */}
        <div className="form-group">
          <label className="form-label">Country</label>
          <select
            className="form-input"
            value={formData.country}
            onChange={e => {
              handleInputChange('country', e.target.value);
              handleInputChange('state', '');
              handleInputChange('city', '');
            }}
          >
            <option value="">Select Country</option>
            {/* --- All countries (shortened for demo, add more as needed) --- */}
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Brazil">Brazil</option>
            <option value="China">China</option>
            <option value="Japan">Japan</option>
            <option value="South Africa">South Africa</option>
            <option value="Russia">Russia</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
            <option value="Mexico">Mexico</option>
            <option value="Argentina">Argentina</option>
            <option value="Turkey">Turkey</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Egypt">Egypt</option>
            <option value="South Korea">South Korea</option>
            <option value="Singapore">Singapore</option>
            <option value="Malaysia">Malaysia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Sweden">Sweden</option>
            <option value="Norway">Norway</option>
            <option value="Denmark">Denmark</option>
            <option value="Finland">Finland</option>
            <option value="Poland">Poland</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Austria">Austria</option>
            <option value="Belgium">Belgium</option>
            <option value="Ireland">Ireland</option>
            <option value="Portugal">Portugal</option>
            <option value="Greece">Greece</option>
            <option value="Ukraine">Ukraine</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Hungary">Hungary</option>
            <option value="Romania">Romania</option>
            <option value="Israel">Israel</option>
            <option value="UAE">UAE</option>
            <option value="Qatar">Qatar</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="Peru">Peru</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Morocco">Morocco</option>
            <option value="Kenya">Kenya</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Thailand">Thailand</option>
            <option value="Philippines">Philippines</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Nepal">Nepal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">State</label>
          <select
            className="form-input"
            value={formData.state}
            onChange={e => {
              handleInputChange('state', e.target.value);
              handleInputChange('city', '');
            }}
            disabled={!formData.country}
          >
            <option value="">Select State</option>
            {/* Only show real options below, no duplicate placeholder */}
            {formData.country === 'India' && <>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Punjab">Punjab</option>
              <option value="Kerala">Kerala</option>
            </>}
            {formData.country === 'United States' && <>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
              <option value="New York">New York</option>
              <option value="Florida">Florida</option>
              <option value="Illinois">Illinois</option>
            </>}
            {formData.country === 'Australia' && <>
              <option value="New South Wales">New South Wales</option>
              <option value="Victoria">Victoria</option>
              <option value="Queensland">Queensland</option>
              <option value="Western Australia">Western Australia</option>
              <option value="South Australia">South Australia</option>
            </>}
            {/* Add more countries/states as needed */}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <select
            className="form-input"
            value={formData.city}
            onChange={e => handleInputChange('city', e.target.value)}
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {/* Only show real options below, no duplicate placeholder */}
            {formData.state === 'Maharashtra' && <>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Nashik">Nashik</option>
            </>}
            {formData.state === 'Delhi' && <>
              <option value="New Delhi">New Delhi</option>
              <option value="Dwarka">Dwarka</option>
              <option value="Rohini">Rohini</option>
            </>}
            {formData.state === 'Karnataka' && <>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Mangalore">Mangalore</option>
            </>}
            {formData.state === 'California' && <>
              <option value="Los Angeles">Los Angeles</option>
              <option value="San Francisco">San Francisco</option>
              <option value="San Diego">San Diego</option>
            </>}
            {formData.state === 'New South Wales' && <>
              <option value="Sydney">Sydney</option>
              <option value="Newcastle">Newcastle</option>
              <option value="Wollongong">Wollongong</option>
            </>}
            {/* Add more states/cities as needed */}
          </select>
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
            list="skill-suggestions"
            autoComplete="off"
          />
          <datalist id="skill-suggestions">
            <option value="Urban Planning" />
            <option value="GIS and Spatial Analysis" />
            <option value="AutoCAD" />
            <option value="SketchUp" />
            <option value="ArcGIS" />
            <option value="QGIS" />
            <option value="Sustainability Planning" />
            <option value="Transportation Planning" />
            <option value="Land Use Planning" />
            <option value="Environmental Planning" />
            <option value="Zoning Regulations" />
            <option value="Community Engagement" />
            <option value="Master Planning" />
            <option value="Urban Design" />
            <option value="Policy Analysis" />
            <option value="Project Management" />
            <option value="Data Analysis" />
            <option value="Strategic Planning" />
            <option value="Public Administration" />
            <option value="Infrastructure Planning" />
            <option value="Smart City Planning" />
            <option value="Housing Development" />
            <option value="Economic Development" />
            <option value="Climate Change Adaptation" />
            <option value="Resilience Planning" />
            <option value="Adobe Creative Suite" />
            <option value="Microsoft Office" />
            <option value="Statistical Analysis" />
            <option value="Research Methods" />
            <option value="Site Planning" />
          </datalist>
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn btn-primary btn-add-skill"
            disabled={!tempSkill.trim()}
            title={tempSkill.trim() ? `Add skill: ${tempSkill.trim()}` : 'Enter a skill to add'}
          >
            <Plus size={20} />
            <span>Add Skill</span>
          </button>
        </div>
        <p className="section-helper">Press Enter or click Add Skill to add your expertise</p>
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

  /**
   * Render professional section
   */
  const renderProfessionalSection = () => (
    <div className="form-section">
      <h3>Professional Information</h3>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">Website/Portfolio</label>
          <div className="input-with-icon">
            <Globe size={16} />
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="form-input"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <p className="field-note">Add your personal website or portfolio URL</p>
        </div>

        <div className="form-group full-width">
          <label className="form-label">LinkedIn Profile</label>
          <div className="input-with-icon">
            <Linkedin size={16} />
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="form-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <p className="field-note">Link to your LinkedIn profile</p>
        </div>

        <div className="form-group full-width">
          <label className="form-label">GitHub Profile</label>
          <div className="input-with-icon">
            <Github size={16} />
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              className="form-input"
              placeholder="https://github.com/yourprofile"
            />
          </div>
          <p className="field-note">Link to your GitHub profile</p>
        </div>
      </div>
    </div>
  )

  /**
   * Render experience section
   */
  const renderExperienceSection = () => (
    <div className="form-section">
      <div className="section-header-with-action">
        <h3>Work Experience</h3>
        <button
          type="button"
          onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })}
          className="btn btn-primary btn-add-experience"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>
      
      <div className="experience-list">
        {formData.experience && formData.experience.length > 0 ? (
          formData.experience.map((exp, index) => (
            <div key={index} className="experience-item-card">
              <div className="experience-card-header">
                <div className="experience-header-left">
                  <Briefcase size={20} />
                  <span className="experience-number">Experience #{index + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('experience', index)}
                  className="btn-remove-experience"
                  title="Remove"
                >
                  <X size={18} />
                  Remove
                </button>
              </div>

              <div className="experience-form-grid">
                <div className="form-row-two-cols">
                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                      className="form-input"
                      placeholder="e.g., City Development"
                      list={`company-suggestions-${index}`}
                      autoComplete="off"
                    />
                    <datalist id={`company-suggestions-${index}`}>
                      <option value="City Development Authority" />
                      <option value="Municipal Corporation" />
                      <option value="Urban Development Department" />
                      <option value="Town Planning Office" />
                      <option value="Metropolitan Planning Organization" />
                      <option value="Regional Planning Commission" />
                      <option value="Smart City Mission" />
                      <option value="Housing and Urban Development Corporation" />
                      <option value="AECOM" />
                      <option value="Jacobs Engineering" />
                      <option value="Arup" />
                      <option value="CBRE" />
                      <option value="Gensler" />
                      <option value="HOK" />
                      <option value="Perkins&Will" />
                      <option value="Stantec" />
                      <option value="WSP" />
                      <option value="Arcadis" />
                      <option value="SOM - Skidmore, Owings & Merrill" />
                      <option value="Environmental Planning Consultants" />
                      <option value="Urban Planning Associates" />
                      <option value="Community Development Corporation" />
                      <option value="Public Works Department" />
                      <option value="State Planning Agency" />
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Position *</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                      className="form-input"
                      placeholder="e.g., Urban Planner"
                      list={`position-suggestions-${index}`}
                      autoComplete="off"
                    />
                    <datalist id={`position-suggestions-${index}`}>
                      <option value="Urban Planner" />
                      <option value="Senior Urban Planner" />
                      <option value="Lead Urban Planner" />
                      <option value="Junior Urban Planner" />
                      <option value="City Planner" />
                      <option value="Regional Planner" />
                      <option value="Transportation Planner" />
                      <option value="Environmental Planner" />
                      <option value="Land Use Planner" />
                      <option value="Urban Designer" />
                      <option value="Community Development Planner" />
                      <option value="Planning Consultant" />
                      <option value="Planning Manager" />
                      <option value="Planning Director" />
                      <option value="GIS Analyst" />
                      <option value="Sustainability Coordinator" />
                      <option value="Housing Planner" />
                      <option value="Economic Development Planner" />
                      <option value="Zoning Administrator" />
                      <option value="Planning Intern" />
                    </datalist>
                  </div>
                </div>

                <div className="form-row-two-cols">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)}
                      className="form-input date-input"
                      placeholder="dd-mm-yyyy"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)}
                      className="form-input date-input"
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                    className="form-textarea"
                    placeholder="Describe your role and accomplishments..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No experience added yet. Add your first experience above.</p>
        )}
      </div>
    </div>
  )

  /**
   * Render education section
   */
  const renderEducationSection = () => (
    <div className="form-section">
      <div className="section-header">
        <h3>Education</h3>
        <button
          type="button"
          onClick={() => addArrayItem('education', { institution: '', degree: '', field: '', year: '' })}
          className="btn btn-primary btn-small"
        >
          + Add Education
        </button>
      </div>
      
      <div className="education-list">
        {formData.education && formData.education.length > 0 ? (
          formData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                    className="form-input"
                    placeholder="e.g., University of Mumbai"
                    list={`institution-suggestions-${index}`}
                    autoComplete="off"
                  />
                  <datalist id={`institution-suggestions-${index}`}>
                    <option value="University of Mumbai" />
                    <option value="Delhi University" />
                    <option value="Indian Institute of Technology (IIT)" />
                    <option value="School of Planning and Architecture" />
                    <option value="National Institute of Urban Affairs" />
                    <option value="CEPT University" />
                    <option value="Jawaharlal Nehru University" />
                    <option value="Anna University" />
                    <option value="MIT - Massachusetts Institute of Technology" />
                    <option value="Harvard University" />
                    <option value="UC Berkeley" />
                    <option value="Stanford University" />
                    <option value="Columbia University" />
                    <option value="University of Cambridge" />
                    <option value="University of Oxford" />
                    <option value="London School of Economics" />
                    <option value="National University of Singapore" />
                    <option value="Tsinghua University" />
                    <option value="University of Toronto" />
                    <option value="Australian National University" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Degree *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                    className="form-input"
                    placeholder="e.g., Bachelor of Planning"
                    list={`degree-suggestions-${index}`}
                    autoComplete="off"
                  />
                  <datalist id={`degree-suggestions-${index}`}>
                    <option value="Bachelor of Planning" />
                    <option value="Master of Urban Planning" />
                    <option value="Master of City Planning" />
                    <option value="Master of Regional Planning" />
                    <option value="Ph.D. in Urban Planning" />
                    <option value="Bachelor of Architecture" />
                    <option value="Master of Architecture" />
                    <option value="Bachelor of Civil Engineering" />
                    <option value="Master of Civil Engineering" />
                    <option value="Bachelor of Environmental Science" />
                    <option value="Master of Environmental Planning" />
                    <option value="Master of Public Administration" />
                    <option value="Master of Public Policy" />
                    <option value="Bachelor of Geography" />
                    <option value="Master of Urban Design" />
                    <option value="Diploma in Urban Planning" />
                    <option value="Certificate in GIS" />
                    <option value="MBA - Real Estate" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleArrayFieldChange('education', index, 'field', e.target.value)}
                    className="form-input"
                    placeholder="e.g., Urban Planning"
                    list={`field-suggestions-${index}`}
                    autoComplete="off"
                  />
                  <datalist id={`field-suggestions-${index}`}>
                    <option value="Urban Planning" />
                    <option value="Regional Planning" />
                    <option value="City Planning" />
                    <option value="Transportation Planning" />
                    <option value="Environmental Planning" />
                    <option value="Land Use Planning" />
                    <option value="Urban Design" />
                    <option value="Sustainable Development" />
                    <option value="Housing and Community Development" />
                    <option value="Infrastructure Planning" />
                    <option value="Smart Cities" />
                    <option value="GIS and Spatial Analysis" />
                    <option value="Architecture" />
                    <option value="Civil Engineering" />
                    <option value="Environmental Science" />
                    <option value="Geography" />
                    <option value="Public Policy" />
                    <option value="Real Estate Development" />
                    <option value="Economic Development" />
                    <option value="Landscape Architecture" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleArrayFieldChange('education', index, 'year', e.target.value)}
                    className="form-input"
                    placeholder="e.g., 2022"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeArrayItem('education', index)}
                className="btn btn-outline btn-small btn-danger"
              >
                <X size={14} />
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="empty-state">No education added yet. Click "Add Education" to add your qualifications.</p>
        )}
      </div>
    </div>
  )

  /**
   * Render social links section
   */
  const renderSocialLinksSection = () => (
    <div className="form-section">
      <h3>Social Links</h3>
      <p className="section-description">Add your social media profiles to increase visibility</p>
      
      <div className="social-links-grid">
        <div className="form-group">
          <label className="form-label">
            <Linkedin size={16} />
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className="form-input"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Github size={16} />
            GitHub
          </label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
            className="form-input"
            placeholder="https://github.com/yourprofile"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Globe size={16} />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="form-input"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
          title="Go back"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="header-content">
          <h1>Complete Your Profile</h1>
          <p>Build your professional presence on Planning Insights</p>
        </div>
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
            {activeSection === 'professional' && renderExperienceSection()}
            {activeSection === 'education' && renderEducationSection()}
            {activeSection === 'skills' && renderSkillsSection()}
            {activeSection === 'social' && renderSocialLinksSection()}

            <div className="form-actions">
              <div className="consent-checkbox-container" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1rem' }}>
                <input
                  type="checkbox"
                  id="networkingConsent"
                  checked={formData.networkingConsent}
                  onChange={(e) => handleInputChange('networkingConsent', e.target.checked)}
                  required
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="networkingConsent" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#2d3748', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  I GIVE MY CONSENT FOR MY DETAILS TO BE VISIBLE IN THE NETWORKING FORUM. <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>
                </label>
              </div>

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
