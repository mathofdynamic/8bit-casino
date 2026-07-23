/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LuckyDrawEntrant, LuckyDrawTicket, LuckyDrawPhase } from './luckyDrawTypes';
import { CasinoPanel, CasinoBadge } from '../../ui-v2';
import { PixelAvatar } from '../../../lib/avatars';
import { Ticket, Sparkles } from 'lucide-react';

interface LuckyDrawRegistryProps {
  entrants: LuckyDrawEntrant[];
  tickets: LuckyDrawTicket[];
  totalTickets: number;
  phase: LuckyDrawPhase;
  reduceFlashing?: boolean;
  activeTumblerTicket: LuckyDrawTicket | null;
}

export const LuckyDrawRegistry: React.FC<LuckyDrawRegistryProps> = ({
  entrants,
  tickets,
  totalTickets,
  phase,
  reduceFlashing = false,
  activeTumblerTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'entrants' | 'tickets'>('entrants');

  return (
    <CasinoPanel
      title="CURRENT DRAW REGISTRY"
      subtitle="SIMULATED ENTRANTS AND TICKETS"
      headerAccent={
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={activeTab === 'entrants'}
            onClick={() => setActiveTab('entrants')}
            className={`px-2 py-1 font-jersey text-xs uppercase border cursor-pointer ${
              activeTab === 'entrants'
                ? 'bg-[#F6B73C] text-black border-black font-bold'
                : 'bg-[#0B0D18] text-[#9A9AB5] border-[#2E3150]'
            }`}
          >
            ENTRANTS ({entrants.length})
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'tickets'}
            onClick={() => setActiveTab('tickets')}
            className={`px-2 py-1 font-jersey text-xs uppercase border cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-[#F6B73C] text-black border-black font-bold'
                : 'bg-[#0B0D18] text-[#9A9AB5] border-[#2E3150]'
            }`}
          >
            TICKETS ({totalTickets})
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Tumbler view during 'tumbling' phase */}
        {phase === 'tumbling' && (
          <div className="p-4 bg-[#1D2036] border-2 border-[#F6B73C] flex flex-col items-center justify-center text-center gap-2">
            <div className="flex items-center gap-2 text-[#F6B73C] font-jersey text-sm uppercase">
              <Sparkles className="w-4 h-4 fill-[#F6B73C]" />
              <span>SELECTING WINNING TICKET</span>
              <Sparkles className="w-4 h-4 fill-[#F6B73C]" />
            </div>

            {reduceFlashing ? (
              <div className="p-3 bg-[#0B0D18] border-2 border-[#2E3150] min-w-[240px] flex flex-col items-center">
                <span className="font-jersey text-xl text-[#F3EBD8] uppercase">
                  SELECTING WINNING TICKET
                </span>
                <span className="font-jersey text-xs text-[#9A9AB5] uppercase mt-0.5">
                  RAPID VISUAL CYCLING DISABLED
                </span>
              </div>
            ) : (
              activeTumblerTicket && (
                <div className="flex items-center gap-3 p-3 bg-[#0B0D18] border-2 border-[#F6B73C] min-w-[240px]">
                  <PixelAvatar avatarId={activeTumblerTicket.avatarId} size={40} />
                  <div className="flex flex-col text-left">
                    <span className="font-jersey text-xl text-[#F3EBD8] uppercase">
                      {activeTumblerTicket.owner}
                    </span>
                    <span className="font-jersey text-xs text-[#54D6D9] uppercase">
                      TICKET #{activeTumblerTicket.ticketIndex + 1}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Entrants view */}
        {activeTab === 'entrants' ? (
          <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
            {entrants.length === 0 ? (
              <div className="p-6 bg-[#0B0D18] border-2 border-[#2E3150] text-center font-jersey text-base text-[#9A9AB5] uppercase">
                NO ENTRANTS YET. BUY TICKETS TO JOIN!
              </div>
            ) : (
              entrants.map((e, idx) => {
                const winChance = totalTickets > 0 ? ((e.tickets / totalTickets) * 100).toFixed(1) : '0.0';

                return (
                  <div
                    key={`${e.name}-${idx}`}
                    className={`p-2.5 border-2 flex items-center justify-between gap-3 ${
                      e.isPlayer
                        ? 'bg-[#1D2036] border-[#D95F9A]'
                        : 'bg-[#0B0D18] border-[#2E3150]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PixelAvatar avatarId={e.avatarId} size={36} className="shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-jersey text-lg text-[#F3EBD8] uppercase truncate leading-none">
                            {e.name}
                          </span>
                          {e.isPlayer && <CasinoBadge variant="magenta">YOU</CasinoBadge>}
                        </div>
                        <span className="font-jersey text-xs text-[#9A9AB5] uppercase mt-0.5">
                          {e.tickets} {e.tickets === 1 ? 'TICKET' : 'TICKETS'} ({winChance}% CHANCE)
                        </span>
                      </div>
                    </div>

                    <div className="font-jersey text-xl text-[#F6B73C] shrink-0">
                      {e.tickets} TIX
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Tickets view */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto pr-1">
            {tickets.length === 0 ? (
              <div className="col-span-full p-6 bg-[#0B0D18] border-2 border-[#2E3150] text-center font-jersey text-base text-[#9A9AB5] uppercase">
                NO TICKETS IN THE CURRENT DRAW
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={`tix-${t.ticketIndex}`}
                  className={`p-2 border flex items-center gap-2 ${
                    t.isPlayer
                      ? 'bg-[#1D2036] border-[#D95F9A] text-[#D95F9A]'
                      : 'bg-[#0B0D18] border-[#2E3150] text-[#9A9AB5]'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-jersey text-xs text-[#F3EBD8] truncate leading-none">
                      #{t.ticketIndex + 1} {t.owner}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </CasinoPanel>
  );
};
