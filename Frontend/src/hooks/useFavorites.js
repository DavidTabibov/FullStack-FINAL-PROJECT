import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { toggleFavorite as apiToggleFavorite, getFavoriteIds } from '../services/wishlist';
import { useToast } from '../context/ToastContext';

export const useFavorites = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load initial favorites when the hook is initialized and user is authenticated
    useEffect(() => {
        const loadFavorites = async () => {
            if (!isAuthenticated) {
                setFavorites([]);
                return;
            }
            
            try {
                const favoriteIds = await getFavoriteIds();
                setFavorites(favoriteIds);
            } catch (error) {
                setFavorites([]);
            }
        };

        loadFavorites();
    }, [isAuthenticated]);

    const toggleFavorite = async (productId) => {
        if (!isAuthenticated) {
            showToast('🔐 Please sign in to manage your favorites collection', 'warning');
            return;
        }

        try {
            setIsLoading(true);
            
            if (favorites.includes(productId)) {
                await apiToggleFavorite(productId);
                setFavorites(prev => prev.filter(id => id !== productId));
                showToast('💔 Item removed from your favorites', 'success');
            } else {
                await apiToggleFavorite(productId);
                setFavorites(prev => [...prev, productId]);
                showToast('❤️ Item added to your favorites collection!', 'success');
            }
        } catch (error) {
            showToast('⚠️ Unable to update favorites. Please check your connection and try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        favorites,
        toggleFavorite,
        isLoading
    };
};
