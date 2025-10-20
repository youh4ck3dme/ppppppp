import React, { useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { siteConfig } from '../config/siteConfig';
import SectionHeader from './SectionHeader';

// Tell TypeScript that instgrm might exist on the window object
declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void;
            };
        };
    }
}

const InstagramFeed: React.FC = () => {
    const { t } = useTranslation();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    useEffect(() => {
        // The Instagram embed script is loaded asynchronously.
        // We need to check if the `instgrm` object is available and then process the embeds.
        if (isVisible && window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, [isVisible]);

    return (
        <section 
            ref={ref}
            id="instagram-feed" 
            className={`min-h-screen flex flex-col items-center justify-center py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title={t('instagram_title')} />
                <div className="text-center -mt-10 mb-16">
                     <a 
                        href={siteConfig.socials.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-lg text-gray-400 hover:text-[var(--color-accent)] transition-colors"
                    >
                        {t('instagram_handle')}
                    </a>
                </div>
                <div className="content-pane">
                    <div className="ig-grid">
                        <div className="ig-post-wrapper">
                            <blockquote 
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/p/DOEr9LCiIS3/"
                                data-instgrm-version="14">
                            </blockquote>
                        </div>
                        <div className="ig-post-wrapper">
                            <blockquote 
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/p/C2Imuq9oPHh/"
                                data-instgrm-version="14">
                            </blockquote>
                        </div>
                        <div className="ig-post-wrapper">
                            <blockquote 
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/p/DN-ld-yCICu/?utm_source=ig_embed"
                                data-instgrm-version="14">
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
