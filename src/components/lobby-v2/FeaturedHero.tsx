/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { ProgressivePixelImage, CasinoBadge, CasinoButton } from '../ui-v2';
import { LOBBY_ASSETS } from '../../lib/lobbyAssets';
import { audio } from '../../lib/audio';

export const FeaturedHero: React.FC = () => {
  const { setRoute } = useStore();

  return (
    <div 
      className="group relative bg-[#15182A] border-2 border-[#2E3150] overflow-hidden filter drop-shadow-[4px_4px_0px_#000000]"
      style={{ 
        clipPath: 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 16px 100%, 0% calc(100% - 16px))',
        minHeight: '260px'
      }}
    >
      {/* The full hero pixel art image preloading eagerly */}
      <div className="absolute inset-0 z-0">
        <ProgressivePixelImage
          thumbnailSrc={LOBBY_ASSETS.featuredHero.thumbnailSrc}
          fullSrc={LOBBY_ASSETS.featuredHero.fullSrc}
          alt={LOBBY_ASSETS.featuredHero.alt}
          aspectRatio="h-full w-full"
          objectPosition={LOBBY_ASSETS.featuredHero.objectPosition}
          eager={true} // preloaded eagerly as hero artwork!
          imgClassName="h-full w-full"
        />
        
        {/* Localized deep navy gradient scrim to ensure complete contrast of overlay texts */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D18] via-[#0B0D18]/85 to-transparent" />
      </div>

      {/* Text Overlay Content Left */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full min-h-[260px] max-w-md md:max-w-xl text-left select-none">
        <div className="space-y-2">
          <CasinoBadge variant="magenta" className="animate-pulse">HOT BANNER</CasinoBadge>
          <h1 className="text-4xl md:text-5xl text-[#F6B73C] uppercase tracking-wider leading-none font-jersey m-0 filter drop-shadow-[2px_2px_0px_#000000]">
            MEGA FORTUNE
          </h1>
          <p className="text-lg md:text-xl text-[#F3EBD8]/90 uppercase leading-snug tracking-wide max-w-sm">
            Classic reels. Legendary rewards. Spin the wheels of code!
          </p>
        </div>

        <div className="mt-4 space-y-3.5 font-jersey">
          <div className="flex items-center gap-2">
            <span className="text-[#D95F9A] text-xl animate-pulse">◆</span>
            <span className="text-[#D95F9A] text-2xl tracking-wider uppercase leading-none font-bold">
              JACKPOT: 1,245,678 COINS
            </span>
          </div>
          
          <div className="flex">
            <CasinoButton
              variant="gold"
              size="lg"
              shimmer={true}
              onClick={() => {
                audio.playClick();
                setRoute('minigames');
              }}
            >
              PLAY NOW
            </CasinoButton>
          </div>
        </div>
      </div>
    </div>
  );
};
