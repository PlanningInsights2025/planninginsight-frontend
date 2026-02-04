import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Forum Thread API
export const forumThreadAPI = {
  // Create thread
  createThread: async (forumId, threadData) => {
    const response = await api.post(`/forum/${forumId}/threads`, threadData);
    return response.data;
  },

  // Get threads for a forum
  getThreads: async (forumId, params = {}) => {
    const response = await api.get(`/forum/${forumId}/threads`, { params });
    return response.data;
  },

  // Get single thread
  getThread: async (threadId) => {
    const response = await api.get(`/forum/threads/${threadId}`);
    return response.data;
  },

  // Vote on thread
  voteThread: async (threadId, voteType) => {
    const response = await api.post(`/forum/threads/${threadId}/vote`, { voteType });
    return response.data;
  },

  // Follow/unfollow thread
  toggleFollow: async (threadId) => {
    const response = await api.post(`/forum/threads/${threadId}/follow`);
    return response.data;
  },

  // Post answer
  createAnswer: async (threadId, answerData) => {
    const response = await api.post(`/forum/threads/${threadId}/answers`, answerData);
    return response.data;
  },

  // Vote on answer
  voteAnswer: async (answerId, voteType) => {
    const response = await api.post(`/forum/answers/${answerId}/vote`, { voteType });
    return response.data;
  },

  // Accept answer
  acceptAnswer: async (threadId, answerId) => {
    const response = await api.post(`/forum/threads/${threadId}/answers/${answerId}/accept`);
    return response.data;
  },

  // Add comment to answer
  addComment: async (answerId, commentData) => {
    const response = await api.post(`/forum/answers/${answerId}/comments`, commentData);
    return response.data;
  }
};

// Notification API
export const notificationAPI = {
  // Get notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

export default { forumThreadAPI, notificationAPI };
