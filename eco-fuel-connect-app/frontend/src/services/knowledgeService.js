import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const knowledgeService = {
  // Get all articles
  getArticles: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/knowledge/articles?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single article
  getArticle: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/knowledge/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create article (admin)
  createArticle: async (articleData, token) => {
    try {
      const response = await axios.post(`${API_URL}/knowledge/articles`, articleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update article (admin)
  updateArticle: async (id, articleData, token) => {
    try {
      const response = await axios.put(`${API_URL}/knowledge/articles/${id}`, articleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete article (admin)
  deleteArticle: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/knowledge/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    try {
      const response = await axios.get(`${API_URL}/knowledge/featured`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Set featured article (admin)
  setFeaturedArticle: async (articleId, displayOrder, token) => {
    try {
      const response = await axios.post(`${API_URL}/knowledge/featured`, 
        { articleId, displayOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default knowledgeService;
