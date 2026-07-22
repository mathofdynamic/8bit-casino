/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlotMode, SlotSymbolKey } from './slotsTypes';
import { SLOT_SYMBOLS } from './slotsData';

interface SlotsMachineProps {
  cabinetMode: SlotMode;
  onModeChange: (mode: SlotMode) => void;
  reels: SlotSymbolKey[];
  spinningReels: boolean[];
  isSpinning: boolean;
  lastWin: number | null;
  jackpotBanner: string | null;
  reduceFlashing?: boolean;
}

export const SlotsMachine: React.FC<SlotsMachineProps> = ({
  cabinetMode,
  onModeChange,
  reels,
  spinningReels,
  isSpinning,
  lastWin,
  jackpotBanner,
  reduceFlashing = false,
}) => {
  const renderResultText = () => {
    if (jackpotBanner && lastWin !== null) {
      return `JACKPOT +${lastWin.toFixed(2)} COINS — ${jackpotBanner}`;
    }
    if (lastWin !== null) {
      if (lastWin > 0) {
        return `WIN +${lastWin.toFixed(2)} COINS`;
      }
      return `NO MATCH — TRY AGAIN`;
    }
    return `READY TO SPIN`;
  };

  return (
    <div className="w-full bg-[#15182A] border-2 border-[#2E3150] p-4 md:p-6 space-y-4 filter drop-shadow-[4px_4px_0px_#000000]"
      style={{
        clipPath:
          'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))',
      }}
    >
      {/* Top Mode Selector */}
      <div className="flex items-center justify-between border-b border-[#2E3150] pb-3 flex-wrap gap-2">
        <span className="font-jersey text-sm text-[#9A9AB5] uppercase tracking-wider">
          SELECT REEL MODE
        </span>

        <div className="flex items-center gap-2 bg-[#0B0D18] p-1 border border-[#2E3150]">
          <button
            type="button"
            disabled={isSpinning}
            aria-pressed={cabinetMode === 3}
            onClick={() => onModeChange(3)}
            className={`px-3 py-1 font-jersey text-base uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              cabinetMode === 3
                ? 'bg-[#15182A] text-[#54D6D9] border-2 border-[#54D6D9] font-bold'
                : 'bg-transparent text-[#9A9AB5] hover:text-[#F3EBD8]'
            }`}
          >
            3 REELS {cabinetMode === 3 ? '✓' : ''}
          </button>
          <button
            type="button"
            disabled={isSpinning}
            aria-pressed={cabinetMode === 5}
            onClick={() => onModeChange(5)}
            className={`px-3 py-1 font-jersey text-base uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              cabinetMode === 5
                ? 'bg-[#15182A] text-[#54D6D9] border-2 border-[#54D6D9] font-bold'
                : 'bg-transparent text-[#9A9AB5] hover:text-[#F3EBD8]'
            }`}
          >
            5 REELS {cabinetMode === 5 ? '✓' : ''}
          </button>
        </div>
      </div>

      {/* Reel Windows Frame */}
      <div className="relative bg-[#0B0D18] border-2 border-[#2E3150] p-3 md:p-5 overflow-hidden">
        {/* Center Payline Indicator */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 border-b-2 border-dashed border-[#54D6D9]/40 pointer-events-none z-10" />

        <div
          className={`grid gap-2 md:gap-3 ${
            cabinetMode === 3 ? 'grid-cols-3' : 'grid-cols-5'
          }`}
        >
          {reels.map((symbolKey, idx) => {
            const symbolInfo = SLOT_SYMBOLS[symbolKey] || SLOT_SYMBOLS.CHERRY;
            const IconComp = symbolInfo.icon;
            const isSymbolSpinning = spinningReels[idx];

            return (
              <div
                key={idx}
                className={`aspect-square bg-[#15182A] border-2 ${
                  isSymbolSpinning ? 'border-[#F6B73C]' : 'border-[#2E3150]'
                } p-2 flex flex-col items-center justify-center relative overflow-hidden transition-colors`}
              >
                <div
                  className={`flex flex-col items-center justify-center w-full h-full ${
                    isSymbolSpinning
                      ? reduceFlashing
                        ? 'opacity-75'
                        : 'translate-y-[-2px] opacity-80'
                      : ''
                  }`}
                >
                  <IconComp className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                </div>

                {isSymbolSpinning && (
                  <div className="absolute inset-x-0 bottom-1 text-center bg-[#0B0D18]/90 border-t border-[#2E3150] py-0.5">
                    <span className="font-jersey text-[10px] text-[#F6B73C] uppercase tracking-wider">
                      SPINNING
                    </span>
                  </div>
                )}

                {!isSymbolSpinning && (
                  <span className="font-jersey text-[10px] sm:text-xs text-[#9A9AB5] uppercase mt-1 leading-none select-none">
                    {symbolInfo.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Status Bar */}
      <div
        aria-live="polite"
        className={`w-full p-3 border-2 text-center font-jersey text-lg md:text-xl uppercase transition-colors ${
          jackpotBanner
            ? 'bg-[#222744] border-[#D95F9A] text-[#D95F9A] font-bold'
            : lastWin && lastWin > 0
            ? 'bg-[#152B1E] border-[#66D18F] text-[#66D18F] font-bold'
            : lastWin === 0
            ? 'bg-[#2B1518] border-[#E85D68] text-[#E85D68]'
            : 'bg-[#0B0D18] border-[#2E3150] text-[#F3EBD8]'
        }`}
      >
        <span>{renderResultText()}</span>
      </div>
    </div>
  );
};
