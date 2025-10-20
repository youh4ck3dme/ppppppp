

import React, { useState, useEffect, useRef } from 'react';

// Import all components
import Header from './components/Header';
import Hero from './components/Hero';
import WhatWeDo from './components/WhatWeDo';
import AboutPapiGold from './components/AboutPapiGold';
import Services from './components/Services';
import Blog from './components/Blog';
import VipClub from './components/VipClub';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';
import About from './components/About';
import Team from './components/Team';
import Booking from './components/Booking';
// Fix: Commented out unused import for BlogPostDetail as the component is not rendered.
// import BlogPostDetail from './components/BlogPostDetail';
import ProgressBar from './components/ProgressBar';
import Shop from './components/Shop';
import Cart from './components/Cart';
import FeaturedProducts from './components/FeaturedProducts';
import Profile from './components/Profile';
import ChatAssistant from './components/ChatAssistant';
import Checkout from './components/Checkout';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import MetaUpdater from './components/MetaUpdater';
import ElegantLinesEntry from './components/ElegantLinesEntry';
import FlowingParticlesBackground from './components/FlowingParticlesBackground';
import OnboardingGuide from './components/OnboardingGuide'; // Import the new component


// Import contexts and providers
import { AppContextProvider } from './context/AppContext'; // Refactored provider
import { NotificationContainer } from './components/NotificationContainer';
import { useProfileNotifications } from './context/ProfileNotificationContext';
import { useAuth } from './context/AuthContext';
import { useTranslation } from './hooks/useTranslation';
import { checkAndTriggerNotifications } from './services/notificationService';


export type NavigationIntent =
    | { view: 'main'; sectionId?: string }
    | { view: 'about' }
    | { view: 'team' }
    | { view: 'booking' }
    | { view: 'shop' }
    | { view: 'profile' }
    | { view: 'checkout' }
    | { view: 'contact' }
    | { view: 'admin' };

const NotificationTrigger: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { addProfileNotification } = useProfileNotifications();
    const { t } = useTranslation();

    useEffect(() => {
        if (isAuthenticated) {
            const alreadyChecked = sessionStorage.getItem('papi_notif_checked');
            if (!alreadyChecked) {
                checkAndTriggerNotifications({ addProfileNotification, t });
                sessionStorage.setItem('papi_notif_checked', 'true');
            }
        }
    }, [isAuthenticated, addProfileNotification, t]);

    return null; // This component doesn't render anything
};

const getPageMetadata = (intent: NavigationIntent, t: (key: string) => string) => {
    const defaultTitle = 'Papi Hair Design | Luxusné Kaderníctvo Košice';
    const defaultDescription = t('meta_description_default');
    const defaultKeywords = t('meta_keywords_default');

    switch (intent.view) {
        case 'about':
            return { title: `${t('nav_about')} | Papi Hair Design`, description: t('about_text').substring(0, 160).replace(/\s\S*$/, '...'), keywords: `${t('nav_about')}, ${t('about_title')}, ${defaultKeywords}` };
        case 'team':
            return { title: `${t('team_title')} | Papi Hair Design`, description: t('team_subtitle'), keywords: `${t('team_title')}, stylisti, ${defaultKeywords}` };
        case 'booking':
            return { title: `${t('booking_title')} | Papi Hair Design`, description: t('booking_subtitle'), keywords: `online booking, ${t('navBooking')}, ${defaultKeywords}` };
        case 'shop':
            return { title: `${t('shop_title')} | Papi Hair Design`, description: t('shop_subtitle'), keywords: `e-shop, vlasová kozmetika, ${defaultKeywords}` };
        case 'profile':
            return { title: `${t('profile_title')} | Papi Hair Design`, description: t('meta_description_profile'), keywords: `profil, história, VIP, ${defaultKeywords}` };
        case 'checkout':
            return { title: `${t('checkout_title')} | Papi Hair Design`, description: t('checkout_subtitle'), keywords: `pokladňa, nákup, ${defaultKeywords}` };
        case 'contact':
            return { title: `${t('contact_title')} | Papi Hair Design`, description: t('contact_subtitle'), keywords: `kontakt, adresa, ${defaultKeywords}` };
        case 'admin':
            return { title: `Admin | Papi Hair Design`, description: `Administračný panel pre Papi Hair Design.`, keywords: `admin` };
        case 'main':
        default:
            if (intent.sectionId) {
                const sectionTitleMap: { [key: string]: string } = {
                    'services': t('navServices'),
                    'blog': t('gallery_title'), 'vip-club': t('vip_title'),
                    'featured-products': t('featuredProducts_title'), 'instagram-feed': t('instagram_title'),
                    'what-we-do': t('whatWeDoTitle'), 'about-papi-gold': t('papiGoldTitle'),
                };
                const sectionTitle = sectionTitleMap[intent.sectionId] || intent.sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return { title: `${sectionTitle} | Papi Hair Design`, description: defaultDescription, keywords: `${sectionTitle}, ${defaultKeywords}` };
            }
            return { title: defaultTitle, description: defaultDescription, keywords: defaultKeywords };
    }
};


