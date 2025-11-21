// src/services/userService.js
import api from './api';

const userService = {
  getActiveProducers: async () => {
    try {
      // Backend automatically filters based on current user role:
      // - Schools/Suppliers get only producers
      // - Producers get schools/suppliers
      // - Admins get all users
      const response = await api.get('/users');
      console.log('✅ getActiveProducers response:', response.data);
      console.log('   Found users:', response.data.users?.length || 0);
      return response.data.producers || response.data.users || [];
    } catch (error) {
      console.error('❌ getActiveProducers error:', error);
      console.error('   Error details:', error.response?.data);
      return [];
    }
  }
};

export default userService;