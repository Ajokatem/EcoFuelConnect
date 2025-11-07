import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const chatbotService = {
  // Send query to chatbot
  query: async (message, sessionId, userId = null) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/query`, {
        message,
        sessionId,
        userId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get conversation history
  getHistory: async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/history/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit feedback
  submitFeedback: async (conversationId, wasHelpful) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/feedback`, {
        conversationId,
        wasHelpful
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default chatbotService;
