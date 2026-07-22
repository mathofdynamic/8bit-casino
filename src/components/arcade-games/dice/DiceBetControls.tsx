import React from 'react';
import { CasinoButton } from '../../ui-v2';
import { Play, Landmark, HelpCircle, RotateCcw } from 'lucide-react';

interface DiceBetControlsProps {
  betAmount: number;
  isRolling: boolean;
  chainId: number;
  pendingWinnings: number;
  onBetChange: (newBet: number) => void;
  onRoll: () => void;
  onBank: () => void;
  onResetBaseline: () => void;
  onOpenRules: () => void;
}

const PRESET_BETS = [5, 20, 50, 100];

export const DiceBetControls: React.FC<DiceBetControlsProps> = ({
  betAmount,
  isRolling,
  chainId,
  pendingWinnings,
  onBetChange,
  onRoll,
  onBank,
  onResetBaseline,
  onOpenRules,
}) => {
  const handleDecrease = () => {
    onBetChange(Math.max(1, betAmount - 10));
  };

  const handleIncrease = () => {
    onBetChange(Math.min(100, betAmount + 10));
  };

  return (
    <div className="w-full bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      {/* Bet Amount Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-[#2E3150] pb-3">
        <div>
          <span className="font-jersey text-xs text-[#9A9AB5] uppercase leading-none block">
            BET AMOUNT
          </span>
          <span className="font-jersey text-3xl text-[#F6B73C] leading-none mt-1 block">
            {chainId > 0 ? pendingWinnings.toFixed(2) : betAmount.toFixed(2)} COINS
          </span>
          {chainId > 0 && (
            <span className="font-jersey text-xs text-[#54D6D9] uppercase block mt-1">
              BET LOCKED AT PENDING REWARD BY PYRAMID CHAIN
            </span>
          )}
        </div>

        {/* Adjust Buttons (only when not in active chain) */}
        {chainId === 0 && (
          <div className="flex items-center gap-2">
            <CasinoButton
              type="button"
              variant="dark"
              size="sm"
              disabled={isRolling || betAmount <= 1}
              onClick={handleDecrease}
            >
              -10
            </CasinoButton>
            <CasinoButton
              type="button"
              variant="dark"
              size="sm"
              disabled={isRolling || betAmount >= 100}
              onClick={handleIncrease}
            >
              +10
            </CasinoButton>
          </div>
        )}
      </div>

      {/* Preset Buttons (only when not in active chain) */}
      {chainId === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-jersey text-xs text-[#9A9AB5] uppercase w-full sm:w-auto">
            PRESETS:
          </span>
          <div className="flex gap-2 flex-wrap">
            {PRESET_BETS.map((preset) => {
              const isSelected = betAmount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={isRolling}
                  aria-pressed={isSelected}
                  onClick={() => onBetChange(preset)}
                  className={`px-3 py-1 font-jersey text-lg cursor-pointer transition-none border-2 select-none ${
                    isSelected
                      ? 'bg-[#F6B73C] text-black border-[#F6B73C] font-bold'
                      : 'bg-[#1D2036] text-[#F3EBD8] border-[#2E3150] hover:border-[#F6B73C]'
                  } ${isRolling ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {preset} COINS
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {/* Primary Roll Action (only when chainId < 5) */}
        {chainId < 5 && (
          <CasinoButton
            type="button"
            variant="gold"
            soundType="none"
            disabled={isRolling}
            onClick={onRoll}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2 py-1">
              <Play className="w-5 h-5 fill-black text-black" />
              <span className="text-2xl tracking-widest uppercase">
                {isRolling
                  ? 'ROLLING...'
                  : chainId > 0
                  ? `CONTINUE STEP ${chainId}`
                  : 'START ROUND'}
              </span>
            </div>
          </CasinoButton>
        )}

        {/* Bank Action (active chain) */}
        {chainId > 0 && (
          <CasinoButton
            type="button"
            variant="cyan"
            soundType="none"
            disabled={isRolling}
            onClick={onBank}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2 py-1">
              <Landmark className="w-5 h-5 text-black" />
              <span className="text-2xl tracking-widest uppercase text-black font-bold">
                BANK {pendingWinnings.toFixed(2)} COINS
              </span>
            </div>
          </CasinoButton>
        )}

        {/* Reset Baseline to 7 */}
        {chainId === 0 && (
          <CasinoButton
            type="button"
            variant="dark"
            disabled={isRolling}
            onClick={onResetBaseline}
            className="shrink-0"
            title="Reset baseline to 7"
          >
            <div className="flex items-center justify-center gap-1.5 py-1">
              <RotateCcw className="w-4 h-4 text-[#9A9AB5]" />
              <span className="text-lg">RE-CENTER 7</span>
            </div>
          </CasinoButton>
        )}

        {/* Rules Action */}
        <CasinoButton
          type="button"
          variant="dark"
          onClick={onOpenRules}
          className="shrink-0"
        >
          <div className="flex items-center justify-center gap-1.5 py-1">
            <HelpCircle className="w-5 h-5 text-[#9A9AB5]" />
            <span className="text-lg">RULES</span>
          </div>
        </CasinoButton>
      </div>
    </div>
  );
};
