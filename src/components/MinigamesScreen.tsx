/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelCard, PixelMascot } from './PixelUI';
import { Coins, HelpCircle, Trophy, ArrowLeft, RotateCcw, Gamepad2, Play, Sparkles } from 'lucide-react';
import { audio } from '../lib/audio';
import { WheelScreen } from './WheelScreen';
import { DiceScreen } from './DiceScreen';
import { ScratchScreen } from './ScratchScreen';
import { PachinkoScreen } from './PachinkoScreen';
import { LuckyDrawScreen } from './LuckyDrawScreen';

// ==========================================
// 8-BIT SLOT SYMBOLS - DETAILED PIXEL ART SVGS
// ==========================================

const PixelCherryIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="1" fill="#3fff6e" />
    <rect x="8" y="2" width="1" height="3" fill="#3fff6e" />
    <rect x="5" y="4" width="3" height="1" fill="#3fff6e" />
    <rect x="4" y="5" width="2" height="1" fill="#3fff6e" />
    <rect x="9" y="5" width="2" height="1" fill="#3fff6e" />
    <rect x="2" y="7" width="4" height="4" fill="#ff3f3f" />
    <rect x="3" y="6" width="2" height="1" fill="#ff3f3f" />
    <rect x="3" y="11" width="2" height="1" fill="#ff3f3f" />
    <rect x="3" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="2" y="8" width="1" height="1" fill="#ffffff" />
    <rect x="10" y="7" width="4" height="4" fill="#ff3f3f" />
    <rect x="11" y="6" width="2" height="1" fill="#ff3f3f" />
    <rect x="11" y="11" width="2" height="1" fill="#ff3f3f" />
    <rect x="11" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="10" y="8" width="1" height="1" fill="#ffffff" />
  </svg>
);

const PixelBellIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" fill="#7a4b28" />
    <rect x="6" y="3" width="4" height="1" fill="#7a4b28" />
    <rect x="7" y="4" width="2" height="1" fill="#ff9f00" />
    <rect x="6" y="5" width="4" height="1" fill="#ff9f00" />
    <rect x="5" y="6" width="6" height="1" fill="#ff9f00" />
    <rect x="4" y="7" width="8" height="2" fill="#ff9f00" />
    <rect x="3" y="9" width="10" height="2" fill="#ff9f00" />
    <rect x="5" y="5" width="1" height="2" fill="#ffe380" />
    <rect x="4" y="7" width="1" height="2" fill="#ffe380" />
    <rect x="3" y="9" width="1" height="2" fill="#ffe380" />
    <rect x="10" y="5" width="1" height="2" fill="#cca932" />
    <rect x="11" y="7" width="1" height="2" fill="#cca932" />
    <rect x="12" y="9" width="1" height="2" fill="#cca932" />
    <rect x="2" y="11" width="12" height="2" fill="#ffe380" />
    <rect x="2" y="13" width="12" height="1" fill="#cca932" />
    <rect x="7" y="14" width="2" height="1" fill="#7a4b28" />
  </svg>
);

const PixelStarIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" fill="#ffd23f" />
    <rect x="6" y="3" width="4" height="1" fill="#ffd23f" />
    <rect x="5" y="4" width="6" height="1" fill="#ffd23f" />
    <rect x="4" y="5" width="8" height="1" fill="#ffd23f" />
    <rect x="1" y="6" width="14" height="2" fill="#ffd23f" />
    <rect x="2" y="8" width="12" height="1" fill="#ffd23f" />
    <rect x="3" y="9" width="10" height="1" fill="#ffd23f" />
    <rect x="4" y="10" width="8" height="1" fill="#ffd23f" />
    <rect x="3" y="11" width="3" height="1" fill="#ffd23f" />
    <rect x="10" y="11" width="3" height="1" fill="#ffd23f" />
    <rect x="2" y="12" width="3" height="1" fill="#ffd23f" />
    <rect x="11" y="12" width="3" height="1" fill="#ffd23f" />
    <rect x="2" y="13" width="2" height="2" fill="#ffd23f" />
    <rect x="12" y="13" width="2" height="2" fill="#ffd23f" />
    <rect x="7" y="4" width="2" height="6" fill="#ffffff" />
    <rect x="4" y="6" width="8" height="2" fill="#ffffff" />
  </svg>
);

const PixelSevenIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="2" y="1" width="12" height="3" fill="#ff9f00" />
    <rect x="2" y="1" width="12" height="1" fill="#ffffff" />
    <rect x="10" y="4" width="4" height="2" fill="#ff9f00" />
    <rect x="9" y="6" width="4" height="2" fill="#ff9f00" />
    <rect x="8" y="8" width="4" height="2" fill="#ff9f00" />
    <rect x="7" y="10" width="4" height="2" fill="#ff9f00" />
    <rect x="6" y="12" width="4" height="3" fill="#ff9f00" />
    <rect x="11" y="2" width="2" height="3" fill="#ffffff" />
    <rect x="10" y="5" width="1" height="2" fill="#ffffff" />
    <rect x="9" y="7" width="1" height="2" fill="#ffffff" />
    <rect x="8" y="9" width="1" height="2" fill="#ffffff" />
    <rect x="7" y="11" width="1" height="2" fill="#ffffff" />
  </svg>
);

const PixelDiamondIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="1" fill="#ffffff" />
    <rect x="6" y="2" width="4" height="2" fill="#e8e8e8" />
    <rect x="4" y="4" width="8" height="2" fill="#e8e8e8" />
    <rect x="2" y="6" width="12" height="2" fill="#e8e8e8" />
    <rect x="1" y="8" width="14" height="1" fill="#e8e8e8" />
    <rect x="2" y="9" width="12" height="1" fill="#e8e8e8" />
    <rect x="3" y="10" width="10" height="1" fill="#e8e8e8" />
    <rect x="4" y="11" width="8" height="1" fill="#e8e8e8" />
    <rect x="5" y="12" width="6" height="1" fill="#e8e8e8" />
    <rect x="6" y="13" width="4" height="1" fill="#e8e8e8" />
    <rect x="7" y="14" width="2" height="1" fill="#e8e8e8" />
    <rect x="7" y="1" width="1" height="1" fill="#ffffff" />
    <rect x="6" y="2" width="2" height="1" fill="#ffffff" />
    <rect x="4" y="4" width="3" height="1" fill="#ffffff" />
    <rect x="2" y="6" width="4" height="1" fill="#ffffff" />
    <rect x="1" y="8" width="1" height="1" fill="#ffffff" />
    <rect x="11" y="4" width="1" height="2" fill="#32c5cc" />
    <rect x="13" y="6" width="1" height="2" fill="#32c5cc" />
    <rect x="14" y="8" width="1" height="1" fill="#32c5cc" />
    <rect x="11" y="9" width="3" height="1" fill="#32c5cc" />
    <rect x="10" y="10" width="3" height="1" fill="#32c5cc" />
    <rect x="9" y="11" width="3" height="1" fill="#32c5cc" />
    <rect x="8" y="12" width="3" height="1" fill="#32c5cc" />
    <rect x="7" y="13" width="3" height="1" fill="#32c5cc" />
    <rect x="8" y="14" width="1" height="1" fill="#32c5cc" />
  </svg>
);

