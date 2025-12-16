import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'
import { useApi } from '../../hooks/useApi'
import { jobsAPI } from '../../services/api/jobs'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Building, 
  DollarSign,
  Users,
  Bookmark,
  Share2,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import Loader from '../../components/common/Loader/Loader'
import ApplicationForm from './ApplicationForm/ApplicationForm'

/**
 * Job Detail Page Component
 * Shows complete job information and handles job application process
 * Includes recruiter information, AI compatibility score, and similar job recommendations
 */
const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()
  
  // State management
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [similarJobs, setSimilarJobs] = useState([])
  const [recruiterInfo, setRecruiterInfo] = useState(null)

  // API hooks
  const [fetchJobApi] = useApi(jobsAPI.getJobById)
  const [fetchSimilarJobsApi] = useApi(jobsAPI.getSimilarJobs)

  /**
   * Fetch job details on component mount
   */
  useEffect(() => {
    if (id) {
      loadJobDetails()
    }
  }, [id])

  /**
   * Load job details and related data
   */
  const loadJobDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch job details
      const jobData = await fetchJobApi(id, {
        showError: true,
        errorMessage: 'Failed to load job details'
      })
      
      if (jobData) {
        setJob(jobData)
        
        // Fetch similar jobs
        const similarJobsData = await fetchSimilarJobsApi(id)
        setSimilarJobs(similarJobsData || [])
        
        // Fetch recruiter info (would come from API in real implementation)
        loadRecruiterInfo(jobData.recruiterId)
      }
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load recruiter information (mock data for now)
   */
  const loadRecruiterInfo = (recruiterId) => {
    // Mock recruiter data
    const mockRecruiter = {
      id: recruiterId,
      name: 'City Development Authority',
      description: 'Leading urban development organization focused on sustainable city planning and infrastructure development.',
      website: 'https://citydevelopment.example.com',
      founded: 1995,
      employees: '1000-5000',
      location: 'New Delhi, India',
      hiringHistory: 47,
      averageResponseTime: '2-3 days',
      verified: true
    }
    setRecruiterInfo(mockRecruiter)
  }

  /**
   * Handle job application
   */
  const handleApply = () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to apply for this job', 'info')
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }
    
    setShowApplicationForm(true)
  }

  /**
   * Handle save job
   */
  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to save jobs', 'info')
      return
    }

    try {
      await jobsAPI.toggleSaveJob(id)
      showNotification('Job saved successfully', 'success')
    } catch (error) {
      showNotification('Failed to save job', 'error')
    }
  }

  /**
   * Handle share job
   */
  const handleShareJob = () => {
    const jobUrl = window.location.href
    navigator.clipboard.writeText(jobUrl)
    showNotification('Job link copied to clipboard', 'success')
  }

  /**
   * Check if application deadline has passed
   */
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date()
  }

  /**
   * Format salary for display
   */
  const formatSalary = (salary) => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L per year`
    }
    return `₹${(salary / 1000).toFixed(0)}K per year`
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Render job header section
   */
  const renderJobHeader = () => (
    <div className="job-header">
      <div className="back-navigation">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Back to Jobs
        </button>
      </div>

      <div className="job-title-section">
        <div className="title-content">
          <h1>{job.title}</h1>
          <div className="company-info">
            <Building size={20} />
            <span className="company-name">{job.company}</span>
            {recruiterInfo?.verified && (
              <span className="verified-badge">Verified</span>
            )}
          </div>
        </div>

        <div className="job-actions">
          <button 
            className="icon-button"
            onClick={handleSaveJob}
            title="Save job"
          >
            <Bookmark size={20} />
          </button>
          <button 
            className="icon-button"
            onClick={handleShareJob}
            title="Share job"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="job-meta">
        <div className="meta-item">
          <MapPin size={18} />
          <span>{job.location}</span>
        </div>
        <div className="meta-item">
          <Clock size={18} />
          <span>{job.jobType}</span>
        </div>
        <div className="meta-item">
          <DollarSign size={18} />
          <span>{formatSalary(job.salaryRange)}</span>
        </div>
        <div className="meta-item">
          <Calendar size={18} />
          <span>Apply by {formatDate(job.applicationDeadline)}</span>
        </div>
        {job.applicants && (
          <div className="meta-item">
            <Users size={18} />
            <span>{job.applicants} applicants</span>
          </div>
        )}
      </div>

      {/* Application Status & Actions */}
      <div className="application-section">
        {isDeadlinePassed(job.applicationDeadline) ? (
          <div className="deadline-expired">
            <AlertCircle size={20} />
            <span>Application deadline has passed</span>
          </div>
        ) : (
          <div className="application-actions">
            {isAuthenticated ? (
              <>
                {job.compatibilityScore && (
                  <div className="compatibility-score">
                    <div className="score-badge">
                      <CheckCircle size={16} />
                      <span>{job.compatibilityScore}% Match</span>
                    </div>
                    <p>Your profile matches well with this job requirements</p>
                  </div>
                )}
                
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleApply}
                >
                  <FileText size={20} />
                  Apply Now
                </button>
              </>
            ) : (
              <div className="login-prompt">
                <div className="prompt-content">
                  <Eye size={24} />
                  <p>Sign in to view full details and apply for this position</p>
                  <Link to="/login" className="btn btn-primary">
                    Sign In to Apply
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Render job description section
   */
  const renderJobDescription = () => (
    <div className="job-description-section">
      <h2>Job Description</h2>
      <div className="description-content">
        {isAuthenticated ? (
          <div className="full-description">
            <p>{job.description}</p>
            
            <div className="requirements">
              <h3>Requirements</h3>
              <ul>
                <li>{job.experienceRequired} years of relevant experience</li>
                <li>Bachelor's degree in Urban Planning, Architecture, or related field</li>
                <li>Strong knowledge of urban design principles and sustainability practices</li>
                <li>Excellent communication and project management skills</li>
              </ul>
            </div>

            <div className="responsibilities">
              <h3>Responsibilities</h3>
              <ul>
                <li>Develop and implement urban planning strategies</li>
                <li>Coordinate with stakeholders and community groups</li>
                <li>Conduct site analysis and environmental impact assessments</li>
                <li>Prepare reports and presentations for city officials</li>
                <li>Ensure compliance with local regulations and sustainability standards</li>
              </ul>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="skills-section">
                <h3>Required Skills</h3>
                <div className="skills-list">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="blurred-description">
            <p>{job.description.substring(0, 300)}...</p>
            <div className="blur-overlay">
              <div className="login-prompt-inline">
                <Eye size={24} />
                <p>Sign in to view complete job description and requirements</p>
                <Link to="/login" className="btn btn-primary btn-small">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Render recruiter information section
   */
  const renderRecruiterInfo = () => (
    <div className="recruiter-section">
      <h2>About the Recruiter</h2>
      <div className="recruiter-card">
        <div className="recruiter-header">
          <div className="recruiter-avatar">
            <Building size={24} />
          </div>
          <div className="recruiter-details">
            <h3>{recruiterInfo.name}</h3>
            {recruiterInfo.verified && (
              <span className="verified-badge">Verified Recruiter</span>
            )}
          </div>
        </div>
        
        <p className="recruiter-description">{recruiterInfo.description}</p>
        
        <div className="recruiter-stats">
          <div className="stat">
            <span className="stat-value">{recruiterInfo.hiringHistory}</span>
            <span className="stat-label">Jobs Posted</span>
          </div>
          <div className="stat">
            <span className="stat-value">{recruiterInfo.averageResponseTime}</span>
            <span className="stat-label">Avg. Response Time</span>
          </div>
          <div className="stat">
            <span className="stat-value">{recruiterInfo.employees}</span>
            <span className="stat-label">Employees</span>
          </div>
        </div>
        
        <div className="recruiter-meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{recruiterInfo.location}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>Founded {recruiterInfo.founded}</span>
          </div>
        </div>
        
        <div className="recruiter-actions">
          <button className="btn btn-outline btn-small">
            View Company Profile
          </button>
          <button className="btn btn-outline btn-small">
            Follow Company
          </button>
        </div>
      </div>
    </div>
  )

  /**
   * Render similar jobs section
   */
  const renderSimilarJobs = () => (
    <div className="similar-jobs-section">
      <h2>Similar Jobs You Might Like</h2>
      <div className="similar-jobs-grid">
        {similarJobs.slice(0, 3).map(similarJob => (
          <div key={similarJob.id} className="similar-job-card">
            <div className="similar-job-header">
              <h4>{similarJob.title}</h4>
              <span className="company">{similarJob.company}</span>
            </div>
            
            <div className="similar-job-meta">
              <div className="meta-item">
                <MapPin size={14} />
                <span>{similarJob.location}</span>
              </div>
              <div className="meta-item">
                <DollarSign size={14} />
                <span>{formatSalary(similarJob.salaryRange)}</span>
              </div>
            </div>
            
            <div className="similar-job-actions">
              <Link 
                to={`/jobs/${similarJob.id}`}
                className="btn btn-outline btn-small"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {similarJobs.length === 0 && (
        <div className="no-similar-jobs">
          <p>No similar jobs found at the moment.</p>
          <Link to="/jobs" className="btn btn-outline">
            Browse All Jobs
          </Link>
        </div>
      )}
    </div>
  )

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="job-detail-loading">
        <div className="loading-content">
          <Loader size="lg" text="Loading job details..." />
        </div>
      </div>
    )
  }

  /**
   * Render not found state
   */
  if (!job) {
    return (
      <div className="job-not-found">
        <div className="not-found-content">
          <AlertCircle size={48} />
          <h2>Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse All Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="job-detail-page">
      <div className="container">
        {/* Main Job Content */}
        <div className="job-detail-content">
          <div className="main-content">
            {renderJobHeader()}
            {renderJobDescription()}
            {renderSimilarJobs()}
          </div>
          
          <div className="sidebar-content">
            {recruiterInfo && renderRecruiterInfo()}
            
            {/* Quick Apply Card for logged-in users */}
            {isAuthenticated && !isDeadlinePassed(job.applicationDeadline) && (
              <div className="quick-apply-card">
                <h3>Ready to Apply?</h3>
                <p>Submit your application for this position</p>
                <button 
                  className="btn btn-primary w-full"
                  onClick={handleApply}
                >
                  <FileText size={18} />
                  Start Application
                </button>
                <div className="apply-info">
                  <div className="info-item">
                    <Clock size={14} />
                    <span>Takes about 10 minutes</span>
                  </div>
                  <div className="info-item">
                    <CheckCircle size={14} />
                    <span>No resume required</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationForm
          job={job}
          isOpen={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={() => {
            setShowApplicationForm(false)
            showNotification('Application submitted successfully!', 'success')
          }}
        />
      )}
    </div>
  )
}

export default JobDetail