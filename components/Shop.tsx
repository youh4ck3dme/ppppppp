import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import SectionHeader from './SectionHeader';
import { SkeletonProductCard } from './skeletons/SkeletonProductCard';
import ProductDetailModal from './ProductDetailModal';
import { productDetails } from '../constants';

const Shop: React.FC = () => {
    const { t } = useTranslation();
    const { products } = useProducts();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleShowDetails = (productId: string) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };
    
    const selectedProduct = products.find(p => p.id === selectedProductId);
    const selectedProductDetail = productDetails.find(d => d.id === selectedProductId);

    return (
        <>
            <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto animate-fade-in-up">
                    <SectionHeader title={t('shop_title')} subtitle={t('shop_subtitle')} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, index) => <SkeletonProductCard key={index} />)
                        ) : (
                            products.map(product => (
                                <ProductCard key={product.id} product={product} onShowDetails={handleShowDetails} />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
                productDetail={selectedProductDetail}
            />
        </>
    );
};

export default Shop;