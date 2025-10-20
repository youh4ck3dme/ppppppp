import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { galleryImages } from '../constants';
import SectionHeader from './SectionHeader';

const Blog: React.FC = () => {
    const { t } = useTranslation();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    const generatePlaceholder = (width = 400, height = 500) => {
        const svg = `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#111827"/>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:rgba(212, 175, 55, 0.1);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgba(212, 175, 55, 0);stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${width}" height="${height}" fill="url(#grad1)" />
          <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="rgba(212, 175, 55, 0.05)" stroke-width="2" />
          <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="rgba(212, 175, 55, 0.05)" stroke-width="2" />
        </svg>
        `;
        return `data:image/svg+xml;base64,${window.btoa(svg)}`;
    };

    return (
        <section 
            ref={ref}
            id="blog" 
            className={`min-h-screen flex flex-col items-center justify-center py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title={t('gallery_title')} subtitle={t('gallery_subtitle')} />
                <div className={`gallery-grid stagger-children ${isVisible ? 'is-visible' : ''}`}>
                    {galleryImages.map((image, index) => {
                        const imageSrc = image.src || generatePlaceholder();
                        return (
                            <div key={index} className="gallery-item" style={{ animationDelay: `${index * 50}ms` }}>
                               <img src={imageSrc} alt={image.alt} loading="lazy" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Blog;