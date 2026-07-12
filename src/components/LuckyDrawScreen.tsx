/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton } from './PixelUI';
import { avatars, PixelAvatar } from '../lib/avatars';
import { ArrowLeft, Landmark, Ticket, HelpCircle, Users, Trophy, MessageSquare, AlertCircle } from 'lucide-react';
import { audio } from '../lib/audio';

// ==========================================
// LUCKY DRAW SETTINGS & METADATA
// ==========================================
const TICKET_PRICE = 0.20; // $0.20 per ticket
const HOUSE_RAKE = 0.05;   // 5% house rake
const GAME_RTP = 95.0;     // 95% RTP (transparent)

interface Entrant {
  name: string;
  avatarId: number;
  tickets: number;
  isPlayer: boolean;
}

interface DrawHistoryItem {
  drawId: number;
  winnerName: string;
  winnerAvatarId: number;
  winnerIsPlayer: boolean;
  prizePool: number;
  totalTickets: number;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatarId: number;
  message: string;
  isSystem: boolean;
  time: string;
}

const BOT_USERNAMES = [
  '8BIT_CHAMP', 'PIXEL_BOSS', 'RETRO_KID', 'CHIP_STACKER', 'NEON_RIDER',
  'CYBER_PUNK', 'GOLD_MINER', 'ROBO_RAIDER', 'CHIP_CHAMP', 'ARCADE_QUEEN',
  'VECTORS_RULE', 'BIT_CHIPS', 'LUCKY_LARRY', 'DEALER_DAISY', 'NEON_JOE'
];

const CHAT_PHRASES = [
  'Let\'s win this draw! 🚀',
  'Bought a bunch of tickets! Feelin\' lucky.',
  'Good luck everyone! 🍀',
  'Who is taking the jackpot this time?',
  '0.20 chips is such a steal.',
  'My pixels are tingling... 🏆',
  'Another draw, let\'s go!',
  'That prize pool is growing fast!',
  'May the 8-bit gods be with us!'
];

// Custom 8-bit Synth for audio cues routed through global audio engine
const drawSynth = {
  buyTicket: () => {
    audio.playCoinGain();
  },
  tumblerTick: (freq = 440) => {
    audio.playBeep(freq, 50, 0.08, 'square');
  },
  winnerReveal: () => {
    audio.playWinMedium();
  }
};

