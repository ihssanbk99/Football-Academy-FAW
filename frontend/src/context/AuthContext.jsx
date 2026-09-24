import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        api.get('/user')
            .then((response) => {
                setUser(response.data.user);
            })
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', {
            email,
            password,
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    const register = async (name, email, password, passwordConfirmation) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}