/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelCard, PixelMascot } from './PixelUI';
import { ArrowLeft, Gamepad2, HelpCircle, Coins, Sparkles, RotateCcw } from 'lucide-react';
import { audio } from '../lib/audio';

// ==========================================
// 8-BIT WHEEL MULTIPLIERS & SLICES SPEC
// ==========================================

interface WheelSlice {
  index: number;
  multiplier: number;
  label: string;
  color: string;
  textColor: string;
}

// 16 Slices symmetrically distributed on the wheel
const WHEEL_SLICES: WheelSlice[] = [
  { index: 0, multiplier: 10, label: '10x', color: '#ff9f00', textColor: '#0d0d1a' },  // Gold
  { index: 1, multiplier: 0, label: '0x', color: '#000000', textColor: '#e8e8e8' },   // Black
  { index: 2, multiplier: 1, label: '1x', color: '#ffffff', textColor: '#000000' },   // White
  { index: 3, multiplier: 0.5, label: '0.5x', color: '#111111', textColor: '#888888' }, // Dark Gray
  { index: 4, multiplier: 2, label: '2x', color: '#ff9f00', textColor: '#0d0d1a' },   // Gold
  { index: 5, multiplier: 0, label: '0x', color: '#000000', textColor: '#e8e8e8' },   // Black
  { index: 6, multiplier: 1, label: '1x', color: '#ffffff', textColor: '#000000' },   // White
  { index: 7, multiplier: 5, label: '5x', color: '#ff9f00', textColor: '#0d0d1a' },   // Gold
  { index: 8, multiplier: 0, label: '0x', color: '#000000', textColor: '#e8e8e8' },   // Black
  { index: 9, multiplier: 0.5, label: '0.5x', color: '#111111', textColor: '#888888' }, // Dark Gray
  { index: 10, multiplier: 2, label: '2x', color: '#ff9f00', textColor: '#0d0d1a' },  // Gold
  { index: 11, multiplier: 0, label: '0x', color: '#000000', textColor: '#e8e8e8' },  // Black
  { index: 12, multiplier: 1, label: '1x', color: '#ffffff', textColor: '#000000' },  // White
  { index: 13, multiplier: 0.5, label: '0.5x', color: '#111111', textColor: '#888888' }, // Dark Gray
  { index: 14, multiplier: 2, label: '2x', color: '#ff9f00', textColor: '#0d0d1a' },  // Gold
  { index: 15, multiplier: 0, label: '0x', color: '#000000', textColor: '#e8e8e8' }   // Black
];

// ==========================================
// TARGET RTP AND PROBABILITY ENGINE (92% RTP)
// ==========================================
/**
 * RETURN-TO-PLAYER (RTP) MATHEMATICAL SPECIFICATION:
 * Target RTP is strictly configured at 92.0%, identical to slots.
 * House edge is exactly 8.0%.
 * 
 * --- WEIGHTED PROBABILITY DISTRIBUTION ---
 * - 10x multiplier: P = 2.0%  => contribution = 0.02 * 10  = 0.20
 * - 5x multiplier : P = 5.0%  => contribution = 0.05 * 5   = 0.25
 * - 2x multiplier : P = 12.0% => contribution = 0.12 * 2   = 0.24
 * - 1x multiplier : P = 18.0% => contribution = 0.18 * 1   = 0.18
 * - 0.5x multiplier: P = 10.0% => contribution = 0.10 * 0.5 = 0.05
 * - 0x multiplier : P = 53.0% => contribution = 0.53 * 0   = 0.00
 * 
 * Total Theoretical RTP = 0.20 + 0.25 + 0.24 + 0.18 + 0.05 = 0.92 (92.0%)
 */
