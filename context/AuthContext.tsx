import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try {
            return window.localStorage.getItem('papi_auth_user') === 'true';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('papi_auth_user', String(isAuthenticated));
        } catch (error) {
            console.warn('Could not save user auth state to localStorage', error);
        }
    }, [isAuthenticated]);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};