import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { NavigationIntent } from '../App';
import { teamMembers, womensServices, mensServices } from '../constants';
import { siteConfig } from '../config/siteConfig';
import SectionHeader from './SectionHeader';

interface BookingProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const Booking: React.FC<BookingProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    const [serviceType, setServiceType] = useState<'womens' | 'mens' | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [stylist, setStylist] = useState<string>('any');
    const [dateTime, setDateTime] = useState('');
    const [minDateTime, setMinDateTime] = useState('');

    useEffect(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone for input
        now.setSeconds(0);
        now.setMilliseconds(0);
        const formatted = now.toISOString().slice(0, 16);
        setDateTime(formatted);
        setMinDateTime(formatted);
    }, []);

    const handleProceed = () => {
        const bookingUrl = new URL(siteConfig.links.booking);

        if (stylist !== 'any') {
            // Assuming bookio accepts a 'staff_id' parameter.
            bookingUrl.searchParams.append('staff_id', stylist);
        }
        if (selectedServices.length > 0) {
            // Assuming bookio accepts 'service_ids' as a comma-separated list.
            bookingUrl.searchParams.append('service_ids', selectedServices.join(','));
        }
        if (dateTime) {
            // Assuming bookio accepts a 'datetime' parameter.
            bookingUrl.searchParams.append('datetime', dateTime);
        }

        window.open(bookingUrl.toString(), '_blank', 'noopener,noreferrer');
    };
    
    const handleServiceToggle = (serviceId: string) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const serviceCategories = serviceType === 'womens' ? womensServices : mensServices;

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
                <SectionHeader title={t('booking_title')} subtitle={t('booking_subtitle')} />

                <div className="content-pane !p-8 md:!p-12 space-y-10">
                    {/* Step 1: Service Type */}
                    <div>
                        <h2 className="form-step-title">{t('booking_step1_title')}</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    setServiceType('womens');
                                    setSelectedServices([]); // Reset services on type change
                                }}
                                className={`flex-1 booking-option-btn ${serviceType === 'womens' ? 'active' : ''}`}
                            >
                                {t('services_womens_tab')}
                            </button>
                            <button
                                onClick={() => {
                                    setServiceType('mens');
                                    setSelectedServices([]); // Reset services on type change
                                }}
                                className={`flex-1 booking-option-btn ${serviceType === 'mens' ? 'active' : ''}`}
                            >
                                {t('services_mens_tab')}
                            </button>
                        </div>
                    </div>
                    
                    {/* Step 2: Select Services */}
                    {serviceType && (
                        <div className="animate-fade-in-up">
                            <h2 className="form-step-title">{t('booking_step2_title')}</h2>
                            <div className="space-y-6">
                                {serviceCategories.map(category => (
                                    <div key={category.categoryId}>
                                        <h3 className="text-xl font-semibold text-white mb-4 border-b border-[var(--color-border-primary)] pb-2">{t(`services_${category.categoryId}_title`)}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {category.services.map(service => (
                                                <button
                                                    key={service.id}
                                                    onClick={() => handleServiceToggle(service.id)}
                                                    className={`w-full text-left p-3 border-2 rounded-lg transition-all duration-200 flex justify-between items-center ${selectedServices.includes(service.id) ? 'active bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-accent-text)]' : 'border-[var(--color-border-primary)] hover:border-[var(--color-accent)]'}`}
                                                >
                                                    <span className="font-semibold">{t(`service_${service.id}_name`)}</span>
                                                    <span className="font-bold text-lg">{service.price.toFixed(2)} €</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Stylist */}
                    <div className={`${!serviceType ? 'opacity-50' : ''} transition-opacity`}>
                        <h2 className="form-step-title">{t('booking_step3_title')}</h2>
                        <select
                            id="stylist"
                            name="stylist"
                            value={stylist}
                            onChange={(e) => setStylist(e.target.value)}
                            className="form-input"
                            disabled={!serviceType}
                        >
                            <option value="any">{t('booking_stylist_anyone')}</option>
                            {teamMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Step 4: Date & Time */}
                    <div className={`${!serviceType ? 'opacity-50' : ''} transition-opacity`}>
                        <h2 className="form-step-title">{t('booking_step4_title')}</h2>
                         <input
                            type="datetime-local"
                            className="form-input"
                            disabled={!serviceType}
                            value={dateTime}
                            onChange={e => setDateTime(e.target.value)}
                            min={minDateTime}
                        />
                    </div>

                     {/* Step 5: Notes */}
                    <div className={`${!serviceType ? 'opacity-50' : ''} transition-opacity`}>
                        <h2 className="form-step-title">{t('booking_step5_title')}</h2>
                         <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            placeholder={t('booking_notes_placeholder')}
                            className="form-input !rounded-xl"
                            disabled={!serviceType}
                        />
                    </div>

                    {/* Step 6: Final Step */}
                     <div>
                        <h2 className="form-step-title">{t('booking_step6_title')}</h2>
                        <button
                            onClick={handleProceed}
                            className="btn-primary w-full"
                            disabled={!serviceType || selectedServices.length === 0}
                        >
                            <span>{t('booking_button_proceed')}</span>
                        </button>
                        {(!serviceType || selectedServices.length === 0) && <p className="text-center text-sm text-yellow-400 mt-4">{t('booking_select_service_first')}</p>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Booking;