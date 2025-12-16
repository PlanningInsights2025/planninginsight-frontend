import api from './api'

/**
 * Learning Centre API Service
 * Handles all course-related API calls including enrollment, progress tracking, and instructor functions
 */
export const learningAPI = {
  /**
   * Get all courses with optional filters
   */
  getCourses: async (filters = {}) => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCourses = [
          {
            id: 1,
            title: 'Smart City Planning Fundamentals',
            instructor: 'Dr. Priya Sharma',
            description: 'Learn the core principles of smart city planning, including IoT integration, data analytics, and sustainable urban development strategies.',
            courseType: 'recorded',
            category: 'Urban Planning',
            level: 'Beginner',
            duration: 6,
            fees: 0,
            originalFees: 12000,
            rating: 4.8,
            reviewCount: 1247,
            enrollments: 2847,
            tags: ['Smart Cities', 'IoT', 'Sustainability', 'Urban Analytics'],
            image: null,
            nextSession: null,
            location: null,
            earlyBird: false,
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            title: 'Advanced GIS for Urban Planning',
            instructor: 'Prof. Rajesh Kumar',
            description: 'Master Geographic Information Systems for urban analysis, spatial planning, and decision-making in city development projects.',
            courseType: 'live',
            category: 'GIS & Mapping',
            level: 'Intermediate',
            duration: 8,
            fees: 15000,
            originalFees: 20000,
            rating: 4.6,
            reviewCount: 893,
            enrollments: 1567,
            tags: ['GIS', 'Spatial Analysis', 'Mapping', 'Urban Data'],
            image: null,
            nextSession: '2024-03-20',
            location: null,
            earlyBird: true,
            createdAt: '2024-02-01'
          },
          {
            id: 3,
            title: 'Sustainable Architecture Workshop',
            instructor: 'Ar. Anjali Patel',
            description: 'Hands-on workshop focusing on sustainable building design, green materials, and energy-efficient architectural practices.',
            courseType: 'offline',
            category: 'Sustainable Design',
            level: 'Advanced',
            duration: 4,
            fees: 25000,
            originalFees: 30000,
            rating: 4.9,
            reviewCount: 567,
            enrollments: 423,
            tags: ['Sustainability', 'Architecture', 'Green Building', 'Design'],
            image: null,
            nextSession: '2024-04-15',
            location: 'Mumbai, India',
            earlyBird: true,
            createdAt: '2024-01-20'
          },
          {
            id: 4,
            title: 'Urban Transportation Systems',
            instructor: 'Dr. Sameer Joshi',
            description: 'Comprehensive course covering urban transportation planning, traffic management, and public transit system design.',
            courseType: 'recorded',
            category: 'Transportation',
            level: 'Intermediate',
            duration: 5,
            fees: 8000,
            originalFees: 12000,
            rating: 4.5,
            reviewCount: 734,
            enrollments: 1892,
            tags: ['Transportation', 'Traffic', 'Public Transit', 'Mobility'],
            image: null,
            nextSession: null,
            location: null,
            earlyBird: false,
            createdAt: '2024-02-10'
          },
          {
            id: 5,
            title: 'Heritage Conservation Techniques',
            instructor: 'Dr. Meera Krishnan',
            description: 'Learn traditional and modern techniques for preserving and restoring historical buildings and urban heritage sites.',
            courseType: 'live',
            category: 'Heritage Conservation',
            level: 'Intermediate',
            duration: 6,
            fees: 12000,
            originalFees: 15000,
            rating: 4.7,
            reviewCount: 456,
            enrollments: 892,
            tags: ['Heritage', 'Conservation', 'Restoration', 'History'],
            image: null,
            nextSession: '2024-03-25',
            location: null,
            earlyBird: false,
            createdAt: '2024-02-05'
          },
          {
            id: 6,
            title: 'Data Analytics for Urban Planners',
            instructor: 'Prof. Vikram Singh',
            description: 'Practical data analysis techniques specifically tailored for urban planning applications and decision support.',
            courseType: 'recorded',
            category: 'Data Analytics',
            level: 'Beginner',
            duration: 4,
            fees: 0,
            originalFees: 8000,
            rating: 4.4,
            reviewCount: 623,
            enrollments: 2145,
            tags: ['Data Analytics', 'Python', 'Statistics', 'Urban Data'],
            image: null,
            nextSession: null,
            location: null,
            earlyBird: false,
            createdAt: '2024-01-30'
          }
        ]

        // Apply filters (simplified)
        let filteredCourses = mockCourses
        
        if (filters.courseType) {
          filteredCourses = filteredCourses.filter(course => course.courseType === filters.courseType)
        }
        
        if (filters.category) {
          filteredCourses = filteredCourses.filter(course => course.category === filters.category)
        }

        resolve(filteredCourses)
      }, 1000)
    })
  },

  /**
   * Get course details by ID
   */
  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`)
    return response.data
  },

  /**
   * Enroll in a course
   */
  enrollInCourse: async (courseId, enrollmentData = {}) => {
    const response = await api.post(`/courses/${courseId}/enroll`, enrollmentData)
    return response.data
  },

  /**
   * Get user's enrolled courses
   */
  getUserEnrollments: async () => {
    const response = await api.get('/enrollments')
    return response.data
  },

  /**
   * Get course progress
   */
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/progress`)
    return response.data
  },

  /**
   * Update course progress
   */
  updateCourseProgress: async (courseId, progressData) => {
    const response = await api.put(`/enrollments/${courseId}/progress`, progressData)
    return response.data
  },

  /**
   * Save/unsave course
   */
  toggleSaveCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/save`)
    return response.data
  },

  /**
   * Get saved courses
   */
  getSavedCourses: async () => {
    const response = await api.get('/courses/saved')
    return response.data
  },

  /**
   * Search courses
   */
  searchCourses: async (query, filters = {}) => {
    const response = await api.get('/courses/search', {
      params: { query, ...filters }
    })
    return response.data
  },

  /**
   * Instructor: Create course
   */
  createCourse: async (courseData) => {
    const response = await api.post('/instructor/courses', courseData)
    return response.data
  },

  /**
   * Instructor: Update course
   */
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/instructor/courses/${courseId}`, courseData)
    return response.data
  },

  /**
   * Instructor: Delete course
   */
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/instructor/courses/${courseId}`)
    return response.data
  },

  /**
   * Instructor: Get course enrollments
   */
  getCourseEnrollments: async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/enrollments`)
    return response.data
  },

  /**
   * Get course reviews
   */
  getCourseReviews: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/reviews`)
    return response.data
  },

  /**
   * Submit course review
   */
  submitCourseReview: async (courseId, reviewData) => {
    const response = await api.post(`/courses/${courseId}/reviews`, reviewData)
    return response.data
  },

  /**
   * Download certificate
   */
  downloadCertificate: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/certificate`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Get similar courses
   */
  getSimilarCourses: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/similar`)
    return response.data
  },

  /**
   * Get learning analytics
   */
  getLearningAnalytics: async () => {
    const response = await api.get('/learning/analytics')
    return response.data
  }
}

export default learningAPI