// Application constants
export const APP_CONSTANTS = {
  APP_NAME: 'Planning Insights',
  SUPPORT_EMAIL: 'support@planninginsights.com',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: {
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEO: ['video/mp4', 'video/mpeg', 'video/quicktime']
  },
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
}

// User roles
export const USER_ROLES = {
  USER: 'user',
  RECRUITER: 'recruiter',
  INSTRUCTOR: 'instructor',
  EDITOR: 'editor',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  MASTER_ADMIN: 'master_admin'
}

// Course types
export const COURSE_TYPES = {
  LIVE: 'live',
  RECORDED: 'recorded',
  OFFLINE: 'offline'
}

// Job application status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CLARIFICATION_REQUESTED: 'clarification_requested'
}

// Publication access types
export const PUBLICATION_ACCESS = {
  OPEN: 'open',
  PAID: 'paid',
  SSO: 'sso'
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  LEARNING: '/learning',
  PUBLISHING: '/publishing',
  NEWS: '/news',
  FORUM: '/forum',
  ADMIN: '/admin'
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
    REQUEST_OTP: '/auth/request-otp',
    PROFILE: '/auth/profile'
  },
  JOBS: {
    BASE: '/jobs',
    APPLICATIONS: '/applications',
    RECRUITER: '/recruiter'
  },
  LEARNING: {
    COURSES: '/courses',
    ENROLLMENTS: '/enrollments',
    INSTRUCTORS: '/instructors'
  },
  PUBLISHING: {
    JOURNALS: '/journals',
    MANUSCRIPTS: '/manuscripts'
  },
  NEWS: {
    ARTICLES: '/articles',
    AUTHORS: '/authors'
  },
  FORUM: {
    FORUMS: '/forums',
    THREADS: '/threads',
    COMMENTS: '/comments'
  }
}

export default {
  APP_CONSTANTS,
  USER_ROLES,
  COURSE_TYPES,
  APPLICATION_STATUS,
  PUBLICATION_ACCESS,
  ROUTES,
  API_ENDPOINTS
}