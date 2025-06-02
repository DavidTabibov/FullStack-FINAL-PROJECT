// hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());

    // Auto-logout after 4 hours of inactivity
    const AUTO_LOGOUT_TIME = 4 * 60 * 60 * 1000; // 4 hours
    const WARNING_TIME = 15 * 60 * 1000; // 15 minutes before logout

    useEffect(() => {
        // Remove automatic token validation to prevent unnecessary logouts
        // We'll handle validation only when needed
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(userData);
        }
        setLoading(false);
    }, [token]);

    // Track user activity for auto-logout
    useEffect(() => {
        const updateActivity = () => {
            setLastActivity(Date.now());
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        // Add event listeners for user activity
        events.forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, updateActivity, true);
            });
        };
    }, []);

    // Auto-logout timer
    useEffect(() => {
        if (!user || !token) return;

        const checkActivity = () => {
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivity;
            
            if (timeSinceLastActivity >= AUTO_LOGOUT_TIME) {
                // Auto logout
                logout();
                alert('הופסקה פעילותך במערכת עקב חוסר פעילות למשך 4 שעות. אנא התחבר מחדש.');
            } else if (timeSinceLastActivity >= AUTO_LOGOUT_TIME - WARNING_TIME) {
                // Show warning 15 minutes before logout
                const minutesLeft = Math.ceil((AUTO_LOGOUT_TIME - timeSinceLastActivity) / (60 * 1000));
                const shouldContinue = confirm(`תופסק פעילותך במערכת בעוד ${minutesLeft} דקות עקב חוסר פעילות. האם ברצונך להמשיך?`);
                
                if (shouldContinue) {
                    setLastActivity(Date.now()); // Reset activity timer
                }
            }
        };

        const interval = setInterval(checkActivity, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [user, token, lastActivity]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await authService.login({ email, password });
            
            // The API returns user data and token inside response.data.data
            if (response.data && response.data.status === 'success' && response.data.data && response.data.data.token) {
                const userData = {
                    _id: response.data.data.user.id,
                    firstName: response.data.data.user.firstName,
                    lastName: response.data.data.user.lastName,
                    fullName: `${response.data.data.user.firstName} ${response.data.data.user.lastName}`,
                    email: response.data.data.user.email,
                    role: response.data.data.user.role,
                    isAdmin: response.data.data.user.role === 'admin'
                };

                setToken(response.data.data.token);
                setUser(userData);
                setLastActivity(Date.now());
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, user: userData };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'Login failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.register(userData);
            
            // The API returns user data and token inside response.data.data
            if (response.data && response.data.status === 'success' && response.data.data && response.data.data.token) {
                const formattedUser = {
                    _id: response.data.data.user.id,
                    firstName: response.data.data.user.firstName,
                    lastName: response.data.data.user.lastName,
                    fullName: `${response.data.data.user.firstName} ${response.data.data.user.lastName}`,
                    email: response.data.data.user.email,
                    role: response.data.data.user.role,
                    isAdmin: response.data.data.user.role === 'admin'
                };

                setToken(response.data.data.token);
                setUser(formattedUser);
                setLastActivity(Date.now());
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(formattedUser));
                return { success: true, user: formattedUser };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                error: error.message || 'Registration failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setLastActivity(Date.now());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        lastActivity,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };