import React, { useRef } from 'react';

interface AnimatedPapiLogoProps {
    variant: 'header' | 'entry';
}

const AnimatedPapiLogo: React.FC<AnimatedPapiLogoProps> = ({ variant }) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container || !textRef.current) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const multiplier = variant === 'header' ? 3 : 6;

        textRef.current.style.transform = `translate(${deltaX * multiplier}px, ${deltaY * multiplier}px)`;
    };

    const handleMouseLeave = () => {
        if (textRef.current) {
            textRef.current.style.transform = `translate(0, 0)`;
        }
    };

    return (
        <div 
            ref={containerRef}
            className={`animated-papi-logo-container ${variant}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <span ref={textRef} className="animated-papi-logo-text text-3d">PAPI</span>
        </div>
    );
};

export default AnimatedPapiLogo;
