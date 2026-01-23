import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  // Join/leave rooms
  joinForum(forumId) {
    if (this.socket) {
      this.socket.emit('forum:join', forumId);
    }
  }

  leaveForum(forumId) {
    if (this.socket) {
      this.socket.emit('forum:leave', forumId);
    }
  }

  joinThread(threadId) {
    if (this.socket) {
      this.socket.emit('thread:join', threadId);
    }
  }

  leaveThread(threadId) {
    if (this.socket) {
      this.socket.emit('thread:leave', threadId);
    }
  }

  // Typing indicator
  emitTyping(threadId, isTyping) {
    if (this.socket) {
      this.socket.emit('thread:typing', { threadId, isTyping });
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Real-time event handlers
  onNewThread(callback) {
    this.on('thread:new', callback);
  }

  onNewAnswer(callback) {
    this.on('answer:new', callback);
  }

  onNewComment(callback) {
    this.on('comment:new', callback);
  }

  onReactionUpdated(callback) {
    this.on('reaction:updated', callback);
  }

  onAnswerAccepted(callback) {
    this.on('answer:accepted', callback);
  }

  onUserTyping(callback) {
    this.on('thread:user_typing', callback);
  }

  onModerationAction(callback) {
    this.on('moderation:action', callback);
  }

  onTrendingUpdated(callback) {
    this.on('trending:updated', callback);
  }

  onForumStatusChanged(callback) {
    this.on('forum:status_changed', callback);
  }

  onPollCreated(callback) {
    this.on('poll:created', callback);
  }

  onPollVoted(callback) {
    this.on('poll:voted', callback);
  }

  onNotification(callback) {
    this.on('notification:new', callback);
  }

  // Cleanup
  removeAllListeners(event) {
    if (this.socket && event) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
