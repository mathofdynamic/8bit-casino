/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store';
import { PixelAvatar } from '../../lib/avatars';
import { CasinoBadge, CasinoProgressBar } from '../ui-v2';

export const PlayerSummary: React.FC = () => {
  const { profile } = useStore();

  return (
    <div 
      className="bg-[#15182A] border border-[#2E3150] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[2px_2px_0px_#000000] select-none" 
      style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))' }}
    >
      <div className="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row w-full md:w-auto font-jersey">
        <div className="shrink-0">
          <PixelAvatar avatarId={profile.avatarId} googlePicture={profile.googlePicture} size={48} />
        </div>
        <div>
          <span className="text-xs text-[#9A9AB5] block uppercase leading-none">WELCOME BACK SOLDIER,</span>
          <h2 className="text-3xl text-[#F3EBD8] uppercase tracking-wide leading-none mt-1">{profile.name}</h2>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <CasinoBadge variant="gold">LEVEL 32</CasinoBadge>
            <CasinoBadge variant="cyan">GOLD IV</CasinoBadge>
            <span className="text-xs text-[#9A9AB5] uppercase">
              STREAK: <span className="text-[#F6B73C] font-bold">{profile.dailyStreak} DAYS</span>
            </span>
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="w-full md:w-60 space-y-1.5 shrink-0 font-jersey">
        <div className="flex justify-between text-xs text-[#9A9AB5] uppercase leading-none">
          <span>XP PROGRESSION</span>
          <span>4,820 / 5,000 XP</span>
        </div>
        <CasinoProgressBar value={96} color="gold" segments={10} />
      </div>
    </div>
  );
};
