import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface ProfileNotification {
    id: string;
    type: 'haircut_reminder' | 'product_restock';
    message: string;
    relatedId?: string; // e.g., product ID
    isRead: boolean;
    createdAt: string;
}

interface ProfileNotificationContextType {
    notifications: ProfileNotification[];
    markAsRead: (id: string) => void;
    addProfileNotification: (notification: Omit<ProfileNotification, 'id' | 'isRead' | 'createdAt'>) => void;
}

const ProfileNotificationContext = createContext<ProfileNotificationContextType | undefined>(undefined);

const getInitialNotifications = (): ProfileNotification[] => {
    try {
        const item = window.localStorage.getItem('papi_profile_notifications');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.warn('Could not read profile notifications from localStorage', error);
        return [];
    }
};


export const ProfileNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<ProfileNotification[]>(getInitialNotifications);

    useEffect(() => {
        try {
            window.localStorage.setItem('papi_profile_notifications', JSON.stringify(notifications));
        } catch (error) {
            console.warn('Could not save profile notifications to localStorage', error);
        }
    }, [notifications]);

    const addProfileNotification = (notification: Omit<ProfileNotification, 'id' | 'isRead' | 'createdAt'>) => {
        setNotifications(prev => {
            // Avoid adding duplicate unread notifications
            const exists = prev.some(n => n.type === notification.type && n.relatedId === notification.relatedId && !n.isRead);
            if (exists) return prev;
            
            const newNotification: ProfileNotification = {
                ...notification,
                id: `${notification.type}-${notification.relatedId || ''}-${Date.now()}`,
                isRead: false,
                createdAt: new Date().toISOString()
            };
            return [newNotification, ...prev];
        });
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    return (
        <ProfileNotificationContext.Provider value={{ notifications, addProfileNotification, markAsRead }}>
            {children}
        </ProfileNotificationContext.Provider>
    );
};

export const useProfileNotifications = () => {
    const context = useContext(ProfileNotificationContext);
    if (!context) {
        throw new Error('useProfileNotifications must be used within a ProfileNotificationProvider');
    }
    return context;
};
