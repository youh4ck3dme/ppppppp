import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

type Language = 'sk' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    try {
        const storedLang = window.localStorage.getItem('papi_hair_lang');
        if (storedLang === 'sk' || storedLang === 'en') {
            return storedLang;
        }
        
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'sk' || browserLang === 'en') {
            return browserLang;
        }
    } catch (error) {
        console.warn('Could not access localStorage or navigator language.', error);
    }
    return 'sk'; // Default language
};


export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    useEffect(() => {
        try {
            window.localStorage.setItem('papi_hair_lang', language);
            document.documentElement.lang = language;
        } catch (error) {
            console.warn('Could not save language to localStorage', error);
        }
    }, [language]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
