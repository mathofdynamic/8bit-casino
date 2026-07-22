import React, { useEffect } from 'react';
import { CasinoButton } from '../../ui-v2';
import { DICE_OUTCOMES } from './diceData';
import { X } from 'lucide-react';

interface DiceRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiceRulesDialog: React.FC<DiceRulesDialogProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dice-rules-title"
        className="w-full max-w-lg bg-[#15182A] border-2 border-[#2E3150] p-6 relative filter drop-shadow-[8px_8px_0px_#000000] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#2E3150] pb-3 mb-4">
          <div>
            <h2
              id="dice-rules-title"
              className="font-jersey text-2xl text-[#F6B73C] uppercase tracking-wide leading-none"
            >
              HIGH-LOW DICE RULES
            </h2>
            <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1">
              Two 6-sided dice roll probabilities & pyramid risk ladder rules.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close rules dialog"
            className="text-[#9A9AB5] hover:text-[#F3EBD8] p-1 cursor-pointer transition-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Rules Breakdown */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-3 space-y-2 font-jersey uppercase text-xs text-[#F3EBD8]">
            <h3 className="text-sm text-[#F6B73C] font-bold border-b border-[#2E3150] pb-1">
              GAMEPLAY MECHANICS
            </h3>
            <p className="leading-relaxed">
              1. <strong className="text-[#54D6D9]">BASELINE TOTAL:</strong> The initial reference total starts at 7 (or the previous roll sum).
            </p>
            <p className="leading-relaxed">
              2. <strong className="text-[#66D18F]">HIGHER PREDICTION:</strong> Win if the sum of the two dice is greater than the current baseline.
            </p>
            <p className="leading-relaxed">
              3. <strong className="text-[#54D6D9]">LOWER PREDICTION:</strong> Win if the sum of the two dice is smaller than the current baseline.
            </p>
            <p className="leading-relaxed">
              4. <strong className="text-[#F6B73C]">EQUAL PREDICTION:</strong> Win if the sum of the two dice exactly matches the current baseline.
            </p>
            <p className="leading-relaxed">
              5. <strong className="text-[#D95F9A]">PYRAMID LADDER:</strong> Each correct prediction advances your step up to Step 5. You may bank pending coins at any point before rolling. Reaching Step 5 automatically banks your reward.
            </p>
            <p className="leading-relaxed">
              6. <strong className="text-[#E85D68]">MISSED PREDICTION:</strong> An incorrect prediction ends the round and resets pending chain rewards.
            </p>
          </div>

          {/* Permutations Table */}
          <div className="bg-[#1D2036] border border-[#2E3150] p-3 space-y-1.5 font-jersey uppercase text-xs">
            <div className="flex justify-between border-b border-[#2E3150] pb-1 text-[#9A9AB5]">
              <span>SUM</span>
              <span>COMBINATIONS</span>
              <span>CHANCE</span>
            </div>
            {Object.entries(DICE_OUTCOMES).map(([sum, ways]) => {
              const chance = ((ways / 36) * 100).toFixed(1);
              return (
                <div key={sum} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#F6B73C]">{sum}</span>
                  <span className="text-[#9A9AB5]">{ways} ways</span>
                  <span className="text-[#F3EBD8] font-bold">{chance}%</span>
                </div>
              );
            })}
          </div>

          <div className="bg-[#1D2036] border border-[#2E3150] p-3 font-jersey uppercase flex items-center justify-between text-xs">
            <span className="text-[#9A9AB5]">TARGET RETURN-TO-PLAYER</span>
            <span className="text-[#66D18F] font-bold text-base">92.00%</span>
          </div>

          <div className="pt-2 flex justify-end">
            <CasinoButton type="button" variant="gold" onClick={onClose}>
              DONE
            </CasinoButton>
          </div>
        </div>
      </div>
    </div>
  );
};
