import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useProducts } from '../context/ProductContext';
import { NavigationIntent } from '../App';
import SectionHeader from './SectionHeader';
import { ProductCard } from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { productDetails } from '../constants';

interface FeaturedProductsProps {
    onNavigate: (intent: NavigationIntent) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { products } = useProducts();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Use all 9 products for the 3x3 grid
    const featuredProducts = products.slice(0, 9);
        
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
            <section
                ref={ref}
                id="featured-products"
                className={`min-h-screen flex flex-col items-center justify-center py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title={t('featuredProducts_title')} subtitle={t('featuredProducts_subtitle')} />
                    
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children ${isVisible ? 'is-visible' : ''}`}>
                        {featuredProducts.map((product, index) => (
                            <div key={product.id} style={{ animationDelay: `${index * 100}ms` }}>
                               <ProductCard product={product} onShowDetails={handleShowDetails} />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-20">
                        <button
                            onClick={() => onNavigate({ view: 'shop' })}
                            className="btn-primary"
                        >
                            <span className="text-base">{t('featuredProducts_button')}</span>
                        </button>
                    </div>
                </div>
            </section>
            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
                productDetail={selectedProductDetail}
            />
        </>
    );
};

export default FeaturedProducts;