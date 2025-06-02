import api from './api';

const ordersService = {
  // Get all orders for the current user
  async getMyOrders() {
    try {
      const response = await api.get('/orders/myorders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch order");
    }
  },

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create order");
    }
  },

  // Update order to paid
  async updateOrderToPaid(orderId, paymentResult) {
    try {
      const response = await api.put(`/orders/${orderId}/pay`, paymentResult);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update order");
    }
  }
};

export default ordersService;
