/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

const config = {
  // Application Information
  app: {
    name: 'Planning Insights',
    version: '1.0.0',
    description: 'Comprehensive platform for built environment professionals',
    supportEmail: 'support@theplanninginsights.com',
    contactEmail: 'contact@theplanninginsights.com'
  },

  // API Configuration
  api: {
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    otpExpiry: 10 * 60 * 1000, // 10 minutes
    passwordMinLength: 8,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    allowedDocumentTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    allowedVideoTypes: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxDocumentSize: 10 * 1024 * 1024, // 10MB
    maxVideoSize: 100 * 1024 * 1024 // 100MB
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: 10,
    pageSizes: [10, 25, 50, 100],
    maxPageSize: 100
  },

  // Search Configuration
  search: {
    debounceDelay: 300,
    minSearchLength: 2,
    maxSearchResults: 50
  },

  // Notifications Configuration
  notifications: {
    autoHideDuration: 4000,
    maxVisible: 5,
    position: 'top-right'
  },

  // Theme Configuration
  theme: {
    defaultTheme: 'light',
    supportedThemes: ['light', 'dark'],
    colors: {
      primary: '#2563eb',
      primaryDark: '#1d4ed8',
      secondary: '#64748b',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0369a1'
    }
  },

  // Feature Flags
  features: {
    enableSocialLogin: true,
    enableSSO: true,
    enableAIFeatures: true,
    enableVideoConferencing: true,
    enableBlockchainCertificates: true,
    enableAdvancedAnalytics: true,
    enableRealTimeChat: true,
    enableGroupBookings: true,
    enablePremiumContent: true
  },

  // Payment Configuration
  payment: {
    currency: 'INR',
    razorpayKey: process.env.VITE_RAZORPAY_KEY,
    supportedCurrencies: ['INR', 'USD', 'EUR'],
    taxRate: 0.18, // 18% GST
    invoicePrefix: 'PI'
  },

  // Course Configuration
  courses: {
    maxDuration: 365, // days
    minDuration: 1, // day
    completionThreshold: 80, // percentage
    certificateValidity: 365, // days
    maxEnrollments: 1000,
    minStudentsForGroupDiscount: 5
  },

  // Job Portal Configuration
  jobs: {
    maxApplicationsPerUser: 50,
    applicationValidity: 30, // days
    maxJobDuration: 365, // days
    featuredJobDuration: 7 // days
  },

  // Publishing Configuration
  publishing: {
    maxAuthorsPerManuscript: 10,
    maxManuscriptSize: 10 * 1024 * 1024, // 10MB
    reviewDeadline: 30, // days
    revisionDeadline: 14, // days
    maxRevisions: 3
  },

  // Newsroom Configuration
  newsroom: {
    maxArticleLength: 5000,
    maxTagsPerArticle: 10,
    maxAttachmentsPerArticle: 5,
    articleReadTimeWPM: 200 // words per minute
  },

  // Forum Configuration
  forum: {
    maxThreadLength: 1000,
    maxCommentLength: 500,
    maxRepliesDepth: 5,
    spamDetectionThreshold: 5,
    maxReportsPerUser: 10
  },

  // Cache Configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    userTTL: 15 * 60 * 1000, // 15 minutes
    contentTTL: 30 * 60 * 1000, // 30 minutes
    maxCacheSize: 50 // MB
  },

  // Performance Configuration
  performance: {
    lazyLoadThreshold: 100,
    debounceScroll: 100,
    imageQuality: 80,
    enableCompression: true
  },

  // Security Configuration
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 60 * 60 * 1000, // 60 minutes
    enable2FA: true,
    enableCSP: true,
    enableHSTS: true
  },

  // Analytics Configuration
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    googleAnalyticsId: process.env.VITE_GA_ID,
    hotjarId: process.env.VITE_HOTJAR_ID,
    mixpanelToken: process.env.VITE_MIXPANEL_TOKEN
  },

  // External Services
  services: {
    razorpay: {
      key: process.env.VITE_RAZORPAY_KEY,
      secret: process.env.VITE_RAZORPAY_SECRET
    },
    aws: {
      region: process.env.VITE_AWS_REGION,
      bucket: process.env.VITE_AWS_BUCKET
    },
    email: {
      provider: 'sendgrid',
      fromEmail: 'noreply@planninginsights.com',
      fromName: 'Planning Insights'
    },
    ai: {
      openaiKey: process.env.VITE_OPENAI_KEY,
      moderationEnabled: true
    }
  },

  // URLs
  urls: {
    website: 'https://planninginsights.com',
    api: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    cdn: process.env.VITE_CDN_URL || 'https://cdn.planninginsights.com',
    docs: 'https://docs.planninginsights.com',
    support: 'https://support.planninginsights.com'
  },

  // Social Media Links
  social: {
    twitter: 'https://twitter.com/planninginsights',
    linkedin: 'https://linkedin.com/company/planninginsights',
    facebook: 'https://facebook.com/planninginsights',
    instagram: 'https://instagram.com/planninginsights',
    youtube: 'https://youtube.com/planninginsights'
  }
};

// Environment-specific overrides
const environmentConfig = {
  development: {
    api: {
      baseURL: 'http://localhost:3000/api'
    },
    features: {
      enableAdvancedAnalytics: false,
      enableBlockchainCertificates: false
    }
  },
  test: {
    api: {
      baseURL: 'http://localhost:3001/api'
    }
  },
  production: {
    api: {
      baseURL: 'https://api.planninginsights.com'
    }
  }
};

// Merge environment-specific config
const env = process.env.NODE_ENV || 'development';
const envConfig = environmentConfig[env] || {};

// Deep merge function
const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Export merged configuration
export default deepMerge(config, envConfig);