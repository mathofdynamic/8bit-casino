/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { ProgressivePixelImage, CasinoButton } from '../ui-v2';
import { LOBBY_ASSETS } from '../../lib/lobbyAssets';
import { audio } from '../../lib/audio';

export const ContinuePlaying: React.FC = () => {
  const { setRoute } = useStore();

  return (
    <section id="continue-playing" className="space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-[#2E3150] pb-1.5 font-jersey">
        <h3 className="text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none">Continue Playing</h3>
        <span className="text-xs text-[#9A9AB5] uppercase">RECENT SESSION HISTORY</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Lucky 7s */}
        <div 
          className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 cursor-pointer select-none filter drop-shadow-[2px_2px_0px_#000000] group" 
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} 
          onClick={() => { audio.playClick(); setRoute('minigames'); }}
        >
          <div className="w-20 h-20 shrink-0 bg-black border border-[#2E3150] overflow-hidden">
            <ProgressivePixelImage 
              thumbnailSrc={LOBBY_ASSETS.lucky7s.thumbnailSrc} 
              fullSrc={LOBBY_ASSETS.lucky7s.fullSrc} 
              alt="Lucky 7s" 
              aspectRatio="h-full w-full"
              eager={true}
            />
          </div>
          <div className="flex-1 flex flex-col justify-between text-left font-jersey">
            <div>
              <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none">SLOTS GAME</span>
              <h4 className="text-xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Lucky 7s</h4>
              <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Bet: 10 Coins</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#63657A] uppercase">Played 2h ago</span>
              <CasinoButton 
                variant="cyan" 
                size="sm" 
                chamfer={4} 
                className="h-6 px-1 text-xs" 
                soundType="click" 
                onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('minigames'); }}
              >
                RESUME
              </CasinoButton>
            </div>
          </div>
        </div>

        {/* Card 2: Texas Hold'em */}
        <div 
          className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 cursor-pointer select-none filter drop-shadow-[2px_2px_0px_#000000] group" 
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} 
          onClick={() => { audio.playClick(); setRoute('poker'); }}
        >
          <div className="w-20 h-20 shrink-0 bg-black border border-[#2E3150] overflow-hidden">
            <ProgressivePixelImage 
              thumbnailSrc={LOBBY_ASSETS.texasHoldem.thumbnailSrc} 
              fullSrc={LOBBY_ASSETS.texasHoldem.fullSrc} 
              alt="Texas Hold'em" 
              aspectRatio="h-full w-full"
              eager={true}
            />
          </div>
          <div className="flex-1 flex flex-col justify-between text-left font-jersey">
            <div>
              <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none">POKER DUEL</span>
              <h4 className="text-xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Hold’em</h4>
              <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Bluff: 85%</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#63657A] uppercase">Active Tables</span>
              <CasinoButton 
                variant="cyan" 
                size="sm" 
                chamfer={4} 
                className="h-6 px-1 text-xs" 
                soundType="click" 
                onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('poker'); }}
              >
                RESUME
              </CasinoButton>
            </div>
          </div>
        </div>

        {/* Card 3: Roulette Live */}
        <div 
          className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 cursor-pointer select-none filter drop-shadow-[2px_2px_0px_#000000] group" 
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} 
          onClick={() => { audio.playClick(); setRoute('minigames'); }}
        >
          <div className="w-20 h-20 shrink-0 bg-black border border-[#2E3150] overflow-hidden">
            <ProgressivePixelImage 
              thumbnailSrc={LOBBY_ASSETS.rouletteLive.thumbnailSrc} 
              fullSrc={LOBBY_ASSETS.rouletteLive.fullSrc} 
              alt="Roulette Live" 
              aspectRatio="h-full w-full"
              eager={true}
            />
          </div>
          <div className="flex-1 flex flex-col justify-between text-left font-jersey">
            <div>
              <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none">LIVE CASINO</span>
              <h4 className="text-xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Roulette</h4>
              <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Payout: 97.3%</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#63657A] uppercase">Live Now</span>
              <CasinoButton 
                variant="cyan" 
                size="sm" 
                chamfer={4} 
                className="h-6 px-1 text-xs" 
                soundType="click" 
                onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('minigames'); }}
              >
                RESUME
              </CasinoButton>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
