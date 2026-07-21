/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Particle {
  id: number;
  top: string;
  left: string;
  color: string;
  size: string;
  dx: string;
  dy: string;
  isPlus?: boolean;
}

const PARTICLES: Particle[] = [
  { id: 1, top: '45%', left: '48%', color: '#F6B73C', size: 'w-3 h-3', dx: '-60px', dy: '-80px' },
  { id: 2, top: '45%', left: '52%', color: '#54D6D9', size: 'w-2.5 h-2.5', dx: '70px', dy: '-90px' },
  { id: 3, top: '50%', left: '45%', color: '#D95F9A', size: 'w-3 h-3', dx: '-90px', dy: '-40px', isPlus: true },
  { id: 4, top: '50%', left: '55%', color: '#F3EBD8', size: 'w-2.5 h-2.5', dx: '90px', dy: '-30px' },
  { id: 5, top: '48%', left: '50%', color: '#F6B73C', size: 'w-3 h-3', dx: '-20px', dy: '-110px', isPlus: true },
  { id: 6, top: '52%', left: '47%', color: '#54D6D9', size: 'w-2 h-2', dx: '-80px', dy: '40px' },
  { id: 7, top: '52%', left: '53%', color: '#D95F9A', size: 'w-3 h-3', dx: '80px', dy: '50px' },
  { id: 8, top: '46%', left: '46%', color: '#F3EBD8', size: 'w-2.5 h-2.5', dx: '-110px', dy: '-70px' },
  { id: 9, top: '46%', left: '54%', color: '#F6B73C', size: 'w-3 h-3', dx: '110px', dy: '-80px', isPlus: true },
  { id: 10, top: '54%', left: '49%', color: '#54D6D9', size: 'w-2.5 h-2.5', dx: '-30px', dy: '80px' },
  { id: 11, top: '54%', left: '51%', color: '#D95F9A', size: 'w-3 h-3', dx: '40px', dy: '90px', isPlus: true },
  { id: 12, top: '49%', left: '50%', color: '#F3EBD8', size: 'w-2 h-2', dx: '10px', dy: '-120px' },
];

export const LoginCelebration: React.FC = () => {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-[90] overflow-hidden"
    >
      <style>{`
        @keyframes pixelBurst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.5);
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(1.2);
          }
        }
        .animate-pixel-burst {
          animation: pixelBurst 950ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.size} animate-pixel-burst`}
          style={{
            top: p.top,
            left: p.left,
            backgroundColor: p.isPlus ? 'transparent' : p.color,
            ['--dx' as any]: p.dx,
            ['--dy' as any]: p.dy,
          }}
        >
          {p.isPlus && (
            <div className="relative w-full h-full">
              <div className="absolute inset-x-0 top-1/3 bottom-1/3" style={{ backgroundColor: p.color }} />
              <div className="absolute inset-y-0 left-1/3 right-1/3" style={{ backgroundColor: p.color }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
