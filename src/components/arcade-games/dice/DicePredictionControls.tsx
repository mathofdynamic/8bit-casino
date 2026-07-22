import React from 'react';
import { DicePrediction } from './diceTypes';
import { getDynamicMultiplier } from './diceData';

interface DicePredictionControlsProps {
  currentSum: number;
  selectedPrediction: DicePrediction;
  isRolling: boolean;
  disabled: boolean;
  onSelectPrediction: (prediction: DicePrediction) => void;
}

export const DicePredictionControls: React.FC<DicePredictionControlsProps> = ({
  currentSum,
  selectedPrediction,
  isRolling,
  disabled,
  onSelectPrediction,
}) => {
  const options: {
    key: DicePrediction;
    label: string;
    subtext: string;
    accentColor: string;
    borderColor: string;
  }[] = [
    {
      key: 'higher',
      label: 'HIGHER',
      subtext: 'Next total is greater',
      accentColor: '#66D18F',
      borderColor: 'border-[#66D18F]',
    },
    {
      key: 'equal',
      label: 'EQUAL',
      subtext: 'Next total is the same',
      accentColor: '#F6B73C',
      borderColor: 'border-[#F6B73C]',
    },
    {
      key: 'lower',
      label: 'LOWER',
      subtext: 'Next total is smaller',
      accentColor: '#54D6D9',
      borderColor: 'border-[#54D6D9]',
    },
  ];

  return (
    <div className="w-full bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col gap-3 filter drop-shadow-[4px_4px_0px_#000000]">
      <span className="font-jersey text-xs text-[#9A9AB5] uppercase tracking-wider block">
        CHOOSE PREDICTION (TARGET 92% RTP)
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => {
          const mult = getDynamicMultiplier(currentSum, option.key);
          const isSelected = selectedPrediction === option.key;
          const isBtnDisabled = disabled || isRolling || mult === 0;

          return (
            <button
              key={option.key}
              type="button"
              disabled={isBtnDisabled}
              aria-pressed={isSelected}
              onClick={() => onSelectPrediction(option.key)}
              className={`p-3 font-jersey uppercase text-left border-2 transition-none cursor-pointer relative flex flex-col justify-between ${
                isBtnDisabled
                  ? 'bg-[#1D2036] border-[#2E3150] opacity-40 cursor-not-allowed'
                  : isSelected
                  ? `bg-[#222744] ${option.borderColor} filter drop-shadow-[2px_2px_0px_#000000]`
                  : 'bg-[#1D2036] border-[#2E3150] hover:border-[#54D6D9]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="text-xl md:text-2xl font-bold tracking-wide"
                  style={{ color: isBtnDisabled ? '#9A9AB5' : option.accentColor }}
                >
                  {option.label}
                </span>
                <span className="text-xl text-[#F3EBD8] font-bold">
                  {mult > 0 ? `${mult}×` : 'N/A'}
                </span>
              </div>

              <span className="text-xs text-[#9A9AB5] mt-1 block">
                {option.subtext}
              </span>

              {isSelected && !isBtnDisabled && (
                <div
                  className="absolute top-1.5 right-1.5 text-xs font-bold"
                  style={{ color: option.accentColor }}
                >
                  ★ SELECTED
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
