import { useState, useCallback, useEffect } from 'react';
import { toggleFavorite as apiToggleFavorite, getFavoriteIds } from '../services/wishlist';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load initial favorites when the hook is initialized
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favoriteIds = await getFavoriteIds();
                setFavorites(favoriteIds);
            } catch (error) {
                console.error('Error loading favorites:', error);
                setFavorites([]);
            }
        };

        loadFavorites();
    }, []);

    const toggleFavorite = useCallback(async (productId) => {
        if (!productId) return;
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Please log in to manage favorites');
                return;
            }

            // Call the API to toggle favorite
            await apiToggleFavorite(productId);

            // Update local state
            if (favorites.includes(productId)) {
                setFavorites(prev => prev.filter(id => id !== productId));
                console.log('Product removed from favorites');
            } else {
                setFavorites(prev => [...prev, productId]);
                console.log('Product added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    }, [favorites]);

    return {
        favorites,
        toggleFavorite,
        isLoading
    };
};
