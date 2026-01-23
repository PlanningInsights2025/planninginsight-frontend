import api from './api'

/**
 * Publishing House API Service
 * Handles all publication-related API calls including journals, manuscripts, and editorial workflows
 */
export const publishingAPI = {
  /**
   * Get all publications with optional filters
   */
  getPublications: async (filters = {}) => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPublications = [
          {
            id: 1,
            title: 'Journal of Urban Planning and Development',
            publisher: 'American Society of Civil Engineers',
            description: 'A peer-reviewed journal focusing on urban planning, development, and infrastructure management in growing cities.',
            accessType: 'open',
            category: 'Urban Planning',
            year: 2024,
            volume: 150,
            issue: 1,
            issn: '0733-9488',
            publicationDate: '2024-01-15',
            downloads: 1247,
            citations: 89,
            status: 'published',
            keywords: ['Urban Planning', 'Infrastructure', 'Sustainable Development', 'City Management']
          },
          {
            id: 2,
            title: 'Sustainable Cities and Society',
            publisher: 'Elsevier',
            description: 'International journal focusing on fundamental and applied research on sustainable development and smart city technologies.',
            accessType: 'paid',
            category: 'Sustainable Development',
            year: 2024,
            volume: 45,
            issue: null,
            issn: '2210-6707',
            publicationDate: '2024-02-01',
            downloads: 2893,
            citations: 156,
            status: 'published',
            keywords: ['Sustainability', 'Smart Cities', 'Energy Efficiency', 'Urban Analytics']
          },
          {
            id: 3,
            title: 'Transportation Research Part A: Policy and Practice',
            publisher: 'Elsevier',
            description: 'Covers policy and practice in passenger and freight transportation across all modes from local to international.',
            accessType: 'sso',
            category: 'Transportation',
            year: 2023,
            volume: 178,
            issue: 3,
            issn: '0965-8564',
            publicationDate: '2023-12-10',
            downloads: 1876,
            citations: 234,
            status: 'published',
            keywords: ['Transportation', 'Policy', 'Mobility', 'Infrastructure']
          },
          {
            id: 4,
            title: 'Heritage and Sustainable Urban Development',
            publisher: 'Taylor & Francis',
            description: 'Explores the intersection of cultural heritage preservation and contemporary urban development challenges.',
            accessType: 'open',
            category: 'Heritage Conservation',
            year: 2023,
            volume: 12,
            issue: 2,
            issn: '2470-8536',
            publicationDate: '2023-11-20',
            downloads: 892,
            citations: 45,
            status: 'published',
            keywords: ['Heritage', 'Conservation', 'Urban Development', 'Cultural Preservation']
          },
          {
            id: 5,
            title: 'GIS for Urban Planning and Management',
            publisher: 'Springer',
            description: 'Comprehensive guide to GIS applications in urban planning, spatial analysis, and decision support systems.',
            accessType: 'paid',
            category: 'GIS & Mapping',
            year: 2023,
            volume: 1,
            issue: null,
            issn: '2520-8520',
            publicationDate: '2023-10-05',
            downloads: 1567,
            citations: 78,
            status: 'published',
            keywords: ['GIS', 'Spatial Analysis', 'Urban Planning', 'Mapping']
          },
          {
            id: 6,
            title: 'Urban Data Science and Analytics',
            publisher: 'MIT Press',
            description: 'Advanced techniques in data science applied to urban problems, including machine learning and predictive modeling.',
            accessType: 'sso',
            category: 'Data Analytics',
            year: 2023,
            volume: 8,
            issue: 4,
            issn: '2691-5237',
            publicationDate: '2023-09-15',
            downloads: 2134,
            citations: 112,
            status: 'published',
            keywords: ['Data Science', 'Urban Analytics', 'Machine Learning', 'Predictive Modeling']
          }
        ]

        // Apply filters (simplified)
        let filteredPublications = mockPublications
        
        if (filters.accessType) {
          filteredPublications = filteredPublications.filter(pub => pub.accessType === filters.accessType)
        }
        
        if (filters.category) {
          filteredPublications = filteredPublications.filter(pub => pub.category === filters.category)
        }

        resolve(filteredPublications)
      }, 1000)
    })
  },

  /**
   * Get publication details by ID
   */
  getPublicationById: async (publicationId) => {
    const response = await api.get(`/publications/${publicationId}`)
    return response.data
  },

  /**
   * Submit manuscript for publication
   */
  submitManuscript: async (manuscriptData) => {
    // Don't set Content-Type header manually - browser will set it automatically with boundary for FormData
    console.log('🌐 API Service: Sending manuscript to backend...')
    const response = await api.post('/publishing/manuscripts/submit', manuscriptData)
    console.log('🌐 API Service: Response received:', response.data)
    return response.data
  },

  /**
   * Get user's manuscript submissions
   */
  getUserManuscripts: async () => {
    const response = await api.get('/manuscripts')
    return response.data
  },

  /**
   * Get manuscript by ID
   */
  getManuscriptById: async (manuscriptId) => {
    const response = await api.get(`/manuscripts/${manuscriptId}`)
    return response.data
  },

  /**
   * Update manuscript
   */
  updateManuscript: async (manuscriptId, manuscriptData) => {
    const response = await api.put(`/manuscripts/${manuscriptId}`, manuscriptData)
    return response.data
  },

  /**
   * Withdraw manuscript
   */
  withdrawManuscript: async (manuscriptId) => {
    const response = await api.delete(`/manuscripts/${manuscriptId}`)
    return response.data
  },

  /**
   * Download publication
   */
  downloadPublication: async (publicationId) => {
    const response = await api.get(`/publications/${publicationId}/download`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * View publication online
   */
  viewPublication: async (publicationId) => {
    const response = await api.get(`/publications/${publicationId}/view`)
    return response.data
  },

  /**
   * Get publishing requirements (public endpoint)
   */
  getPublishingRequirements: async (filters = {}) => {
    const response = await api.get('/publishing/requirements', { params: filters })
    return response.data
  },

  /**
   * Get my manuscripts
   */
  getMyManuscripts: async () => {
    console.log('🌐 API Service: Fetching my manuscripts...')
    const response = await api.get('/publishing/my-manuscripts')
    console.log('🌐 API Service: Manuscripts response:', response.data)
    return response.data
  },

  /**
   * Delete manuscript
   */
  deleteManuscript: async (manuscriptId) => {
    console.log('🌐 API Service: Deleting manuscript:', manuscriptId)
    const response = await api.delete(`/publishing/manuscripts/${manuscriptId}`)
    console.log('🌐 API Service: Delete response:', response.data)
    return response.data
  },

  /**
   * Get manuscript details
   */
  getManuscriptDetails: async (manuscriptId) => {
    const response = await api.get(`/publishing/manuscripts/${manuscriptId}`)
    return response.data
  },

  /**
   * Update manuscript status
   */
  updateManuscriptStatus: async (manuscriptId, status) => {
    const response = await api.patch(`/publishing/manuscripts/${manuscriptId}/status`, { status })
    return response.data
  },

  /**
   * Get publication citations
   */
  getPublicationCitations: async (publicationId) => {
    const response = await api.get(`/publications/${publicationId}/citations`)
    return response.data
  },

  /**
   * Search publications
   */
  searchPublications: async (query, filters = {}) => {
    const response = await api.get('/publications/search', {
      params: { query, ...filters }
    })
    return response.data
  },

  /**
   * Get similar publications
   */
  getSimilarPublications: async (publicationId) => {
    const response = await api.get(`/publications/${publicationId}/similar`)
    return response.data
  },

  /**
   * Get publication analytics
   */
  getPublicationAnalytics: async () => {
    const response = await api.get('/publications/analytics')
    return response.data
  },

  /**
   * Editor: Get manuscripts for review
   */
  getManuscriptsForReview: async () => {
    const response = await api.get('/editor/manuscripts')
    return response.data
  },

  /**
   * Editor: Assign manuscript to reviewer
   */
  assignManuscript: async (manuscriptId, reviewerId) => {
    const response = await api.post(`/editor/manuscripts/${manuscriptId}/assign`, { reviewerId })
    return response.data
  },

  /**
   * Editor: Make final decision on manuscript
   */
  makeDecision: async (manuscriptId, decision, comments = '') => {
    const response = await api.post(`/editor/manuscripts/${manuscriptId}/decision`, {
      decision,
      comments
    })
    return response.data
  },

  /**
   * Reviewer: Get assigned manuscripts
   */
  getAssignedManuscripts: async () => {
    const response = await api.get('/reviewer/manuscripts')
    return response.data
  },

  /**
   * Reviewer: Submit review
   */
  submitReview: async (manuscriptId, reviewData) => {
    const response = await api.post(`/reviewer/manuscripts/${manuscriptId}/review`, reviewData)
    return response.data
  }
}

// Named exports for convenience
export const getPublications = publishingAPI.getPublications
export const getPublishingRequirements = publishingAPI.getPublishingRequirements
export const submitManuscript = publishingAPI.submitManuscript
export const getMyManuscripts = publishingAPI.getMyManuscripts
export const deleteManuscript = publishingAPI.deleteManuscript
export const updateManuscriptStatus = publishingAPI.updateManuscriptStatus
export const getManuscriptDetails = publishingAPI.getManuscriptDetails
export const getAssignedManuscripts = publishingAPI.getAssignedManuscripts
export const submitReview = publishingAPI.submitReview

// Research Paper API functions
export const createResearchPaper = async (paperData) => {
  const response = await api.post('/research-papers', paperData)
  return response.data
}

export const getMyResearchPapers = async () => {
  const response = await api.get('/research-papers')
  return response.data
}

export const getResearchPaperById = async (id) => {
  const response = await api.get(`/research-papers/${id}`)
  return response.data
}

export const updateResearchPaper = async (id, paperData) => {
  const response = await api.put(`/research-papers/${id}`, paperData)
  return response.data
}

export const deleteResearchPaper = async (id) => {
  const response = await api.delete(`/research-papers/${id}`)
  return response.data
}

export default publishingAPI