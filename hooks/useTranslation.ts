import { useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations, TranslationKeys } from '../translations';

type TranslationKey = keyof TranslationKeys;

export const useTranslation = () => {
    const { language } = useLanguage();

    const t = useCallback((key: string): string => {
        const value = translations[language][key as TranslationKey] || key;
        if (typeof value === 'string') {
            return value;
        }
        // Fallback for structured content requested via `t`
        return key;
    }, [language]);

    const tStructured = useCallback((key: string): any[] => {
        const value = translations[language][key as TranslationKey];
        if (Array.isArray(value)) {
            return value;
        }
        // Fallback for simple string requested via `tStructured`
        if (typeof value === 'string') {
            return [{ type: 'p', content: value }];
        }
        return [{ type: 'p', content: key }];
    }, [language]);

    const getRawTranslations = useCallback(() => {
        return translations[language];
    }, [language]);

    t.getRawTranslations = getRawTranslations

    return { t, language, tStructured };
};
