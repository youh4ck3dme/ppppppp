import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <h2 className="text-5xl md:text-6xl font-bold text-white">{title}</h2>
            {subtitle && (
                <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">{subtitle}</p>
            )}
        </div>
    );
};

export default SectionHeader;