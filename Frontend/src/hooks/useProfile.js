import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './useAuth';

export function useProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.put('/users/profile', profileData);
            login(response.data); // Update the info in context
            console.log('Profile updated successfully');
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'Error updating profile';
            setError(message);
            console.error('Profile update error:', message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error };
}