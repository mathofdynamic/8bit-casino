/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoPanel, CasinoProgressBar } from '../ui-v2';

export const MissionsModule: React.FC = () => {
  return (
    <CasinoPanel 
      title="Daily Missions" 
      subtitle="COMPLETE CHALLENGES FOR BONUS XP"
      borderColor="default"
      compactHeader={true}
    >
      <div className="space-y-3 font-jersey">
        {/* Mission 1 */}
        <div className="border border-[#2E3150] bg-[#0B0D18] p-2" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h4 className="text-base text-[#F3EBD8] uppercase leading-none font-bold">Win 10,000 Coins</h4>
              <p className="text-[10px] text-[#9A9AB5] uppercase mt-0.5 leading-none">Reward: 250 XP</p>
            </div>
            <span className="text-xs text-[#54D6D9] uppercase font-bold">42%</span>
          </div>
          <CasinoProgressBar value={42} color="cyan" segments={10} />
          <div className="flex justify-between text-[10px] text-[#63657A] uppercase mt-1">
            <span>Progress</span>
            <span>4.2k / 10k Coins</span>
          </div>
        </div>

        {/* Mission 2 */}
        <div className="border border-[#2E3150] bg-[#0B0D18] p-2" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h4 className="text-base text-[#F3EBD8] uppercase leading-none font-bold">Play 15 Slot Spins</h4>
              <p className="text-[10px] text-[#9A9AB5] uppercase mt-0.5 leading-none">Reward: 150 XP</p>
            </div>
            <span className="text-xs text-[#54D6D9] uppercase font-bold">80%</span>
          </div>
          <CasinoProgressBar value={80} color="cyan" segments={10} />
          <div className="flex justify-between text-[10px] text-[#63657A] uppercase mt-1">
            <span>Progress</span>
            <span>12 / 15 Spins</span>
          </div>
        </div>
      </div>
    </CasinoPanel>
  );
};
