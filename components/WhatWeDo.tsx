/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SectionHeader from './SectionHeader';
import { Icon } from './Icons';

interface CardProps {
    data: {
        id: string;
        iconId: string;
        titleId: string;
        subtitleId: string;
    };
}

const Card: React.FC<CardProps> = ({ data }) => {
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        const rotateX = (y / height - 0.5) * -20; // Max rotation 10 degrees
        const rotateY = (x / width - 0.5) * 20;  // Max rotation 10 degrees

        cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
        cardRef.current.style.setProperty('--glow-x', `${(x / width) * 100}%`);
        cardRef.current.style.setProperty('--glow-y', `${(y / height) * 100}%`);
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.setProperty('--rotate-x', '0deg');
        cardRef.current.style.setProperty('--rotate-y', '0deg');
    };

    return (
        <div 
            ref={cardRef} 
            className="card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            role="group"
            aria-label={`${t(data.titleId)}: ${t(data.subtitleId)}`}
        >
            <div className="card-content">
                <div className="card-icon" aria-hidden="true">
                    <Icon id={data.iconId as any} />
                </div>
                <div className="card-text-content">
                    <h3 className="card-title">{t(data.titleId)}</h3>
                    <p className="card-subtitle">{t(data.subtitleId)}</p>
                </div>
            </div>
        </div>
    );
};

const WhatWeDo: React.FC = () => {
    const { t } = useTranslation();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    const whatWeDoCards = t('whatWeDoCards') || [];

    return (
        <section 
            ref={ref}
            id="what-we-do" 
            className={`min-h-screen flex flex-col items-center justify-center py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title={t('whatWeDoTitle')} subtitle={t('whatWeDoSubtitle')} />
                <div className={`card-container stagger-children ${isVisible ? 'is-visible' : ''}`}>
                    {whatWeDoCards.map((card: any) => (
                        <Card key={card.id} data={card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
