import api from './api';

class UploadService {
    async uploadImage(file, type = 'recipe') {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);

        try {
            const response = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בהעלאת התמונה');
        }
    }
}

export const uploadService = new UploadService();