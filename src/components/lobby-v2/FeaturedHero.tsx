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
      className="group relative bg-[#15182A] border-2 border-[#2E3150] overflow-hidden filter drop-shadow-[4px_4px_0px_#000000] h-[280px] sm:h-[300px] md:h-[320px] shrink-0"
      style={{ 
        clipPath: 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 16px 100%, 0% calc(100% - 16px))'
      }}
    >
      {/* The full hero pixel art image preloading eagerly */}
      <div className="absolute inset-0 z-0">
        <ProgressivePixelImage
          thumbnailSrc={LOBBY_ASSETS.featuredHero.thumbnailSrc}
          fullSrc={LOBBY_ASSETS.featuredHero.fullSrc}
          alt={LOBBY_ASSETS.featuredHero.alt}
          aspectRatio="h-full w-full"
          objectPosition="right center"
          eager={true} // preloaded eagerly as hero artwork!
          imgClassName="h-full w-full"
        />
        
        {/* Localized scrim div */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[58%] z-1" 
          style={{
            background: 'linear-gradient(to right, rgba(11, 13, 24, 0.98) 0%, rgba(11, 13, 24, 0.88) 42%, rgba(11, 13, 24, 0.35) 72%, transparent 100%)'
          }}
        />
      </div>

      {/* Text Overlay Content Left */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-center h-full max-w-[420px] text-left select-none gap-4">
        <div className="space-y-2">
          <div>
            <CasinoBadge variant="magenta">HOT</CasinoBadge>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[54px] text-[#F6B73C] uppercase tracking-wider leading-none font-jersey m-0 filter drop-shadow-[2px_2px_0px_#000000]">
            MEGA FORTUNE
          </h1>
          <p className="text-base md:text-[19px] text-[#F3EBD8]/90 uppercase leading-snug tracking-wide">
            Classic reels. Legendary rewards.
          </p>
        </div>

        <div className="space-y-3 font-jersey">
          <div className="flex items-center gap-2">
            <span className="text-[#D95F9A] text-lg">◆</span>
            <span className="text-[#D95F9A] text-xl md:text-[24px] tracking-wider uppercase leading-none font-bold">
              1,245,678 COINS
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
