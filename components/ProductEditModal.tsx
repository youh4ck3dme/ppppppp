import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Product } from '../types';
import { Icon } from './Icons';

interface ProductEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product | Omit<Product, 'id'>) => void;
    productToEdit: Product | null;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nameId: '',
        descriptionId: '',
        price: 0,
        image: '',
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                nameId: productToEdit.nameId,
                descriptionId: productToEdit.descriptionId,
                price: productToEdit.price,
                image: productToEdit.image,
            });
        } else {
            setFormData({
                nameId: '',
                descriptionId: '',
                price: 0,
                image: '',
            });
        }
    }, [productToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (productToEdit) {
            onSave({ ...formData, id: productToEdit.id });
        } else {
            onSave(formData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" style={{ zIndex: 100, visibility: 'visible', opacity: 1 }}>
            <div
                className="cart-panel !max-w-lg"
                style={{ transform: 'translateX(0)', visibility: 'visible' }}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-serif font-bold text-white">
                        {productToEdit ? 'Upraviť Produkt' : 'Pridať Nový Produkt'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                        <Icon id="close" className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="flex-grow p-6 overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="nameId" className="block text-sm font-medium text-gray-300 mb-1">Name ID (kľúč pre preklad)</label>
                            <input type="text" name="nameId" id="nameId" value={formData.nameId} onChange={handleChange} className="form-input" required />
                        </div>
                        <div>
                            <label htmlFor="descriptionId" className="block text-sm font-medium text-gray-300 mb-1">Description ID (kľúč pre preklad)</label>
                            <textarea name="descriptionId" id="descriptionId" value={formData.descriptionId} onChange={handleChange} className="form-input !rounded-xl" rows={3} required />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Cena (€)</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="form-input" step="0.01" required />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">URL obrázka</label>
                            <input type="text" name="image" id="image" value={formData.image} onChange={handleChange} className="form-input" required />
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-700 mt-auto">
                        <button type="submit" className="w-full btn-primary text-base">
                            Uložiť Produkt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;
