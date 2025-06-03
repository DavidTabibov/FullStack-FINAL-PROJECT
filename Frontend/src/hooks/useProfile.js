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
            
            // The backend returns the user data directly, not wrapped in data.user
            const updatedUserData = {
                _id: response.data._id,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                fullName: response.data.fullName,
                email: response.data.email,
                phone: response.data.phone,
                role: response.data.role,
                isAdmin: response.data.role === 'admin'
            };
            
            // Update user and token
            updateUser(updatedUserData, response.data.token);
            
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