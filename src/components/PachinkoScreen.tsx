/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelMascot } from './PixelUI';
import { ArrowLeft, Play, HelpCircle, Trophy, Landmark, Sparkles } from 'lucide-react';
import { audio } from '../lib/audio';

// ==========================================
// 8-BIT PLATFORM PACHINKO MULTIPLIERS SPEC
// 92.0% RTP CALIBRATED (Binomial N=8 rows)
// ==========================================

const PACHINKO_SLOTS = [
  { index: 0, mult: 20.0, color: '#ff3f8e', name: 'JACKPOT' },
  { index: 1, mult: 4.0, color: '#ffffff', name: 'MEGA' },
  { index: 2, mult: 1.3, color: '#ff3f8e', name: 'MINI' },
  { index: 3, mult: 0.4, color: '#5a5a72', name: 'MUTED' },
  { index: 4, mult: 0.2, color: '#000000', name: 'SAVED' },
  { index: 5, mult: 0.4, color: '#5a5a72', name: 'MUTED' },
  { index: 6, mult: 1.3, color: '#ff3f8e', name: 'MINI' },
  { index: 7, mult: 4.0, color: '#ffffff', name: 'MEGA' },
  { index: 8, mult: 20.0, color: '#ff3f8e', name: 'JACKPOT' },
];

