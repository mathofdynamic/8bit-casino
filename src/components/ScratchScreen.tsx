/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelCard, PixelMascot } from './PixelUI';
import { ArrowLeft, Sparkles, HelpCircle, Trophy, Landmark, RotateCcw } from 'lucide-react';
import { audio } from '../lib/audio';

// ==========================================
// 8-BIT SCRATCH CARD SPEC & SYMBOLS
// ==========================================

const ScratchSevenIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="2" y="1" width="12" height="3" fill="#ffd23f" />
    <rect x="2" y="1" width="12" height="1" fill="#ffffff" />
    <rect x="10" y="4" width="4" height="2" fill="#ffd23f" />
    <rect x="9" y="6" width="4" height="2" fill="#ffd23f" />
    <rect x="8" y="8" width="4" height="2" fill="#ffd23f" />
    <rect x="7" y="10" width="4" height="2" fill="#ffd23f" />
    <rect x="6" y="12" width="4" height="3" fill="#ffd23f" />
    <rect x="11" y="2" width="2" height="3" fill="#ffffff" />
  </svg>
);

const ScratchGoldBarIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="2" y="3" width="12" height="10" fill="#ffd23f" />
    <rect x="3" y="4" width="10" height="8" fill="#ffffff" />
    <rect x="3" y="4" width="10" height="2" fill="#ffd23f" />
    <rect x="3" y="6" width="3" height="6" fill="#ffffff" />
    <rect x="10" y="6" width="3" height="6" fill="#ffd23f" />
  </svg>
);

const ScratchDiamondIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="1" fill="#ffffff" />
    <rect x="6" y="2" width="4" height="2" fill="#ff9f00" />
    <rect x="4" y="4" width="8" height="2" fill="#ff9f00" />
    <rect x="2" y="6" width="12" height="2" fill="#ff9f00" />
    <rect x="1" y="8" width="14" height="1" fill="#ff9f00" />
    <rect x="2" y="9" width="12" height="1" fill="#ff9f00" />
    <rect x="3" y="10" width="10" height="1" fill="#ff9f00" />
    <rect x="4" y="11" width="8" height="1" fill="#ff9f00" />
    <rect x="5" y="12" width="6" height="1" fill="#ff9f00" />
    <rect x="6" y="13" width="4" height="1" fill="#ff9f00" />
    <rect x="7" y="14" width="2" height="1" fill="#ff9f00" />
    <rect x="7" y="1" width="1" height="1" fill="#ffffff" />
    <rect x="6" y="2" width="2" height="1" fill="#ffffff" />
    <rect x="4" y="4" width="3" height="1" fill="#ffffff" />
    <rect x="2" y="6" width="4" height="1" fill="#ffffff" />
  </svg>
);

const ScratchBellIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" fill="#ff9f00" />
    <rect x="6" y="3" width="4" height="1" fill="#ff9f00" />
    <rect x="7" y="4" width="2" height="1" fill="#ffffff" />
    <rect x="6" y="5" width="4" height="1" fill="#ffffff" />
    <rect x="5" y="6" width="6" height="1" fill="#ffffff" />
    <rect x="4" y="7" width="8" height="2" fill="#ffffff" />
    <rect x="3" y="9" width="10" height="2" fill="#ffffff" />
    <rect x="2" y="11" width="12" height="2" fill="#ffffff" />
    <rect x="7" y="14" width="2" height="1" fill="#ff9f00" />
  </svg>
);

const ScratchCloverIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="2" y="5" width="4" height="4" fill="#ff9f00" />
    <rect x="3" y="4" width="2" height="6" fill="#ff9f00" />
    <rect x="10" y="5" width="4" height="4" fill="#ff9f00" />
    <rect x="11" y="4" width="2" height="6" fill="#ff9f00" />
    <rect x="6" y="1" width="4" height="4" fill="#ff9f00" />
    <rect x="5" y="2" width="6" height="2" fill="#ff9f00" />
    <rect x="6" y="9" width="4" height="4" fill="#ff9f00" />
    <rect x="5" y="10" width="6" height="2" fill="#ff9f00" />
    <rect x="7" y="11" width="2" height="4" fill="#ffffff" />
    <rect x="6" y="14" width="1" height="1" fill="#ffffff" />
  </svg>
);

const ScratchCherryIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="1" fill="#ffffff" />
    <rect x="8" y="2" width="1" height="3" fill="#ffffff" />
    <rect x="5" y="4" width="3" height="1" fill="#ffffff" />
    <rect x="4" y="5" width="2" height="1" fill="#ffffff" />
    <rect x="2" y="7" width="4" height="4" fill="#ff9f00" />
    <rect x="3" y="6" width="2" height="1" fill="#ff9f00" />
    <rect x="3" y="11" width="2" height="1" fill="#ff9f00" />
    <rect x="3" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="2" y="8" width="1" height="1" fill="#ffffff" />
    <rect x="10" y="7" width="4" height="4" fill="#ff9f00" />
    <rect x="11" y="6" width="2" height="1" fill="#ff9f00" />
    <rect x="11" y="11" width="2" height="1" fill="#ff9f00" />
    <rect x="11" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="10" y="8" width="1" height="1" fill="#ffffff" />
  </svg>
);

const ScratchCoinIcon: React.FC = () => (
  <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 16 16" shapeRendering="crispEdges">
    <rect x="2" y="0" width="12" height="16" fill="#ff9f00" />
    <rect x="0" y="2" width="16" height="12" fill="#ff9f00" />
    <rect x="1" y="3" width="14" height="10" fill="#ffffff" />
    <rect x="7" y="3" width="2" height="10" fill="#ff9f00" />
    <rect x="5" y="5" width="6" height="2" fill="#ff9f00" />
    <rect x="5" y="9" width="6" height="2" fill="#ff9f00" />
  </svg>
);

interface ScratchSymbol {
  id: string;
  name: string;
  multiplier: number;
  icon: React.ComponentType;
  color: string;
}

const SCRATCH_SYMBOLS: Record<string, ScratchSymbol> = {
  GOLD_SEVEN: { id: 'GOLD_SEVEN', name: 'GOLDEN 7', multiplier: 100, icon: ScratchSevenIcon, color: '#ff9f00' },
  GOLD_BAR: { id: 'GOLD_BAR', name: 'GOLD BAR', multiplier: 20, icon: ScratchGoldBarIcon, color: '#ff9f00' },
  DIAMOND: { id: 'DIAMOND', name: 'DIAMOND', multiplier: 10, icon: ScratchDiamondIcon, color: '#3ff7ff' },
  BELL: { id: 'BELL', name: 'BELL', multiplier: 5, icon: ScratchBellIcon, color: '#ff9f00' },
  CLOVER: { id: 'CLOVER', name: 'CLOVER', multiplier: 3, icon: ScratchCloverIcon, color: '#3fff6e' },
  CHERRY: { id: 'CHERRY', name: 'CHERRY', multiplier: 2, icon: ScratchCherryIcon, color: '#ff3f3f' },
  COIN: { id: 'COIN', name: 'LUCKY COIN', multiplier: 1, icon: ScratchCoinIcon, color: '#ff9f00' },
};

// ==========================================
// MATHEMATICAL PROBABILITY & 92% RTP SYSTEM
// ==========================================

const determineOutcome = (): string => {
  const rand = Math.random();
  if (rand < 0.0034) return 'GOLD_SEVEN'; // x100
  if (rand < 0.0034 + 0.0030) return 'GOLD_BAR'; // x20
  if (rand < 0.0034 + 0.0030 + 0.0060) return 'DIAMOND'; // x10
  if (rand < 0.0034 + 0.0030 + 0.0060 + 0.0200) return 'BELL'; // x5
  if (rand < 0.0034 + 0.0030 + 0.0060 + 0.0200 + 0.0400) return 'CLOVER'; // x3
  if (rand < 0.0034 + 0.0030 + 0.0060 + 0.0200 + 0.0400 + 0.0600) return 'CHERRY'; // x2
  if (rand < 0.0034 + 0.0030 + 0.0060 + 0.0200 + 0.0400 + 0.0600 + 0.1200) return 'COIN'; // x1
  return 'LOSS';
};

