import api from './api'

/**
 * Feed API Service
<<<<<<< HEAD
 * Handles all feed-related API calls including posts, likes, comments
=======
<<<<<<< HEAD
 * Handles all feed-related API calls including posts, likes, comments
=======
<<<<<<< HEAD
 * Handles all feed-related API calls including posts, likes, comments
=======
 * Handles all feed-related API calls including posts, comments, likes, and shares
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
 */

/**
 * Get feed posts
 */
<<<<<<< HEAD
export const getFeedPosts = async (options = {}) => {
  const { page = 1, limit = 10 } = options
=======
<<<<<<< HEAD
export const getFeedPosts = async (options = {}) => {
  const { page = 1, limit = 10 } = options
=======
<<<<<<< HEAD
export const getFeedPosts = async (options = {}) => {
  const { page = 1, limit = 10 } = options
=======
export const getFeed = async (page = 1, limit = 10) => {
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
  try {
    const response = await api.get('/feed', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
    console.error('Error fetching feed:', error)
    throw error
  }
}

/**
 * Get user's posts
 */
export const getUserPosts = async (userId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/feed/user/${userId}`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user posts:', error)
    throw error
  }
}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post('/feed/posts', postData)
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
<<<<<<< HEAD
    return { success: false, message: 'Failed to create post' }
=======
<<<<<<< HEAD
    return { success: false, message: 'Failed to create post' }
=======
<<<<<<< HEAD
    return { success: false, message: 'Failed to create post' }
=======
    throw error
  }
}

/**
 * Create post with media
 */
export const createPostWithMedia = async (postData, mediaFile) => {
  try {
    const formData = new FormData()
    formData.append('content', postData.content)
    formData.append('privacy', postData.privacy)
    formData.append('postType', postData.postType)
    
    if (mediaFile) {
      formData.append('media', mediaFile)
    }
    
    if (postData.pollOptions) {
      formData.append('pollOptions', JSON.stringify(postData.pollOptions))
    }
    
    if (postData.articleTitle) {
      formData.append('articleTitle', postData.articleTitle)
    }
    
    if (postData.articleLink) {
      formData.append('articleLink', postData.articleLink)
    }
    
    const response = await api.post('/feed/posts/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating post with media:', error)
    throw error
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
    return { success: false, message: 'Failed to delete post' }
=======
<<<<<<< HEAD
    return { success: false, message: 'Failed to delete post' }
=======
<<<<<<< HEAD
    return { success: false, message: 'Failed to delete post' }
=======
    throw error
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
    return { success: false, message: 'Failed to like post' }
=======
<<<<<<< HEAD
    return { success: false, message: 'Failed to like post' }
=======
<<<<<<< HEAD
    return { success: false, message: 'Failed to like post' }
=======
    throw error
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
  }
}

/**
 * Unlike a post
 */
export const unlikePost = async (postId) => {
  try {
<<<<<<< HEAD
    const response = await api.post(`/feed/posts/${postId}/unlike`)
=======
<<<<<<< HEAD
    const response = await api.post(`/feed/posts/${postId}/unlike`)
=======
<<<<<<< HEAD
    const response = await api.post(`/feed/posts/${postId}/unlike`)
=======
    const response = await api.delete(`/feed/posts/${postId}/like`)
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
    return response.data
  } catch (error) {
    console.error('Error unliking post:', error)
    throw error
  }
}

/**
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
 * Get post comments
 */
export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/feed/posts/${postId}/comments`)
    return response.data
  } catch (error) {
<<<<<<< HEAD
    console.error('Error fetching post comments:', error)
    return { success: true, comments: [] }
=======
<<<<<<< HEAD
    console.error('Error fetching post comments:', error)
    return { success: true, comments: [] }
=======
<<<<<<< HEAD
    console.error('Error fetching post comments:', error)
    return { success: true, comments: [] }
=======
    console.error('Error fetching comments:', error)
    throw error
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
  }
}

/**
<<<<<<< HEAD
 * Delete a comment
=======
<<<<<<< HEAD
 * Delete a comment
=======
<<<<<<< HEAD
 * Delete a comment
=======
 * Add comment to post
 */
export const addComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/comments`, commentData)
    return response.data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

/**
 * Update comment
 */
export const updateComment = async (postId, commentId, commentData) => {
  try {
    const response = await api.put(`/feed/posts/${postId}/comments/${commentId}`, commentData)
    return response.data
  } catch (error) {
    console.error('Error updating comment:', error)
    throw error
  }
}

/**
 * Delete comment
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
 * Like a comment
 */
export const likeComment = async (postId, commentId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/comments/${commentId}/like`)
    return response.data
  } catch (error) {
    console.error('Error liking comment:', error)
    throw error
  }
}

/**
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
 * Get comments (alias for getPostComments)
 */
export const getComments = getPostComments

/**
 * Add comment (alias for commentOnPost)
 */
export const addComment = commentOnPost
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
 * Remove bookmark from post
 */
export const removeBookmark = async (postId) => {
  try {
    const response = await api.delete(`/feed/posts/${postId}/bookmark`)
    return response.data
  } catch (error) {
    console.error('Error removing bookmark:', error)
    throw error
  }
}

/**
 * Get bookmarked posts
 */
export const getBookmarkedPosts = async () => {
  try {
    const response = await api.get('/feed/bookmarks')
    return response.data
  } catch (error) {
    console.error('Error fetching bookmarked posts:', error)
    throw error
  }
}

/**
 * Report a post
 */
export const reportPost = async (postId, reportData) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/report`, reportData)
    return response.data
  } catch (error) {
    console.error('Error reporting post:', error)
    throw error
  }
}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5

/**
 * Vote on a poll
 */
<<<<<<< HEAD
export const votePoll = async (postId, optionId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/poll/vote`, { optionId })
=======
<<<<<<< HEAD
export const votePoll = async (postId, optionId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/poll/vote`, { optionId })
=======
<<<<<<< HEAD
export const votePoll = async (postId, optionId) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/poll/vote`, { optionId })
=======
export const voteOnPoll = async (postId, optionIndex) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/poll/vote`, { optionIndex })
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
    return response.data
  } catch (error) {
    console.error('Error voting on poll:', error)
    throw error
  }
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
/**
 * Get trending posts
 */
export const getTrendingPosts = async () => {
  try {
    const response = await api.get('/feed/trending')
    return response.data
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return []
  }
}

/**
 * Get post by ID
 */
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/feed/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export default {
  getFeed,
  getUserPosts,
  createPost,
  createPostWithMedia,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  sharePost,
  bookmarkPost,
  removeBookmark,
  getBookmarkedPosts,
  reportPost,
  voteOnPoll,
  getTrendingPosts,
  getPostById
}
>>>>>>> c68411abd8537256a8e5805a7bcf8661696ac3cb
>>>>>>> 5de0f4e61380cd77865027fcd0dc92877a094607
>>>>>>> 6a23b3a0c7eb7babee234a87d16c0b1cb3c4acc5
