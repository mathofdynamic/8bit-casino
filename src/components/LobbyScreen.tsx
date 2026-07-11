/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelMascot, PixelProgressBar, PixelModal, PixelCard } from './PixelUI';
import { 
  Flame, 
  Trophy, 
  Coins, 
  Settings, 
  Play, 
  Sparkles, 
  Timer, 
  HelpCircle, 
  User, 
  Landmark, 
  HelpCircle as InfoIcon,
  ChevronRight,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import { audio } from '../lib/audio';

export const LobbyScreen: React.FC = () => {
  const { profile, setRoute, claimDailyBonus, triggerToast } = useStore();
  
  // Modals state
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [claimedEarned, setClaimedEarned] = useState<number | null>(null);
  const [timeLeftStr, setTimeLeftStr] = useState('');
  
  // Chunky retro 8-bit animation frame cycle state (4fps)
  const [animationTick, setAnimationTick] = useState(0);

  // Walking NPC Larry positioning states
  const [larryPosition, setLarryPosition] = useState(25); // percentage (20 to 80)
  const [larryDirection, setLarryDirection] = useState<'right' | 'left'>('right');

  // Trigger frame ticks for stepped 8-bit visual cycles
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setAnimationTick((t) => (t + 1) % 4);
    }, 250); // 4Hz game loop

    return () => clearInterval(tickInterval);
  }, []);

  // Simple game loop to make NPC Larry pace around the casino floor
  useEffect(() => {
    const walkInterval = setInterval(() => {
      setLarryPosition((pos) => {
        if (larryDirection === 'right') {
          if (pos >= 78) {
            setLarryDirection('left');
            return pos - 1.5;
          }
          return pos + 1.5;
        } else {
          if (pos <= 22) {
            setLarryDirection('right');
            return pos + 1.5;
          }
          return pos - 1.5;
        }
      });
    }, 150); // pace speed

    return () => clearInterval(walkInterval);
  }, [larryDirection]);

  // Countdown timer to 24-hour daily bonus limit
  useEffect(() => {
    if (!profile.lastClaimedTimestamp) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = now - profile.lastClaimedTimestamp!;
      const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
      const remaining = MILLISECONDS_IN_A_DAY - diff;

      if (remaining <= 0) {
        setTimeLeftStr('');
      } else {
        const hrs = Math.floor(remaining / (60 * 60 * 1000));
        const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const secs = Math.floor((remaining % (60 * 1000)) / 1000);
        setTimeLeftStr(
          `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [profile.lastClaimedTimestamp]);

  const handleClaimBonus = async () => {
    const now = Date.now();
    const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
    
    if (profile.lastClaimedTimestamp && (now - profile.lastClaimedTimestamp < MILLISECONDS_IN_A_DAY)) {
      triggerToast('BONUS STILL COOLDOWN! COME BACK LATER.', 'error');
      return;
    }

    const result = await claimDailyBonus();
    if (result.success) {
      setClaimedEarned(result.chipsEarned);
      audio.playWin();
      triggerToast(`CLAIMED DAILY BONUS! +$${result.chipsEarned.toFixed(2)} COINS`, 'success');
    }
  };

  const isClaimedToday = () => {
    if (!profile.lastClaimedTimestamp) return false;
    const now = Date.now();
    return (now - profile.lastClaimedTimestamp) < (24 * 60 * 60 * 1000);
  };

  const playChime = () => {
    audio.playClick();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Dynamic Keyframes injected locally for stepped low frame-rate feel */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neon-flicker-cyan {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            filter: drop-shadow(0 0 4px #3ff7ff);
            opacity: 1;
          }
          20%, 24%, 55% {
            filter: none;
            opacity: 0.6;
          }
        }
        @keyframes neon-flicker-gold {
          0%, 14%, 16%, 18%, 20%, 64%, 66%, 100% {
            filter: drop-shadow(0 0 4px #ffd23f);
            opacity: 1;
          }
          15%, 19%, 65% {
            filter: none;
            opacity: 0.45;
          }
        }
        @keyframes spotlight-sweep {
          0%, 100% { transform: skewX(-15deg) translateX(-10%); }
          50% { transform: skewX(15deg) translateX(10%); }
        }
        .flicker-neon-cyan {
          animation: neon-flicker-cyan 6s infinite steps(2);
        }
        .flicker-neon-magenta {
          animation: neon-flicker-gold 5s infinite steps(2);
        }
        .spotlight-lens {
          animation: spotlight-sweep 10s infinite ease-in-out;
        }
      `}} />

      {/* 1. ARCHITECTURALLY HONEST MARQUEE TITLE BOARD */}
      <div className="border-3 border-[#ffd23f] bg-[#111111] p-5 filter drop-shadow-[4px_4px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Repeating dot canvas matrix inside the card */}
        <div className="absolute inset-0 bg-black opacity-40 pixel-checker pointer-events-none" />
        
        {/* Title Content */}
        <div className="relative z-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-3xl font-jersey text-[#ffd23f] animate-bounce">★</span>
            <h1 className="text-4xl font-jersey tracking-wider uppercase text-white m-0 leading-none">
              8BIT CASINO CONCOURSE
            </h1>
            <span className="text-3xl font-jersey text-[#ffd23f] animate-bounce" style={{ animationDelay: '0.2s' }}>★</span>
          </div>
          <p className="font-jersey text-lg text-white/60 uppercase mt-1 m-0">
            Welcome, <span className="text-[#ffd23f]">{profile.name}</span> • Portrait spec: <span className="text-white font-bold">CHAMPION {profile.avatarId}</span> • Current streak: <span className="text-[#ffd23f]">{profile.dailyStreak} days</span>
          </p>
        </div>

        {/* Info Desk trigger and Claim status shortcut */}
        <div className="relative z-10 flex flex-wrap gap-2 shrink-0">
          <PixelButton
            variant="dark"
            soundType="click"
            onClick={() => {
              playChime();
              setIsInfoModalOpen(true);
            }}
          >
            <div className="flex items-center gap-1.5 font-jersey text-lg">
              <InfoIcon className="w-5 h-5" />
              <span>HOW THIS WORKS</span>
            </div>
          </PixelButton>

          <PixelButton
            variant={isClaimedToday() ? 'dark' : 'gold'}
            soundType="win"
            onClick={() => {
              playChime();
              setIsBonusModalOpen(true);
            }}
          >
            <div className="flex items-center gap-1.5 font-jersey text-lg">
              <Sparkles className="w-5 h-5 text-white" />
              <span>{isClaimedToday() ? 'BONUS LOGS' : 'CLAIM BONUS'}</span>
            </div>
          </PixelButton>
        </div>
      </div>

      {/* WARNING NOTIFICATION BANNER (No real money gambling message) */}
      <div className="border-2 border-[#ffd23f] bg-[#ffd23f]/10 px-4 py-2 flex items-center justify-between gap-4 text-xs font-mono uppercase text-[#ffd23f]">
        <div className="flex items-center gap-2">
          <span className="bg-[#ffd23f] text-black px-1 font-jersey text-md leading-none py-0.5 font-bold">★ PLAY-MONEY COMPLIANCE ★</span>
          <span>Fictional arcade simulator tokens. No crypto or cash is allowed, bought or exchanged.</span>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE 8-BIT CASINO FLOOR */}
      <div className="border-4 border-white bg-black relative min-h-[500px] p-6 flex flex-col justify-between overflow-hidden filter drop-shadow-[6px_6px_0px_#000]">
        
        {/* Floor grid visualizer: repeating 8-bit carpet cross lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: `
          radial-gradient(circle, #ffd23f 1.5px, transparent 1.5px),
            radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)
          `,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }} />

        {/* Ambient spotlight overlay scanning floor */}
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden z-10 select-none">
          <div className="spotlight-lens absolute top-[-50px] left-1/3 w-96 h-[600px] bg-gradient-to-b from-[#ffd23f]/10 to-transparent transform -rotate-12 origin-top" />
          <div className="spotlight-lens absolute top-[-50px] right-1/3 w-96 h-[600px] bg-gradient-to-b from-white/5 to-transparent transform rotate-12 origin-top" style={{ animationDelay: '4s' }} />
        </div>

        {/* Flashing signs above the floor */}
        <div className="flex justify-between items-center z-10 select-none pointer-events-none mb-4">
          <div className="border border-[#ffd23f] bg-black px-2 py-1 text-xs text-[#ffd23f] uppercase font-jersey tracking-wider flicker-neon-cyan">
            ◆ CASINO MAIN CONCOURSE ◆
          </div>
          <div className="border border-white bg-black px-2 py-1 text-xs text-white uppercase font-jersey tracking-wider flicker-neon-magenta">
            🎰 WINNERS CONCOURSE 🎰
          </div>
        </div>

        {/* THE INTERACTIVE BUILDING BAY PLOTS (BENTO SYSTEM) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10 mt-2">
          
          {/* ZONE A: TEXAS HOLD'EM POKER HALL */}
          <div 
            onClick={() => {
              playChime();
              setRoute('poker');
            }}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-[#ffd23f] bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ffd23f] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ffd23f] uppercase tracking-wide flex justify-between items-center">
              <span>★ POKER SALOON ★</span>
              <span className="text-xs bg-black text-[#ffd23f] px-1 font-bold animate-pulse">LIVE</span>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Saloon SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />
                {/* Saloon wood trims */}
                <div className="absolute top-0 inset-x-0 h-4 bg-[#222222] border-b-2 border-black flex justify-around items-center">
                  <div className="w-2 h-2 bg-[#ffd23f] animate-pulse" />
                  <div className="w-2 h-2 bg-[#ffd23f] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <div className="w-2 h-2 bg-[#ffd23f] animate-pulse" style={{ animationDelay: '0.8s' }} />
                </div>
                {/* Saloon double doors */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-16 bg-[#111111] border-t-2 border-r border-l border-white/30 flex">
                  <div className="w-1/2 h-full border-r border-black/40 bg-black flex items-center justify-end pr-1">
                    <div className="w-1.5 h-6 bg-[#ffd23f]/30 border border-black/40" />
                  </div>
                  <div className="w-1/2 h-full bg-black flex items-center justify-start pl-1">
                    <div className="w-1.5 h-6 bg-[#ffd23f]/30 border border-black/40" />
                  </div>
                </div>
                {/* Cards icons floating */}
                <div className={`absolute left-4 top-8 w-7 h-10 bg-white border-2 border-black rotate-12 flex items-center justify-center font-sans font-bold text-xs text-[#ffd23f] ${animationTick % 2 === 0 ? 'translate-y-[-2px]' : 'translate-y-[2px]'}`}>
                  A♦
                </div>
                <div className={`absolute right-4 top-10 w-7 h-10 bg-white border-2 border-black -rotate-12 flex items-center justify-center font-sans font-bold text-xs text-black ${animationTick % 2 === 1 ? 'translate-y-[-2px]' : 'translate-y-[2px]'}`}>
                  K♠
                </div>
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="font-jersey text-lg text-white leading-tight uppercase">
                  ENTER TEXAS HOLD&apos;EM TABLES TO DUEL DEALERS AND COLLECT WINNINGS.
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 01</span>
                  <span className="text-[#ffd23f]">◆ OPEN ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* ZONE B: NEON ARCADE MINI-GAMES PAVILION */}
          <div 
            onClick={() => {
              playChime();
              setRoute('minigames');
            }}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-white bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ffd23f] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ffd23f] uppercase tracking-wide flex justify-between items-center">
              <span>★ ARCADE PAVILION ★</span>
              <span className="text-xs bg-black text-[#ffd23f] px-1 font-bold">SPIN</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Arcade SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none" />
                
                {/* Arcade Cabinets */}
                <div className="absolute bottom-0 left-4 w-12 h-24 bg-[#ffd23f] border-t-2 border-x-2 border-black flex flex-col justify-between">
                  <div className="h-6 bg-black m-1 border border-white/30 flex items-center justify-center">
                    <span className="text-[9px] text-white font-jersey animate-pulse">777 SLOTS</span>
                  </div>
                  <div className="h-2 bg-[#ffd23f] m-1 border border-black flex justify-around">
                    <div className="w-1 bg-white h-2 transform -translate-y-1" />
                    <div className="w-1.5 h-1.5 bg-black" />
                  </div>
                </div>

                <div className="absolute bottom-0 right-4 w-12 h-24 bg-[#222222] border-t-2 border-x-2 border-white flex flex-col justify-between">
                  <div className="h-6 bg-black m-1 border border-[#ffd23f]/40 flex items-center justify-center">
                    <span className="text-[9px] text-[#ffd23f] font-jersey animate-ping" style={{ animationDuration: '3s' }}>WHEEL</span>
                  </div>
                  <div className="h-2 bg-white m-1 border border-black flex justify-around">
                    <div className="w-1 bg-[#ffd23f] h-2 transform -translate-y-1" />
                    <div className="w-1.5 h-1.5 bg-[#ffd23f]" />
                  </div>
                </div>

                {/* Animated light bars */}
                <div className="absolute top-2 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ffd23f] via-white to-[#ffd23f] animate-pulse" />
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="font-jersey text-lg text-white leading-tight uppercase">
                  SPIN THE SLOTS REELS AND ROOTS WHEEL TO DOUBLE CHIPS SECURELY.
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 02</span>
                  <span className="text-[#ffd23f]">◆ READY ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* ZONE C: CASHIER & PROFILE VAULT */}
          <div 
            onClick={() => {
              playChime();
              setRoute('profile');
            }}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-[#ffd23f] bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ffd23f] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ffd23f] uppercase tracking-wide flex justify-between items-center">
              <span>★ CASHIER VAULT ★</span>
              <span className="text-xs bg-black text-[#ffd23f] px-1 font-bold">INFO</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Vault SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
                
                {/* Vault Door Circular lock and indicators */}
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#ffd23f]/30 flex items-center justify-center animate-spin" style={{ animationDuration: '16s' }} />
                
                {/* Solid Vault safe gate */}
                <div className="absolute w-12 h-16 bg-[#111111] border-2 border-white/40 flex flex-col justify-between p-1">
                  <div className="h-3 w-full bg-white animate-pulse" />
                  <div className="h-3 w-full bg-[#ffd23f] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <div className="h-3 w-full bg-[#ffd23f] animate-pulse" style={{ animationDelay: '0.8s' }} />
                </div>
                
                {/* Stacks of gold blocks at foot */}
                <div className="absolute bottom-1 right-2 w-10 h-6 flex flex-wrap gap-1">
                  <div className="w-4 h-2 bg-[#ffd23f] border border-black" />
                  <div className="w-4 h-2 bg-white border border-black" />
                  <div className="w-4 h-2 bg-[#ffd23f] border border-black" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="font-jersey text-lg text-white leading-tight uppercase">
                  TWEAK VOLUME HARDWARE, UPDATE AVATARS AND VIEW BANK STATS.
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 03</span>
                  <span className="text-[#ffd23f]">◆ ACCS ◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* ZONE D: DAILY TREASURE LOOT CHEST */}
          <div 
            onClick={() => {
              playChime();
              setIsBonusModalOpen(true);
            }}
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-white bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ffd23f] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ffd23f] uppercase tracking-wide flex justify-between items-center">
              <span>★ DAILY LOOT ★</span>
              <span className="text-xs bg-[#0d0d1a] text-[#ffd23f] px-1 font-bold">BONUS</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Pedestal Treasure Chest SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[#111111] opacity-30 pixel-checker" />
                
                {/* Sacred Stone Pedestal Plinth */}
                <div className="absolute bottom-0 w-20 h-10 bg-[#222222] border-t-2 border-x-2 border-black flex justify-around">
                  <div className="w-1.5 h-full bg-black" />
                  <div className="w-1.5 h-full bg-black" />
                </div>

                {/* Animated Chest sitting on Pedestal */}
                <div className={`absolute bottom-8 z-10 ${!isClaimedToday() ? 'animate-pixel-bounce' : ''}`}>
                  {isClaimedToday() ? (
                    /* Open Empty Chest */
                    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                      <rect x="4" y="16" width="32" height="16" fill="#222222" stroke="black" strokeWidth="2" />
                      <path d="M4 16 L20 4 L36 16 Z" fill="#ffd23f" stroke="black" strokeWidth="2" />
                      <rect x="18" y="16" width="4" height="6" fill="#ffd23f" />
                      {/* Empty interior shadow */}
                      <rect x="8" y="18" width="24" height="12" fill="black" />
                    </svg>
                  ) : (
                    /* Closed Glowing/Bouncing Chest */
                    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                      <rect x="4" y="12" width="32" height="20" fill="#ffd23f" stroke="black" strokeWidth="2" />
                      <rect x="4" y="4" width="32" height="8" fill="#111111" stroke="black" strokeWidth="2" />
                      <rect x="17" y="10" width="6" height="6" fill="white" stroke="black" strokeWidth="1" />
                      {/* Sparkles */}
                      {animationTick % 2 === 0 && <circle cx="6" cy="6" r="2" fill="white" />}
                      {animationTick % 2 === 1 && <circle cx="34" cy="8" r="2" fill="#ffd23f" />}
                    </svg>
                  )}
                </div>

                {/* Sparkling dots drifting upwards */}
                {!isClaimedToday() && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-1 h-1 bg-[#ffd23f] animate-ping top-6 left-1/4" />
                    <div className="absolute w-1.5 h-1.5 bg-white animate-ping top-10 right-1/4" style={{ animationDelay: '0.5s' }} />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-left">
                {isClaimedToday() ? (
                  <div className="bg-black border border-[#ffd23f] px-2 py-1 text-center font-jersey text-md text-[#ffd23f]">
                    TIMER COOLDOWN: {timeLeftStr || "HH:MM:SS"}
                  </div>
                ) : (
                  <p className="font-jersey text-lg text-[#ffd23f] leading-tight uppercase animate-pulse">
                    ★ TREASURE CHEST UNLOCKED! CLAIM NOW FOR DAILY COMP COINS.
                  </p>
                )}
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 04</span>
                  <span className={isClaimedToday() ? 'text-white/40' : 'text-[#ffd23f]'}>
                    {isClaimedToday() ? '◆ COOLDOWN ◆' : '◆ READY ◆'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. ROAMING ACTIVE RETRO NPC (LARRY THE RETRO GAMBLER) */}
        <div className="relative h-20 w-full bg-[#111111]/40 border-t-2 border-b-2 border-white/10 mt-8 mb-4 overflow-hidden select-none">
          <div className="absolute inset-0 bg-black opacity-30 pixel-checker" />
          <div className="absolute left-4 top-2 font-jersey text-xs text-white/40 uppercase">
            ACTIVE FLOOR PATRONS
          </div>

          {/* Interactive Waving NPC: Larry */}
          <div 
            className="absolute top-2 transition-all duration-150 ease-linear flex flex-col items-center"
            style={{ 
              left: `${larryPosition}%`,
              transform: `scaleX(${larryDirection === 'right' ? 1 : -1})`
            }}
          >
            {/* Speech bubble above head */}
            <div className="relative mb-1 bg-black border border-white text-[9px] font-jersey px-1.5 py-0.5 text-white uppercase transform scale-x-100 whitespace-nowrap z-20">
              {animationTick === 0 && "LUCK BE MY LADY!"}
              {animationTick === 1 && "DOUBLE OR NOTHING!"}
              {animationTick === 2 && "PLAY MONEY IS SWEET!"}
              {animationTick === 3 && "WHEEL OF ORBITS!"}
              {/* Arrow downwards */}
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black border-r border-b border-white rotate-45" />
            </div>

            {/* Custom SVG Drawing of Larry Sprite with alternating shoes */}
            <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="image-rendering-pixelated">
              {/* Hair (Arcade Gold) */}
              <rect x="6" y="2" width="12" height="6" fill="#ffd23f" stroke="black" strokeWidth="1" />
              {/* Face (White) */}
              <rect x="8" y="8" width="8" height="6" fill="#ffffff" stroke="black" strokeWidth="1" />
              {/* Eye */}
              <rect x="12" y="10" width="2" height="2" fill="#000000" />
              {/* Shirt (White) */}
              <rect x="4" y="14" width="16" height="12" fill="#ffffff" stroke="black" strokeWidth="1" />
              {/* Pants (Arcade Gold) */}
              <rect x="7" y="26" width="10" height="6" fill="#ffd23f" stroke="black" strokeWidth="1" />
              {/* Alternating walking shoes state */}
              {animationTick % 2 === 0 ? (
                <>
                  <rect x="5" y="32" width="5" height="3" fill="#222222" stroke="black" strokeWidth="1" />
                  <rect x="13" y="31" width="5" height="3" fill="#222222" stroke="black" strokeWidth="1" />
                </>
              ) : (
                <>
                  <rect x="6" y="31" width="5" height="3" fill="#222222" stroke="black" strokeWidth="1" />
                  <rect x="14" y="32" width="5" height="3" fill="#222222" stroke="black" strokeWidth="1" />
                </>
              )}
            </svg>
          </div>

          {/* Center Info Desk Booth with Dealer Bob NPC */}
          <div className="absolute left-[85%] sm:left-[80%] md:left-[50%] -translate-x-1/2 bottom-0 flex flex-col items-center select-none">
            {/* Dealer speech */}
            <div className="bg-black border border-[#ffd23f] text-[8px] font-jersey px-2 py-0.5 text-[#ffd23f] uppercase whitespace-nowrap mb-0.5">
              HELP DESK STATION
            </div>
            
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="image-rendering-pixelated">
              {/* Info Booth */}
              <rect x="2" y="14" width="24" height="14" fill="#ffd23f" stroke="black" strokeWidth="1" />
              <rect x="6" y="18" width="16" height="10" fill="#000000" />
              {/* Question mark decal */}
              <rect x="13" y="19" width="2" height="4" fill="#ffd23f" />
              <circle cx="14" cy="25" r="1" fill="#ffffff" />
              
              {/* Dealer head */}
              <rect x="10" y="4" width="8" height="10" fill="#ffffff" stroke="black" strokeWidth="1" />
              {/* Eyes */}
              <rect x="12" y="6" width="1" height="2" fill="#ffd23f" />
              <rect x="15" y="6" width="1" height="2" fill="#ffd23f" />
              {/* Hair */}
              <rect x="8" y="2" width="12" height="2" fill="#ffd23f" />
            </svg>
          </div>

        </div>

      </div>

      {/* 4. CHIP DESK GUIDE & MASCOT FEEDBACK BOX */}
      <div 
        onClick={() => {
          playChime();
          setIsInfoModalOpen(true);
        }}
        className="border-3 border-[#ffd23f] bg-[#111111] p-5 flex flex-col sm:flex-row items-center gap-6 filter drop-shadow-[4px_4px_0px_#000] cursor-pointer hover:bg-[#222222] transition-all duration-75 relative"
        style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
      >
        <div className="absolute right-3 top-2 font-jersey text-xs text-white/40 uppercase select-none">
          Click Desk for Handbook
        </div>
        <PixelMascot mood="deal" />
        <div className="text-center sm:text-left space-y-2">
          <h3 className="text-2xl font-jersey text-[#ffd23f] uppercase m-0 leading-none">
            ★ OFFICIAL PLAY COMP HANDBOOK DESK ★
          </h3>
          <p className="font-jersey text-lg text-[#e8e8e8] uppercase m-0 leading-tight">
            Greetings champion! Tap the help desk icon or any building zone above to start thy tour. Free chips replenish instantly on claim. Zero crypto wallet or credit card is required to compete!
          </p>
          <div className="pt-1 flex flex-wrap gap-2">
            <span className="inline-block px-2 py-0.5 border border-[#ffd23f] text-[#ffd23f] text-xs font-jersey uppercase">
              DEALER SPECIFICATION: BOOTSTRAPPED VIRTUAL CONSOLE EMULATION
            </span>
            <span className="inline-block px-2 py-0.5 border border-white text-white text-xs font-jersey uppercase">
              COMP CHIPS: 100% AMUSEMENT SECURED
            </span>
          </div>
        </div>
      </div>

      {/* 5. DAILY REWARDS MODAL (Treasure Loot Chest Box) */}
      <PixelModal
        isOpen={isBonusModalOpen}
        onClose={() => setIsBonusModalOpen(false)}
        title="★ LOOT BOX & COIN DISPENSER ★"
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            {isClaimedToday() ? (
              /* Opened Loot Chest Animation */
              <svg className="w-24 h-20" viewBox="0 0 40 32" fill="none">
                <rect x="4" y="16" width="32" height="16" fill="#111111" stroke="white" strokeWidth="2" />
                <path d="M4 16 L20 4 L36 16 Z" fill="#ffd23f" stroke="white" strokeWidth="2" />
                {/* Empty glow interior shadow */}
                <rect x="8" y="18" width="24" height="12" fill="#000000" />
                <circle cx="20" cy="24" r="3" fill="#ffd23f" />
              </svg>
            ) : (
              /* Closed Bouncing Sparkling Gold Box */
              <svg className="w-24 h-20 animate-bounce" viewBox="0 0 40 32" fill="none">
                <rect x="4" y="12" width="32" height="20" fill="#ffd23f" stroke="white" strokeWidth="2" />
                <rect x="4" y="4" width="32" height="8" fill="#111111" stroke="white" strokeWidth="2" />
                <rect x="17" y="10" width="6" height="6" fill="black" stroke="white" strokeWidth="1.5" />
                <circle cx="10" cy="20" r="2" fill="white" />
                <circle cx="30" cy="20" r="2" fill="#ffd23f" />
              </svg>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-jersey text-[#ffd23f] uppercase leading-none m-0">
              {isClaimedToday() ? 'REWARD VAULT LOCKED' : 'DAILY TOKENS ARE WAITING!'}
            </h3>
            <p className="text-lg font-jersey text-[#e8e8e8] uppercase leading-snug m-0">
              Claim free play-credits every 24 hours to secure thy stake on the game floor.
            </p>
          </div>

          {/* Progress bar representing streak meter */}
          <div className="bg-black p-4 border-2 border-white/20 text-left">
            <div className="flex justify-between font-jersey text-md text-white/40 uppercase mb-1">
              <span>DAILY CLAIM STREAK</span>
              <span className="text-[#ffd23f]">{profile.dailyStreak}/7 DAYS</span>
            </div>
            <PixelProgressBar 
              value={Math.min(100, Math.round(((profile.dailyStreak || 1) / 7) * 100))} 
              max={100} 
            />
            <p className="text-xs font-mono text-white/40 uppercase mt-2 m-0">
              CONSECUTIVE STREAK MULTIPLIER: <span className="text-[#ffd23f]">x{Math.min(7, profile.dailyStreak || 1)} PLAY RATIO</span>
            </p>
          </div>

          {/* Action Row */}
          <div className="space-y-4">
            {isClaimedToday() ? (
              <div className="p-4 border-2 border-[#ffd23f] bg-[#ffd23f]/5 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-[#ffd23f] font-jersey text-xl uppercase">
                  <Timer className="w-5 h-5 animate-pulse" />
                  <span>NEXT UNLOCK TIMER: {timeLeftStr || "24:00:00"}</span>
                </div>
                <p className="text-xs font-jersey text-white/40 uppercase m-0 text-center">
                  FREE TOKENS INJECTOR IS RE-CHARGING IN THE CONCOURSE COOLDOWN CHAMBER.
                </p>
              </div>
            ) : (
              <PixelButton
                variant="gold"
                className="w-full text-lg py-2"
                onClick={handleClaimBonus}
                soundType="win"
              >
                CLAIM FREE COINS (+$1.00 x STREAK MULTIPLIER)
              </PixelButton>
            )}

            {profile.lastClaimedTimestamp && (
              <p className="text-xs font-mono text-white/40 uppercase m-0">
                LAST LEDGER SYNC: {new Date(profile.lastClaimedTimestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </PixelModal>

      {/* 6. HOW THIS WORKS INFORMATION DESK MODAL */}
      <PixelModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="★ CONCOURSE PILOT HANDBOOK ★"
      >
        <div className="space-y-6">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 text-[#ffd23f] mx-auto animate-bounce" />
            <h3 className="text-3xl font-jersey text-[#ffd23f] uppercase leading-none mt-2 m-0">
              PILOTING THE 8BIT CONSOLE
            </h3>
            <p className="text-md font-jersey text-white/40 uppercase leading-snug mt-1 m-0">
              Understanding the gameplay systems and regulations of the Concourse Map
            </p>
          </div>

          {/* The modular guides */}
          <div className="space-y-4 font-jersey text-lg uppercase text-[#e8e8e8]">
            
            <div className="border border-white/20 p-3 bg-black">
              <div className="flex items-center gap-2 text-[#ffd23f]">
                <Coins className="w-5 h-5" />
                <span>1. FREE DAILY PLAY TOKENS</span>
              </div>
              <p className="text-sm text-[#e8e8e8]/80 mt-1 leading-snug">
                Every 24 hours, click the sacred gold treasure chest to receive play comp credits. Keep consecutive days logged to secure up to a x7 streak ledger multiplier! If thy balance hits zero, thou can reset the counter instantly in profile cashier vault.
              </p>
            </div>

            <div className="border border-white/20 p-3 bg-black">
              <div className="flex items-center gap-2 text-white">
                <Gamepad2 className="w-5 h-5" />
                <span>2. ARCADE MINIGAME CABINETS</span>
              </div>
              <p className="text-sm text-[#e8e8e8]/80 mt-1 leading-snug">
                Take comp credits to the Arcade Cabinet Pavilion to test your luck. Play high-octane slots reels, spin the fortune wheel, and stack up consecutive score Tallies to multiply play funds.
              </p>
            </div>

            <div className="border border-white/20 p-3 bg-black">
              <div className="flex items-center gap-2 text-[#ffd23f]">
                <Trophy className="w-5 h-5" />
                <span>3. MULTIPLAYER POKER SALOONS</span>
              </div>
              <p className="text-sm text-[#e8e8e8]/80 mt-1 leading-snug">
                Take chips to the Poker Saloon. Join standard virtual Texas Hold&apos;em poker tables and pit thy wits against smart local computer dealers to master chip mathematics and poker strategies!
              </p>
            </div>

            <div className="border border-[#ffd23f] p-4 bg-[#ffd23f]/5 text-[#ffd23f]">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>CRITICAL COMPLIANCE NOTICE</span>
              </div>
              <p className="text-xs font-mono text-white/90 mt-1.5 leading-relaxed">
                THIS IS A SIMULATOR APP WITH ZERO REAL CURRENCY. ALL COINS ($X.XX) ARE 100% FICTIONAL, VIRTUAL CREDITS GRANTED SOLELY FOR DEMONSTRATION AND PRACTICE. THERE ARE NO REAL PAYOUTS, EXCHANGEABLE TOKENS, WITHDRAWALS OR COMMERCIAL CONVERSIONS SUPPORTED.
              </p>
            </div>

          </div>

          <div className="flex justify-center pt-2">
            <PixelButton
              variant="gold"
              className="px-8"
              onClick={() => setIsInfoModalOpen(false)}
            >
              UNDERSTOOD (CONFIRM HANDBOOK)
            </PixelButton>
          </div>
        </div>
      </PixelModal>

    </div>
  );
};