const TARGET_RTP_MULTIPLIERS = [
  { mult: 10, prob: 0.02 },
  { mult: 5, prob: 0.05 },
  { mult: 2, prob: 0.12 },
  { mult: 1, prob: 0.18 },
  { mult: 0.5, prob: 0.10 },
  { mult: 0, prob: 0.53 }
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const WheelScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { profile, setRoute, adjustBalance, triggerToast, transactionLog } = useStore();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [showPaytableModal, setShowPaytableModal] = useState<boolean>(false);
  const [mascotDialogue, setMascotDialogue] = useState<string>("WELCOME TO THE WHEEL OF FORTUNE! MAKE YOUR BET!");
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'deal'>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const particleIdCounter = useRef<number>(0);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update particles animation loop
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
            vy: p.vy + 0.4, // gravity effect
          }))
          .filter((p) => p.y < 600 && p.x > -50 && p.x < 1000); // keep in viewport bounds
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

  // Create simple square pixel particles for a big win
  const triggerCoinShower = () => {
    const newParticles: Particle[] = [];
    const colors = ['#ff9f00', '#3fff6e', '#ff3f3f', '#ffef99', '#ffffff'];
    
    // Spawn 64 particles from the center/top area
    for (let i = 0; i < 64; i++) {
      newParticles.push({
        id: particleIdCounter.current++,
        x: 250 + (Math.random() * 100 - 50), // center on wheel
        y: 200 + (Math.random() * 100 - 50),
        vx: (Math.random() * 14 - 7),
        vy: (Math.random() * -12 - 4), // upwards force
        size: Math.floor(Math.random() * 4) + 6, // chunky pixels
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    if (profile.chips < betAmount) {
      triggerToast('INSUFFICIENT BALANCE! CLAIM FREE BONUS CHIPS.', 'error');
      setMascotDialogue("GARRR! THOU LACKEST THE COMP COINS TO SPIN!");
      setMascotMood('idle');
      return;
    }

    // Reset results
    setLastWin(null);
    setScreenFlash(false);
    setIsSpinning(true);
    setMascotMood('deal');
    setMascotDialogue("THE WHEEL SPINNETH! ROUND AND ROUND...");

    // Deduct bet amount
    const deductSuccess = await adjustBalance(-betAmount, 'wheel_of_fortune');
    if (!deductSuccess) {
      setIsSpinning(false);
      return;
    }

    // Mathematical spin roll based on 92% RTP distribution
    const roll = Math.random();
    let winningMultiplier = 0;

    if (roll < 0.02) {
      winningMultiplier = 10;
    } else if (roll < 0.07) {
      winningMultiplier = 5;
    } else if (roll < 0.19) {
      winningMultiplier = 2;
    } else if (roll < 0.37) {
      winningMultiplier = 1;
    } else if (roll < 0.47) {
      winningMultiplier = 0.5;
    } else {
      winningMultiplier = 0;
    }

    // Find all matching slices on our physical 16-slice wheel layout
    const matchingSlices = WHEEL_SLICES.filter(s => s.multiplier === winningMultiplier);
    // Pick one at random to land on
    const chosenSlice = matchingSlices[Math.floor(Math.random() * matchingSlices.length)];
    const targetSliceIndex = chosenSlice.index;

    // Calculations for smooth deceleration mapping to chunky rendering:
    // Wheel spins clockwise. To make slice `targetSliceIndex` land under the 12 o'clock pointer:
    // Final wheel rotation angle must be `360 - (targetSliceIndex * 22.5)`.
    // Let's add a small random peg offset of [-6, +6] degrees so it lands slightly off-center of the peg slice for realism!
    const sliceAngle = targetSliceIndex * 22.5;
    const randomOffset = (Math.random() * 12) - 6;
    const baseTargetAngle = 360 - sliceAngle + randomOffset;
    
    // We want 5-6 full spins
    const totalSpins = 6;
    const targetAngle = (totalSpins * 360) + baseTargetAngle;

    const startAngle = currentAngle % 360;
    
    // Total steps for low framerate chunky motion (DESIGN.md: 8-12fps feel)
    const totalSteps = 36; 
    const stepDurationMs = 80; // ~12.5 fps
    let currentStep = 0;
    let prevAngle = startAngle;

    const spinInterval = setInterval(() => {
      currentStep++;
      
      // Decelerating curve: Quadratic ease-out formula
      const t = currentStep / totalSteps;
      const progress = 1 - Math.pow(1 - t, 2.8); // 2.8 power for strong friction feel
      const rawAngle = startAngle + (targetAngle - startAngle) * progress;

      // Snapping rendered angle to a multiple of 4.5 degrees for authentic "pixelated stepped motion"
      const snappedAngle = Math.round(rawAngle / 4.5) * 4.5;
      setCurrentAngle(snappedAngle);

      // Play peg ticking sound whenever the angle crosses a peg threshold (pegs are placed every 22.5 degrees)
      const prevPegCount = Math.floor((prevAngle + 11.25) / 22.5);
      const currPegCount = Math.floor((snappedAngle + 11.25) / 22.5);
      if (currPegCount > prevPegCount) {
        audio.playClick();
      }

      prevAngle = snappedAngle;

      if (currentStep >= totalSteps) {
        clearInterval(spinInterval);
        
        // Finalize state exactly
        setCurrentAngle(targetAngle);
        setIsSpinning(false);

        // Apply reward payout
        if (winningMultiplier > 0) {
          const payoutAmount = Number((betAmount * winningMultiplier).toFixed(2));
          adjustBalance(payoutAmount, 'wheel_of_fortune');
          setLastWin(payoutAmount);

          // Big visual payoff for high multipliers (5x or 10x)
          if (winningMultiplier >= 5) {
            audio.playJackpot();
            setScreenFlash(true);
            triggerCoinShower();
            setMascotMood('happy');
            setMascotDialogue(`HUGE WIN!!! MULTIPLIER x${winningMultiplier} AWARDED $${payoutAmount.toFixed(2)} COINS!`);
            triggerToast(`★ MEGA WIN! x${winningMultiplier} MULTIPLIER PAID $${payoutAmount.toFixed(2)} ★`, 'success');
            
            // Turn off screen flash after 350ms
            setTimeout(() => setScreenFlash(false), 350);
          } else {
            audio.playWin();
            setMascotMood('happy');
            setMascotDialogue(`NICE SPIN! YOU WON $${payoutAmount.toFixed(2)} COINS!`);
            triggerToast(`WINNER! x${winningMultiplier} MULTIPLIER PAID $${payoutAmount.toFixed(2)}`, 'success');
          }
        } else {
          audio.playLoss();
          setMascotMood('idle');
          setMascotDialogue("0x MULTIPLIER! NO PAYOUT. BETTER LUCK NEXT SPIN!");
          triggerToast('0x LANDED! TRY AGAIN!', 'info');
        }
      }
    }, stepDurationMs);
  };

  return (
    <div className="space-y-6">
      
      {/* Screen flash effect wrapper */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-[#ff9f00]/30 pointer-events-none mix-blend-overlay animate-pulse" />
      )}

      {/* 1. Header Signboard */}
      <div className="border-4 border-[#ff9f00] bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div>
          <h1 className="text-3xl font-jersey text-[#ff9f00] uppercase m-0 leading-none">
            ★ WHEEL OF FORTUNE CABINET ★
          </h1>
          <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 mt-1">
            Stepped deceleration spinner • Traditional multiplier distribution
          </p>
        </div>
        <div className="flex gap-2">
          <PixelButton variant="dark" onClick={onBack || (() => setRoute('lobby'))} chamfer={6}>
            <div className="flex items-center gap-1 text-sm py-0.5">
              <ArrowLeft className="w-4 h-4" />
              <span>{onBack ? "EXIT TO CABINETS" : "EXIT TO CONCOURSE"}</span>
            </div>
          </PixelButton>
        </div>
      </div>

      {/* 2. Main Floor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">         {/* LEFT COMPARTMENT: SPINNING WHEEL STAGE */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Cabinet Frame casing */}
          <div className="relative w-full max-w-2xl border-4 border-[#7a4b28] bg-black p-4 md:p-6 filter drop-shadow-[8px_8px_0px_#000000] border-b-16 rounded-none flex flex-col items-center overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-35 pixel-checker pointer-events-none" />
            
            {/* Wooden Side panels decoration */}
            <div className="absolute -left-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-r-2 border-black" />
            <div className="absolute -right-3 top-0 bottom-0 w-3 bg-[#7a4b28] border-l-2 border-black" />

            {/* Glowing neon marquee banner */}
            <div className="w-full border-4 border-[#ff9f00] bg-[#111111] p-3 text-center mb-6 relative overflow-hidden pixel-checker">
              <div className="flex justify-between items-center px-4">
                <span className="text-xl md:text-2xl text-[#ff9f00] animate-pulse">★</span>
                <span className="font-jersey text-2xl md:text-4xl text-[#ff9f00] tracking-widest uppercase leading-none drop-shadow-[2px_2px_0px_#ff9f00]">
                  CHUNKY WHEEL SPIN
                </span>
                <span className="text-xl md:text-2xl text-[#ff9f00] animate-pulse">★</span>
              </div>
            </div>

            {/* THE ACTUAL ROTATING SVG WHEEL ENGINE */}
            <div className="relative w-[320px] h-[340px] md:w-[420px] md:h-[440px] flex flex-col items-center justify-center bg-black border-4 border-[#ff9f00] p-4 filter drop-shadow-[4px_4px_0px_#000] overflow-hidden mb-6">
              
              {/* Scanline CRT simulation */}
              <div className="absolute inset-0 pointer-events-none crt-scanlines z-10 opacity-15" />

              {/* Particle shower overlay canvas */}
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

              {/* 12 o'clock pointer arrow index (stationary top peg indicator) */}
              <div className="absolute top-2 md:top-4 z-30 flex flex-col items-center">
                {/* Visual red notch */}
                <div className="w-8 h-8 bg-[#ff3f3f] border-2 border-[#e8e8e8] rotate-45 transform origin-center filter drop-shadow-[2px_2px_0px_#000000] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white opacity-65" />
                </div>
                {/* Little triangle pointing down */}
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-[#ff3f3f] -mt-1.5 filter drop-shadow-[0px_2px_0px_#000]" />
              </div>

              {/* SVG Main Circle wheel */}
              <div 
                className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] relative transition-transform duration-75 select-none"
                style={{ 
                  transform: `rotate(${currentAngle}deg)`,
                  imageRendering: 'pixelated'
                }}
              >
                <svg viewBox="0 0 400 400" className="w-full h-full" shapeRendering="crispEdges">
                  {/* Outer heavy board frame */}
                  <circle cx="200" cy="200" r="195" fill="#121224" stroke="#e8e8e8" strokeWidth="6" />
                  
                  {/* Alternating segments */}
                  {WHEEL_SLICES.map((slice) => {
                    const angleOffset = slice.index * 22.5;
                    return (
                      <g key={slice.index} transform={`rotate(${angleOffset}, 200, 200)`}>
                        {/* Slice background pie-path */}
                        <path 
                          d="M 200 200 L 164.88 23.46 A 180 180 0 0 1 235.12 23.46 Z" 
                          fill={slice.color} 
                          stroke="#121224" 
                          strokeWidth="2.5" 
                        />
                        
                        {/* Stepped Multiplier text label centered near rim */}
                        <text 
                          x="200" 
                          y="62" 
                          fill={slice.textColor} 
                          fontFamily="Jersey 25" 
                          fontSize="26" 
                          textAnchor="middle" 
                          fontWeight="bold"
                          transform="rotate(0, 200, 62)"
                        >
                          {slice.label}
                        </text>
                        
                        {/* Outer perimeter steel peg dot */}
                        <circle cx="200" cy="21" r="3" fill="#e8e8e8" stroke="#000" strokeWidth="1.5" />
                      </g>
                    );
                  })}

                  {/* Symmetrical Inner central plaque logo */}
                  <circle cx="200" cy="200" r="42" fill="#111111" stroke="#ff9f00" strokeWidth="4" />
                  <circle cx="200" cy="200" r="34" fill="#ff9f00" />
                  <text 
                    x="200" 
                    y="207" 
                    fill="#111111" 
                    fontFamily="Jersey 25" 
                    fontSize="22" 
                    textAnchor="middle" 
                    fontWeight="bold"
                  >
                    ★ 8BIT ★
                  </text>
                </svg>
              </div>
            </div>

            {/* BET REGULATORS AND VALUE READOUTS */}
            <div className="w-full border-4 border-[#5a5a72] bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex flex-col text-left">
                <span className="font-jersey text-lg text-[#ff9f00] uppercase leading-none">
                  SELECT CREDIT BET:
                </span>
                <span className="font-jersey text-[11px] text-[#5a5a72] uppercase mt-0.5">
                  Min $1.00 • Max $100.00 play credits
                </span>
              </div>

              {/* Value modification buttons */}
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

              {/* Presets selectors list */}
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

            {/* ACTION TRIGGERS ROW */}
            <div className="w-full flex gap-4">
              <PixelButton
                variant="gold"
                disabled={isSpinning}
                onClick={handleSpin}
                className="flex-1"
                soundType="click"
              >
                <div className="flex items-center justify-center gap-2 py-1">
                  <Gamepad2 className="w-5 h-5 text-white" />
                  <span className="text-2xl tracking-widest uppercase">
                    {isSpinning ? 'SPINNING WHEEL...' : 'SPIN THE WHEEL'}
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
                  <span className="text-lg">PROBABILITIES</span>
                </div>
              </PixelButton>
            </div>

            {/* Coin slots indicators footer */}
            <div className="w-full mt-6 pt-4 border-t-2 border-[#5a5a72]/30 flex justify-between items-center px-4 md:px-8">
              <div className="flex flex-col items-center">
                <div className="w-4 h-10 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-6 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">insert comp token</span>
              </div>

              <div className="flex-1 px-4 text-center">
                {lastWin !== null ? (
                  <div className="p-2 bg-[#1e5631] border-2 border-[#3fff6e] inline-block filter drop-shadow-[2px_2px_0px_#000] animate-bounce">
                    <p className="font-jersey text-lg text-[#3fff6e] uppercase m-0 leading-none">
                      ★ PAYOUT +${lastWin.toFixed(2)} ★
                    </p>
                  </div>
                ) : (
                  <div className="p-2 bg-[#111111] border-2 border-[#5a5a72] inline-block">
                    <p className="font-jersey text-lg text-[#5a5a72] uppercase m-0 leading-none">
                      STATUS: {isSpinning ? 'ROLLING...' : 'PLACE BET'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-10 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-6 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1">spin triggers</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COMPARTMENT: ROBOT MONITOR & PRINTED RECEIPT TRANSACTIONS LOGS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Mascot Console Card */}
          <div className="border-4 border-[#ff9f00]/60 bg-[#111111] p-4 flex flex-col items-center relative filter drop-shadow-[4px_4px_0px_#000000]">
            <h4 className="font-jersey text-[#ff9f00] text-xl uppercase mb-3 text-center w-full border-b-2 border-[#5a5a72]/30 pb-1">
              ★ CABINET CONCIERGE ★
            </h4>
            
            <div className="flex items-center gap-4 w-full">
              <div className="scale-90 select-none">
                <PixelMascot mood={mascotMood} />
              </div>
              
              {/* Chat bubble */}
              <div className="flex-1 bg-black border-2 border-[#ff9f00] p-3 relative text-left">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#ff9f00] border-b-8 border-b-transparent" />
                <p className="font-jersey text-sm text-white uppercase m-0 leading-tight">
                  "{mascotDialogue}"
                </p>
              </div>
            </div>
          </div>
 
          {/* 2. Micro Rules board */}
          <PixelPanel
            title="WHEEL CONFIG SCHEMATIC"
            subtitle="Symmetric 16-Segment Division"
            headerAccent="gold"
          >
            <div className="space-y-4">
              <div className="border-2 border-[#5a5a72] p-3 bg-black space-y-2 font-jersey text-white text-md uppercase">
                <p className="leading-tight m-0 text-[#ff9f00]">
                  ★ 10x SEGMENT: 1 Slice (Gold)
                </p>
                <p className="leading-tight m-0 text-white">
                  ★ 5x SEGMENT: 1 Slice (White)
                </p>
                <p className="leading-tight m-0 text-[#ff9f00]">
                  ★ 2x SEGMENT: 3 Slices (Gold)
                </p>
                <p className="leading-tight m-0 text-white">
                  ★ 1x SEGMENT: 3 Slices (White)
                </p>
                <p className="leading-tight m-0 text-[#5a5a72]">
                  ★ 0.5x SEGMENT: 3 Slices (Slate Gray)
                </p>
                <p className="leading-tight m-0 text-white opacity-40">
                  ★ 0x SEGMENT: 5 Slices (Black)
                </p>
              </div>

              <div className="border-2 border-[#5a5a72] p-3 bg-black text-[#5a5a72] font-jersey uppercase text-[11px] leading-tight space-y-1">
                <h5 className="text-white text-xs m-0">SPINNING CABINET RULES:</h5>
                <p className="m-0">1. Select your target credit bet with adjustments panel.</p>
                <p className="m-0">2. Draw gold spin trigger to ignite the stepped deceleration physics.</p>
                <p className="m-0">3. Multiple clicks crossing pegs emit high-fidelity retro ticks.</p>
                <p className="m-0">4. Final multiplier is mathematically locked to a play-credits distribution weight.</p>
              </div>
            </div>
          </PixelPanel>

          {/* 3. printed Live Receipt Transactions ledger */}
          <div className="border-4 border-[#5a5a72] bg-[#f2ead3] p-4 text-black font-jersey uppercase relative filter drop-shadow-[4px_4px_0px_#000000] border-b-8">
            <h4 className="text-lg border-b border-black/20 pb-1 mb-2 text-center text-black/80">
              ⚡ WHEEL TRANSACTION LEDGER
            </h4>
            <div className="space-y-1 text-xs max-h-44 overflow-y-auto font-mono text-black/80 leading-tight">
              {transactionLog
                .filter(tx => tx.source === 'wheel_of_fortune')
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
              {transactionLog.filter(tx => tx.source === 'wheel_of_fortune').length === 0 && (
                <p className="text-center text-black/50 py-3">NO RECENT SPINS ON RECORD</p>
              )}
            </div>
            <div className="border-t border-black/20 mt-3 pt-1.5 text-center text-[10px] text-black/60">
              * TRANSACTION SOURCE: WHEEL_OF_FORTUNE *
            </div>
          </div>

        </div>
      </div>

      {/* 3. Detailed Paytable Probabilities Modal */}
      {showPaytableModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border-4 border-[#ff9f00] bg-[#111111] p-6 relative filter drop-shadow-[6px_6px_0px_#000000]">
            
            <div className="flex justify-between items-center border-b-3 border-[#ff9f00] pb-3 mb-4">
              <h3 className="font-jersey text-2xl text-[#ff9f00] m-0 uppercase">
                ★ MULTIPLIER OUTCOMES ★
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
                The Wheel mathematical distributions are strictly configured to maintain fun and excitement:
              </p>

              <div className="border-2 border-[#5a5a72] p-4 bg-black space-y-3 font-jersey uppercase text-white">
                <div className="flex justify-between border-b border-[#5a5a72]/30 pb-1 text-xs text-[#5a5a72]">
                  <span>MULTIPLIER</span>
                  <span>PROBABILITY</span>
                  <span>RTP CONTRIBUTION</span>
                </div>
                {TARGET_RTP_MULTIPLIERS.map((m) => {
                  const percent = (m.prob * 100).toFixed(1);
                  const contr = (m.mult * m.prob * 100).toFixed(1);
                  return (
                    <div key={m.mult} className="flex justify-between items-center border-b border-[#5a5a72]/15 pb-1 last:border-0 last:pb-0">
                      <span className="text-lg font-bold" style={{ color: m.mult === 10 ? '#ff9f00' : m.mult === 5 ? '#3fff6e' : m.mult === 2 ? '#ff9f00' : m.mult === 1 ? '#ffffff' : m.mult === 0.5 ? '#5a5a72' : '#ffffff' }}>
                        {m.mult}x
                      </span>
                      <span className="text-md font-mono text-white/95">
                        {percent}%
                      </span>
                      <span className="text-md text-[#ff9f00]">
                        {contr}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Verified RTP certificate */}
              <div className="p-3 border-2 border-[#3fff6e] bg-[#3fff6e]/10 text-[#3fff6e] font-jersey text-center uppercase text-md">
                ★ AUDITED FOR BALANCED PLAY WINNERS ★
              </div>

              <div className="flex justify-center pt-2">
                <PixelButton
                  variant="gold"
                  className="px-8"
                  onClick={() => {
                    audio.playClick();
                    setShowPaytableModal(false);
                  }}
                >
                  CONFIRM SCHEMATICS
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
