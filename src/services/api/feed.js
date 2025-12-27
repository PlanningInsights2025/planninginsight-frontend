import api from './api'

/**
 * Feed API Service
 * Handles all feed-related API calls including posts, comments, likes, and shares
 */

/**
 * Get feed posts
 */
export const getFeed = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/feed', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
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

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post('/feed/posts', postData)
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
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
    throw error
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
    throw error
  }
}

/**
 * Unlike a post
 */
export const unlikePost = async (postId) => {
  try {
    const response = await api.delete(`/feed/posts/${postId}/like`)
    return response.data
  } catch (error) {
    console.error('Error unliking post:', error)
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
    console.error('Error fetching comments:', error)
    throw error
  }
}

/**
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

/**
 * Vote on a poll
 */
export const voteOnPoll = async (postId, optionIndex) => {
  try {
    const response = await api.post(`/feed/posts/${postId}/poll/vote`, { optionIndex })
    return response.data
  } catch (error) {
    console.error('Error voting on poll:', error)
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
