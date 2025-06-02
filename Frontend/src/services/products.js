import api from "./api";

// Get all products with optional filters
export const getAllProducts = async (filters = {}) => {
  try {
    const response = await api.get("/products", {
      params: filters
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
    const response = await api.get(`/products/${id}`);
    return response.data.product || response.data;
  } catch (error) {
    console.error('Product API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

// Get product categories
export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
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
