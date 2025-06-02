import api from './api';

// Submit a review for a product
export const submitReview = async (productId, reviewData) => {
    try {
        const response = await api.post(`/products/${productId}/reviews`, reviewData);
        return response.data;
    } catch (error) {
        console.error('Error submitting review:', error);
        throw new Error(error.response?.data?.message || 'Failed to submit review');
    }
};

// Get reviews for a product (if needed separately)
export const getProductReviews = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}`);
        return response.data.reviews || [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
};

export default {
    submitReview,
    getProductReviews
}; 