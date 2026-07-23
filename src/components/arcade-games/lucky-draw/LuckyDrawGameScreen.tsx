/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

const getPrizeClaimKey = (drawId: number): string =>
  `lucky_draw_claimed_${drawId}`;

const isPrizeClaimed = (drawId: number): boolean => {
  try {
    return localStorage.getItem(getPrizeClaimKey(drawId)) === 'true';
  } catch {
    return false;
  }
};

const markPrizeClaimed = (drawId: number): void => {
  try {
    localStorage.setItem(getPrizeClaimKey(drawId), 'true');
  } catch {
    // Local storage may be unavailable.
  }
};

const getInitialHistory = (
  baseDrawId: number,
  name: string,
  avatarId: number
): LuckyDrawHistoryItem[] => {
  const items: LuckyDrawHistoryItem[] = [];
  for (let offset = 1; offset <= 4; offset++) {
    const dId = baseDrawId - offset;
    if (dId < 0) continue;
    const entry = readPlayerEntry(dId, name, avatarId);
    const snap = buildDrawSnapshot(dId, 70, entry);
    if (snap.winner) {
      items.push({
        drawId: snap.drawId,
        winnerName: snap.winner.owner,
        winnerAvatarId: snap.winner.avatarId,
        winnerIsPlayer: snap.winner.isPlayer,
        prizePool: snap.prizePool,
        totalTickets: snap.totalTickets,
        timestamp: (snap.drawId + 1) * 90 * 1000,
      });
    }
  }
  return items;
};

