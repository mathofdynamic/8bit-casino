/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PokerTable } from './pokerTypes';
import { PixelAvatar } from '../../lib/avatars';

interface PokerMiniTablePreviewProps {
  table: PokerTable;
}

export const PokerMiniTablePreview: React.FC<PokerMiniTablePreviewProps> = ({ table }) => {
  // Coordinates for the 6 seats around the oval felt
  // Oval: width=280, height=140, cx=150, cy=95
  const seatPositions = [
    { x: 150, y: 22,  label: "Seat 1 (Top)" },
    { x: 265, y: 55,  label: "Seat 2 (Top Right)" },
    { x: 265, y: 135, label: "Seat 3 (Bottom Right)" },
    { x: 150, y: 168, label: "Seat 4 (Bottom)" },
    { x: 35,  y: 135, label: "Seat 5 (Bottom Left)" },
    { x: 35,  y: 55,  label: "Seat 6 (Top Left)" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-[#0B0D18] border border-[#2E3150] select-none" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
      {/* Title */}
      <div className="w-full text-center border-b border-[#2E3150] pb-1 mb-3">
        <span className="font-jersey text-xs text-[#63657A] uppercase tracking-wider">LIVE TABLE RADAR SCHEMATIC</span>
      </div>

      {/* Seating oval container */}
      <div className="relative w-full aspect-[320/200] max-w-[320px]">
        {/* The green felt background SVG */}
        <svg className="w-full h-full" viewBox="0 0 300 190" fill="none">
          {/* Outermost Wood rail */}
          <rect 
            x="40" 
            y="35" 
            width="220" 
            height="120" 
            rx="60" 
            fill="#7a4b28" 
            stroke="#000" 
            strokeWidth="3.5" 
          />
          
          {/* Inner felt felt */}
          <rect 
            x="48" 
            y="43" 
            width="204" 
            height="104" 
            rx="52" 
            fill="#1e5631" 
            stroke="#123b20" 
            strokeWidth="2.5" 
          />

          {/* Table Center Logo */}
          <text 
            x="150" 
            y="98" 
            fill="#ffd23f" 
            opacity="0.25" 
            fontSize="18" 
            fontFamily="Jersey 25" 
            textAnchor="middle" 
            letterSpacing="2.5"
            fontWeight="bold"
          >
            8-BIT CLUB
          </text>

          {/* Dealer Button Visual Indicator */}
          <circle cx="115" cy="78" r="6" fill="#F3EBD8" stroke="#000" strokeWidth="1.5" />
          <text x="115" y="81" fill="#000" fontSize="8" fontFamily="Jersey 25" textAnchor="middle" fontWeight="bold">D</text>
        </svg>

        {/* Floating Player Seats Bubble Elements */}
        {seatPositions.map((pos, index) => {
          const isFilled = index < table.seatsFilled;
          const bot = isFilled ? table.bots[index] : null;

          return (
            <div 
              key={index}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ 
                left: `${(pos.x / 300) * 100}%`, 
                top: `${(pos.y / 190) * 100}%` 
              }}
            >
              {isFilled && bot ? (
                // Seated Bot layout bubble
                <div className="flex flex-col items-center">
                  <div className="p-0.5 bg-[#F6B73C] border border-black shadow-[1px_1px_0_#000]" style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}>
                    <div className="bg-[#15182A] p-0.5">
                      <PixelAvatar avatarId={bot.avatarId} size={20} />
                    </div>
                  </div>
                  <div className="bg-black/80 px-1 py-0.5 mt-0.5 border border-[#2E3150] whitespace-nowrap" style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}>
                    <p className="font-jersey text-[10px] text-[#F3EBD8] leading-none uppercase">{bot.name}</p>
                    <p className="font-jersey text-[9px] text-[#F6B73C] leading-none text-center mt-0.5">
                      {bot.stack.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                // Open Seat layout bubble
                <div className="flex flex-col items-center opacity-60">
                  <div 
                    className="w-5 h-5 bg-[#0B0D18] border border-dashed border-[#63657A] flex items-center justify-center shadow-[1px_1px_0_#000]" 
                    style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}
                    title="Empty Seat Spot"
                  >
                    <span className="font-jersey text-[10px] text-[#63657A] leading-none">+</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
