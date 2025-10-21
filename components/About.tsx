import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';

interface AboutProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8">
                    {t('about_title')}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed md:leading-loose mb-12">
                    {t('about_text')}
                </p>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                    {t('about_founder_subtitle')}
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed md:leading-loose mb-12">
                    {t('about_papi_text')}
                </p>
                
                <button
                    onClick={() => onNavigate({ view: 'main', sectionId: 'footer' })}
                    className="btn-primary"
                >
                    <span>{t('about_button')}</span>
                </button>
            </div>
        </div>
    );
};

export default About;