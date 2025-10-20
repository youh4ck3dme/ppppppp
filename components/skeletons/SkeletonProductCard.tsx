import React from 'react';

export const SkeletonProductCard: React.FC = () => (
    <div className="product-card">
        <div className="product-image-wrapper skeleton-shimmer"></div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="h-6 skeleton-shimmer rounded w-3/4 mb-2"></div>
            <div className="space-y-2 flex-grow mb-4">
                <div className="h-4 skeleton-shimmer rounded"></div>
                <div className="h-4 skeleton-shimmer rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center mt-auto">
                <div className="h-8 skeleton-shimmer rounded w-1/3"></div>
                <div className="h-8 bg-white/20 rounded-full w-24"></div>
            </div>
        </div>
    </div>
);