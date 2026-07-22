import React, { useEffect } from 'react';
import { CasinoButton } from '../../ui-v2';
import { WHEEL_OUTCOMES } from './wheelData';
import { X } from 'lucide-react';

interface WheelOutcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WheelOutcomeDialog: React.FC<WheelOutcomeDialogProps> = ({
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
        aria-labelledby="wheel-outcomes-title"
        className="w-full max-w-md bg-[#15182A] border-2 border-[#2E3150] p-6 relative filter drop-shadow-[8px_8px_0px_#000000] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#2E3150] pb-3 mb-4">
          <div>
            <h2
              id="wheel-outcomes-title"
              className="font-jersey text-2xl text-[#F6B73C] uppercase tracking-wide leading-none"
            >
              FORTUNE MULTIPLIER OUTCOMES
            </h2>
            <p className="font-jersey text-xs text-[#9A9AB5] uppercase mt-1">
              Weighted play-money outcome distribution.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-[#9A9AB5] hover:text-[#F3EBD8] p-1 cursor-pointer transition-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-[#1D2036] border border-[#2E3150] p-3 space-y-2 font-jersey uppercase">
            <div className="flex justify-between border-b border-[#2E3150] pb-1 text-xs text-[#9A9AB5]">
              <span>MULTIPLIER</span>
              <span>PROBABILITY</span>
            </div>
            {WHEEL_OUTCOMES.map((item) => (
              <div
                key={item.multiplier}
                className="flex justify-between items-center text-lg"
              >
                <span
                  className={
                    item.multiplier === 10
                      ? 'text-[#F6B73C] font-bold'
                      : item.multiplier === 5
                      ? 'text-[#D95F9A] font-bold'
                      : item.multiplier === 2
                      ? 'text-[#54D6D9]'
                      : item.multiplier === 1
                      ? 'text-[#F3EBD8]'
                      : item.multiplier === 0.5
                      ? 'text-[#9A9AB5]'
                      : 'text-[#E85D68]'
                  }
                >
                  {item.multiplier}×
                </span>
                <span className="text-[#F3EBD8]">
                  {(item.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#1D2036] border border-[#2E3150] p-3 font-jersey uppercase flex items-center justify-between text-base">
            <span className="text-[#9A9AB5]">THEORETICAL RETURN</span>
            <span className="text-[#66D18F] font-bold text-xl">92%</span>
          </div>

          <p className="font-jersey text-xs text-[#9A9AB5] uppercase leading-snug">
            The result multiplier is selected from the weighted distribution before
            the wheel lands on a matching segment.
          </p>

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
