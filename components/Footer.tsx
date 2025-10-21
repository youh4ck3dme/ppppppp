import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import { siteConfig } from '../config/siteConfig';
import { Icon } from './Icons';

interface FooterProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    const footerLinks = {
        services: [
            { name: t('footer_services_mens'), intent: { view: 'main', sectionId: 'services' } as const },
            { name: t('footer_services_womens'), intent: { view: 'main', sectionId: 'services' } as const },
            { name: t('footer_services_coloring'), intent: { view: 'main', sectionId: 'services' } as const },
            { name: t('footer_services_treatments'), intent: { view: 'main', sectionId: 'services' } as const },
        ],
        company: [
            { name: t('footer_company_about'), intent: { view: 'about' } as const },
            { name: t('footer_company_team'), intent: { view: 'team' } as const },
            { name: t('footer_company_contact'), intent: { view: 'main', sectionId: 'footer' } as const },
            { name: t('footer_company_blog'), intent: { view: 'main', sectionId: 'blog' } as const },
        ],
        support: [
            { name: t('footer_support_faq') },
            { name: t('footer_support_booking'), intent: { view: 'booking' } as const },
            { name: t('footer_support_pricing'), intent: { view: 'main', sectionId: 'services' } as const },
            { name: t('footer_support_reviews') },
        ],
    };
    
    type Link = { name: string; href?: string; intent?: NavigationIntent; };

    const renderLinks = (links: Link[]) => (
         <ul className="space-y-4">
            {links.map((link) => {
                const isComingSoon = !link.intent && !link.href;
                return (
                    <li key={link.name}>
                        {link.intent ? (
                            <button
                                onClick={() => onNavigate(link.intent!)}
                                className="text-left text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </button>
                        ) : isComingSoon ? (
                             <button
                                disabled
                                className="text-sm text-left text-gray-500 cursor-not-allowed"
                                title={t('blogComingSoon')}
                            >
                                {link.name}
                            </button>
                        ) : (
                            <a 
                                href={link.href || '#'} 
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                                {...(link.href && link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            >
                                {link.name}
                            </a>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <footer id="footer" className="border-t border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <h4 className="text-2xl font-serif font-bold text-white mb-4">{siteConfig.company.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                            {t(siteConfig.company.descriptionId)}
                        </p>
                         <div>
                            <h5 className="font-bold text-gray-200 mb-4 uppercase tracking-wider text-sm">{t('footer_contactUs_title')}</h5>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-start">
                                    <Icon id="map-pin" className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <a href={siteConfig.company.mapsUrl} target="_blank" rel="noopener noreferrer" className="ml-3 hover:text-white transition-colors">
                                        {siteConfig.company.address}
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <Icon id="phone" className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <a href={`tel:${siteConfig.company.phone}`} className="ml-3 hover:text-white transition-colors">
                                        {siteConfig.company.phone}
                                    </a>
                                </li>
                                <li className="flex items-center">
                                    <Icon id="mail" className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <a href={`mailto:${siteConfig.company.email}`} className="ml-3 hover:text-white transition-colors">
                                        {siteConfig.company.email}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6">{t('footer_services_title')}</h4>
                            {renderLinks(footerLinks.services)}
                        </div>
                        
                        <div>
                            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6">{t('footer_company_title')}</h4>
                            {renderLinks(footerLinks.company)}
                        </div>

                        <div>
                            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-6">{t('footer_support_title')}</h4>
                            {renderLinks(footerLinks.support)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-6 border-t border-gray-800">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500 text-center sm:text-left">
                            &copy; {new Date().getFullYear()} {t('footer_copyright')}
                        </p>
                        <div className="flex justify-center gap-6">
                            <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                                <Icon id="facebook" className="w-6 h-6" />
                            </a>
                            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                                <Icon id="instagram" className="w-6 h-6" />
                            </a>
                            <a href={siteConfig.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                                <Icon id="tiktok" className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                 </div>
            </div>
        </footer>
    );
};

export default Footer;
