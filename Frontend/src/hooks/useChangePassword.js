import { useState } from 'react';
import axios from 'axios';

export function useChangePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const changePassword = async ({ currentPassword, newPassword }) => {
        setLoading(true);
        setError(null);

        try {
            await axios.post('/api/users/change-password', {
                currentPassword,
                newPassword
            });

            console.log('Password updated successfully');
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'Error updating password';
            setError(message);
            console.error('Password update error:', message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading, error };
}