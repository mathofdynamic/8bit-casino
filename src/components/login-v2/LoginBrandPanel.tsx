/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoBadge, CasinoPanel } from '../ui-v2';

export const LoginBrandPanel: React.FC = () => {
  return (
    <CasinoPanel 
      chamfer={16} 
      borderColor="strong" 
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-6">
        {/* Title Block */}
        <div>
          <span className="font-jersey text-base text-[#54D6D9] uppercase tracking-widest block mb-1">
            WELCOME TO
          </span>
          <h2 className="font-jersey text-5xl xl:text-6xl text-[#F6B73C] uppercase tracking-wider leading-none m-0 filter drop-shadow-[3px_3px_0px_#000000]">
            8BIT CASINO
          </h2>
          <p className="font-jersey text-xl text-[#F3EBD8] uppercase tracking-wide mt-2 leading-tight">
            PLAY THE TABLES. MASTER THE ARCADE.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2">
          <CasinoBadge variant="cyan">PLAY-MONEY ONLY</CasinoBadge>
          <CasinoBadge variant="gold">POKER &amp; ARCADE</CasinoBadge>
          <CasinoBadge variant="magenta">PERSISTENT PROGRESS</CasinoBadge>
        </div>

        {/* Abstract Pixel Casino Graphic (Cards & Chips SVG Geometry) */}
        <div 
          className="relative w-full aspect-[16/9] max-h-[220px] bg-[#0B0D18] border-2 border-[#2E3150] p-4 flex items-center justify-center overflow-hidden my-4"
          style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
        >
          {/* Subtle felt glow */}
          <div className="absolute inset-0 bg-[#1e5631]/20 pointer-events-none" />

          {/* Pixel Card & Chip Stack Composition */}
          <div className="relative z-10 flex items-center justify-center gap-4">
            {/* Ace of Spades Card */}
            <div 
              className="w-20 h-28 bg-[#F3EBD8] border-2 border-black p-2 flex flex-col justify-between shadow-[4px_4px_0_#000] rotate-[-6deg] transition-transform hover:rotate-0"
              style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
            >
              <div className="font-jersey text-lg text-black leading-none font-bold">A</div>
              <div className="self-center font-jersey text-3xl text-black">♠</div>
              <div className="self-end font-jersey text-lg text-black leading-none font-bold rotate-180">A</div>
            </div>

            {/* King of Hearts Card */}
            <div 
              className="w-20 h-28 bg-[#F3EBD8] border-2 border-black p-2 flex flex-col justify-between shadow-[4px_4px_0_#000] rotate-[6deg] -ml-6 transition-transform hover:rotate-0"
              style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
            >
              <div className="font-jersey text-lg text-[#E85D68] leading-none font-bold">K</div>
              <div className="self-center font-jersey text-3xl text-[#E85D68]">♥</div>
              <div className="self-end font-jersey text-lg text-[#E85D68] leading-none font-bold rotate-180">K</div>
            </div>

            {/* Pixel Chip Stack */}
            <div className="flex flex-col gap-1 items-center ml-2">
              <div 
                className="w-12 h-4 bg-[#F6B73C] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000]"
                style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}
              >
                <div className="w-8 h-1 bg-[#784E00]" />
              </div>
              <div 
                className="w-12 h-4 bg-[#54D6D9] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000]"
                style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}
              >
                <div className="w-8 h-1 bg-[#005D60]" />
              </div>
              <div 
                className="w-12 h-4 bg-[#D95F9A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000]"
                style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}
              >
                <div className="w-8 h-1 bg-[#57002C]" />
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Copy */}
        <p className="font-jersey text-base text-[#9A9AB5] uppercase leading-relaxed m-0">
          A premium play-money casino with poker tables, arcade games, achievements, and persistent player progression.
        </p>
      </div>
    </CasinoPanel>
  );
};
