
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates and manages a performant, 2-layer parallax starfield animation on a canvas.
 *
 * @param {HTMLCanvasElement} canvas The canvas element to draw on.
 * @param {object} [options] Optional configuration.
 * @param {number} [options.starCount=800] The total number of stars to render.
 * @param {number} [options.speed=0.05] The base animation speed.
 * @param {string} [options.nearStarColor='#FFFFFF'] The color of the nearest stars.
 * @param {string} [options.farStarColor='#B2B2B2'] The color of the farthest stars.
 * @returns {{ unmount: () => void }} An object with an `unmount` function to clean up.
 */
export function createStarfield(canvas, options = {}) {
  const {
    starCount = 800,
    speed = 0.05,
    nearStarColor = '#FFFFFF',
    farStarColor = '#B2B2B2',
  } = options;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let stars = [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    stars = Array.from({ length: starCount }, () => createStar());
  }

  function createStar() {
    return {
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      z: Math.random() * 2 + 0.5, // Two layers: z is between 0.5 and 2.5
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    stars.forEach(star => {
      ctx.beginPath();
      // Farther stars (lower z) are smaller and dimmer
      const radius = 1 / star.z;
      const alpha = 1 / (star.z * 1.5);
      const color = star.z > 1.5 ? nearStarColor : farStarColor;
      
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.arc(star.x, star.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
  }
  
  function update() {
    const effectiveSpeed = prefersReducedMotion.matches ? speed * 0.1 : speed;

    stars.forEach(star => {
      // Speed is proportional to the inverse of depth (farther stars move slower)
      star.y += effectiveSpeed * (1 / star.z);
      if (star.y > canvas.clientHeight) {
        Object.assign(star, createStar(), { y: 0 });
      }
    });
  }

  function animate() {
    draw();
    update();
    animationFrameId = requestAnimationFrame(animate);
  }

  function handleResize() {
    setup();
  }

  window.addEventListener('resize', handleResize);
  prefersReducedMotion.addEventListener('change', handleResize);

  // Initial setup
  setup();
  animate();

  return {
    unmount: () => {
      window.removeEventListener('resize', handleResize);
      prefersReducedMotion.removeEventListener('change', handleResize);
      cancelAnimationFrame(animationFrameId);
    },
  };
}
