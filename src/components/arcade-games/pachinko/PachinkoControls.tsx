/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Play } from 'lucide-react';
import { CasinoButton } from '../../ui-v2';

interface PachinkoControlsProps {
  betAmount: number;
  setBetAmount: (val: number) => void;
  isDropPending: boolean;
  onDropBall: () => void;
  onOpenRules: () => void;
}

export const PachinkoControls: React.FC<PachinkoControlsProps> = ({
  betAmount,
  setBetAmount,
  isDropPending,
  onDropBall,
  onOpenRules,
}) => {
  const PRESETS = [1, 5, 10, 25];

  return (
    <div className="w-full max-w-[440px] bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      {/* Bet Amount Panel */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-jersey text-sm text-[#9A9AB5] uppercase">
            BET PER BALL
          </span>
          <span className="font-jersey text-xl text-[#F6B73C] uppercase">
            {betAmount.toFixed(2)} COINS
          </span>
        </div>

        {/* Adjust Buttons + Value */}
        <div className="flex items-center gap-2">
          <CasinoButton
            type="button"
            variant="dark"
            size="sm"
            disabled={isDropPending || betAmount <= 1}
            onClick={() => setBetAmount(Math.max(1, betAmount - 5))}
          >
            -5
          </CasinoButton>

          <div className="flex-1 bg-[#0B0D18] border border-[#2E3150] py-1.5 px-3 text-center">
            <span className="font-jersey text-xl text-[#F3EBD8]">
              {betAmount.toFixed(2)} COINS
            </span>
          </div>

          <CasinoButton
            type="button"
            variant="dark"
            size="sm"
            disabled={isDropPending || betAmount >= 100}
            onClick={() => setBetAmount(Math.min(100, betAmount + 5))}
          >
            +5
          </CasinoButton>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 justify-between">
          {PRESETS.map((preset) => {
            const isSelected = betAmount === preset;
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={isSelected}
                disabled={isDropPending}
                onClick={() => setBetAmount(preset)}
                className={`flex-1 py-1 px-2 font-jersey text-base uppercase tracking-wider transition-none border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F6B73C] text-black border-[#F6B73C] font-bold'
                    : 'bg-[#0B0D18] text-[#9A9AB5] border-[#2E3150] hover:text-[#F3EBD8] hover:border-[#44476B]'
                } ${isDropPending ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <CasinoButton
          type="button"
          variant="gold"
          soundType="none"
          disabled={isDropPending}
          onClick={onDropBall}
          className="flex-1"
          shimmer={!isDropPending}
        >
          <div className="flex items-center justify-center gap-2">
            <Play className="w-5 h-5 text-black fill-black" />
            <span>
              {isDropPending
                ? 'PREPARING DROP...'
                : `DROP BALL — ${betAmount.toFixed(2)} COINS`}
            </span>
          </div>
        </CasinoButton>

        <CasinoButton
          type="button"
          variant="dark"
          onClick={onOpenRules}
          size="md"
        >
          <div className="flex items-center justify-center gap-1.5 px-1">
            <HelpCircle className="w-4 h-4 text-[#9A9AB5]" />
            <span>RULES</span>
          </div>
        </CasinoButton>
      </div>
    </div>
  );
};
