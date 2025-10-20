export function initBlackhole(container, onEnterCallback) {
    let h, w, cw, ch, maxorbit, centery, centerx;
    let startTime, currentTime = 0;
    let stars = [];
    let collapse = false;
    let expanse = false;
    let canvas, context, animationFrameId, resizeTimeout;

    // White, Gold (#D4AF37), Silver (#E0E0E0)
    const starColors = ['255,255,255', '212,175,55', '224,224,224'];

    function setDPI(canvas, dpi) {
        if (!canvas.style.width) canvas.style.width = canvas.width + 'px';
        if (!canvas.style.height) canvas.style.height = canvas.height + 'px';

        const scaleFactor = dpi / 96;
        canvas.width = Math.ceil(container.offsetWidth * scaleFactor);
        canvas.height = Math.ceil(container.offsetHeight * scaleFactor);
        const ctx = canvas.getContext('2d');
        ctx.scale(scaleFactor, scaleFactor);
    }

    function rotate(cx, cy, x, y, angle) {
        const radians = angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    class Star {
        constructor() {
            const rands = [
                Math.random() * (maxorbit / 2) + 1,
                Math.random() * (maxorbit / 2) + maxorbit
            ];
            this.orbital = rands.reduce((p, c) => p + c, 0) / rands.length;
            this.x = centerx;
            this.y = centery + this.orbital;
            this.yOrigin = this.y;
            this.speed = (Math.random() * 2.5 + 1.5) * Math.PI / 180;
            this.rotation = 0;
            this.startRotation = (Math.random() * 360 + 1) * Math.PI / 180;
            this.id = stars.length;
            this.collapseBonus = Math.max(0, this.orbital - (maxorbit * 0.7));
            
            const randomColorRGB = starColors[Math.floor(Math.random() * starColors.length)];
            this.color = `rgba(${randomColorRGB},${1 - (this.orbital / 255)})`;
            
            this.hoverPos = centery + (maxorbit / 2) + this.collapseBonus;
            this.expansePos = centery + (this.id % 100) * -10 + (Math.random() * 20 + 1);
            this.prevR = this.startRotation;
            this.prevX = this.x;
            this.prevY = this.y;
            this.originalY = this.yOrigin;
            stars.push(this);
        }

        draw() {
            if (!expanse) {
                this.rotation = this.startRotation + (currentTime * this.speed);
                if (!collapse) {
                    if (this.y > this.yOrigin) this.y -= 2.5;
                    if (this.y < this.yOrigin - 4) this.y += (this.yOrigin - this.y) / 10;
                } else {
                    if (this.y > this.hoverPos) this.y -= (this.hoverPos - this.y) / -5;
                    if (this.y < this.hoverPos - 4) this.y += 2.5;
                }
            } else {
                this.rotation = this.startRotation + (currentTime * (this.speed / 2));
                if (this.y > this.expansePos) this.y -= Math.floor(this.expansePos - this.y) / -80;
            }

            context.save();
            context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.beginPath();
            const oldPos = rotate(centerx, centery, this.prevX, this.prevY, -this.prevR);
            context.moveTo(oldPos[0], oldPos[1]);
            context.translate(centerx, centery);
            context.rotate(this.rotation);
            context.translate(-centerx, -centery);
            context.lineTo(this.x, this.y);
            context.stroke();
            context.restore();

            this.prevR = this.rotation;
            this.prevX = this.x;
            this.prevY = this.y;
        }
    }

    function loop() {
        const now = new Date().getTime();
        currentTime = (now - startTime) / 50;
        context.fillStyle = 'rgba(0,0,0,0.2)'; // AMOLED Black with fade effect
        context.fillRect(0, 0, cw, ch);
        stars.forEach(star => star.draw());
        animationFrameId = requestAnimationFrame(loop);
    }

    function setup() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        h = container.offsetHeight;
        w = container.offsetWidth;
        cw = w;
        ch = h;
        maxorbit = 255;
        centery = ch / 2;
        centerx = cw / 2;
        
        canvas.width = cw;
        canvas.height = ch;
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
        setDPI(canvas, 192);
        
        context.globalCompositeOperation = "multiply";
        
        stars = [];
        const starCount = window.innerWidth > 768 ? 2500 : 1500;
        for (let i = 0; i < starCount; i++) new Star();

        startTime = new Date().getTime();
        context.fillStyle = 'rgba(0,0,0,1)'; // AMOLED Black initial fill
        context.fillRect(0, 0, cw, ch);
        loop();
    }

    const centerHover = container.querySelector('.centerHover');
    let hasEntered = false;

    const enterHandler = () => {
        if (hasEntered) return;
        hasEntered = true;
        collapse = false;
        expanse = true;
        if (centerHover) centerHover.classList.add('open');
        // Delay the callback to allow the 'expanse' animation to be visible
        setTimeout(onEnterCallback, 1200);
    };

    const keydownHandler = e => { if (e.key === 'Enter') { e.preventDefault(); enterHandler(); } };
    const mouseoverHandler = () => { if (!expanse) collapse = true; };
    const mouseoutHandler = () => { if (!expanse) collapse = false; };
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setup, 250);
    };

    if (centerHover) {
        centerHover.addEventListener('click', enterHandler);
        centerHover.addEventListener('mouseover', mouseoverHandler);
        centerHover.addEventListener('mouseout', mouseoutHandler);
    }
    document.addEventListener('keydown', keydownHandler);
    window.addEventListener('resize', handleResize);

    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    context = canvas.getContext("2d");
    
    setup();

    return () => {
        if (centerHover) {
            centerHover.removeEventListener('click', enterHandler);
            centerHover.removeEventListener('mouseover', mouseoverHandler);
            centerHover.removeEventListener('mouseout', mouseoutHandler);
        }
        document.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (container && canvas) {
            try { container.removeChild(canvas); } catch(e) {}
        }
    };
}
