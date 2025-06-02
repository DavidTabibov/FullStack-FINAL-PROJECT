import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotifications } from './useNotifications';

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showSuccess, showError } = useNotifications();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('שגיאה בטעינת המשתמשים');
        } finally {
            setLoading(false);
        }
    };

    const toggleUserRole = async (userId, isAdmin) => {
        try {
            await api.patch(`/admin/users/${userId}/role`, { isAdmin });
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, isAdmin }
                    : user
            ));
            showSuccess(`הרשאות המשתמש עודכנו בהצלחה`);
        } catch (err) {
            showError('שגיאה בעדכון הרשאות המשתמש');
        }
    };

    return {
        users,
        loading,
        error,
        toggleUserRole,
        refreshUsers: fetchUsers
    };
}