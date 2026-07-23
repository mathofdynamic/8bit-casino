/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../../store';
import { audio } from '../../../lib/audio';
import {
  LuckyDrawHistoryItem,
  LuckyDrawPayoutStatus,
  LuckyDrawPlayerEntry,
} from './luckyDrawTypes';
import {
  getLuckyDrawClock,
  getLuckyDrawPhase,
  readPlayerEntry,
  writePlayerEntry,
  buildDrawSnapshot,
  LUCKY_DRAW_TICKET_PRICE,
} from './luckyDrawData';
import { LuckyDrawGameHeader } from './LuckyDrawGameHeader';
import { LuckyDrawStatusPanel } from './LuckyDrawStatusPanel';
import { LuckyDrawRevealPanel } from './LuckyDrawRevealPanel';
import { LuckyDrawRegistry } from './LuckyDrawRegistry';
import { LuckyDrawTicketControls } from './LuckyDrawTicketControls';
import { LuckyDrawSessionPanel } from './LuckyDrawSessionPanel';
import { LuckyDrawRulesDialog } from './LuckyDrawRulesDialog';

interface LuckyDrawGameScreenProps {
  onBack: () => void;
}

export const LuckyDrawGameScreen: React.FC<LuckyDrawGameScreenProps> = ({
  onBack,
}) => {
  const { profile, adjustBalance, reduceFlashing } = useStore();
  const wallet = profile.chips;

  // Clock state updated synchronously and on 1000ms timer
  const [clock, setClock] = useState(() => getLuckyDrawClock());
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<LuckyDrawPayoutStatus>('none');
  const [history, setHistory] = useState<LuckyDrawHistoryItem[]>([]);

  // Locks & references to prevent race conditions
  const purchaseLockRef = useRef(false);
  const payoutLocksRef = useRef<Set<number>>(new Set());

  // Player identity fallback
  const playerName = profile.name || 'PLAYER';
  const playerAvatarId = profile.avatarId ?? 0;

  // Tick clock every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getLuckyDrawClock());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { cycleTime, currentDrawId } = clock;
  const phase = getLuckyDrawPhase(cycleTime);

  // Read current player entry for currentDrawId
  const [playerEntryVersion, setPlayerEntryVersion] = useState(0);
  const currentPlayerEntry: LuckyDrawPlayerEntry | null = useMemo(() => {
    return readPlayerEntry(currentDrawId, playerName, playerAvatarId);
  }, [currentDrawId, playerName, playerAvatarId, playerEntryVersion]);

  // Current draw snapshot
  const currentSnapshot = useMemo(() => {
    return buildDrawSnapshot(currentDrawId, cycleTime, currentPlayerEntry);
  }, [currentDrawId, cycleTime, currentPlayerEntry]);

  // Previous draw snapshot for REVEAL phase (revealDrawId = currentDrawId - 1)
  const revealDrawId = currentDrawId - 1;
  const revealPlayerEntry = useMemo(() => {
    return readPlayerEntry(revealDrawId, playerName, playerAvatarId);
  }, [revealDrawId, playerName, playerAvatarId]);

  const revealSnapshot = useMemo(() => {
    return buildDrawSnapshot(revealDrawId, 70, revealPlayerEntry);
  }, [revealDrawId, revealPlayerEntry]);

  // Record completed draw history
  useEffect(() => {
    if (revealSnapshot && revealSnapshot.drawId >= 0) {
      setHistory((prev) => {
        if (prev.some((item) => item.drawId === revealSnapshot.drawId)) {
          return prev;
        }

        const newHistoryItem: LuckyDrawHistoryItem = {
          drawId: revealSnapshot.drawId,
          winnerName: revealSnapshot.winner ? revealSnapshot.winner.owner : 'NO WINNER',
          winnerAvatarId: revealSnapshot.winner ? revealSnapshot.winner.avatarId : 0,
          winnerIsPlayer: revealSnapshot.winner ? revealSnapshot.winner.isPlayer : false,
          prizePool: revealSnapshot.prizePool,
          totalTickets: revealSnapshot.totalTickets,
          timestamp: Date.now(),
        };

        return [newHistoryItem, ...prev].slice(0, 15);
      });
    }
  }, [revealSnapshot]);

  // Process Payout Settlement when revealSnapshot winner is player
  useEffect(() => {
    if (phase === 'reveal' && revealSnapshot.winner && revealSnapshot.winner.isPlayer) {
      const prize = revealSnapshot.prizePool;
      if (prize > 0 && !payoutLocksRef.current.has(revealDrawId)) {
        payoutLocksRef.current.add(revealDrawId);
        setPayoutStatus('crediting');

        adjustBalance(prize, 'lucky_draw')
          .then((success) => {
            if (success) {
              setPayoutStatus('credited');
              audio.playWin();
            } else {
              setPayoutStatus('failed');
            }
          })
          .catch(() => {
            setPayoutStatus('failed');
          });
      }
    } else if (phase !== 'reveal') {
      setPayoutStatus('none');
    }
  }, [phase, revealDrawId, revealSnapshot, adjustBalance]);

  // Handle ticket purchase
  const handleBuyTickets = async (count: number) => {
    if (phase !== 'open' || purchaseLockRef.current) return;

    const totalCost = count * LUCKY_DRAW_TICKET_PRICE;
    if (wallet < totalCost) return;

    purchaseLockRef.current = true;
    setIsPurchasing(true);

    try {
      const success = await adjustBalance(-totalCost, 'lucky_draw');
      if (success) {
        audio.playCoin();
        const existing = readPlayerEntry(currentDrawId, playerName, playerAvatarId);
        const currentTickets = existing ? existing.tickets : 0;
        const newTickets = currentTickets + count;

        writePlayerEntry(currentDrawId, {
          name: playerName,
          avatarId: playerAvatarId,
          tickets: newTickets,
        });

        // Trigger re-read of player entry
        setPlayerEntryVersion((v) => v + 1);
      }
    } catch (_) {
      // Handle balance deduction errors
    } finally {
      purchaseLockRef.current = false;
      setIsPurchasing(false);
    }
  };

  const playerTicketCount = currentPlayerEntry ? currentPlayerEntry.tickets : 0;

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#F3EBD8] flex flex-col select-none">
      {/* Top Header */}
      <LuckyDrawGameHeader
        onBack={onBack}
        onOpenRules={() => setIsRulesOpen(true)}
        balance={wallet}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-3 md:p-6 max-w-6xl mx-auto w-full flex flex-col gap-4 md:gap-6">
        {/* Reveal Banner during REVEAL phase */}
        {phase === 'reveal' && (
          <LuckyDrawRevealPanel
            revealSnapshot={revealSnapshot}
            payoutStatus={payoutStatus}
            playerName={playerName}
          />
        )}

        {/* Draw Status & Countdown Panel */}
        <LuckyDrawStatusPanel
          drawId={currentDrawId}
          phase={phase}
          cycleTime={cycleTime}
          prizePool={currentSnapshot.prizePool}
          totalTickets={currentSnapshot.totalTickets}
          playerTickets={playerTicketCount}
        />

        {/* Middle Row: Ticket Controls & Ticket Registry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <LuckyDrawTicketControls
            phase={phase}
            balance={wallet}
            isPurchasing={isPurchasing}
            onBuyTickets={handleBuyTickets}
          />

          <LuckyDrawRegistry
            entrants={currentSnapshot.entrants}
            tickets={currentSnapshot.tickets}
            totalTickets={currentSnapshot.totalTickets}
            phase={phase}
            reduceFlashing={reduceFlashing}
          />
        </div>

        {/* History / Session Panel */}
        <LuckyDrawSessionPanel history={history} />
      </main>

      {/* Rules Dialog Modal */}
      <LuckyDrawRulesDialog
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};
