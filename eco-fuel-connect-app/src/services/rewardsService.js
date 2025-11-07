import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const rewardsService = {
  // Get supplier earnings and payments
  getSupplierRewards: async (supplierId, token) => {
    try {
      const response = await axios.get(`${API_URL}/rewards/supplier/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request payment
  requestPayment: async (paymentIds, paymentMethod, token) => {
    try {
      const response = await axios.post(`${API_URL}/rewards/request-payment`, 
        { paymentIds, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Process payment
  processPayment: async (paymentId, token) => {
    try {
      const response = await axios.post(`${API_URL}/rewards/process-payment`, 
        { paymentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default rewardsService;
