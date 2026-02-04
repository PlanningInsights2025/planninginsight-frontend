import api from './api'

/**
 * Forum API Service
 * Handles all forum-related API calls
 */

export const forumAPI = {
  // ==================== FORUM OPERATIONS ====================
  
  /**
   * Create a new forum
   */
  createForum: async (forumData) => {
    const response = await api.post('/forum/create', forumData)
    return response.data
  },

  /**
   * Get all forums with filters
   */
  getForums: async (params = {}) => {
    const response = await api.get('/forum/list', { params })
    return response.data
  },

  /**
   * Get single forum by ID or slug
   */
  getForum: async (id) => {
    const response = await api.get(`/forum/${id}`)
    return response.data
  },

  /**
   * Get trending forums
   */
  getTrendingForums: async (limit = 10) => {
    const response = await api.get('/forum/trending', { params: { limit } })
    return response.data
  },

  /**
   * Check if forum title is unique
   */
  checkTitleUniqueness: async (title) => {
    const response = await api.get(`/forum/check-title/${encodeURIComponent(title)}`)
    return response.data
  },

  /**
   * Get forum suggestions (for duplicate detection)
   */
  getForumSuggestions: async (query) => {
    const response = await api.get('/forum/suggestions', { params: { query } })
    return response.data
  },

  /**
   * Follow/unfollow a forum
   */
  toggleFollow: async (forumId) => {
    const response = await api.post(`/forum/${forumId}/follow`)
    return response.data
  },

  /**
   * Get forum analytics
   */
  getForumAnalytics: async (forumId) => {
    const response = await api.get(`/forum/${forumId}/analytics`)
    return response.data
  },

  // ==================== QUESTION OPERATIONS ====================

  /**
   * Create a question in a forum
   */
  createQuestion: async (forumId, questionData) => {
    const response = await api.post(`/forum/${forumId}/question`, questionData)
    return response.data
  },

  /**
   * Get questions for a forum
   */
  getQuestions: async (forumId, params = {}) => {
    const response = await api.get(`/forum/${forumId}/questions`, { params })
    return response.data
  },

  /**
   * Get single question by ID
   */
  getQuestion: async (questionId) => {
    const response = await api.get(`/forum/question/${questionId}`)
    return response.data
  },

  /**
   * Get question suggestions (duplicate detection)
   */
  getQuestionSuggestions: async (query, forumId = null) => {
    const response = await api.get('/forum/question/suggestions', { 
      params: { query, forumId } 
    })
    return response.data
  },

  /**
   * React to a question (like/dislike)
   */
  reactToQuestion: async (questionId, type) => {
    const response = await api.post(`/forum/question/${questionId}/react`, { type })
    return response.data
  },

  /**
   * Follow/unfollow a question
   */
  toggleQuestionFollow: async (questionId) => {
    const response = await api.post(`/forum/question/${questionId}/follow`)
    return response.data
  },

  /**
   * Delete a question
   */
  deleteQuestion: async (questionId) => {
    const response = await api.delete(`/forum/question/${questionId}`)
    return response.data
  },

  // ==================== ANSWER OPERATIONS ====================

  /**
   * Create an answer to a question
   */
  createAnswer: async (questionId, answerData) => {
    const response = await api.post(`/forum/question/${questionId}/answer`, answerData)
    return response.data
  },

  /**
   * Get answers for a question
   */
  getAnswers: async (questionId, params = {}) => {
    const response = await api.get(`/forum/question/${questionId}/answers`, { params })
    return response.data
  },

  /**
   * Add a comment to an answer
   */
  addComment: async (answerId, commentData) => {
    const response = await api.post(`/forum/answer/${answerId}/comment`, commentData)
    return response.data
  },

  /**
   * React to an answer (like/dislike)
   */
  reactToAnswer: async (answerId, type) => {
    const response = await api.post(`/forum/answer/${answerId}/react`, { type })
    return response.data
  },

  /**
   * Mark answer as best answer
   */
  markBestAnswer: async (answerId) => {
    const response = await api.put(`/forum/answer/${answerId}/mark-best`)
    return response.data
  },

  /**
   * Delete an answer
   */
  deleteAnswer: async (answerId) => {
    const response = await api.delete(`/forum/answer/${answerId}`)
    return response.data
  },

  /**
   * React to a comment
   */
  reactToComment: async (answerId, commentId) => {
    const response = await api.post(`/forum/answer/${answerId}/comment/${commentId}/react`)
    return response.data
  },

  // ==================== MODERATION ====================

  /**
   * Flag content
   */
  flagContent: async (flagData) => {
    const response = await api.post('/forum/flag', flagData)
    return response.data
  },

  /**
   * Submit an appeal
   */
  submitAppeal: async (flagId, content) => {
    const response = await api.post(`/forum/appeal/flag/${flagId}/appeal`, { content })
    return response.data
  },

  // ==================== POLLS ====================

  /**
   * Get all polls
   */
  getPolls: async (params = {}) => {
    const response = await api.get('/forum/polls', { params })
    return response.data
  },

  /**
   * Get single poll
   */
  getPoll: async (pollId) => {
    const response = await api.get(`/forum/poll/${pollId}`)
    return response.data
  },

  /**
   * Vote on a poll
   */
  votePoll: async (pollId, optionIndexes) => {
    const response = await api.post(`/forum/poll/${pollId}/vote`, { optionIndexes })
    return response.data
  }
}

