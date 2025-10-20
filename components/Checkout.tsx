import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useCart } from '../context/CartContext';
import { useNotification } from '../hooks/useNotification';
import { NavigationIntent } from '../App';
import SectionHeader from './SectionHeader';
import { Icon } from './Icons';

interface CheckoutProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { cartItems, cartTotal, clearCart, cartCount } = useCart();
    const { addNotification } = useNotification();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip) {
            addNotification({ type: 'error', title: t('checkout_error_title'), message: t('checkout_error_message') });
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            addNotification({ type: 'success', title: t('checkout_success_title'), message: t('checkout_success_message') });
            clearCart();
            setIsProcessing(false);
            onNavigate({ view: 'main' });
        }, 2000);
    };

    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <SectionHeader title={t('checkout_title')} subtitle={t('checkout_subtitle')} />
                
                {cartCount === 0 && !isProcessing ? (
                    <div className="text-center py-16 content-pane">
                        <h2 className="text-2xl font-bold text-white mb-4">{t('cart_empty')}</h2>
                        <button onClick={() => onNavigate({ view: 'shop' })} className="btn-primary">
                            <span>{t('checkout_return_to_shop')}</span>
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Form Section */}
                            <div className="content-pane !p-8">
                                <h2 className="text-2xl font-serif font-bold text-white mb-6">{t('checkout_shipping_title')}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="sr-only">{t('checkout_form_name')}</label>
                                        <input type="text" name="name" id="name" placeholder={t('checkout_form_name')} className="form-input" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="sr-only">{t('checkout_form_email')}</label>
                                        <input type="email" name="email" id="email" placeholder={t('checkout_form_email')} className="form-input" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="sr-only">{t('checkout_form_address')}</label>
                                        <input type="text" name="address" id="address" placeholder={t('checkout_form_address')} className="form-input" value={formData.address} onChange={handleInputChange} required />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-grow">
                                            <label htmlFor="city" className="sr-only">{t('checkout_form_city')}</label>
                                            <input type="text" name="city" id="city" placeholder={t('checkout_form_city')} className="form-input" value={formData.city} onChange={handleInputChange} required />
                                        </div>
                                        <div className="sm:w-1/3">
                                            <label htmlFor="zip" className="sr-only">{t('checkout_form_zip')}</label>
                                            <input type="text" name="zip" id="zip" placeholder={t('checkout_form_zip')} className="form-input" value={formData.zip} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="content-pane !p-8">
                                <h2 className="text-2xl font-serif font-bold text-white mb-6">{t('checkout_summary_title')}</h2>
                                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-gray-300">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={t(item.nameId)} className="w-12 h-12 object-cover rounded" loading="lazy" />
                                                <div>
                                                    <p className="font-bold text-white">{t(item.nameId)}</p>
                                                    <p className="text-sm">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-white">{(item.price * item.quantity).toFixed(2)} €</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 mt-6 pt-6">
                                    <div className="flex justify-between font-bold text-lg text-white">
                                        <span>{t('checkout_total')}</span>
                                        <span>{cartTotal.toFixed(2)} €</span>
                                    </div>
                                    <button type="submit" className="btn-primary w-full mt-6" disabled={isProcessing}>
                                        <span>
                                        {isProcessing ? (
                                            <div className="flex justify-center items-center">
                                                <Icon id="loader" className="w-5 h-5 animate-spin mr-2"/>
                                                {t('checkout_processing')}
                                            </div>
                                        ) : t('checkout_place_order')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Checkout;