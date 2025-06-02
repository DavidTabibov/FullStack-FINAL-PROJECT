// hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // בדיקה אם יש משתמש מחובר
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                        setIsAdmin(parsedUser.role === 'admin');

                        // בדיקת תוקף הטוקן מול השרת (אופציונלי)
                        try {
                            const isValid = await authService.checkTokenValidity();
                            if (!isValid) {
                                await logout();
                            }
                        } catch (error) {
                            console.log('Token validation failed, logging out');
                            await logout();
                        }
                    } catch (error) {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { data } = response;

            // Fix: Access nested data structure - API returns data.data.user and data.data.token
            if (!data || !data.data || !data.data.user || !data.data.token) {
                throw new Error('נתונים לא תקינים מהשרת');
            }

            // Format user data to match frontend expectations
            const formattedUser = {
                id: data.data.user.id,
                name: {
                    first: data.data.user.firstName,
                    last: data.data.user.lastName
                },
                email: data.data.user.email,
                role: data.data.user.role,
                isAdmin: data.data.user.role === 'admin'
            };

            localStorage.setItem('user', JSON.stringify(formattedUser));
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('lastActivity', Date.now().toString());

            setUser(formattedUser);
            setIsAuthenticated(true);
            setIsAdmin(formattedUser.isAdmin);

            console.log(`ברוך הבא, ${formattedUser.name.first || 'משתמש'}!`);
            return true;
        } catch (error) {
            console.error("התחברות נכשלה, בדוק את הפרטים ונסה שוב.");
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            // התאמת מבנה הנתונים למה שהשרת מצפה
            const formattedData = {
                firstName: userData.firstName || userData.name?.first || '',
                lastName: userData.lastName || userData.name?.last || '',
                email: userData.email,
                password: userData.password
            };

            const response = await authService.register(formattedData);
            const { data } = response;

            // Fix: Access nested data structure - API returns data.data.user and data.data.token
            if (!data || !data.data || !data.data.user) {
                throw new Error('נתונים לא תקינים מהשרת');
            }

            // Format user data to match frontend expectations
            const formattedUser = {
                id: data.data.user.id,
                name: {
                    first: data.data.user.firstName,
                    last: data.data.user.lastName
                },
                email: data.data.user.email,
                role: data.data.user.role,
                isAdmin: data.data.user.role === 'admin'
            };

            // התחברות אוטומטית אם יש טוקן
            if (data.data.token) {
                localStorage.setItem('user', JSON.stringify(formattedUser));
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('lastActivity', Date.now().toString());

                setUser(formattedUser);
                setIsAuthenticated(true);
                setIsAdmin(formattedUser.isAdmin);
            }

            console.log(`נרשמת בהצלחה, ${formattedUser.name.first}!`);
            return true;
        } catch (error) {
            console.error("הרשמה נכשלה, בדוק את הפרטים ונסה שוב.");
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('lastActivity');
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            console.log("התנתקת בהצלחה!");
        }
    };

    // עדכון נתוני משתמש
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // עדכון פרופיל משתמש
    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            const response = await authService.updateProfile(profileData);
            const updatedUser = { ...user, ...response.data };
            updateUser(updatedUser);
            console.log('הפרופיל עודכן בהצלחה!');
            return updatedUser;
        } catch (error) {
            console.error('שגיאה בעדכון הפרופיל');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}