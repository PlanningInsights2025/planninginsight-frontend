/**
 * Formatter Utilities
 * Common formatting functions for dates, numbers, currencies, etc.
 */

/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format date and time
 */
export const formatDateTime = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format number with commas
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

/**
 * Format currency (Indian Rupees)
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format currency with decimal (for precise amounts)
 */
export const formatCurrencyPrecise = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format duration in minutes to readable format
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};

/**
 * Format phone number (Indian format)
 */
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number is Indian (starts with 91 or +91)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2-$3-$4');
  }
  
  // Return original if format doesn't match
  return phoneNumber;
};

/**
 * Format social security number (mask for display)
 */
export const maskSensitiveInfo = (value, visibleChars = 4) => {
  if (!value) return '';
  
  const length = value.length;
  if (length <= visibleChars * 2) {
    return value; // Too short to mask meaningfully
  }
  
  const firstPart = value.substring(0, visibleChars);
  const lastPart = value.substring(length - visibleChars);
  const maskedPart = '*'.repeat(length - visibleChars * 2);
  
  return firstPart + maskedPart + lastPart;
};

/**
 * Format name (capitalize first letters)
 */
export const formatName = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format initial from name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Format URL slug
 */
export const formatSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Format excerpt (truncate text with ellipsis)
 */
export const formatExcerpt = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format count for display (e.g., 1.2K, 3.5M)
 */
export const formatCount = (count) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
  if (count < 1000000000) return (count / 1000000).toFixed(1) + 'M';
  return (count / 1000000000).toFixed(1) + 'B';
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target - now;

  if (diffMs <= 0) return 'Expired';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h remaining`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMins}m remaining`;
  } else {
    return `${diffMins}m remaining`;
  }
};

/**
 * Format array to comma-separated string
 */
export const formatArrayToString = (array, maxItems = null) => {
  if (!array || array.length === 0) return '';
  
  const displayArray = maxItems ? array.slice(0, maxItems) : array;
  let result = displayArray.join(', ');
  
  if (maxItems && array.length > maxItems) {
    result += `, +${array.length - maxItems} more`;
  }
  
  return result;
};

/**
 * Format boolean to yes/no
 */
export const formatBoolean = (value) => {
  return value ? 'Yes' : 'No';
};

/**
 * Format validation error message
 */
export const formatValidationError = (errors) => {
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(', ');
  if (typeof errors === 'object') {
    return Object.values(errors).join(', ');
  }
  return 'Validation error';
};

/**
 * Format credit card number for display
 */
export const formatCreditCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const matches = cleaned.match(/(\d{4})(\d{4})(\d{4})(\d{4})/);
  
  if (matches) {
    return `${matches[1]} ${matches[2]} ${matches[3]} ${matches[4]}`;
  }
  
  return cardNumber;
};

/**
 * Format expiration date
 */
export const formatExpirationDate = (month, year) => {
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
};

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  formatNumber,
  formatCurrency,
  formatCurrencyPrecise,
  formatPercentage,
  formatDuration,
  formatPhoneNumber,
  maskSensitiveInfo,
  formatName,
  getInitials,
  formatSlug,
  formatExcerpt,
  formatCount,
  formatTimeRemaining,
  formatArrayToString,
  formatBoolean,
  formatValidationError,
  formatCreditCardNumber,
  formatExpirationDate
};