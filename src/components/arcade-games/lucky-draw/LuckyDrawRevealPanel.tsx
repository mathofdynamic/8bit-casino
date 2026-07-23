/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LuckyDrawSnapshot, LuckyDrawPayoutStatus } from './luckyDrawTypes';
import { CasinoPanel, CasinoBadge, CasinoButton } from '../../ui-v2';
import { PixelAvatar } from '../../../lib/avatars';
import { Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

interface LuckyDrawRevealPanelProps {
  revealSnapshot: LuckyDrawSnapshot;
  payoutStatus: LuckyDrawPayoutStatus;
  onRetryPrize: () => void;
}

export const LuckyDrawRevealPanel: React.FC<LuckyDrawRevealPanelProps> = ({
  revealSnapshot,
  payoutStatus,
  onRetryPrize,
}) => {
  const { drawId, winner, prizePool, totalTickets } = revealSnapshot;
  const isPlayerWinner = winner ? winner.isPlayer : false;

  return (
    <CasinoPanel
      title={`DRAW #${drawId} RESULTS`}
      subtitle="PREVIOUS DRAW WINNER ANNOUNCEMENT"
      borderColor="strong"
      headerAccent={
        <CasinoBadge variant={isPlayerWinner ? 'gold' : 'magenta'}>
          {isPlayerWinner ? 'YOU WON!' : 'DRAW RESOLVED'}
        </CasinoBadge>
      }
    >
      <div className="flex flex-col gap-3">
        {winner ? (
          <div
            className={`p-4 border-2 flex flex-col md:flex-row items-center justify-between gap-4 ${
              isPlayerWinner
                ? 'bg-[#1D2036] border-[#F6B73C]'
                : 'bg-[#0B0D18] border-[#2E3150]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <PixelAvatar
                  avatarId={winner.avatarId}
                  size={56}
                  className={isPlayerWinner ? 'ring-2 ring-[#F6B73C]' : ''}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#F6B73C] text-black rounded-full p-1 border border-black">
                  <Trophy className="w-3.5 h-3.5 fill-black" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide">
                    {winner.owner}
                  </span>
                  {winner.isPlayer && (
                    <CasinoBadge variant="gold">YOU</CasinoBadge>
                  )}
                </div>

                <span className="font-jersey text-xs text-[#9A9AB5] uppercase mt-0.5">
                  WINNING TICKET #{winner.ticketIndex + 1} OF {totalTickets}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <span className="font-jersey text-xs text-[#9A9AB5] uppercase">
                PRIZE POOL AWARDED
              </span>
              <span className="font-jersey text-3xl text-[#F6B73C] leading-none mt-1">
                {prizePool.toFixed(2)} COINS
              </span>

              {isPlayerWinner && (
                <div className="flex flex-col items-center md:items-end gap-1.5 mt-2">
                  {payoutStatus === 'crediting' && (
                    <span className="text-[#F6B73C] font-jersey text-sm uppercase">
                      CREDITING PRIZE...
                    </span>
                  )}
                  {payoutStatus === 'credited' && (
                    <div className="flex items-center gap-1.5 text-[#66D18F] font-jersey text-sm uppercase">
                      <CheckCircle2 className="w-4 h-4 text-[#66D18F]" />
                      <span>PRIZE CREDITED</span>
                    </div>
                  )}
                  {payoutStatus === 'none' && (
                    <span className="text-[#F6B73C] font-jersey text-sm uppercase">
                      PRIZE READY
                    </span>
                  )}
                  {payoutStatus === 'failed' && (
                    <div className="flex flex-col items-center md:items-end gap-1">
                      <span className="text-[#E85D68] font-jersey text-sm uppercase">
                        PAYOUT RETRY REQUIRED
                      </span>
                      <CasinoButton
                        type="button"
                        variant="magenta"
                        soundType="none"
                        onClick={onRetryPrize}
                      >
                        RETRY PRIZE
                      </CasinoButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#0B0D18] border-2 border-[#2E3150] flex flex-col items-center justify-center text-center">
            <span className="font-jersey text-xl text-[#9A9AB5] uppercase">
              NO TICKETS WERE BOUGHT IN DRAW #{drawId}
            </span>
            <span className="font-jersey text-xs text-[#63657A] uppercase mt-1">
              PRIZE POOL WAS NOT CLAIMED
            </span>
          </div>
        )}

        {/* Winner Highlight Banner */}
        {isPlayerWinner && (
          <div className="p-3 bg-[#F6B73C]/20 border-2 border-[#F6B73C] flex items-center justify-center gap-2 text-[#F6B73C] font-jersey text-lg uppercase tracking-wider">
            <Sparkles className="w-5 h-5 fill-[#F6B73C]" />
            <span>JACKPOT! YOUR TICKET WAS DRAWN! +{prizePool.toFixed(2)} COINS</span>
            <Sparkles className="w-5 h-5 fill-[#F6B73C]" />
          </div>
        )}
      </div>
    </CasinoPanel>
  );
};
