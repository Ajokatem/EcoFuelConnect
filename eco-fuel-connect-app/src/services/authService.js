import api from './api';

class AuthService {
  // Check if user is authenticated
  isAuthenticated() {
    // Example: check for token in localStorage
    return !!localStorage.getItem('token');
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      // Store token and user in React context or state management (handled in component)
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || JSON.stringify(error.response?.data) || 'Login failed';
      throw new Error(msg);
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      const { token, user } = response.data;
      // Store token and user in React context or state management (handled in component)
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || JSON.stringify(error.response?.data) || 'Registration failed';
      throw new Error(msg);
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || JSON.stringify(error.response?.data) || 'Failed to fetch profile';
      throw new Error(msg);
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || JSON.stringify(error.response?.data) || 'Failed to update profile';
      throw new Error(msg);
    }
  }

  // Logout user
  async logout() {
    try {
  await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear token/user from React context or state management (handled in component)
      // Don't redirect here - let the component handle it
    }
  }

  // Google login/register
  async googleLogin(googleData) {
    try {
      const response = await api.post('/auth/google', googleData);
      const { token, user } = response.data;
      // Store token and user in React context or state management (handled in component)
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || JSON.stringify(error.response?.data) || 'Google authentication failed';
      throw new Error(msg);
    }
  }

  // Check if user is authenticated
  // Remove localStorage-based helpers. Use React context or state management in components.
}

export default new AuthService();