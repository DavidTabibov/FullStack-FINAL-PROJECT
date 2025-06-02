import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const API_URL = "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all products with optional filters
export const getAllProducts = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: filters,
      headers: getAuthHeader()
    });
    return response.data.products || response.data;
  } catch (error) {
    console.error('Products API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

// Get single product by ID
export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      headers: getAuthHeader()
    });
    return response.data.product || response.data;
  } catch (error) {
    console.error('Product API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

// Get product categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: getAuthHeader()
    });
    return response.data.categories || response.data;
  } catch (error) {
    console.error('Categories API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};

// Legacy export for backward compatibility
const productsService = {
  getProducts: getAllProducts,
  getProduct,
  getCategories
};

export default productsService;
