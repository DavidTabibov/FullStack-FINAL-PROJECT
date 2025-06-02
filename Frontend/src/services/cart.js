import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const API_URL = "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartService = {
  async getCart() {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Return empty cart if not authenticated or other error
      return { items: [], total: 0 };
    }
  },

  async addItem(productId, quantity = 1, size = null, color = null) {
    try {
      const response = await axios.post(
        `${API_URL}/cart/items`,
        { productId, quantity, size, color },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add item to cart");
    }
  },

  async updateItem(itemId, quantity) {
    try {
      const response = await axios.patch(
        `${API_URL}/cart/items/${itemId}`,
        { quantity },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update cart item");
    }
  },

  async removeItem(itemId) {
    try {
      const response = await axios.delete(`${API_URL}/cart/items/${itemId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to remove item from cart");
    }
  },

  async clearCart() {
    try {
      const response = await axios.delete(`${API_URL}/cart`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  }
};

export default cartService;
