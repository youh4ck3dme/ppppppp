import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
// Fix: The 'Product' type is defined in 'types.ts', not 'constants.ts'.
import { ProductDetail } from '../constants';
import { Product } from '../types';
import { Icon } from './Icons';
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null | undefined;
    productDetail: ProductDetail | null | undefined;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product, productDetail }) => {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { addNotification } = useNotification();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentImageIndex(0); // Reset image on new product
    }, [productDetail]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            addNotification({
                type: 'success',
                title: t('notification_productAdded_title'),
                message: t('notification_productAdded_message').replace('{productName}', t(product.nameId)),
            });
            onClose();
        }
    };
    
    if (!isOpen || !productDetail || !product) return null;

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % productDetail.images.length);
    };
    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + productDetail.images.length) % productDetail.images.length);
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
                <div className="w-full md:w-1/2 relative bg-white flex items-center justify-center">
                    <img 
                        src={productDetail.images[currentImageIndex]} 
                        alt={`${t(product.nameId)} - ${currentImageIndex + 1}`} 
                        className="w-full h-64 md:h-full object-contain"
                    />
                    {productDetail.images.length > 1 && (
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
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white flex-grow pr-4">{t(product.nameId)}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0" aria-label="Close dialog">
                                <Icon id="close" className="w-6 h-6"/>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                             <div>
                                <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_product_details')}</h3>
                                <p className="text-gray-300">{t(productDetail.longDescriptionId)}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_key_benefits')}</h3>
                                <div className="text-gray-300 prose-sm" dangerouslySetInnerHTML={{ __html: t(productDetail.keyBenefitsId) }}></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_how_to_use')}</h3>
                                <div className="text-gray-300 prose-sm" dangerouslySetInnerHTML={{ __html: t(productDetail.howToUseId) }}></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-accent)] mb-2">{t('modal_suitable_for')}</h3>
                                <p className="text-gray-300">{t(productDetail.suitableForId)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 mt-6 pt-6 border-t border-gray-700">
                         <div className="flex justify-between items-center">
                            <p className="text-3xl font-bold text-white">{product.price.toFixed(2)} €</p>
                             <button onClick={handleAddToCart} className="add-to-cart-button !px-6 !py-3">
                                {t('shop_addToCart')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;