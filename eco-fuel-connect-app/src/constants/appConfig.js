// Application configuration constants

export const APP_CONFIG = {
  // App Info
  APP_NAME: 'EcoFuelConnect',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  API_TIMEOUT: 10000,
  
  // Authentication
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // Form Validation
  MIN_PASSWORD_LENGTH: 6,
  MAX_TEXT_LENGTH: 500,
  MAX_TITLE_LENGTH: 200,
  
  // Date Formats
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_DATE_FORMAT: 'MMM DD, YYYY',
  DISPLAY_DATETIME_FORMAT: 'MMM DD, YYYY HH:mm',
  
  // Theme
  THEME_KEY: 'app_theme',
  LANGUAGE_KEY: 'app_language',
  
  // Default Values
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
  
  // Status Options
  REQUEST_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REJECTED: 'rejected'
  },
  
  // Waste Types
  WASTE_TYPES: [
    'Organic Kitchen Waste',
    'Market Waste',
    'Restaurant Waste',
    'Agricultural Waste',
    'Food Processing Waste',
    'Other Organic Waste'
  ],
  
  // Content Categories
  CONTENT_CATEGORIES: [
    'Biogas Basics',
    'Waste Management',
    'Environment & Health',
    'Community Impact',
    'Innovation',
    'Getting Started'
  ],
  
  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  },
  
  // Alert Types
  ALERT_TYPES: {
    SUCCESS: 'success',
    ERROR: 'danger',
    WARNING: 'warning',
    INFO: 'info'
  }
};

export default APP_CONFIG;