import api from './api'

/**
 * Networking API Service
 * Handles all networking-related API calls including connections, groups, events, etc.
 */

/**
 * Get connection statistics
 */
export const getConnectionStats = async () => {
  try {
    const response = await api.get('/networking/connections/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching connection stats:', error)
    return {
      success: true,
      stats: {
        connections: 0,
        pendingRequests: 0,
        sentRequests: 0
      }
    }
  }
}

/**
 * Get all networking statistics
 */
export const getAllNetworkingStats = async () => {
  try {
    const response = await api.get('/networking/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching networking stats:', error)
    return {
      success: true,
      stats: {
        groups: 0,
        upcomingEvents: 0,
        unreadMessages: 0
      }
    }
  }
}

/**
 * Get unread notifications count
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await api.get('/networking/notifications/unread/count')
    return response.data
  } catch (error) {
    console.error('Error fetching unread notifications:', error)
    return {
      success: true,
      count: 0
    }
  }
}

/**
 * Get all connections
 */
export const getConnections = async () => {
  try {
    const response = await api.get('/networking/connections')
    return response.data
  } catch (error) {
    console.error('Error fetching connections:', error)
    throw error
  }
}

/**
 * Send connection request
 */
export const sendConnectionRequest = async (userId) => {
  try {
    const response = await api.post('/networking/connections/request', { userId })
    return response.data
  } catch (error) {
    console.error('Error sending connection request:', error)
    throw error
  }
}

/**
 * Accept connection request
 */
export const acceptConnectionRequest = async (requestId) => {
  try {
    const response = await api.post(`/networking/connections/accept/${requestId}`)
    return response.data
  } catch (error) {
    console.error('Error accepting connection request:', error)
    throw error
  }
}

/**
 * Reject connection request
 */
export const rejectConnectionRequest = async (requestId) => {
  try {
    const response = await api.post(`/networking/connections/reject/${requestId}`)
    return response.data
  } catch (error) {
    console.error('Error rejecting connection request:', error)
    throw error
  }
}

/**
 * Remove connection
 */
export const removeConnection = async (connectionId) => {
  try {
    const response = await api.delete(`/networking/connections/${connectionId}`)
    return response.data
  } catch (error) {
    console.error('Error removing connection:', error)
    throw error
  }
}

/**
 * Get groups
 */
export const getGroups = async () => {
  try {
    const response = await api.get('/networking/groups')
    return response.data
  } catch (error) {
    console.error('Error fetching groups:', error)
    throw error
  }
}

/**
 * Join group
 */
export const joinGroup = async (groupId) => {
  try {
    const response = await api.post(`/networking/groups/${groupId}/join`)
    return response.data
  } catch (error) {
    console.error('Error joining group:', error)
    throw error
  }
}

/**
 * Leave group
 */
export const leaveGroup = async (groupId) => {
  try {
    const response = await api.post(`/networking/groups/${groupId}/leave`)
    return response.data
  } catch (error) {
    console.error('Error leaving group:', error)
    throw error
  }
}

/**
 * Get events
 */
export const getEvents = async () => {
  try {
    const response = await api.get('/networking/events')
    return response.data
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

/**
 * RSVP to event
 */
export const rsvpEvent = async (eventId, status) => {
  try {
    const response = await api.post(`/networking/events/${eventId}/rsvp`, { status })
    return response.data
  } catch (error) {
    console.error('Error RSVPing to event:', error)
    throw error
  }
}

/**
 * Search users
 */
export const searchUsers = async (query) => {
  try {
    const response = await api.get('/networking/search/users', { params: { q: query } })
    return response.data
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}

/**
 * Get notifications
 */
export const getNotifications = async (filter = 'all', limit = 50, page = 1) => {
  try {
    const response = await api.get('/networking/notifications', {
      params: { filter, limit, page }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/networking/notifications/mark-all-read')
    return response.data
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/networking/notifications/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Get conversations
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/networking/messages/conversations')
    return response.data
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }
}

/**
 * Get messages
 */
export const getMessages = async (recipientId) => {
  try {
    const response = await api.get(`/networking/messages/${recipientId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (recipientId) => {
  try {
    const response = await api.post(`/networking/messages/${recipientId}/read`)
    return response.data
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}

/**
 * Send message
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/networking/messages', messageData)
    return response.data
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

/**
 * Get all jobs
 */
export const getAllJobs = async (filters = {}) => {
  try {
    const response = await api.get('/networking/jobs', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

/**
 * Get my applications
 */
export const getMyApplications = async () => {
  try {
    const response = await api.get('/networking/jobs/applications')
    return response.data
  } catch (error) {
    console.error('Error fetching applications:', error)
    throw error
  }
}

/**
 * Get saved jobs
 */
export const getSavedJobs = async () => {
  try {
    const response = await api.get('/networking/jobs/saved')
    return response.data
  } catch (error) {
    console.error('Error fetching saved jobs:', error)
    throw error
  }
}

/**
 * Apply to job
 */
export const applyToJob = async (jobId, applicationData) => {
  try {
    const response = await api.post(`/networking/jobs/${jobId}/apply`, applicationData)
    return response.data
  } catch (error) {
    console.error('Error applying to job:', error)
    throw error
  }
}

/**
 * Toggle save job
 */
export const toggleSaveJob = async (jobId) => {
  try {
    const response = await api.post(`/networking/jobs/${jobId}/toggle-save`)
    return response.data
  } catch (error) {
    console.error('Error toggling save job:', error)
    throw error
  }
}

/**
 * Get my groups
 */
export const getMyGroups = async () => {
  try {
    const response = await api.get('/networking/groups/my-groups')
    return response.data
  } catch (error) {
    console.error('Error fetching my groups:', error)
    throw error
  }
}

/**
 * Discover groups
 */
export const discoverGroups = async () => {
  try {
    const response = await api.get('/networking/groups/discover')
    return response.data
  } catch (error) {
    console.error('Error fetching discover groups:', error)
    throw error
  }
}

/**
 * Create group
 */
export const createGroup = async (groupData) => {
  try {
    const response = await api.post('/networking/groups', groupData)
    return response.data
  } catch (error) {
    console.error('Error creating group:', error)
    throw error
  }
}

/**
 * Get my events
 */
export const getMyEvents = async () => {
  try {
    const response = await api.get('/networking/events/my-events')
    return response.data
  } catch (error) {
    console.error('Error fetching my events:', error)
    throw error
  }
}

/**
 * Get upcoming events
 */
export const getUpcomingEvents = async () => {
  try {
    const response = await api.get('/networking/events/upcoming')
    return response.data
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    throw error
  }
}

/**
 * Create event
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/networking/events', eventData)
    return response.data
  } catch (error) {
    console.error('Error creating event:', error)
    throw error
  }
}

