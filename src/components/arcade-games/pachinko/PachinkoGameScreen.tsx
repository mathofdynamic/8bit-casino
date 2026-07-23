/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../../store';
import { audio } from '../../../lib/audio';
import { PachinkoGameHeader } from './PachinkoGameHeader';
import { PachinkoBoard } from './PachinkoBoard';
import { PachinkoControls } from './PachinkoControls';
import { PachinkoSessionPanel } from './PachinkoSessionPanel';
import { PachinkoRulesDialog } from './PachinkoRulesDialog';
import {
  PachinkoBall,
  PachinkoLandingResult,
} from './pachinkoTypes';
import {
  PACHINKO_ROW_COUNT,
  PACHINKO_SIMULATION_INTERVAL_MS,
  PACHINKO_ANIMATION_INCREMENT,
  PACHINKO_SLOTS,
  getPegPositions,
  getBallVisualPos,
  getSlotVisualPos,
} from './pachinkoData';

interface PachinkoGameScreenProps {
  onBack: () => void;
}

export const PachinkoGameScreen: React.FC<PachinkoGameScreenProps> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog, reduceFlashing } = useStore();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [activeBalls, setActiveBalls] = useState<PachinkoBall[]>([]);
  const [landingResults, setLandingResults] = useState<PachinkoLandingResult[]>([]);
  const [isDropPending, setIsDropPending] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [latestResultText, setLatestResultText] = useState<string | null>(null);

  const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef<boolean>(true);
  const dropLockRef = useRef<boolean>(false);
  const settledBallIdsRef = useRef<Set<number>>(new Set());
  const payoutLocksRef = useRef<Set<number>>(new Set());
  const ballIdCounter = useRef<number>(0);

  const reduceFlashingRef = useRef<boolean>(reduceFlashing);

  useEffect(() => {
    reduceFlashingRef.current = reduceFlashing;
  }, [reduceFlashing]);

  const pegs = useMemo(() => getPegPositions(), []);

  const getLandingCopy = (multiplier: number, payout: number): string => {
    if (multiplier >= 20.0) return `JACKPOT 20× — +${payout.toFixed(2)} COINS`;
    if (multiplier >= 4.0) return `MEGA RETURN 4× — +${payout.toFixed(2)} COINS`;
    if (multiplier >= 1.3) return `WIN 1.3× — +${payout.toFixed(2)} COINS`;
    if (multiplier >= 0.4) return `PARTIAL RETURN 0.4× — +${payout.toFixed(2)} COINS`;
    return `CENTER RETURN 0.2× — +${payout.toFixed(2)} COINS`;
  };

  const creditPayout = async (
    resultId: number,
    ballId: number,
    payout: number,
    multiplier: number
  ) => {
    if (payoutLocksRef.current.has(ballId)) return;
    payoutLocksRef.current.add(ballId);

    setLandingResults((prev) =>
      prev.map((r) => (r.id === resultId ? { ...r, status: 'crediting' } : r))
    );

    const success = await adjustBalance(payout, 'pachinko');

    if (!mountedRef.current) return;

    if (success) {
      const copyText = getLandingCopy(multiplier, payout);

      setLandingResults((prev) =>
        prev.map((r) => (r.id === resultId ? { ...r, status: 'credited' } : r))
      );
      setLatestResultText(copyText);

      // Play sound upon successful credit
      if (multiplier >= 20.0) {
        audio.playJackpot();
      } else if (multiplier >= 4.0) {
        audio.playWinMedium();
      } else if (multiplier >= 1.3) {
        audio.playWinSmall();
      } else {
        audio.playBeep(300, 200, 0.15, 'triangle');
      }

      if (multiplier >= 4.0) {
        triggerToast(copyText, 'success');
      }
    } else {
      setLandingResults((prev) =>
        prev.map((r) => (r.id === resultId ? { ...r, status: 'failed' } : r))
      );
      triggerToast('PAYOUT COULD NOT BE CREDITED. RETRY THE RETURN.', 'error');
    }

    payoutLocksRef.current.delete(ballId);
  };

  const resolveLanding = async (ballId: number, bet: number, slotIndex: number) => {
    if (settledBallIdsRef.current.has(ballId)) return;
    settledBallIdsRef.current.add(ballId);

    const slot = PACHINKO_SLOTS[slotIndex] || PACHINKO_SLOTS[4];
    const payout = Number((bet * slot.multiplier).toFixed(2));

    const resultId = Date.now() + Math.random();
    const initialResult: PachinkoLandingResult = {
      id: resultId,
      ballId,
      bet,
      slotIndex,
      multiplier: slot.multiplier,
      payout,
      status: 'crediting',
      timestamp: Date.now(),
    };

    setLandingResults((prev) => [initialResult, ...prev]);

    await creditPayout(resultId, ballId, payout, slot.multiplier);
  };

  // Main simulation loop
  useEffect(() => {
    mountedRef.current = true;

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    simulationIntervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;

      const landedToResolve: { ballId: number; bet: number; slotIndex: number }[] = [];

      setActiveBalls((prev) => {
        if (prev.length === 0) return prev;

        const nextBalls: PachinkoBall[] = [];

        prev.forEach((ball) => {
          let { currentStep, column, animationProgress } = ball;

          animationProgress += PACHINKO_ANIMATION_INCREMENT;

          if (animationProgress >= 1) {
            animationProgress = 0;
            currentStep += 1;

            if (currentStep <= PACHINKO_ROW_COUNT) {
              const goesRight = Math.random() < 0.5;
              if (goesRight) {
                column += 1;
              }
              const pitch = 0.6 + currentStep * 0.1;
              audio.playBeep(440 * pitch, 440 * pitch, 0.12, 'triangle');
            }
          }

          let prevPos = { x: ball.x, y: ball.y };
          let nextPos = { x: ball.x, y: ball.y };

          if (currentStep === 0) {
            nextPos = getBallVisualPos(0, 0);
          } else if (currentStep <= PACHINKO_ROW_COUNT) {
            nextPos = getBallVisualPos(currentStep, column);
          } else {
            nextPos = getSlotVisualPos(column);
          }

          const curX = prevPos.x + (nextPos.x - prevPos.x) * animationProgress;
          const bounceOffset = reduceFlashingRef.current ? 0 : Math.sin(animationProgress * Math.PI) * -12;
          const curY =
            prevPos.y +
            (nextPos.y - prevPos.y) * animationProgress +
            (currentStep <= PACHINKO_ROW_COUNT ? bounceOffset : 0);

          if (currentStep > PACHINKO_ROW_COUNT) {
            landedToResolve.push({
              ballId: ball.id,
              bet: ball.bet,
              slotIndex: column,
            });
          } else {
            nextBalls.push({
              ...ball,
              currentStep,
              column,
              animationProgress,
              previousX: prevPos.x,
              previousY: prevPos.y,
              x: curX,
              y: curY,
            });
          }
        });

        return nextBalls;
      });

      landedToResolve.forEach((item) => {
        resolveLanding(item.ballId, item.bet, item.slotIndex);
      });
    }, PACHINKO_SIMULATION_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      dropLockRef.current = false;
      payoutLocksRef.current.clear();
      settledBallIdsRef.current.clear();
    };
  }, []);

  const handleDropBall = async () => {
    if (dropLockRef.current) return;
    dropLockRef.current = true;
    setIsDropPending(true);

    if (profile.chips < betAmount) {
      triggerToast('NOT ENOUGH COINS FOR THIS DROP.', 'error');
      dropLockRef.current = false;
      setIsDropPending(false);
      return;
    }

    const success = await adjustBalance(-betAmount, 'pachinko');

    if (!mountedRef.current) return;

    if (!success) {
      dropLockRef.current = false;
      setIsDropPending(false);
      return;
    }

    audio.playBeep(660, 880, 0.1, 'square');

    const startPos = getBallVisualPos(0, 0);
    const newBall: PachinkoBall = {
      id: ballIdCounter.current++,
      bet: betAmount,
      currentStep: 0,
      column: 0,
      x: startPos.x,
      y: startPos.y,
      previousX: startPos.x,
      previousY: startPos.y,
      animationProgress: 0,
    };

    setActiveBalls((prev) => [...prev, newBall]);

    dropLockRef.current = false;
    setIsDropPending(false);
  };

  const handleRetryPayout = async (result: PachinkoLandingResult) => {
    await creditPayout(result.id, result.ballId, result.payout, result.multiplier);
  };

  const hasFailedSettlement = landingResults.some((r) => r.status === 'failed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <PachinkoGameHeader onBack={onBack} />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Board and Controls */}
        <div className="lg:col-span-8 flex flex-col items-center gap-6">
          <PachinkoBoard
            pegs={pegs}
            activeBalls={activeBalls}
            latestResultText={latestResultText}
            hasFailedSettlement={hasFailedSettlement}
          />

          <PachinkoControls
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            isDropPending={isDropPending}
            onDropBall={handleDropBall}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        </div>

        {/* Right Column: Session Panel */}
        <div className="lg:col-span-4 w-full">
          <PachinkoSessionPanel
            chips={profile.chips}
            betAmount={betAmount}
            activeBallsCount={activeBalls.length}
            landingResults={landingResults}
            transactionLog={transactionLog}
            onRetryPayout={handleRetryPayout}
          />
        </div>
      </div>

      {/* Rules Dialog */}
      <PachinkoRulesDialog
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};
