import React, { useState, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SectionHeader from './SectionHeader';
import { Icon } from './Icons';
import ServiceDetailModal from './ServiceDetailModal';

interface Service {
    id: string;
    price: number;
}

interface ServiceDetail {
  id: string;
  images: string[];
  processDescriptionTextId: string;
  durationTextId: string;
  bestForTextId: string;
}

interface ServiceGroup {
    categoryId: string;
    services: Service[];
}

const Services: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'womens' | 'mens'>('womens');
    const { ref: animationRef, isVisible } = useScrollAnimation<HTMLElement>();
    const sectionRef = useRef<HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

    const womensServices = t('womensServices') as ServiceGroup[] || [];
    const mensServices = t('mensServices') as ServiceGroup[] || [];
    const serviceDetails = t('serviceDetails') as ServiceDetail[] || [];

    const servicesToDisplay = activeTab === 'womens' ? womensServices : mensServices;
    
    const handleTabChange = (tabName: 'womens' | 'mens') => {
        setActiveTab(tabName);
        if (sectionRef.current) {
             const headerOffset = 80; // Výška hlavičky
             const elementPosition = sectionRef.current.getBoundingClientRect().top;
             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
             window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }
    
    const handleShowDetails = (serviceId: string) => {
        const detail = serviceDetails.find(d => d.id === serviceId);
        if (detail) {
            setSelectedService(detail);
            setIsModalOpen(true);
        }
    };

    const TabButton: React.FC<{ tabName: 'womens' | 'mens', label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => handleTabChange(tabName)}
            className={`
                relative px-4 py-2 text-lg sm:text-xl font-serif font-bold transition-colors duration-300
                ${activeTab === tabName 
                    ? 'text-white' 
                    : 'text-gray-500 hover:text-white'
                }
            `}
        >
            {label}
            <span
              className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-[var(--color-accent)] transform transition-transform duration-300 ${activeTab === tabName ? 'scale-x-100' : 'scale-x-0'}`}>
            </span>
        </button>
    );

    return (
        <>
            <section 
                ref={(el) => {
                    if(el) {
                        (animationRef as React.MutableRefObject<HTMLElement>).current = el;
                        sectionRef.current = el;
                    }
                }}
                id="services" 
                className={`min-h-screen flex flex-col items-center justify-center py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title={t('servicesTitle')} subtitle={t('servicesSubtitle')} />

                    <div className="flex justify-center items-center gap-4 sm:gap-8 mb-12 md:mb-16">
                        <TabButton tabName="womens" label={t('services_womens_tab')} />
                        <TabButton tabName="mens" label={t('services_mens_tab')} />
                    </div>

                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 lg:gap-x-16">
                        {servicesToDisplay.map((category) => (
                            <div key={category.categoryId}>
                                <h3 className="category-title">
                                    {t(`services_${category.categoryId}_title`)}
                                </h3>
                                <ul className="space-y-5">
                                    {category.services.map((service) => {
                                        const hasDetails = serviceDetails.some(d => d.id === service.id);
                                        return (
                                            <li key={service.id} className="flex justify-between items-start gap-4 text-gray-300">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-medium">{t(`service_${service.id}_name`)}</span>
                                                        <button 
                                                            onClick={() => handleShowDetails(service.id)} 
                                                            className={`${hasDetails ? 'text-gray-500 hover:text-[var(--color-accent)]' : 'text-gray-800 cursor-not-allowed'} transition-colors`}
                                                            aria-label={`Viac informácií o ${t(`service_${service.id}_name`)}`}
                                                            disabled={!hasDetails}
                                                        >
                                                            <Icon id="info" className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="flex-shrink-0 text-lg font-bold text-white">{service.price.toFixed(2)} €</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {activeTab === 'womens' && (
                         <div className="text-center mt-16 md:mt-20">
                            <p className="text-sm text-gray-500 max-w-3xl mx-auto">
                               {t('services_disclaimer')}
                            </p>
                        </div>
                    )}
                </div>
            </section>
            <ServiceDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceDetail={selectedService}
            />
        </>
    );
};

export default Services;
