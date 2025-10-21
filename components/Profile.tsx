import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { useSavedLooks } from '../context/SavedLooksContext';
import { useProducts } from '../context/ProductContext';
import { Icon, IconId } from './Icons';
import { NavigationIntent } from '../App';
import { Visit, Purchase } from '../types';
import { useProfileNotifications, ProfileNotification } from '../context/ProfileNotificationContext';

type ProfileTab = 'history' | 'looks' | 'purchases' | 'vip' | 'notifications' | 'settings';

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`profile-tab ${isActive ? 'active' : ''}`}
        role="tab"
        aria-selected={isActive}
    >
        {label}
    </button>
);

const VisitHistory: React.FC = () => {
    const { t } = useTranslation();
    const userVisitHistory = t('userVisitHistory') || [];
    const teamMembers = t('team') || [];
    const womensServices = t('womensServices') || [];
    const mensServices = t('mensServices') || [];

    const allServices = useMemo(() => {
        const servicesMap = new Map<string, string>();
        [...womensServices, ...mensServices].forEach(category => {
            category.services.forEach(service => {
                servicesMap.set(service.id, t(`service_${service.id}_name`));
            });
        });
        return servicesMap;
    }, [t, womensServices, mensServices]);

    const getStylistName = (id: string) => teamMembers.find(m => m.id === id)?.name || id;

    return (
        <div className="space-y-6">
            {userVisitHistory.map((visit: Visit) => (
                <div key={visit.id} className="history-item">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                        <p className="font-bold text-lg text-white">{new Date(visit.date).toLocaleDateString('sk-SK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm text-gray-400">{t('profile_history_stylist')}: <span className="font-semibold text-gray-300">{getStylistName(visit.stylistId)}</span></p>
                    </div>
                    <ul className="list-disc list-inside text-gray-300">
                        {visit.serviceIds.map(id => <li key={id}>{allServices.get(id) || id}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );
};

const SavedLooks: React.FC = () => {
    const { t } = useTranslation();
    const { savedLooks, removeLook } = useSavedLooks();

    return (
        <div>
            {savedLooks.length > 0 ? (
                <div className="saved-looks-grid">
                    {savedLooks.map((look, index) => (
                        <div key={index} className="saved-look-card group">
                            <img src={look} alt={`${t('profile_looks_savedLook')} ${index + 1}`} loading="lazy" />
                            <div className="saved-look-overlay">
                                <button onClick={() => removeLook(look)} className="text-white hover:text-red-500 transition-colors" aria-label={t('profile_looks_remove')}>
                                    <Icon id="trash-2" className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 py-10">{t('profile_looks_empty')}</p>
            )}
        </div>
    );
};

const PurchaseHistory: React.FC = () => {
    const { t } = useTranslation();
    const { products } = useProducts();
    const userPurchaseHistory = t('userPurchaseHistory') || [];
    const getProductName = (id: string) => t(products.find(p => p.id === id)?.nameId || 'Unknown Product');

    return (
        <div className="space-y-6">
            {userPurchaseHistory.map((purchase: Purchase) => (
                <div key={purchase.orderId} className="history-item">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                        <p className="font-bold text-lg text-white">{t('profile_purchases_order')} #{purchase.orderId}</p>
                        <p className="text-sm text-gray-400">{new Date(purchase.date).toLocaleDateString()}</p>
                    </div>
                    <ul className="mb-3 text-gray-300">
                        {purchase.items.map(item => (
                            <li key={item.productId} className="flex justify-between">
                                <span>{getProductName(item.productId)} x{item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)} €</span>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right font-bold text-white border-t border-gray-700 pt-2">{t('profile_purchases_total')}: {purchase.total.toFixed(2)} €</div>
                </div>
            ))}
        </div>
    );
};

const VipStatus: React.FC = () => {
    const { t } = useTranslation();
    const userVipStatus = t('userVipStatus');
    if (!userVipStatus) return null;
    const { levelId, points, pointsToNextLevel, memberSince } = userVipStatus;
    const progressPercentage = (points / (points + pointsToNextLevel)) * 100;

    return (
        <div className="card space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-serif font-bold text-[var(--color-accent)]">{t(levelId)}</h3>
                <p className="text-gray-400">{t('profile_vip_memberSince')} {new Date(memberSince).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
                <p className="font-bold text-white text-lg">{t('profile_vip_points')}: <span className="text-[var(--color-accent)]">{points}</span></p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-[var(--color-accent)] h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-sm text-gray-400 text-right">{pointsToNextLevel} {t('profile_vip_pointsToNext')}</p>
            </div>
            <div>
                 <h4 className="font-bold text-white text-xl mb-3">{t('profile_vip_benefits_title')}</h4>
                 <ul className="list-disc list-inside text-gray-300 space-y-1">
                     <li>{t('vip_benefit1_title')}</li>
                     <li>{t('vip_benefit2_title')}</li>
                     <li>{t('vip_benefit3_title')}</li>
                 </ul>
            </div>
        </div>
    );
};

const ProactiveNotifications: React.FC<{onNavigate: (intent: NavigationIntent) => void}> = ({onNavigate}) => {
    const { t } = useTranslation();
    const { notifications, markAsRead } = useProfileNotifications();

    if (notifications.filter(n => !n.isRead).length === 0) {
        return <p className="text-center text-gray-400 py-10">{t('profile_no_notifications')}</p>;
    }

    const handleAction = (notification: ProfileNotification) => {
        if (notification.type === 'haircut_reminder') {
            onNavigate({ view: 'booking' });
        } else if (notification.type === 'product_restock') {
            onNavigate({ view: 'shop' });
        }
        markAsRead(notification.id);
    };

    const getIconId = (type: ProfileNotification['type']): IconId => {
        switch (type) {
            case 'haircut_reminder': return 'scissors';
            case 'product_restock': return 'shopping-cart';
            default: return 'info';
        }
    };

    return (
        <div className="space-y-4">
            {notifications.filter(n => !n.isRead).map(n => (
                <div key={n.id} className="notification-item flex items-start gap-4 text-left w-full p-4">
                    <Icon id={getIconId(n.type)} className="w-6 h-6 text-[var(--color-accent)] flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                        <p className="font-semibold text-white">{n.message}</p>
                        <button onClick={() => handleAction(n)} className="text-sm text-[var(--color-accent)] hover:underline font-bold mt-2">
                            {t('profile_notification_cta')}
                        </button>
                    </div>
                    <button onClick={() => markAsRead(n.id)} className="text-gray-500 hover:text-white flex-shrink-0" aria-label={t('profile_notification_dismiss')}>
                        <Icon id="close" className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
};

const SettingsTab: React.FC<{onNavigate: (intent: NavigationIntent) => void}> = ({onNavigate}) => {
    const { t } = useTranslation();
    
    const handleStartOnboarding = () => {
        // Use sessionStorage to signal the app to start the guide
        sessionStorage.setItem('start_onboarding', 'true');
        // Navigate home, which will trigger the guide logic in App.tsx
        onNavigate({ view: 'main' });
    };

    return (
        <div className="space-y-6">
            <div className="history-item">
                <h3 className="text-xl font-bold text-white mb-2">{t('profile_settings_onboarding_title')}</h3>
                <p className="text-gray-400 mb-4">{t('profile_settings_onboarding_desc')}</p>
                <button onClick={handleStartOnboarding} className="btn-secondary">
                    <span className="!rounded-md">{t('profile_settings_onboarding_cta')}</span>
                </button>
            </div>
        </div>
    );
};


const Profile: React.FC<{onNavigate: (intent: NavigationIntent) => void}> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<ProfileTab>('history');
    
    const handleLogout = () => {
        logout();
        onNavigate({ view: 'main' });
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'history': return <VisitHistory />;
            case 'looks': return <SavedLooks />;
            case 'purchases': return <PurchaseHistory />;
            case 'vip': return <VipStatus />;
            case 'notifications': return <ProactiveNotifications onNavigate={onNavigate} />;
            case 'settings': return <SettingsTab onNavigate={onNavigate} />;
            default: return null;
        }
    };
    
    const tabData = [
        { id: 'history', label: t('profile_tab_history') },
        { id: 'looks', label: t('profile_tab_looks') },
        { id: 'purchases', label: t('profile_tab_purchases') },
        { id: 'vip', label: t('profile_tab_vip') },
        { id: 'notifications', label: t('profile_tab_notifications') },
        { id: 'settings', label: t('profile_tab_settings') },
    ];

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white">
                        {t('profile_title')}
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary mt-4 sm:mt-0"
                    >
                        <span className="!rounded-md flex items-center gap-2">
                            <Icon id="log-out" className="w-5 h-5" />
                            {t('profile_logout')}
                        </span>
                    </button>
                </div>
                
                <div className="content-pane">
                    <div className="profile-tabs" role="tablist">
                        {tabData.map(tab => (
                            <TabButton
                                key={tab.id}
                                label={tab.label}
                                isActive={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id as ProfileTab)}
                            />
                        ))}
                    </div>

                    <div role="tabpanel">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;