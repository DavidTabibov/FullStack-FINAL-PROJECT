import api from './api';

class ProfileService {
    async uploadProfileImage(file) {
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await api.post('/users/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בהעלאת התמונה');
        }
    }

    async updateProfile(userData) {
        try {
            const response = await api.put('/users/profile', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בעדכון הפרופיל');
        }
    }

    async getProfile() {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בטעינת הפרופיל');
        }
    }
}

export const profileService = new ProfileService();