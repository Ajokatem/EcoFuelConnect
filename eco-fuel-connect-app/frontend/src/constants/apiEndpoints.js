// API endpoint constants
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    GOOGLE: '/auth/google'
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
    ALERTS: '/dashboard/alerts'
  },

  // Waste Management
  WASTE: {
    BASE: '/waste',
    BY_ID: (id) => `/waste/${id}`,
    ANALYTICS: '/waste/analytics'
  },

  // Biogas Production
  BIOGAS: {
    BASE: '/biogas',
    BY_ID: (id) => `/biogas/${id}`,
    ANALYTICS: '/biogas/analytics'
  },

  // Fuel Requests
  FUEL_REQUESTS: {
    BASE: '/fuel-requests',
    BY_ID: (id) => `/fuel-requests/${id}`,
    STATUS: (id) => `/fuel-requests/${id}/status`,
    ASSIGN: (id) => `/fuel-requests/${id}/assign`
  },

  // Content Management
  CONTENT: {
    BASE: '/content',
    BY_ID: (id) => `/content/${id}`
  },

  // Courses
  COURSES: {
    BASE: '/courses',
    BY_ID: (id) => `/courses/${id}`,
    ENROLL: (id) => `/courses/${id}/enroll`
  },

  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    STATUS: (id) => `/projects/${id}/status`,
    UPDATES: (id) => `/projects/${id}/updates`
  },

  // Admin
  ADMIN: {
    USERS: '/admin/users',
    USER_STATUS: (id) => `/admin/users/${id}/status`,
    ANALYTICS: '/admin/analytics'
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read'
  }
};

export default API_ENDPOINTS;