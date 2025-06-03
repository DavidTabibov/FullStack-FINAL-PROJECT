import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './useAuth';

export function useProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { updateUser, user } = useAuth();

    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);

        try {
            await api.put('/auth/profile', profileData);
            
            // Refresh user data
            const userResponse = await api.get('/auth/me');
            updateUser(userResponse.data.user);
            
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'Error updating profile';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error };
}