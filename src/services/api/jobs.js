import api from './api'

/**
 * Jobs API Service
 * Handles all job-related API calls including listings, applications, and recruiter functions
 */
export const jobsAPI = {
  /**
   * Get all job listings with optional filters
   */
  getJobs: async (filters = {}) => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockJobs = [
          {
            id: 1,
            title: 'Senior Urban Planner',
            company: 'City Development Authority',
            location: 'New Delhi, India',
            jobType: 'Full-time',
            experienceRequired: '5-10',
            salaryRange: 1200000,
            description: 'We are seeking an experienced Urban Planner to lead sustainable city development projects. The ideal candidate will have expertise in urban design, community engagement, and environmental planning.',
            applicationDeadline: '2024-03-15',
            skills: ['Urban Planning', 'GIS', 'Sustainability', 'Project Management', 'Community Engagement'],
            applicants: 47,
            createdAt: '2024-02-01',
            compatibilityScore: 85
          },
          {
            id: 2,
            title: 'Sustainability Consultant',
            company: 'GreenBuild Solutions',
            location: 'Bangalore, India',
            jobType: 'Contract',
            experienceRequired: '2-5',
            salaryRange: 800000,
            description: 'Join our team as a Sustainability Consultant working on green building projects and environmental impact assessments.',
            applicationDeadline: '2024-03-20',
            skills: ['Sustainability', 'LEED Certification', 'Environmental Assessment', 'Energy Efficiency'],
            applicants: 23,
            createdAt: '2024-02-05',
            compatibilityScore: 72
          },
          {
            id: 3,
            title: 'Transportation Engineer',
            company: 'Metro Infrastructure Ltd',
            location: 'Mumbai, India',
            jobType: 'Full-time',
            experienceRequired: '3-7',
            salaryRange: 1500000,
            description: 'Looking for a Transportation Engineer to design and implement urban transportation systems and traffic management solutions.',
            applicationDeadline: '2024-03-25',
            skills: ['Transportation Engineering', 'Traffic Analysis', 'CAD', 'Public Transit'],
            applicants: 34,
            createdAt: '2024-02-10',
            compatibilityScore: 91
          },
          {
            id: 4,
            title: 'Heritage Conservation Specialist',
            company: 'Cultural Heritage Trust',
            location: 'Chennai, India',
            jobType: 'Full-time',
            experienceRequired: '4-8',
            salaryRange: 900000,
            description: 'Work on preserving and restoring historical buildings and sites while ensuring modern usability and compliance.',
            applicationDeadline: '2024-03-18',
            skills: ['Heritage Conservation', 'Historical Research', 'Restoration', 'Architectural History'],
            applicants: 18,
            createdAt: '2024-02-08',
            compatibilityScore: 68
          },
          {
            id: 5,
            title: 'GIS Analyst',
            company: 'Geo Spatial Solutions',
            location: 'Hyderabad, India',
            jobType: 'Full-time',
            experienceRequired: '1-3',
            salaryRange: 600000,
            description: 'Analyze spatial data and create maps for urban planning projects using GIS software and tools.',
            applicationDeadline: '2024-03-30',
            skills: ['GIS', 'Spatial Analysis', 'Cartography', 'Remote Sensing'],
            applicants: 56,
            createdAt: '2024-02-12',
            compatibilityScore: 79
          },
          {
            id: 6,
            title: 'Urban Data Scientist',
            company: 'Smart Cities Initiative',
            location: 'Pune, India',
            jobType: 'Full-time',
            experienceRequired: '2-5',
            salaryRange: 1100000,
            description: 'Use data science techniques to analyze urban patterns and inform smart city decision-making.',
            applicationDeadline: '2024-03-22',
            skills: ['Data Science', 'Python', 'Machine Learning', 'Urban Analytics'],
            applicants: 29,
            createdAt: '2024-02-14',
            compatibilityScore: 88
          }
        ]

        // Apply filters (simplified)
        let filteredJobs = mockJobs
        
        if (filters.location) {
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(filters.location.toLowerCase())
          )
        }
        
        if (filters.jobType) {
          filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType)
        }

        resolve(filteredJobs)
      }, 1000)
    })
  },

  /**
   * Get job details by ID
   */
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`)
    return response.data
  },

  /**
   * Apply for a job
   */
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData)
    return response.data
  },

  /**
   * Get user's job applications
   */
  getUserApplications: async () => {
    const response = await api.get('/applications')
    return response.data
  },

  /**
   * Save/unsave job
   */
  toggleSaveJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/save`)
    return response.data
  },

  /**
   * Get saved jobs
   */
  getSavedJobs: async () => {
    const response = await api.get('/jobs/saved')
    return response.data
  },

  /**
   * Search jobs
   */
  searchJobs: async (query, filters = {}) => {
    const response = await api.get('/jobs/search', {
      params: { query, ...filters }
    })
    return response.data
  },

  /**
   * Recruiter: Create job posting
   */
  createJob: async (jobData) => {
    const response = await api.post('/recruiter/jobs', jobData)
    return response.data
  },

  /**
   * Recruiter: Update job posting
   */
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/recruiter/jobs/${jobId}`, jobData)
    return response.data
  },

  /**
   * Recruiter: Delete job posting
   */
  deleteJob: async (jobId) => {
    const response = await api.delete(`/recruiter/jobs/${jobId}`)
    return response.data
  },

  /**
   * Recruiter: Get job applications
   */
  getJobApplications: async (jobId) => {
    const response = await api.get(`/recruiter/jobs/${jobId}/applications`)
    return response.data
  },

  /**
   * Recruiter: Update application status
   */
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    const response = await api.put(`/recruiter/applications/${applicationId}`, {
      status,
      notes
    })
    return response.data
  },

  /**
   * Get similar jobs
   */
  getSimilarJobs: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/similar`)
    return response.data
  },

  /**
   * Get application analytics
   */
  getApplicationAnalytics: async () => {
    const response = await api.get('/applications/analytics')
    return response.data
  }
}

export default jobsAPI