/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, HelpCircle, Coins } from 'lucide-react';
import { CasinoButton } from '../../ui-v2';

interface LuckyDrawGameHeaderProps {
  onBack: () => void;
  onOpenRules: () => void;
  balance: number;
}

export const LuckyDrawGameHeader: React.FC<LuckyDrawGameHeaderProps> = ({
  onBack,
  onOpenRules,
  balance,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#15182A] border-2 border-[#2E3150] p-3 md:p-4 filter drop-shadow-[4px_4px_0px_#000000]">
      <div className="flex items-center gap-2 md:gap-3">
        <CasinoButton
          type="button"
          variant="dark"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4 text-[#F3EBD8]" />
          <span>BACK TO ARCADE</span>
        </CasinoButton>

        <div>
          <div className="font-jersey text-xs text-[#54D6D9] uppercase tracking-widest mb-0.5">
            ARCADE GAME
          </div>
          <h1 className="font-jersey text-2xl md:text-3xl text-[#F3EBD8] uppercase leading-none tracking-wide m-0">
            LUCKY DRAW
          </h1>
          <p className="font-jersey text-xs text-[#9A9AB5] uppercase m-0 mt-0.5 tracking-wider">
            SYNCHRONIZED 90S PLAY-MONEY RAFFLE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <CasinoButton
          variant="outline"
          size="sm"
          onClick={onOpenRules}
          className="flex items-center gap-1"
        >
          <HelpCircle className="w-4 h-4 text-[#54D6D9]" />
          <span>RULES</span>
        </CasinoButton>

        <div className="flex items-center gap-2 bg-[#15182A] border-2 border-[#2E3150] px-3 py-1.5 filter drop-shadow-[2px_2px_0px_#000000]">
          <div className="w-5 h-5 rounded-full bg-[#F6B73C] border border-black flex items-center justify-center shrink-0">
            <Coins className="w-3.5 h-3.5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase leading-none">
              BALANCE
            </span>
            <span className="font-jersey text-lg md:text-xl text-[#F6B73C] leading-none mt-0.5">
              {balance.toFixed(2)} COINS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
