import api from "./api";

const cartService = {
  async getCart() {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Return empty cart if not authenticated or other error
      return { items: [], total: 0 };
    }
  },

  async addItem(productId, quantity = 1, size = null, color = null) {
    try {
      const response = await api.post("/cart/items", { 
        productId, 
        quantity, 
        size, 
        color 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add item to cart");
    }
  },

  async updateItem(itemId, quantity) {
    try {
      const response = await api.patch(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update cart item");
    }
  },

  async removeItem(itemId) {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to remove item from cart");
    }
  },

  async clearCart() {
    try {
      const response = await api.delete("/cart");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  }
};

export default cartService;
