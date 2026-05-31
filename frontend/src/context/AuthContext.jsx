import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hit the backend /auth/me route on mount to see if user is already logged in
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await API.get('/auth/me');
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.log("No active user session found.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);