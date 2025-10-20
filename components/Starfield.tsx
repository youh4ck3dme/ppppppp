
'use client';

import React, { useRef, useEffect } from 'react';
import { createStarfield } from '../lib/starfield';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let unmount: (() => void) | undefined;

    if (canvasRef.current) {
      const starfield = createStarfield(canvasRef.current, {
        starCount: 1000,
        speed: 0.07,
        nearStarColor: '#FFFFFF',
        farStarColor: '#BBBBBB',
      });
      unmount = starfield.unmount;
    }

    return () => {
      if (unmount) {
        unmount();
      }
    };
  }, []);

  return (
    <div className="starfield-wrap">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Starfield;
