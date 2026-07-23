import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CasinoButton } from '../../ui-v2';
import { SCRATCH_SYMBOLS } from './scratchData';
import { ScratchSymbolId } from './scratchTypes';

interface ScratchPaytableDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchPaytableDialog: React.FC<ScratchPaytableDialogProps> = ({
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="paytable-dialog-title"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-[#0B0D18]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#15182A] border-2 border-[#2E3150] p-6 relative filter drop-shadow-[8px_8px_0px_#000000] space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#2E3150] pb-3">
          <div>
            <h2
              id="paytable-dialog-title"
              className="text-2xl font-jersey text-[#F6B73C] uppercase m-0 tracking-wide"
            >
              PIXEL SCRATCHER PAYTABLE
            </h2>
            <p className="font-jersey text-xs text-[#9A9AB5] uppercase m-0 mt-0.5">
              Match three identical symbols anywhere on the completed card.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close paytable"
            className="text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Rates Table */}
        <div className="bg-[#222744] border border-[#2E3150] p-3 space-y-2 font-jersey uppercase text-xs">
          <div className="grid grid-cols-3 text-[#9A9AB5] border-b border-[#2E3150] pb-1 font-bold">
            <span>SYMBOL</span>
            <span className="text-center">MULTIPLIER</span>
            <span className="text-right">PROBABILITY</span>
          </div>

          {(Object.keys(SCRATCH_SYMBOLS) as ScratchSymbolId[]).map((symId) => {
            const sym = SCRATCH_SYMBOLS[symId];
            const Icon = sym.icon;
            return (
              <div
                key={symId}
                className="grid grid-cols-3 items-center border-b border-[#2E3150]/30 pb-1"
              >
                <div className="flex items-center gap-2">
                  <div className="scale-75 -mx-1">
                    <Icon />
                  </div>
                  <span style={{ color: sym.color }} className="font-bold">
                    {sym.name}
                  </span>
                </div>

                <span className="text-center text-[#F6B73C] font-bold">
                  {sym.multiplier}×
                </span>

                <span className="text-right text-[#54D6D9]">
                  {sym.probabilityText}
                </span>
              </div>
            );
          })}

          <div className="grid grid-cols-3 items-center pt-1 text-[#9A9AB5]">
            <span>NO MATCH</span>
            <span className="text-center">0×</span>
            <span className="text-right">74.76%</span>
          </div>
        </div>

        {/* Return Stat Banner */}
        <div className="bg-[#222744] border border-[#66D18F] p-3 text-center font-jersey uppercase">
          <span className="text-[#9A9AB5] text-xs">THEORETICAL RETURN: </span>
          <span className="text-[#66D18F] text-xl font-bold ml-1">92%</span>
        </div>

        {/* Rules & Explanation */}
        <div className="bg-[#0B0D18] border border-[#2E3150] p-3 font-jersey uppercase text-xs text-[#9A9AB5] space-y-1">
          <p className="m-0 text-[#F3EBD8]">HOW IT WORKS:</p>
          <p className="m-0">
            • The outcome is selected when a successfully purchased card is generated. The card then displays exactly one winning trio or no trio.
          </p>
          <p className="m-0">• Payout equals card price multiplied by symbol multiplier.</p>
          <p className="m-0">• All nine cells must be revealed to complete the card.</p>
          <p className="m-0">• Auto Reveal is equivalent to manually completing the card.</p>
          <p className="m-0">• Only the predetermined winning trio is paid.</p>
        </div>

        {/* Close Action */}
        <div className="pt-2 text-center">
          <CasinoButton type="button" variant="gold" onClick={onClose} className="w-full">
            DONE
          </CasinoButton>
        </div>
      </div>
    </div>
  );
};
