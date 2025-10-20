import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { siteConfig } from '../config/siteConfig';
import { NavigationIntent } from '../App';

interface HeroProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Trigger animation shortly after component mounts to ensure it's visible
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!titleRef.current) return;
        const rect = titleRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        titleRef.current.style.setProperty('--mouse-x', `${x}px`);
        titleRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section
            id="home"
            className="relative h-screen flex flex-col items-center justify-center text-white"
        >
            {/* Background elements are now handled globally in index.html for cinematic effect */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className={`text-center stagger-children ${isVisible ? 'is-visible' : ''}`}>
                        
                        <div 
                            className="mb-8"
                            ref={titleRef}
                            onMouseMove={handleMouseMove}
                        >
                           <h1 className="hero-title">
                                PAPI HAIR DESIGN
                           </h1>
                        </div>

                        <h2 className="text-xl md:text-2xl text-[var(--color-accent)] mb-8">
                            {t('heroSubtitle')}
                        </h2>
                        <p className="text-base text-gray-300 mb-6 leading-relaxed">
                            {t('heroMainText')}
                        </p>
                         <p className="text-base text-gray-300 mb-10 leading-relaxed">
                            {t('heroSecondaryText')}
                         </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => window.open('http://www.goldhaircare.sk/affiliate/2208', '_blank', 'noopener,noreferrer')}
                                className="btn-secondary w-full sm:w-auto"
                            >
                                <span className="text-base">{t('heroButtonSecondary')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;