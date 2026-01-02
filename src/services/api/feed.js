import api from './api'

/**
 * Feed API Service
 * Handles all feed-related API calls including posts, likes, comments
 */

/**
 * Get feed posts
 */
export const getFeedPosts = async (options = {}) => {
  const { page = 1, limit = 10 } = options
  try {
    const response = await api.get('/feed', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching feed posts:', error)
    // Return mock data structure for development
    return {
      success: true,
      posts: [],
      pagination: {
        page: page,
        pages: 1,
        total: 0
      }
    }
  }
}

// Alias for getFeedPosts for compatibility
export const getFeed = getFeedPosts

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post('/feed/posts', postData)
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, message: 'Failed to create post' }
  }
}

/**
 * Update a post
 */
export const updatePost = async (postId, postData) => {
  try {
    const response = await api.put(`/feed/posts/${postId}`, postData)
    return response.data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/feed/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting post:', error)
    return { success: false, message: 'Failed to delete post' }
  }
}

/**
 * Like a post
 */
export const likePost = async (postId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/like`)
    return response.data
  } catch (error) {
    console.error('Error liking post:', error)
    return { success: false, message: 'Failed to like post' }
  }
}

/**
 * Unlike a post
 */
export const unlikePost = async (postId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/unlike`)
    return response.data
  } catch (error) {
    console.error('Error unliking post:', error)
    throw error
  }
}

/**
 * Comment on a post
 */
export const commentOnPost = async (postId, comment) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/comments`, { comment })
    return response.data
  } catch (error) {
    console.error('Error commenting on post:', error)
    throw error
  }
}

/**
 * Get post comments
 */
export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/feed/posts/${postId}/comments`)
    return response.data
  } catch (error) {
    console.error('Error fetching post comments:', error)
    return { success: true, comments: [] }
  }
}

/**
 * Delete a comment
 */
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await api.delete(`/feed/posts/${postId}/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

/**
 * Share a post
 */
export const sharePost = async (postId, shareData) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/share`, shareData)
    return response.data
  } catch (error) {
    console.error('Error sharing post:', error)
    throw error
  }
}

/**
 * Report a post
 */
export const reportPost = async (postId, reason) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/report`, { reason })
    return response.data
  } catch (error) {
    console.error('Error reporting post:', error)
    throw error
  }
}

/**
 * Get trending posts
 */
export const getTrendingPosts = async () => {
  try {
    const response = await api.get('/feed/trending')
    return response.data
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    throw error
  }
}

/**
 * Bookmark a post
 */
export const bookmarkPost = async (postId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/bookmark`)
    return response.data
  } catch (error) {
    console.error('Error bookmarking post:', error)
    throw error
  }
}

/**
 * Get comments (alias for getPostComments)
 */
export const getComments = getPostComments

/**
 * Add comment (alias for commentOnPost)
 */
export const addComment = commentOnPost

/**
 * Vote on a poll
 */
export const votePoll = async (postId, optionId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/poll/vote`, { optionId })
    return response.data
  } catch (error) {
    console.error('Error voting on poll:', error)
    throw error
  }
}

