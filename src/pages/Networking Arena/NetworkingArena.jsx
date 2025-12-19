import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Video, Calendar, Briefcase, Award, TrendingUp, Search, Bell, Settings, ChevronUp } from 'lucide-react';
import './NetworkingArena.css';
import { useAuth } from '../../contexts/AuthContext';

// Import Components
import ProfileSection from '../../components/networkingArena/ProfileSection/ProfileSection';
import ConnectionsPanel from '../../components/networkingArena/ConnectionsPanel/ConnectionsPanel';
import MessagingCenter from '../../components/networkingArena/MessagingCenter/MessagingCenter';
import FeedSection from '../../components/networkingArena/FeedSection/FeedSection';
import GroupsPanel from '../../components/networkingArena/GroupsPanel/GroupsPanel';
import EventsSection from '../../components/networkingArena/EventsSection/EventsSection';
import JobPostings from '../../components/networkingArena/JobPostings/JobPostings';
import RecruiterDashboard from '../../components/networkingArena/RecruiterDashboard/RecruiterDashboard';
import NotificationCenter from '../../components/networkingArena/NotificationCenter/NotificationCenter';
import PremiumFeatures from '../../components/networkingArena/PremiumFeatures/PremiumFeatures';
import VideoCallModal from '../../components/networkingArena/VideoCallModal/VideoCallModal';
import AdvancedSearch from '../../components/networkingArena/AdvancedSearch/AdvancedSearch';

const NetworkingArena = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [showMessaging, setShowMessaging] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userRole, setUserRole] = useState('professional'); // professional, recruiter, premium
  const [unreadMessages, setUnreadMessages] = useState(5);
  const [unreadNotifications, setUnreadNotifications] = useState(12);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [messageUserId, setMessageUserId] = useState(null);
  
  // Current logged-in user data from auth context
  const currentUser = {
    name: user?.displayName || user?.firstName + ' ' + (user?.lastName || '') || 'User',
    avatar: user?.photoURL || '/api/placeholder/40/40'
  };

  useEffect(() => {
    // Initialize user data and settings
    document.title = 'Networking Arena - Planning Insights';
  }, []);

  useEffect(() => {
    // Track scroll position for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleOpenMessaging = (userId = null) => {
    console.log('Opening messaging center for user:', userId);
    setMessageUserId(userId);
    setShowMessaging(true);
    console.log('showMessaging state set to true');
  };

  const navigationTabs = [
    { id: 'feed', label: 'Feed', icon: TrendingUp },
    { id: 'connections', label: 'My Network', icon: Users },
    { id: 'groups', label: 'Groups', icon: MessageCircle },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
  ];

  if (userRole === 'recruiter') {
    navigationTabs.push({ id: 'recruiter', label: 'Recruiter Hub', icon: Award });
  }

  if (userRole === 'premium') {
    navigationTabs.push({ id: 'premium', label: 'Premium', icon: Award });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedSection userRole={userRole} currentUser={currentUser} />;
      case 'connections':
        return <ConnectionsPanel onOpenMessaging={handleOpenMessaging} />;
      case 'groups':
        return <GroupsPanel />;
      case 'events':
        return <EventsSection />;
      case 'jobs':
        return <JobPostings userRole={userRole} />;
      case 'recruiter':
        return <RecruiterDashboard onOpenMessaging={handleOpenMessaging} />;
      case 'premium':
        return <PremiumFeatures />;
      default:
        return <FeedSection userRole={userRole} />;
    }
  };

  return (
    <div className="networking-arena">
      {/* Top Navigation Bar */}
      <div className="networking-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <h1 className="arena-title">
              <Users className="title-icon" />
              Networking Arena
            </h1>
          </div>

          <div className="navbar-center">
            <button 
              className="search-trigger"
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
              <span>Search professionals, jobs, content...</span>
            </button>
          </div>

          <div className="navbar-right">
            <button className="nav-icon-btn">
              <Settings size={20} />
            </button>

            <div className="user-role-badge">
              {userRole === 'premium' && <Award size={16} className="premium-icon" />}
              {userRole === 'recruiter' && <Briefcase size={16} className="recruiter-icon" />}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="navigation-tabs">
        <div className="tabs-container">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="arena-container">
        {/* Left Sidebar - Profile Section */}
        <aside className="arena-sidebar left-sidebar">
          <ProfileSection userRole={userRole} setUserRole={setUserRole} />
        </aside>

        {/* Main Content */}
        <main className="arena-main-content">
          {renderContent()}
        </main>

        {/* Right Sidebar - Quick Access */}
        <aside className="arena-sidebar right-sidebar">
          <div className="quick-access-panel">
            <h3>Quick Access</h3>
            <div className="quick-links">
              <button onClick={() => setActiveTab('connections')}>
                <Users size={18} />
                <span>My Connections (234)</span>
              </button>
              <button onClick={() => setActiveTab('groups')}>
                <MessageCircle size={18} />
                <span>My Groups (12)</span>
              </button>
              <button onClick={() => setActiveTab('events')}>
                <Calendar size={18} />
                <span>Upcoming Events (5)</span>
              </button>
              <button onClick={() => setShowMessaging(true)}>
                <MessageCircle size={18} />
                <span>Messages ({unreadMessages})</span>
              </button>
            </div>
          </div>

          <div className="trending-topics">
            <h3>Trending Topics</h3>
            <div className="topic-tags">
              <span className="topic-tag">#AI</span>
              <span className="topic-tag">#RemoteWork</span>
              <span className="topic-tag">#Sustainability</span>
              <span className="topic-tag">#Innovation</span>
              <span className="topic-tag">#Leadership</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals and Overlays */}
      {showMessaging && (
        <MessagingCenter 
          onClose={() => {
            setShowMessaging(false);
            setMessageUserId(null);
          }}
          setUnreadCount={setUnreadMessages}
          userId={messageUserId}
          currentUser={currentUser}
        />
      )}

      {showNotifications && (
        <NotificationCenter 
          onClose={() => setShowNotifications(false)}
          setUnreadCount={setUnreadNotifications}
        />
      )}

      {showVideoCall && (
        <VideoCallModal 
          onClose={() => setShowVideoCall(false)}
        />
      )}

      {showSearch && (
        <AdvancedSearch 
          onClose={() => setShowSearch(false)}
          userRole={userRole}
          onOpenMessaging={handleOpenMessaging}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default NetworkingArena;
