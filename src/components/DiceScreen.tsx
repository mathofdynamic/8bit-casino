/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelCard, PixelMascot } from './PixelUI';
import { ArrowLeft, Gamepad2, HelpCircle, Trophy, Landmark, RotateCcw } from 'lucide-react';
import { audio } from '../lib/audio';

// ==========================================
// 8-BIT HIGH-LOW DICE OUTCOMES SPEC
// ==========================================

const DICE_OUTCOMES: Record<number, number> = {
  2: 1,  // (1,1)
  3: 2,  // (1,2), (2,1)
  4: 3,  // (1,3), (2,2), (3,1)
  5: 4,  // (1,4), (2,3), (3,2), (4,1)
  6: 5,  // (1,5), (2,4), (3,3), (4,2), (5,1)
  7: 6,  // (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)
  8: 5,  // (2,6), (3,5), (4,4), (5,3), (6,2)
  9: 4,  // (3,6), (4,5), (5,4), (6,3)
  10: 3, // (4,6), (5,5), (6,4)
  11: 2, // (5,6), (6,5)
  12: 1  // (6,6)
};

// Returns number of ways to roll a sum matching prediction vs baseline
const getOutcomesCount = (currentSum: number, prediction: 'HIGHER' | 'LOWER' | 'SAME'): number => {
  let count = 0;
  for (let sum = 2; sum <= 12; sum++) {
    const ways = DICE_OUTCOMES[sum];
    if (prediction === 'HIGHER' && sum > currentSum) {
      count += ways;
    } else if (prediction === 'LOWER' && sum < currentSum) {
      count += ways;
    } else if (prediction === 'SAME' && sum === currentSum) {
      count += ways;
    }
  }
  return count;
};

