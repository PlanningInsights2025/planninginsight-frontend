import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api')
  .replace(/\/api\/?$/, '');

/**
 * Real-time hook for article interactions via Socket.io
 *
 * @param {string} articleId - The article's MongoDB _id
 * @returns {{
 *   liveStats: { likesCount, dislikesCount, userLiked, userDisliked } | null,
 *   newComment: object | null,
 *   deletedCommentId: string | null,
 *   connected: boolean
 * }}
 */
const useArticleSocket = (articleId) => {
  const socketRef = useRef(null);
  const [liveStats, setLiveStats] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [deletedCommentId, setDeletedCommentId] = useState(null);
  const [connected, setConnected] = useState(false);

  const getToken = useCallback(() => {
    return localStorage.getItem('authToken') || localStorage.getItem('adminToken') || null;
  }, []);

  useEffect(() => {
    if (!articleId) return;

    const token = getToken();

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : {},
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('article:join', articleId);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      // Silently handle — article page still works without real-time
      console.warn('Article socket connection error:', err.message);
    });

    // Real-time like/dislike stats
    socket.on('article:stats', (payload) => {
      setLiveStats(payload);
    });

    // Real-time new comment
    socket.on('article:comment_new', ({ comment }) => {
      setNewComment(comment);
    });

    // Real-time comment deletion
    socket.on('article:comment_deleted', ({ commentId }) => {
      setDeletedCommentId(commentId);
    });

    return () => {
      socket.emit('article:leave', articleId);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [articleId, getToken]);

  return { liveStats, newComment, deletedCommentId, connected };
};

export default useArticleSocket;
