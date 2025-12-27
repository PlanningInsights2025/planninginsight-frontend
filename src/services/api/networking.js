import api from './api'

/**
 * Networking API Service
 * Handles all networking-related API calls including connections, stats, and recommendations
 */

/**
 * Get user's connection statistics
 */
export const getConnectionStats = async () => {
  try {
    const response = await api.get('/networking/connections/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching connection stats:', error)
    // Return mock data as fallback
    return {
      connections: 0,
      pendingRequests: 0,
      sentRequests: 0
    }
  }
}

/**
 * Get networking statistics (groups, events, messages)
 */
export const getNetworkingStats = async () => {
  try {
    const response = await api.get('/networking/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching networking stats:', error)
    // Return mock data as fallback
    return {
      groups: 0,
      upcomingEvents: 0,
      unreadMessages: 0
    }
  }
}

/**
 * Get all connections
 */
export const getConnections = async (filters = {}) => {
  try {
    const response = await api.get('/networking/connections', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching connections:', error)
    throw error
  }
}

/**
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
 * Send connection request
 */
export const sendConnectionRequest = async (userId) => {
  try {
    const response = await api.post(`/networking/connections/request/${userId}`)
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
    const response = await api.put(`/networking/connections/accept/${requestId}`)
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
    const response = await api.put(`/networking/connections/reject/${requestId}`)
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
 * Join a group
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
 * Leave a group
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
 * Get networking events
 */
export const getEvents = async (filters = {}) => {
  try {
    const response = await api.get('/networking/events', { params: filters })
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
    console.error('Error RSVP to event:', error)
    throw error
  }
}

/**
 * Get unread messages count
 */
export const getUnreadMessagesCount = async () => {
  try {
    const response = await api.get('/networking/messages/unread/count')
    return response.data
  } catch (error) {
    console.error('Error fetching unread messages count:', error)
    return { count: 0 }
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