// Calculates dynamic multiplier based on target 92% RTP
const getDynamicMultiplier = (currentSum: number, prediction: 'HIGHER' | 'LOWER' | 'SAME'): number => {
  const ways = getOutcomesCount(currentSum, prediction);
  if (ways === 0) return 0;
  const targetRTP = 0.92;
  return Number(((targetRTP * 36) / ways).toFixed(3));
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

export const DiceScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast, transactionLog } = useStore();

  const [betAmount, setBetAmount] = useState<number>(10);
  const [currentSum, setCurrentSum] = useState<number>(7);
  const [die1, setDie1] = useState<number>(3);
  const [die2, setDie2] = useState<number>(4);

  const [prediction, setPrediction] = useState<'HIGHER' | 'LOWER' | 'SAME'>('HIGHER');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [lastResultText, setLastResultText] = useState<string | null>(null);

  // Double or Nothing Pyramid Chain State
  const [chainId, setChainId] = useState<number>(0); // 0 = inactive, 1 to 5 = active rounds
  const [initialChainBet, setInitialChainBet] = useState<number>(0);
  const [pendingWinnings, setPendingWinnings] = useState<number>(0);

  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [mascotDialogue, setMascotDialogue] = useState<string>("PREDICT IF THE NEXT TUMBLE IS HIGHER, LOWER OR SAME!");
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'deal'>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const particleIdCounter = useRef<number>(0);

  // Clean up animation frame
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

  const triggerCoinShower = () => {
    const newParticles: Particle[] = [];
    const colors = ['#ff9f00', '#3fff6e', '#ff3f3f', '#ffef99', '#ffffff'];
    for (let i = 0; i < 48; i++) {
      newParticles.push({
        id: particleIdCounter.current++,
        x: 250 + (Math.random() * 80 - 40),
        y: 200 + (Math.random() * 80 - 40),
        vx: (Math.random() * 12 - 6),
        vy: (Math.random() * -10 - 4),
        size: Math.floor(Math.random() * 3) + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  };

  // Perform a high-low prediction roll
  const handleRoll = async () => {
    if (isRolling) return;

    const currentBet = chainId > 0 ? pendingWinnings : betAmount;

    // Balance checks:
    if (chainId === 0 && profile.chips < currentBet) {
      triggerToast('INSUFFICIENT BALANCE FOR COIN BET!', 'error');
      setMascotDialogue("GARRR! THOU CANNOT BET THOSE CHIPS!");
      return;
    }

    setIsRolling(true);
    setMascotMood('deal');
    setMascotDialogue("THE DICE TUMBLE INSIDE THE BOX...");
    setLastResultText(null);

    // If starting a new chain (or standard single roll), deduct the initial bet
    if (chainId === 0) {
      setInitialChainBet(currentBet);
      const deductSuccess = await adjustBalance(-currentBet, 'highlow_dice');
      if (!deductSuccess) {
        setIsRolling(false);
        return;
      }
    }

    // Play rolling click loops (stepped frame interval simulation)
    const totalRollFrames = 15;
    const frameIntervalMs = 80; // ~12 fps
    let currentFrame = 0;

    const interval = setInterval(() => {
      // Stepped frame visual changes
      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
      audio.playClick();
      currentFrame++;

      if (currentFrame >= totalRollFrames) {
        clearInterval(interval);
        resolveRoll(currentBet);
      }
    }, frameIntervalMs);
  };

  const resolveRoll = async (activeBet: number) => {
    // Generate actual random roll
    const nextDie1 = Math.floor(Math.random() * 6) + 1;
    const nextDie2 = Math.floor(Math.random() * 6) + 1;
    const newSum = nextDie1 + nextDie2;

    setDie1(nextDie1);
    setDie2(nextDie2);

    // Calculate dynamic multiplier for the resolved choice
    const mult = getDynamicMultiplier(currentSum, prediction);

    // Check prediction match
    let correct = false;
    if (prediction === 'HIGHER' && newSum > currentSum) correct = true;
    if (prediction === 'LOWER' && newSum < currentSum) correct = true;
    if (prediction === 'SAME' && newSum === currentSum) correct = true;

    const payout = correct ? Number((activeBet * mult).toFixed(2)) : 0;

    if (correct) {
      audio.playWin();
      setMascotMood('happy');
      
      const nextChainStep = chainId + 1;
      const isMaxChain = nextChainStep >= 5;

      if (isMaxChain) {
        // Automatically banks at step 5
        audio.playJackpot();
        setScreenFlash(true);
        triggerCoinShower();
        await adjustBalance(payout, 'highlow_dice');
        setMascotDialogue(`MAX PYRAMID COMPLETED!!! x${mult} RESOLVED PAID +$${payout.toFixed(2)} COINS!`);
        setLastResultText(`MAX CHAIN WINNER! +$${payout.toFixed(2)}`);
        triggerToast(`★ PYRAMID PYRAMID MAXED! PAID $${payout.toFixed(2)} ★`, 'success');
        
        // Reset chain
        setChainId(0);
        setPendingWinnings(0);
        setInitialChainBet(0);
        
        setTimeout(() => setScreenFlash(false), 350);
      } else {
        // Advance chain level
        setChainId(nextChainStep);
        setPendingWinnings(payout);
        setMascotDialogue(`CORRECT PREDICTION! WON $${payout.toFixed(2)}! BANK COINS OR TUMBLE AGAIN?`);
        setLastResultText(`CORRECT! PENDING: $${payout.toFixed(2)}`);
        triggerToast(`CORRECT! STEP ${nextChainStep} REACHED ($${payout.toFixed(2)})`, 'success');
      }
    } else {
      audio.playLoss();
      setMascotMood('idle');
      setMascotDialogue(`INCORRECT! Sum rolled was ${newSum}. Better luck next roll!`);
      setLastResultText(`INCORRECT ROLL (${newSum})`);
      triggerToast('INCORRECT REVEAL! BET LOST.', 'info');

      // Reset chain completely on a loss
      setChainId(0);
      setPendingWinnings(0);
      setInitialChainBet(0);
    }

    // Set new sum as baseline for next round
    setCurrentSum(newSum);
    setIsRolling(false);
  };

  const handleBank = async () => {
    if (chainId === 0 || pendingWinnings <= 0) return;
    
    setIsRolling(true);
    audio.playClick();

    // Secure credit transaction log applied
    const payoutSuccess = await adjustBalance(pendingWinnings, 'highlow_dice');
    if (payoutSuccess) {
      audio.playWin();
      triggerToast(`BANKED $${pendingWinnings.toFixed(2)} COINS!`, 'success');
      setMascotMood('happy');
      setMascotDialogue(`COINS SECURED! THOU HAST SAFELY BANKED $${pendingWinnings.toFixed(2)}!`);
      setLastResultText(`BANKED +$${pendingWinnings.toFixed(2)}`);
    }

    setChainId(0);
    setPendingWinnings(0);
    setInitialChainBet(0);
    setIsRolling(false);
  };

  // Safe reset baseline value to 7
  const handleResetBaseline = () => {
    if (isRolling || chainId > 0) return;
    audio.playClick();
    setCurrentSum(7);
    setDie1(3);
    setDie2(4);
    setLastResultText(null);
    setMascotDialogue("BASELINE SUM RE-CENTERED AT 7! PLACE YOUR COIN BET.");
  };

  return (
    <div className="space-y-6">
      
      {/* Screen flash layer */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-[#ff9f00]/30 pointer-events-none mix-blend-overlay animate-pulse" />
      )}

      {/* 1. Cabinet Header */}
      <div className="border-4 border-[#ff9f00] bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
        <div>
          <h1 className="text-3xl font-jersey text-white uppercase m-0 leading-none">
            ★ HIGH-LOW PYRAMID DICE CABINET ★
          </h1>
          <p className="font-jersey text-md text-white/40 uppercase m-0 mt-1">
            Predict high-low sum outcomes • Double or nothing chain multiplier risk ladder
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
        
        {/* LEFT SECTOR: CABINET ENGINE WORKSPACE */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="relative w-full max-w-2xl border-4 border-[#ff9f00] bg-black p-4 md:p-6 filter drop-shadow-[8px_8px_0px_#000000] border-b-16 rounded-none flex flex-col items-center overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-35 pixel-checker pointer-events-none" />
            
            {/* Metallic neon trim */}
            <div className="absolute -left-3 top-0 bottom-0 w-3 bg-black border-r-2 border-[#ff9f00]" />
            <div className="absolute -right-3 top-0 bottom-0 w-3 bg-black border-l-2 border-[#ff9f00]" />

            {/* Marquee */}
            <div className="w-full border-4 border-[#ff9f00] bg-[#111111] p-3 text-center mb-6 relative overflow-hidden pixel-checker">
              <div className="flex justify-between items-center px-4">
                <span className="text-xl md:text-2xl text-[#ff9f00] animate-pulse">⚅</span>
                <span className="font-jersey text-2xl md:text-4xl text-white tracking-widest uppercase leading-none drop-shadow-[2px_2px_0px_#ff9f00]">
                  TUMBLE DICE VAULT
                </span>
                <span className="text-xl md:text-2xl text-[#ff9f00] animate-pulse">⚁</span>
              </div>
            </div>

            {/* DICE & BASELINE REVEAL PANEL */}
            <div className="relative w-full border-4 border-[#ff9f00] bg-[#111111] p-6 mb-6 filter drop-shadow-[4px_4px_0px_#000] overflow-hidden flex flex-col items-center">
              
              <div className="absolute inset-0 pointer-events-none crt-scanlines z-10 opacity-15" />
              
              {/* Particle shower */}
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

              {/* Dynamic Step visualizer banner */}
              {chainId > 0 && (
                <div className="mb-4 bg-[#ff9f00] border-2 border-[#e8e8e8] text-black px-4 py-1.5 font-jersey text-lg animate-bounce select-none filter drop-shadow-[2px_2px_0px_#000]">
                  ★ ROULETTE STEP {chainId} OF 5: CURRENT REWARD ${pendingWinnings.toFixed(2)} ★
                </div>
              )}

              {/* Baseline indicator panel */}
              <div className="text-center mb-4">
                <span className="font-jersey text-md text-white/40 uppercase tracking-wider block">
                  CURRENT BASELINE SUM
                </span>
                <span className="font-jersey text-5xl md:text-6xl text-[#ff9f00] leading-none block drop-shadow-[3px_3px_0px_#000000]">
                  {currentSum}
                </span>
              </div>

              {/* DICE SPRITES HOLDER */}
              <div className="flex gap-8 my-4 select-none justify-center">
                <div className={isRolling ? 'animate-bounce' : ''}>
                  <PixelDieFace value={die1} size={80} />
                </div>
                <div className={isRolling ? 'animate-bounce [animation-delay:0.1s]' : ''}>
                  <PixelDieFace value={die2} size={80} />
                </div>
              </div>

              {/* Simple math helper label */}
              <span className="font-jersey text-md text-white/60 uppercase mt-2 select-none">
                ROLL COMBINATION: {die1} + {die2} = {currentSum}
              </span>
              {/* PREDICTION SELECTORS PANEL */}
            <div className="w-full border-4 border-[#ff9f00] bg-[#111111] p-4 mb-6">
              <h4 className="font-jersey text-xl text-white uppercase text-center border-b border-white/10 pb-1.5 mb-3">
                CHOOSE PREDICTION OR MULTIPLIER (TARGET 92.0% RTP)
              </h4>

              <div className="grid grid-cols-3 gap-3">
                
                {/* HIGHER OPTION */}
                {(() => {
                  const mult = getDynamicMultiplier(currentSum, 'HIGHER');
                  const disabled = mult === 0 || isRolling;
                  const active = prediction === 'HIGHER';
                  return (
                    <button
                      disabled={disabled}
                      onClick={() => {
                        audio.playClick();
                        setPrediction('HIGHER');
                      }}
                      className={`border-3 p-3 flex flex-col items-center justify-center font-jersey cursor-pointer transition-none relative ${
                        disabled 
                          ? 'opacity-35 cursor-not-allowed border-white/20 bg-black text-white/40'
                          : active
                            ? 'border-[#ff9f00] bg-[#ff9f00]/20 text-[#ff9f00] scale-95 filter drop-shadow-[1px_1px_0px_#000]'
                            : 'border-white/20 bg-black text-white hover:border-[#ff9f00]'
                      }`}
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      <span className="text-xl tracking-wider leading-none">HIGHER</span>
                      <span className="text-md text-white mt-1.5 leading-none font-bold">
                        {disabled ? 'N/A' : `${mult}x`}
                      </span>
                      {active && !disabled && (
                        <div className="absolute top-1 right-1 text-xs text-[#ff9f00]">★</div>
                      )}
                    </button>
                  );
                })()}

                {/* SAME OPTION */}
                {(() => {
                  const mult = getDynamicMultiplier(currentSum, 'SAME');
                  const disabled = mult === 0 || isRolling;
                  const active = prediction === 'SAME';
                  return (
                    <button
                      disabled={disabled}
                      onClick={() => {
                        audio.playClick();
                        setPrediction('SAME');
                      }}
                      className={`border-3 p-3 flex flex-col items-center justify-center font-jersey cursor-pointer transition-none relative ${
                        disabled 
                          ? 'opacity-35 cursor-not-allowed border-white/20 bg-black text-white/40'
                          : active
                            ? 'border-[#ff9f00] bg-[#ff9f00]/20 text-[#ff9f00] scale-95 filter drop-shadow-[1px_1px_0px_#000]'
                            : 'border-white/20 bg-black text-white hover:border-[#ff9f00]'
                      }`}
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      <span className="text-xl tracking-wider leading-none">SAME</span>
                      <span className="text-md text-white mt-1.5 leading-none font-bold">
                        {disabled ? 'N/A' : `${mult}x`}
                      </span>
                      {active && !disabled && (
                        <div className="absolute top-1 right-1 text-xs text-[#ff9f00]">★</div>
                      )}
                    </button>
                  );
                })()}

                {/* LOWER OPTION */}
                {(() => {
                  const mult = getDynamicMultiplier(currentSum, 'LOWER');
                  const disabled = mult === 0 || isRolling;
                  const active = prediction === 'LOWER';
                  return (
                    <button
                      disabled={disabled}
                      onClick={() => {
                        audio.playClick();
                        setPrediction('LOWER');
                      }}
                      className={`border-3 p-3 flex flex-col items-center justify-center font-jersey cursor-pointer transition-none relative ${
                        disabled 
                          ? 'opacity-35 cursor-not-allowed border-white/20 bg-black text-white/40'
                          : active
                            ? 'border-white bg-[#ff9f00]/20 text-[#ff9f00] scale-95 filter drop-shadow-[1px_1px_0px_#000]'
                            : 'border-white/20 bg-black text-white hover:border-white'
                      }`}
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      <span className="text-xl tracking-wider leading-none">LOWER</span>
                      <span className="text-md text-white mt-1.5 leading-none font-bold">
                        {disabled ? 'N/A' : `${mult}x`}
                      </span>
                      {active && !disabled && (
                        <div className="absolute top-1 right-1 text-xs text-[#ff9f00]">★</div>
                      )}
                    </button>
                  );
                })()}

              </div>
            </div>
            </div>

            {/* BASE COIN BET SELECTION - disabled inside active chains */}
            <div className="w-full border-4 border-[#ff9f00]/60 bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative">
              
              {chainId > 0 && (
                <div className="absolute inset-0 bg-black/75 z-20 flex items-center justify-center font-jersey text-[#ff9f00] text-lg uppercase px-4 text-center">
                  BET LOCKED AT ${pendingWinnings.toFixed(2)} BY PYRAMID CHAIN RISK
                </div>
              )}

              <div className="flex flex-col text-left">
                <span className="font-jersey text-lg text-[#ff9f00] uppercase leading-none">
                  SELECT BASE COIN BET:
                </span>
                <span className="font-jersey text-[11px] text-white/40 uppercase mt-0.5">
                  Min $1.00 • Max $100.00 play credits
                </span>
              </div>

              <div className="flex items-center gap-3">
                <PixelButton
                  variant="dark"
                  disabled={isRolling || betAmount <= 1 || chainId > 0}
                  onClick={() => {
                    setBetAmount(prev => Math.max(1, prev - 10));
                  }}
                  chamfer={4}
                  className="px-2"
                >
                  <span className="text-sm px-1">-10</span>
                </PixelButton>

                <div className="border-2 border-white bg-black px-4 py-1.5 flex items-center justify-center min-w-28 text-center">
                  <span className="font-jersey text-2xl text-[#ff9f00] leading-none select-none">
                    ${betAmount.toFixed(2)}
                  </span>
                </div>

                <PixelButton
                  variant="gold"
                  disabled={isRolling || betAmount >= 100 || chainId > 0}
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
                    disabled={isRolling || chainId > 0}
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

            {/* MAIN INTERACTION BUTTONS */}
            <div className="w-full flex flex-col md:flex-row gap-4">
              
              <PixelButton
                variant="gold"
                disabled={isRolling}
                onClick={handleRoll}
                className="flex-1"
                soundType="click"
              >
                <div className="flex items-center justify-center gap-2 py-1">
                  <Gamepad2 className="w-5 h-5 text-white" />
                  <span className="text-2xl tracking-widest uppercase">
                    {isRolling ? 'ROLLING...' : chainId > 0 ? `STEP ${chainId} RISK TUMBLE` : 'TUMBLE DICE'}
                  </span>
                </div>
              </PixelButton>

              {chainId > 0 && (
                <PixelButton
                  variant="green"
                  disabled={isRolling}
                  onClick={handleBank}
                  className="flex-1"
                >
                  <div className="flex items-center justify-center gap-2 py-1 animate-pulse">
                    <Landmark className="w-5 h-5 text-black" />
                    <span className="text-2xl tracking-widest uppercase text-black font-bold">
                      BANK ${pendingWinnings.toFixed(2)} COINS
                    </span>
                  </div>
                </PixelButton>
              )}

              {chainId === 0 && (
                <PixelButton
                  variant="dark"
                  disabled={isRolling}
                  onClick={handleResetBaseline}
                  className="shrink-0"
                  title="Resets baseline to 7"
                >
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    <RotateCcw className="w-4 h-4 text-[#5a5a72]" />
                    <span className="text-lg">RE-CENTER 7</span>
                  </div>
                </PixelButton>
              )}

              <PixelButton
                variant="gold"
                onClick={() => setShowRulesModal(true)}
                className="shrink-0"
              >
                <div className="flex items-center justify-center gap-1.5 py-1">
                  <HelpCircle className="w-5 h-5 text-black" />
                  <span className="text-lg">PROBABILITIES</span>
                </div>
              </PixelButton>
            </div>

            {/* Coin notches footer design */}
            <div className="w-full mt-6 pt-4 border-t-2 border-[#5a5a72]/30 flex justify-between items-center px-4 md:px-8">
              <div className="flex flex-col items-center">
                <div className="w-4 h-10 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-6 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1 font-bold">comp slot</span>
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
                      STATUS: READY FOR BET
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-10 bg-black border-2 border-[#5a5a72] flex items-center justify-center">
                  <div className="w-1 h-6 bg-[#ff9f00] animate-pulse" />
                </div>
                <span className="font-jersey text-[9px] text-[#5a5a72] uppercase mt-1 font-bold">tumble triggers</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SECTOR: MASCOT CONSOLE & RECEIPT TX LOGS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Mascot Operator card */}
          <div className="border-4 border-[#ff9f00]/60 bg-[#111111] p-4 flex flex-col items-center relative filter drop-shadow-[4px_4px_0px_#000000]">
            <h4 className="font-jersey text-[#ff9f00] text-xl uppercase mb-3 text-center w-full border-b-2 border-white/10 pb-1">
              ★ SYSTEM OPERATOR ★
            </h4>
            
            <div className="flex items-center gap-4 w-full">
              <div className="scale-90 select-none">
                <PixelMascot mood={mascotMood} />
              </div>

              {/* Chat speech bubble */}
              <div className="flex-1 bg-[#0d0d1a] border-2 border-[#ff9f00] p-3 relative text-left">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#ff9f00] border-b-8 border-b-transparent" />
                <p className="font-jersey text-sm text-white uppercase m-0 leading-tight">
                  "{mascotDialogue}"
                </p>
              </div>
            </div>
          </div>

          {/* Double or Nothing Ladder Visual Progress */}
          <PixelPanel
            title="PYRAMID RISK LADDER"
            subtitle="Tumble correct bets to climb"
            headerAccent="gold"
          >
            <div className="space-y-4 font-jersey uppercase">
              <div className="border-2 border-white/10 bg-black p-3 flex flex-col-reverse gap-2">
                
                {[1, 2, 3, 4, 5].map((step) => {
                  const isActive = chainId === step;
                  const isCompleted = chainId > step;
                  
                  // Label styling
                  let labelColor = 'text-[#5a5a72]';
                  let borderStyle = 'border-white/10';
                  let bgStyle = 'bg-black/35';

                  if (isActive) {
                    labelColor = 'text-[#ff9f00] font-bold animate-pulse';
                    borderStyle = 'border-[#ff9f00]';
                    bgStyle = 'bg-[#3a3010]';
                  } else if (isCompleted) {
                    labelColor = 'text-[#3fff6e]';
                    borderStyle = 'border-[#3fff6e]';
                    bgStyle = 'bg-[#1e5631]/50';
                  }

                  return (
                    <div 
                      key={step} 
                      className={`border-2 p-2 flex justify-between items-center transition-all ${borderStyle} ${bgStyle}`}
                    >
                      <span className={labelColor}>
                        {step === 5 ? '★ STEP 5 (AUTO BANK)' : `STEP ${step}`}
                      </span>
                      <span className={labelColor}>
                        {step === 5 ? 'MAX COINS' : `x${Math.pow(2, step).toFixed(0)} odds potential`}
                      </span>
                    </div>
                  );
                })}

              </div>

              <div className="border-2 border-white/10 p-3 bg-black text-[#5a5a72] font-jersey uppercase text-[11px] leading-tight space-y-1">
                <h5 className="text-white text-xs m-0">LADDER RISK INSTRUCTIONS:</h5>
                <p className="m-0">1. Play any core correct roll to ignite a step 1 pyramid chain.</p>
                <p className="m-0">2. Bank coins at any current tier or risk sum rolls on the higher steps.</p>
                <p className="m-0">3. An incorrect predict clears all cumulative chain winnings instantly.</p>
                <p className="m-0">4. Reach Step 5 for automatic win banking payouts.</p>
              </div>
            </div>
          </PixelPanel>

          {/* printed Live Receipt Transactions ledger */}
          <div className="border-4 border-[#5a5a72] bg-[#f2ead3] p-4 text-black font-jersey uppercase relative filter drop-shadow-[4px_4px_0px_#000000] border-b-8">
            <h4 className="text-lg border-b border-black/20 pb-1 mb-2 text-center text-black/80">
              ⚡ DICE TRANSACTION LEDGER
            </h4>
            <div className="space-y-1 text-xs max-h-44 overflow-y-auto font-mono text-black/80 leading-tight">
              {transactionLog
                .filter(tx => tx.source === 'highlow_dice')
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
              {transactionLog.filter(tx => tx.source === 'highlow_dice').length === 0 && (
                <p className="text-center text-black/50 py-3">NO RECENT ROLLS RECORDED</p>
              )}
            </div>
            <div className="border-t border-black/20 mt-3 pt-1.5 text-center text-[10px] text-black/60">
              * TRANSACTION SOURCE: HIGHLOW_DICE *
            </div>
          </div>

        </div>
      </div>

      {/* Rules Probability Detailed Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-[#0d0d1a]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border-4 border-[#ff9f00] bg-[#111111] p-6 relative filter drop-shadow-[6px_6px_0px_#000000]">
            
            <div className="flex justify-between items-center border-b-3 border-[#ff9f00] pb-3 mb-4">
              <h3 className="font-jersey text-2xl text-[#ff9f00] m-0 uppercase">
                ★ DICE PROBABILITIES SCHEMATIC ★
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
                Probability breakdown of 2 standard dice rolls (36 permutations sum total):
              </p>

              <div className="border-2 border-white/10 p-4 bg-black space-y-2 font-jersey text-xs text-white/80 uppercase max-h-56 overflow-y-auto">
                <div className="flex justify-between border-b border-[#5a5a72]/30 pb-1 text-[#5a5a72]">
                  <span>SUM</span>
                  <span>PERMUTATIONS</span>
                  <span>CHANCE</span>
                </div>
                {Object.entries(DICE_OUTCOMES).map(([sum, ways]) => {
                  const chance = ((ways / 36) * 100).toFixed(1);
                  return (
                    <div key={sum} className="flex justify-between items-center border-b border-white/5 pb-0.5">
                      <span className="text-sm font-bold text-[#ff9f00]">{sum}</span>
                      <span>{ways} ways</span>
                      <span className="font-mono text-white">{chance}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic compliance label */}
              <div className="p-3 border-2 border-[#3fff6e] bg-[#3fff6e]/10 text-[#3fff6e] font-jersey text-center uppercase text-md">
                ★ DYNAMIC TARGET RETURN-TO-PLAYER: 92.00% THEORY CALIBRATED ★
              </div>

              <div className="text-center pt-2">
                <PixelButton
                  variant="gold"
                  className="px-8"
                  onClick={() => {
                    audio.playClick();
                    setShowRulesModal(false);
                  }}
                >
                  CONFIRM SCHEMATIC LAWS
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Simple visual components wrapper for die drawing
const PixelDieFace: React.FC<{ value: number; size?: number }> = ({ value, size = 64 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className="filter drop-shadow-[2px_2px_0px_#000]">
      {/* Outer black chamfered border */}
      <path d="M 2 0 L 14 0 L 16 2 L 16 14 L 14 16 L 2 16 L 0 14 L 0 2 Z" fill="#e8e8e8" />
      {/* Inner warm white card background */}
      <path d="M 2 1 L 14 1 L 15 2 L 15 14 L 14 15 L 2 15 L 1 14 L 1 2 Z" fill="#f2ead3" />
      
      {/* Dots based on value */}
      {value === 1 && (
        <rect x="7" y="7" width="2" height="2" fill="#ff3f3f" />
      )}
      {value === 2 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#111124" />
          <rect x="11" y="11" width="2" height="2" fill="#111124" />
        </>
      )}
      {value === 3 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#111124" />
          <rect x="7" y="7" width="2" height="2" fill="#111124" />
          <rect x="11" y="11" width="2" height="2" fill="#111124" />
        </>
      )}
      {value === 4 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#111124" />
          <rect x="11" y="3" width="2" height="2" fill="#111124" />
          <rect x="3" y="11" width="2" height="2" fill="#111124" />
          <rect x="11" y="11" width="2" height="2" fill="#111124" />
        </>
      )}
      {value === 5 && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="#111124" />
          <rect x="11" y="3" width="2" height="2" fill="#111124" />
          <rect x="7" y="7" width="2" height="2" fill="#111124" />
          <rect x="3" y="11" width="2" height="2" fill="#111124" />
          <rect x="11" y="11" width="2" height="2" fill="#111124" />
        </>
      )}
      {value === 6 && (
        <>
          <rect x="3" y="2" width="2" height="2" fill="#111124" />
          <rect x="11" y="2" width="2" height="2" fill="#111124" />
          <rect x="3" y="7" width="2" height="2" fill="#111124" />
          <rect x="11" y="7" width="2" height="2" fill="#111124" />
          <rect x="3" y="12" width="2" height="2" fill="#111124" />
          <rect x="11" y="12" width="2" height="2" fill="#111124" />
        </>
      )}
    </svg>
  );
};
