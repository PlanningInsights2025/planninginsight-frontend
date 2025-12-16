import api from './api';

/**
 * Discussion Forum API Service
 * Handles all forum-related API calls including threads, comments, and user interactions
 */
export const forumAPI = {
  /**
   * Get all forums
   */
  getForums: async (params = {}) => {
    const response = await api.get('/forum/forums', { params });
    return response.data;
  },

  /**
   * Get forum by ID
   */
  getForum: async (forumId) => {
    const response = await api.get(`/forum/forums/${forumId}`);
    return response.data;
  },

  /**
   * Create new forum (admin only)
   */
  createForum: async (forumData) => {
    const response = await api.post('/forum/forums', forumData);
    return response.data;
  },

  /**
   * Update forum (admin only)
   */
  updateForum: async (forumId, forumData) => {
    const response = await api.put(`/forum/forums/${forumId}`, forumData);
    return response.data;
  },

  /**
   * Get all threads with optional filtering
   */
  getThreads: async (params = {}) => {
    const response = await api.get('/forum/threads', { params });
    return response.data;
  },

  /**
   * Get thread by ID
   */
  getThread: async (threadId) => {
    const response = await api.get(`/forum/threads/${threadId}`);
    return response.data;
  },

  /**
   * Create new thread
   */
  createThread: async (threadData) => {
    const response = await api.post('/forum/threads', threadData);
    return response.data;
  },

  /**
   * Update thread
   */
  updateThread: async (threadId, threadData) => {
    const response = await api.put(`/forum/threads/${threadId}`, threadData);
    return response.data;
  },

  /**
   * Delete thread
   */
  deleteThread: async (threadId) => {
    const response = await api.delete(`/forum/threads/${threadId}`);
    return response.data;
  },

  /**
   * Get thread comments
   */
  getComments: async (threadId, params = {}) => {
    const response = await api.get(`/forum/threads/${threadId}/comments`, { params });
    return response.data;
  },

  /**
   * Add comment to thread
   */
  addComment: async (threadId, commentData) => {
    const response = await api.post(`/forum/threads/${threadId}/comments`, commentData);
    return response.data;
  },

  /**
   * Update comment
   */
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/forum/comments/${commentId}`, commentData);
    return response.data;
  },

  /**
   * Delete comment
   */
  deleteComment: async (commentId) => {
    const response = await api.delete(`/forum/comments/${commentId}`);
    return response.data;
  },

  /**
   * Like/unlike thread
   */
  likeThread: async (threadId) => {
    const response = await api.post(`/forum/threads/${threadId}/like`);
    return response.data;
  },

  /**
   * Bookmark thread
   */
  bookmarkThread: async (threadId) => {
    const response = await api.post(`/forum/threads/${threadId}/bookmark`);
    return response.data;
  },

  /**
   * Get user's bookmarks
   */
  getBookmarks: async (params = {}) => {
    const response = await api.get('/forum/bookmarks', { params });
    return response.data;
  },

  /**
   * Mark thread as solved
   */
  markThreadSolved: async (threadId, commentId = null) => {
    const response = await api.put(`/forum/threads/${threadId}/solved`, { solutionCommentId: commentId });
    return response.data;
  },

  /**
   * Pin thread (moderator only)
   */
  pinThread: async (threadId) => {
    const response = await api.put(`/forum/threads/${threadId}/pin`);
    return response.data;
  },

  /**
   * Unpin thread (moderator only)
   */
  unpinThread: async (threadId) => {
    const response = await api.put(`/forum/threads/${threadId}/unpin`);
    return response.data;
  },

  /**
   * Lock thread (moderator only)
   */
  lockThread: async (threadId) => {
    const response = await api.put(`/forum/threads/${threadId}/lock`);
    return response.data;
  },

  /**
   * Unlock thread (moderator only)
   */
  unlockThread: async (threadId) => {
    const response = await api.put(`/forum/threads/${threadId}/unlock`);
    return response.data;
  },

  /**
   * Follow thread
   */
  followThread: async (threadId) => {
    const response = await api.post(`/forum/threads/${threadId}/follow`);
    return response.data;
  },

  /**
   * Unfollow thread
   */
  unfollowThread: async (threadId) => {
    const response = await api.delete(`/forum/threads/${threadId}/follow`);
    return response.data;
  },

  /**
   * Like/unlike comment
   */
  likeComment: async (commentId) => {
    const response = await api.post(`/forum/comments/${commentId}/like`);
    return response.data;
  },

  /**
   * Mark comment as solution
   */
  markCommentAsSolution: async (commentId) => {
    const response = await api.put(`/forum/comments/${commentId}/solution`);
    return response.data;
  },

  /**
   * Report content
   */
  reportContent: async (reportData) => {
    const response = await api.post('/forum/reports', reportData);
    return response.data;
  },

  /**
   * Search threads and comments
   */
  search: async (query, params = {}) => {
    const response = await api.get('/forum/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  /**
   * Get user's threads
   */
  getMyThreads: async (params = {}) => {
    const response = await api.get('/forum/threads/my', { params });
    return response.data;
  },

  /**
   * Get user's comments
   */
  getMyComments: async (params = {}) => {
    const response = await api.get('/forum/comments/my', { params });
    return response.data;
  },

  /**
   * Get forum statistics
   */
  getForumStats: async () => {
    const response = await api.get('/forum/statistics');
    return response.data;
  },

  /**
   * Get user reputation
   */
  getUserReputation: async (userId) => {
    const response = await api.get(`/forum/users/${userId}/reputation`);
    return response.data;
  },

  /**
   * Get trending threads
   */
  getTrendingThreads: async (params = {}) => {
    const response = await api.get('/forum/threads/trending', { params });
    return response.data;
  },

  /**
   * Get popular tags
   */
  getPopularTags: async (params = {}) => {
    const response = await api.get('/forum/tags/popular', { params });
    return response.data;
  }
};

export default forumAPI;