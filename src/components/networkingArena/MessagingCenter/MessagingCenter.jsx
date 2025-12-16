import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Send, Paperclip, Image, Smile, MoreVertical, Check, CheckCheck, Phone, Video, ArrowLeft } from 'lucide-react';
import './MessagingCenter.css';

const MessagingCenter = ({ onClose, setUnreadCount }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [chats] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Thanks for the recommendation!',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'When can we schedule a call?',
      timestamp: '15m ago',
      unread: 1,
      online: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Check out this article',
      timestamp: '1h ago',
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Great meeting you!',
      timestamp: '3h ago',
      unread: 2,
      online: false
    }
  ]);

  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'Sarah Johnson', text: 'Hey! How are you doing?', timestamp: '10:30 AM', sent: false, read: true },
      { id: 2, sender: 'You', text: 'Hi Sarah! I\'m doing great, thanks!', timestamp: '10:32 AM', sent: true, read: true },
      { id: 3, sender: 'Sarah Johnson', text: 'I wanted to ask about your recommendation', timestamp: '10:33 AM', sent: false, read: true },
      { id: 4, sender: 'You', text: 'Of course! What would you like to know?', timestamp: '10:35 AM', sent: true, read: true },
      { id: 5, sender: 'Sarah Johnson', text: 'Thanks for the recommendation!', timestamp: '10:36 AM', sent: false, read: false }
    ],
    2: [
      { id: 1, sender: 'Michael Chen', text: 'Hi! I saw your profile', timestamp: '9:15 AM', sent: false, read: true },
      { id: 2, sender: 'You', text: 'Hello Michael! Thanks for reaching out', timestamp: '9:20 AM', sent: true, read: true },
      { id: 3, sender: 'Michael Chen', text: 'When can we schedule a call?', timestamp: '9:45 AM', sent: false, read: false }
    ]
  });

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: messages[selectedChat.id].length + 1,
      sender: 'You',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...prev[selectedChat.id], newMessage]
    }));

    setMessageText('');

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        handleBotResponse(messageText);
        setIsTyping(false);
      }, 2000);
    }, 500);
  };

  const handleBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let responseText = '';

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      responseText = 'Hello! Nice to hear from you! How can I help you today?';
    } else if (lowerMessage.includes('how are you')) {
      responseText = 'I\'m doing great, thank you for asking! How about you?';
    } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      responseText = 'You\'re welcome! Happy to help anytime!';
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      responseText = 'Goodbye! Have a great day! Feel free to reach out anytime.';
    } else if (lowerMessage.includes('help')) {
      responseText = 'Sure! I\'m here to help. What do you need assistance with?';
    } else if (lowerMessage.includes('call') || lowerMessage.includes('meeting')) {
      responseText = 'I\'d be happy to schedule a call! What time works best for you?';
    } else if (lowerMessage.includes('job') || lowerMessage.includes('opportunity')) {
      responseText = 'That sounds interesting! Tell me more about the opportunity.';
    } else if (lowerMessage.includes('connect') || lowerMessage.includes('network')) {
      responseText = 'I\'d love to connect! Let\'s stay in touch and collaborate.';
    } else {
      responseText = 'That\'s interesting! Tell me more about it.';
    }

    const botMessage = {
      id: messages[selectedChat.id].length + 2,
      sender: selectedChat.name,
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: false,
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...prev[selectedChat.id], botMessage]
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(chat)}
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
              ))}
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
                  {messages[selectedChat.id]?.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sent ? 'sent' : 'received'}`}
                    >
                      {!message.sent && (
                        <img src={selectedChat.avatar} alt="" className="message-avatar" />
                      )}
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
                  ))}
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
