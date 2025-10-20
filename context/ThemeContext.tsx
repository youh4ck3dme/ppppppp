import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const theme: Theme = 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        // Ensure dark is always set and light is removed, in case of SSR or other initial states
        if (!root.classList.contains('dark')) {
            root.classList.add('dark');
        }
        if (root.classList.contains('light')) {
            root.classList.remove('light');
        }
    }, []);

    // Provide a no-op setTheme to maintain the context's type contract
    const setTheme = (theme: Theme) => {};

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};