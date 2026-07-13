/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel, CasinoProgressBar, CasinoBadge } from '../ui-v2';
import { useStore } from '../../store';

interface PokerMissionsProps {
  id?: string;
}

export const PokerMissions: React.FC<PokerMissionsProps> = ({ id }) => {
  const { unlockedAchievements } = useStore();

  const isWin5HandsClaimed = unlockedAchievements.includes('poker_win');

  return (
    <div id={id} className="scroll-mt-6 select-none font-jersey">
      <CasinoPanel 
        title="POKER MISSIONS" 
        subtitle="Complete active milestones to earn bonus chips."
      >
        <div className="flex flex-col gap-3">
          
          {/* Mission 1: Win 5 Hands */}
          <div className="bg-[#0B0D18] p-3 border border-[#2E3150] flex flex-col justify-between" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-jersey text-base font-bold text-[#F6B73C] uppercase">WIN 5 HANDS</span>
                <CasinoBadge variant={isWin5HandsClaimed ? "success" : "gold"}>
                  {isWin5HandsClaimed ? "DONE" : "2.00 COINS"}
                </CasinoBadge>
              </div>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight mb-2">
                Outplay your opponents and claim the pot in five distinct game hands.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between font-jersey text-[10px]">
                <span className="text-[#63657A] uppercase">Progress Tracker</span>
                <span className="text-[#F6B73C]">{isWin5HandsClaimed ? "5" : "1"} / 5 HANDS</span>
              </div>
              <CasinoProgressBar value={isWin5HandsClaimed ? 100 : 20} color="gold" segments={10} />
            </div>
          </div>

          {/* Mission 2: Play 20 Hands */}
          <div className="bg-[#0B0D18] p-3 border border-[#2E3150] flex flex-col justify-between" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-jersey text-base font-bold text-[#54D6D9] uppercase">PLAY 20 HANDS</span>
                <CasinoBadge variant="cyan">5.00 COINS</CasinoBadge>
              </div>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight mb-2">
                Gain table experience by remaining active for twenty full hands.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between font-jersey text-[10px]">
                <span className="text-[#63657A] uppercase">Progress Tracker</span>
                <span className="text-[#54D6D9]">4 / 20 HANDS</span>
              </div>
              <CasinoProgressBar value={20} color="cyan" segments={10} />
            </div>
          </div>

          {/* Mission 3: Finish in Top 3 */}
          <div className="bg-[#0B0D18] p-3 border border-[#2E3150] flex flex-col justify-between" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-jersey text-base font-bold text-[#D95F9A] uppercase">FINISH IN TOP 3</span>
                <CasinoBadge variant="magenta">10.00 COINS</CasinoBadge>
              </div>
              <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-tight mb-2">
                Survive or cash out while ranking in the top three of your table's chip stacks.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between font-jersey text-[10px]">
                <span className="text-[#63657A] uppercase">Progress Tracker</span>
                <span className="text-[#D95F9A]">0 / 1 DONE</span>
              </div>
              <CasinoProgressBar value={0} color="magenta" segments={10} />
            </div>
          </div>

        </div>
      </CasinoPanel>
    </div>
  );
};