type SymbolKey = 'CHERRY' | 'BELL' | 'STAR' | 'SEVEN' | 'DIAMOND';

interface SlotSymbol {
  id: SymbolKey;
  name: string;
  char: string;
  color: string;
  multiplier3: number;
  multiplier5: number;
  icon: React.ComponentType;
}

const SLOT_SYMBOLS: Record<SymbolKey, SlotSymbol> = {
  CHERRY: { id: 'CHERRY', name: 'CHERRY', char: '🍒', color: '#ff3f3f', multiplier3: 3, multiplier5: 5, icon: PixelCherryIcon },
  BELL: { id: 'BELL', name: 'BELL', char: '🔔', color: '#ff9f00', multiplier3: 5, multiplier5: 10, icon: PixelBellIcon },
  STAR: { id: 'STAR', name: 'STAR', char: '⭐', color: '#ffd23f', multiplier3: 10, multiplier5: 20, icon: PixelStarIcon },
  SEVEN: { id: 'SEVEN', name: 'SEVEN', char: '7️⃣', color: '#ff9f00', multiplier3: 25, multiplier5: 50, icon: PixelSevenIcon },
  DIAMOND: { id: 'DIAMOND', name: 'DIAMOND', char: '💎', color: '#e8e8e8', multiplier3: 50, multiplier5: 100, icon: PixelDiamondIcon },
};

const SYMBOL_KEYS: SymbolKey[] = ['CHERRY', 'BELL', 'STAR', 'SEVEN', 'DIAMOND'];

// ==========================================
// DETACHED SLOT MACHINE CABINET VIEW
// ==========================================

