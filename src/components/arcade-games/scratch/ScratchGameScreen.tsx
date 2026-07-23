import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store';
import { audio } from '../../../lib/audio';
import { ScratchGameHeader } from './ScratchGameHeader';
import { ScratchCard } from './ScratchCard';
import { ScratchControls } from './ScratchControls';
import { ScratchSessionPanel } from './ScratchSessionPanel';
import { ScratchPaytableDialog } from './ScratchPaytableDialog';
import {
  ScratchGamePhase,
  ScratchOutcome,
  ScratchSymbolId,
  ScratchSymbol,
} from './scratchTypes';
import {
  SCRATCH_SYMBOLS,
  determineOutcome,
  generateCardSymbols,
  isCellUnveiled,
} from './scratchData';

interface ScratchGameScreenProps {
  onBack: () => void;
}

export const ScratchGameScreen: React.FC<ScratchGameScreenProps> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog } = useStore();

  const [cardPrice, setCardPrice] = useState<number>(0.10);
  const [currentOutcome, setCurrentOutcome] = useState<ScratchOutcome>('LOSS');
  const [cardSymbols, setCardSymbols] = useState<ScratchSymbolId[]>(
    Array(9).fill('COIN')
  );
  const [scratchedBlocks, setScratchedBlocks] = useState<Record<string, boolean>>({});
  const [revealedCells, setRevealedCells] = useState<boolean[]>(Array(9).fill(false));
  const [gamePhase, setGamePhase] = useState<ScratchGamePhase>('idle');
  const [lastResultText, setLastResultText] = useState<string | null>(null);
  const [pendingPayout, setPendingPayout] = useState<number>(0);
  const [winningSymbol, setWinningSymbol] = useState<ScratchSymbol | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPaytableOpen, setIsPaytableOpen] = useState<boolean>(false);

  const purchaseLockRef = useRef<boolean>(false);
  const resolutionLockRef = useRef<boolean>(false);
  const payoutLockRef = useRef<boolean>(false);
  const autoRevealIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Unmount & timer cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      purchaseLockRef.current = false;
      resolutionLockRef.current = false;
      payoutLockRef.current = false;
      if (autoRevealIntervalRef.current) {
        clearInterval(autoRevealIntervalRef.current);
        autoRevealIntervalRef.current = null;
      }
    };
  }, []);

  // Purchase card handler
  const handleBuyCard = async () => {
    if (
      purchaseLockRef.current ||
      gamePhase === 'active' ||
      gamePhase === 'auto-revealing' ||
      gamePhase === 'crediting' ||
      gamePhase === 'payout-error'
    ) {
      return;
    }

    purchaseLockRef.current = true;

    if (profile.chips < cardPrice) {
      triggerToast('NOT ENOUGH COINS TO BUY THIS CARD.', 'error');
      purchaseLockRef.current = false;
      return;
    }

    const deductSuccess = await adjustBalance(-cardPrice, 'scratch_card');
    if (!deductSuccess) {
      purchaseLockRef.current = false;
      return;
    }

    const outcome = determineOutcome();
    const symbols = generateCardSymbols(outcome);

    setCurrentOutcome(outcome);
    setCardSymbols(symbols);
    setScratchedBlocks({});
    setRevealedCells(Array(9).fill(false));
    setPendingPayout(0);
    setWinningSymbol(null);
    setLastResultText(null);
    setGamePhase('active');

    triggerToast('CARD READY. REVEAL ALL 9 CELLS.', 'info');
    purchaseLockRef.current = false;
  };

  // Process payout logic
  const processPayout = async (payout: number, symMeta: ScratchSymbol) => {
    if (payoutLockRef.current) return;
    payoutLockRef.current = true;

    const payoutSuccess = await adjustBalance(payout, 'scratch_card');

    if (!isMountedRef.current) {
      payoutLockRef.current = false;
      resolutionLockRef.current = false;
      return;
    }

    if (payoutSuccess) {
      if (symMeta.multiplier >= 20) {
        audio.playJackpot();
        setLastResultText(
          `MAJOR MATCH! 3 ${symMeta.name} — +${payout.toFixed(2)} COINS`
        );
        triggerToast(
          `MAJOR MATCH! 3 ${symMeta.name} — +${payout.toFixed(2)} COINS`,
          'success'
        );
      } else {
        audio.playWin();
        setLastResultText(
          `MATCHED 3 ${symMeta.name} — +${payout.toFixed(2)} COINS`
        );
        triggerToast(
          `MATCHED 3 ${symMeta.name} — +${payout.toFixed(2)} COINS`,
          'success'
        );
      }
      setGamePhase('win');
    } else {
      setGamePhase('payout-error');
      setLastResultText('WIN CONFIRMED — PAYOUT PENDING');
      triggerToast('PAYOUT COULD NOT BE CREDITED. RETRY THE PAYOUT.', 'error');
    }

    payoutLockRef.current = false;
    resolutionLockRef.current = false;
  };

  // Resolve outcome handler
  const resolveScratchGame = async () => {
    if (
      resolutionLockRef.current ||
      gamePhase === 'crediting' ||
      gamePhase === 'win' ||
      gamePhase === 'loss' ||
      gamePhase === 'payout-error'
    ) {
      return;
    }

    resolutionLockRef.current = true;

    if (currentOutcome === 'LOSS') {
      audio.playLoss();
      setGamePhase('loss');
      setLastResultText('NO MATCH');
      triggerToast('NO MATCH. TRY ANOTHER CARD.', 'info');
      resolutionLockRef.current = false;
    } else {
      const symMeta = SCRATCH_SYMBOLS[currentOutcome];
      const payout = Number((cardPrice * symMeta.multiplier).toFixed(2));
      setPendingPayout(payout);
      setWinningSymbol(symMeta);
      setGamePhase('crediting');
      await processPayout(payout, symMeta);
    }
  };

  // Retry payout handler
  const handleRetryPayout = async () => {
    if (gamePhase !== 'payout-error' || pendingPayout <= 0 || !winningSymbol) {
      return;
    }
    await processPayout(pendingPayout, winningSymbol);
  };

  // Auto reveal handler
  const handleAutoReveal = () => {
    if (
      gamePhase !== 'active' ||
      resolutionLockRef.current ||
      autoRevealIntervalRef.current !== null
    ) {
      return;
    }

    setGamePhase('auto-revealing');
    if (autoRevealIntervalRef.current) {
      clearInterval(autoRevealIntervalRef.current);
    }

    let currentCell = 0;
    autoRevealIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (autoRevealIntervalRef.current) {
          clearInterval(autoRevealIntervalRef.current);
          autoRevealIntervalRef.current = null;
        }
        return;
      }

      setScratchedBlocks((prev) => {
        const next = { ...prev };
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            next[`${currentCell}-${r}-${c}`] = true;
          }
        }
        return next;
      });

      setRevealedCells((prev) => {
        const next = [...prev];
        next[currentCell] = true;
        return next;
      });

      audio.playClick();
      currentCell++;

      if (currentCell >= 9) {
        if (autoRevealIntervalRef.current) {
          clearInterval(autoRevealIntervalRef.current);
          autoRevealIntervalRef.current = null;
        }
        resolveScratchGame();
      }
    }, 80);
  };

  // Check revealed cells progression
  useEffect(() => {
    if (gamePhase !== 'active' || resolutionLockRef.current) return;

    const nextRevealed = [...revealedCells];
    let changed = false;

    for (let i = 0; i < 9; i++) {
      if (!nextRevealed[i] && isCellUnveiled(i, scratchedBlocks)) {
        nextRevealed[i] = true;
        changed = true;
      }
    }

    if (changed) {
      setRevealedCells(nextRevealed);
      if (nextRevealed.every((v) => v)) {
        resolveScratchGame();
      }
    }
  }, [scratchedBlocks, gamePhase, revealedCells]);

  // Pointer event handlers for manual scratching
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gamePhase !== 'active') return;
    setIsDragging(true);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}
    scratchAtPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || gamePhase !== 'active') return;
    scratchAtPointer(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleLostPointerCapture = () => {
    setIsDragging(false);
  };

  const scratchAtPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      const cellCol = Math.min(2, Math.floor(x * 3));
      const cellRow = Math.min(2, Math.floor(y * 3));
      const cellIndex = cellRow * 3 + cellCol;

      const localX = x * 3 - cellCol;
      const localY = y * 3 - cellRow;
      const subCol = Math.min(4, Math.max(0, Math.floor(localX * 5)));
      const subRow = Math.min(4, Math.max(0, Math.floor(localY * 5)));

      const key = `${cellIndex}-${subRow}-${subCol}`;
      if (!scratchedBlocks[key]) {
        setScratchedBlocks((prev) => ({
          ...prev,
          [key]: true,
        }));
        audio.playClick();
      }
    }
  };

  const revealedCount = revealedCells.filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <ScratchGameHeader onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left main area: Scratch card & controls */}
        <div className="lg:col-span-8 flex flex-col items-center space-y-6">
          <ScratchCard
            gamePhase={gamePhase}
            cardSymbols={cardSymbols}
            scratchedBlocks={scratchedBlocks}
            revealedCells={revealedCells}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onLostPointerCapture={handleLostPointerCapture}
            containerRef={containerRef}
          />

          <ScratchControls
            cardPrice={cardPrice}
            gamePhase={gamePhase}
            onPriceChange={setCardPrice}
            onBuyCard={handleBuyCard}
            onAutoReveal={handleAutoReveal}
            onRetryPayout={handleRetryPayout}
            onOpenPaytable={() => setIsPaytableOpen(true)}
          />
        </div>

        {/* Right sidebar: Session summary & transaction activity */}
        <div className="lg:col-span-4">
          <ScratchSessionPanel
            profile={profile}
            cardPrice={cardPrice}
            revealedCount={revealedCount}
            gamePhase={gamePhase}
            lastResultText={lastResultText}
            transactionLog={transactionLog}
          />
        </div>
      </div>

      <ScratchPaytableDialog
        isOpen={isPaytableOpen}
        onClose={() => setIsPaytableOpen(false)}
      />
    </div>
  );
};
