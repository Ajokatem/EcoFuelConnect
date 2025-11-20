// src/services/userService.js
import api from './api';

const userService = {
  getActiveProducers: async () => {
    try {
      const response = await api.get('/users?role=producer&isActive=true');
      console.log('getActiveProducers response:', response.data);
      return response.data.producers || response.data.users || [];
    } catch (error) {
      console.error('getActiveProducers error:', error);
      return [];
    }
  }
};

export default userService;