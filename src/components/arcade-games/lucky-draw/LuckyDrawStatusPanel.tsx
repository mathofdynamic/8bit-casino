/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LuckyDrawPhase } from './luckyDrawTypes';
import { CasinoPanel, CasinoBadge, CasinoProgressBar } from '../../ui-v2';
import { Ticket, Trophy, Clock, Users } from 'lucide-react';

interface LuckyDrawStatusPanelProps {
  drawId: number;
  phase: LuckyDrawPhase;
  cycleTime: number;
  prizePool: number;
  totalTickets: number;
  playerTickets: number;
}

export const LuckyDrawStatusPanel: React.FC<LuckyDrawStatusPanelProps> = ({
  drawId,
  phase,
  cycleTime,
  prizePool,
  totalTickets,
  playerTickets,
}) => {
  // Phase timer calculations
  let phaseName = 'OPEN';
  let badgeVariant: 'gold' | 'cyan' | 'magenta' | 'success' | 'warning' | 'danger' = 'cyan';
  let phaseSecondsRemaining = 0;
  let phaseMaxSeconds = 60;

  if (phase === 'reveal') {
    phaseName = 'PREVIOUS DRAW REVEAL';
    badgeVariant = 'magenta';
    phaseSecondsRemaining = Math.max(0, 10 - cycleTime);
    phaseMaxSeconds = 10;
  } else if (phase === 'open') {
    phaseName = 'TICKET SALES OPEN';
    badgeVariant = 'success';
    phaseSecondsRemaining = Math.max(0, 70 - cycleTime);
    phaseMaxSeconds = 60;
  } else if (phase === 'locked') {
    phaseName = 'SALES LOCKED';
    badgeVariant = 'warning';
    phaseSecondsRemaining = Math.max(0, 80 - cycleTime);
    phaseMaxSeconds = 10;
  } else if (phase === 'tumbling') {
    phaseName = 'DRAWING WINNER';
    badgeVariant = 'gold';
    phaseSecondsRemaining = Math.max(0, 85 - cycleTime);
    phaseMaxSeconds = 5;
  } else {
    phaseName = 'DRAW BUFFER';
    badgeVariant = 'danger';
    phaseSecondsRemaining = Math.max(0, 90 - cycleTime);
    phaseMaxSeconds = 5;
  }

  const winProbability = totalTickets > 0 ? ((playerTickets / totalTickets) * 100).toFixed(1) : '0.0';

  return (
    <CasinoPanel
      title={`DRAW #${drawId}`}
      subtitle="GLOBAL SYNCHRONIZED POOL"
      headerAccent={
        <CasinoBadge variant={badgeVariant}>
          {phaseName}
        </CasinoBadge>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Phase Progress & Countdown */}
        <div className="bg-[#111322] border-2 border-[#2E3150] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between font-jersey text-sm uppercase text-[#9A9AB5]">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#54D6D9]" />
              <span>{phaseName} COUNTDOWN</span>
            </span>
            <span className="text-[#F3EBD8] font-bold text-base">
              {phaseSecondsRemaining}S REMAINING
            </span>
          </div>

          <CasinoProgressBar
            value={phaseMaxSeconds - phaseSecondsRemaining}
            max={phaseMaxSeconds}
            segments={15}
            color={phase === 'open' ? 'success' : phase === 'reveal' ? 'magenta' : 'gold'}
          />
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Prize Pool */}
          <div className="bg-[#111322] border-2 border-[#F6B73C]/40 p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#F6B73C] font-jersey text-xs uppercase mb-1">
              <Trophy className="w-4 h-4 shrink-0" />
              <span>PRIZE POOL</span>
            </div>
            <div className="font-jersey text-2xl md:text-3xl text-[#F6B73C] leading-none">
              {prizePool.toFixed(2)} COINS
            </div>
            <div className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-1">
              95% RTP ALLOCATION
            </div>
          </div>

          {/* Total Tickets */}
          <div className="bg-[#111322] border-2 border-[#2E3150] p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#54D6D9] font-jersey text-xs uppercase mb-1">
              <Users className="w-4 h-4 shrink-0" />
              <span>TOTAL TICKETS</span>
            </div>
            <div className="font-jersey text-2xl md:text-3xl text-[#F3EBD8] leading-none">
              {totalTickets}
            </div>
            <div className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-1">
              ENTRANTS & BOTS
            </div>
          </div>

          {/* My Tickets */}
          <div className="col-span-2 md:col-span-1 bg-[#111322] border-2 border-[#D95F9A]/40 p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#D95F9A] font-jersey text-xs uppercase mb-1">
              <Ticket className="w-4 h-4 shrink-0" />
              <span>MY TICKETS</span>
            </div>
            <div className="font-jersey text-2xl md:text-3xl text-[#D95F9A] leading-none flex items-baseline gap-2">
              <span>{playerTickets}</span>
              {playerTickets > 0 && (
                <span className="text-xs text-[#54D6D9]">
                  ({winProbability}% CHANCE)
                </span>
              )}
            </div>
            <div className="font-jersey text-[10px] text-[#9A9AB5] uppercase mt-1">
              {playerTickets > 0 ? 'ACTIVE IN DRAW' : 'NO TICKETS BOUGHT YET'}
            </div>
          </div>
        </div>
      </div>
    </CasinoPanel>
  );
};
