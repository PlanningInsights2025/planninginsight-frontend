import React from 'react';
import { Award, Crown, TrendingUp, Eye, MessageCircle, BarChart3, Zap, CheckCircle } from 'lucide-react';
import './PremiumFeatures.css';

const PremiumFeatures = () => {
  const premiumBenefits = [
    {
      icon: Eye,
      title: 'Profile Views Analytics',
      description: 'See who viewed your profile in the last 90 days with detailed demographics',
      status: 'active'
    },
    {
      icon: MessageCircle,
      title: 'InMail Credits',
      description: '5 InMail credits per month to reach anyone, even if you\'re not connected',
      status: 'active'
    },
    {
      icon: TrendingUp,
      title: 'Featured Profile',
      description: 'Your profile appears at the top of search results',
      status: 'active'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your post performance and audience demographics',
      status: 'active'
    },
    {
      icon: Award,
      title: 'Premium Badge',
      description: 'Stand out with a verified premium badge on your profile',
      status: 'active'
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: '24/7 premium customer support with faster response times',
      status: 'active'
    }
  ];

  const usageStats = {
    profileViews: {
      current: 342,
      previous: 287,
      change: '+19%'
    },
    inMailCredits: {
      used: 2,
      total: 5,
      remaining: 3
    },
    postAnalytics: {
      impressions: 5420,
      engagement: '4.2%'
    }
  };

  return (
    <div className="premium-features">
      {/* Header */}
      <div className="premium-header">
        <div className="header-content">
          <Crown size={32} className="premium-crown" />
          <div>
            <h2>Premium Membership</h2>
            <p>Unlock powerful tools to grow your professional network</p>
          </div>
        </div>
        <button className="manage-subscription-btn">
          Manage Subscription
        </button>
      </div>

      {/* Usage Stats */}
      <div className="usage-stats">
        <div className="stat-card">
          <div className="stat-icon views">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <h3>{usageStats.profileViews.current}</h3>
            <p>Profile Views (Last 30 days)</p>
            <span className="stat-change positive">
              {usageStats.profileViews.change} from previous period
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inmail">
            <MessageCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{usageStats.inMailCredits.remaining}/{usageStats.inMailCredits.total}</h3>
            <p>InMail Credits Remaining</p>
            <div className="credit-bar">
              <div 
                className="credit-fill"
                style={{ width: `${(usageStats.inMailCredits.remaining / usageStats.inMailCredits.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon analytics">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{usageStats.postAnalytics.impressions}</h3>
            <p>Post Impressions</p>
            <span className="stat-change positive">
              {usageStats.postAnalytics.engagement} engagement rate
            </span>
          </div>
        </div>
      </div>

      {/* Premium Benefits */}
      <div className="premium-benefits">
        <h3>Your Premium Benefits</h3>
        <div className="benefits-grid">
          {premiumBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  <Icon size={24} />
                </div>
                <div className="benefit-content">
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                  <div className="benefit-status">
                    <CheckCircle size={16} className="check-icon" />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Views Detail */}
      <div className="profile-views-section">
        <div className="section-header">
          <h3>
            <Eye size={20} />
            Who Viewed Your Profile
          </h3>
          <button className="btn-view-all">View All</button>
        </div>
        <div className="viewers-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="viewer-card">
              <img src={`/api/placeholder/50/50`} alt="Viewer" className="viewer-avatar" />
              <div className="viewer-info">
                <h4>Professional {i}</h4>
                <p className="viewer-title">Software Engineer at Tech Corp</p>
                <p className="view-time">{i} hours ago</p>
              </div>
              <button className="btn-connect">Connect</button>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="section-header">
          <h3>
            <BarChart3 size={20} />
            Performance Analytics
          </h3>
          <select className="time-range-select">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <div className="chart-placeholder">
          <BarChart3 size={48} />
          <p>Detailed performance analytics</p>
          <p className="chart-subtitle">Track your profile views, post engagement, and network growth</p>
        </div>
      </div>

      {/* Featured Content */}
      <div className="featured-content-section">
        <div className="section-header">
          <h3>
            <TrendingUp size={20} />
            Your Featured Content
          </h3>
        </div>
        <div className="featured-info">
          <p>Your profile and posts are being featured to increase visibility</p>
          <div className="featured-stats">
            <div className="featured-stat">
              <span className="stat-label">Featured Impressions</span>
              <span className="stat-value">+2,340</span>
            </div>
            <div className="featured-stat">
              <span className="stat-label">New Connections</span>
              <span className="stat-value">+42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;