// Seeded random helper for deterministic bot buys
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const LuckyDrawScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, adjustBalance, triggerToast } = useStore();

  // Draw timing states based on implicit 90-second synchronization cycle
  // Seconds 0 to 10: Winner Screen
  // Seconds 10 to 70: Open Ticket Buying Phase (60 seconds)
  // Seconds 70 to 80: Locked Drawing Countdown Phase (10 seconds)
  // Seconds 80 to 85: Drum-roll Tumbler Phase (5 seconds)
  // Seconds 85 to 90: Buffer/Pre-reveal
  const [cycleTime, setCycleTime] = useState<number>(0);
  const [currentDrawId, setCurrentDrawId] = useState<number>(0);
  
  // Player bought tickets for current draw
  const [playerTickets, setPlayerTickets] = useState<number>(0);
  const [isBuying, setIsBuying] = useState<boolean>(false);

  // Chat message feed
  const [chats, setChats] = useState<ChatMessage[]>([]);
  // Local history of past draws in this session
  const [history, setHistory] = useState<DrawHistoryItem[]>([]);

  // Drum-roll tumbler animation values
  const [tumblerIndex, setTumblerIndex] = useState<number>(0);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Sync cycle time on second intervals
  useEffect(() => {
    const updateTime = () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const secondsInCycle = nowSec % 90;
      const drawId = Math.floor(nowSec / 90);
      
      setCycleTime(secondsInCycle);
      setCurrentDrawId(drawId);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set initial chat feed & sample historical winner logs
  useEffect(() => {
    const initialChats: ChatMessage[] = [];
    for (let i = 0; i < 4; i++) {
      const botIndex = Math.floor(seededRandom(currentDrawId - i - 1) * BOT_USERNAMES.length);
      const name = BOT_USERNAMES[botIndex];
      const avId = botIndex % 6;
      const phrase = CHAT_PHRASES[Math.floor(seededRandom(currentDrawId - i - 2) * CHAT_PHRASES.length)];
      initialChats.push({
        id: `init_${i}`,
        sender: name,
        avatarId: avId,
        message: phrase,
        isSystem: false,
        time: new Date(Date.now() - (i + 1) * 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    setChats(initialChats.reverse());

    // Setup some simulated history items
    const initialHistory: DrawHistoryItem[] = [];
    for (let i = 1; i <= 4; i++) {
      const histDrawId = currentDrawId - i;
      const winnerSeed = seededRandom(histDrawId * 5432);
      const botIdx = Math.floor(winnerSeed * BOT_USERNAMES.length);
      const totalTix = 15 + Math.floor(winnerSeed * 25);
      initialHistory.push({
        drawId: histDrawId,
        winnerName: BOT_USERNAMES[botIdx],
        winnerAvatarId: botIdx % 6,
        winnerIsPlayer: false,
        prizePool: Number((totalTix * TICKET_PRICE * (1 - HOUSE_RAKE)).toFixed(2)),
        totalTickets: totalTix,
        timestamp: new Date(Date.now() - i * 90000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    setHistory(initialHistory);
  }, []);

  // Fetch or reset player's ticket counts whenever the drawId advances
  useEffect(() => {
    const savedTickets = localStorage.getItem(`lucky_draw_tix_${currentDrawId}`);
    if (savedTickets) {
      setPlayerTickets(parseInt(savedTickets, 10));
    } else {
      setPlayerTickets(0);
    }
  }, [currentDrawId]);

  // Generate bot buy-ins deterministically within current drawId
  // This builds a consistent simulation: as time counts down from 10 to 70 in cycle,
  // bots make incremental purchases that look real and are identical if the page refreshes!
  const getEntrants = (): Entrant[] => {
    const list: Entrant[] = [];

    // First add the player if they have tickets
    if (profile.isLoggedIn && playerTickets > 0) {
      list.push({
        name: profile.name || 'GUEST PLAYER',
        avatarId: profile.avatarId,
        tickets: playerTickets,
        isPlayer: true
      });
    }

    // Add deterministic bot entrants
    // We determine bots based on currentDrawId
    const maxBots = 6 + (currentDrawId % 6); // 6 to 11 bots
    for (let i = 0; i < maxBots; i++) {
      const botSeed = currentDrawId + i * 13;
      const botIdx = Math.floor(seededRandom(botSeed) * BOT_USERNAMES.length);
      const botName = BOT_USERNAMES[botIdx];
      const botAvatarId = botIdx % 6;

      // Define purchase time in cycle (between cycle seconds 12 and 68)
      const buyTime = 12 + Math.floor(seededRandom(botSeed + 5) * 56);
      
      // If cycleTime is past this bot's purchase time, they have bought tickets!
      if (cycleTime >= buyTime) {
        const ticketCount = 1 + Math.floor(seededRandom(botSeed + 9) * 4); // 1 to 4 tickets
        list.push({
          name: botName,
          avatarId: botAvatarId,
          tickets: ticketCount,
          isPlayer: false
        });
      }
    }

    return list;
  };

  const entrants = getEntrants();
  const totalTickets = entrants.reduce((sum, e) => sum + e.tickets, 0);
  const totalChipsPool = totalTickets * TICKET_PRICE;
  const netPrizePool = Number((totalChipsPool * (1 - HOUSE_RAKE)).toFixed(2));
  const playerProbability = totalTickets > 0 ? ((playerTickets / totalTickets) * 100).toFixed(1) : '0.0';

  // Compute list of all ticket objects for grid and weighted selection
  const getAllTicketsList = () => {
    const tickets: { owner: string; avatarId: number; isPlayer: boolean; ticketIndex: number }[] = [];
    let counter = 0;
    entrants.forEach(e => {
      for (let i = 0; i < e.tickets; i++) {
        tickets.push({
          owner: e.name,
          avatarId: e.avatarId,
          isPlayer: e.isPlayer,
          ticketIndex: counter++
        });
      }
    });
    return tickets;
  };

  const allTickets = getAllTicketsList();

  // Deterministically select the winning ticket index based on currentDrawId and totalTickets
  const getWinningTicketIndex = (): number => {
    if (allTickets.length === 0) return 0;
    const winSeed = currentDrawId * 98765 + allTickets.length * 321;
    return Math.floor(seededRandom(winSeed) * allTickets.length);
  };

  const winningTicketIndex = getWinningTicketIndex();
  const winnerTicket = allTickets[winningTicketIndex] || null;

  // Tumbler drum roll sound ticking during final 5 seconds (seconds 80 to 85)
  useEffect(() => {
    if (cycleTime >= 80 && cycleTime < 85 && allTickets.length > 0) {
      const tickTimer = setInterval(() => {
        setTumblerIndex(prev => (prev + 1) % allTickets.length);
        drawSynth.tumblerTick(300 + Math.floor(Math.random() * 200));
      }, 100);
      return () => clearInterval(tickTimer);
    }
  }, [cycleTime, allTickets.length]);

  // Handle awarding payout to the human player if they win
  useEffect(() => {
    if (cycleTime >= 0 && cycleTime < 10 && winnerTicket && winnerTicket.isPlayer) {
      const payoutClaimedKey = `lucky_draw_claimed_${currentDrawId}`;
      const hasClaimed = localStorage.getItem(payoutClaimedKey);
      
      if (!hasClaimed) {
        localStorage.setItem(payoutClaimedKey, 'true');
        // Pay out net prize pool minus any fraction
        adjustBalance(netPrizePool, 'lucky_draw').then((success) => {
          if (success) {
            triggerToast(`★ YOU WON THE LUCKY DRAW JACKPOT! +$${netPrizePool.toFixed(2)} ★`, 'success');
            drawSynth.winnerReveal();
          }
        });
      }
    }
  }, [cycleTime, winnerTicket, currentDrawId, netPrizePool]);

  // Insert chat simulation based on bot buying actions or timer transitions
  useEffect(() => {
    if (cycleTime % 15 === 0 && cycleTime >= 10 && cycleTime <= 70) {
      // Periodic bot chatting
      const botIdx = Math.floor(Math.random() * BOT_USERNAMES.length);
      const name = BOT_USERNAMES[botIdx];
      const avId = botIdx % 6;
      const phrase = CHAT_PHRASES[Math.floor(Math.random() * CHAT_PHRASES.length)];
      
      const newChat: ChatMessage = {
        id: `chat_${Date.now()}`,
        sender: name,
        avatarId: avId,
        message: phrase,
        isSystem: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev.slice(-15), newChat]);
    } else if (cycleTime === 70) {
      // Sales closing message
      const sysChat: ChatMessage = {
        id: `sys_${Date.now()}`,
        sender: 'TICKET BOOTH',
        avatarId: 5,
        message: '🔴 TICKET WINDOW IS CLOSED! NO MORE BUY-INS FOR DRAW #' + currentDrawId,
        isSystem: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev.slice(-15), sysChat]);
    } else if (cycleTime === 80) {
      // Drum roll starting
      const sysChat: ChatMessage = {
        id: `sys_${Date.now()}`,
        sender: 'TICKET BOOTH',
        avatarId: 5,
        message: '🥁 DRUM-ROLL ENGAGED! DEPLOYING THE PIXEL TUMBLER...',
        isSystem: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev.slice(-15), sysChat]);
    }
  }, [cycleTime, currentDrawId]);

  // Auto-record draw ID entries to History list once it rolls past reveal phase
  useEffect(() => {
    if (cycleTime === 10 && winnerTicket) {
      const newHist: DrawHistoryItem = {
        drawId: currentDrawId - 1,
        winnerName: winnerTicket.owner,
        winnerAvatarId: winnerTicket.avatarId,
        winnerIsPlayer: winnerTicket.isPlayer,
        prizePool: netPrizePool,
        totalTickets: totalTickets,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newHist, ...prev.slice(0, 7)]);
    }
  }, [cycleTime, winnerTicket]);

  // Handle ticket purchase
  const handleBuyTickets = async (count: number) => {
    if (!profile.isLoggedIn) {
      triggerToast('NICKNAME REQUIRED TO JOIN DRAW!', 'error');
      return;
    }

    const cost = TICKET_PRICE * count;
    if (profile.chips < cost) {
      triggerToast('INSUFFICIENT CHIPS FOR TICKET BUY-IN!', 'error');
      return;
    }

    setIsBuying(true);
    audio.playClick();

    // Deduct cost immediately under "lucky_draw" source
    const success = await adjustBalance(-cost, 'lucky_draw');
    if (success) {
      const nextTickets = playerTickets + count;
      setPlayerTickets(nextTickets);
      localStorage.setItem(`lucky_draw_tix_${currentDrawId}`, nextTickets.toString());
      drawSynth.buyTicket();
      triggerToast(`PURCHASED ${count} DRAW TICKETS!`, 'success');

      // Add user message to chat feed
      const userChat: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: profile.name || 'YOU',
        avatarId: profile.avatarId,
        message: `Just bought ${count} ticket${count > 1 ? 's' : ''}! Let's go! 🎟️`,
        isSystem: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev.slice(-15), userChat]);
    }

    setIsBuying(false);
  };

  // Timer helpers to render visual statuses
  const isDrawWindowOpen = cycleTime >= 10 && cycleTime < 70;
  const isWarningPhase = cycleTime >= 70 && cycleTime < 80;
  const isDrumRollPhase = cycleTime >= 80 && cycleTime < 85;
  const isWinnerRevealPhase = cycleTime >= 0 && cycleTime < 10;
  const isBufferPhase = cycleTime >= 85 && cycleTime < 90;

  // Render timer label content
  const getTimerLabelAndColor = () => {
    if (isWinnerRevealPhase) {
      return { text: '★ REVEAL PHASE ★', color: 'text-[#ff9f00]', barColor: 'bg-[#ff9f00]' };
    }
    if (isDrawWindowOpen) {
      const remains = 70 - cycleTime;
      return { text: `TICKETS OPEN: ${remains}s`, color: 'text-[#3fff6e]', barColor: 'bg-[#3fff6e]' };
    }
    if (isWarningPhase) {
      const remains = 80 - cycleTime;
      return { text: `LOCKED IN: DRAW IN ${remains}s`, color: 'text-[#ff3f3f] animate-pulse', barColor: 'bg-[#ff3f3f]' };
    }
    if (isDrumRollPhase) {
      return { text: '🥁 TUMBLING... 🥁', color: 'text-[#ff9f00]', barColor: 'bg-[#ff9f00] animate-pulse' };
    }
    return { text: 'CALCULATING...', color: 'text-[#5a5a72]', barColor: 'bg-[#5a5a72]' };
  };

  const timerStatus = getTimerLabelAndColor();

  // Progress percentage for visual retro status bar
  const getProgressBarWidth = () => {
    if (isWinnerRevealPhase) return (cycleTime / 10) * 100;
    if (isDrawWindowOpen) return ((cycleTime - 10) / 60) * 100;
    if (isWarningPhase) return ((cycleTime - 70) / 10) * 100;
    if (isDrumRollPhase) return ((cycleTime - 80) / 5) * 100;
    return 100;
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto w-full">
      {/* 1. Cabinet Title Block */}
      <div 
        className="border-4 border-white bg-[#111111] p-4 relative animate-fade-in"
        style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
      >
        <div className="absolute inset-0 bg-[#0d0d1a] opacity-35 pixel-checker pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="border-3 border-[#e8e8e8] bg-[#0d0d1a] hover:bg-[#ff9f00] hover:text-[#0d0d1a] text-white p-2 flex items-center justify-center transform hover:-translate-y-1 hover:shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
              style={{ clipPath: 'polygon(8px 0px, 100% 0px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0px 100%, 0px 8px)' }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-jersey text-[#ff9f00] uppercase m-0 tracking-widest flex items-center gap-2">
                ★ 8-BIT LUCKY DRAW TERMINAL ★
              </h1>
              <p className="font-jersey text-lg text-white/60 m-0 uppercase">
                Synchronized multiplayer raffle • Dynamic payouts • Transparent 95.0% RTP compliance
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <PixelButton 
              onClick={() => {
                audio.playClick();
                setShowHowItWorks(true);
              }}
              variant="muted"
              className="text-lg py-1 px-4 font-jersey"
            >
              <HelpCircle className="w-4 h-4 mr-2 inline" /> HOW IT WORKS
            </PixelButton>
          </div>
        </div>
      </div>

      {/* 2. Sync Countdown & Progress Meter Panel */}
      <div 
        className="border-4 border-white bg-[#111111] p-4 filter drop-shadow-[4px_4px_0px_#000]"
        style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#ff9f00] animate-ping" />
            <span className="font-jersey text-2xl text-white uppercase tracking-wider">
              DRAW ID: <span className="text-[#ff9f00]">#{currentDrawId}</span>
            </span>
          </div>
          <div className="font-jersey text-3xl tracking-widest uppercase">
            STATUS: <span className={timerStatus.color}>{timerStatus.text}</span>
          </div>
        </div>
        {/* Segmented Pixel Bar */}
        <div className="h-6 bg-black border-3 border-white/20 p-1 flex relative overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${timerStatus.barColor}`}
            style={{ width: `${getProgressBarWidth()}%` }}
          />
        </div>
      </div>

      {/* 3. Core Game Grid: Left Controls, Right Ticket grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: RETAILER & REGISTRY BOOTH (4 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            className="border-4 border-white bg-[#111111] p-6 relative flex flex-col justify-between"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)', minHeight: '440px' }}
          >
            <div className="space-y-4">
              {/* Header block */}
              <div className="border-b-3 border-[#ff9f00] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-jersey text-white m-0 uppercase tracking-wider">TICKET COUNTER</h2>
                  <p className="text-[#ff9f00] font-jersey text-sm uppercase m-0">Purchase draw entries here</p>
                </div>
                <div className="p-2 border-2 border-white/20 bg-black">
                  <Ticket className="w-6 h-6 text-[#ff9f00]" />
                </div>
              </div>

              {/* Pool Values display plaques */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-white/20 bg-black p-3 text-center">
                  <div className="font-jersey text-sm text-[#5a5a72] uppercase">CURRENT PRIZE POOL</div>
                  <div className="font-jersey text-3xl text-[#ff9f00] tracking-widest mt-1">
                    ${netPrizePool.toFixed(2)}
                  </div>
                  <div className="font-jersey text-[10px] text-[#5a5a72] uppercase mt-0.5">
                    ({totalTickets} tickets sold)
                  </div>
                </div>
                <div className="border-2 border-white/20 bg-black p-3 text-center">
                  <div className="font-jersey text-sm text-[#5a5a72] uppercase">YOUR ENTRIES</div>
                  <div className="font-jersey text-3xl text-white tracking-widest mt-1">
                    {playerTickets}
                  </div>
                  <div className="font-jersey text-[10px] text-[#5a5a72] uppercase mt-0.5">
                    ({playerProbability}% win chance)
                  </div>
                </div>
              </div>

              {/* Purchase form buttons */}
              <div className="border-2 border-white/20 bg-black p-4 space-y-3">
                <div className="flex justify-between items-center font-jersey text-xl text-white uppercase border-b border-white/10 pb-2">
                  <span>Price Per Ticket:</span>
                  <span className="text-[#ff9f00]">${TICKET_PRICE.toFixed(2)} Chips</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={!isDrawWindowOpen || isBuying}
                    onClick={() => handleBuyTickets(1)}
                    className={`font-jersey text-xl py-3 px-2 border-3 uppercase transform hover:-translate-y-1 hover:shadow-[3px_3px_0px_#000] active:translate-y-0 active:shadow-none transition-all cursor-pointer ${
                      isDrawWindowOpen 
                        ? 'border-white bg-black text-white hover:bg-white hover:text-black'
                        : 'border-white/10 bg-[#111111] text-white/20 cursor-not-allowed'
                    }`}
                    style={{ clipPath: 'polygon(8px 0px, 100% 0px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0px 100%, 0px 8px)' }}
                  >
                    🎟️ BUY 1 TICKET
                  </button>
                  <button
                    disabled={!isDrawWindowOpen || isBuying}
                    onClick={() => handleBuyTickets(5)}
                    className={`font-jersey text-xl py-3 px-2 border-3 uppercase transform hover:-translate-y-1 hover:shadow-[3px_3px_0px_#000] active:translate-y-0 active:shadow-none transition-all cursor-pointer ${
                      isDrawWindowOpen 
                        ? 'border-[#ff9f00] bg-black text-[#ff9f00] hover:bg-[#ff9f00] hover:text-[#0d0d1a]'
                        : 'border-white/10 bg-[#111111] text-white/20 cursor-not-allowed'
                    }`}
                    style={{ clipPath: 'polygon(8px 0px, 100% 0px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0px 100%, 0px 8px)' }}
                  >
                    🔥 BUY 5 TICKETS
                  </button>
                </div>

                {!isDrawWindowOpen && (
                  <div className="flex items-center gap-2 text-xs font-jersey text-[#ff3f3f] bg-[#ff3f3f]/10 p-2 border border-[#ff3f3f]/40 justify-center">
                    <AlertCircle className="w-4 h-4" />
                    <span>SALES CLOSED. WAITING FOR RESULTS...</span>
                  </div>
                )}
              </div>
            </div>

            {/* RTP Information plaque */}
            <div className="border-2 border-white/20 bg-black p-3 text-left mt-4">
              <div className="font-jersey text-[#ff9f00] text-md uppercase flex justify-between">
                <span><span>◆ TRANSPARENT RTP COMPLIANCE ◆</span></span>
                <span>RTP: {GAME_RTP}%</span>
              </div>
              <p className="font-jersey text-xs text-[#5a5a72] uppercase m-0 mt-1 leading-snug">
                This cabinet levies a small {HOUSE_RAKE * 100}% house rake on total buy-ins to maintain terminal operations. Remaining {GAME_RTP}% goes entirely into the winner prize pool. Draws are mathematically calculated and weighted based on purchased entries.
              </p>
            </div>
          </div>

          {/* CHAT/SOCIAL LOG BOX */}
          <div 
            className="border-4 border-white bg-[#111111] p-5 relative"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            <div className="border-b-3 border-[#ff9f00] pb-3 mb-3 flex justify-between items-center">
              <span className="font-jersey text-2xl text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#ff9f00]" /> COIN-OP LOUNGE FEED
              </span>
              <span className="bg-[#ff9f00]/10 text-[#ff9f00] border border-[#ff9f00]/40 font-jersey text-xs px-2 py-0.5 uppercase">
                {entrants.length} Online
              </span>
            </div>

            <div className="h-44 overflow-y-auto space-y-3 pr-2 scrollbar-thin text-left">
              {chats.map((c) => (
                <div key={c.id} className="flex gap-2 items-start text-sm">
                  {c.isSystem ? (
                    <div className="flex-1 font-jersey bg-[#ff9f00]/10 border border-[#ff9f00]/30 p-1.5 text-[#ff9f00] text-xs uppercase leading-tight">
                      {c.message}
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 flex-shrink-0">
                        <PixelAvatar avatarId={c.avatarId} size={32} />
                      </div>
                      <div className="flex-1 font-jersey leading-tight">
                        <div className="flex justify-between items-center">
                          <span className="text-[#ff9f00] text-md">{c.sender}</span>
                          <span className="text-xs text-[#5a5a72]">{c.time}</span>
                        </div>
                        <p className="text-[#e8e8e8] text-sm mt-0.5 m-0 uppercase">{c.message}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TICKET REGISTRY BOARD & VISUAL TURNTABLE (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* VISUAL DRUM TUMBLER / REVEAL SCREEN CONTAINER */}
          <div 
            className="border-4 border-white bg-[#111111] p-6 relative flex flex-col items-center justify-center filter drop-shadow-[4px_4px_0px_#000] overflow-hidden"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)', minHeight: '300px' }}
          >
            <div className="absolute inset-0 bg-[#121224] opacity-25 pixel-checker" />
            
            {/* DRUM TUMBLER ANIMATION STATE */}
            {isDrumRollPhase && (
              <div className="relative z-10 text-center space-y-4 max-w-md w-full">
                <div className="text-2xl font-jersey text-[#ff9f00] tracking-widest uppercase animate-pulse">
                  🥁 TUMBLING WINNING ENTRANTS 🥁
                </div>
                
                {/* Visual Drum Wheel drawing */}
                <div className="border-4 border-white bg-black p-6 relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute left-0 right-0 h-1 bg-[#ff9f00]/50 top-1/2 -translate-y-1/2 z-0" />
                  
                  {allTickets[tumblerIndex] ? (
                    <div className="relative z-10 flex flex-col items-center space-y-2 animate-bounce">
                      <PixelAvatar avatarId={allTickets[tumblerIndex].avatarId} size={64} />
                      <div className="font-jersey text-3xl text-white uppercase tracking-wider">
                        {allTickets[tumblerIndex].owner}
                      </div>
                      <div className="font-jersey text-xl text-[#ff9f00] uppercase">
                        TICKET #{allTickets[tumblerIndex].ticketIndex + 1}
                      </div>
                    </div>
                  ) : (
                    <div className="font-jersey text-xl text-white">NO TICKETS BOUGHT</div>
                  )}
                </div>

                <div className="text-sm font-jersey text-[#5a5a72] uppercase">
                  WEIGHTED SELECTION COMPLYING WITH TRANSPARENT 95.0% RTP RULES
                </div>
              </div>
            )}

            {/* WINNER REVEAL SCREEN */}
            {isWinnerRevealPhase && winnerTicket && (
              <div className="relative z-10 text-center space-y-4 max-w-lg w-full p-4 animate-fade-in">
                <div className="text-3xl font-jersey text-white tracking-widest uppercase animate-pulse">
                  ★ DRAW WINNER REVEALED ★
                </div>
                
                <div className="border-4 border-[#ff9f00] bg-black p-6 relative flex flex-col items-center justify-center">
                  {/* Confetti pixels */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <span className="absolute top-4 left-6 w-2 h-2 bg-[#ff9f00] animate-ping" />
                    <span className="absolute top-10 right-12 w-2 h-2 bg-white animate-ping" />
                    <span className="absolute bottom-6 left-12 w-2 h-2 bg-[#ff9f00] animate-ping" />
                    <span className="absolute bottom-12 right-6 w-2 h-2 bg-white animate-ping" />
                  </div>

                  <PixelAvatar avatarId={winnerTicket.avatarId} size={96} />
                  
                  <div className="font-jersey text-4xl text-white uppercase tracking-widest mt-4">
                    {winnerTicket.owner}
                  </div>
                  
                  <div className="font-jersey text-lg text-[#5a5a72] uppercase mt-1">
                    WON DRAW ID #{currentDrawId - 1} WITH TICKET #{winnerTicket.ticketIndex + 1}
                  </div>

                  <div className="font-jersey text-4xl text-white tracking-wider mt-4 border-2 border-dashed border-[#ff9f00] px-4 py-2 bg-black">
                    🏆 PRIZE: ${netPrizePool.toFixed(2)} CHIPS
                  </div>
                </div>

                <div className="font-jersey text-lg text-white/60 uppercase animate-pulse">
                  CONGRATULATIONS TO THE LUCKY CHAMPION! RESETTING SOON...
                </div>
              </div>
            )}

            {/* STANDARD WINDOW: DRAW TICKETS GRID EXPOSITION */}
            {(isDrawWindowOpen || isWarningPhase || isBufferPhase || !winnerTicket) && (
              <div className="relative z-10 w-full flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-jersey text-xl text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#ff9f00]" /> ENTRANT REGISTRY BOARD
                  </span>
                  <span className="font-jersey text-white/80 text-md">
                    {entrants.length} ACTIVE REGISTERED PLAYERS
                  </span>
                </div>

                {/* Grid of registered tickets */}
                <div className="min-h-[220px] max-h-[300px] overflow-y-auto pr-1">
                  {allTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-44 text-center space-y-2">
                      <Ticket className="w-12 h-12 text-[#5a5a72]/40" />
                      <div className="font-jersey text-2xl text-[#5a5a72] uppercase">
                        NO ACTIVE BUY-INS REGISTERED
                      </div>
                      <p className="font-jersey text-md text-[#5a5a72] uppercase m-0">
                        Purchase entries at the ticket counter to start the draw jackpot!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {allTickets.map((t) => (
                        <div 
                           key={t.ticketIndex}
                          className={`border-2 p-2 relative flex flex-col items-center justify-center text-center space-y-1 transform hover:-translate-y-0.5 transition-all ${
                            t.isPlayer 
                              ? 'border-[#ff9f00] bg-[#ff9f00]/10 text-white' 
                              : 'border-[#5a5a72]/60 bg-[#111124] text-white/80'
                          }`}
                          style={{ clipPath: 'polygon(6px 0px, 100% 0px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0px 100%, 0px 6px)' }}
                        >
                          <PixelAvatar avatarId={t.avatarId} size={32} />
                          <div className="font-jersey text-md truncate w-full uppercase mt-1">
                            {t.owner}
                          </div>
                          <div className={`font-jersey text-[11px] px-1.5 py-0.5 border text-center uppercase ${
                            t.isPlayer 
                              ? 'border-[#ff9f00] bg-[#ff9f00]/20 text-[#ff9f00]' 
                              : 'border-[#5a5a72]/40 bg-black/30 text-[#5a5a72]'
                          }`}>
                            TICKET #{t.ticketIndex + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer totals */}
                <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row justify-between items-center text-xs font-jersey text-[#5a5a72] uppercase gap-2">
                  <span>JACKPOT GROWS BY $0.19 NET PER BUY-IN (5% RAKE APPLIED)</span>
                  <span className="text-[#ff9f00]">◆ WEIGHED DRAW CALIBRATION SUCCESS ◆</span>
                </div>
              </div>
            )}
          </div>

          {/* HISTORICAL RESULTS BOARD (HIGH SCORES LOG) */}
          <div 
            className="border-4 border-white bg-[#111111] p-5 relative"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            <div className="border-b-3 border-[#ff9f00] pb-3 mb-3 flex justify-between items-center">
              <span className="font-jersey text-2xl text-white uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#ff9f00]" /> HISTORY &amp; HALL OF CHAMPIONS
              </span>
              <span className="text-xs font-mono text-[#5a5a72] uppercase">
                PREVIOUS DRAW MULTIPLIERS
              </span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-1 font-jersey text-sm text-[#ff9f00] uppercase border-b border-white/10 pb-1.5 px-2 text-left">
                <div className="col-span-2">DRAW ID</div>
                <div className="col-span-4">WINNING CHAMPION</div>
                <div className="col-span-2 text-center">TICKETS</div>
                <div className="col-span-4 text-right">PRIZE WON</div>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 text-left pr-1 scrollbar-thin">
                {history.map((h) => (
                  <div 
                    key={h.drawId}
                    className="grid grid-cols-12 gap-1 font-jersey text-lg text-white uppercase bg-[#0d0d1a]/50 p-2 border border-white/10 items-center hover:bg-[#0d0d1a]"
                  >
                    <div className="col-span-2 text-[#ff9f00]">#{h.drawId}</div>
                    <div className="col-span-4 flex items-center gap-2">
                      <PixelAvatar avatarId={h.winnerAvatarId} size={24} />
                      <span className={h.winnerIsPlayer ? 'text-[#ff9f00]' : 'text-white'}>
                        {h.winnerName}
                      </span>
                    </div>
                    <div className="col-span-2 text-center text-[#5a5a72]">{h.totalTickets} tix</div>
                    <div className="col-span-4 text-right text-[#3fff6e] font-bold">
                      ${h.prizePool.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. MODAL: How It Works */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-none">
          <div 
            className="border-4 border-white bg-[#111111] w-full max-w-lg p-6 relative filter drop-shadow-[8px_8px_0px_#000]"
            style={{ clipPath: 'polygon(16px 0px, 100% 0px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0px 100%, 0px 16px)' }}
          >
            <div className="border-b-3 border-[#ff9f00] pb-3 mb-4">
              <h2 className="text-3xl font-jersey text-white m-0 uppercase tracking-widest">
                ★ LUCKY DRAW SYSTEM REGULATORY LAWS ★
              </h2>
            </div>

            <div className="font-jersey text-lg text-white/90 space-y-4 uppercase text-left leading-relaxed">
              <p>
                1. <span className="text-[#ff9f00]">CHIP DEPOSITION</span>: Buy-in requires a minor entry ticket price of <span className="text-white">$0.20 Chips</span> per ticket. You can buy multiple tickets to amplify your win ratio!
              </p>
              <p>
                2. <span className="text-[#ff9f00]">RAKE CONVENANCE</span>: A transparent house levy of <span className="text-white">5%</span> is subtracted from total tickets bought for server operations, maintaining a <span className="text-[#ff9f00]">95.0% RTP payout</span> directly back to players.
              </p>
              <p>
                3. <span className="text-[#ff9f00]">COIN-OP SCHEDULER</span>: Every <span className="text-[#ff9f00]">90 seconds</span>, a new draw occurs. The countdown bar on the panel tracks the synchronized window.
              </p>
              <p>
                4. <span className="text-[#ff9f00]">WEIGHTED DETERMINATION</span>: When the window closes, the pixel drum tumbler executes a weighted raffle selection based on total tickets bought. One ticket is selected; that owner claims the entire net prize pool!
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#5a5a72]/30 flex justify-end">
              <PixelButton 
                onClick={() => {
                  audio.playClick();
                  setShowHowItWorks(false);
                }}
                variant="primary"
                className="text-xl py-2 px-6"
              >
                ACKNOWLEDGE REGS
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
