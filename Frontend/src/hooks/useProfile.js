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
            const response = await api.put('/users/profile', profileData);
            
            // Update the user in the auth context with the new profile data
            // The backend returns user data directly in response.data
            const updatedUser = {
                ...user,
                ...response.data,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                fullName: response.data.fullName,
                name: {
                    first: response.data.firstName,
                    last: response.data.lastName
                }
            };
            
            updateUser(updatedUser);
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