/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LuckyDrawPhase } from './luckyDrawTypes';
import { LUCKY_DRAW_TICKET_PRICE } from './luckyDrawData';
import { CasinoPanel, CasinoButton } from '../../ui-v2';
import { Ticket, Coins, AlertCircle } from 'lucide-react';

interface LuckyDrawTicketControlsProps {
  phase: LuckyDrawPhase;
  balance: number;
  isPurchasing: boolean;
  onBuyTickets: (count: number) => void;
}

export const LuckyDrawTicketControls: React.FC<LuckyDrawTicketControlsProps> = ({
  phase,
  balance,
  isPurchasing,
  onBuyTickets,
}) => {
  const isOpen = phase === 'open';
  const cost1 = LUCKY_DRAW_TICKET_PRICE * 1;
  const cost5 = LUCKY_DRAW_TICKET_PRICE * 5;

  const canAfford1 = balance >= cost1;
  const canAfford5 = balance >= cost5;

  let disabledReason = '';
  if (!isOpen) {
    disabledReason = 'TICKET SALES ARE CLOSED FOR THIS DRAW.';
  } else if (!canAfford1) {
    disabledReason = 'INSUFFICIENT COIN BALANCE';
  }

  return (
    <CasinoPanel
      title="BUY TICKETS"
      subtitle="0.20 COINS PER RAFFLE TICKET"
    >
      <div className="flex flex-col gap-4">
        {/* Cost info banner */}
        <div className="p-3 bg-[#0B0D18] border-2 border-[#2E3150] flex items-center justify-between font-jersey text-sm uppercase">
          <span className="text-[#9A9AB5] flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[#F6B73C]" />
            <span>PRICE PER TICKET</span>
          </span>
          <span className="text-[#F6B73C] font-bold text-base">
            {LUCKY_DRAW_TICKET_PRICE.toFixed(2)} COINS
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CasinoButton
            type="button"
            variant="cyan"
            soundType="none"
            size="lg"
            disabled={!isOpen || !canAfford1 || isPurchasing}
            onClick={() => onBuyTickets(1)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            <span>{isPurchasing ? 'PURCHASING...' : 'BUY 1 TICKET — 0.20 COINS'}</span>
          </CasinoButton>

          <CasinoButton
            type="button"
            variant="gold"
            soundType="none"
            size="lg"
            disabled={!isOpen || !canAfford5 || isPurchasing}
            onClick={() => onBuyTickets(5)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            <span>{isPurchasing ? 'PURCHASING...' : 'BUY 5 TICKETS — 1.00 COINS'}</span>
          </CasinoButton>
        </div>

        {/* Disabled Warning / Status Notice */}
        {disabledReason && (
          <div className="p-2.5 bg-[#0B0D18] border border-[#2E3150] flex items-center justify-center gap-2 text-[#E85D68] font-jersey text-xs uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{disabledReason}</span>
          </div>
        )}
      </div>
    </CasinoPanel>
  );
};
