import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { useTranslation } from '../hooks/useTranslation';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import ProductEditModal from './ProductEditModal';
import { Icon } from './Icons';

const AdminPanel: React.FC = () => {
    const { t } = useTranslation();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const handleOpenModal = (product: Product | null) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setProductToEdit(null);
        setIsModalOpen(false);
    };

    const handleSaveProduct = (productData: Product | Omit<Product, 'id'>) => {
        if ('id' in productData) {
            updateProduct(productData);
        } else {
            addProduct(productData);
        }
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Naozaj chcete odstrániť tento produkt?')) {
            deleteProduct(productId);
        }
    };

    return (
        <>
            <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                        <SectionHeader title={t('admin_panel_title')} subtitle={'Správa Produktov'} />
                        <button onClick={() => handleOpenModal(null)} className="btn-primary">
                            Pridať Nový Produkt
                        </button>
                    </div>

                    <div className="content-pane">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left text-gray-300">
                                <thead className="border-b border-gray-700 text-sm uppercase text-gray-400">
                                    <tr>
                                        <th className="py-3 px-4">Obrázok</th>
                                        <th className="py-3 px-4">Názov</th>
                                        <th className="py-3 px-4">Cena</th>
                                        <th className="py-3 px-4 text-right">Akcie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                            <td className="py-3 px-4">
                                                <img src={product.image} alt={t(product.nameId)} className="w-12 h-12 object-cover rounded-md" />
                                            </td>
                                            <td className="py-3 px-4 font-bold text-white">{t(product.nameId)}</td>
                                            <td className="py-3 px-4">{product.price.toFixed(2)} €</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-4">
                                                    <button onClick={() => handleOpenModal(product)} className="text-blue-400 hover:text-blue-300" aria-label={`Upraviť ${t(product.nameId)}`}>
                                                        <Icon id="settings" className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-400" aria-label={`Odstrániť ${t(product.nameId)}`}>
                                                        <Icon id="trash-2" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <ProductEditModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
        </>
    );
};

export default AdminPanel;
