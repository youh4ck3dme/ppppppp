import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useNotification } from '../hooks/useNotification';
import { Icon } from './Icons';

const VipBenefit: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="vip-benefit">
        <div className="vip-benefit-icon-wrapper">
            {icon}
        </div>
        <div>
            <h4 className="vip-benefit-title">{title}</h4>
            <p className="vip-benefit-description">{description}</p>
        </div>
    </div>
);

const VipClub: React.FC = () => {
    const { t } = useTranslation();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    const { addNotification } = useNotification();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const benefits = [
        {
            icon: <Icon id="credit-card" className="w-8 h-8" />,
            title: t('vip_benefit1_title'),
            description: t('vip_benefit1_desc')
        },
        {
            icon: <Icon id="gift" className="w-8 h-8" />,
            title: t('vip_benefit2_title'),
            description: t('vip_benefit2_desc')
        },
        {
            icon: <Icon id="calendar-check" className="w-8 h-8" />,
            title: t('vip_benefit3_title'),
            description: t('vip_benefit3_desc')
        }
    ];
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            addNotification({
                type: 'error',
                title: t('vip_notification_error_title'),
                message: t('vip_notification_error_message'),
            });
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            addNotification({
                type: 'success',
                title: t('vip_notification_success_title'),
                message: t('vip_notification_success_message'),
            });
            setEmail('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <section
            ref={ref}
            id="vip-club"
            className={`min-h-screen flex flex-col items-center justify-center py-20 text-gray-300 overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div className={`stagger-children ${isVisible ? 'is-visible' : ''}`}>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                            {t('vip_title')}
                        </h2>
                        <p className="text-lg text-gray-300 mb-10">
                            {t('vip_subtitle')}
                        </p>
                        <div className="space-y-8">
                            {benefits.map(b => <VipBenefit key={b.title} {...b} />)}
                        </div>
                    </div>
                    <div className={`stagger-children ${isVisible ? 'is-visible' : ''}`} style={{animationDelay: '300ms'}}>
                        <form onSubmit={handleSubmit} className="vip-form" noValidate>
                           <h3 className="text-2xl font-serif font-bold text-white mb-6 text-center">
                               {t('vip_form_title')}
                           </h3>
                           <label htmlFor="vip-email" className="sr-only">{t('vip_form_placeholder')}</label>
                            <input
                                id="vip-email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('vip_form_placeholder')}
                                className="vip-form-input"
                                required
                            />
                            <button type="submit" className="vip-form-button" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                                ) : (
                                    t('vip_form_button')
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VipClub;