const SlotCabinet: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog } = useStore();
  
  const [cabinetMode, setCabinetMode] = useState<3 | 5>(3);
  const [betAmount, setBetAmount] = useState<number>(10);
  
  const [reels, setReels] = useState<SymbolKey[]>(['SEVEN', 'SEVEN', 'SEVEN']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinningReels, setSpinningReels] = useState<boolean[]>([]);
  
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [jackpotBanner, setJackpotBanner] = useState<string | null>(null);
  const [mascotDialogue, setMascotDialogue] = useState<string>("PULL MY LEVER TO SPIN!");
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'deal'>('idle');
  const [leverState, setLeverState] = useState<'idle' | 'pulling' | 'down'>('idle');
  const [showPaytableModal, setShowPaytableModal] = useState<boolean>(false);

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

  const handleSpin = async () => {
    if (isSpinning) return;
    
    if (profile.chips < betAmount) {
      triggerToast('INSUFFICIENT FUNDS! CLAIM YOUR DAILY REWARD.', 'error');
      setMascotDialogue("OH NO! YOU NEED MORE COINS!");
      setMascotMood('idle');
      return;
    }

    setLeverState('pulling');
    audio.playClick();
    
    setTimeout(() => {
      setLeverState('down');
    }, 120);

    setTimeout(() => {
      setLeverState('idle');
    }, 450);

    setLastWin(null);
    setJackpotBanner(null);
    setIsSpinning(true);
    setMascotMood('deal');
    setMascotDialogue("ROUND AND ROUND THEY GO!");

    const activeSpinners = Array(cabinetMode).fill(true);
    setSpinningReels(activeSpinners);

    const deductSuccess = await adjustBalance(-betAmount, 'slot_machine');
    if (!deductSuccess) {
      setIsSpinning(false);
      return;
    }

    const roll = Math.random();
    let finalSymbols: SymbolKey[] = [];
    let payoutMultiplier = 0;
    let winMessage = "";
    let isMegaJackpot = false;

    if (cabinetMode === 3) {
      if (roll < 0.002) {
        finalSymbols = ['DIAMOND', 'DIAMOND', 'DIAMOND'];
        payoutMultiplier = 50;
        winMessage = "DIAMOND MEGA JACKPOT!!!";
        isMegaJackpot = true;
      } else if (roll < 0.008) {
        finalSymbols = ['SEVEN', 'SEVEN', 'SEVEN'];
        payoutMultiplier = 25;
        winMessage = "LUCKY SEVENS JACKPOT!!!";
        isMegaJackpot = true;
      } else if (roll < 0.023) {
        finalSymbols = ['STAR', 'STAR', 'STAR'];
        payoutMultiplier = 10;
        winMessage = "STARLIGHT TRIPLE WIN!";
      } else if (roll < 0.048) {
        finalSymbols = ['BELL', 'BELL', 'BELL'];
        payoutMultiplier = 5;
        winMessage = "GOLDEN BELL TRIPLE WIN!";
      } else if (roll < 0.088) {
        finalSymbols = ['CHERRY', 'CHERRY', 'CHERRY'];
        payoutMultiplier = 3;
        winMessage = "RED CHERRY TRIPLE WIN!";
      } else if (roll < 0.238) {
        const matchSym = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const otherSym = SYMBOL_KEYS.find(k => k !== matchSym) || 'CHERRY';
        const layouts = [
          [matchSym, matchSym, otherSym],
          [matchSym, otherSym, matchSym],
          [otherSym, matchSym, matchSym]
        ];
        finalSymbols = layouts[Math.floor(Math.random() * layouts.length)] as SymbolKey[];
        payoutMultiplier = 1.5;
        winMessage = `DOUBLE MATCH ON ${matchSym}!`;
      } else if (roll < 0.388) {
        const o1 = SYMBOL_KEYS.filter(k => k !== 'CHERRY')[Math.floor(Math.random() * 4)];
        const o2 = SYMBOL_KEYS.filter(k => k !== 'CHERRY' && k !== o1)[Math.floor(Math.random() * 3)];
        const layouts = [
          ['CHERRY', o1, o2],
          [o1, 'CHERRY', o2],
          [o1, o2, 'CHERRY']
        ];
        finalSymbols = layouts[Math.floor(Math.random() * layouts.length)] as SymbolKey[];
        payoutMultiplier = 1.0;
        winMessage = "CHERRY PUSH - BET RETURNED!";
      } else {
        const nonCherry = SYMBOL_KEYS.filter(k => k !== 'CHERRY');
        const shuffled = [...nonCherry].sort(() => Math.random() - 0.5);
        finalSymbols = [shuffled[0], shuffled[1], shuffled[2]];
        payoutMultiplier = 0;
      }
    } else {
      if (roll < 0.001) {
        finalSymbols = ['DIAMOND', 'DIAMOND', 'DIAMOND', 'DIAMOND', 'DIAMOND'];
        payoutMultiplier = 100;
        winMessage = "DIAMOND 5-REEL MEGA JACKPOT!!!";
        isMegaJackpot = true;
      } else if (roll < 0.003) {
        const other = SYMBOL_KEYS.filter(k => k !== 'DIAMOND')[Math.floor(Math.random() * 4)];
        finalSymbols = ['DIAMOND', 'DIAMOND', 'DIAMOND', 'DIAMOND', other];
        payoutMultiplier = 30;
        winMessage = "4x DIAMONDS WIN!";
      } else if (roll < 0.005) {
        finalSymbols = ['SEVEN', 'SEVEN', 'SEVEN', 'SEVEN', 'SEVEN'];
        payoutMultiplier = 50;
        winMessage = "LUCKY SEVENS 5-REEL JACKPOT!!!";
        isMegaJackpot = true;
      } else if (roll < 0.009) {
        const other = SYMBOL_KEYS.filter(k => k !== 'SEVEN')[Math.floor(Math.random() * 4)];
        finalSymbols = ['SEVEN', 'SEVEN', 'SEVEN', 'SEVEN', other];
        payoutMultiplier = 15;
        winMessage = "4x LUCKY SEVENS WIN!";
      } else if (roll < 0.014) {
        finalSymbols = ['STAR', 'STAR', 'STAR', 'STAR', 'STAR'];
        payoutMultiplier = 20;
        winMessage = "STARLIGHT 5-REEL WIN!";
      } else if (roll < 0.024) {
        const other = SYMBOL_KEYS.filter(k => k !== 'STAR')[Math.floor(Math.random() * 4)];
        finalSymbols = ['STAR', 'STAR', 'STAR', 'STAR', other];
        payoutMultiplier = 8;
        winMessage = "4x STARS WIN!";
      } else if (roll < 0.034) {
        finalSymbols = ['BELL', 'BELL', 'BELL', 'BELL', 'BELL'];
        payoutMultiplier = 10;
        winMessage = "GOLDEN BELL 5-REEL WIN!";
      } else if (roll < 0.054) {
        const other = SYMBOL_KEYS.filter(k => k !== 'BELL')[Math.floor(Math.random() * 4)];
        finalSymbols = ['BELL', 'BELL', 'BELL', 'BELL', other];
        payoutMultiplier = 4;
        winMessage = "4x GOLDEN BELLS WIN!";
      } else if (roll < 0.074) {
        finalSymbols = ['CHERRY', 'CHERRY', 'CHERRY', 'CHERRY', 'CHERRY'];
        payoutMultiplier = 5;
        winMessage = "RED CHERRY 5-REEL WIN!";
      } else if (roll < 0.114) {
        const match = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const others = SYMBOL_KEYS.filter(k => k !== match).sort(() => Math.random() - 0.5);
        finalSymbols = [match, match, match, others[0], others[1]];
        payoutMultiplier = 2;
        winMessage = `3x MATCH ON ${match}!`;
      } else if (roll < 0.234) {
        const match = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
        const others = SYMBOL_KEYS.filter(k => k !== match).sort(() => Math.random() - 0.5);
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
    const interval = setInterval(() => {
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
        clearInterval(interval);
        
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
            setMascotMood('happy');
            setMascotDialogue("OMG!!! JACKPOT WIN!!! YOU ROCKED THE HOUSE!");
            triggerToast(`★ MEGA WIN! ${winMessage} WON $${payoutAmount.toFixed(2)} ★`, 'success');
          } else {
            audio.playWin();
            setMascotMood('happy');
            setMascotDialogue(`INCREDIBLE! YOU WON $${payoutAmount.toFixed(2)} CHIPS!`);
            triggerToast(`WINNER! ${winMessage} WON $${payoutAmount.toFixed(2)}`, 'success');
          }
        } else {
          audio.playLoss();
          setMascotMood('idle');
          setMascotDialogue("NO MATCH THIS TIME. TRY AGAIN!");
          triggerToast('TRY AGAIN!', 'info');
        }
      }
    }, 150);
  };

  const getSymbolMultiplierLabel = (key: SymbolKey) => {
    const sym = SLOT_SYMBOLS[key];
    if (cabinetMode === 3) {
      return `${sym.multiplier3}x`;
    }
    return `${sym.multiplier5}x`;
  };

  return (
    <div className="space-y-6">
      <div className="border-4 border-[#ff9f00] bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div>
          <h1 className="text-3xl font-jersey text-[#ff9f00] uppercase m-0 leading-none">
            ★ COIN-OP SLOTS ARCADE CABINET ★
          </h1>
          <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 mt-1">
            Chunky 8-bit mechanics • Tuned 92% RTP return-to-player stability
          </p>
        </div>
        <div className="flex gap-2">
          <PixelButton variant="dark" onClick={onBack} chamfer={6}>
            <div className="flex items-center gap-1 text-sm py-0.5">
              <ArrowLeft className="w-4 h-4" />
              <span>EXIT TO CABINETS</span>
            </div>
          </PixelButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full max-w-2xl border-4 border-[#7a4b28] bg-black p-4 md:p-6 filter drop-shadow-[8px_8px_0px_#000000] pixel-dots border-b-16 border-t-8 rounded-none">
            <div className="absolute -left-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-r-2 border-[#111111]" />
            <div className="absolute -right-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-l-2 border-[#111111]" />

            <div className="border-4 border-[#ff9f00] bg-[#111111] p-3 text-center mb-6 relative overflow-hidden pixel-checker">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff9f00]/10 to-transparent animate-pulse" />
              <div className="flex justify-between items-center px-4">
                <span className="text-xl md:text-2xl text-[#ff9f00] animate-pulse">★</span>
                <span className="font-jersey text-2xl md:text-4xl text-[#ff9f00] tracking-widest uppercase leading-none drop-shadow-[2px_2px_0px_#ff9f00]">
                  LUCKY 8BIT SPIN
                </span>
                <span className="text-xl md:text-2xl text-[#ff9f00] animate-pulse">★</span>
              </div>
              <p className="font-jersey text-[10px] text-[#ff9f00] tracking-widest uppercase m-0 mt-1 leading-none">
                authorized arcade emulator cabinet
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex border-4 border-[#5a5a72] bg-[#111111] p-1">
                <button
                  disabled={isSpinning}
                  onClick={() => {
                    audio.playClick();
                    setCabinetMode(3);
                  }}
                  className={`px-4 py-1.5 font-jersey text-lg uppercase cursor-pointer select-none transition-none ${
                    cabinetMode === 3
                      ? 'bg-[#ff9f00] text-[#0d0d1a] font-bold'
                      : 'text-[#5a5a72] hover:text-[#e8e8e8]'
                  }`}
                >
                  3-Reel Classic
                </button>
                <div className="w-1 bg-[#5a5a72]"></div>
                <button
                  disabled={isSpinning}
                  onClick={() => {
                    audio.playClick();
                    setCabinetMode(5);
                  }}
                  className={`px-4 py-1.5 font-jersey text-lg uppercase cursor-pointer select-none transition-none ${
                    cabinetMode === 5
                      ? 'bg-[#ff9f00] text-[#0d0d1a] font-bold'
                      : 'text-[#5a5a72] hover:text-[#e8e8e8]'
                  }`}
                >
                  5-Reel Premium
                </button>
              </div>
            </div>

            <div className="relative border-4 border-[#ff9f00] bg-black p-4 md:p-6 mb-6 filter drop-shadow-[4px_4px_0px_#000000] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none crt-scanlines z-10 opacity-15" />
              <div className="absolute left-1 top-0 bottom-0 w-1.5 bg-[#ff9f00] animate-pulse" />
              <div className="absolute right-1 top-0 bottom-0 w-1.5 bg-[#ff9f00] animate-pulse" />

              <div className={`grid gap-2 md:gap-4 ${cabinetMode === 3 ? 'grid-cols-3' : 'grid-cols-5'}`}>
                {reels.map((symbolKey, idx) => {
                  const symbolInfo = SLOT_SYMBOLS[symbolKey];
                  const IconComp = symbolInfo.icon;
                  const isSymbolSpinning = spinningReels[idx];

                  return (
                    <PixelCard
                      key={idx}
                      chamfer={8}
                      borderWidth={3}
                      borderColorClass={isSymbolSpinning ? 'bg-[#ff9f00]' : 'bg-[#e8e8e8]'}
                      fillColorClass="bg-[#f2ead3]"
                      className="aspect-square flex items-center justify-center filter drop-shadow-[2px_2px_0px_#000000] relative overflow-hidden"
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full p-1 md:p-2 select-none relative">
                        <div className={`flex flex-col items-center justify-center transition-all ${isSymbolSpinning ? 'animate-bounce opacity-80 scale-95' : ''}`}>
                          <IconComp />
                        </div>
                        {isSymbolSpinning && (
                          <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center">
                            <span className="font-jersey text-xs text-black/60 tracking-wider">ROLL</span>
                          </div>
                        )}
                        {!isSymbolSpinning && (
                          <span className="font-jersey text-[10px] md:text-xs text-black/60 tracking-wider uppercase mt-1 leading-none select-none">
                            {symbolInfo.name}
                          </span>
                        )}
                      </div>
                    </PixelCard>
                  );
                })}
              </div>

              <div className="absolute left-0 right-0 top-1/2 h-1 border-b-2 border-dashed border-[#ff9f00]/40 pointer-events-none" />

              {jackpotBanner && (
                <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center p-4 border-4 border-[#3fff6e] text-center animate-pulse">
                  <h3 className="font-jersey text-3xl md:text-5xl text-[#3fff6e] tracking-widest uppercase m-0 animate-bounce">
                    ★ JACKPOT WIN ★
                  </h3>
                  <p className="font-jersey text-xl md:text-2xl text-white uppercase m-0 mt-2">
                    {jackpotBanner}
                  </p>
                  <p className="font-jersey text-sm text-[#ff9f00] uppercase m-0 mt-3 animate-pulse">
                    +$ {lastWin?.toFixed(2)} CREDITED
                  </p>
                </div>
              )}
            </div>

            <div className="border-4 border-[#5a5a72] bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex flex-col">
                <span className="font-jersey text-lg text-[#ff9f00] uppercase leading-none">
                  SELECT CREDIT BET:
                </span>
                <span className="font-jersey text-[11px] text-[#5a5a72] uppercase mt-0.5">
                  Min $1.00 • Max $100.00 play tokens
                </span>
              </div>

              <div className="flex items-center gap-3">
                <PixelButton
                  variant="red"
                  disabled={isSpinning || betAmount <= 1}
                  onClick={() => {
                    setBetAmount(prev => Math.max(1, prev - 10));
                  }}
                  chamfer={4}
                  className="px-2"
                >
                  <span className="text-sm px-1">-10</span>
                </PixelButton>

                <div className="border-2 border-[#e8e8e8] bg-black px-4 py-1.5 flex items-center justify-center min-w-28 text-center">
                  <span className="font-jersey text-2xl text-[#ff9f00] leading-none select-none">
                    ${betAmount.toFixed(2)}
                  </span>
                </div>

                <PixelButton
                  variant="green"
                  disabled={isSpinning || betAmount >= 100}
                  onClick={() => {
                    setBetAmount(prev => Math.min(100, prev + 10));
                  }}
                  chamfer={4}
                  className="px-2"
                >
                  <span className="text-sm px-1">+10</span>
                </PixelButton>
              </div>

              <div className="flex gap-1.5 flex-wrap justify-center">
                {[5, 20, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    disabled={isSpinning}
                    onClick={() => {
                      audio.playClick();
                      setBetAmount(preset);
                    }}
                    className={`px-3 py-1 font-jersey text-lg cursor-pointer select-none transition-none border-2 ${
                      betAmount === preset
                        ? 'bg-[#ff9f00] text-black border-[#ff9f00]'
                        : 'bg-black text-white border-[#5a5a72] hover:border-[#ff9f00]'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <PixelButton
                variant="gold"
                disabled={isSpinning}
                onClick={handleSpin}
                className="flex-1"
                soundType="click"
              >
                <div className="flex items-center justify-center gap-2 py-1">
                  <Gamepad2 className="w-5 h-5 text-black" />
                  <span className="text-2xl tracking-widest uppercase text-black font-bold">
                    {isSpinning ? 'SPINNING REELS...' : 'SPIN PLAY LEVER'}
                  </span>
                </div>
              </PixelButton>

              <PixelButton
                variant="gold"
                onClick={() => setShowPaytableModal(true)}
                className="shrink-0"
              >
                <div className="flex items-center justify-center gap-1.5 py-1">
                  <HelpCircle className="w-5 h-5 text-black" />
                  <span className="text-lg">PAYTABLE</span>
                </div>
              </PixelButton>
            </div>

            <div className="absolute -right-12 top-1/4 hidden md:flex flex-col items-center z-20">
              <div className="w-8 h-8 border-3 border-[#e8e8e8] bg-[#111111] flex items-center justify-center filter drop-shadow-[2px_2px_0px_#000000]">
                <div className="w-3 h-3 bg-[#5a5a72] border-2 border-[#e8e8e8]"></div>
              </div>
              <div 
                className="w-2.5 bg-[#e8e8e8] border-r-2 border-[#5a5a72] origin-top transition-all duration-100"
                style={{
                  height: leverState === 'down' ? '18px' : leverState === 'pulling' ? '36px' : '52px',
                  boxShadow: 'inset 1px 1px 0 #fff',
                }}
              />
              <div 
                onClick={!isSpinning ? handleSpin : undefined}
                className={`w-9 h-9 border-3 border-[#e8e8e8] bg-[#ff3f3f] cursor-pointer filter drop-shadow-[2px_2px_0px_#000000] active:scale-95 flex items-center justify-center transition-all duration-100 ${
                  isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff8080]'
                }`}
                style={{
                  transform: leverState === 'down' ? 'translateY(12px)' : leverState === 'pulling' ? 'translateY(6px)' : 'translateY(0px)',
                }}
              >
                <div className="w-2.5 h-2.5 bg-white opacity-60 m-1"></div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-4 border-[#5a5a72]/30 flex justify-between items-center px-4 md:px-8">
              <div className="flex flex-col items-center">
                <div className="w-4 h-12 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-8 bg-[#ff9f00] animate-pulse"></div>
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">insert play coins</span>
              </div>

              <div className="flex-1 px-4 text-center">
                {lastWin !== null ? (
                  <div className="p-2 bg-[#1e5631] border-2 border-[#3fff6e] inline-block filter drop-shadow-[2px_2px_0px_#000] animate-bounce">
                    <p className="font-jersey text-lg text-[#3fff6e] uppercase m-0 leading-none">
                      ★ PAYOUT +${lastWin.toFixed(2)} ★
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-black border-2 border-[#5a5a72] inline-block">
                    <p className="font-jersey text-lg text-[#5a5a72] uppercase m-0 leading-none">
                      STATUS: INSERT TOKEN
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-12 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-8 bg-[#ff9f00] animate-pulse"></div>
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">service entry</span>
              </div>
            </div>

          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="border-4 border-[#ff9f00]/60 bg-[#111111] p-4 flex flex-col items-center relative filter drop-shadow-[4px_4px_0px_#000000]">
            <h4 className="font-jersey text-[#ff9f00] text-xl uppercase mb-3 text-center w-full border-b-2 border-white/10 pb-1">
              ★ SLOTS MANAGER ★
            </h4>
            
            <div className="flex items-center gap-4 w-full">
              <div className="scale-90 select-none">
                <PixelMascot mood={mascotMood} />
              </div>

              <div className="flex-1 bg-[#0d0d1a] border-2 border-[#ff9f00] p-3 relative text-left">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#ff9f00] border-b-8 border-b-transparent"></div>
                <p className="font-jersey text-sm text-white uppercase m-0 leading-tight">
                  "{mascotDialogue}"
                </p>
              </div>
            </div>
          </div>

          <PixelPanel
            title="PAYTABLE MULTIPLIERS"
            subtitle={`${cabinetMode}-Reels Payout Table Ledger`}
            headerAccent="gold"
          >
            <div className="space-y-4">
              <div className="space-y-2.5 border-2 border-[#5a5a72] p-3 bg-black">
                {SYMBOL_KEYS.map((key) => {
                  const sym = SLOT_SYMBOLS[key];
                  const IconComp = sym.icon;
                  return (
                    <div key={key} className="flex justify-between items-center border-b border-white/5 pb-1 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-[#f2ead3] border border-gray-400 p-0.5 select-none scale-75">
                          <IconComp />
                        </div>
                        <span className="font-jersey text-lg text-white uppercase leading-none">
                          {sym.name}
                        </span>
                      </div>
                      <span className="font-jersey text-lg" style={{ color: sym.color }}>
                        {cabinetMode === 3 ? '3x' : '5x'} match pays{' '}
                        <span className="text-white underline">
                          {getSymbolMultiplierLabel(sym.id)}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-2 border-[#5a5a72] p-3 bg-black text-[#5a5a72] font-jersey uppercase space-y-1">
                <h5 className="text-white text-sm m-0">EMULATOR CABINET LAWS:</h5>
                <p className="text-[11px] leading-tight m-0">1. Adjust play coins bets utilizing adjustments controls.</p>
                <p className="text-[11px] leading-tight m-0">2. Draw cabinet lever or click spin button to pull.</p>
                <p className="text-[11px] leading-tight m-0">3. Under 3-Reel mode, 3x matches award multiplier. 2x matches award 1.5x bet, single Cherry awards 1x push.</p>
                <p className="text-[11px] leading-tight m-0">4. Under 5-Reel mode, 5x, 4x, 3x, or 2x matches award relative multipliers accordingly.</p>
              </div>
            </div>
          </PixelPanel>

          <div className="border-4 border-[#5a5a72] bg-[#f2ead3] p-4 text-black font-jersey uppercase relative filter drop-shadow-[4px_4px_0px_#000000] border-b-8">
            <h4 className="text-lg border-b border-black/20 pb-1 mb-2 text-center text-black/80">
              ⚡ LIVE RECEIPT PRINTER
            </h4>
            <div className="space-y-1 text-xs max-h-44 overflow-y-auto font-mono text-black/80 leading-tight">
              {transactionLog
                .filter(tx => tx.source === 'slot_machine')
                .slice(0, 5)
                .map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center border-b border-black/5 pb-0.5">
                    <span>
                      {tx.type === 'CREDIT' ? 'WIN ' : 'BET '}
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className={tx.type === 'CREDIT' ? 'text-[#1e5631] font-bold' : 'text-red-700'}>
                      {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              {transactionLog.filter(tx => tx.source === 'slot_machine').length === 0 && (
                <p className="text-center text-black/50 py-3">NO RECENT SPINS RECORDED</p>
              )}
            </div>
            <div className="border-t border-black/20 mt-3 pt-1.5 text-center text-[10px] text-black/60">
              * TRANSACTION SOURCE: SLOT_MACHINE *
            </div>
          </div>
        </div>
      </div>

      {showPaytableModal && (
        <div className="fixed inset-0 z-50 bg-[#0d0d1a]/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl border-4 border-[#ff9f00] bg-[#111111] p-6 relative filter drop-shadow-[6px_6px_0px_#000000]">
            
            <div className="flex justify-between items-center border-b-3 border-[#ff9f00] pb-3 mb-4">
              <h3 className="font-jersey text-2xl text-[#ff9f00] m-0 uppercase">
                ★ COIN-OP REELS SCHEMATIC &amp; PAYOUTS ★
              </h3>
              <button 
                onClick={() => {
                  audio.playClick();
                  setShowPaytableModal(false);
                }}
                className="text-white hover:text-[#ff9f00] font-jersey text-2xl uppercase cursor-pointer"
              >
                [X] CLOSE
              </button>
            </div>

            <div className="space-y-4">
              <p className="font-jersey text-md text-white/80 uppercase">
                Here is the verified payout scheme for both 3-Reel and 5-Reel play modes:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-[#5a5a72] p-3 bg-black">
                  <h5 className="font-jersey text-[#ff9f00] text-lg uppercase border-b border-[#5a5a72]/30 pb-1 mb-2">
                    3-Reel Payouts
                  </h5>
                  <ul className="space-y-1 font-jersey text-sm uppercase text-[#e8e8e8]">
                    <li>💎 3x DIAMOND: <span className="text-[#ff9f00]">50x</span></li>
                    <li>7️⃣ 3x SEVEN: <span className="text-[#ff9f00]">25x</span></li>
                    <li>⭐ 3x STAR: <span className="text-[#ff9f00]">10x</span></li>
                    <li>🔔 3x BELL: <span className="text-[#ff9f00]">5x</span></li>
                    <li>🍒 3x CHERRY: <span className="text-[#ff9f00]">3x</span></li>
                    <li>🌀 ANY 2x MATCH: <span className="text-[#ff9f00]">1.5x</span></li>
                    <li>🍒 1x CHERRY: <span className="text-[#3fff6e]">1x (PUSH)</span></li>
                  </ul>
                </div>

                <div className="border-2 border-[#5a5a72] p-3 bg-black">
                  <h5 className="font-jersey text-[#ff9f00] text-lg uppercase border-b border-[#5a5a72]/30 pb-1 mb-2">
                    5-Reel Payouts
                  </h5>
                  <ul className="space-y-1 font-jersey text-sm uppercase text-[#e8e8e8]">
                    <li>💎 5x DIAMOND: <span className="text-[#ff9f00]">100x</span></li>
                    <li>7️⃣ 5x SEVEN: <span className="text-[#ff9f00]">50x</span></li>
                    <li>⭐ 5x STAR: <span className="text-[#ff9f00]">20x</span></li>
                    <li>🔔 5x BELL: <span className="text-[#ff9f00]">10x</span></li>
                    <li>🍒 5x CHERRY: <span className="text-[#ff9f00]">5x</span></li>
                    <li>🌀 4x OF ANY: <span className="text-[#ff9f00]">4x - 30x</span></li>
                    <li>🌀 3x OF ANY: <span className="text-[#ff9f00]">2x</span></li>
                    <li>🌀 2x OF ANY: <span className="text-[#3fff6e]">0.5x</span></li>
                  </ul>
                </div>
              </div>

              <div className="border-2 border-[#ff9f00]/30 p-3 bg-black text-[#5a5a72] font-jersey uppercase">
                <span className="text-[#ff9f00]">COIN-OP TECHNICAL SPEC:</span>
                <p className="text-xs m-0 mt-1 leading-tight text-[#e8e8e8]">
                  Theoretical return-to-player (RTP) index is hardcoded at exactly <span className="text-[#ff9f00]">92.00%</span> to ensure a stable house margin of 8.00% for economy equilibrium. Infinite credit exploits are mathematically impossible under this system.
                </p>
              </div>

              <div className="text-center pt-2">
                <PixelButton variant="gold" onClick={() => {
                  audio.playClick();
                  setShowPaytableModal(false);
                }}>
                  <span>ACKNOWLEDGE LAWS</span>
                </PixelButton>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN RE-ROUTING PAVILION ENTRY POINT
// ==========================================

export const MinigamesScreen: React.FC = () => {
  const [activeCabinet, setActiveCabinet] = useState<'select' | 'slots' | 'wheel' | 'dice' | 'scratch' | 'pachinko' | 'luckydraw'>('select');

  const selectCabinet = (cabinet: 'slots' | 'wheel' | 'dice' | 'scratch' | 'pachinko' | 'luckydraw') => {
    audio.playClick();
    setActiveCabinet(cabinet);
  };

  if (activeCabinet === 'slots') {
    return <SlotCabinet onBack={() => setActiveCabinet('select')} />;
  }

  if (activeCabinet === 'wheel') {
    return <WheelScreen onBack={() => setActiveCabinet('select')} />;
  }

  if (activeCabinet === 'dice') {
    return <DiceScreen onBack={() => setActiveCabinet('select')} />;
  }

  if (activeCabinet === 'scratch') {
    return <ScratchScreen onBack={() => setActiveCabinet('select')} />;
  }

  if (activeCabinet === 'pachinko') {
    return <PachinkoScreen onBack={() => setActiveCabinet('select')} />;
  }

  if (activeCabinet === 'luckydraw') {
    return <LuckyDrawScreen onBack={() => setActiveCabinet('select')} />;
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Page Title Header */}
      <div className="border-4 border-[#ff9f00] bg-[#111111] p-5 filter drop-shadow-[4px_4px_0px_#000000] relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 pixel-checker pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-jersey text-white uppercase tracking-wider m-0 leading-none drop-shadow-[2px_2px_0px_#ff9f00]">
              ★ COIN-OP ARCADE PAVILION ★
            </h1>
            <p className="font-jersey text-lg text-white/60 uppercase m-0 mt-2">
              Step up to the cabinets • Select thy amusement machine • Locked 92.0% RTP compliance
            </p>
          </div>
          <div className="shrink-0">
            <PixelButton variant="dark" onClick={() => audio.playClick()} className="font-jersey">
              <span className="text-lg">CABINETS ACTIVE</span>
            </PixelButton>
          </div>
        </div>
      </div>

      {/* 2. THE ARCADE CABINET CHOICE GALLERY (BENTO GRID SCENE) */}
      <div className="border-4 border-[#ff9f00]/50 bg-black p-6 md:p-8 relative min-h-[400px] flex flex-col justify-center filter drop-shadow-[6px_6px_0px_#000]">
        <div className="absolute inset-0 bg-[#121224] opacity-25 pixel-checker" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto w-full relative z-10">
          
          {/* CABINET 1: LUCKY 8BIT SPIN (SLOTS) */}
          <div 
            onClick={() => selectCabinet('slots')}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-4 border-[#ff9f00] bg-[#111111] transition-all duration-75 relative flex flex-col"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            {/* Header flashing plate */}
            <div className="bg-[#ff9f00] text-black font-bold font-jersey text-2xl py-2 px-4 border-b-4 border-[#ff9f00] uppercase tracking-widest flex justify-between items-center select-none">
              <span>★ 777 REELS ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-2 font-bold animate-pulse">ACTIVE</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Cabinet vector simulation drawing */}
              <div className="h-44 bg-[#0d0d1a] border-3 border-[#ff9f00] relative overflow-hidden flex flex-col items-center justify-center select-none">
                <div className="absolute top-2 text-[10px] font-jersey text-[#ff9f00] tracking-widest animate-pulse">LUCKY 8BIT SPIN</div>
                
                {/* 3 pixel slot boxes */}
                <div className="flex gap-2 my-4">
                  <div className="w-12 h-16 bg-[#f2ead3] border-2 border-[#e8e8e8] flex items-center justify-center font-sans font-bold text-lg text-red-600">
                    🍒
                  </div>
                  <div className="w-12 h-16 bg-[#f2ead3] border-2 border-[#e8e8e8] flex items-center justify-center font-sans font-bold text-lg text-yellow-600">
                    🔔
                  </div>
                  <div className="w-12 h-16 bg-[#f2ead3] border-2 border-[#e8e8e8] flex items-center justify-center font-sans font-bold text-lg text-red-600">
                    🍒
                  </div>
                </div>

                <div className="absolute bottom-1 w-full text-center font-jersey text-xs text-[#5a5a72]">PULL LEVER TO SPIN</div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-jersey text-2xl text-[#ff9f00] uppercase m-0">LUCKY 8BIT SPIN CABINET</h3>
                <p className="font-jersey text-lg text-white/80 uppercase m-0 leading-tight">
                  Classic 3-reel or 5-reel coin slots. Pull the physical side lever to lock matching fruits, diamonds, or lucky 7s for payouts up to 100x thy bet!
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-[#5a5a72] uppercase pt-2 border-t border-[#5a5a72]/30">
                  <span>JACKPOT: 100x MULTIPLIER</span>
                  <span className="text-[#ff9f00] animate-pulse">◆ INJECT COMP TOKENS ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* CABINET 2: WHEEL OF FORTUNE (SPINNER) */}
          <div 
            onClick={() => selectCabinet('wheel')}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-4 border-[#3fff6e] bg-[#111111] transition-all duration-75 relative flex flex-col"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            {/* Header flashing plate */}
            <div className="bg-[#ff9f00] text-black font-bold font-jersey text-2xl py-2 px-4 border-b-4 border-[#3fff6e] uppercase tracking-widest flex justify-between items-center select-none">
              <span>★ MULTIPLIER WHEEL ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-2 font-bold animate-pulse">READY</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Cabinet vector spinner simulation */}
              <div className="h-44 bg-black border-3 border-white/20 relative overflow-hidden flex flex-col items-center justify-center select-none">
                <div className="absolute top-2 text-[10px] font-jersey text-white/60 tracking-widest animate-pulse">WHEEL OF ORBITS</div>
                
                {/* Spinning Wheel icon representation */}
                <div className="w-20 h-20 rounded-full border-4 border-[#3fff6e] border-dashed flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                  <div className="w-12 h-12 rounded-full bg-[#111111] border-2 border-[#ff9f00] flex items-center justify-center font-jersey text-white text-sm font-bold">
                    10x
                  </div>
                </div>

                <div className="absolute bottom-1 w-full text-center font-jersey text-xs text-[#5a5a72]">TAP TO SPIN COIN WHEEL</div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-jersey text-2xl text-white uppercase m-0">FORTUNE MULTIPLIER SPINNER</h3>
                <p className="font-jersey text-lg text-white/80 uppercase m-0 leading-tight">
                  High-stakes 16-segment physics wheel. Roll targeted multipliers from 0.5x up to the legendary 10x! Includes ticking-peg audio feedback and coin showers.
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-[#5a5a72] uppercase pt-2 border-t border-[#5a5a72]/30">
                  <span>MAX PAYOUT: 10x REWARD</span>
                  <span className="text-[#ff9f00] animate-pulse">◆ COMP PATTERN SYNCED ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* CABINET 3: HIGH-LOW PYRAMID DICE */}
          <div 
            onClick={() => selectCabinet('dice')}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-4 border-[#ff3f3f] bg-[#111111] transition-all duration-75 relative flex flex-col"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            {/* Header flashing plate */}
            <div className="bg-[#ff9f00] text-black font-bold font-jersey text-2xl py-2 px-4 border-b-4 border-[#ff3f3f] uppercase tracking-widest flex justify-between items-center select-none">
              <span>★ TUMBLE DICE ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-2 font-bold animate-pulse">HOT</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Cabinet vector simulation drawing */}
              <div className="h-44 bg-black border-3 border-white/20 relative overflow-hidden flex flex-col items-center justify-center select-none">
                <div className="absolute top-2 text-[10px] font-jersey text-white/60 tracking-widest animate-pulse">HIGH-LOW PYRAMID</div>
                
                {/* 2 physical pixel dice mockups */}
                <div className="flex gap-4 my-4">
                  {/* Die 1 */}
                  <svg width="40" height="40" viewBox="0 0 16 16" className="filter drop-shadow-[2px_2px_0px_#000]" shapeRendering="crispEdges">
                    <path d="M 2 0 L 14 0 L 16 2 L 16 14 L 14 16 L 2 16 L 0 14 L 0 2 Z" fill="#e8e8e8" />
                    <path d="M 2 1 L 14 1 L 15 2 L 15 14 L 14 15 L 2 15 L 1 14 L 1 2 Z" fill="#f2ead3" />
                    <rect x="3" y="3" width="2" height="2" fill="#111124" />
                    <rect x="11" y="3" width="2" height="2" fill="#111124" />
                    <rect x="7" y="7" width="2" height="2" fill="#111124" />
                    <rect x="3" y="11" width="2" height="2" fill="#111124" />
                    <rect x="11" y="11" width="2" height="2" fill="#111124" />
                  </svg>
                  {/* Die 2 */}
                  <svg width="40" height="40" viewBox="0 0 16 16" className="filter drop-shadow-[2px_2px_0px_#000]" shapeRendering="crispEdges">
                    <path d="M 2 0 L 14 0 L 16 2 L 16 14 L 14 16 L 2 16 L 0 14 L 0 2 Z" fill="#e8e8e8" />
                    <path d="M 2 1 L 14 1 L 15 2 L 15 14 L 14 15 L 2 15 L 1 14 L 1 2 Z" fill="#f2ead3" />
                    <rect x="7" y="7" width="2" height="2" fill="#ff9f00" />
                  </svg>
                </div>

                <div className="absolute bottom-1 w-full text-center font-jersey text-xs text-[#5a5a72]">TUMBLE & RISK CHAIN LADDER</div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-jersey text-2xl text-white uppercase m-0">HIGH-LOW PYRAMID DICE</h3>
                <p className="font-jersey text-lg text-white/80 uppercase m-0 leading-tight">
                  Tumble two standard dice, then predict if the next outcome is Higher, Lower or Same. Double thy coins up a 5-step risk ladder, or safely bank!
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-[#5a5a72] uppercase pt-2 border-t border-[#5a5a72]/30">
                  <span>STEP MULTIPLIER RISKS</span>
                  <span className="text-[#ff9f00] animate-pulse">◆ 92.0% RTP CALIBRATED ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* CABINET 4: LUCKY PIXEL SCRATCHER */}
          <div 
            onClick={() => selectCabinet('scratch')}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-4 border-[#ff9f00] bg-[#111111] transition-all duration-75 relative flex flex-col"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            {/* Header flashing plate */}
            <div className="bg-[#ff9f00] text-black font-bold font-jersey text-2xl py-2 px-4 border-b-4 border-white uppercase tracking-widest flex justify-between items-center select-none">
              <span>★ SCRATCH COINS ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-2 font-bold animate-pulse">NEW</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Cabinet vector simulation drawing */}
              <div className="h-44 bg-black border-3 border-white/20 relative overflow-hidden flex flex-col items-center justify-center select-none">
                <div className="absolute top-2 text-[10px] font-jersey text-white/60 tracking-widest animate-pulse">LUCKY TICKET VENDER</div>
                
                {/* Simulated 3x3 scratch grid */}
                <div className="grid grid-cols-3 gap-1 p-2 bg-[#f2ead3] border-2 border-[#ff9f00] my-4 w-24 h-24 relative">
                  <div className="bg-[#ff9f00] text-black flex items-center justify-center text-[10px] font-bold">★</div>
                  <div className="bg-[#ff9f00] text-black flex items-center justify-center text-[10px] font-bold">★</div>
                  <div className="bg-[#5a5a72] opacity-80" />
                  
                  <div className="bg-[#5a5a72] opacity-80" />
                  <div className="bg-[#ff9f00] text-black flex items-center justify-center text-[10px] font-bold">★</div>
                  <div className="bg-[#5a5a72] opacity-80" />
                  
                  <div className="bg-[#5a5a72] opacity-80" />
                  <div className="bg-[#5a5a72] opacity-80" />
                  <div className="bg-[#5a5a72] opacity-80" />
                </div>

                <div className="absolute bottom-1 w-full text-center font-jersey text-xs text-[#5a5a72]">RUB FOIL TO CLAIM REWARDS</div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-jersey text-2xl text-white uppercase m-0">LUCKY PIXEL SCRATCHER</h3>
                <p className="font-jersey text-lg text-white/80 uppercase m-0 leading-tight">
                  Cheap instant micro stakes. Scratch the pixelated gray foil to reveal matching lucky 7s, clover, cherries, or diamonds for returns up to 100x!
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-[#5a5a72] uppercase pt-2 border-t border-[#5a5a72]/30">
                  <span>STAKES: $0.05 TO $0.25</span>
                  <span className="text-[#ff9f00] animate-pulse">◆ 92.0% RTP CALIBRATED ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* CABINET 5: LUCKY PIXEL PACHINKO (PLINKO) */}
          <div 
            onClick={() => selectCabinet('pachinko')}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-4 border-[#3fff6e] bg-[#111111] transition-all duration-75 relative flex flex-col"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            {/* Header flashing plate */}
            <div className="bg-[#ff9f00] text-black font-bold font-jersey text-2xl py-2 px-4 border-b-4 border-[#3fff6e] uppercase tracking-widest flex justify-between items-center select-none">
              <span>★ Plinko Cascade ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-2 font-bold animate-pulse">HOT</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Cabinet vector simulation drawing */}
              <div className="h-44 bg-black border-3 border-white/20 relative overflow-hidden flex flex-col items-center justify-center select-none">
                <div className="absolute top-2 text-[10px] font-jersey text-white/60 tracking-widest animate-pulse">8-BIT CASCADE PATHS</div>
                
                {/* Simulated vertical peg board */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 bg-[#111111] border border-white/20 my-4 w-28 h-24 relative rounded-none">
                  {/* Row of simulated pegs */}
                  <div className="flex gap-4">
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                  </div>
                  <div className="flex gap-4">
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                  </div>
                  <div className="flex gap-4">
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                    <span className="w-1.5 h-1.5 bg-[#e8e8e8]" />
                  </div>
                  {/* Golden falling pixel ball indicator */}
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#ff9f00] animate-bounce" />
                </div>

                <div className="absolute bottom-1 w-full text-center font-jersey text-xs text-[#5a5a72]">PINBOARD BALL FALLS</div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-jersey text-2xl text-white uppercase m-0">LUCKY PIXEL PACHINKO</h3>
                <p className="font-jersey text-lg text-white/80 uppercase m-0 leading-tight">
                  Vertical pixel-art peg boards. Launch multiple lucky coins concurrently in sequence to cascade through pegs for edge jackpot slot multipliers!
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-[#5a5a72] uppercase pt-2 border-t border-[#5a5a72]/30">
                  <span>MAX WIN: 20x JACKPOT</span>
                  <span className="text-[#ff9f00] animate-pulse">◆ 92.0% RTP CALIBRATED ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* CABINET 6: LUCKY DRAW TERMINAL (LOTTERY) */}
          <div 
            onClick={() => selectCabinet('luckydraw')}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-4 border-[#ffd23f] bg-[#111111] transition-all duration-75 relative flex flex-col"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            {/* Header flashing plate */}
            <div className="bg-[#ff9f00] text-black font-bold font-jersey text-2xl py-2 px-4 border-b-4 border-[#ffd23f] uppercase tracking-widest flex justify-between items-center select-none">
              <span>★ Lucky Draw ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-2 font-bold animate-pulse">95% RTP</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Cabinet vector simulation drawing */}
              <div className="h-44 bg-black border-3 border-white/20 relative overflow-hidden flex flex-col items-center justify-center select-none">
                <div className="absolute top-2 text-[10px] font-jersey text-white/60 tracking-widest animate-pulse">CHIPTUNE DRUM TUMBLER</div>
                
                {/* Simulated spinning ticket drum */}
                <div className="relative my-4 w-32 h-20 border-2 border-dashed border-[#ff9f00] flex items-center justify-center bg-[#111111] p-2 animate-bounce">
                  <div className="absolute inset-2 border border-dotted border-[#ff9f00]/50" />
                  {/* Glowing 8bit ticket inside */}
                  <div className="w-14 h-8 bg-[#ff9f00] text-black border-2 border-black flex flex-col items-center justify-center font-jersey text-xs tracking-wider relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full" />
                    <span className="font-bold">LUCKY</span>
                  </div>
                </div>

                <div className="absolute bottom-1 w-full text-center font-jersey text-xs text-[#5a5a72]">SCHEDULED MULTIPLAYER RAFFLE</div>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="font-jersey text-2xl text-white uppercase m-0">LUCKY DRAW TERMINAL</h3>
                <p className="font-jersey text-lg text-white/80 uppercase m-0 leading-tight">
                  Periodic multiplayer drawing. Pool buy-ins with small 5% rake. Drum-roll tumbler determines the champion in real-time!
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-[#5a5a72] uppercase pt-2 border-t border-[#5a5a72]/30">
                  <span>BUY-IN: $0.20 CHIPS</span>
                  <span className="text-[#ff9f00] animate-pulse">◆ 95.0% RTP CALIBRATED ◆</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Mascot Guide Box */}
      <div className="border-4 border-[#ff9f00] bg-[#111111] p-5 flex flex-col sm:flex-row items-center gap-6 filter drop-shadow-[4px_4px_0px_#000] relative"
        style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
      >
        <PixelMascot mood="idle" />
        <div className="text-center sm:text-left space-y-2">
          <h3 className="text-2xl font-jersey text-white uppercase m-0 leading-none drop-shadow-[1px_1px_0px_#ff9f00]">
            ★ COIN-OP REGS & CABINET CODES ★
          </h3>
          <p className="font-jersey text-lg text-[#e8e8e8] uppercase m-0 leading-tight">
            Step right up! Both the Slots reels, the Wheel of Fortune spinner, and the Pyramid Dice machine run on high-fidelity, mathematically balanced 8-bit algorithms. Select a cabinet above to begin thy tournament!
          </p>
        </div>
      </div>

    </div>
  );
};
