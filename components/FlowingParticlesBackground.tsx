import React, { useRef, useEffect } from 'react';

interface FlowingParticlesBackgroundProps {
    isExiting?: boolean;
}

const FlowingParticlesBackground: React.FC<FlowingParticlesBackgroundProps> = ({ isExiting = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        
        const setup = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            particles = [];
            const numParticles = window.innerWidth > 768 ? 400 : 200;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(canvas.clientWidth, canvas.clientHeight));
            }
        };

        class Particle {
            x: number; y: number; oldX: number; oldY: number; life: number; maxLife: number;
            color: string; width: number;

            constructor(width: number, height: number) {
                this.reset(width, height);
            }

            update(width: number, height: number, isExiting: boolean) {
                const angle = (Math.cos(this.x / (width * 0.4)) + Math.sin(this.y / (height * 0.4))) * Math.PI;
                const speed = isExiting ? 15 : 1.2;
                
                this.oldX = this.x;
                this.oldY = this.y;
                this.x += Math.cos(angle) * speed;
                this.y += Math.sin(angle) * speed;
                this.life--;

                if (this.life <= 0 || this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
                    if (!isExiting) {
                        this.reset(width, height);
                    }
                }
            }

            reset(width: number, height: number) {
                 this.x = Math.random() * width;
                 this.y = Math.random() * height;
                 this.oldX = this.x;
                 this.oldY = this.y;
                 this.maxLife = Math.random() * 150 + 80;
                 this.life = this.maxLife;
                 const colors = ['rgba(212, 175, 55, 0.7)', 'rgba(255, 255, 255, 0.6)', 'rgba(212, 175, 55, 0.4)'];
                 this.color = colors[Math.floor(Math.random() * colors.length)];
                 this.width = Math.random() * 1.2 + 0.3;
            }

            draw(context: CanvasRenderingContext2D) {
                context.beginPath();
                context.strokeStyle = this.color;
                context.lineWidth = this.width;
                context.moveTo(this.oldX, this.oldY);
                context.lineTo(this.x, this.y);
                context.stroke();
            }
        }
        
        const animate = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(width, height, isExiting);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        
        setup();
        animate();
        
        const handleResize = () => setup();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isExiting]);

    return <canvas ref={canvasRef} className="global-background-canvas" />;
};

export default FlowingParticlesBackground;