interface FallingBall {
  id: number;
  bet: number;
  currentStep: number; // 0 to 8
  col: number;        // horizontal grid position (0 to step)
  x: number;          // visual pixels X
  y: number;          // visual pixels Y
  prevX: number;
  prevY: number;
  animTimer: number;  // progress inside current bounce (0 to 1)
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

// Custom 8-bit Synthesizer for lag-free retro sounds routed through global audio engine
const synthSound = {
  ping: (pitchMultiplier = 1) => {
    audio.playBeep(440 * pitchMultiplier, 440 * pitchMultiplier, 0.12, 'triangle');
  },
  landWin: (tier: 'low' | 'high' | 'jackpot') => {
    if (tier === 'jackpot') {
      audio.playWinJackpot();
    } else if (tier === 'high') {
      audio.playWinMedium();
    } else {
      audio.playWinSmall();
    }
  },
  landLoss: () => {
    audio.playLoss();
  }
};

export const PachinkoScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog } = useStore();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [activeBalls, setActiveBalls] = useState<FallingBall[]>([]);
  const [recentPayouts, setRecentPayouts] = useState<{ id: number; amt: number; mult: number }[]>([]);

  // Board Constants (Width x Height)
  const BOARD_WIDTH = 380;
  const BOARD_HEIGHT = 440;
  const ROW_COUNT = 8; // Number of peg rows
  const PEG_RADIUS = 3;
  const BALL_RADIUS = 5.5;

  const [particles, setParticles] = useState<Particle[]>([]);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [mascotDialogue, setMascotDialogue] = useState<string>("DROP COINS INTO THE PINBOARD AND STREAM MULTIPLIER REWARDS!");
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'deal'>('idle');

  const animationFrameRef = useRef<number | null>(null);
  const particleIdCounter = useRef<number>(0);
  const ballIdCounter = useRef<number>(0);

  // Layout calculations
  const startY = 40;
  const rowHeight = (BOARD_HEIGHT - startY - 50) / ROW_COUNT;

  // Peg position mapper
  const getPegPositions = () => {
    const pegs: { x: number; y: number }[] = [];
    for (let r = 0; r < ROW_COUNT; r++) {
      const pegsInRow = r + 3; // Row 0 has 3 pegs, Row 1 has 4...
      const y = startY + r * rowHeight;
      const rowWidth = (pegsInRow - 1) * 32;
      const startX = (BOARD_WIDTH - rowWidth) / 2;
      for (let p = 0; p < pegsInRow; p++) {
        pegs.push({ x: startX + p * 32, y });
      }
    }
    return pegs;
  };

  const pegs = getPegPositions();

  // Mapping ball coordinates
  const getBallVisualPos = (step: number, col: number) => {
    if (step === 0) {
      return { x: BOARD_WIDTH / 2, y: 15 };
    }
    // Interpolate row visually centered
    const pegsInRowAbove = step + 2; // Row step-1 has step+2 pegs
    const rowAboveWidth = (pegsInRowAbove - 1) * 32;
    const startXAbove = (BOARD_WIDTH - rowAboveWidth) / 2;

    // The ball fits directly between pegs at index 'col' and 'col + 1'
    const x = startXAbove + col * 32 + 16;
    const y = startY + (step - 1) * rowHeight + rowHeight / 2;
    return { x, y };
  };

  const getSlotVisualPos = (slotIndex: number) => {
    const slotWidth = BOARD_WIDTH / 9;
    const x = slotIndex * slotWidth + slotWidth / 2;
    const y = BOARD_HEIGHT - 12;
    return { x, y };
  };

  // Launch a new plinko coin
  const handleDropBall = async () => {
    if (profile.chips < betAmount) {
      triggerToast('INSUFFICIENT BALANCE FOR PLINKO COIN DROP!', 'error');
      setMascotDialogue("GARRR! CHIPS LACKING FOR THIS PLINKO DROP!");
      setMascotMood('idle');
      return;
    }

    // Deduct cost
    const deductSuccess = await adjustBalance(-betAmount, 'pachinko');
    if (!deductSuccess) return;

    audio.playCoin();
    synthSound.ping(1.5);

    // Create new ball
    const startPos = getBallVisualPos(0, 0);
    const newBall: FallingBall = {
      id: ballIdCounter.current++,
      bet: betAmount,
      currentStep: 0,
      col: 0,
      x: startPos.x,
      y: startPos.y,
      prevX: startPos.x,
      prevY: startPos.y,
      animTimer: 0
    };

    setActiveBalls(prev => [...prev, newBall]);
    setMascotDialogue("BALL LAUNCHED! SHE BOUNCES THROUGH THE GATES...");
    setMascotMood('deal');
  };

  // Main physics/movement update cycle (stepped discrete animation, ~10fps chunks)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBalls(prev => {
        if (prev.length === 0) return prev;

        const nextBalls: FallingBall[] = [];

        prev.forEach(ball => {
          let { currentStep, col, animTimer } = ball;
          
          // Advance simulation
          animTimer += 0.25; // discrete 4-step transition per peg tier

          if (animTimer >= 1.0) {
            animTimer = 0;
            currentStep += 1;
            
            if (currentStep <= ROW_COUNT) {
              // Decide direction (50% left, 50% right)
              const goesRight = Math.random() < 0.5;
              if (goesRight) {
                col += 1;
              }
              // Sound trigger for hitting a peg
              const pitch = 0.6 + (currentStep * 0.1); // higher pitch as it drops
              synthSound.ping(pitch);
            }
          }

          // Calculate visual positions
          let prevPos = { x: ball.x, y: ball.y };
          let nextPos = { x: ball.x, y: ball.y };

          if (currentStep === 0) {
            nextPos = getBallVisualPos(0, 0);
          } else if (currentStep <= ROW_COUNT) {
            nextPos = getBallVisualPos(currentStep, col);
          } else {
            // Reached slot base
            nextPos = getSlotVisualPos(col);
          }

          // Bounce parabolic curve interpolation
          const curX = prevPos.x + (nextPos.x - prevPos.x) * animTimer;
          // Add discrete bounce arc jump
          const bounceOffset = Math.sin(animTimer * Math.PI) * -12;
          const curY = prevPos.y + (nextPos.y - prevPos.y) * animTimer + (currentStep <= ROW_COUNT ? bounceOffset : 0);

          if (currentStep > ROW_COUNT) {
            // Ball completed/landed!
            resolveBallLanding(ball.bet, col);
          } else {
            nextBalls.push({
              ...ball,
              currentStep,
              col,
              animTimer,
              prevX: prevPos.x,
              prevY: prevPos.y,
              x: curX,
              y: curY
            });
          }
        });

        return nextBalls;
      });
    }, 55); // high visual speed stepped sequence

    return () => clearInterval(interval);
  }, []);

  // Handle slot resolution
  const resolveBallLanding = async (bet: number, slotCol: number) => {
    const slot = PACHINKO_SLOTS[slotCol] || PACHINKO_SLOTS[4];
    const payout = Number((bet * slot.mult).toFixed(2));

    const isWin = slot.mult >= 1.0;
    
    // Play correct 8bit sounds
    if (slot.mult >= 20.0) {
      synthSound.landWin('jackpot');
      audio.playJackpot();
      triggerJackpotShower();
    } else if (slot.mult >= 1.3) {
      synthSound.landWin('high');
      audio.playWin();
    } else if (slot.mult >= 0.4) {
      synthSound.landWin('low');
      audio.playClick();
    } else {
      synthSound.landLoss();
      audio.playLoss();
    }

    // Secure credit transaction log
    const payoutSuccess = await adjustBalance(payout, 'pachinko');
    if (payoutSuccess) {
      // Record recent payout card
      const item = { id: Date.now() + Math.random(), amt: payout, mult: slot.mult };
      setRecentPayouts(prev => [item, ...prev].slice(0, 4));

      if (slot.mult >= 4.0) {
        setMascotMood('happy');
        setMascotDialogue(`HUGE IMPACT! BALL DROPPED INTO x${slot.mult} SLOT! CREDITED +$${payout.toFixed(2)} CHIPS!`);
        triggerToast(`★ PLINKO IMPACT x${slot.mult}! PAID $${payout.toFixed(2)} ★`, 'success');
      } else {
        setMascotMood('idle');
        setMascotDialogue(`BALL LANDED IN x${slot.mult} SLOT. PAID +$${payout.toFixed(2)} COINS!`);
      }
    }
  };

  const triggerJackpotShower = () => {
    const newParticles: Particle[] = [];
    const colors = ['#ff9f00', '#ff3f8e', '#3ff7ff', '#3fff6e', '#ffffff'];
    for (let i = 0; i < 48; i++) {
      newParticles.push({
        id: particleIdCounter.current++,
        x: BOARD_WIDTH / 2 + (Math.random() * 80 - 40),
        y: BOARD_HEIGHT - 30,
        vx: (Math.random() * 12 - 6),
        vy: (Math.random() * -12 - 5),
        size: Math.floor(Math.random() * 3) + 6,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Particles animator
  useEffect(() => {
    if (particles.length === 0) return;
    let active = true;

    const loop = () => {
      if (!active) return;
      setParticles(prev => {
        const next = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.45
          }))
          .filter(p => p.y < BOARD_HEIGHT + 50 && p.x > -50 && p.x < BOARD_WIDTH + 50);
        if (next.length > 0) {
          animationFrameRef.current = requestAnimationFrame(loop);
        }
        return next;
      });
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
    };
  }, [particles.length]);

  return (
    <div className="space-y-6">

      {/* 1. Cabinet Header */}
      <div className="border-4 border-[#ff3f8e] bg-[#1a1a2e] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div>
          <h1 className="text-3xl font-jersey text-[#ff9f00] uppercase m-0 leading-none">
            ★ 8-BIT PLINKO COIN DROP CABINET ★
          </h1>
          <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 mt-1">
            Stepped physics cascades • Multiple ball queues • 92.0% Return-to-Player certified
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

      {/* 2. Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SECTOR: THE BOARD PORTAL */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="relative w-full max-w-2xl border-4 border-[#7a4b28] bg-[#0d0d1a] p-4 md:p-6 filter drop-shadow-[8px_8px_0px_#000000] border-b-16 rounded-none flex flex-col items-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0d0d1a] opacity-35 pixel-checker pointer-events-none" />
            
            {/* Wooden trim */}
            <div className="absolute -left-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-r-2 border-[#1a1a2e]" />
            <div className="absolute -right-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-l-2 border-[#1a1a2e]" />

            {/* Marquee Header */}
            <div className="w-full border-4 border-[#ff9f00] bg-[#1a1a2e] p-3 text-center mb-6 relative overflow-hidden pixel-checker">
              <div className="flex justify-between items-center px-4">
                <span className="text-xl md:text-2xl text-[#3ff7ff] animate-pulse">◆</span>
                <span className="font-jersey text-2xl md:text-4xl text-[#3fff6e] tracking-widest uppercase leading-none drop-shadow-[2px_2px_0px_#ff9f00]">
                  PACHINKO CASCADE GATES
                </span>
                <span className="text-xl md:text-2xl text-[#3ff7ff] animate-pulse">◆</span>
              </div>
            </div>

            {/* PIN BOARD CANVAS BOX */}
            <div className="relative border-4 border-[#3ff7ff] bg-[#111124] filter drop-shadow-[4px_4px_0px_#000] overflow-hidden select-none mb-6">
              
              <div className="absolute inset-0 pointer-events-none crt-scanlines z-10 opacity-15" />

              <svg 
                width={BOARD_WIDTH} 
                height={BOARD_HEIGHT} 
                className="bg-[#111124] block"
                shapeRendering="crispEdges"
              >
                {/* Visual grid lines behind */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line 
                    key={i} 
                    x1={(BOARD_WIDTH / 9) * i} 
                    y1={BOARD_HEIGHT - 35} 
                    x2={(BOARD_WIDTH / 9) * i} 
                    y2={BOARD_HEIGHT} 
                    stroke="#5a5a72" 
                    strokeWidth="2" 
                    strokeDasharray="2,2"
                    opacity="0.35"
                  />
                ))}

                {/* Draw pegs */}
                {pegs.map((peg, idx) => (
                  <g key={idx}>
                    {/* Shadow offset */}
                    <rect 
                      x={peg.x - PEG_RADIUS + 1.5} 
                      y={peg.y - PEG_RADIUS + 1.5} 
                      width={PEG_RADIUS * 2} 
                      height={PEG_RADIUS * 2} 
                      fill="#000" 
                    />
                    {/* Retro off-white pixel peg */}
                    <rect 
                      x={peg.x - PEG_RADIUS} 
                      y={peg.y - PEG_RADIUS} 
                      width={PEG_RADIUS * 2} 
                      height={PEG_RADIUS * 2} 
                      fill="#e8e8e8" 
                    />
                  </g>
                ))}

                {/* Draw bottom bucket slot dividers & visual indicators */}
                {PACHINKO_SLOTS.map((slot) => {
                  const w = BOARD_WIDTH / 9;
                  const x = slot.index * w;
                  const y = BOARD_HEIGHT - 35;
                  
                  return (
                    <g key={slot.index}>
                      {/* Slot boundary outline */}
                      <rect 
                        x={x + 2} 
                        y={y + 2} 
                        width={w - 4} 
                        height={30} 
                        fill={slot.color} 
                        opacity="0.2" 
                      />
                      <rect 
                        x={x + 3} 
                        y={BOARD_HEIGHT - 10} 
                        width={w - 6} 
                        height={4} 
                        fill={slot.color} 
                      />
                    </g>
                  );
                })}

                {/* Draw active balls */}
                {activeBalls.map((ball) => (
                  <g key={ball.id}>
                    {/* Hard outline drop shadow */}
                    <rect 
                      x={ball.x - BALL_RADIUS + 2} 
                      y={ball.y - BALL_RADIUS + 2} 
                      width={BALL_RADIUS * 2} 
                      height={BALL_RADIUS * 2} 
                      fill="#000" 
                    />
                    {/* Arcade golden coin sprite ball */}
                    <rect 
                      x={ball.x - BALL_RADIUS} 
                      y={ball.y - BALL_RADIUS} 
                      width={BALL_RADIUS * 2} 
                      height={BALL_RADIUS * 2} 
                      fill="#ff9f00" 
                    />
                    {/* Inner highlight sparkle */}
                    <rect 
                      x={ball.x - BALL_RADIUS + 1.5} 
                      y={ball.y - BALL_RADIUS + 1.5} 
                      width="3" 
                      height="3" 
                      fill="#ffffff" 
                    />
                  </g>
                ))}

                {/* Particle shower */}
                {particles.map((p) => (
                  <rect
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    width={p.size}
                    height={p.size}
                    fill={p.color}
                    stroke="#000"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              {/* Bottom Multiplier text overlays (aligned perfectly with slot cols) */}
              <div className="absolute bottom-1.5 left-0 right-0 grid grid-cols-9 text-center font-jersey select-none text-[13px] md:text-sm tracking-tight leading-none pointer-events-none">
                {PACHINKO_SLOTS.map((slot) => (
                  <div key={slot.index} style={{ color: slot.color }} className="drop-shadow-[1.5px_1.5px_0px_#000000]">
                    {slot.mult}x
                  </div>
                ))}
              </div>
            </div>

            {/* BASE BET COIN CONTROL */}
            <div className="w-full border-4 border-[#5a5a72] bg-[#1a1a2e] p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              
              <div className="flex flex-col text-left">
                <span className="font-jersey text-lg text-[#3ff7ff] uppercase leading-none">
                  SELECT BALL PRICE DROP TIER:
                </span>
                <span className="font-jersey text-[11px] text-[#5a5a72] uppercase mt-0.5">
                  Drop multiple coins concurrently for massive screen cascades!
                </span>
              </div>

              <div className="flex items-center gap-3">
                <PixelButton
                  variant="red"
                  disabled={betAmount <= 1}
                  onClick={() => {
                    setBetAmount(prev => Math.max(1, prev - 5));
                  }}
                  chamfer={4}
                  className="px-2"
                >
                  <span className="text-sm px-1">-5</span>
                </PixelButton>

                <div className="border-2 border-[#e8e8e8] bg-[#0d0d1a] px-4 py-1.5 flex items-center justify-center min-w-28 text-center">
                  <span className="font-jersey text-2xl text-[#ff9f00] leading-none select-none">
                    ${betAmount.toFixed(2)}
                  </span>
                </div>

                <PixelButton
                  variant="green"
                  disabled={betAmount >= 100}
                  onClick={() => {
                    setBetAmount(prev => Math.min(100, prev + 5));
                  }}
                  chamfer={4}
                  className="px-2"
                >
                  <span className="text-sm px-1">+5</span>
                </PixelButton>
              </div>

              <div className="flex gap-1.5 flex-wrap justify-center">
                {[1, 5, 10, 25].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      audio.playClick();
                      setBetAmount(preset);
                    }}
                    className={`px-3 py-1 font-jersey text-lg cursor-pointer select-none transition-none border-2 ${
                      betAmount === preset
                        ? 'bg-[#ff9f00] text-black border-[#ff9f00]'
                        : 'bg-black text-white border-white/20 hover:border-[#ff9f00]'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="w-full flex flex-col md:flex-row gap-4">
              
              <PixelButton
                variant="green"
                onClick={handleDropBall}
                className="flex-1"
              >
                <div className="flex items-center justify-center gap-2 py-1 animate-pulse">
                  <Play className="w-5 h-5 text-black" fill="#000" />
                  <span className="text-2xl tracking-widest uppercase text-black font-bold">
                    DROP BALL (${betAmount.toFixed(2)})
                  </span>
                </div>
              </PixelButton>

              <PixelButton
                variant="gold"
                onClick={() => setShowRulesModal(true)}
                className="shrink-0"
              >
                <div className="flex items-center justify-center gap-1.5 py-1">
                  <HelpCircle className="w-5 h-5 text-black" />
                  <span className="text-lg">PROBABILITY MATRIX</span>
                </div>
              </PixelButton>
            </div>

            {/* Coin Slots layout footer design */}
            <div className="w-full mt-6 pt-4 border-t-2 border-[#5a5a72]/30 flex justify-between items-center px-4 md:px-8">
              <div className="flex flex-col items-center">
                <div className="w-4 h-10 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-6 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">hopper 1</span>
              </div>

              <div className="flex-1 px-4 text-center">
                {activeBalls.length > 0 ? (
                  <div className="p-2 bg-[#1e5631] border-2 border-[#3fff6e] inline-block filter drop-shadow-[2px_2px_0px_#000]">
                    <p className="font-jersey text-md text-[#3fff6e] uppercase m-0 leading-none">
                      ★ ACTIVE BALLS IN RUN: {activeBalls.length} ★
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-[#111124] border-2 border-[#5a5a72] inline-block">
                    <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 leading-none">
                      STATUS: WAITING TO DROP COIN
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-10 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-6 bg-[#3fff6e] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">hopper 2</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SECTOR: MASCOT CONSOLE & RECEIPT HISTORY */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Operator mascot feedback */}
          <div className="border-4 border-white bg-[#111111] p-4 flex flex-col items-center relative filter drop-shadow-[4px_4px_0px_#000000]">
            <h4 className="font-jersey text-[#ff9f00] text-xl uppercase mb-3 text-center w-full border-b-2 border-[#5a5a72]/30 pb-1">
              ★ CABINET ASSISTANT ★
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

          {/* Recent drops landing plaques */}
          <PixelPanel
            title="LATEST IMPACT REWARDS"
            subtitle="Ball landings feed logs"
            headerAccent="magenta"
          >
            <div className="space-y-2 font-jersey uppercase">
              {recentPayouts.map((row) => (
                <div 
                  key={row.id}
                  className="border-2 border-white/20 bg-black p-2 flex justify-between items-center"
                >
                  <span className="text-[#ff9f00]">COIN CASCADE LANDED</span>
                  <span className={row.mult >= 1.0 ? 'text-white font-bold' : 'text-[#5a5a72]'}>
                    {row.mult}x (${row.amt.toFixed(2)})
                  </span>
                </div>
              ))}
              {recentPayouts.length === 0 && (
                <p className="text-center text-[#5a5a72] py-4 text-sm">NO DROPS LANDED YET</p>
              )}
            </div>
          </PixelPanel>

          {/* printed Live Receipt Ledger */}
          <div className="border-4 border-[#5a5a72] bg-[#f2ead3] p-4 text-black font-jersey uppercase relative filter drop-shadow-[4px_4px_0px_#000000] border-b-8">
            <h4 className="text-lg border-b border-black/20 pb-1 mb-2 text-center text-black/80">
              ⚡ CASCADE COIN LEDGER
            </h4>
            <div className="space-y-1 text-xs max-h-44 overflow-y-auto font-mono text-black/80 leading-tight">
              {transactionLog
                .filter(tx => tx.source === 'pachinko')
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
              {transactionLog.filter(tx => tx.source === 'pachinko').length === 0 && (
                <p className="text-center text-black/50 py-3">NO RECENT CASCADE TRANSACTIONS</p>
              )}
            </div>
            <div className="border-t border-black/20 mt-3 pt-1.5 text-center text-[10px] text-black/60">
              * TRANSACTION SOURCE: PACHINKO *
            </div>
          </div>

        </div>
      </div>

      {/* Rules Probability Detailed Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-[#0d0d1a]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border-4 border-[#ff9f00] bg-[#1a1a2e] p-6 relative filter drop-shadow-[6px_6px_0px_#000000]">
            
            <div className="flex justify-between items-center border-b-3 border-[#ff9f00] pb-3 mb-4">
              <h3 className="font-jersey text-2xl text-[#ff9f00] m-0 uppercase">
                ★ PLINKO BINOMIAL MATRIX ★
              </h3>
              <button 
                onClick={() => {
                  audio.playClick();
                  setShowRulesModal(false);
                }}
                className="text-white hover:text-[#ff9f00] font-jersey text-2xl uppercase cursor-pointer"
              >
                [X] CLOSE
              </button>
            </div>

            <div className="space-y-4">
              <p className="font-jersey text-md text-white/80 uppercase m-0">
                Probability breakdown of an 8-row symmetric bouncing peg board (256 distinct paths):
              </p>

              <div className="border-2 border-white/20 p-4 bg-black space-y-2 font-jersey text-xs text-white/80 uppercase">
                <div className="flex justify-between border-b border-white/10 pb-1 text-[#5a5a72]">
                  <span>SLOT MULTIPLIER</span>
                  <span>PERMUTATIONS</span>
                  <span>EXACT CHANCE</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-white/10">
                  <span className="text-[#ff9f00] font-bold">EDGE JACKPOTS (20.0x)</span>
                  <span>2 / 256 paths</span>
                  <span className="font-mono text-[#ff9f00]">0.78% chance</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-white/10">
                  <span className="text-white font-bold">MEGA HIGH (4.0x)</span>
                  <span>16 / 256 paths</span>
                  <span className="font-mono text-white">6.25% chance</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#ff9f00]">MINI TIERS (1.3x)</span>
                  <span>56 / 256 paths</span>
                  <span className="font-mono text-[#ff9f00]">21.88% chance</span>
                </div>
                <div className="flex justify-between pb-0.5 border-b border-[#5a5a72]/10">
                  <span className="text-[#5a5a72]">MUTED SAVINGS (0.4x)</span>
                  <span>112 / 256 paths</span>
                  <span className="font-mono">43.75% chance</span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-[#5a5a72]">CENTER SAVED (0.2x)</span>
                  <span>70 / 256 paths</span>
                  <span className="font-mono">27.34% chance</span>
                </div>
              </div>

              {/* Dynamic rtp label */}
              <div className="p-3 border-2 border-[#ff9f00] bg-[#ff9f00]/10 text-[#ff9f00] font-jersey text-center uppercase text-md">
                ★ EXPECTED TOTAL RETURN-TO-PLAYER PROBABILITY: 92.03% ★
              </div>

              <div className="text-center pt-2">
                <PixelButton
                  variant="cyan"
                  className="px-8"
                  onClick={() => {
                    audio.playClick();
                    setShowRulesModal(false);
                  }}
                >
                  CONFIRM PLINKO PHYSICS LAWS
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
