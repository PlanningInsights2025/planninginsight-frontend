import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Send, Paperclip, Image, Smile, MoreVertical, Check, CheckCheck, Phone, Video, ArrowLeft, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import * as networkingApi from '@/services/api/networking';
import './MessagingCenter.css';

const MessagingCenter = ({ onClose, setUnreadCount, userId, currentUser = { name: 'You', avatar: '/api/placeholder/40/40' } }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  useEffect(() => {
    // Auto-select chat if userId is provided
    if (userId && chats.length > 0) {
      const chatToSelect = chats.find(chat => chat.id === userId);
      if (chatToSelect) {
        setSelectedChat(chatToSelect);
        fetchMessages(chatToSelect.id);
      }
    }
  }, [userId, chats]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await networkingApi.getConversations();
      if (response.success) {
        setChats(response.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Silently fail - empty state will be shown
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (recipientId) => {
    try {
      const response = await networkingApi.getMessages(recipientId);
      if (response.success) {
        setMessages(prev => ({
          ...prev,
          [recipientId]: response.messages || []
        }));
        
        // Mark messages as read
        await networkingApi.markMessagesAsRead(recipientId);
        
        // Update unread count in chat list
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === recipientId ? { ...chat, unread: 0 } : chat
          )
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Silently fail
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: 'You',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      read: false
    };

    // Optimistically add message to UI
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), optimisticMessage]
    }));

    const messageToSend = messageText;
    setMessageText('');

    try {
      const response = await networkingApi.sendMessage({
        recipientId: selectedChat.id,
        content: messageToSend,
        messageType: 'text'
      });

      if (response.success) {
        // Replace optimistic message with real one
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: [
            ...(prev[selectedChat.id] || []).filter(m => m.id !== optimisticMessage.id),
            response.message
          ]
        }));

        // Update conversation list
        await fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Silently fail
      
      // Remove optimistic message on error
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: (prev[selectedChat.id] || []).filter(m => m.id !== optimisticMessage.id)
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (!messages[chat.id]) {
      fetchMessages(chat.id);
    } else {
      // Mark as read
      networkingApi.markMessagesAsRead(chat.id);
      setChats(prevChats =>
        prevChats.map(c =>
          c.id === chat.id ? { ...c, unread: 0 } : c
        )
      );
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="messaging-center-overlay">
        <div className="messaging-center">
          <div className="messaging-header">
            <button className="back-btn" onClick={onClose}>
              <ArrowLeft size={20} />
            </button>
            <h2>Messages</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-center-overlay">
      <div className="messaging-center">
        {/* Header */}
        <div className="messaging-header">
          <button className="back-btn" onClick={onClose} title="Back to Networking Arena">
            <ArrowLeft size={20} />
          </button>
          <h2>Messages</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="messaging-body">
          {/* Chats List */}
          <div className="chats-list">
            <div className="chats-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="chats-items">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="chat-avatar-wrapper">
                      <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                      {chat.online && <span className="online-indicator"></span>}
                    </div>
                    <div className="chat-info">
                      <div className="chat-header">
                        <h4>{chat.name}</h4>
                        <span className="chat-time">{chat.timestamp}</span>
                      </div>
                      <div className="chat-preview">
                        <p className={chat.unread > 0 ? 'unread' : ''}>{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <span className="unread-badge">{chat.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-chats">
                  <MessageCircle size={48} />
                  <p>No conversations yet</p>
                  <span>Start connecting with people in your network</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="chat-window">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="chat-window-header">
                  <div className="chat-user-info">
                    <img src={selectedChat.avatar} alt={selectedChat.name} />
                    <div>
                      <h3>{selectedChat.name}</h3>
                      <span className={`status ${selectedChat.online ? 'online' : 'offline'}`}>
                        {selectedChat.online ? 'Active now' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="chat-actions">
                    <button className="chat-action-btn">
                      <Phone size={20} />
                    </button>
                    <button className="chat-action-btn">
                      <Video size={20} />
                    </button>
                    <button className="chat-action-btn">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="messages-container">
                  {(messages[selectedChat.id] && messages[selectedChat.id].length > 0) ? (
                    messages[selectedChat.id].map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.sent ? 'sent' : 'received'}`}
                      >
                        {!message.sent && (
                          <img src={selectedChat.avatar} alt={selectedChat.name} className="message-avatar" />
                        )}
                        <div className="message-bubble">
                          <div className="message-sender-name">
                            {message.sent ? currentUser.name : selectedChat.name}
                          </div>
                          <div className="message-content">
                            <p>{message.text}</p>
                            <div className="message-meta">
                              <span className="message-time">{message.timestamp}</span>
                              {message.sent && (
                                <span className="message-status">
                                  {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {message.sent && (
                          <img src={currentUser.avatar} alt={currentUser.name} className="message-avatar" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-messages">
                      <MessageCircle size={64} />
                      <p>No messages yet</p>
                      <span>Send a message to start the conversation</span>
                    </div>
                  )}
                  {isTyping && (
                    <div className="typing-indicator">
                      <img src={selectedChat.avatar} alt="" className="message-avatar" />
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="message-input-container">
                  <button className="input-action-btn">
                    <Paperclip size={20} />
                  </button>
                  <button className="input-action-btn">
                    <Image size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="input-action-btn">
                    <Smile size={20} />
                  </button>
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingCenter;
