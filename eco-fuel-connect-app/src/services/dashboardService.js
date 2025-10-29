import api from './api';

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  }

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await api.get(`/dashboard/recent-activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent activities' };
    }
  }

  // Get system alerts
  async getSystemAlerts() {
    try {
      const response = await api.get('/dashboard/alerts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system alerts' };
    }
  }
}

export default new DashboardService();