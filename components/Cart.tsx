

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { CartItem } from '../types';
import { Icon } from './Icons';

const Cart: React.FC = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { t } = useTranslation();

    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const cartPanelRef = useRef<HTMLDivElement>(null);
    const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (isCartOpen) {
            setLastFocusedElement(document.activeElement as HTMLElement);
            // Timeout to allow panel to transition in before focusing
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key !== 'Tab' || !cartPanelRef.current) return;
                
                const focusableElements = Array.from(
                    cartPanelRef.current.querySelectorAll<HTMLElement>(
                        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), input[type="number"]:not([disabled]), select:not([disabled])'
                    )
                );

                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        (lastElement as HTMLElement).focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        (firstElement as HTMLElement).focus();
                        e.preventDefault();
                    }
                }
            };
            
            const handleEscapeKey = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsCartOpen(false);
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keydown', handleEscapeKey);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keydown', handleEscapeKey);
            };

        } else if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }, [isCartOpen, lastFocusedElement, setIsCartOpen]);


    const handleQuantityChange = (id: string, newQuantity: string) => {
        const quantity = parseInt(newQuantity, 10);
        if (!isNaN(quantity)) {
            updateQuantity(id, quantity);
        }
    };
    
    const handleCheckout = () => {
        setIsCartOpen(false);
        // Add a small delay to allow the cart to close before navigating
        setTimeout(() => {
            window.location.hash = 'checkout';
        }, 300);
    };

    return (
        <>
            <div 
                className={`cart-overlay ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
                onClick={() => setIsCartOpen(false)}
                aria-hidden={!isCartOpen}
            />
            <aside 
                ref={cartPanelRef}
                className={`cart-panel ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
                hidden={!isCartOpen}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 id="cart-title" className="text-2xl font-serif font-bold text-white">{t('cart_title')}</h2>
                    <button ref={closeButtonRef} onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors" aria-label="Close cart">
                        <Icon id="close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">{t('cart_empty')}</p>
                    ) : (
                        <ul className="space-y-6">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex gap-4">
                                    <img src={item.image} alt={t(item.nameId)} loading="lazy" className="w-20 h-20 object-cover rounded-md" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-white">{t(item.nameId)}</h3>
                                        <p className="text-sm text-gray-400">{(item.price * item.quantity).toFixed(2)} €</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <input 
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-16 p-1 border border-gray-600 rounded-md text-center bg-gray-800 text-white"
                                                aria-label={t('cart_quantity')}
                                            />
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={t('cart_remove')}>
                                                <Icon id="trash-2" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-white">{t('cart_subtotal')}</span>
                            <span className="text-xl font-bold text-white">{cartTotal.toFixed(2)} €</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full btn-primary">
                            <span className="text-base">{t('cart_checkout')}</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Cart;