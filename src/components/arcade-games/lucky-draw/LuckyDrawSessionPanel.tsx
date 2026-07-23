/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LuckyDrawHistoryItem } from './luckyDrawTypes';
import { CasinoPanel, CasinoBadge } from '../../ui-v2';
import { PixelAvatar } from '../../../lib/avatars';
import { History, Trophy } from 'lucide-react';

interface LuckyDrawSessionPanelProps {
  history: LuckyDrawHistoryItem[];
}

export const LuckyDrawSessionPanel: React.FC<LuckyDrawSessionPanelProps> = ({
  history,
}) => {
  return (
    <CasinoPanel
      title="RECENT DRAWS HISTORY"
      subtitle="PAST COMPLETED RAFFLE WINNERS"
    >
      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="p-6 bg-[#111322] border-2 border-[#2E3150] text-center font-jersey text-base text-[#9A9AB5] uppercase flex flex-col items-center gap-2">
            <History className="w-6 h-6 text-[#63657A]" />
            <span>NO COMPLETED DRAWS RECORDED YET IN THIS SESSION</span>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={`hist-${item.drawId}`}
              className={`p-2.5 border-2 flex items-center justify-between gap-3 ${
                item.winnerIsPlayer
                  ? 'bg-[#1D2036] border-[#F6B73C]'
                  : 'bg-[#111322] border-[#2E3150]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <PixelAvatar avatarId={item.winnerAvatarId} size={32} className="shrink-0" />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-jersey text-sm text-[#F3EBD8] uppercase font-bold truncate">
                      DRAW #{item.drawId} — {item.winnerName}
                    </span>
                    {item.winnerIsPlayer && <CasinoBadge variant="gold">YOU</CasinoBadge>}
                  </div>
                  <span className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-0.5">
                    {item.totalTickets} TICKETS IN DRUM
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1 font-jersey text-base text-[#F6B73C]">
                  <Trophy className="w-3.5 h-3.5 fill-[#F6B73C]" />
                  <span>+{item.prizePool.toFixed(2)} COINS</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CasinoPanel>
  );
};
