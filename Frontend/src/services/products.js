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

// Admin: Create new product
export const createProduct = async (productData, token) => {
  try {
    const response = await api.post("/products", productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Create Product API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};

// Admin: Update product
export const updateProduct = async (id, productData, token) => {
  try {
    const response = await api.put(`/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Update Product API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

// Admin: Delete product
export const deleteProduct = async (id, token) => {
  try {
    const response = await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Delete Product API Error:', error);
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
};

// Legacy export for backward compatibility
const productsService = {
  getProducts: getAllProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productsService;