const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const [isShowingEntry, setIsShowingEntry] = useState(true);
    
    // Helper to get the current view from the URL hash
    const getIntentFromHash = (): NavigationIntent => {
        const hash = window.location.hash.slice(1);
        const [path, param] = hash.split('/');

        switch (path) {
            case 'about': return { view: 'about' };
            case 'team': return { view: 'team' };
            case 'booking': return { view: 'booking' };
            case 'shop': return { view: 'shop' };
            case 'profile': return { view: 'profile' };
            case 'checkout': return { view: 'checkout' };
            case 'contact': return { view: 'contact' };
            case 'admin': return { view: 'admin' };
            default:
                // This handles empty hash ('') or section IDs ('services')
                return { view: 'main', sectionId: path || undefined };
        }
    };

    const [navigationIntent, setNavigationIntent] = useState<NavigationIntent>(getIntentFromHash());
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [metadata, setMetadata] = useState(getPageMetadata(navigationIntent, t));
    
    const scrollToSection = (sectionId: string) => {
         setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                const headerOffset = 80;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }, 100);
    };

    // Handles history changes (back/forward buttons, hash changes)
    useEffect(() => {
        const handleHistoryChange = () => {
            setNavigationIntent(getIntentFromHash());
        };
        window.addEventListener('popstate', handleHistoryChange);
        window.addEventListener('hashchange', handleHistoryChange);
        return () => {
            window.removeEventListener('popstate', handleHistoryChange);
            window.removeEventListener('hashchange', handleHistoryChange);
        };
    }, []); // Empty dependency array means this runs once on mount

    const handleNavigate = (intent: NavigationIntent) => {
        let newHash = '';
        switch (intent.view) {
            case 'main': newHash = intent.sectionId || ''; break;
            default: newHash = intent.view;
        }
        
        const currentHash = window.location.hash.slice(1);
        
        if (currentHash === newHash) {
            // If hash is the same, just perform the scroll action
            if (intent.view === 'main' && intent.sectionId) {
                 scrollToSection(intent.sectionId);
            } else {
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            // Update hash and let the event listener handle the state update.
            // Show loading bar for visual transition.
            setIsLoading(true);
            window.location.hash = newHash;
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    };
    
    // This effect runs whenever navigationIntent changes, handling scrolling and metadata
    useEffect(() => {
        if (navigationIntent.view === 'main' && navigationIntent.sectionId) {
           scrollToSection(navigationIntent.sectionId);
        } else if (navigationIntent.view !== 'main' || (navigationIntent.view === 'main' && !navigationIntent.sectionId)) {
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setMetadata(getPageMetadata(navigationIntent, t));
    }, [navigationIntent, t]);
    
    const handleEnter = () => {
        setIsShowingEntry(false);
        // Explicitly navigate to the main page to override any initial hash like #checkout
        handleNavigate({ view: 'main' });
    };

    const renderMainApp = () => (
        <div className={`min-h-screen ${isMenuOpen ? 'menu-open' : ''}`} id="page-content" style={{ backgroundColor: '#000000' }}>
            <ProgressBar isLoading={isLoading} />
            <Header onNavigate={handleNavigate} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <main>
                {renderContent()}
            </main>
            <Footer onNavigate={handleNavigate} />
            <Cart />
            <NotificationContainer />
            <ChatAssistant onNavigate={handleNavigate} />
            <OnboardingGuide onNavigate={handleNavigate} />
        </div>
    );

    const renderContent = () => {
        switch (navigationIntent.view) {
            case 'about': return <About onNavigate={handleNavigate} />;
            case 'team': return <Team onNavigate={handleNavigate} />;
            case 'booking': return <Booking onNavigate={handleNavigate} />;
            case 'shop': return <Shop />;
            case 'profile': return <Profile onNavigate={handleNavigate} />;
            case 'checkout': return <Checkout onNavigate={handleNavigate} />;
            case 'contact': return <Contact onNavigate={handleNavigate} />;
            case 'admin': return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
            case 'main':
            default:
                return (
                    <>
                        <Hero onNavigate={handleNavigate} />
                        <WhatWeDo />
                        <AboutPapiGold />
                        <Services />
                        <Blog />
                        <VipClub />
                        <FeaturedProducts onNavigate={handleNavigate} />
                        <InstagramFeed />
                    </>
                );
        }
    };

    if (isShowingEntry) {
        return <ElegantLinesEntry onEnter={handleEnter} />;
    }

    return (
        <>
            <MetaUpdater title={metadata.title} description={metadata.description} keywords={metadata.keywords} />
            {/* <FlowingParticlesBackground /> */}
            <NotificationTrigger />
            {renderMainApp()}
        </>
    );
};


const App: React.FC = () => {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
};

export default App;
