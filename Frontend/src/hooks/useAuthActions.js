// src/hooks/useAuthActions.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';
import authService from '../services/auth';

export function useAuthActions() {
    const navigate = useNavigate();
    const { login: authLogin, logout: authLogout } = useAuth();
    const { showSuccess, showError } = useNotifications();

    const handleLogin = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            authLogin(response);
            showSuccess('התחברת בהצלחה!');
            navigate('/');
            return true;
        } catch (error) {
            showError('שגיאה בהתחברות', error.message);
            return false;
        }
    };

    // פונקציית הרשמה חדשה שנוספה
    const handleRegister = async (userData) => {
        try {
            const response = await authService.register(userData);
            // אחרי הרשמה מוצלחת, בצע התחברות אוטומטית
            authLogin(response.data);
            showSuccess('נרשמת בהצלחה!');
            navigate('/');
            return true;
        } catch (error) {
            showError('שגיאה בהרשמה', error.response?.data?.message || error.message);
            return false;
        }
    };

    const handleLogout = () => {
        try {
            authLogout();
            showSuccess('התנתקת בהצלחה!');
            navigate('/login');
        } catch (error) {
            showError('שגיאה בהתנתקות');
        }
    };

    return {
        handleLogin,
        handleLogout,
        handleRegister // הוספת פונקציית הרשמה לערכים המוחזרים
    };
}

export default useAuthActions;

