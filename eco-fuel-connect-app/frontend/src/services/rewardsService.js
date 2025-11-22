import api from './api';

const rewardsService = {
  // Get my rewards
  getMyRewards: async () => {
    try {
      const response = await api.get('/rewards/my-rewards');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coins
  getCoins: async () => {
    try {
      const response = await api.get('/rewards/coins');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get supplier earnings and payments
  getSupplierRewards: async (supplierId) => {
    try {
      const response = await api.get(`/rewards/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request payment
  requestPayment: async (paymentMethod, amount) => {
    try {
      const response = await api.post('/rewards/request-payment', { paymentMethod, amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Convert coins to cash
  convertCoins: async (amount, paymentMethod) => {
    try {
      const response = await api.post('/rewards/coins/convert', { amount, paymentMethod });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get leaderboard
  getLeaderboard: async () => {
    try {
      const response = await api.get('/rewards/leaderboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get achievements
  getAchievements: async () => {
    try {
      const response = await api.get('/rewards/achievements');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Process payment
  processPayment: async (paymentId) => {
    try {
      const response = await api.post('/rewards/process-payment', { paymentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default rewardsService;
