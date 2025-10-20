import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AboutPapiGold: React.FC = () => {
    const { t } = useTranslation();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    return (
        <section
            ref={ref}
            id="about-papi-gold"
            className={`py-20 md:py-32 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div className={`relative aspect-square md:aspect-auto md:h-full rounded-lg overflow-hidden shadow-2xl stagger-children ${isVisible ? 'is-visible' : ''}`}>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                         <img 
                            src="/assets/robert-papacun-portrait.jpg" 
                            alt={t('papiGoldTitle')} 
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                         />
                    </div>
                    <div className={`stagger-children ${isVisible ? 'is-visible' : ''}`} style={{animationDelay: '200ms'}}>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            {t('papiGoldTitle')}
                        </h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {t('papiGoldText')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPapiGold;