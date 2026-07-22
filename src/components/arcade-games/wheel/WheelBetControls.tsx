import React from 'react';
import { CasinoButton } from '../../ui-v2';
import { HelpCircle, Play } from 'lucide-react';

interface WheelBetControlsProps {
  betAmount: number;
  isSpinning: boolean;
  onBetChange: (newBet: number) => void;
  onSpin: () => void;
  onOpenOutcomes: () => void;
}

const PRESET_BETS = [5, 20, 50, 100];

export const WheelBetControls: React.FC<WheelBetControlsProps> = ({
  betAmount,
  isSpinning,
  onBetChange,
  onSpin,
  onOpenOutcomes,
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
            {betAmount.toFixed(2)} COINS
          </span>
        </div>

        {/* Adjust Buttons */}
        <div className="flex items-center gap-2">
          <CasinoButton
            type="button"
            variant="dark"
            size="sm"
            disabled={isSpinning || betAmount <= 1}
            onClick={handleDecrease}
          >
            -10
          </CasinoButton>
          <CasinoButton
            type="button"
            variant="dark"
            size="sm"
            disabled={isSpinning || betAmount >= 100}
            onClick={handleIncrease}
          >
            +10
          </CasinoButton>
        </div>
      </div>

      {/* Preset Buttons */}
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
                disabled={isSpinning}
                aria-pressed={isSelected}
                onClick={() => onBetChange(preset)}
                className={`px-3 py-1 font-jersey text-lg cursor-pointer transition-none border-2 select-none ${
                  isSelected
                    ? 'bg-[#F6B73C] text-black border-[#F6B73C] font-bold'
                    : 'bg-[#1D2036] text-[#F3EBD8] border-[#2E3150] hover:border-[#F6B73C]'
                } ${isSpinning ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {preset} COINS
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <CasinoButton
          type="button"
          variant="gold"
          soundType="none"
          disabled={isSpinning}
          onClick={onSpin}
          className="flex-1"
        >
          <div className="flex items-center justify-center gap-2 py-1">
            <Play className="w-5 h-5 fill-black text-black" />
            <span className="text-2xl tracking-widest uppercase">
              {isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}
            </span>
          </div>
        </CasinoButton>

        <CasinoButton
          type="button"
          variant="dark"
          onClick={onOpenOutcomes}
          className="shrink-0"
        >
          <div className="flex items-center justify-center gap-1.5 py-1">
            <HelpCircle className="w-5 h-5 text-[#9A9AB5]" />
            <span className="text-lg">OUTCOMES</span>
          </div>
        </CasinoButton>
      </div>
    </div>
  );
};
