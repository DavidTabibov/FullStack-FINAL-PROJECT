/**
 * מחזיר את הטוקן השמור בלוקל סטורג'
 * @returns {string|null} הטוקן או null אם אין טוקן
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * בדיקה האם המשתמש מחובר
 * @returns {boolean} האם המשתמש מחובר
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * בדיקה האם המשתמש הוא מנהל
 * @returns {boolean} האם המשתמש מנהל
 */
export const isAdmin = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;

        const user = JSON.parse(userStr);
        return user.isAdmin === true;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

/**
 * עדכון זמן פעילות אחרון של המשתמש
 */
export const updateLastActivity = () => {
    if (isAuthenticated()) {
        localStorage.setItem('lastActivity', Date.now().toString());
    }
};

/**
 * מחזיר את כותרות האימות לבקשות API
 * @returns {Object} אובייקט עם כותרות האימות
 */
export const getAuthHeaders = () => {
    const token = getToken();
    if (!token) {
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

/**
 * בדיקה אם יש פעילות רצויה של המשתמש במסגרת הזמן המוגדר
 * @param {number} timeout זמן בלי פעילות במילישניות
 * @returns {boolean} האם המשתמש פעיל
 */
export const checkActivityTimeout = (timeout = 4 * 60 * 60 * 1000) => {
    if (!isAuthenticated()) return false;

    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return false;

    return Date.now() - parseInt(lastActivity) < timeout;
};