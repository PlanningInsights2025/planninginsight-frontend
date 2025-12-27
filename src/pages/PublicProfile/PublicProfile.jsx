import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { userAPI } from '../../services/api/user'
import {
  MapPin,
  Mail,
  Phone,
  Share2,
  Download,
  Edit2,
  ChevronDown,
  BookOpen,
  Briefcase,
  FileText,
  MessageSquare,
  Users,
  Award,
  ArrowRight
} from 'lucide-react'
import Loader from '../../components/common/Loader/Loader'
import './PublicProfile.css'

/**
 * Public User Profile View
 * Displays user profile with stats, achievements, and experience
 */
const PublicProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - replace with API call
  const mockProfile = {
    id: 1,
    firstName: 'sneha',
    lastName: 'Shahane',
    uniqueCode: 'PLAN-20240115-0001',
    avatar: 'S',
    bio: 'Urban planning professional with passion for sustainable development',
    location: 'Mumbai, India',
    email: 'snehashahane26@gmail.com',
    phone: '+91 XXXXXXXXXX',
    profileCompletion: 85,
    stats: {
      articles: 5,
      courses: 3,
      jobsApplied: 12,
      forumPosts: 28,
      connections: 156
    },
    achievements: [
      {
        id: 1,
        title: 'Profile Completer',
        icon: Award,
        status: 'completed',
        date: 'Jan 2024'
      },
      {
        id: 2,
        title: 'First Course',
        icon: BookOpen,
        status: 'completed',
        date: 'Feb 2024'
      },
      {
        id: 3,
        title: 'Published Author',
        icon: FileText,
        status: 'pending',
        date: 'In Progress'
      }
    ],
    experience: [
      {
        id: 1,
        title: 'Senior Urban Planner',
        company: 'City Development Authority',
        duration: '2020 - Present',
        description: 'Leading urban development projects'
      },
      {
        id: 2,
        title: 'Urban Planning Specialist',
        company: 'Municipal Corporation',
        duration: '2018 - 2020',
        description: 'Sustainable urban development'
      }
    ]
  }

  useEffect(() => {
    // Load profile data
    setProfile(mockProfile)
    setLoading(false)
  }, [userId])

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="error-container">
        <h2>Profile not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="public-profile-page">
      {/* Profile Header */}
      <div className="profile-header-section">
        <div className="header-background"></div>
        
        <div className="container">
          <div className="header-content">
            {/* Profile Avatar */}
            <div className="avatar-section">
              <div className="avatar-circle">
                {profile.avatar}
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              <div className="profile-header-top">
                <div className="name-section">
                  <h1 className="profile-name">{profile.firstName} {profile.lastName}</h1>
                  <span className="unique-code">{profile.uniqueCode}</span>
                </div>
                <div className="header-actions">
                  <button className="action-btn" title="Share profile">
                    <Share2 size={20} />
                  </button>
                  <button className="action-btn" title="Download CV">
                    <Download size={20} />
                  </button>
                </div>
              </div>

              <p className="profile-bio">{profile.bio}</p>

              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>{profile.location}</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>{profile.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{profile.phone}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="btn btn-primary btn-large">
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container profile-container">
        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button
            className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-item ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Stats Section */}
          <div className="stats-section">
            <h2 className="section-title">Activity Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon articles-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profile.stats.articles}</div>
                  <div className="stat-label">Articles</div>
                </div>
                <ArrowRight size={18} className="stat-arrow" />
              </div>

              <div className="stat-card">
                <div className="stat-icon courses-icon">
                  <BookOpen size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profile.stats.courses}</div>
                  <div className="stat-label">Courses</div>
                </div>
                <ArrowRight size={18} className="stat-arrow" />
              </div>

              <div className="stat-card">
                <div className="stat-icon jobs-icon">
                  <Briefcase size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profile.stats.jobsApplied}</div>
                  <div className="stat-label">Jobs Applied</div>
                </div>
                <ArrowRight size={18} className="stat-arrow" />
              </div>

              <div className="stat-card">
                <div className="stat-icon forum-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profile.stats.forumPosts}</div>
                  <div className="stat-label">Forum Posts</div>
                </div>
                <ArrowRight size={18} className="stat-arrow" />
              </div>

              <div className="stat-card">
                <div className="stat-icon connections-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{profile.stats.connections}</div>
                  <div className="stat-label">Connections</div>
                </div>
                <ArrowRight size={18} className="stat-arrow" />
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="achievements-section">
            <h2 className="section-title">Achievements</h2>
            <div className="achievements-list">
              {profile.achievements.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <div key={achievement.id} className="achievement-card">
                    <div className={`achievement-icon ${achievement.status}`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="achievement-content">
                      <div className="achievement-title">{achievement.title}</div>
                      <div className="achievement-date">{achievement.date}</div>
                    </div>
                    <div className={`achievement-badge ${achievement.status}`}>
                      {achievement.status === 'completed' ? '✓' : '→'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        {activeTab === 'experience' && (
          <div className="experience-section">
            <h2 className="section-title">Professional Experience</h2>
            <div className="experience-list">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="experience-card">
                  <div className="experience-header">
                    <h3>{exp.title}</h3>
                    <span className="duration">{exp.duration}</span>
                  </div>
                  <div className="company">{exp.company}</div>
                  <p className="description">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProfile
