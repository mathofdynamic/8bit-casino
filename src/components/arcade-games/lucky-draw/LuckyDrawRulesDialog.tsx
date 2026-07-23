/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CasinoPanel
          title="LUCKY DRAW RULES"
          subtitle="SYNCHRONIZED 90S RAFFLE SYSTEM"
          borderColor="strong"
          headerAccent={
            <button
              onClick={onClose}
              className="p-1 bg-[#111322] border border-[#2E3150] text-[#9A9AB5] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          }
          footer={
            <CasinoButton variant="gold" size="md" onClick={onClose}>
              UNDERSTOOD
            </CasinoButton>
          }
        >
          <div className="flex flex-col gap-4 font-jersey text-sm text-[#F3EBD8]">
            {/* Overview */}
            <div className="bg-[#111322] border-2 border-[#2E3150] p-3 flex flex-col gap-1">
              <span className="text-[#54D6D9] text-base uppercase font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>HOW IT WORKS</span>
              </span>
              <p className="text-[#9A9AB5] text-xs uppercase leading-relaxed">
                Lucky Draw is a synchronized 90-second raffle. Every 90 seconds, all active tickets in the drum enter a random drawing for 95% of the gross ticket sales pool.
              </p>
            </div>

            {/* Economics */}
            <div className="bg-[#111322] border-2 border-[#2E3150] p-3 flex flex-col gap-2">
              <span className="text-[#F6B73C] text-base uppercase font-bold">
                TICKET PRICE & PRIZE POOL
              </span>
              <ul className="flex flex-col gap-1 text-xs text-[#9A9AB5] uppercase">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3fff6e] shrink-0" />
                  <span>Each ticket costs exactly 0.20 Coins.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3fff6e] shrink-0" />
                  <span>5% house rake is deducted to maintain the platform.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3fff6e] shrink-0" />
                  <span>95% of total ticket sales form the winner prize pool.</span>
                </li>
              </ul>
            </div>

            {/* 90-Second Cycle Timeline */}
            <div className="bg-[#111322] border-2 border-[#2E3150] p-3 flex flex-col gap-2">
              <span className="text-[#D95F9A] text-base uppercase font-bold">
                90-SECOND CYCLE TIMELINE
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-[#9A9AB5] uppercase">
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#D95F9A] font-bold">0S - 10S: REVEAL PHASE</span>
                  <span>Previous draw winner announced & credited</span>
                </div>
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#3fff6e] font-bold">10S - 70S: TICKET SALES OPEN</span>
                  <span>Buy 1 or 5 tickets per action</span>
                </div>
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#F29E4C] font-bold">70S - 80S: SALES LOCKED</span>
                  <span>Ticket drum finalized, no new purchases</span>
                </div>
                <div className="flex justify-between border-b border-[#2E3150] pb-1">
                  <span className="text-[#F6B73C] font-bold">80S - 85S: TUMBLING</span>
                  <span>Raffle drum shuffles to select winning ticket</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E85D68] font-bold">85S - 90S: BUFFER</span>
                  <span>Finalizing settlement & preparing next draw</span>
                </div>
              </div>
            </div>

            {/* Play-Money Disclaimer */}
            <div className="p-3 bg-[#111322] border border-[#2E3150] flex items-start gap-2.5 text-[#9A9AB5] text-xs uppercase">
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
