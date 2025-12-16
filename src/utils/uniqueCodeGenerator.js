/**
 * Unique Code Generator Utility
 * Generates unique codes for users, courses, jobs, etc.
 */

// Character sets for code generation
const CHARACTER_SETS = {
  ALPHANUMERIC: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  ALPHABETIC: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMERIC: '0123456789',
  HEXADECIMAL: '0123456789ABCDEF'
};

/**
 * Generate a random string from given character set
 */
const generateRandomString = (length, characters = CHARACTER_SETS.ALPHANUMERIC) => {
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * Generate unique user code (3-4 chars + initials)
 */
export const generateUserCode = (firstName = '', lastName = '') => {
  // Generate random prefix (3-4 characters)
  const prefixLength = Math.floor(Math.random() * 2) + 3; // 3 or 4
  const prefix = generateRandomString(prefixLength, CHARACTER_SETS.ALPHANUMERIC);
  
  // Get initials from first and last name
  const initials = (
    (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')
  ).toUpperCase();
  
  return `${prefix}${initials}`;
};

/**
 * Generate unique course code
 */
export const generateCourseCode = (category = 'GEN') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(3, CHARACTER_SETS.ALPHANUMERIC);
  return `${category}-${timestamp}-${random}`;
};

/**
 * Generate unique job code
 */
export const generateJobCode = (companyInitials = 'COMP') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(4, CHARACTER_SETS.ALPHANUMERIC);
  return `JOB-${companyInitials}-${timestamp}-${random}`;
};

/**
 * Generate unique manuscript code
 */
export const generateManuscriptCode = (journalInitials = 'JRN') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(4, CHARACTER_SETS.ALPHANUMERIC);
  return `MS-${journalInitials}-${timestamp}-${random}`;
};

/**
 * Generate unique article code
 */
export const generateArticleCode = (category = 'NEWS') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(4, CHARACTER_SETS.ALPHANUMERIC);
  return `ART-${category}-${timestamp}-${random}`;
};

/**
 * Generate unique forum code
 */
export const generateForumCode = (category = 'GEN') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(4, CHARACTER_SETS.ALPHANUMERIC);
  return `FORUM-${category}-${timestamp}-${random}`;
};

/**
 * Generate unique certificate code
 */
export const generateCertificateCode = (courseCode = 'COURSE') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(6, CHARACTER_SETS.ALPHANUMERIC);
  return `CERT-${courseCode}-${timestamp}-${random}`;
};

/**
 * Generate unique payment code
 */
export const generatePaymentCode = (prefix = 'PAY') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(6, CHARACTER_SETS.ALPHANUMERIC);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate unique invitation code
 */
export const generateInvitationCode = (length = 8) => {
  return generateRandomString(length, CHARACTER_SETS.ALPHANUMERIC);
};

/**
 * Generate unique session code for video calls
 */
export const generateSessionCode = () => {
  return generateRandomString(10, CHARACTER_SETS.ALPHANUMERIC);
};

/**
 * Generate unique review code
 */
export const generateReviewCode = (type = 'REV') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(4, CHARACTER_SETS.ALPHANUMERIC);
  return `${type}-${timestamp}-${random}`;
};

/**
 * Validate code format
 */
export const validateCodeFormat = (code, pattern) => {
  if (!pattern) return true;
  
  const regex = new RegExp(pattern);
  return regex.test(code);
};

/**
 * Extract information from code
 */
export const parseCode = (code) => {
  const parts = code.split('-');
  
  if (parts.length < 2) {
    return {
      type: 'UNKNOWN',
      components: parts
    };
  }
  
  const type = parts[0];
  const components = parts.slice(1);
  
  return {
    type,
    components,
    timestamp: components.find(comp => /^[0-9A-Z]{6,}$/.test(comp)),
    random: components.find(comp => /^[A-Z0-9]{3,6}$/.test(comp))
  };
};

/**
 * Check if code is expired based on timestamp
 */
export const isCodeExpired = (code, expiryHours = 24) => {
  try {
    const parsed = parseCode(code);
    
    if (!parsed.timestamp) {
      return false; // Can't determine expiry without timestamp
    }
    
    // Convert base36 timestamp to milliseconds
    const timestamp = parseInt(parsed.timestamp, 36);
    const now = Date.now();
    const expiryTime = expiryHours * 60 * 60 * 1000;
    
    return (now - timestamp) > expiryTime;
  } catch (error) {
    console.error('Error checking code expiry:', error);
    return false;
  }
};

/**
 * Generate batch of unique codes
 */
export const generateBatchCodes = (count, generator, ...args) => {
  const codes = new Set();
  
  while (codes.size < count) {
    const code = generator(...args);
    codes.add(code);
  }
  
  return Array.from(codes);
};

/**
 * Code generation configuration
 */
export const CODE_CONFIG = {
  USER: {
    pattern: '^[A-Z0-9]{3,6}$',
    generator: generateUserCode
  },
  COURSE: {
    pattern: '^COURSE-[A-Z0-9]+-[A-Z0-9]{3}$',
    generator: generateCourseCode
  },
  JOB: {
    pattern: '^JOB-[A-Z]{2,6}-[A-Z0-9]+-[A-Z0-9]{4}$',
    generator: generateJobCode
  },
  MANUSCRIPT: {
    pattern: '^MS-[A-Z]{2,4}-[A-Z0-9]+-[A-Z0-9]{4}$',
    generator: generateManuscriptCode
  },
  ARTICLE: {
    pattern: '^ART-[A-Z]{2,6}-[A-Z0-9]+-[A-Z0-9]{4}$',
    generator: generateArticleCode
  },
  CERTIFICATE: {
    pattern: '^CERT-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]{6}$',
    generator: generateCertificateCode
  }
};

export default {
  generateUserCode,
  generateCourseCode,
  generateJobCode,
  generateManuscriptCode,
  generateArticleCode,
  generateForumCode,
  generateCertificateCode,
  generatePaymentCode,
  generateInvitationCode,
  generateSessionCode,
  generateReviewCode,
  validateCodeFormat,
  parseCode,
  isCodeExpired,
  generateBatchCodes,
  CODE_CONFIG
};