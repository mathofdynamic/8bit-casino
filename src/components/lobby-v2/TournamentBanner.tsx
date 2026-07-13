/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { CasinoButton } from '../ui-v2';
import { audio } from '../../lib/audio';

export const TournamentBanner: React.FC = () => {
  const { triggerToast } = useStore();

  return (
    <section id="tournaments" className="relative filter drop-shadow-[4px_4px_0px_#000000] select-none">
      <div 
        style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}
        className="bg-[#222744] border-2 border-[#D95F9A]/70 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 select-none relative"
      >
        {/* Pattern */}
        <div className="absolute inset-0 bg-black opacity-10 pixel-checker pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto flex-col md:flex-row text-center md:text-left font-jersey">
          <div className="w-12 h-12 bg-[#D95F9A] border-2 border-[#F3EBD8] flex items-center justify-center text-3xl shrink-0" style={{ clipPath: 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 6px 100%, 0% calc(100% - 6px))' }}>
            👑
          </div>
          <div>
            <span className="text-[#D95F9A] text-xs block uppercase tracking-wider leading-none font-bold">LIVE COMPETITIVE DUELS</span>
            <h4 className="text-2xl text-[#F3EBD8] uppercase mt-1 tracking-wide leading-none">PIXEL CROWN CUP</h4>
            <p className="text-xs text-[#9A9AB5] uppercase mt-1 leading-none">
              Starts in 18 minutes • Entry: 500 Coins • Prize Pool: 25,000 Coins
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0 w-full md:w-auto font-jersey">
          <CasinoButton 
            variant="magenta" 
            size="sm" 
            className="w-full filter drop-shadow-[2px_2px_0px_#000000]"
            onClick={() => {
              audio.playClick();
              triggerToast('PIXEL CROWN CUP REGISTRATION LOADED! NEED XP LVL 40.', 'info');
            }}
          >
            VIEW TOURNAMENT
          </CasinoButton>
        </div>
      </div>
    </section>
  );
};
