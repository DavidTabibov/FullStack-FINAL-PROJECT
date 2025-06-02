import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAdminStats() {
    const [stats, setStats] = useState({
        usersCount: 0,
        recipesCount: 0,
        favoritesCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/stats');
            setStats(response.data);
            setError(null);
        } catch (err) {
            setError('שגיאה בטעינת הנתונים');
        } finally {
            setLoading(false);
        }
    };

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    };
}