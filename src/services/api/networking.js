import api from './api'

/**
 * Networking API Service
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
 * Handles all networking-related API calls including connections, groups, events, etc.
 */

/**
 * Get connection statistics
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
 * Handles all networking-related API calls including connections, stats, and recommendations
 */

/**
 * Get user's connection statistics
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
 */
export const getConnectionStats = async () => {
  try {
    const response = await api.get('/networking/connections/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching connection stats:', error)
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    return {
      success: true,
      stats: {
        connections: 0,
        pendingRequests: 0,
        sentRequests: 0
      }
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    // Return mock data as fallback
    return {
      connections: 0,
      pendingRequests: 0,
      sentRequests: 0
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    }
  }
}

/**
<<<<<<< HEAD
 * Get all networking statistics
 */
export const getAllNetworkingStats = async () => {
=======
<<<<<<< HEAD
 * Get all networking statistics
 */
export const getAllNetworkingStats = async () => {
=======
<<<<<<< HEAD
 * Get all networking statistics
 */
export const getAllNetworkingStats = async () => {
=======
<<<<<<< HEAD
 * Get all networking statistics
 */
export const getAllNetworkingStats = async () => {
=======
 * Get networking statistics (groups, events, messages)
 */
export const getNetworkingStats = async () => {
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
  try {
    const response = await api.get('/networking/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching networking stats:', error)
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    // Return mock data as fallback
    return {
      groups: 0,
      upcomingEvents: 0,
      unreadMessages: 0
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    }
  }
}

/**
 * Get all connections
 */
<<<<<<< HEAD
export const getConnections = async () => {
  try {
    const response = await api.get('/networking/connections')
=======
<<<<<<< HEAD
export const getConnections = async () => {
  try {
    const response = await api.get('/networking/connections')
=======
<<<<<<< HEAD
export const getConnections = async () => {
  try {
    const response = await api.get('/networking/connections')
=======
<<<<<<< HEAD
export const getConnections = async () => {
  try {
    const response = await api.get('/networking/connections')
=======
export const getConnections = async (filters = {}) => {
  try {
    const response = await api.get('/networking/connections', { params: filters })
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    return response.data
  } catch (error) {
    console.error('Error fetching connections:', error)
    throw error
  }
}

/**
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
 * Get pending connection requests
 */
export const getPendingRequests = async () => {
  try {
    const response = await api.get('/networking/connections/pending')
    return response.data
  } catch (error) {
    console.error('Error fetching pending requests:', error)
    throw error
  }
}

/**
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
 * Send connection request
 */
export const sendConnectionRequest = async (userId) => {
  try {
<<<<<<< HEAD
    const response = await api.post('/networking/connections/request', { userId })
=======
<<<<<<< HEAD
    const response = await api.post('/networking/connections/request', { userId })
=======
<<<<<<< HEAD
    const response = await api.post('/networking/connections/request', { userId })
=======
<<<<<<< HEAD
    const response = await api.post('/networking/connections/request', { userId })
=======
    const response = await api.post(`/networking/connections/request/${userId}`)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/accept/${requestId}`)
=======
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/accept/${requestId}`)
=======
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/accept/${requestId}`)
=======
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/accept/${requestId}`)
=======
    const response = await api.put(`/networking/connections/accept/${requestId}`)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/reject/${requestId}`)
=======
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/reject/${requestId}`)
=======
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/reject/${requestId}`)
=======
<<<<<<< HEAD
    const response = await api.post(`/networking/connections/reject/${requestId}`)
=======
    const response = await api.put(`/networking/connections/reject/${requestId}`)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
 * Get groups
=======
<<<<<<< HEAD
 * Get groups
=======
<<<<<<< HEAD
 * Get groups
=======
<<<<<<< HEAD
 * Get groups
=======
 * Search for professionals
 */
export const searchProfessionals = async (searchParams) => {
  try {
    const response = await api.get('/networking/search', { params: searchParams })
    return response.data
  } catch (error) {
    console.error('Error searching professionals:', error)
    throw error
  }
}

/**
 * Get recommended connections
 */
export const getRecommendedConnections = async () => {
  try {
    const response = await api.get('/networking/recommendations')
    return response.data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }
}

/**
 * Get user groups
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
 * Join group
=======
<<<<<<< HEAD
 * Join group
=======
<<<<<<< HEAD
 * Join group
=======
<<<<<<< HEAD
 * Join group
=======
 * Join a group
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
 * Leave group
=======
<<<<<<< HEAD
 * Leave group
=======
<<<<<<< HEAD
 * Leave group
=======
<<<<<<< HEAD
 * Leave group
=======
 * Leave a group
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
 * Get events
 */
export const getEvents = async () => {
  try {
    const response = await api.get('/networking/events')
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
 * Get networking events
 */
export const getEvents = async (filters = {}) => {
  try {
    const response = await api.get('/networking/events', { params: filters })
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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
<<<<<<< HEAD
    console.error('Error RSVPing to event:', error)
=======
<<<<<<< HEAD
    console.error('Error RSVPing to event:', error)
=======
<<<<<<< HEAD
    console.error('Error RSVPing to event:', error)
=======
<<<<<<< HEAD
    console.error('Error RSVPing to event:', error)
=======
    console.error('Error RSVP to event:', error)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
    throw error
  }
}

/**
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
 * Search users
 */
export const searchUsers = async (query) => {
  try {
    const response = await api.get('/networking/search/users', { params: { q: query } })
    return response.data
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
 * Get unread messages count
 */
export const getUnreadMessagesCount = async () => {
  try {
    const response = await api.get('/networking/messages/unread/count')
    return response.data
  } catch (error) {
    console.error('Error fetching unread messages count:', error)
    return { count: 0 }
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
  }
}

/**
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
 * Get unread notifications count
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await api.get('/networking/notifications/unread/count')
    return response.data
  } catch (error) {
    console.error('Error fetching unread notifications count:', error)
    return { count: 0 }
  }
}

export default {
  getConnectionStats,
  getNetworkingStats,
  getConnections,
  getPendingRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  searchProfessionals,
  getRecommendedConnections,
  getGroups,
  joinGroup,
  leaveGroup,
  getEvents,
  rsvpEvent,
  getUnreadMessagesCount,
  getUnreadNotificationsCount
}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
>>>>>>> d407dac660c41680e4e8832e1966544b3e5b6249
