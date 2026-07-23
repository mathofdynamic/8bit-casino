/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CasinoPanel, CasinoButton } from '../../ui-v2';
import { HelpCircle, X, Check, ShieldAlert } from 'lucide-react';

interface LuckyDrawRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LuckyDrawRulesDialog: React.FC<LuckyDrawRulesDialogProps> = ({
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
      aria-labelledby="lucky-draw-rules-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
    >
      <h2 id="lucky-draw-rules-title" className="sr-only">
        LUCKY DRAW RULES
      </h2>
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <CasinoPanel
          title="LUCKY DRAW RULES"
          subtitle="90-SECOND LOCAL CLOCK CYCLE"
          borderColor="strong"
          headerAccent={
            <button
              type="button"
              aria-label="Close Lucky Draw rules"
              onClick={onClose}
              className="p-1 bg-[#0B0D18] border border-[#2E3150] text-[#9A9AB5] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          }
          footer={
            <CasinoButton type="button" variant="gold" size="md" onClick={onClose}>
              DONE
            </CasinoButton>
          }
        >
          <div className="flex flex-col gap-4 font-jersey text-sm text-[#F3EBD8]">
            {/* Overview */}
            <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-3 flex flex-col gap-1">
              <span className="text-[#54D6D9] text-base uppercase font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>HOW IT WORKS</span>
              </span>
              <p className="text-[#9A9AB5] text-xs uppercase leading-relaxed">
                Lucky Draw uses a synchronized local 90-second clock cycle. Simulated entrants and stored player tickets form the completed draw registry. One ticket is selected deterministically from that completed registry.
              </p>
            </div>

            {/* Economics */}
            <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-3 flex flex-col gap-2">
              <span className="text-[#F6B73C] text-base uppercase font-bold">
                TICKET PRICE & PRIZE POOL
              </span>
              <ul className="flex flex-col gap-1 text-xs text-[#9A9AB5] uppercase">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>Each ticket costs 0.20 Coins.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>5% is the play-money house rake.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>95% forms the prize pool.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>Every purchased ticket is one weighted entry.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>Buying five tickets creates five entries.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>The previous completed draw is revealed during the next cycle.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#66D18F] shrink-0" />
                  <span>A player prize is credited only when the selected ticket belongs to the signed-in player.</span>
                </li>
              </ul>
            </div>

            {/* 90-Second Cycle Timeline */}
            <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-3 flex flex-col gap-2">
              <span className="text-[#D95F9A] text-base uppercase font-bold">
                90-SECOND CYCLE TIMELINE
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-[#9A9AB5] uppercase">
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#D95F9A] font-bold">0S - 9S: WINNER REVEAL</span>
                  <span>Previous draw winner revealed</span>
                </div>
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#66D18F] font-bold">10S - 69S: TICKET SALES OPEN</span>
                  <span>Buy 1 or 5 tickets per action</span>
                </div>
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#F29E4C] font-bold">70S - 79S: SALES LOCKED</span>
                  <span>Ticket drum finalized, no new purchases</span>
                </div>
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#F6B73C] font-bold">80S - 84S: SELECTING WINNER</span>
                  <span>Raffle drum selects winning ticket</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E85D68] font-bold">85S - 89S: FINALIZING DRAW</span>
                  <span>Finalizing settlement & preparing next draw</span>
                </div>
              </div>
            </div>

            {/* Play-Money Disclaimer */}
            <div className="p-3 bg-[#0B0D18] border border-[#2E3150] flex items-start gap-2.5 text-[#9A9AB5] text-xs uppercase">
              <ShieldAlert className="w-5 h-5 text-[#F29E4C] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Play-money chips only. Lucky Draw is a simulated arcade raffle for entertainment purposes with no cash value or real-money gambling payout.
              </p>
            </div>
          </div>
        </CasinoPanel>
      </div>
    </div>
  );
};
