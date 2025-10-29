import api from './api';

class ContentService {
  // Get all published content
  async getContent(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/content?${queryString}` : '/content';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  }

  // Create new content (admin only)
  async createContent(contentData) {
    try {
      const response = await api.post('/content', contentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create content' };
    }
  }

  // Get specific content
  async getContentById(id) {
    try {
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  }

  // Update content (admin only)
  async updateContent(id, contentData) {
    try {
      const response = await api.put(`/content/${id}`, contentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update content' };
    }
  }

  // Delete content (admin only)
  async deleteContent(id) {
    try {
      const response = await api.delete(`/content/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete content' };
    }
  }

  // Get all courses
  async getCourses(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/courses?${queryString}` : '/courses';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch courses' };
    }
  }

  // Enroll in course
  async enrollInCourse(courseId) {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to enroll in course' };
    }
  }
}

export default new ContentService();