import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { ServiceDetail } from '../constants';
import { Icon } from './Icons';

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceDetail: ServiceDetail | null;
}

const StructuredContent: React.FC<{ contentKey: string }> = ({ contentKey }) => {
    const { tStructured } = useTranslation();
    const content = tStructured(contentKey);

    if (!Array.isArray(content)) {
        return <p>{String(content)}</p>;
    }
    
    return (
        <>
            {content.map((block, index) => {
                switch (block.type) {
                    case 'p':
                        return <p key={index} className="text-gray-300">{block.content}</p>;
                    default:
                        return null;
                }
            })}
        </>
    );
};

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ isOpen, onClose, serviceDetail }) => {
    const { t } = useTranslation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentImageIndex(0); // Reset image on new service
    }, [serviceDetail]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    if (!isOpen || !serviceDetail) return null;

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % serviceDetail.images.length);
    };
    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + serviceDetail.images.length) % serviceDetail.images.length);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                ref={modalRef}
                className="bg-gray-900/80 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 relative">
                    <img 
                        src={serviceDetail.images[currentImageIndex]} 
                        alt={`${t(`service_${serviceDetail.id}_name`)} inspiration ${currentImageIndex + 1}`} 
                        className="w-full h-64 md:h-full object-cover"
                    />
                    {serviceDetail.images.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors" aria-label="Previous image">
                                &lt;
                            </button>
                            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors" aria-label="Next image">
                                &gt;
                            </button>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-serif font-bold text-white">{t(`service_${serviceDetail.id}_name`)}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close dialog">
                            <Icon id="close" className="w-6 h-6"/>
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_what_to_expect')}</h3>
                            <StructuredContent contentKey={serviceDetail.processDescriptionTextId} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_duration')}</h3>
                            <p className="text-gray-300">{t(serviceDetail.durationTextId)}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_best_for')}</h3>
                            <p className="text-gray-300">{t(serviceDetail.bestForTextId)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailModal;
