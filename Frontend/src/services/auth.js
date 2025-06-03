import api from './api';

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid email or password");
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get user data");
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  },

  async checkTokenValidity() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await api.get('/auth/verify');
      return response.data.status === 'success' && response.data.data && response.data.data.user;
    } catch (error) {
      return false;
    }
  },

  updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
  }
};

export default authService;
