import api from './api';

class FuelService {
  // Get all fuel requests
  async getFuelRequests(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/fuel-requests?${queryString}` : '/fuel-requests';
      const response = await api.get(url);
      // Handle both formats: direct array or object with requests property
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.requests || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch fuel requests' };
    }
  }

  // Create new fuel request
  async createFuelRequest(requestData) {
    try {
  const response = await api.post('/fuel-requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create fuel request' };
    }
  }

  // Get specific fuel request
  async getFuelRequest(id) {
    try {
  const response = await api.get(`/fuel-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch fuel request' };
    }
  }

  // Update fuel request status
  async updateFuelRequestStatus(id, status, additionalData = {}) {
    try {
  const response = await api.put(`/fuel-requests/${id}/status`, {
        status,
        ...additionalData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update fuel request status' };
    }
  }

  // Assign fuel request to supplier
  async assignFuelRequest(id, supplierId) {
    try {
  const response = await api.put(`/fuel-requests/${id}/assign`, {
        supplierId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to assign fuel request' };
    }
  }

  // Delete fuel request
  async deleteFuelRequest(id) {
    try {
      const response = await api.delete(`/api/fuel-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete fuel request' };
    }
  }
}

export default new FuelService();