/**
 * Admin Forum API Service
 * Admin-only forum operations
 */
export const forumAdminAPI = {
  /**
   * Get pending forums for approval
   */
  getPendingForums: async (params = {}) => {
    const response = await api.get('/admin/forum/forums/pending', { params })
    return response.data
  },

  /**
   * Get all forums (admin view)
   */
  getAllForums: async (params = {}) => {
    const response = await api.get('/admin/forum/forums', { params })
    return response.data
  },

  /**
   * Approve a forum
   */
  approveForum: async (forumId) => {
    const response = await api.put(`/admin/forum/forum/${forumId}/approve`)
    return response.data
  },

  /**
   * Reject a forum
   */
  rejectForum: async (forumId, reason) => {
    const response = await api.put(`/admin/forum/forum/${forumId}/reject`, { reason })
    return response.data
  },

  /**
   * Delete a forum
   */
  deleteForum: async (forumId) => {
    const response = await api.delete(`/admin/forum/forum/${forumId}`)
    return response.data
  },

  /**
   * Get all flagged content
   */
  getFlaggedContent: async (params = {}) => {
    const response = await api.get('/admin/forum/flags', { params })
    return response.data
  },

  /**
   * Get anonymous user identity
   */
  getAnonymousIdentity: async (contentType, contentId) => {
    const response = await api.get(`/admin/forum/flag/${contentType}/${contentId}/identity`)
    return response.data
  },

  /**
   * Resolve a flag
   */
  resolveFlag: async (flagId, action, adminNotes) => {
    const response = await api.post(`/admin/forum/flag/${flagId}/resolve`, { action, adminNotes })
    return response.data
  },

  /**
   * Review an appeal
   */
  reviewAppeal: async (flagId, decision, adminNotes) => {
    const response = await api.post(`/admin/forum/flag/${flagId}/appeal/review`, { decision, adminNotes })
    return response.data
  },

  /**
   * Create a poll (admin only)
   */
  createPoll: async (pollData) => {
    const response = await api.post('/admin/forum/poll/create', pollData)
    return response.data
  },

  /**
   * Get poll analytics
   */
  getPollAnalytics: async (pollId) => {
    const response = await api.get(`/admin/forum/poll/${pollId}/analytics`)
    return response.data
  },

  /**
   * Close a poll
   */
  closePoll: async (pollId) => {
    const response = await api.put(`/admin/forum/poll/${pollId}/close`)
    return response.data
  }
}

export default forumAPI