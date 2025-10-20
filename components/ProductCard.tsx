import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';
import { Icon } from './Icons';

export const ProductCard: React.FC<{ product: Product; onShowDetails: (productId: string) => void; }> = ({ product, onShowDetails }) => {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { addNotification } = useNotification();

    const handleAddToCart = () => {
        addToCart(product);
        addNotification({
            type: 'success',
            title: t('notification_productAdded_title'),
            message: t('notification_productAdded_message').replace('{productName}', t(product.nameId)),
        });
    };

    return (
        <div className="product-card group">
            <div className="product-image-wrapper">
                <img src={product.image} alt={t(product.nameId)} className="product-image" loading="lazy" />
                <button 
                    onClick={() => onShowDetails(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/40 rounded-full text-white hover:text-[var(--color-accent)] hover:bg-black/60 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    aria-label={`Viac informácií o ${t(product.nameId)}`}
                >
                    <Icon id="info" className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-white mb-2 flex-grow">{t(product.nameId)}</h3>
                <p className="text-sm text-gray-400 mb-4">{t(product.descriptionId)}</p>
                <div className="flex justify-between items-center mt-auto">
                    <p className="text-2xl font-bold text-white">{product.price.toFixed(2)} €</p>
                    <button onClick={handleAddToCart} className="add-to-cart-button">
                        {t('shop_addToCart')}
                    </button>
                </div>
            </div>
        </div>
    );
};