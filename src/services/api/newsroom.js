import api from './api';

/**
 * Newsroom API Service
 * Handles all newsroom-related API calls including articles, blogs, and user submissions
 */
export const newsroomAPI = {
  /**
   * Get all articles with optional filtering
   */
  getArticles: async (params = {}) => {
    const response = await api.get('/newsroom/articles', { params });
    return response.data;
  },

  /**
   * Get article by ID
   */
  getArticle: async (articleId) => {
    const response = await api.get(`/newsroom/articles/${articleId}`);
    return response.data;
  },

  /**
   * Create new article
   */
  createArticle: async (articleData) => {
    const formData = new FormData();
    
    // Append basic data
    Object.keys(articleData).forEach(key => {
      if (key === 'tags' || key === 'coAuthors') {
        formData.append(key, JSON.stringify(articleData[key]));
      } else if (key === 'featuredImage' && articleData[key]) {
        formData.append('featuredImage', articleData[key]);
      } else {
        formData.append(key, articleData[key]);
      }
    });

    const response = await api.post('/newsroom/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update article
   */
  updateArticle: async (articleId, articleData) => {
    const formData = new FormData();
    
    Object.keys(articleData).forEach(key => {
      if (key === 'tags' || key === 'coAuthors') {
        formData.append(key, JSON.stringify(articleData[key]));
      } else if (key === 'featuredImage' && articleData[key]) {
        formData.append('featuredImage', articleData[key]);
      } else {
        formData.append(key, articleData[key]);
      }
    });

    const response = await api.put(`/newsroom/articles/${articleId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete article
   */
  deleteArticle: async (articleId) => {
    const response = await api.delete(`/newsroom/articles/${articleId}`);
    return response.data;
  },

  /**
   * Get user's articles
   */
  getMyArticles: async (params = {}) => {
    const response = await api.get('/newsroom/articles/my', { params });
    return response.data;
  },

  /**
   * Like/unlike article
   */
  likeArticle: async (articleId) => {
    const response = await api.post(`/newsroom/articles/${articleId}/like`);
    return response.data;
  },

  /**
   * Bookmark article
   */
  bookmarkArticle: async (articleId) => {
    const response = await api.post(`/newsroom/articles/${articleId}/bookmark`);
    return response.data;
  },

  /**
   * Get user's bookmarks
   */
  getBookmarks: async (params = {}) => {
    const response = await api.get('/newsroom/bookmarks', { params });
    return response.data;
  },

  /**
   * Get article comments
   */
  getComments: async (articleId, params = {}) => {
    const response = await api.get(`/newsroom/articles/${articleId}/comments`, { params });
    return response.data;
  },

  /**
   * Add comment to article
   */
  addComment: async (articleId, commentData) => {
    const response = await api.post(`/newsroom/articles/${articleId}/comments`, commentData);
    return response.data;
  },

  /**
   * Update comment
   */
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/newsroom/comments/${commentId}`, commentData);
    return response.data;
  },

  /**
   * Delete comment
   */
  deleteComment: async (commentId) => {
    const response = await api.delete(`/newsroom/comments/${commentId}`);
    return response.data;
  },

  /**
   * Like/unlike comment
   */
  likeComment: async (commentId) => {
    const response = await api.post(`/newsroom/comments/${commentId}/like`);
    return response.data;
  },

  /**
   * Report content
   */
  reportContent: async (reportData) => {
    const response = await api.post('/newsroom/reports', reportData);
    return response.data;
  },

  /**
   * Get categories
   */
  getCategories: async () => {
    const response = await api.get('/newsroom/categories');
    return response.data;
  },

  /**
   * Get trending articles
   */
  getTrendingArticles: async (params = {}) => {
    const response = await api.get('/newsroom/articles/trending', { params });
    return response.data;
  },

  /**
   * Search articles
   */
  searchArticles: async (query, params = {}) => {
    const response = await api.get('/newsroom/articles/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  /**
   * Get author profile
   */
  getAuthorProfile: async (authorId) => {
    const response = await api.get(`/newsroom/authors/${authorId}`);
    return response.data;
  },

  /**
   * Follow author
   */
  followAuthor: async (authorId) => {
    const response = await api.post(`/newsroom/authors/${authorId}/follow`);
    return response.data;
  },

  /**
   * Unfollow author
   */
  unfollowAuthor: async (authorId) => {
    const response = await api.delete(`/newsroom/authors/${authorId}/follow`);
    return response.data;
  },

  /**
   * Get newsletter subscriptions
   */
  getNewsletterSubscriptions: async () => {
    const response = await api.get('/newsroom/newsletter/subscriptions');
    return response.data;
  },

  /**
   * Subscribe to newsletter
   */
  subscribeToNewsletter: async (email) => {
    const response = await api.post('/newsroom/newsletter/subscribe', { email });
    return response.data;
  },

  /**
   * Unsubscribe from newsletter
   */
  unsubscribeFromNewsletter: async (subscriptionId) => {
    const response = await api.delete(`/newsroom/newsletter/subscribe/${subscriptionId}`);
    return response.data;
  },

  /**
   * Get content statistics (for authors)
   */
  getContentStats: async (params = {}) => {
    const response = await api.get('/newsroom/analytics/content-stats', { params });
    return response.data;
  },

  /**
   * Get reading history
   */
  getReadingHistory: async (params = {}) => {
    const response = await api.get('/newsroom/history', { params });
    return response.data;
  },

  /**
   * Clear reading history
   */
  clearReadingHistory: async () => {
    const response = await api.delete('/newsroom/history');
    return response.data;
  }
};

export default newsroomAPI;