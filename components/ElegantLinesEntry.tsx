import React, { useRef, useEffect, useState } from 'react';
import FlowingParticlesBackground from './FlowingParticlesBackground';

interface ElegantLinesEntryProps {
    onEnter: () => void;
}

const ElegantLinesEntry: React.FC<ElegantLinesEntryProps> = ({ onEnter }) => {
    const buttonCanvasRef = useRef<HTMLCanvasElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const [isExiting, setIsExiting] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsContentVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);
    
    // Effect for the "Liquid Gold" button background animation
    useEffect(() => {
        const canvas = buttonCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lines: any[] = [];
        let frame = 0;

        const setup = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            
            lines = Array.from({ length: 5 }, () => ({
                y: Math.random() * rect.height,
                speed: Math.random() * 0.2 + 0.1,
                amplitude: Math.random() * (rect.height / 20) + (rect.height / 30),
                frequency: Math.random() * 0.02 + 0.01,
                opacity: Math.random() * 0.4 + 0.2
            }));
        };

        const animateButton = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            lines.forEach(line => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(212, 175, 55, ${line.opacity})`;
                ctx.lineWidth = 1.5;
                
                for (let x = 0; x < width; x++) {
                    const yPos = line.y + Math.sin(x * line.frequency + frame * 0.05) * line.amplitude;
                    x === 0 ? ctx.moveTo(x, yPos) : ctx.lineTo(x, yPos);
                }
                ctx.stroke();
                
                line.y += line.speed;
                if (line.y > height + 10) line.y = -10;
            });
            
            frame++;
            animationFrameId = requestAnimationFrame(animateButton);
        };

        setup();
        animateButton();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current;
        if (!button || !textRef.current) return;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        textRef.current.style.transform = `translate(${deltaX * 6}px, ${deltaY * 6}px)`;
    };

     const handleMouseLeave = () => {
        if (textRef.current) textRef.current.style.transform = `translate(0, 0)`;
    };

    const handleEnterClick = () => {
        if (isExiting) return;
        setIsExiting(true);
        setTimeout(onEnter, 500); // Match CSS transition duration
    };
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleEnterClick();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isExiting, onEnter]);

    return (
        <div className={`entry-animation-container ${isExiting ? 'exiting' : ''}`}>
            <FlowingParticlesBackground isExiting={isExiting} />
            <div className="entry-center">
                <button 
                    ref={buttonRef}
                    onClick={handleEnterClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={`entry-button ${isContentVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
                    aria-label="Enter Papi Hair Design"
                >
                    <canvas ref={buttonCanvasRef} className="entry-button-canvas" />
                    <span ref={textRef} className="entry-text-layer text-3d">PAPI</span>
                </button>
                <h2 className={`entry-subtitle sheen-effect ${isContentVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
                    Hair Design
                </h2>
            </div>
        </div>
    );
};

export default ElegantLinesEntry;