import api from './api';

class EmailService {
    async sendPasswordReset(email) {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בשליחת מייל איפוס סיסמה');
        }
    }

    async verifyResetToken(token) {
        try {
            const response = await api.get(`/auth/reset-password/${token}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'טוקן לא תקין');
        }
    }
}

export const emailService = new EmailService();