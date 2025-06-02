import api from './api';

class SearchService {
    async advancedSearch(params) {
        try {
            const response = await api.get('/recipes/search', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בחיפוש');
        }
    }

    async searchByIngredients(ingredients) {
        try {
            const response = await api.post('/recipes/search/ingredients', { ingredients });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בחיפוש לפי מצרכים');
        }
    }

    async searchByPreparationTime(maxTime) {
        try {
            const response = await api.get('/recipes/search/time', { params: { maxTime } });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בחיפוש לפי זמן הכנה');
        }
    }

    async searchByDifficulty(difficulty) {
        try {
            const response = await api.get('/recipes/search/difficulty', { params: { difficulty } });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בחיפוש לפי רמת קושי');
        }
    }

    async getPopularSearches() {
        try {
            const response = await api.get('/search/popular');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בטעינת חיפושים פופולריים');
        }
    }
}

export const searchService = new SearchService();