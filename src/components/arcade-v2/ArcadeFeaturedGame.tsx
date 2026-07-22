/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArcadeGameData } from './arcadeTypes';
import { CasinoBadge, CasinoButton, CasinoPanel } from '../ui-v2';
import { Play } from 'lucide-react';

interface ArcadeFeaturedGameProps {
  game: ArcadeGameData;
  onSelectGame: (id: 'slots') => void;
}

export const ArcadeFeaturedGame: React.FC<ArcadeFeaturedGameProps> = ({
  game,
  onSelectGame,
}) => {
  return (
    <CasinoPanel
      chamfer={16}
      borderColor="strong"
      className="w-full bg-[#15182A]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-2">
        {/* Left: Pixel Art Slots Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="w-full max-w-sm aspect-video sm:aspect-[4/3] bg-[#0B0D18] border-2 border-[#2E3150] p-4 flex flex-col items-center justify-between relative overflow-hidden"
            style={{
              clipPath:
                'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
            }}
          >
            {/* Top Cabinet Marquee Banner */}
            <div className="w-full bg-[#222744] border border-[#2E3150] py-1 text-center">
              <span className="font-jersey text-xs text-[#F6B73C] tracking-widest uppercase">
                TRIPLE SEVEN REELS
              </span>
            </div>

            {/* 3 Reel Windows */}
            <div className="flex gap-2 sm:gap-3 my-2">
              {/* Reel 1: 7 */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#15182A] border-2 border-[#F6B73C] flex flex-col items-center justify-center p-1 relative">
                <svg viewBox="0 0 16 16" className="w-10 h-10 sm:w-12 sm:h-12" shapeRendering="crispEdges">
                  <rect x="2" y="1" width="12" height="3" fill="#F6B73C" />
                  <rect x="2" y="1" width="12" height="1" fill="#FFFFFF" />
                  <rect x="10" y="4" width="4" height="2" fill="#F6B73C" />
                  <rect x="9" y="6" width="4" height="2" fill="#F6B73C" />
                  <rect x="8" y="8" width="4" height="2" fill="#F6B73C" />
                  <rect x="7" y="10" width="4" height="2" fill="#F6B73C" />
                  <rect x="6" y="12" width="4" height="3" fill="#F6B73C" />
                </svg>
                <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-1">SEVEN</span>
              </div>

              {/* Reel 2: Diamond */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#15182A] border-2 border-[#D95F9A] flex flex-col items-center justify-center p-1 relative">
                <svg viewBox="0 0 16 16" className="w-10 h-10 sm:w-12 sm:h-12" shapeRendering="crispEdges">
                  <rect x="7" y="1" width="2" height="1" fill="#FFFFFF" />
                  <rect x="5" y="2" width="6" height="2" fill="#D95F9A" />
                  <rect x="3" y="4" width="10" height="2" fill="#D95F9A" />
                  <rect x="1" y="6" width="14" height="2" fill="#D95F9A" />
                  <rect x="3" y="8" width="10" height="2" fill="#D95F9A" />
                  <rect x="5" y="10" width="6" height="2" fill="#D95F9A" />
                  <rect x="7" y="12" width="2" height="2" fill="#D95F9A" />
                  <rect x="4" y="4" width="2" height="2" fill="#FFFFFF" />
                </svg>
                <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-1">DIAMOND</span>
              </div>

              {/* Reel 3: Cherry */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#15182A] border-2 border-[#F6B73C] flex flex-col items-center justify-center p-1 relative">
                <svg viewBox="0 0 16 16" className="w-10 h-10 sm:w-12 sm:h-12" shapeRendering="crispEdges">
                  <rect x="7" y="1" width="2" height="1" fill="#66D18F" />
                  <rect x="8" y="2" width="1" height="3" fill="#66D18F" />
                  <rect x="2" y="7" width="5" height="5" fill="#E85D68" />
                  <rect x="9" y="7" width="5" height="5" fill="#E85D68" />
                  <rect x="3" y="8" width="1" height="1" fill="#FFFFFF" />
                  <rect x="10" y="8" width="1" height="1" fill="#FFFFFF" />
                </svg>
                <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-1">CHERRY</span>
              </div>
            </div>

            {/* Bottom payline label */}
            <div className="w-full text-center border-t border-[#2E3150] pt-1">
              <span className="font-jersey text-[11px] text-[#63657A] uppercase tracking-wider">
                PAYLINE ACTIVE • 3-REEL &amp; 5-REEL MODES
              </span>
            </div>
          </div>
        </div>

        {/* Right: Game Info */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CasinoBadge variant="gold" className="font-bold">
                FEATURED
              </CasinoBadge>
              <CasinoBadge variant="dark">
                {game.category}
              </CasinoBadge>
              <CasinoBadge variant="cyan">
                {game.maximumPayoutLabel}
              </CasinoBadge>
              <CasinoBadge variant="dark">
                PLAY-MONEY
              </CasinoBadge>
            </div>

            <h2 className="font-jersey text-3xl md:text-4xl text-[#F3EBD8] uppercase tracking-wide leading-none">
              {game.title}
            </h2>

            <p className="font-jersey text-base md:text-lg text-[#9A9AB5] uppercase leading-snug">
              {game.description}
            </p>
          </div>

          <div className="pt-2">
            <CasinoButton
              type="button"
              variant="gold"
              size="lg"
              soundType="none"
              onClick={() => onSelectGame('slots')}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <div className="flex items-center justify-center gap-2 px-2">
                <Play className="w-5 h-5 fill-black text-black" />
                <span>PLAY 777 REELS</span>
              </div>
            </CasinoButton>
          </div>
        </div>
      </div>
    </CasinoPanel>
  );
};
