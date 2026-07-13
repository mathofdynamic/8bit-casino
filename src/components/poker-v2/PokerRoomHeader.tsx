/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const PokerRoomHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#2E3150] bg-[#15182A] px-6 py-4 select-none">
      {/* Branding Header Area */}
      <div>
        <h1 className="text-3xl md:text-4xl text-[#F6B73C] tracking-widest font-jersey uppercase leading-none">
          8-BIT SALOON — POKER CLUB
        </h1>
        <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1.5 tracking-wide leading-none">
          DEAL IN WITH CLASSIC TEXAS HOLD'EM AND OMAHA CABINET SIMULATION
        </p>
      </div>

      {/* Lobby stats plaques */}
      <div className="flex items-center gap-3">
        {/* Active Tables Plaque */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-2 flex flex-col justify-center min-w-[100px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#F6B73C] text-lg font-bold leading-none">5</span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            ACTIVE TABLES
          </span>
        </div>

        {/* Players Online Plaque */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-2 flex flex-col justify-center min-w-[100px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#54D6D9] text-lg font-bold leading-none">12</span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            PLAYERS IN SEAT
          </span>
        </div>

        {/* Total Hands Dealt Plaque */}
        <div 
          className="bg-[#0B0D18] border border-[#2E3150] px-3.5 py-2 flex flex-col justify-center min-w-[120px] text-center" 
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <span className="font-jersey text-[#D95F9A] text-lg font-bold leading-none">34,801</span>
          <span className="font-jersey text-[#63657A] text-[10px] uppercase tracking-wider mt-1 leading-none">
            HANDS SIMULATED
          </span>
        </div>
      </div>
    </div>
  );
};
