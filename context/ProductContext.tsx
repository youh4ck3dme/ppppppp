import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../constants';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getInitialState = (): Product[] => {
    try {
        const item = window.localStorage.getItem('papi_products');
        if (item) {
            return JSON.parse(item);
        }
        // If no products in localStorage, initialize from constants and save
        window.localStorage.setItem('papi_products', JSON.stringify(initialProducts));
        return initialProducts;
    } catch (error) {
        console.warn('Error reading products from localStorage', error);
        return initialProducts;
    }
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(getInitialState);

    useEffect(() => {
        try {
            window.localStorage.setItem('papi_products', JSON.stringify(products));
        } catch (error) {
            console.error('Error saving products to localStorage', error);
        }
    }, [products]);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...productData,
            id: `prod_${new Date().getTime()}`,
        };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    };

    const deleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
