// src/services/userService.js
import axios from 'axios';

const userService = {
  getActiveProducers: async () => {
    // Call backend API directly on port 5000
    const response = await axios.get('http://localhost:5000/api/users?role=producer&isActive=true', { withCredentials: true });
    // The backend should return { producers: [...] }
    return response.data.producers || [];
  }
};

export default userService;