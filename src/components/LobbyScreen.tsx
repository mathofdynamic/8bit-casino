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
  
  // Infotainment Tips Carousel states
  const [activeTipChannel, setActiveTipChannel] = useState(0); // 0 to 4
  const [isTvAutoLoop, setIsTvAutoLoop] = useState(true);
  
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

  // Auto-scan the TV channels
  useEffect(() => {
    if (!isTvAutoLoop) return;
    const interval = setInterval(() => {
      setActiveTipChannel((prev) => (prev + 1) % 5);
    }, 6000);
    return () => clearInterval(interval);
  }, [isTvAutoLoop]);

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

  const tipChannels = [
    {
      id: '01',
      title: 'OFFICIAL PLAY COMP HANDBOOK DESK',
      tag: 'START HERE',
      bgAccent: 'bg-[#ffd23f]/10',
      accentText: 'text-[#ffd23f]',
      borderAccent: 'border-[#ffd23f]',
      text: "Greetings champion! Tap the help desk icon or any building zone above to start thy tour. Free chips replenish instantly on claim. Zero crypto wallet or credit card is required to compete!",
      renderGraphic: (tick: number) => {
        const blink = tick % 3 === 0;
        const wave = tick % 2 === 0;
        return (
          <svg viewBox="0 0 80 80" className="w-24 h-24 image-rendering-pixelated">
            {/* Ground / Desk shadow base line */}
            <rect x="10" y="66" width="60" height="4" fill="#7a4b28" />
            <rect x="15" y="70" width="50" height="2" fill="#ff9f00" />
            
            {/* The Counselor Help Desk structure */}
            <rect x="16" y="44" width="48" height="22" fill="#1e1505" stroke="#ffd23f" strokeWidth="2" />
            
            {/* Front Desk Pattern / Info plate */}
            <rect x="22" y="48" width="36" height="12" fill="#0d0d1a" stroke="#ff9f00" strokeWidth="1" />
            
            {/* Pixel Art 'INFO' lettering on the desk sign */}
            {/* I */}
            <rect x="25" y="52" width="2" height="4" fill="#ffd23f" />
            {/* N */}
            <path d="M29 52 L29 56 M29 52 L32 56 M32 52 L32 56" stroke="#ffd23f" strokeWidth="1" />
            {/* F */}
            <path d="M35 52 L35 56 M35 52 L38 52 M35 54 L37 54" stroke="#ffd23f" strokeWidth="1" />
            {/* O */}
            <rect x="41" y="52" width="4" height="4" fill="none" stroke="#ffd23f" strokeWidth="1" />
            
            {/* The Little Mascot Robot standing/sitting behind the desk */}
            <g transform="translate(0, -2)">
              {/* Robot Head */}
              <rect x="28" y="22" width="24" height="22" fill="#2d1f0d" stroke="#ffd23f" strokeWidth="1.5" />
              {/* Ears */}
              <rect x="24" y="28" width="4" height="8" fill="#ff9f00" />
              <rect x="52" y="28" width="4" height="8" fill="#ff9f00" />
              {/* Antenna */}
              <rect x="38" y="14" width="4" height="8" fill="#ffd23f" />
              <circle cx="40" cy="11" r="2.5" fill={blink ? '#f2ead3' : '#ffd23f'} />
              
              {/* Eyes */}
              <rect x="32" y="28" width="6" height="6" fill="#000000" stroke="#ffd23f" strokeWidth="1" />
              <rect x="42" y="28" width="6" height="6" fill="#000000" stroke="#ffd23f" strokeWidth="1" />
              {!blink && (
                <>
                  <rect x="34" y="30" width="2" height="2" fill="#ffd23f" />
                  <rect x="44" y="30" width="2" height="2" fill="#ffd23f" />
                </>
              )}
              
              {/* Waving Arm / Hands */}
              {wave ? (
                <g>
                  {/* Arm raised up */}
                  <path d="M52 34 L58 26 L60 28" stroke="#ffd23f" strokeWidth="2.5" fill="none" strokeLinecap="square" />
                  <rect x="58" y="22" width="4" height="4" fill="#f2ead3" />
                </g>
              ) : (
                <g>
                  {/* Arm resting on desk */}
                  <path d="M52 34 L56 38 L54 42" stroke="#ff9f00" strokeWidth="2.5" fill="none" strokeLinecap="square" />
                  <rect x="52" y="42" width="4" height="4" fill="#ff9f00" />
                </g>
              )}
            </g>
          </svg>
        );
      }
    },
    {
      id: '02',
      title: 'DAILY STREAK COIN DISPENSER',
      tag: 'DAILY REWARD',
      bgAccent: 'bg-[#ff9f00]/10',
      accentText: 'text-[#ff9f00]',
      borderAccent: 'border-[#ff9f00]',
      text: "Claim thy daily play coins in the 'Daily Loot' chest! Each consecutive day increases thy streak multiplier up to x7. If thy streak is maintained, you secure higher free credits every single cycle!",
      renderGraphic: (tick: number) => {
        const isChestOpen = tick % 2 === 0;
        return (
          <svg viewBox="0 0 80 80" className="w-24 h-24 image-rendering-pixelated">
            <rect x="10" y="65" width="60" height="6" fill="#7a4b28" />
            <rect x="15" y="71" width="50" height="3" fill="#ff9f00" />
            {isChestOpen ? (
              <g transform="translate(0, -2)">
                <rect x="20" y="38" width="40" height="24" fill="#7a4b28" stroke="#ffd23f" strokeWidth="2" />
                <rect x="24" y="42" width="32" height="16" fill="#0d0d1a" />
                <rect x="36" y="44" width="8" height="12" fill="#ffd23f" />
                <path d="M16 34 L40 12 L64 34 Z" fill="#ffd23f" stroke="#e8e8e8" strokeWidth="2" />
                <rect x="38" y="16" width="4" height="4" fill="#ffd23f" className={tick === 0 ? "opacity-100" : "opacity-40"} />
                <rect x="28" y="24" width="4" height="4" fill="#ff9f00" className={tick === 1 ? "opacity-100" : "opacity-40"} />
                <rect x="48" y="22" width="4" height="4" fill="#ffd23f" className={tick === 2 ? "opacity-100" : "opacity-40"} />
                <rect x="42" y="8" width="3" height="3" fill="#f2ead3" className={tick === 3 ? "opacity-100" : "opacity-40"} />
              </g>
            ) : (
              <g transform={`translate(0, ${tick % 2 === 1 ? -4 : 0})`}>
                <rect x="20" y="38" width="40" height="24" fill="#7a4b28" stroke="#ffd23f" strokeWidth="2" />
                <rect x="20" y="28" width="40" height="10" fill="#ffd23f" stroke="#e8e8e8" strokeWidth="2" />
                <rect x="37" y="34" width="6" height="8" fill="#111111" stroke="#ffd23f" strokeWidth="1.5" />
                <circle cx="40" cy="48" r="2" fill="#ffd23f" />
                <g className={tick % 2 === 0 ? "opacity-100" : "opacity-0"}>
                  <rect x="14" y="22" width="2" height="2" fill="#ffd23f" />
                  <rect x="64" y="26" width="2" height="2" fill="#ffd23f" />
                </g>
              </g>
            )}
          </svg>
        );
      }
    },
    {
      id: '03',
      title: 'ARCADE CABINET PAVILION',
      tag: 'MULTIPLY COMP',
      bgAccent: 'bg-[#ff9f00]/10',
      accentText: 'text-[#ffd23f]',
      borderAccent: 'border-[#ff9f00]',
      text: "The Coin-Op Arcade hosts multiple games to multiply thy tokens! Spin the 3-Reel Slots, bet on the Pachinko board, scratch secret matrix grids, or duel the high-ratio Wheel of Comp. Perfect for testing your luck!",
      renderGraphic: (tick: number) => {
        const frameOffset = (tick * 8) % 24;
        return (
          <svg viewBox="0 0 80 80" className="w-24 h-24 image-rendering-pixelated">
            <rect x="18" y="10" width="44" height="60" fill="#1e1505" stroke="#ffd23f" strokeWidth="2" />
            <rect x="21" y="13" width="38" height="10" fill={tick % 2 === 0 ? '#ff9f00' : '#0d0d1a'} />
            <rect x="28" y="16" width="24" height="4" fill="#ffd23f" />
            <rect x="23" y="26" width="34" height="24" fill="black" stroke="#ff9f00" strokeWidth="1.5" />
            <g clipPath="url(#screen-clip-tv-gold)">
              <defs>
                <clipPath id="screen-clip-tv-gold">
                  <rect x="24" y="27" width="32" height="22" />
                </clipPath>
              </defs>
              <g transform={`translate(0, ${frameOffset - 24})`}>
                <rect x="26" y="0" width="8" height="8" fill="#ffd23f" />
                <rect x="37" y="10" width="8" height="8" fill="#7a4b28" />
                <rect x="48" y="20" width="8" height="8" fill="#ff9f00" />
                <rect x="26" y="24" width="8" height="8" fill="#e8e8e8" />
                <rect x="37" y="34" width="8" height="8" fill="#ffd23f" />
                <rect x="48" y="44" width="8" height="8" fill="#7a4b28" />
                <rect x="26" y="48" width="8" height="8" fill="#ff9f00" />
                <rect x="37" y="58" width="8" height="8" fill="#e8e8e8" />
                <rect x="48" y="68" width="8" height="8" fill="#ffd23f" />
              </g>
              <rect x="24" y="37" width="32" height="2" fill="#ffd23f" className="opacity-80" />
            </g>
            <rect x="21" y="54" width="38" height="6" fill="#ffd23f" />
            <circle cx="28" cy="57" r="1.5" fill="#7a4b28" />
            <circle cx="36" cy="57" r="1.5" fill="#ffd23f" />
            <circle cx="44" cy="57" r="1.5" fill="#ff9f00" />
          </svg>
        );
      }
    },
    {
      id: '04',
      title: 'TEXAS HOLDEM STRATEGIES',
      tag: 'DUEL DEMO',
      bgAccent: 'bg-[#ffd23f]/10',
      accentText: 'text-[#ffd23f]',
      borderAccent: 'border-[#ff9f00]',
      text: "Step inside the Poker Saloon to play standard Texas Hold'em against computer-guided dealers. No real money or registrations are involved. Ideal for learning cards, sizing odds, and refining thy bluffing strategy!",
      renderGraphic: (tick: number) => {
        const flip = tick % 2 === 0;
        return (
          <svg viewBox="0 0 80 80" className="w-24 h-24 image-rendering-pixelated">
            <rect x="10" y="10" width="60" height="60" fill="#2d1f0d" stroke="#ff9f00" strokeWidth="2.5" />
            <rect x="30" y="15" width="20" height="6" fill="#111111" />
            <circle cx="35" cy="18" r="1.5" fill="#ffd23f" />
            <circle cx="40" cy="18" r="1.5" fill="#ffd23f" />
            <circle cx="45" cy="18" r="1.5" fill="#ffd23f" />
            <g transform="translate(18, 28)">
              <rect x="0" y="0" width="18" height="26" fill="#f2ead3" stroke="black" strokeWidth="1" />
              <rect x="3" y="3" width="2" height="2" fill="#ff9f00" />
              <rect x="13" y="21" width="2" height="2" fill="#ff9f00" />
              <rect x="7" y="10" width="4" height="6" fill="#ff9f00" />
              <rect x="6" y="11" width="6" height="4" fill="#ff9f00" />
            </g>
            <g transform={`translate(${flip ? 44 : 40}, ${flip ? 28 : 24})`}>
              {flip ? (
                <g>
                  <rect x="0" y="0" width="18" height="26" fill="#f2ead3" stroke="black" strokeWidth="1" />
                  <rect x="3" y="3" width="2" height="2" fill="#0d0d1a" />
                  <rect x="7" y="10" width="4" height="6" fill="#0d0d1a" />
                  <rect x="6" y="12" width="6" height="3" fill="#0d0d1a" />
                  <rect x="8" y="16" width="2" height="2" fill="#0d0d1a" />
                </g>
              ) : (
                <g>
                  <rect x="0" y="0" width="18" height="26" fill="#ff9f00" stroke="black" strokeWidth="1" />
                  <rect x="3" y="3" width="12" height="20" fill="#7a4b28" />
                  <line x1="5" y1="5" x2="13" y2="21" stroke="#ffd23f" strokeWidth="1.5" strokeDasharray="2 2" />
                </g>
              )}
            </g>
          </svg>
        );
      }
    },
    {
      id: '05',
      title: 'CASHIER REFILL INJECTOR',
      tag: 'BANKROLL TWEAK',
      bgAccent: 'bg-[#ff9f00]/10',
      accentText: 'text-[#ffd23f]',
      borderAccent: 'border-[#ff9f00]',
      text: "Didst thou face a streak of cold hands and hit zero? Fear not, pilot! Simply visit the 'Settings Vault' (the gear icon below) and activate the Cashier Injector to immediately regenerate a fresh starting bankroll of play coins!",
      renderGraphic: (tick: number) => {
        const chargingLevel = (tick % 4) + 1;
        return (
          <svg viewBox="0 0 80 80" className="w-24 h-24 image-rendering-pixelated">
            <rect x="25" y="18" width="30" height="48" fill="#1a1a2e" stroke="#ffd23f" strokeWidth="3" />
            <rect x="35" y="13" width="10" height="5" fill="#ffd23f" />
            {chargingLevel >= 1 && <rect x="29" y="54" width="22" height="8" fill="#7a4b28" />}
            {chargingLevel >= 2 && <rect x="29" y="44" width="22" height="8" fill="#8a6b10" />}
            {chargingLevel >= 3 && <rect x="29" y="34" width="22" height="8" fill="#ff9f00" />}
            {chargingLevel >= 4 && <rect x="29" y="24" width="22" height="8" fill="#ffd23f" />}
            <g className={tick % 2 === 0 ? 'opacity-100' : 'opacity-50'}>
              <polygon points="40,24 45,34 38,34 41,48 35,36 41,36" fill="#ffffff" stroke="black" strokeWidth="1" />
            </g>
          </svg>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Dynamic Keyframes injected locally for stepped low frame-rate feel */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neon-flicker-gold-slow {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            filter: drop-shadow(0 0 4px #ff9f00);
            opacity: 1;
          }
          20%, 24%, 55% {
            filter: none;
            opacity: 0.6;
          }
        }
        @keyframes neon-flicker-gold-fast {
          0%, 14%, 16%, 18%, 20%, 64%, 66%, 100% {
            filter: drop-shadow(0 0 4px #ffc04d);
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
        .flicker-neon-gold-slow {
          animation: neon-flicker-gold-slow 6s infinite steps(2);
        }
        .flicker-neon-gold-fast {
          animation: neon-flicker-gold-fast 5s infinite steps(2);
        }
        .spotlight-lens {
          animation: spotlight-sweep 10s infinite ease-in-out;
        }
      `}} />

      {/* 1. ARCHITECTURALLY HONEST MARQUEE TITLE BOARD */}
      <div className="border-3 border-[#ff9f00] bg-[#111111] p-5 filter drop-shadow-[4px_4px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Repeating dot canvas matrix inside the card */}
        <div className="absolute inset-0 bg-black opacity-40 pixel-checker pointer-events-none" />
        
        {/* Title Content */}
        <div className="relative z-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-3xl font-jersey text-[#ff9f00] animate-bounce">★</span>
            <h1 className="text-4xl font-jersey tracking-wider uppercase text-white m-0 leading-none">
              8BIT CASINO CONCOURSE
            </h1>
            <span className="text-3xl font-jersey text-[#ff9f00] animate-bounce" style={{ animationDelay: '0.2s' }}>★</span>
          </div>
          <p className="font-jersey text-lg text-white/60 uppercase mt-1 m-0">
            Welcome, <span className="text-[#ff9f00]">{profile.name}</span> • Portrait spec: <span className="text-white font-bold">CHAMPION {profile.avatarId}</span> • Current streak: <span className="text-[#ff9f00]">{profile.dailyStreak} days</span>
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
      <div className="border-2 border-[#ff9f00] bg-[#ff9f00]/10 px-4 py-2 flex items-center justify-between gap-4 text-xs font-mono uppercase text-[#ff9f00]">
        <div className="flex items-center gap-2">
          <span className="bg-[#ff9f00] text-black px-1 font-jersey text-md leading-none py-0.5 font-bold">★ PLAY-MONEY COMPLIANCE ★</span>
          <span>Fictional arcade simulator tokens. No crypto or cash is allowed, bought or exchanged.</span>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE 8-BIT CASINO FLOOR */}
      <div className="border-4 border-[#ff9f00]/60 bg-black relative p-6 flex flex-col justify-start gap-4 overflow-hidden filter drop-shadow-[6px_6px_0px_#000]">
        
        {/* Floor grid visualizer: repeating 8-bit carpet cross lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: `
          radial-gradient(circle, #ff9f00 1.5px, transparent 1.5px),
            radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)
          `,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }} />

        {/* Ambient spotlight overlay scanning floor */}
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden z-10 select-none">
          <div className="spotlight-lens absolute top-[-50px] left-1/3 w-96 h-[600px] bg-gradient-to-b from-[#ff9f00]/10 to-transparent transform -rotate-12 origin-top" />
          <div className="spotlight-lens absolute top-[-50px] right-1/3 w-96 h-[600px] bg-gradient-to-b from-white/5 to-transparent transform rotate-12 origin-top" style={{ animationDelay: '4s' }} />
        </div>

        {/* Flashing signs above the floor */}
        <div className="flex justify-between items-center z-10 select-none pointer-events-none mb-4">
          <div className="border border-[#ff9f00] bg-black px-2 py-1 text-xs text-[#ff9f00] uppercase font-jersey tracking-wider flicker-neon-gold-slow">
            ◆ CASINO MAIN CONCOURSE ◆
          </div>
          <div className="border border-[#ff9f00] bg-black px-2 py-1 text-xs text-[#ff9f00] uppercase font-jersey tracking-wider flicker-neon-gold-fast">
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
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-[#ff9f00] bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ff9f00] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ff9f00] uppercase tracking-wide flex justify-between items-center">
              <span>★ POKER SALOON ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-1 font-bold animate-pulse">LIVE</span>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Saloon SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />
                {/* Saloon wood trims */}
                <div className="absolute top-0 inset-x-0 h-4 bg-[#222222] border-b-2 border-black flex justify-around items-center">
                  <div className="w-2 h-2 bg-[#ff9f00] animate-pulse" />
                  <div className="w-2 h-2 bg-[#ff9f00] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <div className="w-2 h-2 bg-[#ff9f00] animate-pulse" style={{ animationDelay: '0.8s' }} />
                </div>
                {/* Saloon double doors */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-16 bg-[#111111] border-t-2 border-r border-l border-white/30 flex">
                  <div className="w-1/2 h-full border-r border-black/40 bg-black flex items-center justify-end pr-1">
                    <div className="w-1.5 h-6 bg-[#ff9f00]/30 border border-black/40" />
                  </div>
                  <div className="w-1/2 h-full bg-black flex items-center justify-start pl-1">
                    <div className="w-1.5 h-6 bg-[#ff9f00]/30 border border-black/40" />
                  </div>
                </div>
                {/* Cards icons floating */}
                <div className={`absolute left-4 top-8 w-7 h-10 bg-white border-2 border-black rotate-12 flex items-center justify-center font-sans font-bold text-xs text-[#ff9f00] ${animationTick % 2 === 0 ? 'translate-y-[-2px]' : 'translate-y-[2px]'}`}>
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
                  <span className="text-[#ff9f00]">◆ OPEN ◆</span>
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
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-[#3fff6e] bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ff9f00] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ff9f00] uppercase tracking-wide flex justify-between items-center">
              <span>★ ARCADE PAVILION ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-1 font-bold">SPIN</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Arcade SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none" />
                
                {/* Arcade Cabinets */}
                <div className="absolute bottom-0 left-4 w-12 h-24 bg-[#ff9f00] border-t-2 border-x-2 border-black flex flex-col justify-between">
                  <div className="h-6 bg-black m-1 border border-white/30 flex items-center justify-center">
                    <span className="text-[9px] text-white font-jersey animate-pulse">777 SLOTS</span>
                  </div>
                  <div className="h-2 bg-[#ff9f00] m-1 border border-black flex justify-around">
                    <div className="w-1 bg-white h-2 transform -translate-y-1" />
                    <div className="w-1.5 h-1.5 bg-black" />
                  </div>
                </div>

                <div className="absolute bottom-0 right-4 w-12 h-24 bg-[#222222] border-t-2 border-x-2 border-white flex flex-col justify-between">
                  <div className="h-6 bg-black m-1 border border-[#ff9f00]/40 flex items-center justify-center">
                    <span className="text-[9px] text-[#ff9f00] font-jersey animate-ping" style={{ animationDuration: '3s' }}>WHEEL</span>
                  </div>
                  <div className="h-2 bg-white m-1 border border-black flex justify-around">
                    <div className="w-1 bg-[#ff9f00] h-2 transform -translate-y-1" />
                    <div className="w-1.5 h-1.5 bg-[#ff9f00]" />
                  </div>
                </div>

                {/* Animated light bars */}
                <div className="absolute top-2 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff9f00] via-white to-[#ff9f00] animate-pulse" />
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="font-jersey text-lg text-white leading-tight uppercase">
                  SPIN THE SLOTS REELS AND ROOTS WHEEL TO DOUBLE CHIPS SECURELY.
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 02</span>
                  <span className="text-[#ff9f00]">◆ READY ◆</span>
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
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-[#ff9f00] bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ff9f00] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ff9f00] uppercase tracking-wide flex justify-between items-center">
              <span>★ CASHIER VAULT ★</span>
              <span className="text-xs bg-black text-[#ff9f00] px-1 font-bold">INFO</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Vault SVG Illustration */}
              <div className="h-32 bg-black border-2 border-white/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
                
                {/* Vault Door Circular lock and indicators */}
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#ff9f00]/30 flex items-center justify-center animate-spin" style={{ animationDuration: '16s' }} />
                
                {/* Solid Vault safe gate */}
                <div className="absolute w-12 h-16 bg-[#111111] border-2 border-white/40 flex flex-col justify-between p-1">
                  <div className="h-3 w-full bg-white animate-pulse" />
                  <div className="h-3 w-full bg-[#ff9f00] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <div className="h-3 w-full bg-[#ff9f00] animate-pulse" style={{ animationDelay: '0.8s' }} />
                </div>
                
                {/* Stacks of gold blocks at foot */}
                <div className="absolute bottom-1 right-2 w-10 h-6 flex flex-wrap gap-1">
                  <div className="w-4 h-2 bg-[#ff9f00] border border-black" />
                  <div className="w-4 h-2 bg-white border border-black" />
                  <div className="w-4 h-2 bg-[#ff9f00] border border-black" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="font-jersey text-lg text-white leading-tight uppercase">
                  TWEAK VOLUME HARDWARE, UPDATE AVATARS AND VIEW BANK STATS.
                </p>
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 03</span>
                  <span className="text-[#ff9f00]">◆ ACCS ◆</span>
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
            className="group cursor-pointer transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] border-3 border-[#ff3f3f] bg-[#111111] transition-all duration-75 relative flex flex-col h-full"
            style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
          >
            {/* Header band */}
            <div className="bg-[#ff9f00] text-[#0d0d1a] font-jersey text-xl py-1 px-3 border-b-3 border-[#ff9f00] uppercase tracking-wide flex justify-between items-center">
              <span>★ DAILY LOOT ★</span>
              <span className="text-xs bg-[#0d0d1a] text-[#ff9f00] px-1 font-bold">BONUS</span>
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
                      <path d="M4 16 L20 4 L36 16 Z" fill="#ff9f00" stroke="black" strokeWidth="2" />
                      <rect x="18" y="16" width="4" height="6" fill="#ff9f00" />
                      {/* Empty interior shadow */}
                      <rect x="8" y="18" width="24" height="12" fill="black" />
                    </svg>
                  ) : (
                    /* Closed Glowing/Bouncing Chest */
                    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                      <rect x="4" y="12" width="32" height="20" fill="#ff9f00" stroke="black" strokeWidth="2" />
                      <rect x="4" y="4" width="32" height="8" fill="#111111" stroke="black" strokeWidth="2" />
                      <rect x="17" y="10" width="6" height="6" fill="white" stroke="black" strokeWidth="1" />
                      {/* Sparkles */}
                      {animationTick % 2 === 0 && <circle cx="6" cy="6" r="2" fill="white" />}
                      {animationTick % 2 === 1 && <circle cx="34" cy="8" r="2" fill="#ff9f00" />}
                    </svg>
                  )}
                </div>

                {/* Sparkling dots drifting upwards */}
                {!isClaimedToday() && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-1 h-1 bg-[#ff9f00] animate-ping top-6 left-1/4" />
                    <div className="absolute w-1.5 h-1.5 bg-white animate-ping top-10 right-1/4" style={{ animationDelay: '0.5s' }} />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-left">
                {isClaimedToday() ? (
                  <div className="bg-black border border-[#ff9f00] px-2 py-1 text-center font-jersey text-md text-[#ff9f00]">
                    TIMER COOLDOWN: {timeLeftStr || "HH:MM:SS"}
                  </div>
                ) : (
                  <p className="font-jersey text-lg text-[#ff9f00] leading-tight uppercase animate-pulse">
                    ★ TREASURE CHEST UNLOCKED! CLAIM NOW FOR DAILY COMP COINS.
                  </p>
                )}
                <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase pt-1 border-t border-white/10">
                  <span>BAY POSITION: 04</span>
                  <span className={isClaimedToday() ? 'text-white/40' : 'text-[#ff9f00]'}>
                    {isClaimedToday() ? '◆ COOLDOWN ◆' : '◆ READY ◆'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>

      {/* 4. 8-BIT CONCOURSE INFOTAINMENT BROADCAST & HANDBOOK */}
      <div 
        className="border-4 border-[#ff9f00]/50 bg-[#111111] p-5 md:p-6 relative filter drop-shadow-[6px_6px_0px_#000] animate-fade-in"
        style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
      >
        {/* Repeating dot matrix background */}
        <div className="absolute inset-0 bg-[#121224] opacity-25 pixel-checker pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row items-stretch gap-6">
          
          {/* LEFT COLUMN: THE RETRO CRT TELEVISION CONSOLE */}
          <div className="w-full xl:w-[400px] shrink-0 flex flex-col">
            <div className="text-xs font-jersey text-[#ff9f00] mb-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ffd23f] inline-block animate-pulse" />
              <span>LIVE CONCOURSE FEED // CRT_CH_{tipChannels[activeTipChannel].id}</span>
            </div>
            
            {/* The TV bezel frame */}
            <div 
              className="border-4 border-[#3a3a4c] bg-[#222230] p-4 flex flex-col justify-between relative filter drop-shadow-[4px_4px_0px_#000] flex-1"
              style={{ clipPath: 'polygon(8px 0px, 100% 0px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0px 100%, 0px 8px)' }}
            >
              {/* Inner CRT Screen Slot */}
              <div 
                className="bg-[#0c0d1a] border-4 border-[#05050c] p-4 flex items-center justify-center relative overflow-hidden h-[180px] sm:h-[220px]"
                style={{ clipPath: 'polygon(6px 0px, 100% 0px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0px 100%, 0px 6px)' }}
              >
                {/* Scanlines Effect Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10 opacity-35 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.45)_50%),_linear-gradient(90deg,rgba(255,210,63,0.06),rgba(255,159,0,0.02),rgba(255,210,63,0.06))] bg-[size:100%_4px,3px_100%]" 
                />
                
                {/* Horizontal Scrolling Warning/Text Ticker banner */}
                <div className="absolute top-2 inset-x-0 bg-black/40 border-y border-[#ff9f00]/20 py-0.5 z-10 text-center">
                  <span className="font-jersey text-xs text-[#ffd23f] tracking-wider uppercase animate-pulse">
                    ★ CHIP EMULATOR TELEMETRY BROADCAST ★
                  </span>
                </div>
                
                {/* Render the selected dynamic pixel-art graphic loop */}
                <div className="relative z-10 transform scale-110 sm:scale-125 select-none pointer-events-none">
                  {tipChannels[activeTipChannel].renderGraphic(animationTick)}
                </div>
                
                {/* Low Signal Phosphor static vignette or neon status badge */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 border border-[#ff9f00]/20 font-mono text-[9px] text-[#ffd23f] z-10 uppercase">
                  SIG: 100% COMP
                </div>
                
                {/* CRT screen curved reflection overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
              </div>
              
              {/* Retro Dial Controls below screen */}
              <div className="mt-3 pt-3 border-t-2 border-[#3a3a4c] flex items-center justify-between font-jersey text-xs text-[#5a5a72]">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase tracking-wide">VOL</span>
                    {/* Retro Dial dial notch */}
                    <div className="w-6 h-6 rounded-none bg-[#11111b] border-2 border-[#5a5a72] relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#ffd23f]" />
                      <div className="absolute top-0 w-0.5 h-1.5 bg-white/40" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase tracking-wide">BRIGHT</span>
                    <div className="w-6 h-6 rounded-none bg-[#11111b] border-2 border-[#5a5a72] relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#ff9f00]" />
                      <div className="absolute left-0 w-1.5 h-0.5 bg-white/40" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ffd23f] animate-pulse">●</span>
                  <span className="uppercase text-white tracking-widest text-[11px]">8BIT_SYS_ONLINE</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN: INFOTAINMENT TIP DESCRIPTION & SELECTOR TABS */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            
            {/* Labeled Header info plaque */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[#ffd23f] text-2xl font-jersey">◆</span>
                <span className={`font-jersey text-xs uppercase tracking-widest px-2 py-0.5 ${tipChannels[activeTipChannel].bgAccent} ${tipChannels[activeTipChannel].accentText} border ${tipChannels[activeTipChannel].borderAccent}`}>
                  {tipChannels[activeTipChannel].tag}
                </span>
                <span className="font-jersey text-xs text-white/40 uppercase">
                  CHANNEL {tipChannels[activeTipChannel].id} / 05
                </span>
              </div>
              
              <div>
                <h4 className="text-3xl font-jersey text-white uppercase m-0 tracking-wide leading-tight">
                  {tipChannels[activeTipChannel].title}
                </h4>
              </div>
              
              {/* Decorative dividing line */}
              <div className="h-1 bg-gradient-to-r from-[#ffd23f]/40 via-[#ffd23f]/10 to-transparent flex gap-1">
                <div className="w-8 h-full bg-[#ff9f00]" />
                <div className="w-4 h-full bg-[#ffd23f]" />
              </div>
              
              <p className="font-jersey text-xl text-[#e8e8e8] uppercase leading-snug m-0 min-h-[80px] xl:min-h-[90px]">
                {tipChannels[activeTipChannel].text}
              </p>
            </div>
            
            {/* RETRO DIAL CHANNEL CONTROLLER (Selector Buttons) */}
            <div className="space-y-3 pt-3 border-t-2 border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-jersey text-sm text-[#5a5a72] uppercase tracking-wider">
                  SELECT TUNER CHANNEL MANUALLY:
                </span>
                
                {/* Auto loop toggle switch */}
                <button 
                  onClick={() => {
                    playChime();
                    setIsTvAutoLoop(!isTvAutoLoop);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1 border-2 font-jersey text-xs uppercase cursor-pointer hover:brightness-110 active:translate-y-0.5 duration-75 select-none ${
                    isTvAutoLoop 
                      ? 'border-[#ffd23f] bg-[#ffd23f]/10 text-[#ffd23f]' 
                      : 'border-white/25 bg-black text-white/40'
                  }`}
                  style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                >
                  <span className={isTvAutoLoop ? "animate-pulse" : ""}>
                    {isTvAutoLoop ? '● TV AUTO-SCANNING' : '■ SCANNER PAUSED'}
                  </span>
                </button>
              </div>
              
              {/* Channel Selector Buttons Grid */}
              <div className="grid grid-cols-5 gap-2">
                {tipChannels.map((chan, idx) => {
                  const isSelected = activeTipChannel === idx;
                  return (
                    <PixelButton
                      key={chan.id}
                      variant={isSelected ? 'gold' : 'dark'}
                      soundType="click"
                      className="w-full text-center"
                      onClick={() => {
                        playChime();
                        setIsTvAutoLoop(false); // Pause auto scan when user selects manually
                        setActiveTipChannel(idx);
                        triggerToast(`CONNECTED TO CHANNEL ${chan.id}: ${chan.title}`, 'success');
                      }}
                      chamfer={4}
                    >
                      <div className="flex flex-col py-0.5 font-jersey items-center justify-center leading-none">
                        <span className="text-[10px] sm:text-xs text-white/30 uppercase leading-none">CH_</span>
                        <span className="text-sm sm:text-xl font-bold leading-none">{chan.id}</span>
                      </div>
                    </PixelButton>
                  );
                })}
              </div>
            </div>

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
                <path d="M4 16 L20 4 L36 16 Z" fill="#ff9f00" stroke="white" strokeWidth="2" />
                {/* Empty glow interior shadow */}
                <rect x="8" y="18" width="24" height="12" fill="#000000" />
                <circle cx="20" cy="24" r="3" fill="#ff9f00" />
              </svg>
            ) : (
              /* Closed Bouncing Sparkling Gold Box */
              <svg className="w-24 h-20 animate-bounce" viewBox="0 0 40 32" fill="none">
                <rect x="4" y="12" width="32" height="20" fill="#ff9f00" stroke="white" strokeWidth="2" />
                <rect x="4" y="4" width="32" height="8" fill="#111111" stroke="white" strokeWidth="2" />
                <rect x="17" y="10" width="6" height="6" fill="black" stroke="white" strokeWidth="1.5" />
                <circle cx="10" cy="20" r="2" fill="white" />
                <circle cx="30" cy="20" r="2" fill="#ff9f00" />
              </svg>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-jersey text-[#ff9f00] uppercase leading-none m-0">
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
              <span className="text-[#ff9f00]">{profile.dailyStreak}/7 DAYS</span>
            </div>
            <PixelProgressBar 
              value={Math.min(100, Math.round(((profile.dailyStreak || 1) / 7) * 100))} 
              max={100} 
            />
            <p className="text-xs font-mono text-white/40 uppercase mt-2 m-0">
              CONSECUTIVE STREAK MULTIPLIER: <span className="text-[#ff9f00]">x{Math.min(7, profile.dailyStreak || 1)} PLAY RATIO</span>
            </p>
          </div>

          {/* Action Row */}
          <div className="space-y-4">
            {isClaimedToday() ? (
              <div className="p-4 border-2 border-[#ff9f00] bg-[#ff9f00]/5 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-[#ff9f00] font-jersey text-xl uppercase">
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
            <HelpCircle className="w-16 h-16 text-[#ff9f00] mx-auto animate-bounce" />
            <h3 className="text-3xl font-jersey text-[#ff9f00] uppercase leading-none mt-2 m-0">
              PILOTING THE 8BIT CONSOLE
            </h3>
            <p className="text-md font-jersey text-white/40 uppercase leading-snug mt-1 m-0">
              Understanding the gameplay systems and regulations of the Concourse Map
            </p>
          </div>

          {/* The modular guides */}
          <div className="space-y-4 font-jersey text-lg uppercase text-[#e8e8e8]">
            
            <div className="border border-white/20 p-3 bg-black">
              <div className="flex items-center gap-2 text-[#ff9f00]">
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
              <div className="flex items-center gap-2 text-[#ff9f00]">
                <Trophy className="w-5 h-5" />
                <span>3. MULTIPLAYER POKER SALOONS</span>
              </div>
              <p className="text-sm text-[#e8e8e8]/80 mt-1 leading-snug">
                Take chips to the Poker Saloon. Join standard virtual Texas Hold&apos;em poker tables and pit thy wits against smart local computer dealers to master chip mathematics and poker strategies!
              </p>
            </div>

            <div className="border border-[#ff9f00] p-4 bg-[#ff9f00]/5 text-[#ff9f00]">
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