const generateCardSymbols = (outcome: string): string[] => {
  const grid = Array(9).fill('');
  const allSymbolIds = Object.keys(SCRATCH_SYMBOLS);

  if (outcome !== 'LOSS') {
    // Fill exactly 3 positions with the winning symbol
    const winningPositions: number[] = [];
    while (winningPositions.length < 3) {
      const pos = Math.floor(Math.random() * 9);
      if (!winningPositions.includes(pos)) {
        winningPositions.push(pos);
      }
    }
    
    winningPositions.forEach(pos => {
      grid[pos] = outcome;
    });

    // Fill remaining 6 positions randomly ensuring no other symbol reaches 3 matches
    for (let i = 0; i < 9; i++) {
      if (grid[i] !== '') continue;
      
      let attempts = 0;
      while (attempts < 100) {
        const sym = allSymbolIds[Math.floor(Math.random() * allSymbolIds.length)];
        const count = grid.filter(s => s === sym).length;
        if (count < 2) {
          grid[i] = sym;
          break;
        }
        attempts++;
      }
      
      if (grid[i] === '') {
        grid[i] = allSymbolIds.find(sym => grid.filter(s => s === sym).length < 2) || 'COIN';
      }
    }
  } else {
    // Loss card: Fill 9 positions randomly with no symbol appearing 3 or more times
    for (let i = 0; i < 9; i++) {
      let attempts = 0;
      while (attempts < 100) {
        const sym = allSymbolIds[Math.floor(Math.random() * allSymbolIds.length)];
        const count = grid.filter(s => s === sym).length;
        if (count < 2) {
          grid[i] = sym;
          break;
        }
        attempts++;
      }
      if (grid[i] === '') {
        grid[i] = allSymbolIds.find(sym => grid.filter(s => s === sym).length < 2) || 'COIN';
      }
    }
  }

  return grid;
};

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const ScratchScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog } = useStore();

  const [cardPrice, setCardPrice] = useState<number>(0.10); // Default cheap card
  const [currentOutcome, setCurrentOutcome] = useState<string>('LOSS');
  const [cardSymbols, setCardSymbols] = useState<string[]>(Array(9).fill('COIN'));
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [gameResolved, setGameResolved] = useState<boolean>(false);
  const [lastResultText, setLastResultText] = useState<string | null>(null);

  // Scratch grid tracking. Key is "cellIndex-row-col": true if scratched
  const [scratchedBlocks, setScratchedBlocks] = useState<Record<string, boolean>>({});
  const [revealedCells, setRevealedCells] = useState<boolean[]>(Array(9).fill(false));
  const [isAutoRevealing, setIsAutoRevealing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Operator Mascot State
  const [mascotDialogue, setMascotDialogue] = useState<string>("WELCOME PLAYER! ACQUIRE A CHEAP SCRATCH CARD AND RUB THY LUCK!");
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'deal'>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [showPaytableModal, setShowPaytableModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particleIdCounter = useRef<number>(0);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Sync particle physics cycle
  useEffect(() => {
    if (particles.length === 0) return;

    let active = true;
    const updateParticles = () => {
      if (!active) return;
      setParticles((prev) => {
        const next = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.4, // gravity
          }))
          .filter((p) => p.y < 600 && p.x > -50 && p.x < 1000);
        if (next.length > 0) {
          animationFrameRef.current = requestAnimationFrame(updateParticles);
        }
        return next;
      });
    };

    animationFrameRef.current = requestAnimationFrame(updateParticles);
    return () => {
      active = false;
    };
  }, [particles.length]);

  // Sparkle shower on win
  const triggerGoldShower = () => {
    const newParticles: Particle[] = [];
    const colors = ['#ffd23f', '#3fff6e', '#3ff7ff', '#ffef99', '#ffffff'];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: particleIdCounter.current++,
        x: 240 + (Math.random() * 100 - 50),
        y: 200 + (Math.random() * 100 - 50),
        vx: (Math.random() * 10 - 5),
        vy: (Math.random() * -8 - 4),
        size: Math.floor(Math.random() * 3) + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  };

  // Helper: check if a cell's foil pixels are sufficiently revealed
  const isCellUnveiled = (cellIdx: number, scratched: Record<string, boolean>): boolean => {
    let count = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (scratched[`${cellIdx}-${r}-${c}`]) {
          count++;
        }
      }
    }
    return count >= 13; // 13 out of 25 is > 50%
  };

  // Check revealed state changes and auto-resolve when fully scratched
  useEffect(() => {
    if (!hasPaid || gameResolved || isAutoRevealing) return;

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
      
      // If all 9 cells have been unveiled, resolve!
      if (nextRevealed.every(v => v)) {
        resolveScratchGame();
      }
    }
  }, [scratchedBlocks, hasPaid, gameResolved, isAutoRevealing]);

  // Buy scratch card trigger
  const handleBuyCard = async () => {
    if (isAutoRevealing) return;

    if (profile.chips < cardPrice) {
      triggerToast('INSUFFICIENT BALANCE FOR CARD PURCHASE!', 'error');
      setMascotDialogue("GARRR! THOU LACKEST THE COINS EVEN FOR THIS CHEAP FOIL CARD!");
      setMascotMood('idle');
      return;
    }

    // Deduct ticket cost from user wallet
    const deductSuccess = await adjustBalance(-cardPrice, 'scratch_card');
    if (!deductSuccess) return;

    audio.playCoin();
    
    // Generate outcomes
    const outcome = determineOutcome();
    const symbols = generateCardSymbols(outcome);

    setCurrentOutcome(outcome);
    setCardSymbols(symbols);
    setScratchedBlocks({});
    setRevealedCells(Array(9).fill(false));
    setHasPaid(true);
    setGameResolved(false);
    setLastResultText(null);
    setMascotDialogue("CARD BOUGHT! DRAG THY POINTER OR TAP TO SCRATCH AWAY THE PIXEL SHROUD!");
    setMascotMood('deal');
  };

  // Resolve outcome and payout
  const resolveScratchGame = async () => {
    if (gameResolved) return;
    setGameResolved(true);

    const isWin = currentOutcome !== 'LOSS';
    const symMeta = SCRATCH_SYMBOLS[currentOutcome];
    const payout = isWin ? Number((cardPrice * symMeta.multiplier).toFixed(2)) : 0;

    if (isWin) {
      if (symMeta.multiplier >= 20) {
        audio.playJackpot();
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 350);
      } else {
        audio.playWin();
      }
      triggerGoldShower();

      const payoutSuccess = await adjustBalance(payout, 'scratch_card');
      if (payoutSuccess) {
        setMascotMood('happy');
        setMascotDialogue(`LUCKY TRIO! MATCHED 3 OF '${symMeta.name}'! PAID +$${payout.toFixed(2)} COINS!`);
        setLastResultText(`WIN: +$${payout.toFixed(2)}`);
        triggerToast(`★ SCRATCH MATCH WINNER! WON $${payout.toFixed(2)} ★`, 'success');
      }
    } else {
      audio.playLoss();
      setMascotMood('idle');
      setMascotDialogue("ALAS, THE FOIL VEIL REVEALS NO LUCKY MATCHES. ACQUIRE ANOTHER!");
      setLastResultText("NO MATCHES");
      triggerToast('CARD SCRATCHED: NO MATCHES', 'info');
    }
  };

  // Auto-Reveal button logic (chunky sequenced scratching sweep)
  const handleAutoReveal = () => {
    if (!hasPaid || gameResolved || isAutoRevealing) return;
    setIsAutoRevealing(true);
    audio.playClick();
    
    let currentCell = 0;
    const interval = setInterval(() => {
      // Reveal the cell's entire 5x5 subgrid instantly
      setScratchedBlocks(prev => {
        const next = { ...prev };
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            next[`${currentCell}-${r}-${c}`] = true;
          }
        }
        return next;
      });
      setRevealedCells(prev => {
        const next = [...prev];
        next[currentCell] = true;
        return next;
      });

      audio.playClick();
      currentCell++;
      
      if (currentCell >= 9) {
        clearInterval(interval);
        setIsAutoRevealing(false);
        // Direct resolution callback
        resolveScratchGame();
      }
    }, 80);
  };

  // Pointer drag/move coordinates math calculation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasPaid || gameResolved || isAutoRevealing) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    scratchAtPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !hasPaid || gameResolved || isAutoRevealing) return;
    scratchAtPointer(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
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
        setScratchedBlocks(prev => ({
          ...prev,
          [key]: true
        }));
        audio.playClick();
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Screen flash layer */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-[#ff9f00]/30 pointer-events-none mix-blend-overlay animate-pulse" />
      )}

      {/* 1. Cabinet Header */}
      <div className="border-4 border-[#ff9f00] bg-[#1a1a2e] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div>
          <h1 className="text-3xl font-jersey text-[#ff9f00] uppercase m-0 leading-none">
            ★ PIXEL SCRATCH TICKET TERMINAL ★
          </h1>
          <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 mt-1">
            Cheap micro bets • Instant 8-bit scratch lottery • Target 92.0% RTP
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

      {/* 2. Main Floor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: SCRATCH AREA */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="relative w-full max-w-2xl border-4 border-[#7a4b28] bg-[#0d0d1a] p-4 md:p-6 filter drop-shadow-[8px_8px_0px_#000000] border-b-16 rounded-none flex flex-col items-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0d0d1a] opacity-35 pixel-checker pointer-events-none" />
            
            {/* Wooden trim sides */}
            <div className="absolute -left-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-r-2 border-[#1a1a2e]" />
            <div className="absolute -right-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-l-2 border-[#1a1a2e]" />

            {/* Marquee Banner */}
            <div className="w-full border-4 border-[#ff9f00] bg-[#1a1a2e] p-3 text-center mb-6 relative overflow-hidden pixel-checker">
              <div className="flex justify-between items-center px-4">
                <span className="text-xl md:text-2xl text-[#3ff7ff] animate-pulse">◆</span>
                <span className="font-jersey text-2xl md:text-4xl text-[#ff9f00] tracking-widest uppercase leading-none drop-shadow-[2px_2px_0px_#ff9f00]">
                  8-BIT LUCKY SCRATCHER
                </span>
                <span className="text-xl md:text-2xl text-[#3ff7ff] animate-pulse">◆</span>
              </div>
            </div>

            {/* TICKET CARD DISPLAY */}
            <div className="relative w-full border-4 border-[#3ff7ff] bg-[#111124] p-4 md:p-6 mb-6 filter drop-shadow-[4px_4px_0px_#000] flex flex-col items-center">
              
              <div className="absolute inset-0 pointer-events-none crt-scanlines z-10 opacity-10" />

              {/* Particle shower overlay */}
              {particles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <svg className="w-full h-full">
                    {particles.map((p) => (
                      <rect
                        key={p.id}
                        x={p.x}
                        y={p.y}
                        width={p.size}
                        height={p.size}
                        fill={p.color}
                        stroke="#000"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>
              )}

              {/* TICKET CONTAINER */}
              <div 
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative w-72 h-72 md:w-96 md:h-96 border-4 border-[#ff9f00] bg-[#f2ead3] p-3 select-none filter drop-shadow-[4px_4px_0px_#000] overflow-hidden ${
                  hasPaid && !gameResolved ? 'cursor-crosshair' : 'cursor-default'
                }`}
                style={{ 
                  clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)',
                  touchAction: 'none'
                }}
              >
                {!hasPaid ? (
                  /* Buy card prompt overlay */
                  <div className="absolute inset-0 bg-[#0d0d1a]/90 z-20 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-5xl text-[#ff9f00] font-jersey mb-2 animate-bounce">⚡</span>
                    <h3 className="font-jersey text-2xl text-white uppercase m-0 tracking-wide">
                      TICKET VENDING LOCKED
                    </h3>
                    <p className="font-jersey text-md text-[#5a5a72] uppercase mt-1 mb-4">
                      Select a coin cost and click 'BUY SCRATCH CARD' to generate a physical lottery slip.
                    </p>
                    <div className="border-2 border-[#5a5a72] bg-[#111124] p-2 text-white font-jersey text-md">
                      92.00% RTP CERTIFIED
                    </div>
                  </div>
                ) : null}

                {/* THE 3x3 GRID */}
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full relative z-0">
                  {cardSymbols.map((symId, idx) => {
                    const sym = SCRATCH_SYMBOLS[symId] || SCRATCH_SYMBOLS.COIN;
                    const Icon = sym.icon;
                    const isCellRevealed = revealedCells[idx];

                    return (
                      <div 
                        key={idx}
                        className="relative border-2 border-black/10 bg-[#e5dbc2] flex flex-col items-center justify-center overflow-hidden"
                      >
                        {/* Hidden Symbol Detail */}
                        <div className="flex flex-col items-center justify-center p-1 text-center select-none">
                          <Icon />
                          <span 
                            className="font-jersey text-xs tracking-tight uppercase leading-none mt-1.5"
                            style={{ color: sym.color === '#ffffff' ? '#111124' : sym.color }}
                          >
                            {sym.name}
                          </span>
                          <span className="font-jersey text-[10px] text-black/40 mt-0.5">
                            x{sym.multiplier}
                          </span>
                        </div>

                        {/* Foil Shroud Overlay */}
                        {!isCellRevealed && (
                          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none select-none">
                            {Array.from({ length: 25 }).map((_, bIdx) => {
                              const r = Math.floor(bIdx / 5);
                              const c = bIdx % 5;
                              const isBlockScratched = scratchedBlocks[`${idx}-${r}-${c}`];

                              return (
                                <div 
                                  key={bIdx}
                                  className={`transition-opacity duration-75 border-[0.5px] border-black/15 ${
                                    isBlockScratched 
                                      ? 'opacity-0 bg-transparent' 
                                      : 'bg-gradient-to-br from-[#808092] to-[#5a5a72] opacity-100 shadow-inner'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
              
              {/* Drag instruction overlay label */}
              {hasPaid && !gameResolved && (
                <div className="mt-4 text-[#ff9f00] font-jersey text-md uppercase animate-pulse select-none">
                  ⚡ DRAG THY MOUSE OR TOUCH-DRAG ACROSS THE CARD TO SCRATCH! ⚡
                </div>
              )}
            </div>

            {/* CARD COST SELECTOR PANEL */}
            <div className="w-full border-4 border-white bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative">
              
              {hasPaid && !gameResolved && (
                <div className="absolute inset-0 bg-black/85 z-20 flex items-center justify-center font-jersey text-[#ff9f00] text-lg uppercase px-4 text-center">
                  BET LOCKED AT ${cardPrice.toFixed(2)} COINS UNTIL TICKET FINISHED
                </div>
              )}

              <div className="flex flex-col text-left">
                <span className="font-jersey text-lg text-white uppercase leading-none">
                  SELECT CARD PRICE TIER:
                </span>
                <span className="font-jersey text-[11px] text-[#5a5a72] uppercase mt-0.5">
                  Small stakes for infinite plays • Fits daily $1.00 grants perfectly
                </span>
              </div>

              <div className="flex gap-2.5">
                {[0.05, 0.10, 0.25].map((price) => (
                  <button
                    key={price}
                    disabled={hasPaid && !gameResolved}
                    onClick={() => {
                      audio.playClick();
                      setCardPrice(price);
                    }}
                    className={`px-4 py-2 font-jersey text-xl cursor-pointer select-none transition-none border-2 ${
                      cardPrice === price
                        ? 'bg-[#ff9f00] text-black border-white'
                        : 'bg-black text-white border-white/20 hover:border-[#ff9f00]'
                    }`}
                  >
                    ${price.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="w-full flex flex-col md:flex-row gap-4">
              
              <PixelButton
                variant={hasPaid && !gameResolved ? 'gold' : 'green'}
                disabled={isAutoRevealing}
                onClick={hasPaid && !gameResolved ? handleAutoReveal : handleBuyCard}
                className="flex-1"
              >
                <div className="flex items-center justify-center gap-2 py-1">
                  <Sparkles className="w-5 h-5 text-black" />
                  <span className="text-2xl tracking-widest uppercase text-black font-bold">
                    {hasPaid && !gameResolved ? 'AUTO-REVEAL SLIP' : `BUY TICKET ($${cardPrice.toFixed(2)})`}
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
                  <span className="text-lg">PAYTABLE RATES</span>
                </div>
              </PixelButton>
            </div>

            {/* Vending slot footer design */}
            <div className="w-full mt-6 pt-4 border-t-2 border-[#5a5a72]/30 flex justify-between items-center px-4 md:px-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-6 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-8 h-1 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">vending slot</span>
              </div>

              <div className="flex-1 px-4 text-center">
                {lastResultText ? (
                  <div className="p-2 bg-[#1e5631] border-2 border-[#3fff6e] inline-block filter drop-shadow-[2px_2px_0px_#000]">
                    <p className="font-jersey text-md text-[#3fff6e] uppercase m-0 leading-none">
                      ★ {lastResultText} ★
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-[#111124] border-2 border-[#5a5a72] inline-block">
                    <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 leading-none">
                      {hasPaid ? 'SCRATCH WITH CURSOR' : 'VENDER IDLE'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-6 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-8 h-1.5 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">receipt cutter</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: MARQUEE PAYMENTS & SYSTEM FEED */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Operator mascot feedback console */}
          <div className="border-4 border-white bg-[#111111] p-4 flex flex-col items-center relative filter drop-shadow-[4px_4px_0px_#000000]">
            <h4 className="font-jersey text-[#ff9f00] text-xl uppercase mb-3 text-center w-full border-b-2 border-[#5a5a72]/30 pb-1">
              ★ TICKET INSTRUCTIONS ★
            </h4>
            
            <div className="flex items-center gap-4 w-full">
              <div className="scale-90 select-none">
                <PixelMascot mood={mascotMood} />
              </div>

              <div className="flex-1 bg-black border-2 border-[#ff9f00] p-3 relative text-left">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#ff9f00] border-b-8 border-b-transparent" />
                <p className="font-jersey text-sm text-white uppercase m-0 leading-tight">
                  "{mascotDialogue}"
                </p>
              </div>
            </div>
          </div>

          {/* Quick Paytable Marquee view */}
          <PixelPanel
            title="PAYTABLE SCHEMATIC"
            subtitle="Match 3 symbols to win payouts"
            headerAccent="gold"
          >
            <div className="space-y-3 font-jersey uppercase text-md">
              <div className="border-2 border-white/20 bg-black p-2 space-y-1">
                {Object.values(SCRATCH_SYMBOLS).map((sym) => {
                  const Icon = sym.icon;
                  return (
                    <div key={sym.id} className="flex justify-between items-center border-b border-white/10 py-1">
                      <div className="flex items-center gap-2">
                        <div className="scale-50 -mx-3">
                          <Icon />
                        </div>
                        <span className="text-white text-md tracking-wider">{sym.name}</span>
                      </div>
                      <span className="text-[#ff9f00] text-md font-bold">x{sym.multiplier} Payout</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-2 border-white/20 p-3 bg-[#111111] text-[#5a5a72] font-jersey uppercase text-[11px] leading-tight space-y-1">
                <h5 className="text-white text-xs m-0">COIN-OP RULES:</h5>
                <p className="m-0">1. Payout equals Price tier multiplied by matching symbol multiplier.</p>
                <p className="m-0">2. Scratch card foil must be fully cleared (or auto-completed) to claim coins.</p>
                <p className="m-0">3. Multiple wins on a single card are not cumulative; best trio applies.</p>
              </div>
            </div>
          </PixelPanel>

          {/* Scratch Live transaction log */}
          <div className="border-4 border-[#5a5a72] bg-[#f2ead3] p-4 text-black font-jersey uppercase relative filter drop-shadow-[4px_4px_0px_#000000] border-b-8">
            <h4 className="text-lg border-b border-black/20 pb-1 mb-2 text-center text-black/80">
              ⚡ SCRATCH HISTORY FEED
            </h4>
            <div className="space-y-1 text-xs max-h-44 overflow-y-auto font-mono text-black/80 leading-tight">
              {transactionLog
                .filter(tx => tx.source === 'scratch_card')
                .slice(0, 5)
                .map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center border-b border-black/5 pb-0.5">
                    <span>
                      {tx.type === 'CREDIT' ? 'PAYOUT ' : 'BET '}
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className={tx.type === 'CREDIT' ? 'text-[#1e5631] font-bold' : 'text-red-700'}>
                      {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              {transactionLog.filter(tx => tx.source === 'scratch_card').length === 0 && (
                <p className="text-center text-black/50 py-3">NO RECENT SCRATCHES RECORDED</p>
              )}
            </div>
            <div className="border-t border-black/20 mt-3 pt-1.5 text-center text-[10px] text-black/60">
              * TRANSACTION SOURCE: SCRATCH_CARD *
            </div>
          </div>

        </div>
      </div>

      {/* Probability Modal */}
      {showPaytableModal && (
        <div className="fixed inset-0 z-50 bg-[#0d0d1a]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border-4 border-[#ff9f00] bg-[#1a1a2e] p-6 relative filter drop-shadow-[6px_6px_0px_#000000]">
            
            <div className="flex justify-between items-center border-b-3 border-[#ff9f00] pb-3 mb-4">
              <h3 className="font-jersey text-2xl text-[#ff9f00] m-0 uppercase">
                ★ CERTIFIED SCRATCH PROBABILITIES ★
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
              <p className="font-jersey text-md text-white/80 uppercase m-0">
                Detailed Return-to-Player (RTP) payout breakdown per 1,000,000 tickets printed:
              </p>

              <div className="border-2 border-[#5a5a72] p-4 bg-[#0d0d1a] space-y-2 font-jersey text-xs text-white/80 uppercase">
                <div className="flex justify-between border-b border-[#5a5a72]/30 pb-1 text-[#5a5a72]">
                  <span>SYMBOL MATCH</span>
                  <span>RATES</span>
                  <span>RTP VALUE</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#ff9f00]">GOLDEN 7 (x100)</span>
                  <span>0.34% chance</span>
                  <span className="font-mono text-[#3ff7ff]">34.00% RTP</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#ff9f00]">GOLD BAR (x20)</span>
                  <span>0.30% chance</span>
                  <span className="font-mono text-[#3ff7ff]">6.00% RTP</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#3ff7ff]">DIAMOND (x10)</span>
                  <span>0.60% chance</span>
                  <span className="font-mono text-[#3ff7ff]">6.00% RTP</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#ff9f00]">BELL (x5)</span>
                  <span>2.00% chance</span>
                  <span className="font-mono text-[#3ff7ff]">10.00% RTP</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#3fff6e]">CLOVER (x3)</span>
                  <span>4.00% chance</span>
                  <span className="font-mono text-[#3ff7ff]">12.00% RTP</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#ff3f3f]">CHERRY (x2)</span>
                  <span>6.00% chance</span>
                  <span className="font-mono text-[#3ff7ff]">12.00% RTP</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#ff9f00]">LUCKY COIN (x1)</span>
                  <span>12.00% chance</span>
                  <span className="font-mono text-[#3ff7ff]">12.00% RTP</span>
                </div>
                <div className="flex justify-between text-[#5a5a72] pt-1">
                  <span>LOSS (x0)</span>
                  <span>74.76% chance</span>
                  <span className="font-mono">0.00% RTP</span>
                </div>
              </div>

              <div className="p-3 border-2 border-[#3fff6e] bg-[#3fff6e]/10 text-[#3fff6e] font-jersey text-center uppercase text-md">
                ★ FIXED TOTAL RETURN-TO-PLAYER PROBABILITY: 92.00% ★
              </div>

              <div className="text-center pt-2">
                <PixelButton
                  variant="cyan"
                  className="px-8"
                  onClick={() => {
                    audio.playClick();
                    setShowPaytableModal(false);
                  }}
                >
                  CONFIRM COMPLIANCE RULES
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
