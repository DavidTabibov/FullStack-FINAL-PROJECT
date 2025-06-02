import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get user's wishlist
export const getWishlist = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.favorites || [];
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
};

// Get list of favorite product IDs
export const getFavoriteIds = async () => {
    try {
        const favorites = await getWishlist();
        return favorites.map(item => item._id || item);
    } catch (error) {
        console.error('Error fetching favorite IDs:', error);
        return [];
    }
};

// Add/remove product from favorites
export const toggleFavorite = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/users/favorites/${productId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
};

// Check if product is in favorites
export const isFavorite = async (productId) => {
    try {
        const favoriteIds = await getFavoriteIds();
        return favoriteIds.includes(productId);
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
};

// Remove product from favorites
export const removeFromFavorites = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_BASE_URL}/users/favorites/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
};

// הסרת מוצר מהמועדפים
export const removeFromWishlist = async (productId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/favorites/${productId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

// ריקון רשימת המועדפים
export const clearWishlist = async () => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/favorites`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        throw error;
    }
};
