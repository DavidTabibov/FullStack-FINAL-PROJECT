import api from './api';

class CategoryService {
    async getAllCategories() {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בטעינת הקטגוריות');
        }
    }

    // למנהל מערכת בלבד
    async createCategory(categoryData) {
        try {
            const response = await api.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה ביצירת קטגוריה');
        }
    }

    async updateCategory(id, categoryData) {
        try {
            const response = await api.put(`/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בעדכון הקטגוריה');
        }
    }

    async deleteCategory(id) {
        try {
            await api.delete(`/categories/${id}`);
            return { success: true, message: 'הקטגוריה נמחקה בהצלחה' };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה במחיקת הקטגוריה');
        }
    }
}

export const categoryService = new CategoryService();