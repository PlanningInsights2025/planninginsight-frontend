import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNotification } from '../../../contexts/NotificationContext';
import { useApi } from '../../../hooks/useApi';
import { learningAPI } from '../../../services/api/learning';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Star,
  Award
} from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import './InstructorDashboard.css';

/**
 * Instructor Dashboard Component
 * Provides instructors with tools to manage courses, students, and earnings
 */
const InstructorDashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // State management
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, students, earnings

  // API hooks
  const [fetchStatsApi] = useApi(learningAPI.getInstructorStats);
  const [fetchCoursesApi] = useApi(learningAPI.getInstructorCourses);
  const [deleteC ourseApi] = useApi(learningAPI.deleteCourse);

  /**
   * Load dashboard data
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, coursesData] = await Promise.all([
        fetchStatsApi({ showError: true }),
        fetchCoursesApi({ showError: true })
      ]);

      if (statsData) setStats(statsData);
      if (coursesData) setCourses(coursesData);
    } catch (error) {
      // Errors handled by useApi
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle course deletion
   */
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await deleteCourseApi(courseId, {
        successMessage: 'Course deleted successfully',
        showError: true
      });
      
      // Reload courses
      loadDashboardData();
    } catch (error) {
      // Error handled by useApi
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  /**
   * Render overview tab
   */
  const renderOverview = () => (
    <div className="overview-section">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon courses">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats?.totalCourses || 0}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon students">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats?.totalStudents || 0}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earnings">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats?.totalEarnings || 0)}</h3>
            <p>Total Earnings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rating">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats?.averageRating?.toFixed(1) || 'N/A'}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {stats?.recentActivities?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'enrollment' && <Users size={16} />}
                {activity.type === 'review' && <Star size={16} />}
                {activity.type === 'completion' && <Award size={16} />}
              </div>
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Render courses tab
   */
  const renderCourses = () => (
    <div className="courses-section">
      <div className="section-header">
        <h3>My Courses</h3>
        <button className="btn btn-primary">
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      <div className="courses-list">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-thumbnail">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="thumbnail-placeholder">
                  <BookOpen size={32} />
                </div>
              )}
            </div>

            <div className="course-info">
              <h4>{course.title}</h4>
              <div className="course-meta">
                <span><Users size={14} /> {course.enrollments} students</span>
                <span><Star size={14} /> {course.rating?.toFixed(1)}</span>
                <span><Clock size={14} /> {course.duration} hours</span>
              </div>
              <div className="course-status">
                <span className={`status-badge ${course.status}`}>
                  {course.status}
                </span>
              </div>
            </div>

            <div className="course-actions">
              <button className="action-btn">
                <Eye size={18} />
              </button>
              <button className="action-btn">
                <Edit size={18} />
              </button>
              <button 
                className="action-btn delete"
                onClick={() => handleDeleteCourse(course.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="instructor-dashboard-loading">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="instructor-dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1>Instructor Dashboard</h1>
            <p>Welcome back, {user?.firstName}!</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary">
              <Plus size={20} />
              Create Course
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'courses' && renderCourses()}
          {/* Add other tab contents as needed */}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
