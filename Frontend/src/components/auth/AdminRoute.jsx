// components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // שינוי כאן - ייבוא מהמקור הנכון

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, checkAndUpdateActivity } = useAuth();

    // עדכון זמן פעילות אחרון
    checkAndUpdateActivity();

    // אם המשתמש לא מחובר, מפנה לדף התחברות
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // אם המשתמש מחובר אבל לא מנהל, מפנה לדף הבית
    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    // אם המשתמש מחובר ומנהל, מציג את התוכן המבוקש
    return children;
};

export default AdminRoute;