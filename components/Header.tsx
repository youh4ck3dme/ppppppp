import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from './Icons';
import LiveWidget from './LiveWidget';

interface NavLinkProps {
    intent: NavigationIntent;
    labelKey: string;
    onNavigate: (intent: NavigationIntent) => void;
    onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ intent, labelKey, onNavigate, onClick }) => {
    const { t } = useTranslation();
    const handleClick = () => {
        onNavigate(intent);
        if (onClick) {
            onClick();
        }
    };
    return (
        <button
            onClick={handleClick}
            className="nav-link"
        >
            {t(labelKey)}
        </button>
    );
};

interface ExternalLinkProps {
    href: string;
    labelKey: string;
    onClick?: () => void;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, labelKey, onClick }) => {
    const { t } = useTranslation();
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className="nav-link"
        >
            {t(labelKey)}
        </a>
    );
};

interface HeaderProps {
    onNavigate: (intent: NavigationIntent) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isMenuOpen, setIsMenuOpen }) => {
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const { isAuthenticated } = useAuth();
    const headerRef = useRef<HTMLElement>(null);

    const navLinks: { intent: NavigationIntent; labelKey: string }[] = [
        { intent: { view: 'about' }, labelKey: 'nav_about' },
        { intent: { view: 'main', sectionId: 'services' }, labelKey: 'navServices' },
    ];

    const externalNavLinks = [
        { href: 'http://www.goldhaircare.sk/affiliate/2208', labelKey: 'navEshop' },
        { href: 'https://services.bookio.com/papi-hair-design/widget/pricing', labelKey: 'navBooking' },
    ];
    
    const MobileMenu = () => (
         <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
             <div className="flex justify-end items-center p-4 h-20 border-b border-gray-800">
                 <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="icon-btn">
                    <Icon id="close" className="w-8 h-8 text-gray-300" />
                 </button>
             </div>
             <nav className="flex flex-col items-center justify-center flex-grow gap-8 -mb-20">
                 {navLinks.map(link => (
                    <NavLink
                        key={link.labelKey}
                        {...link}
                        onNavigate={onNavigate}
                        onClick={() => setIsMenuOpen(false)}
                    />
                 ))}
                 {externalNavLinks.map(link => (
                     <ExternalLink
                        key={link.labelKey}
                        {...link}
                        onClick={() => setIsMenuOpen(false)}
                    />
                 ))}
             </nav>
         </div>
    );

    return (
        <>
        <header
            ref={headerRef}
            className="absolute top-0 left-0 right-0 z-50"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left side: Empty for balance */}
                    <div className="flex-1 flex justify-start">
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
                        {navLinks.map(link => (
                            <NavLink key={link.labelKey} {...link} onNavigate={onNavigate} />
                        ))}
                        {externalNavLinks.map(link => (
                            <ExternalLink key={link.labelKey} {...link} />
                        ))}
                    </nav>

                    {/* Right-side controls */}
                    <div className="flex-1 flex justify-end">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="hidden md:block">
                                <LiveWidget />
                            </div>
                            <div className="lang-switcher">
                                <button 
                                    onClick={() => setLanguage('sk')}
                                    className={`lang-switcher-btn ${language === 'sk' ? 'active' : ''}`}
                                >
                                    SK
                                </button>
                                <button 
                                    onClick={() => setLanguage('en')}
                                    className={`lang-switcher-btn ${language === 'en' ? 'active' : ''}`}
                                >
                                    EN
                                </button>
                            </div>
                            <button onClick={() => onNavigate({ view: isAuthenticated ? 'profile' : 'admin' })} className="icon-btn" aria-label={isAuthenticated ? t('profile_button_aria_view') : t('profile_button_aria_login')}>
                                <Icon id="user" className="w-6 h-6" />
                            </button>
                            
                            {/* Mobile menu button */}
                            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden icon-btn" aria-label="Open menu">
                               <Icon id="menu" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <MobileMenu />
        </>
    );
};

export default Header;