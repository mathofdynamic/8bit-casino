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
        <article 
          className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 select-none filter drop-shadow-[2px_2px_0px_#000000] group relative h-[120px] sm:h-[128px] md:h-[132px] items-stretch" 
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} 
        >
          {/* Sibling cover button for card-wide navigation (avoids nested button issues) */}
          <button 
            onClick={() => { audio.playClick(); setRoute('minigames'); }} 
            className="absolute inset-0 w-full h-full focus-visible:ring-2 focus-visible:ring-[#54D6D9] focus-visible:ring-inset border-none bg-transparent cursor-pointer z-0"
            aria-label="Play Lucky 7s"
          />

          <div className="w-[38%] shrink-0 bg-black border border-[#2E3150] overflow-hidden pointer-events-none relative z-1">
            <ProgressivePixelImage 
              thumbnailSrc={LOBBY_ASSETS.lucky7s.thumbnailSrc} 
              fullSrc={LOBBY_ASSETS.lucky7s.fullSrc} 
              alt="Lucky 7s" 
              aspectRatio="h-full w-full"
              eager={true}
              imgClassName="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between text-left font-jersey pointer-events-none relative z-1">
            <div>
              <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none pt-0.5">SLOTS GAME</span>
              <h4 className="text-xl md:text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Lucky 7s</h4>
              <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Bet: 10 Coins</span>
            </div>
            <div className="flex items-center justify-between mt-1 pointer-events-auto">
              <span className="text-[10px] text-[#63657A] uppercase pointer-events-none">Played 2h ago</span>
              <CasinoButton 
                variant="cyan" 
                size="sm" 
                chamfer={4} 
                className="h-6 px-2 text-xs relative z-10" 
                soundType="click" 
                onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('minigames'); }}
              >
                RESUME
              </CasinoButton>
            </div>
          </div>
        </article>

        {/* Card 2: Texas Hold'em */}
        <article 
          className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 select-none filter drop-shadow-[2px_2px_0px_#000000] group relative h-[120px] sm:h-[128px] md:h-[132px] items-stretch" 
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} 
        >
          {/* Sibling cover button for card-wide navigation (avoids nested button issues) */}
          <button 
            onClick={() => { audio.playClick(); setRoute('poker'); }} 
            className="absolute inset-0 w-full h-full focus-visible:ring-2 focus-visible:ring-[#54D6D9] focus-visible:ring-inset border-none bg-transparent cursor-pointer z-0"
            aria-label="Play Texas Hold’em"
          />

          <div className="w-[38%] shrink-0 bg-black border border-[#2E3150] overflow-hidden pointer-events-none relative z-1">
            <ProgressivePixelImage 
              thumbnailSrc={LOBBY_ASSETS.texasHoldem.thumbnailSrc} 
              fullSrc={LOBBY_ASSETS.texasHoldem.fullSrc} 
              alt="Texas Hold’em" 
              aspectRatio="h-full w-full"
              eager={true}
              imgClassName="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between text-left font-jersey pointer-events-none relative z-1">
            <div>
              <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none pt-0.5">POKER DUEL</span>
              <h4 className="text-xl md:text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Texas Hold’em</h4>
              <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Bluff: 85%</span>
            </div>
            <div className="flex items-center justify-between mt-1 pointer-events-auto">
              <span className="text-[10px] text-[#63657A] uppercase pointer-events-none">Active Tables</span>
              <CasinoButton 
                variant="cyan" 
                size="sm" 
                chamfer={4} 
                className="h-6 px-2 text-xs relative z-10" 
                soundType="click" 
                onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('poker'); }}
              >
                RESUME
              </CasinoButton>
            </div>
          </div>
        </article>

        {/* Card 3: Roulette Live */}
        <article 
          className="bg-[#15182A] border-2 border-[#2E3150] hover:border-[#54D6D9] p-2 flex gap-3 select-none filter drop-shadow-[2px_2px_0px_#000000] group relative h-[120px] sm:h-[128px] md:h-[132px] items-stretch" 
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }} 
        >
          {/* Sibling cover button for card-wide navigation (avoids nested button issues) */}
          <button 
            onClick={() => { audio.playClick(); setRoute('minigames'); }} 
            className="absolute inset-0 w-full h-full focus-visible:ring-2 focus-visible:ring-[#54D6D9] focus-visible:ring-inset border-none bg-transparent cursor-pointer z-0"
            aria-label="Play Roulette Live"
          />

          <div className="w-[38%] shrink-0 bg-black border border-[#2E3150] overflow-hidden pointer-events-none relative z-1">
            <ProgressivePixelImage 
              thumbnailSrc={LOBBY_ASSETS.rouletteLive.thumbnailSrc} 
              fullSrc={LOBBY_ASSETS.rouletteLive.fullSrc} 
              alt="Roulette Live" 
              aspectRatio="h-full w-full"
              eager={true}
              imgClassName="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between text-left font-jersey pointer-events-none relative z-1">
            <div>
              <span className="text-[10px] text-[#9A9AB5] uppercase block leading-none pt-0.5">LIVE CASINO</span>
              <h4 className="text-xl md:text-2xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1 truncate group-hover:text-[#54D6D9]">Roulette Live</h4>
              <span className="text-xs text-[#54D6D9] uppercase block mt-1 leading-none">Payout: 97.3%</span>
            </div>
            <div className="flex items-center justify-between mt-1 pointer-events-auto">
              <span className="text-[10px] text-[#63657A] uppercase pointer-events-none">Live Now</span>
              <CasinoButton 
                variant="cyan" 
                size="sm" 
                chamfer={4} 
                className="h-6 px-2 text-xs relative z-10" 
                soundType="click" 
                onClick={(e) => { e.stopPropagation(); audio.playClick(); setRoute('minigames'); }}
              >
                RESUME
              </CasinoButton>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
};
