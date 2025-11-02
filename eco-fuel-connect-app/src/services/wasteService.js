import api from './api';

class WasteService {
  // Get active producers for dropdown
  async getProducers() {
    try {
      const response = await api.get('/users?role=producer&isActive=true');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch producers' };
    }
  }
  // Get all waste entries
  async getWasteEntries(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/waste-logging?${queryString}` : '/waste-logging';
      const response = await api.get(url);
      // Handle both formats: direct array or object with wasteEntries property
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.wasteEntries || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch waste entries' };
    }
  }

  // Create new waste entry
  async createWasteEntry(wasteData) {
    try {
  const response = await api.post('/waste-logging', wasteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create waste entry' };
    }
  }

  // Get specific waste entry
  async getWasteEntry(id) {
    try {
  const response = await api.get(`/waste-logging/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch waste entry' };
    }
  }

  // Update waste entry
  async updateWasteEntry(id, wasteData) {
    try {
  const response = await api.put(`/waste-logging/${id}`, wasteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update waste entry' };
    }
  }

  // Delete waste entry
  async deleteWasteEntry(id) {
    try {
  const response = await api.delete(`/waste-logging/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete waste entry' };
    }
  }

  // Get waste analytics
  async getWasteAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/waste-logging/analytics?${queryString}` : '/waste-logging/analytics';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch waste analytics' };
    }
  }
}

export default new WasteService();