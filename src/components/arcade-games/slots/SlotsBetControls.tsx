/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoButton, CasinoPanel } from '../../ui-v2';
import { Play, HelpCircle, Minus, Plus } from 'lucide-react';

interface SlotsBetControlsProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  isSpinning: boolean;
  onSpin: () => void;
  onOpenPaytable: () => void;
}

export const SlotsBetControls: React.FC<SlotsBetControlsProps> = ({
  betAmount,
  onBetChange,
  isSpinning,
  onSpin,
  onOpenPaytable,
}) => {
  const presets = [5, 20, 50, 100];

  return (
    <CasinoPanel
      chamfer={12}
      borderColor="default"
      className="w-full bg-[#15182A]"
    >
      <div className="space-y-4 p-1">
        {/* Bet Header & Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E3150] pb-3">
          <div className="space-y-0.5">
            <span className="font-jersey text-sm text-[#9A9AB5] uppercase tracking-wider block">
              BET AMOUNT
            </span>
            <span className="font-jersey text-2xl md:text-3xl text-[#F6B73C] font-bold uppercase leading-none block">
              {betAmount.toFixed(2)} COINS
            </span>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSpinning || betAmount <= 1}
              onClick={() => onBetChange(Math.max(1, betAmount - 10))}
              aria-label="Decrease bet by 10"
              className="w-10 h-10 bg-[#0B0D18] border-2 border-[#2E3150] hover:border-[#F6B73C] disabled:opacity-40 disabled:cursor-not-allowed text-[#F3EBD8] flex items-center justify-center font-jersey text-lg cursor-pointer transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="bg-[#0B0D18] border-2 border-[#2E3150] px-4 py-1.5 min-w-[100px] text-center">
              <span className="font-jersey text-xl text-[#F3EBD8] font-bold">
                {betAmount} COINS
              </span>
            </div>

            <button
              type="button"
              disabled={isSpinning || betAmount >= 100}
              onClick={() => onBetChange(Math.min(100, betAmount + 10))}
              aria-label="Increase bet by 10"
              className="w-10 h-10 bg-[#0B0D18] border-2 border-[#2E3150] hover:border-[#F6B73C] disabled:opacity-40 disabled:cursor-not-allowed text-[#F3EBD8] flex items-center justify-center font-jersey text-lg cursor-pointer transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-start">
          <span className="font-jersey text-xs text-[#9A9AB5] uppercase tracking-wider mr-1">
            PRESETS:
          </span>
          {presets.map((preset) => {
            const isSelected = betAmount === preset;
            return (
              <button
                key={preset}
                type="button"
                disabled={isSpinning}
                aria-pressed={isSelected}
                onClick={() => onBetChange(preset)}
                className={`px-3 py-1 font-jersey text-sm uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border ${
                  isSelected
                    ? 'bg-[#F6B73C] text-black border-[#F6B73C] font-bold'
                    : 'bg-[#0B0D18] text-[#9A9AB5] border-[#2E3150] hover:border-[#F6B73C] hover:text-[#F3EBD8]'
                }`}
              >
                {preset} COINS
              </button>
            );
          })}
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch">
          <CasinoButton
            type="button"
            variant="gold"
            size="lg"
            soundType="none"
            disabled={isSpinning}
            onClick={onSpin}
            className="flex-1 min-h-[48px]"
          >
            <div className="flex items-center justify-center gap-2 px-2">
              <Play className="w-5 h-5 fill-black text-black" />
              <span className="font-bold tracking-wider">
                {isSpinning ? 'SPINNING...' : 'SPIN REELS'}
              </span>
            </div>
          </CasinoButton>

          <CasinoButton
            type="button"
            variant="dark"
            size="lg"
            onClick={onOpenPaytable}
            className="min-h-[48px] px-4"
          >
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#9A9AB5]" />
              <span>PAYTABLE</span>
            </div>
          </CasinoButton>
        </div>
      </div>
    </CasinoPanel>
  );
};
