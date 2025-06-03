import api from './api';

class PasswordService {
    async requestReset(email) {
        try {
            await api.post('/auth/forgot-password', { email });
            return { success: true, message: 'הוראות לאיפוס סיסמה נשלחו למייל' };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בשליחת בקשת איפוס סיסמה');
        }
    }

    async resetPassword(token, newPassword) {
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            return { success: true, message: 'הסיסמה עודכנה בהצלחה' };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה באיפוס הסיסמה');
        }
    }

    async changePassword(oldPassword, newPassword) {
        try {
            await api.put('/users/profile', { password: newPassword });
            return { success: true, message: 'הסיסמה שונתה בהצלחה' };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'שגיאה בשינוי הסיסמה');
        }
    }
}

export const passwordService = new PasswordService();