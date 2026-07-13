/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelMascot, PixelModal, PixelSlider } from './PixelUI';
import { 
  CornerDownLeft, 
  Sparkles, 
  Coins, 
  Gamepad2, 
  Plus, 
  Minus, 
  LogOut, 
  User, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { audio } from '../lib/audio';
import { 
  Card, 
  PlayerState, 
  SUIT_SYMBOLS, 
  createDeck, 
  shuffleDeck, 
  formatRank, 
  evaluateBestHand, 
  compareHands, 
  getBotDecision 
} from '../lib/pokerEngine';
import { PokerRoomShell } from './poker-v2/PokerRoomShell';
import { PokerTable as V2PokerTable } from './poker-v2/pokerTypes';
import { PokerGameShell } from './poker-game-v2/PokerGameShell';
import { PokerGameState, PokerGameActions } from './poker-game-v2/pokerGameTypes';

interface PokerScreenProps {
  onOpenSettings?: () => void;
}

export const PokerScreen: React.FC<PokerScreenProps> = ({ onOpenSettings }) => {
  const { profile, setRoute, adjustBalance, triggerToast, unlockAchievement } = useStore();

  // Active game loop state
  const [activeTable, setActiveTable] = useState<V2PokerTable | null>(null);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [minRaise, setMinRaise] = useState(0);
  const [pot, setPot] = useState(0);
  const [currentHandNum, setCurrentHandNum] = useState(1);
  const [gameStage, setGameStage] = useState<'WAITING_FOR_DEAL' | 'PRE_FLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN'>('WAITING_FOR_DEAL');
  
  // Modals & HUD state
  const [isRebuyOpen, setIsRebuyOpen] = useState(false);
  const [rebuyAmount, setRebuyAmount] = useState(0);
  const [userRaiseAmount, setUserRaiseAmount] = useState(0);
  const [isRaising, setIsRaising] = useState(false);
  const [turnTimer, setTurnTimer] = useState(15);
  const [sessionLogs, setSessionLogs] = useState<string[]>([]);
  const [winnersList, setWinnersList] = useState<{ name: string; prize: number; handName: string; cards: Card[] }[]>([]);
  const [showdownModalDismissed, setShowdownModalDismissed] = useState(false);
  const [botChatter, setBotChatter] = useState<string | null>(null);
  const [animationTick, setAnimationTick] = useState(0);

  // Stepped low framerate retro ticker
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setAnimationTick((t) => (t + 1) % 4);
    }, 250);
    return () => clearInterval(tickInterval);
  }, []);

  // Ambient chatbot chatter
  useEffect(() => {
    if (!activeTable || gameStage === 'SHOWDOWN') {
      setBotChatter(null);
      return;
    }
    const chatterInterval = setInterval(() => {
      const activeBots = players.filter(p => p.isBot && !p.isFolded);
      if (activeBots.length > 0) {
        const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)];
        const quotes = [
          `"ALL IN OR COLD FOLD!"`,
          `"MASTER OF CHIP MATH DETECTS TELLS."`,
          `"I AM READING THY BLUFF!"`,
          `"CHIPSTACK OVERFLOW DETECTED."`,
          `"CHIPMASTER COMP COINS ARE MINE!"`,
          `"I RAISE THY CONSOLE."`,
          `"COMMITTING TOKENS WITH INTENT!"`
        ];
        setBotChatter(`${randomBot.name}: ${quotes[Math.floor(Math.random() * quotes.length)]}`);
        audio.playClick();
      }
    }, 7000);
    return () => clearInterval(chatterInterval);
  }, [activeTable, players, gameStage]);

  // Turn Countdown Timer & Auto Action
  useEffect(() => {
    if (gameStage === 'WAITING_FOR_DEAL' || gameStage === 'SHOWDOWN') return;
    const timer = setInterval(() => {
      setTurnTimer(t => {
        if (t <= 1) {
          if (currentPlayerIndex === 0) {
            handleTimeoutAction();
          }
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPlayerIndex, gameStage, players]);

  useEffect(() => {
    setTurnTimer(15);
  }, [currentPlayerIndex, gameStage]);

  // Bot Turn trigger
  useEffect(() => {
    if (gameStage === 'WAITING_FOR_DEAL' || gameStage === 'SHOWDOWN') return;
    const currentP = players[currentPlayerIndex];
    if (!currentP) return;

    if (currentP.isBot && !currentP.isFolded && !currentP.isAllIn) {
      const delay = setTimeout(() => {
        executeBotTurn();
      }, 1200);
      return () => clearTimeout(delay);
    } else if (currentP.isFolded || currentP.isAllIn) {
      advanceTurn();
    }
  }, [currentPlayerIndex, gameStage]);

  const addLog = (msg: string) => {
    setSessionLogs(prev => [msg, ...prev]);
  };

  const handleTimeoutAction = () => {
    const hero = players[0];
    if (!hero) return;
    const toCall = currentBet - hero.bet;
    if (toCall <= 0) {
      handlePlayerAction('CHECK');
    } else {
      handlePlayerAction('FOLD');
    }
    triggerToast('TURN TIMER EXCEEDED! AUTO-ACTION EXECUTED.', 'error');
  };

  const getStepSize = (min: number, max: number) => {
    const range = max - min;
    if (range <= 1.5) return 0.05;
    if (range <= 10.0) return 0.50;
    if (range <= 100.0) return 5.00;
    return 25.00;
  };

  // Positions players around the custom oval table canvas dynamically and symmetrically
  const getSeatPosition = (idx: number, total: number) => {
    const positions = [
      'bottom-[-16px] left-1/2 -translate-x-1/2', // 0 (Hero - Sits proudly bottom center)
      'bottom-[15%] left-[2%] md:left-[5%]',     // 1 (Lower Left)
      'top-[12%] left-[4%] md:left-[7%]',       // 2 (Upper Left)
      'top-[-16px] left-1/2 -translate-x-1/2',    // 3 (Top Center)
      'top-[12%] right-[4%] md:right-[7%]',      // 4 (Upper Right)
      'bottom-[15%] right-[2%] md:right-[5%]'    // 5 (Lower Right)
    ];

    let seatIdx = idx;
    if (total === 2) {
      seatIdx = idx === 0 ? 0 : 3;
    } else if (total === 3) {
      if (idx === 0) seatIdx = 0;
      else if (idx === 1) seatIdx = 2;
      else if (idx === 2) seatIdx = 4;
    } else if (total === 4) {
      if (idx === 0) seatIdx = 0;
      else if (idx === 1) seatIdx = 1;
      else if (idx === 2) seatIdx = 3;
      else if (idx === 3) seatIdx = 5;
    } else if (total === 5) {
      if (idx === 0) seatIdx = 0;
      else if (idx === 1) seatIdx = 1;
      else if (idx === 2) seatIdx = 2;
      else if (idx === 3) seatIdx = 4;
      else if (idx === 4) seatIdx = 5;
    } else {
      seatIdx = idx % positions.length;
    }

    return positions[seatIdx];
  };

  const handleJoinTableV2 = async (table: V2PokerTable, buyIn: number) => {
    const finalAmount = Number(buyIn.toFixed(2));

    if (finalAmount < table.minBuyIn || finalAmount > table.maxBuyIn) {
      triggerToast('INVALID BUY-IN BOUNDS!', 'error');
      return;
    }
    if (finalAmount > profile.chips) {
      triggerToast('YOU DO NOT HAVE ENOUGH CHIPS!', 'error');
      return;
    }

    const success = await adjustBalance(-finalAmount, `POKER_BUYIN_${table.id.toUpperCase()}`);
    if (success) {
      const initial: PlayerState[] = [
        {
          id: 'player',
          name: profile.name || 'HERO',
          avatarId: profile.avatarId || 1,
          stack: finalAmount,
          bet: 0,
          cards: [],
          isFolded: false,
          isAllIn: false,
          isBot: false,
          lastAction: ''
        },
        ...table.bots.map((bot, idx) => ({
          id: `bot_${idx}`,
          name: bot.name,
          avatarId: bot.avatarId,
          stack: bot.stack,
          bet: 0,
          cards: [],
          isFolded: false,
          isAllIn: false,
          isBot: true,
          difficulty: table.difficulty as any,
          lastAction: ''
        }))
      ];

      const rDealer = Math.floor(Math.random() * initial.length);
      setActiveTable(table as any);
      triggerToast(`JOINED ${table.name}!`, 'success');
      audio.playChipStack();
      setupFirstHand(initial, rDealer, table as any);
    } else {
      audio.playLoss();
      triggerToast('BUY-IN TRANSACTION FAILED! CHECK YOUR WALLET BALANCE.', 'error');
    }
  };

  const handleLaunchCustomBotMatchV2 = async (config: {
    tableName: string;
    buyIn: number;
    botCount: number;
    difficulty: 'BEGINNER' | 'CASUAL' | 'ADVANCED' | 'EXPERT';
    theme: 'red' | 'green' | 'gold' | 'orange';
  }) => {
    const finalAmount = Number(config.buyIn.toFixed(2));
    if (finalAmount > profile.chips) {
      audio.playLoss();
      triggerToast('YOU DO NOT HAVE ENOUGH CHIPS FOR THIS BUY-IN!', 'error');
      return;
    }

    const botNames = [
      'BOT KERNEL', 'BOT GIGA', 'BOT CACHE', 'BOT BITWISE', 'BOT SHIFT',
      'BOT STACK', 'BOT HEAP', 'BOT COMPILE', 'BOT TRACE', 'BOT COBALT',
      'BOT HELIUM', 'BOT ARGON', 'BOT NEON', 'BOT PROTON', 'BOT QUARK'
    ];
    // Shuffle bot names
    const shuffledNames = [...botNames].sort(() => Math.random() - 0.5);
    
    const generatedBots = Array.from({ length: config.botCount }).map((_, idx) => {
      // Stack varies slightly around buy-in (85% to 125%)
      const variance = 0.85 + Math.random() * 0.40;
      const botStack = Number((finalAmount * variance).toFixed(2));
      return {
        name: shuffledNames[idx % shuffledNames.length],
        avatarId: ((idx + 2) % 6) + 1,
        stack: botStack
      };
    });

    const customTable: V2PokerTable = {
      id: `custom_bot_${Date.now()}`,
      name: config.tableName.trim().toUpperCase() || 'CUSTOM BOT STAGE',
      minBuyIn: finalAmount,
      maxBuyIn: finalAmount,
      smallBlind: Number((finalAmount * 0.01).toFixed(2)) || 0.01,
      bigBlind: Number((finalAmount * 0.02).toFixed(2)) || 0.02,
      seatsFilled: config.botCount + 1,
      maxSeats: 6,
      theme: config.theme,
      description: `A customized bot room with ${config.botCount} CPU players on ${config.difficulty} difficulty.`,
      difficulty: config.difficulty,
      bots: generatedBots,
      gameType: "Texas Hold'em",
      speed: "Fast",
      status: "FULL",
      averagePot: finalAmount * 1.5,
      averageHandTime: 60
    };

    const success = await adjustBalance(-finalAmount, `POKER_BUYIN_CUSTOM`);
    if (success) {
      const initial: PlayerState[] = [
        {
          id: 'player',
          name: profile.name || 'HERO',
          avatarId: profile.avatarId || 1,
          stack: finalAmount,
          bet: 0,
          cards: [],
          isFolded: false,
          isAllIn: false,
          isBot: false,
          lastAction: ''
        },
        ...customTable.bots.map((bot, idx) => ({
          id: `bot_${idx}`,
          name: bot.name,
          avatarId: bot.avatarId,
          stack: bot.stack,
          bet: 0,
          cards: [],
          isFolded: false,
          isAllIn: false,
          isBot: true,
          difficulty: customTable.difficulty as any,
          lastAction: ''
        }))
      ];

      const rDealer = Math.floor(Math.random() * initial.length);
      setActiveTable(customTable);
      triggerToast(`LAUNCHED CUSTOM BOT MATCH!`, 'success');
      audio.playChipStack();
      setupFirstHand(initial, rDealer, customTable);
    } else {
      audio.playLoss();
      triggerToast('BUY-IN TRANSACTION FAILED! CHECK YOUR WALLET BALANCE.', 'error');
    }
  };

  const setupFirstHand = (initPlayers: PlayerState[], dIdx: number, table: V2PokerTable) => {
    const newDeck = shuffleDeck(createDeck());
    const sbIndex = (dIdx + 1) % initPlayers.length;
    const bbIndex = (dIdx + 2) % initPlayers.length;

    const sbPosted = Math.min(initPlayers[sbIndex].stack, table.smallBlind);
    initPlayers[sbIndex].stack = Number((initPlayers[sbIndex].stack - sbPosted).toFixed(2));
    initPlayers[sbIndex].bet = sbPosted;
    initPlayers[sbIndex].lastAction = `POSTS SB $${sbPosted.toFixed(2)}`;
    if (initPlayers[sbIndex].stack === 0) initPlayers[sbIndex].isAllIn = true;

    const bbPosted = Math.min(initPlayers[bbIndex].stack, table.bigBlind);
    initPlayers[bbIndex].stack = Number((initPlayers[bbIndex].stack - bbPosted).toFixed(2));
    initPlayers[bbIndex].bet = bbPosted;
    initPlayers[bbIndex].lastAction = `POSTS BB $${bbPosted.toFixed(2)}`;
    if (initPlayers[bbIndex].stack === 0) initPlayers[bbIndex].isAllIn = true;

    const initialPot = Number((sbPosted + bbPosted).toFixed(2));
    initPlayers.forEach(p => {
      p.cards = [newDeck.pop()!, newDeck.pop()!];
    });
    audio.playCardDeal();

    setPlayers(initPlayers);
    setDeck(newDeck);
    setCommunityCards([]);
    setDealerIndex(dIdx);
    setPot(initialPot);
    setCurrentBet(table.bigBlind);
    setMinRaise(table.bigBlind);
    setWinnersList([]);
    setShowdownModalDismissed(false);
    setCurrentHandNum(1);
    setCurrentPlayerIndex((dIdx + 3) % initPlayers.length);
    setGameStage('PRE_FLOP');

    setSessionLogs([
      `--- DEALT HAND #1 ---`,
      `Blinds: SB $${sbPosted.toFixed(2)} (${initPlayers[sbIndex].name}), BB $${bbPosted.toFixed(2)} (${initPlayers[bbIndex].name})`,
      `CONCOURSE TRANSACTION SECURED`,
      `COMMITTED COMP STACK: $${initPlayers[0].stack.toFixed(2)}`
    ]);
  };

  const startNewHand = () => {
    if (!activeTable) return;
    const hero = players[0];
    if (hero.stack < activeTable.smallBlind) {
      triggerToast('INSUFFICIENT SESSION STACK! RE-BUY TO CONTINUE.', 'error');
      setIsRebuyOpen(true);
      return;
    }

    // Replenish any zero-stack bots
    const refreshed = players.map(p => {
      if (p.stack <= 0) {
        const topup = (activeTable.minBuyIn + activeTable.maxBuyIn) / 2;
        return {
          ...p,
          stack: Number(topup.toFixed(2)),
          isFolded: false,
          isAllIn: false,
          bet: 0,
          cards: [],
          lastAction: 'REPLENISHED'
        };
      }
      return {
        ...p,
        isFolded: false,
        isAllIn: false,
        bet: 0,
        cards: [],
        lastAction: ''
      };
    });

    const nextDealer = (dealerIndex + 1) % refreshed.length;
    const newDeck = shuffleDeck(createDeck());

    const sbIndex = (nextDealer + 1) % refreshed.length;
    const bbIndex = (nextDealer + 2) % refreshed.length;

    const sbPosted = Math.min(refreshed[sbIndex].stack, activeTable.smallBlind);
    refreshed[sbIndex].stack = Number((refreshed[sbIndex].stack - sbPosted).toFixed(2));
    refreshed[sbIndex].bet = sbPosted;
    refreshed[sbIndex].lastAction = `POSTS SB $${sbPosted.toFixed(2)}`;
    if (refreshed[sbIndex].stack === 0) refreshed[sbIndex].isAllIn = true;

    const bbPosted = Math.min(refreshed[bbIndex].stack, activeTable.bigBlind);
    refreshed[bbIndex].stack = Number((refreshed[bbIndex].stack - bbPosted).toFixed(2));
    refreshed[bbIndex].bet = bbPosted;
    refreshed[bbIndex].lastAction = `POSTS BB $${bbPosted.toFixed(2)}`;
    if (refreshed[bbIndex].stack === 0) refreshed[bbIndex].isAllIn = true;

    const nextPot = Number((sbPosted + bbPosted).toFixed(2));
    refreshed.forEach(p => {
      p.cards = [newDeck.pop()!, newDeck.pop()!];
    });

    setPlayers(refreshed);
    setDeck(newDeck);
    setCommunityCards([]);
    setDealerIndex(nextDealer);
    setPot(nextPot);
    setCurrentBet(activeTable.bigBlind);
    setMinRaise(activeTable.bigBlind);
    setWinnersList([]);
    setShowdownModalDismissed(false);
    setCurrentHandNum(h => h + 1);
    setCurrentPlayerIndex((nextDealer + 3) % refreshed.length);
    setGameStage('PRE_FLOP');
    audio.playCardDeal();

    addLog(`--- DEALT HAND #${currentHandNum + 1} ---`);
    addLog(`Blinds: SB $${sbPosted.toFixed(2)} (${refreshed[sbIndex].name}), BB $${bbPosted.toFixed(2)} (${refreshed[bbIndex].name})`);
  };

  const advanceTurn = () => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  };

  const handlePlayerAction = (act: 'FOLD' | 'CHECK' | 'CALL' | 'RAISE', amt?: number) => {
    if (currentPlayerIndex !== 0) return;
    const hero = players[0];
    const toCall = currentBet - hero.bet;

    const updated = [...players];
    let addedLog = '';

    if (act === 'FOLD') {
      updated[0].isFolded = true;
      updated[0].lastAction = 'FOLDED';
      updated[0].hasActed = true;
      addedLog = 'YOU FOLDED THY HAND.';
      audio.playLoss();
    } else if (act === 'CHECK') {
      if (toCall > 0) {
        triggerToast('MUST CALL OR FOLD!', 'error');
        return;
      }
      updated[0].lastAction = 'CHECKED';
      updated[0].hasActed = true;
      addedLog = 'YOU CHECKED THE ACTION.';
      audio.playClick();
    } else if (act === 'CALL') {
      const commit = Math.min(hero.stack, toCall);
      updated[0].stack = Number((hero.stack - commit).toFixed(2));
      updated[0].bet = Number((hero.bet + commit).toFixed(2));
      updated[0].hasActed = true;
      if (updated[0].stack === 0) updated[0].isAllIn = true;
      updated[0].lastAction = updated[0].isAllIn ? 'ALL-IN CALL' : `CALLS $${commit.toFixed(2)}`;
      setPot(p => Number((p + commit).toFixed(2)));
      addedLog = `YOU CALLED THE BET OF $${commit.toFixed(2)}.`;
      audio.playChipStack();
    } else if (act === 'RAISE') {
      const raiseTo = amt || userRaiseAmount;
      const extra = raiseTo - hero.bet;
      if (extra > hero.stack || raiseTo < currentBet + minRaise) {
        triggerToast('INVALID RAISE AMOUNT!', 'error');
        return;
      }
      updated[0].stack = Number((hero.stack - extra).toFixed(2));
      updated[0].bet = raiseTo;
      updated[0].hasActed = true;
      if (updated[0].stack === 0) updated[0].isAllIn = true;
      updated[0].lastAction = updated[0].isAllIn ? `ALL-IN RAISE $${raiseTo.toFixed(2)}` : `RAISES TO $${raiseTo.toFixed(2)}`;
      
      const prevBet = currentBet;
      setCurrentBet(raiseTo);
      setMinRaise(Math.max(activeTable!.bigBlind, raiseTo - prevBet));
      setPot(p => Number((p + extra).toFixed(2)));
      
      // Reset action requirements for everyone else
      updated.forEach((p, i) => {
        if (i !== 0) p.hasActed = false;
      });
      
      addedLog = `YOU RAISED TO $${raiseTo.toFixed(2)} COINS.`;
      audio.playChipStack();
      setIsRaising(false);
    }

    setPlayers(updated);
    addLog(addedLog);
    evaluateNextStep(updated);
  };

  const executeBotTurn = () => {
    const bot = players[currentPlayerIndex];
    if (!bot || bot.isFolded || bot.isAllIn) {
      advanceTurn();
      return;
    }

    const toCall = currentBet - bot.bet;
    const minR = Math.max(activeTable!.bigBlind, minRaise);
    const decision = getBotDecision(bot, communityCards, currentBet, toCall, pot, minR);

    const updated = [...players];
    let logMsg = '';

    if (decision.action === 'FOLD') {
      updated[currentPlayerIndex].isFolded = true;
      updated[currentPlayerIndex].lastAction = 'FOLDED';
      updated[currentPlayerIndex].hasActed = true;
      logMsg = `${bot.name} folded.`;
    } else if (decision.action === 'CHECK') {
      updated[currentPlayerIndex].lastAction = 'CHECKED';
      updated[currentPlayerIndex].hasActed = true;
      logMsg = `${bot.name} checked.`;
    } else if (decision.action === 'CALL') {
      const commit = Math.min(bot.stack, toCall);
      updated[currentPlayerIndex].stack = Number((bot.stack - commit).toFixed(2));
      updated[currentPlayerIndex].bet = Number((bot.bet + commit).toFixed(2));
      updated[currentPlayerIndex].hasActed = true;
      if (updated[currentPlayerIndex].stack === 0) updated[currentPlayerIndex].isAllIn = true;
      updated[currentPlayerIndex].lastAction = updated[currentPlayerIndex].isAllIn ? 'ALL-IN CALL' : `CALLS $${commit.toFixed(2)}`;
      setPot(p => Number((p + commit).toFixed(2)));
      logMsg = `${bot.name} called $${commit.toFixed(2)}.`;
    } else if (decision.action === 'RAISE') {
      const raiseTo = Math.min(bot.stack + bot.bet, decision.amount);
      const extra = raiseTo - bot.bet;

      updated[currentPlayerIndex].stack = Number((bot.stack - extra).toFixed(2));
      updated[currentPlayerIndex].bet = raiseTo;
      updated[currentPlayerIndex].hasActed = true;
      if (updated[currentPlayerIndex].stack === 0) updated[currentPlayerIndex].isAllIn = true;
      updated[currentPlayerIndex].lastAction = updated[currentPlayerIndex].isAllIn ? `ALL-IN RAISE $${raiseTo.toFixed(2)}` : `RAISES TO $${raiseTo.toFixed(2)}`;
      
      const prevBet = currentBet;
      setCurrentBet(raiseTo);
      setMinRaise(Math.max(activeTable!.bigBlind, raiseTo - prevBet));
      setPot(p => Number((p + extra).toFixed(2)));

      // Reset action flags for everyone else
      updated.forEach((p, i) => {
        if (i !== currentPlayerIndex) p.hasActed = false;
      });

      logMsg = `${bot.name} raised to $${raiseTo.toFixed(2)}.`;
    }

    setPlayers(updated);
    addLog(logMsg);
    evaluateNextStep(updated);
  };

  const evaluateNextStep = (currentPlayers: PlayerState[]) => {
    const unfolded = currentPlayers.filter(p => !p.isFolded);
    if (unfolded.length === 1) {
      concludeUncontestedHand(unfolded[0], currentPlayers);
      return;
    }

    // Checking if all active non-allin players have acted and matches currentBet
    const activeNonAllin = currentPlayers.filter(p => !p.isFolded && !p.isAllIn);
    const bettingRoundComplete = activeNonAllin.every(p => p.hasActed && p.bet === currentBet);

    if (bettingRoundComplete) {
      transitionToNextStage(currentPlayers);
    } else {
      advanceTurn();
    }
  };

  const transitionToNextStage = (currentPlayers: PlayerState[]) => {
    const updated = currentPlayers.map(p => ({
      ...p,
      bet: 0,
      hasActed: false,
      lastAction: p.isFolded ? 'FOLDED' : p.isAllIn ? 'ALL-IN' : ''
    }));

    let nextStage: typeof gameStage = 'PRE_FLOP';
    let nextComm = [...communityCards];
    let nextDeck = [...deck];

    if (gameStage === 'PRE_FLOP') {
      nextStage = 'FLOP';
      nextComm = [nextDeck.pop()!, nextDeck.pop()!, nextDeck.pop()!];
      addLog('--- SPREADING THE FLOP ---');
    } else if (gameStage === 'FLOP') {
      nextStage = 'TURN';
      nextComm.push(nextDeck.pop()!);
      addLog('--- SPREADING THE TURN ---');
    } else if (gameStage === 'TURN') {
      nextStage = 'RIVER';
      nextComm.push(nextDeck.pop()!);
      addLog('--- SPREADING THE RIVER ---');
    } else if (gameStage === 'RIVER') {
      evaluateWinnersAndConclude(updated, nextComm);
      return;
    }

    // Skip rounds if everyone else is all-in
    const activeCount = updated.filter(p => !p.isFolded && !p.isAllIn).length;
    if (activeCount <= 1) {
      while (nextComm.length < 5) {
        nextComm.push(nextDeck.pop()!);
      }
      setCommunityCards(nextComm);
      setDeck(nextDeck);
      evaluateWinnersAndConclude(updated, nextComm);
      return;
    }

    // Set starter turn to first active left of dealer button
    let startIdx = (dealerIndex + 1) % updated.length;
    while (updated[startIdx].isFolded || updated[startIdx].isAllIn) {
      startIdx = (startIdx + 1) % updated.length;
    }

    setPlayers(updated);
    setGameStage(nextStage);
    setCommunityCards(nextComm);
    setDeck(nextDeck);
    setCurrentBet(0);
    setMinRaise(activeTable!.bigBlind);
    setCurrentPlayerIndex(startIdx);
    audio.playClick();
  };

  const concludeUncontestedHand = (winner: PlayerState, currentPlayers: PlayerState[]) => {
    const updated = currentPlayers.map(p => {
      if (p.id === winner.id) {
        return {
          ...p,
          stack: Number((p.stack + pot).toFixed(2)),
          lastAction: `WON POT $${pot.toFixed(2)} (FOLD)`
        };
      }
      return p;
    });

    setWinnersList([{
      name: winner.name,
      prize: pot,
      handName: 'Everyone Folded',
      cards: winner.isBot ? [] : winner.cards
    }]);
    setShowdownModalDismissed(false);
    setPlayers(updated);
    setGameStage('SHOWDOWN');
    audio.playWin();

    if (winner.id === 'player') {
      unlockAchievement('poker_win');
      unlockAchievement('first_win');
      triggerToast(`YOU WINS POT OF $${pot.toFixed(2)} COINS!`, 'success');
    } else {
      triggerToast(`${winner.name} wins uncontested pot of $${pot.toFixed(2)} coins.`, 'info');
    }
    addLog(`★ ${winner.name.toUpperCase()} WINS POT OF $${pot.toFixed(2)} COINS ★`);
  };

  const evaluateWinnersAndConclude = (currentPlayers: PlayerState[], finalComm: Card[]) => {
    const eligible = currentPlayers.filter(p => !p.isFolded);
    const evals = eligible.map(p => ({
      player: p,
      hand: evaluateBestHand([...p.cards, ...finalComm])
    }));

    let bestEvals = [evals[0]];
    for (let i = 1; i < evals.length; i++) {
      const comp = compareHands(evals[i].hand, bestEvals[0].hand);
      if (comp > 0) {
        bestEvals = [evals[i]];
      } else if (comp === 0) {
        bestEvals.push(evals[i]);
      }
    }

    const share = Number((pot / bestEvals.length).toFixed(2));
    const updated = currentPlayers.map(p => {
      const isWinner = bestEvals.some(b => b.player.id === p.id);
      if (isWinner) {
        return {
          ...p,
          stack: Number((p.stack + share).toFixed(2)),
          lastAction: `WON $${share.toFixed(2)} (${bestEvals[0].hand.name})`
        };
      }
      return p;
    });

    setWinnersList(bestEvals.map(b => ({
      name: b.player.name,
      prize: share,
      handName: b.hand.name,
      cards: b.player.cards
    })));
    setShowdownModalDismissed(false);

    setPlayers(updated);
    setGameStage('SHOWDOWN');

    const heroWon = bestEvals.some(b => b.player.id === 'player');
    if (heroWon) {
      unlockAchievement('poker_win');
      unlockAchievement('first_win');
      if (share >= (activeTable?.bigBlind ?? 0.10) * 15) {
        audio.playWinJackpot();
      } else {
        audio.playWinMedium();
      }
      triggerToast(`WINNER! YOU COLLECTED $${share.toFixed(2)} COINS!`, 'success');
    } else {
      audio.playLoss();
      triggerToast(`${bestEvals[0].player.name} won with ${bestEvals[0].hand.name}.`, 'info');
    }

    bestEvals.forEach(b => {
      addLog(`★ ${b.player.name.toUpperCase()} WINS $${share.toFixed(2)} COINS WITH ${b.hand.name.toUpperCase()} ★`);
    });
  };

  const handleConfirmRebuy = async () => {
    if (!activeTable) return;
    const amount = Number(rebuyAmount.toFixed(2));
    if (amount <= 0 || amount > profile.chips) {
      triggerToast('INVALID RE-BUY WALLET INSUFFICIENT!', 'error');
      return;
    }

    const hero = players[0];
    if (hero.stack + amount > activeTable.maxBuyIn) {
      triggerToast('RE-BUY EXCEEDS TABLE MAX!', 'error');
      return;
    }

    const success = await adjustBalance(-amount, `POKER_REBUY_${activeTable.id.toUpperCase()}`);
    if (success) {
      const updated = [...players];
      updated[0].stack = Number((hero.stack + amount).toFixed(2));
      setPlayers(updated);
      setIsRebuyOpen(false);
      triggerToast(`RE-BOUGHT COINS: +$${amount.toFixed(2)} STACK!`, 'success');
      audio.playChipStack();
    }
  };

  const handleExitTable = async () => {
    if (!activeTable) return;
    const heroStack = players[0]?.stack || 0;
    const refund = Number(heroStack.toFixed(2));

    if (refund > 0) {
      const success = await adjustBalance(refund, `POKER_CASH_OUT_${activeTable.id.toUpperCase()}`);
      if (success) {
        triggerToast(`CASHED OUT AND RETURNED $${refund.toFixed(2)} TO WALLET!`, 'success');
        audio.playCoinGain();
      } else {
        triggerToast('TRANSACTION REFUND FAILURE!', 'error');
      }
    } else {
      triggerToast('STAND UP WITH EMPTY STACK.', 'info');
    }

    setActiveTable(null);
    setPlayers([]);
    setCommunityCards([]);
    setWinnersList([]);
  };

  if (!activeTable) {
    return (
      <PokerRoomShell
        onJoinTable={handleJoinTableV2}
        onLaunchCustomBotMatch={handleLaunchCustomBotMatchV2}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  const gameState: PokerGameState = {
    table: activeTable as any,
    players,
    communityCards,
    dealerIndex,
    currentPlayerIndex,
    pot,
    currentBet,
    gameStage,
    currentHandNum,
    turnTimer,
    botChatter,
    sessionLogs,
    winners: winnersList
  };

  const gameActions: PokerGameActions = {
    onPlayerAction: handlePlayerAction,
    onRaiseChange: setUserRaiseAmount,
    onOpenRebuy: () => {
      setRebuyAmount(Math.min(profile.chips, Number((activeTable.maxBuyIn - players[0].stack).toFixed(2))));
      setIsRebuyOpen(true);
    },
    onConfirmRebuy: handleConfirmRebuy,
    onExitTable: handleExitTable,
    onNextHand: startNewHand
  };

  return (
    <PokerGameShell 
      state={gameState} 
      actions={gameActions} 
      walletBalance={profile.chips}
      userRaiseAmount={userRaiseAmount}
      minRaise={minRaise}
    />
  );
};