/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel, CasinoProgressBar, CasinoBadge } from '../ui-v2';
import { Target, Gift } from 'lucide-react';
import { useStore } from '../../store';
import { audio } from '../../lib/audio';

interface PokerMissionsProps {
  id?: string;
}

export const PokerMissions: React.FC<PokerMissionsProps> = ({ id }) => {
  const { unlockedAchievements } = useStore();

  const isRoyalSharkClaimed = unlockedAchievements.includes('poker_win');

  return (
    <div id={id} className="scroll-mt-6 select-none">
      <CasinoPanel 
        title="SALOON BOUNTY MISSIONS" 
        subtitle="Complete high-priority poker contracts to unlock extra status chips"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Mission 1: Royal Shark */}
          <div className="bg-[#0B0D18] p-3 border border-[#2E3150] flex flex-col justify-between" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-jersey text-base font-bold text-[#F6B73C] uppercase">ROYAL SHARK</span>
                <CasinoBadge variant={isRoyalSharkClaimed ? "success" : "gold"}>
                  {isRoyalSharkClaimed ? "DONE" : "0.50 COINS"}
                </CasinoBadge>
              </div>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight mb-3">
                Win any active hand against bots on the Rusty Saloon, Neon Roller or Chipmaster Coven tables.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-jersey text-xs">
                <span className="text-[#63657A]">PROGRESS Tracker</span>
                <span className="text-[#F6B73C]">{isRoyalSharkClaimed ? "1" : "0"} / 1 HANDS</span>
              </div>
              <CasinoProgressBar value={isRoyalSharkClaimed ? 100 : 0} color="gold" segments={10} />
            </div>
          </div>

          {/* Mission 2: Double Seat */}
          <div className="bg-[#0B0D18] p-3 border border-[#2E3150] flex flex-col justify-between" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-jersey text-base font-bold text-[#54D6D9] uppercase">DOUBLE SEAT</span>
                <CasinoBadge variant="cyan">1.00 COINS</CasinoBadge>
              </div>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight mb-3">
                Sit down at a table with Advanced or Expert bots (Neon High Roller or Chipmaster Coven).
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-jersey text-xs">
                <span className="text-[#63657A]">PROGRESS Tracker</span>
                <span className="text-[#54D6D9]">0 / 1 SITS</span>
              </div>
              <CasinoProgressBar value={0} color="cyan" segments={10} />
            </div>
          </div>

          {/* Mission 3: High Pot Roller */}
          <div className="bg-[#0B0D18] p-3 border border-[#2E3150] flex flex-col justify-between" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-jersey text-base font-bold text-[#D95F9A] uppercase">HIGH ROLLER</span>
                <CasinoBadge variant="magenta">2.50 COINS</CasinoBadge>
              </div>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight mb-3">
                Commit a lifetime cumulative total of 15.00 Coins or more to active pots in simulated play.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-jersey text-xs">
                <span className="text-[#63657A]">PROGRESS Tracker</span>
                <span className="text-[#D95F9A]">0.00 / 15.00 COINS</span>
              </div>
              <CasinoProgressBar value={0} color="magenta" segments={10} />
            </div>
          </div>

        </div>
      </CasinoPanel>
    </div>
  );
};
