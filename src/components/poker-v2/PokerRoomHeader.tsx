/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';

export const PokerRoomHeader: React.FC = () => {
  const { profile } = useStore();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#2E3150] bg-[#15182A] px-4 py-4 md:px-6 select-none font-jersey">
      {/* Branding Header Area with CSS card-and-chip motif */}
      <div className="flex items-center gap-4">
        {/* CSS Card & Chip Motif */}
        <div className="relative w-12 h-12 shrink-0 bg-[#1D2036] border-2 border-[#2E3150] flex items-center justify-center" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
          {/* Card shape */}
          <div className="absolute top-1.5 left-2.5 w-5 h-7 bg-[#F2EAD3] border border-black/20 rounded-sm flex items-center justify-center font-bold text-[10px] text-red-600 select-none">
            A♦
          </div>
          {/* Chip shape */}
          <div className="absolute bottom-1 right-2 w-6 h-6 rounded-full bg-[#F6B73C] border-2 border-dashed border-[#0B0D18] flex items-center justify-center shadow-md animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-[#15182A]" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl text-[#F6B73C] tracking-widest font-jersey uppercase leading-none">
            POKER ROOM
          </h1>
          <p className="font-jersey text-xs md:text-sm text-[#9A9AB5] uppercase mt-1 tracking-wide leading-none">
            Choose a table, set your stakes, and take your seat.
          </p>
        </div>
      </div>

      {/* Lobby stats plaques */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Poker Rank */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-1.5 flex flex-col justify-center min-w-[100px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#3FF7FF] text-lg font-bold leading-none">GOLD IV</span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            POKER RANK
          </span>
        </div>

        {/* Available Coins */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-1.5 flex flex-col justify-center min-w-[110px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#FFD23F] text-lg font-bold leading-none">
            ${profile.chips.toFixed(2)}
          </span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            AVAILABLE COINS
          </span>
        </div>

        {/* Poker Wins */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-1.5 flex flex-col justify-center min-w-[90px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#3FFF6E] text-lg font-bold leading-none">128</span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            POKER WINS
          </span>
        </div>

        {/* Current Streak */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-1.5 flex flex-col justify-center min-w-[100px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#FF3F8E] text-lg font-bold leading-none">
            {profile.dailyStreak} DAYS
          </span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            CURRENT STREAK
          </span>
        </div>
      </div>
    </div>
  );
};
