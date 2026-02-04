import api from './api';

/**
 * Admin API Service
 * Handles all admin-related API calls including user management, moderation, and analytics
 */

export const adminAPI = {
  /**
   * Get all users with pagination and filtering
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUser: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Bulk update users
   */
  bulkUpdateUsers: async (userIds, updates) => {
    const response = await api.post('/admin/users/bulk-update', {
      userIds,
      updates
    });
    return response.data;
  },

  /**
   * Get platform statistics
   */
  getPlatformStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  /**
   * Get moderation queue
   */
  getModerationQueue: async (params = {}) => {
    const response = await api.get('/admin/moderation', { params });
    return response.data;
  },

  /**
   * Moderate content
   */
  moderateContent: async (contentId, action, reason = '') => {
    const response = await api.post(`/admin/moderation/${contentId}`, {
      action,
      reason
    });
    return response.data;
  },

  /**
   * Bulk moderate content
   */
  bulkModerate: async (contentIds, action, reason = '') => {
    const response = await api.post('/admin/moderation/bulk', {
      contentIds,
      action,
      reason
    });
    return response.data;
  },

  /**
   * Get flagged content
   */
  getFlaggedContent: async (params = {}) => {
    const response = await api.get('/admin/flagged-content', { params });
    return response.data;
  },

  /**
   * Resolve flag
   */
  resolveFlag: async (flagId, resolution) => {
    const response = await api.post(`/admin/flags/${flagId}/resolve`, resolution);
    return response.data;
  },

  /**
   * Get analytics data
   */
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },

  /**
   * Export analytics data
   */
  exportAnalytics: async (format = 'csv', params = {}) => {
    const response = await api.get('/admin/analytics/export', {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Get system health
   */
  getSystemHealth: async () => {
    const response = await api.get('/admin/system-health');
    return response.data;
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (params = {}) => {
    const response = await api.get('/admin/activities', { params });
    return response.data;
  },

  /**
   * Get user sessions
   */
  getUserSessions: async (params = {}) => {
    const response = await api.get('/admin/sessions', { params });
    return response.data;
  },

  /**
   * Terminate user session
   */
  terminateSession: async (sessionId) => {
    const response = await api.delete(`/admin/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Get email templates
   */
  getEmailTemplates: async () => {
    const response = await api.get('/admin/email-templates');
    return response.data;
  },

  /**
   * Update email template
   */
  updateEmailTemplate: async (templateId, templateData) => {
    const response = await api.put(`/admin/email-templates/${templateId}`, templateData);
    return response.data;
  },

  /**
   * Send broadcast email
   */
  sendBroadcastEmail: async (emailData) => {
    const response = await api.post('/admin/broadcast-email', emailData);
    return response.data;
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async () => {
    const response = await api.get('/admin/notification-settings');
    return response.data;
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (settings) => {
    const response = await api.put('/admin/notification-settings', settings);
    return response.data;
  },

  /**
   * Get API usage statistics
   */
  getApiUsage: async (params = {}) => {
    const response = await api.get('/admin/api-usage', { params });
    return response.data;
  },

  /**
   * Get error logs
   */
  getErrorLogs: async (params = {}) => {
    const response = await api.get('/admin/error-logs', { params });
    return response.data;
  },

  /**
   * Clear error logs
   */
  clearErrorLogs: async () => {
    const response = await api.delete('/admin/error-logs');
    return response.data;
  },

  /**
   * Get backup status
   */
  getBackupStatus: async () => {
    const response = await api.get('/admin/backups');
    return response.data;
  },

  /**
   * Create backup
   */
  createBackup: async () => {
    const response = await api.post('/admin/backups');
    return response.data;
  },

  /**
   * Restore from backup
   */
  restoreBackup: async (backupId) => {
    const response = await api.post(`/admin/backups/${backupId}/restore`);
    return response.data;
  },

  /**
   * Get system configuration
   */
  getSystemConfig: async () => {
    const response = await api.get('/admin/system-config');
    return response.data;
  },

  /**
   * Update system configuration
   */
  updateSystemConfig: async (config) => {
    const response = await api.put('/admin/system-config', config);
    return response.data;
  },

  /**
   * Clear cache
   */
  clearCache: async (cacheType = 'all') => {
    const response = await api.post('/admin/clear-cache', { cacheType });
    return response.data;
  },

  /**
   * Run maintenance tasks
   */
  runMaintenance: async (tasks = []) => {
    const response = await api.post('/admin/maintenance', { tasks });
    return response.data;
  },

  /**
   * Get audit logs
   */
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  /**
   * Export audit logs
   */
  exportAuditLogs: async (format = 'csv', params = {}) => {
    const response = await api.get('/admin/audit-logs/export', {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Get subscription analytics
   */
  getSubscriptionAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/subscriptions', { params });
    return response.data;
  },

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/revenue', { params });
    return response.data;
  },

  /**
   * Get user engagement metrics
   */
  getUserEngagement: async (params = {}) => {
    const response = await api.get('/admin/analytics/engagement', { params });
    return response.data;
  },

  /**
   * Get content performance
   */
  getContentPerformance: async (params = {}) => {
    const response = await api.get('/admin/analytics/content', { params });
    return response.data;
  },

  /**
   * Generate report
   */
  generateReport: async (reportType, params = {}) => {
    const response = await api.post('/admin/reports/generate', {
      reportType,
      params
    });
    return response.data;
  },

  /**
   * Download report
   */
  downloadReport: async (reportId, format = 'pdf') => {
    const response = await api.get(`/admin/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // ==================== PUBLISHING MANAGEMENT ====================
  
  /**
   * Create publishing requirement
   */
  createPublishingRequirement: async (requirementData) => {
    const response = await api.post('/admin/publishing-requirements', requirementData);
    return response.data;
  },

  /**
   * Get all publishing requirements
   */
  getAllPublishingRequirements: async (params = {}) => {
    const response = await api.get('/admin/publishing-requirements', { params });
    return response.data;
  },

  /**
   * Update publishing requirement
   */
  updatePublishingRequirement: async (requirementId, requirementData) => {
    const response = await api.patch(`/admin/publishing-requirements/${requirementId}`, requirementData);
    return response.data;
  },

  /**
   * Delete publishing requirement
   */
  deletePublishingRequirement: async (requirementId) => {
    const response = await api.delete(`/admin/publishing-requirements/${requirementId}`);
    return response.data;
  },

  /**
   * Get all manuscripts overview
   */
  getAllManuscriptsOverview: async (params = {}) => {
    const response = await api.get('/admin/manuscripts', { params });
    return response.data;
  },

  /**
   * Get manuscripts by requirement
   */
  getManuscriptsByRequirement: async (requirementId) => {
    const response = await api.get(`/admin/manuscripts/requirement/${requirementId}`);
    return response.data;
  },

  /**
   * Review manuscript
   */
  reviewManuscript: async (manuscriptId, reviewData) => {
    const response = await api.patch(`/admin/manuscripts/${manuscriptId}/review`, reviewData);
    return response.data;
  },

  /**
   * Delete manuscript
   */
  deleteManuscript: async (manuscriptId) => {
    const response = await api.delete(`/admin/manuscripts/${manuscriptId}`);
    return response.data;
  },

  /**
   * Get all research papers overview
   */
  getAllResearchPapersOverview: async (params = {}) => {
    const response = await api.get('/admin/research-papers', { params });
    return response.data;
  },

  // ==================== NEWSROOM MANAGEMENT ====================

  /**
   * Get all articles for admin (with pagination and filters)
   */
  getAllArticlesAdmin: async (params = {}) => {
    const response = await api.get('/admin/articles', { params });
    return response.data;
  },

  /**
   * Update article status (approve, reject, etc.)
   */
  updateArticleStatus: async (articleId, statusData) => {
    const response = await api.patch(`/admin/articles/${articleId}/status`, statusData);
    return response.data;
  },

  /**
   * Delete article (admin)
   */
  deleteArticleAdmin: async (articleId) => {
    const response = await api.delete(`/admin/articles/${articleId}`);
    return response.data;
  },

  // ==================== JOB PORTAL MANAGEMENT ====================

  /**
   * Get all jobs for admin
   */
  getAllJobsAdmin: async (params = {}) => {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  },

  /**
   * Update job status
   */
  updateJobStatus: async (jobId, statusData) => {
    const response = await api.patch(`/admin/jobs/${jobId}/status`, statusData);
    return response.data;
  },

  /**
   * Delete job (admin)
   */
  deleteJobAdmin: async (jobId) => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response.data;
  },

  // ==================== LEARNING CENTER MANAGEMENT ====================

  /**
   * Get all courses for admin
   */
  getAllCoursesAdmin: async (params = {}) => {
    const response = await api.get('/admin/courses', { params });
    return response.data;
  },

  /**
   * Update course status
   */
  updateCourseStatus: async (courseId, statusData) => {
    const response = await api.patch(`/admin/courses/${courseId}/status`, statusData);
    return response.data;
  },

  /**
   * Delete course (admin)
   */
  deleteCourseAdmin: async (courseId) => {
    const response = await api.delete(`/admin/courses/${courseId}`);
    return response.data;
  }
};

export default adminAPI;