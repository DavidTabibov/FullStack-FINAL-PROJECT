// components/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // שינוי כאן - ייבוא מהמקור הנכון

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, checkAndUpdateActivity } = useAuth();

    // עדכון זמן פעילות אחרון
    checkAndUpdateActivity();

    // אם המשתמש לא מחובר, מפנה לדף התחברות
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // אם המשתמש מחובר, מציג את התוכן המבוקש
    return children;
};

export default PrivateRoute;