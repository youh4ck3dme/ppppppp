import React, { useEffect, useState, useCallback } from 'react';
import { Notification as NotificationDetails, NotificationType } from '../context/NotificationContext';
import { useNotification } from '../hooks/useNotification';
import { Icon, IconId } from './Icons';

const notificationConfig: Record<NotificationType, { iconId: IconId, base: string, iconColor: string }> = {
    info: { iconId: 'info', base: 'bg-gray-800 border-blue-500', iconColor: 'text-blue-500' },
    success: { iconId: 'check-circle', base: 'bg-gray-800 border-green-500', iconColor: 'text-green-500' },
    warning: { iconId: 'alert-triangle', base: 'bg-gray-800 border-yellow-500', iconColor: 'text-yellow-500' },
    error: { iconId: 'alert-circle', base: 'bg-gray-800 border-red-500', iconColor: 'text-red-500' },
};

interface NotificationProps {
    notification: NotificationDetails;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
    const { removeNotification } = useNotification();
    const [isExiting, setIsExiting] = useState(false);
    const { type, title, message, id, duration } = notification;
    const config = notificationConfig[type];

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => removeNotification(id), 300); // Animation duration
    }, [id, removeNotification]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration || 5000);

        return () => clearTimeout(timer);
    }, [duration, handleClose]);


    return (
        <div 
            role="alert" 
            aria-live="assertive"
            className={`
                w-full max-w-sm rounded-lg shadow-lg pointer-events-auto border-l-4
                transition-all duration-300 ease-in-out transform
                ${config.base}
                ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
            style={{ animation: 'slideInFromRight 0.4s ease-out forwards' }}
        >
            <div className="p-4 flex items-start">
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                    <Icon id={config.iconId} className="h-6 w-6" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="mt-1 text-sm text-gray-300">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={handleClose}
                        className="inline-flex rounded-md text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="Close notification"
                    >
                        <Icon id="close" className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};