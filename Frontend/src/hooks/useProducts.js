import { useState, useEffect, useCallback } from 'react';
import * as productsService from '../services/products';

export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load all products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productsService.getAllProducts(initialFilters);
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Unable to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial product loading
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refreshProducts: fetchProducts
    };
};
