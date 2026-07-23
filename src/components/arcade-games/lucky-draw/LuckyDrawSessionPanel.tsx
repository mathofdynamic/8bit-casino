/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LuckyDrawHistoryItem } from './luckyDrawTypes';
import { Transaction } from '../../../lib/api';
import { CasinoPanel, CasinoBadge } from '../../ui-v2';
import { PixelAvatar } from '../../../lib/avatars';
import { History, Trophy, Coins, Ticket, Target, Activity } from 'lucide-react';

interface LuckyDrawSessionPanelProps {
  wallet: number;
  currentTickets: number;
  currentPool: number;
  playerProbability: string;
  history: LuckyDrawHistoryItem[];
  transactionLog: Transaction[];
}

export const LuckyDrawSessionPanel: React.FC<LuckyDrawSessionPanelProps> = ({
  wallet,
  currentTickets,
  currentPool,
  playerProbability,
  history,
  transactionLog,
}) => {
  const recentActivity = (transactionLog || [])
    .filter((tx) => tx.source === 'lucky_draw')
    .slice(0, 5);

  const displayHistory = history.slice(0, 5);

  return (
    <CasinoPanel
      title="SESSION SUMMARY"
      subtitle="CURRENT DRAW, HISTORY & ACTIVITY"
    >
      <div className="flex flex-col gap-4">
        {/* Session Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-2.5 flex flex-col">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[#F6B73C]" />
              WALLET
            </span>
            <span className="font-jersey text-xl text-[#F6B73C] leading-none mt-1">
              {wallet.toFixed(2)} COINS
            </span>
          </div>

          <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-2.5 flex flex-col">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-[#D95F9A]" />
              YOUR CURRENT TICKETS
            </span>
            <span className="font-jersey text-xl text-[#D95F9A] leading-none mt-1">
              {currentTickets}
            </span>
          </div>

          <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-2.5 flex flex-col">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#F6B73C]" />
              CURRENT POOL
            </span>
            <span className="font-jersey text-xl text-[#F3EBD8] leading-none mt-1">
              {currentPool.toFixed(2)} COINS
            </span>
          </div>

          <div className="bg-[#0B0D18] border-2 border-[#2E3150] p-2.5 flex flex-col">
            <span className="font-jersey text-xs text-[#9A9AB5] uppercase flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#54D6D9]" />
              CURRENT CHANCE
            </span>
            <span className="font-jersey text-xl text-[#54D6D9] leading-none mt-1">
              {playerProbability}%
            </span>
          </div>
        </div>

        {/* Two Columns: Draw History & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Draw History */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-jersey text-sm text-[#54D6D9] uppercase">
              <History className="w-4 h-4" />
              <span>DRAW HISTORY</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {displayHistory.length === 0 ? (
                <div className="p-4 bg-[#0B0D18] border-2 border-[#2E3150] text-center font-jersey text-xs text-[#9A9AB5] uppercase">
                  NO COMPLETED DRAWS YET
                </div>
              ) : (
                displayHistory.map((item) => (
                  <div
                    key={`hist-${item.drawId}`}
                    className={`p-2 border-2 flex items-center justify-between gap-2 ${
                      item.winnerIsPlayer
                        ? 'bg-[#1D2036] border-[#F6B73C]'
                        : 'bg-[#0B0D18] border-[#2E3150]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <PixelAvatar avatarId={item.winnerAvatarId} size={28} className="shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-jersey text-xs text-[#F3EBD8] uppercase font-bold truncate">
                            DRAW #{item.drawId} — {item.winnerName}
                          </span>
                          {item.winnerIsPlayer && <CasinoBadge variant="gold">YOU</CasinoBadge>}
                        </div>
                        <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase">
                          {item.totalTickets} TICKETS
                        </span>
                      </div>
                    </div>

                    <div className="font-jersey text-sm text-[#F6B73C] shrink-0">
                      +{item.prizePool.toFixed(2)} COINS
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Lucky Draw Activity */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 font-jersey text-sm text-[#D95F9A] uppercase">
              <Activity className="w-4 h-4" />
              <span>RECENT LUCKY DRAW ACTIVITY</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {recentActivity.length === 0 ? (
                <div className="p-4 bg-[#0B0D18] border-2 border-[#2E3150] text-center font-jersey text-xs text-[#9A9AB5] uppercase">
                  NO RECENT TRANSACTIONS
                </div>
              ) : (
                recentActivity.map((tx) => {
                  const isCredit = tx.type === 'CREDIT';
                  return (
                    <div
                      key={tx.id}
                      className="p-2 bg-[#0B0D18] border-2 border-[#2E3150] flex items-center justify-between text-xs font-jersey uppercase"
                    >
                      <span className="text-[#9A9AB5]">
                        {isCredit ? 'PRIZE' : 'TICKETS'}
                      </span>
                      <span className={isCredit ? 'text-[#66D18F]' : 'text-[#E85D68]'}>
                        {isCredit
                          ? `+${Math.abs(tx.amount).toFixed(2)} COINS`
                          : `-${Math.abs(tx.amount).toFixed(2)} COINS`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </CasinoPanel>
  );
};
