import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * User Context
 * Manages user-specific data and preferences
 */
const UserContext = createContext();

/**
 * Custom hook to access user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * User Provider Component
 * Manages user profile, preferences, and activity
 */
export const UserProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailDigest: true,
    theme: 'light'
  });
  const [savedItems, setSavedItems] = useState({
    jobs: [],
    courses: [],
    articles: []
  });

  /**
   * Load user profile and preferences
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  /**
   * Load user data from API or localStorage
   */
  const loadUserData = async () => {
    try {
      // Load preferences from localStorage
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }

      // Load saved items
      const savedJobsData = localStorage.getItem('savedJobs');
      const savedCoursesData = localStorage.getItem('savedCourses');
      const savedArticlesData = localStorage.getItem('savedArticles');

      setSavedItems({
        jobs: savedJobsData ? JSON.parse(savedJobsData) : [],
        courses: savedCoursesData ? JSON.parse(savedCoursesData) : [],
        articles: savedArticlesData ? JSON.parse(savedArticlesData) : []
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Update user preferences
   */
  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  /**
   * Save/unsave a job
   */
  const toggleSaveJob = (jobId) => {
    setSavedItems(prev => {
      const jobs = prev.jobs.includes(jobId)
        ? prev.jobs.filter(id => id !== jobId)
        : [...prev.jobs, jobId];
      
      localStorage.setItem('savedJobs', JSON.stringify(jobs));
      return { ...prev, jobs };
    });
  };

  /**
   * Save/unsave a course
   */
  const toggleSaveCourse = (courseId) => {
    setSavedItems(prev => {
      const courses = prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId];
      
      localStorage.setItem('savedCourses', JSON.stringify(courses));
      return { ...prev, courses };
    });
  };

  /**
   * Save/unsave an article
   */
  const toggleSaveArticle = (articleId) => {
    setSavedItems(prev => {
      const articles = prev.articles.includes(articleId)
        ? prev.articles.filter(id => id !== articleId)
        : [...prev.articles, articleId];
      
      localStorage.setItem('savedArticles', JSON.stringify(articles));
      return { ...prev, articles };
    });
  };

  /**
   * Check if item is saved
   */
  const isItemSaved = (itemId, type) => {
    return savedItems[type]?.includes(itemId) || false;
  };

  /**
   * Clear all saved items
   */
  const clearSavedItems = () => {
    setSavedItems({ jobs: [], courses: [], articles: [] });
    localStorage.removeItem('savedJobs');
    localStorage.removeItem('savedCourses');
    localStorage.removeItem('savedArticles');
  };

  const value = {
    profile,
    setProfile,
    preferences,
    updatePreferences,
    savedItems,
    toggleSaveJob,
    toggleSaveCourse,
    toggleSaveArticle,
    isItemSaved,
    clearSavedItems
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
