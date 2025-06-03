import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        try {
            const response = await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            });
            
            if (response.data) {
                showToast('Password updated successfully', 'success');
                return response.data;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update password';
            showToast(message, 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading };
};

export default useChangePassword;