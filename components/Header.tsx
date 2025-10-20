import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import { useCart } from '../context/CartContext';
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

interface HeaderProps {
    onNavigate: (intent: NavigationIntent) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isMenuOpen, setIsMenuOpen }) => {
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const { cartCount, setIsCartOpen } = useCart();
    const { isAuthenticated } = useAuth();
    const headerRef = useRef<HTMLElement>(null);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
             const now = new Date();
             setCurrentTime(now.toLocaleTimeString('sk-SK', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }));
        };
        updateClock();
        const timerId = setInterval(updateClock, 1000);
        return () => clearInterval(timerId);
    }, []);

    // FIX: Add an explicit type annotation to `navLinks` to prevent TypeScript from widening the `view` property to `string`.
    const navLinks: { intent: NavigationIntent; labelKey: string }[] = [
        { intent: { view: 'about' }, labelKey: 'nav_about' },
        { intent: { view: 'main', sectionId: 'services' }, labelKey: 'navServices' },
        { intent: { view: 'shop' }, labelKey: 'navEshop' },
        { intent: { view: 'main', sectionId: 'virtual-try-on' }, labelKey: 'navVirtualTryOn' },
        { intent: { view: 'main', sectionId: 'blog' }, labelKey: 'navBlog' },
        { intent: { view: 'booking' }, labelKey: 'navBooking' },
    ];
    
    const MobileMenu = () => (
         <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
             <div className="flex justify-between items-center p-4 h-20 border-b border-gray-800">
                <div className="flex items-center">
                     <span className="text-lg font-mono text-white tracking-widest">
                        {currentTime}
                    </span>
                </div>
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
                    {/* Left side: Clock on mobile/tablet */}
                    <div className="flex-1 flex justify-start">
                        <span className="block lg:hidden text-lg font-mono text-white tracking-widest">
                            {currentTime}
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
                        {navLinks.map(link => (
                            <NavLink key={link.labelKey} {...link} onNavigate={onNavigate} />
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
                            <button onClick={() => setIsCartOpen(true)} className="icon-btn relative" aria-label="View shopping cart">
                                <Icon id="shopping-cart" className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
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