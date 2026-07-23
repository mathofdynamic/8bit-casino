/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CasinoButton, CasinoBadge } from '../../ui-v2';

interface PachinkoRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PachinkoRulesDialog: React.FC<PachinkoRulesDialogProps> = ({
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
      aria-labelledby="pachinko-rules-title"
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#15182A] border-2 border-[#44476B] p-5 filter drop-shadow-[8px_8px_0px_#000000] my-auto"
        style={{
          clipPath:
            'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#2E3150] pb-3 mb-4">
          <div>
            <h3
              id="pachinko-rules-title"
              className="font-jersey text-2xl text-[#F6B73C] uppercase tracking-wide m-0"
            >
              PLINKO CASCADE RULES
            </h3>
            <p className="font-jersey text-xs text-[#9A9AB5] uppercase m-0 mt-1">
              Eight independent left-or-right decisions produce one of nine landing slots.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close rules"
            className="p-1 bg-[#222744] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] hover:bg-[#2E355E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 font-jersey text-sm uppercase text-[#F3EBD8]">
          {/* Probability Breakdown Table */}
          <div className="bg-[#0B0D18] border border-[#2E3150] p-3 space-y-2">
            <div className="flex justify-between border-b border-[#2E3150] pb-1 text-xs text-[#9A9AB5]">
              <span>SLOT CATEGORY</span>
              <span>PATHS</span>
              <span>PROBABILITY</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#F6B73C] font-bold">20× EDGE SLOTS</span>
              <span className="text-[#9A9AB5]">2 / 256 paths</span>
              <span className="text-[#F6B73C]">0.78%</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#D95F9A] font-bold">4× NEAR-EDGE SLOTS</span>
              <span className="text-[#9A9AB5]">16 / 256 paths</span>
              <span className="text-[#D95F9A]">6.25%</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#54D6D9] font-bold">1.3× OUTER-MIDDLE SLOTS</span>
              <span className="text-[#9A9AB5]">56 / 256 paths</span>
              <span className="text-[#54D6D9]">21.88%</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9AB5] font-bold">0.4× INNER SLOTS</span>
              <span className="text-[#9A9AB5]">112 / 256 paths</span>
              <span className="text-[#F3EBD8]">43.75%</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#63657A] font-bold">0.2× CENTER SLOT</span>
              <span className="text-[#9A9AB5]">70 / 256 paths</span>
              <span className="text-[#F3EBD8]">27.34%</span>
            </div>
          </div>

          {/* Return Badge */}
          <div className="bg-[#222744] border border-[#2E3150] p-3 text-center flex items-center justify-between">
            <span className="text-xs text-[#9A9AB5]">THEORETICAL RETURN</span>
            <CasinoBadge variant="gold">92.03%</CasinoBadge>
          </div>

          {/* Detailed Mechanics */}
          <div className="space-y-2 text-xs text-[#9A9AB5] leading-relaxed">
            <p className="m-0 text-[#F3EBD8]">
              Each peg row independently sends the ball left or right with equal probability. The final slot is determined by the total number of right movements.
            </p>
            <ul className="list-disc pl-4 space-y-1 m-0">
              <li>Each ball keeps the bet used when it was launched.</li>
              <li>Multiple balls may be active at once.</li>
              <li>Every slot credits its displayed multiplier.</li>
              <li>0.2× and 0.4× are partial returns.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#2E3150] flex justify-end">
          <CasinoButton type="button" variant="gold" onClick={onClose}>
            DONE
          </CasinoButton>
        </div>
      </div>
    </div>
  );
};