export const LuckyDrawGameScreen: React.FC<LuckyDrawGameScreenProps> = ({
  onBack,
}) => {
  const {
    profile,
    adjustBalance,
    reduceFlashing,
    triggerToast,
    transactionLog,
  } = useStore();
  const wallet = profile.chips;

  // Controller lifecycle refs
  const mountedRef = useRef<boolean>(true);
  const payoutLockRef = useRef<boolean>(false);
  const purchaseLockRef = useRef<boolean>(false);
  const attemptedPayoutDrawIdsRef = useRef<Set<number>>(new Set());
  const tumblerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock state updated synchronously and on 1000ms timer
  const [clock, setClock] = useState(() => getLuckyDrawClock());
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<LuckyDrawPayoutStatus>('none');
  const [tumblerIndex, setTumblerIndex] = useState<number>(0);

  // Player identity fallback
  const playerName = profile.name || 'PLAYER';
  const playerAvatarId = profile.avatarId ?? 0;

  const { cycleTime, currentDrawId } = clock;
  const phase = getLuckyDrawPhase(cycleTime);

  // Initial history from previous 4 completed draws
  const [history, setHistory] = useState<LuckyDrawHistoryItem[]>(() =>
    getInitialHistory(currentDrawId, playerName, playerAvatarId)
  );

  // Clock lifecycle effect
  useEffect(() => {
    mountedRef.current = true;
    const timer = setInterval(() => {
      if (mountedRef.current) {
        setClock(getLuckyDrawClock());
      }
    }, 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(timer);
      if (tumblerIntervalRef.current !== null) {
        clearInterval(tumblerIntervalRef.current);
        tumblerIntervalRef.current = null;
      }
      purchaseLockRef.current = false;
      payoutLockRef.current = false;
    };
  }, []);

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

  // Update history when new reveal draw appears
  useEffect(() => {
    if (revealSnapshot && revealSnapshot.drawId >= 0 && revealSnapshot.winner) {
      setHistory((prev) => {
        if (prev.some((item) => item.drawId === revealSnapshot.drawId)) {
          return prev;
        }

        const newHistoryItem: LuckyDrawHistoryItem = {
          drawId: revealSnapshot.drawId,
          winnerName: revealSnapshot.winner!.owner,
          winnerAvatarId: revealSnapshot.winner!.avatarId,
          winnerIsPlayer: revealSnapshot.winner!.isPlayer,
          prizePool: revealSnapshot.prizePool,
          totalTickets: revealSnapshot.totalTickets,
          timestamp: (revealSnapshot.drawId + 1) * 90 * 1000,
        };

        return [newHistoryItem, ...prev].slice(0, 8);
      });
    }
  }, [revealSnapshot]);

  // Safe Prize Credit function
  const creditRevealPrize = useCallback(
    async (isRetry: boolean): Promise<void> => {
      const winner = revealSnapshot.winner;
      const prize = revealSnapshot.prizePool;

      if (phase !== 'reveal' || !winner || !winner.isPlayer || prize <= 0) {
        return;
      }

      if (isPrizeClaimed(revealDrawId)) {
        if (mountedRef.current) {
          setPayoutStatus('credited');
        }
        return;
      }

      if (payoutLockRef.current) {
        return;
      }

      if (!isRetry && attemptedPayoutDrawIdsRef.current.has(revealDrawId)) {
        return;
      }

      if (!isRetry) {
        attemptedPayoutDrawIdsRef.current.add(revealDrawId);
      }

      payoutLockRef.current = true;

      if (mountedRef.current) {
        setPayoutStatus('crediting');
      }

      try {
        const success = await adjustBalance(prize, 'lucky_draw');

        if (success) {
          markPrizeClaimed(revealDrawId);

          if (mountedRef.current) {
            setPayoutStatus('credited');
            audio.playWin();
            triggerToast(
              `YOU WON DRAW #${revealDrawId} — +${prize.toFixed(2)} COINS`,
              'success'
            );
          }
        } else if (mountedRef.current) {
          setPayoutStatus('failed');
          triggerToast(
            'PAYOUT COULD NOT BE CREDITED. RETRY THE PRIZE.',
            'error'
          );
        }
      } catch {
        if (mountedRef.current) {
          setPayoutStatus('failed');
          triggerToast(
            'PAYOUT COULD NOT BE CREDITED. RETRY THE PRIZE.',
            'error'
          );
        }
      } finally {
        payoutLockRef.current = false;
      }
    },
    [phase, revealSnapshot, revealDrawId, adjustBalance, triggerToast]
  );

  // Automatic payout effect
  useEffect(() => {
    if (phase === 'reveal') {
      const winner = revealSnapshot.winner;
      if (!winner || !winner.isPlayer) {
        setPayoutStatus('none');
      } else if (isPrizeClaimed(revealDrawId)) {
        setPayoutStatus('credited');
      } else {
        creditRevealPrize(false);
      }
    } else {
      setPayoutStatus('none');
    }
  }, [phase, revealDrawId, revealSnapshot.winner, creditRevealPrize]);

  // Handle Retry Prize
  const handleRetryPrize = async (): Promise<void> => {
    await creditRevealPrize(true);
  };

  // Controller-owned Tumbler timing effect
  useEffect(() => {
    if (tumblerIntervalRef.current !== null) {
      clearInterval(tumblerIntervalRef.current);
      tumblerIntervalRef.current = null;
    }

    const ticketCount = currentSnapshot.tickets.length;

    if (phase === 'tumbling' && ticketCount > 0 && !reduceFlashing) {
      tumblerIntervalRef.current = setInterval(() => {
        if (!mountedRef.current) return;
        setTumblerIndex((prev) => (prev + 1) % ticketCount);
        audio.playBeep(
          300 + Math.floor(Math.random() * 200),
          50,
          0.08,
          'square'
        );
      }, 100);
    } else {
      setTumblerIndex(0);
    }

    return () => {
      if (tumblerIntervalRef.current !== null) {
        clearInterval(tumblerIntervalRef.current);
        tumblerIntervalRef.current = null;
      }
    };
  }, [phase, currentSnapshot.tickets.length, reduceFlashing]);

  // Active Tumbler Ticket
  const activeTumblerTicket =
    currentSnapshot.tickets.length > 0
      ? currentSnapshot.tickets[tumblerIndex % currentSnapshot.tickets.length]
      : null;

  // Ticket Purchase Handler
  const handleBuyTickets = async (count: number) => {
    if (purchaseLockRef.current || isPurchasing || phase !== 'open') {
      return;
    }

    purchaseLockRef.current = true;
    setIsPurchasing(true);

    try {
      if (!profile.isLoggedIn) {
        triggerToast('SIGN IN TO JOIN THE DRAW.', 'error');
        return;
      }

      const totalCost = Number((count * LUCKY_DRAW_TICKET_PRICE).toFixed(2));
      if (wallet < totalCost) {
        triggerToast('NOT ENOUGH COINS FOR THESE TICKETS.', 'error');
        return;
      }

      const purchaseDrawId = currentDrawId;
      const capturedEntry = readPlayerEntry(
        purchaseDrawId,
        playerName,
        playerAvatarId
      );

      const success = await adjustBalance(-totalCost, 'lucky_draw');
      if (success) {
        const nextEntry = {
          name: capturedEntry?.name ?? playerName,
          avatarId: capturedEntry?.avatarId ?? playerAvatarId,
          tickets: (capturedEntry?.tickets ?? 0) + count,
        };

        writePlayerEntry(purchaseDrawId, nextEntry);

        if (getLuckyDrawClock().currentDrawId === purchaseDrawId) {
          setPlayerEntryVersion((v) => v + 1);
        }

        triggerToast(
          count === 1 ? 'PURCHASED 1 TICKET.' : `PURCHASED ${count} TICKETS.`,
          'success'
        );
      } else {
        triggerToast('TICKET PURCHASE COULD NOT BE COMPLETED.', 'error');
      }
    } catch {
      triggerToast('TICKET PURCHASE COULD NOT BE COMPLETED.', 'error');
    } finally {
      purchaseLockRef.current = false;
      if (mountedRef.current) {
        setIsPurchasing(false);
      }
    }
  };

  const playerTicketCount = currentPlayerEntry?.tickets ?? 0;
  const playerProbability =
    currentSnapshot.totalTickets > 0
      ? ((playerTicketCount / currentSnapshot.totalTickets) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full text-[#F3EBD8] select-none">
      {/* Top Header */}
      <LuckyDrawGameHeader
        onBack={onBack}
        onOpenRules={() => setIsRulesOpen(true)}
        balance={wallet}
      />

      {/* Main Content Area */}
      <main className="p-3 md:p-6 max-w-6xl mx-auto w-full flex flex-col gap-4 md:gap-6">
        {/* Reveal Banner during REVEAL phase */}
        {phase === 'reveal' && (
          <LuckyDrawRevealPanel
            revealSnapshot={revealSnapshot}
            payoutStatus={payoutStatus}
            onRetryPrize={handleRetryPrize}
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
            activeTumblerTicket={activeTumblerTicket}
          />
        </div>

        {/* History / Session Panel */}
        <LuckyDrawSessionPanel
          wallet={wallet}
          currentTickets={playerTicketCount}
          currentPool={currentSnapshot.prizePool}
          playerProbability={playerProbability}
          history={history}
          transactionLog={transactionLog}
        />
      </main>

      {/* Rules Dialog Modal */}
      <LuckyDrawRulesDialog
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};
