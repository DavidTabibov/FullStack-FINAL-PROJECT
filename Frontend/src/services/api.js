import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // Increased timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    response => response,
    error => {
        // Better error handling for network issues
        if (!error.response) {
            console.error('Network Error: Unable to connect to server');
            return Promise.reject(new Error('Unable to connect to server. Please check your connection.'));
        }
        
        const message = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', message);
        
        // Handle specific error codes
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // If user is not on login page, redirect them there
            if (!window.location.pathname.includes('/login')) {
                console.error('Your session has expired. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;