import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SavedLooksContextType {
    savedLooks: string[];
    saveLook: (imageUrl: string) => void;
    removeLook: (imageUrl: string) => void;
}

const SavedLooksContext = createContext<SavedLooksContextType | undefined>(undefined);

const getInitialLooks = (): string[] => {
    try {
        const item = window.localStorage.getItem('papi_saved_looks');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.warn('Error reading saved looks from localStorage', error);
        return [];
    }
};


export const SavedLooksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [savedLooks, setSavedLooks] = useState<string[]>(getInitialLooks);
    
    useEffect(() => {
        try {
            window.localStorage.setItem('papi_saved_looks', JSON.stringify(savedLooks));
        } catch (error) {
            console.warn('Error saving looks to localStorage', error);
        }
    }, [savedLooks]);

    const saveLook = (imageUrl: string) => {
        setSavedLooks(prevLooks => {
            if (!prevLooks.includes(imageUrl)) {
                return [imageUrl, ...prevLooks];
            }
            return prevLooks;
        });
    };

    const removeLook = (imageUrl: string) => {
        setSavedLooks(prevLooks => prevLooks.filter(look => look !== imageUrl));
    };

    return (
        <SavedLooksContext.Provider value={{ savedLooks, saveLook, removeLook }}>
            {children}
        </SavedLooksContext.Provider>
    );
};

export const useSavedLooks = () => {
    const context = useContext(SavedLooksContext);
    if (context === undefined) {
        throw new Error('useSavedLooks must be used within a SavedLooksProvider');
    }
    return context;
};
