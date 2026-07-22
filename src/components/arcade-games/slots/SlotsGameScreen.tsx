/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store';
import { audio } from '../../../lib/audio';
import { SlotMode, SlotSymbolKey } from './slotsTypes';
import { SYMBOL_KEYS } from './slotsData';
import { SlotsGameHeader } from './SlotsGameHeader';
import { SlotsMachine } from './SlotsMachine';
import { SlotsBetControls } from './SlotsBetControls';
import { SlotsSessionPanel } from './SlotsSessionPanel';
import { SlotsPaytableDialog } from './SlotsPaytableDialog';

interface SlotsGameScreenProps {
  onBack: () => void;
}

export const SlotsGameScreen: React.FC<SlotsGameScreenProps> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog, reduceFlashing } = useStore();

  const [cabinetMode, setCabinetMode] = useState<SlotMode>(3);
  const [betAmount, setBetAmount] = useState<number>(10);

  const [reels, setReels] = useState<SlotSymbolKey[]>(['SEVEN', 'SEVEN', 'SEVEN']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinningReels, setSpinningReels] = useState<boolean[]>([]);

  const [lastWin, setLastWin] = useState<number | null>(null);
  const [jackpotBanner, setJackpotBanner] = useState<string | null>(null);
  const [paytableOpen, setPaytableOpen] = useState<boolean>(false);

  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = useRef<boolean>(true);

  // Sync reels when cabinetMode changes
  useEffect(() => {
    if (cabinetMode === 3) {
      setReels(['SEVEN', 'SEVEN', 'SEVEN']);
      setSpinningReels([false, false, false]);
    } else {
      setReels(['SEVEN', 'SEVEN', 'SEVEN', 'SEVEN', 'SEVEN']);
      setSpinningReels([false, false, false, false, false]);
    }
    setLastWin(null);
    setJackpotBanner(null);
  }, [cabinetMode]);

  // Interval & timeout cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      spinTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const clearPendingTimers = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
    spinTimeoutsRef.current.forEach((t) => clearTimeout(t));
    spinTimeoutsRef.current = [];
  };

  const handleModeChange = (mode: SlotMode) => {
    if (isSpinning) return;
    audio.playClick();
    setCabinetMode(mode);
  };

  const handleBetChange = (amount: number) => {
    if (isSpinning) return;
    audio.playClick();
    setBetAmount(amount);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    if (profile.chips < betAmount) {
      audio.playLoss();
      triggerToast('NOT ENOUGH COINS FOR THIS BET.', 'error');
      return;
    }

    clearPendingTimers();
    audio.playClick();

    setLastWin(null);
    setJackpotBanner(null);
    setIsSpinning(true);

    const activeSpinners = Array(cabinetMode).fill(true);
    setSpinningReels(activeSpinners);

    // Deduct bet from balance with source 'slot_machine'
    const deductSuccess = await adjustBalance(-betAmount, 'slot_machine');
    if (!deductSuccess) {
      if (isMountedRef.current) {
        setIsSpinning(false);
        setSpinningReels(Array(cabinetMode).fill(false));
      }
      return;
    }

    // Exact Probability Engine
    const roll = Math.random();
    let finalSymbols: SlotSymbolKey[] = [];
    let payoutMultiplier = 0;
    let winMessage = "";
    let isMegaJackpot = false;

    if (cabinetMode === 3) {
      if (roll < 0.002) {
        finalSymbols = ['DIAMOND', 'DIAMOND', 'DIAMOND'];
        payoutMultiplier = 50;
        winMessage = "DIAMOND MEGA JACKPOT!";
        isMegaJackpot = true;
      } else if (roll < 0.008) {
        finalSymbols = ['SEVEN', 'SEVEN', 'SEVEN'];
        payoutMultiplier = 25;
        winMessage = "LUCKY SEVENS JACKPOT!";
        isMegaJackpot = true;
      } else if (roll < 0.023) {
        finalSymbols = ['STAR', 'STAR', 'STAR'];
        payoutMultiplier = 10;
        winMessage = "TRIPLE STAR!";
      } else if (roll < 0.048) {
        finalSymbols = ['BELL', 'BELL', 'BELL'];
        payoutMultiplier = 5;
        winMessage = "TRIPLE BELL!";
      } else if (roll < 0.088) {
        finalSymbols = ['CHERRY', 'CHERRY', 'CHERRY'];
        payoutMultiplier = 3;
        winMessage = "TRIPLE CHERRY!";
      } else if (roll < 0.238) {
        const matchSym = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const otherSym = SYMBOL_KEYS.find((k) => k !== matchSym) || 'CHERRY';
        const layouts = [
          [matchSym, matchSym, otherSym],
          [matchSym, otherSym, matchSym],
          [otherSym, matchSym, matchSym],
        ];
        finalSymbols = layouts[Math.floor(Math.random() * layouts.length)] as SlotSymbolKey[];
        payoutMultiplier = 1.5;
        winMessage = `DOUBLE MATCH ON ${matchSym}!`;
      } else if (roll < 0.388) {
        const o1 = SYMBOL_KEYS.filter((k) => k !== 'CHERRY')[Math.floor(Math.random() * 4)];
        const o2 = SYMBOL_KEYS.filter((k) => k !== 'CHERRY' && k !== o1)[Math.floor(Math.random() * 3)];
        const layouts = [
          ['CHERRY', o1, o2],
          [o1, 'CHERRY', o2],
          [o1, o2, 'CHERRY'],
        ];
        finalSymbols = layouts[Math.floor(Math.random() * layouts.length)] as SlotSymbolKey[];
        payoutMultiplier = 1.0;
        winMessage = "SINGLE CHERRY RETURN!";
      } else {
        const nonCherry = SYMBOL_KEYS.filter((k) => k !== 'CHERRY');
        const shuffled = [...nonCherry].sort(() => Math.random() - 0.5);
        finalSymbols = [shuffled[0], shuffled[1], shuffled[2]];
        payoutMultiplier = 0;
      }
    } else {
      if (roll < 0.001) {
        finalSymbols = ['DIAMOND', 'DIAMOND', 'DIAMOND', 'DIAMOND', 'DIAMOND'];
        payoutMultiplier = 100;
        winMessage = "5x DIAMOND MEGA JACKPOT!";
        isMegaJackpot = true;
      } else if (roll < 0.003) {
        const other = SYMBOL_KEYS.filter((k) => k !== 'DIAMOND')[Math.floor(Math.random() * 4)];
        finalSymbols = ['DIAMOND', 'DIAMOND', 'DIAMOND', 'DIAMOND', other];
        payoutMultiplier = 30;
        winMessage = "4x DIAMONDS WIN!";
      } else if (roll < 0.005) {
        finalSymbols = ['SEVEN', 'SEVEN', 'SEVEN', 'SEVEN', 'SEVEN'];
        payoutMultiplier = 50;
        winMessage = "5x LUCKY SEVENS JACKPOT!";
        isMegaJackpot = true;
      } else if (roll < 0.009) {
        const other = SYMBOL_KEYS.filter((k) => k !== 'SEVEN')[Math.floor(Math.random() * 4)];
        finalSymbols = ['SEVEN', 'SEVEN', 'SEVEN', 'SEVEN', other];
        payoutMultiplier = 15;
        winMessage = "4x LUCKY SEVENS WIN!";
      } else if (roll < 0.014) {
        finalSymbols = ['STAR', 'STAR', 'STAR', 'STAR', 'STAR'];
        payoutMultiplier = 20;
        winMessage = "5x STARS WIN!";
      } else if (roll < 0.024) {
        const other = SYMBOL_KEYS.filter((k) => k !== 'STAR')[Math.floor(Math.random() * 4)];
        finalSymbols = ['STAR', 'STAR', 'STAR', 'STAR', other];
        payoutMultiplier = 8;
        winMessage = "4x STARS WIN!";
      } else if (roll < 0.034) {
        finalSymbols = ['BELL', 'BELL', 'BELL', 'BELL', 'BELL'];
        payoutMultiplier = 10;
        winMessage = "5x BELLS WIN!";
      } else if (roll < 0.054) {
        const other = SYMBOL_KEYS.filter((k) => k !== 'BELL')[Math.floor(Math.random() * 4)];
        finalSymbols = ['BELL', 'BELL', 'BELL', 'BELL', other];
        payoutMultiplier = 4;
        winMessage = "4x BELLS WIN!";
      } else if (roll < 0.074) {
        finalSymbols = ['CHERRY', 'CHERRY', 'CHERRY', 'CHERRY', 'CHERRY'];
        payoutMultiplier = 5;
        winMessage = "5x CHERRIES WIN!";
      } else if (roll < 0.114) {
        const match = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const others = SYMBOL_KEYS.filter((k) => k !== match).sort(() => Math.random() - 0.5);
        finalSymbols = [match, match, match, others[0], others[1]];
        payoutMultiplier = 2;
        winMessage = `3x MATCH ON ${match}!`;
      } else if (roll < 0.234) {
        const match = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const others = SYMBOL_KEYS.filter((k) => k !== match).sort(() => Math.random() - 0.5);
        finalSymbols = [match, match, others[0], others[1], others[2]];
        payoutMultiplier = 0.5;
        winMessage = `2x MATCH ON ${match}!`;
      } else {
        finalSymbols = [...SYMBOL_KEYS].sort(() => Math.random() - 0.5);
        payoutMultiplier = 0;
      }
    }

    if (finalSymbols.length !== cabinetMode) {
      finalSymbols = Array(cabinetMode).fill('CHERRY');
    }

    let cycles = 0;
    spinIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;

      setReels((prev) => {
        return prev.map((curr, idx) => {
          if (activeSpinners[idx]) {
            return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
          }
          return curr;
        });
      });

      audio.playClick();
      cycles++;

      for (let i = 0; i < cabinetMode; i++) {
        if (cycles >= (i + 1) * 3 && activeSpinners[i]) {
          activeSpinners[i] = false;
          setSpinningReels([...activeSpinners]);
          setReels((prev) => {
            const next = [...prev];
            next[i] = finalSymbols[i];
            return next;
          });
        }
      }

      if (cycles >= cabinetMode * 3) {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }

        if (!isMountedRef.current) return;

        setReels(finalSymbols);
        setSpinningReels(Array(cabinetMode).fill(false));
        setIsSpinning(false);

        if (payoutMultiplier > 0) {
          const payoutAmount = Number((betAmount * payoutMultiplier).toFixed(2));
          adjustBalance(payoutAmount, 'slot_machine');
          setLastWin(payoutAmount);

          if (isMegaJackpot) {
            audio.playJackpot();
            setJackpotBanner(winMessage);
            triggerToast(`JACKPOT! +${payoutAmount.toFixed(2)} COINS`, 'success');
          } else {
            audio.playWin();
            triggerToast(`WIN! +${payoutAmount.toFixed(2)} COINS`, 'success');
          }
        } else {
          audio.playLoss();
          setLastWin(0);
          triggerToast('NO MATCH. TRY AGAIN.', 'info');
        }
      }
    }, 150);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <SlotsGameHeader onBack={onBack} />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Machine & Controls */}
        <div className="lg:col-span-8 space-y-6 w-full">
          <SlotsMachine
            cabinetMode={cabinetMode}
            onModeChange={handleModeChange}
            reels={reels}
            spinningReels={spinningReels}
            isSpinning={isSpinning}
            lastWin={lastWin}
            jackpotBanner={jackpotBanner}
            reduceFlashing={reduceFlashing}
          />

          <SlotsBetControls
            betAmount={betAmount}
            onBetChange={handleBetChange}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            onOpenPaytable={() => setPaytableOpen(true)}
          />
        </div>

        {/* Right Column: Session & Activity */}
        <div className="lg:col-span-4 w-full">
          <SlotsSessionPanel
            chips={profile.chips}
            betAmount={betAmount}
            cabinetMode={cabinetMode}
            lastWin={lastWin}
            jackpotBanner={jackpotBanner}
            transactionLog={transactionLog}
          />
        </div>
      </div>

      {/* Paytable Modal */}
      <SlotsPaytableDialog
        isOpen={paytableOpen}
        onClose={() => setPaytableOpen(false)}
      />
    </div>
  );
};
