/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PixelPanel, PixelButton, PixelMascot, PixelModal } from './PixelUI';
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

interface PokerTable {
  id: string;
  name: string;
  minBuyIn: number;
  maxBuyIn: number;
  smallBlind: number;
  bigBlind: number;
  seatsFilled: number;
  maxSeats: number;
  theme: 'magenta' | 'green' | 'gold' | 'cyan';
  description: string;
  difficulty: string;
  bots: { name: string; avatarId: number; stack: number }[];
}

const POKER_TABLES: PokerTable[] = [
  {
    id: 'dinky_disco',
    name: 'DINKY DISCO',
    minBuyIn: 0.10,
    maxBuyIn: 1.00,
    smallBlind: 0.01,
    bigBlind: 0.02,
    seatsFilled: 3,
    maxSeats: 6,
    theme: 'magenta',
    description: 'A low-stakes retro disco neon floor. Perfect for first-timers!',
    difficulty: 'BEGINNER',
    bots: [
      { name: 'BOT CHIP', avatarId: 1, stack: 0.45 },
      { name: 'BOT BIT', avatarId: 3, stack: 0.80 },
      { name: 'BOT BYTE', avatarId: 2, stack: 0.65 }
    ]
  },
  {
    id: 'rusty_saloon',
    name: 'RUSTY SALOON',
    minBuyIn: 1.00,
    maxBuyIn: 10.00,
    smallBlind: 0.05,
    bigBlind: 0.10,
    seatsFilled: 4,
    maxSeats: 6,
    theme: 'green',
    description: 'Dusty wood tables, swing doors, and classic country-western rules.',
    difficulty: 'CASUAL',
    bots: [
      { name: 'BOT GARY', avatarId: 4, stack: 4.50 },
      { name: 'BOT SALLY', avatarId: 5, stack: 6.20 },
      { name: 'BOT WYATT', avatarId: 6, stack: 8.90 },
      { name: 'BOT BILLY', avatarId: 2, stack: 3.10 }
    ]
  },
  {
    id: 'neon_high_roller',
    name: 'NEON HIGH ROLLER',
    minBuyIn: 10.00,
    maxBuyIn: 100.00,
    smallBlind: 0.50,
    bigBlind: 1.00,
    seatsFilled: 2,
    maxSeats: 6,
    theme: 'gold',
    description: 'For players with deep pockets, arcade neon lights, and ice in their veins.',
    difficulty: 'ADVANCED',
    bots: [
      { name: 'BOT VIP', avatarId: 1, stack: 65.00 },
      { name: 'BOT ACE', avatarId: 6, stack: 85.00 }
    ]
  },
  {
    id: 'chipmaster_coven',
    name: 'CHIPMASTER COVEN',
    minBuyIn: 50.00,
    maxBuyIn: 500.00,
    smallBlind: 2.50,
    bigBlind: 5.00,
    seatsFilled: 5,
    maxSeats: 6,
    theme: 'cyan',
    description: 'A high-stakes parlor where legendary card sharks and computer chips duel.',
    difficulty: 'EXPERT',
    bots: [
      { name: 'BOT DEEP', avatarId: 3, stack: 350.00 },
      { name: 'BOT ALPHA', avatarId: 5, stack: 420.00 },
      { name: 'BOT OMNI', avatarId: 1, stack: 485.00 },
      { name: 'BOT GIGA', avatarId: 4, stack: 290.00 },
      { name: 'BOT ZERO', avatarId: 6, stack: 510.00 }
    ]
  }
];

export const PokerScreen: React.FC = () => {
  const { profile, setRoute, adjustBalance, triggerToast, unlockAchievement } = useStore();

  // Navigation and active table selection
  const [selectedTable, setSelectedTable] = useState<PokerTable | null>(null);
  const [isBuyInModalOpen, setIsBuyInModalOpen] = useState(false);
  const [buyInAmount, setBuyInAmount] = useState(0);

  // Active game loop state
  const [activeTable, setActiveTable] = useState<PokerTable | null>(null);
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

  // Positions players around the custom oval table canvas
  const getSeatPosition = (idx: number, total: number) => {
    const positions = [
      'bottom-[-16px] left-1/2 -translate-x-1/2', // 0 (Hero - Sits proudly bottom center)
      'bottom-[25%] left-[2%] md:left-[5%]',     // 1 (Lower Left)
      'top-[20%] left-[4%] md:left-[7%]',       // 2 (Upper Left)
      'top-[-16px] left-1/2 -translate-x-1/2',    // 3 (Top Center)
      'top-[20%] right-[4%] md:right-[7%]',      // 4 (Upper Right)
      'bottom-[25%] right-[2%] md:right-[5%]'    // 5 (Lower Right)
    ];
    return positions[idx % positions.length];
  };

  const handleTableClick = (table: PokerTable) => {
    if (profile.chips < table.minBuyIn) {
      audio.playLoss();
      triggerToast(`INSUFFICIENT FUNDS! YOU NEED AT LEAST $${table.minBuyIn.toFixed(2)} TO ENTER.`, 'error');
      return;
    }
    const ideal = Math.min(Number(((table.minBuyIn + table.maxBuyIn) / 2).toFixed(2)), profile.chips);
    setSelectedTable(table);
    setBuyInAmount(ideal);
    setIsBuyInModalOpen(true);
    audio.playClick();
  };

  const handleConfirmBuyIn = async () => {
    if (!selectedTable) return;
    const finalAmount = Number(buyInAmount.toFixed(2));

    if (finalAmount < selectedTable.minBuyIn || finalAmount > selectedTable.maxBuyIn) {
      triggerToast('INVALID BUY-IN BOUNDS!', 'error');
      return;
    }
    if (finalAmount > profile.chips) {
      triggerToast('YOU DO NOT HAVE ENOUGH CHIPS!', 'error');
      return;
    }

    const success = await adjustBalance(-finalAmount, `POKER_BUYIN_${selectedTable.id.toUpperCase()}`);
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
        ...selectedTable.bots.map((bot, idx) => ({
          id: `bot_${idx}`,
          name: bot.name,
          avatarId: bot.avatarId,
          stack: bot.stack,
          bet: 0,
          cards: [],
          isFolded: false,
          isAllIn: false,
          isBot: true,
          difficulty: selectedTable.difficulty as any,
          lastAction: ''
        }))
      ];

      const rDealer = Math.floor(Math.random() * initial.length);
      setActiveTable(selectedTable);
      setIsBuyInModalOpen(false);
      triggerToast(`JOINED ${selectedTable.name}!`, 'success');
      audio.playChipStack();
      setupFirstHand(initial, rDealer, selectedTable);
    } else {
      triggerToast('BUY-IN TRANSACTION FAILED!', 'error');
    }
  };

  const setupFirstHand = (initPlayers: PlayerState[], dIdx: number, table: PokerTable) => {
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

  const isWalletDepletedOfAllTables = () => {
    return profile.chips < Math.min(...POKER_TABLES.map(t => t.minBuyIn));
  };

  // Steppers for Buy-In values
  const handleStep = (dir: 'up' | 'down') => {
    if (!selectedTable) return;
    const step = getStepSize(selectedTable.minBuyIn, selectedTable.maxBuyIn);
    setBuyInAmount(prev => {
      let next = dir === 'up' ? prev + step : prev - step;
      next = Math.max(selectedTable.minBuyIn, Math.min(selectedTable.maxBuyIn, next));
      return Number(Math.min(profile.chips, next).toFixed(2));
    });
    audio.playClick();
  };

  // Custom visual components for 8-bit theme
  const RenderPixelCard = ({ card, isFacedown = false }: { card: Card; isFacedown?: boolean }) => {
    const isRed = card.suit === 'H' || card.suit === 'D';
    const symbol = SUIT_SYMBOLS[card.suit];
    
    if (isFacedown) {
      return (
        <div 
          className="w-10 h-14 sm:w-12 sm:h-16 bg-[#ff3f3f] border-2 border-white flex items-center justify-center relative overflow-hidden shadow-md"
          style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}
        >
          <div className="absolute inset-1 border border-[#ff8080] bg-[#cc3232] flex flex-wrap justify-center items-center gap-1 p-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white/30 rotate-45" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div 
        className="w-10 h-14 sm:w-12 sm:h-16 bg-[#f2ead3] border-2 border-black flex flex-col justify-between p-1 relative shadow-md"
        style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}
      >
        <div className={`font-jersey text-md leading-none flex justify-between items-center ${isRed ? 'text-[#ff3f3f]' : 'text-black'}`}>
          <span>{formatRank(card.rank)}</span>
          <span className="text-[10px]">{symbol}</span>
        </div>
        <div className={`font-jersey text-2xl self-center leading-none ${isRed ? 'text-[#ff3f3f]' : 'text-black'}`}>
          {symbol}
        </div>
        <div className={`font-jersey text-md leading-none flex justify-between items-center rotate-180 ${isRed ? 'text-[#ff3f3f]' : 'text-black'}`}>
          <span>{formatRank(card.rank)}</span>
          <span className="text-[10px]">{symbol}</span>
        </div>
      </div>
    );
  };

  const CoinStack = ({ val }: { val: number }) => {
    if (val <= 0) return null;
    let height = 1;
    if (val > 1) height = 2;
    if (val > 5) height = 3;
    if (val > 20) height = 4;
    if (val > 100) height = 5;
    return (
      <div className="flex flex-col-reverse items-center justify-center -space-y-1 select-none">
        {Array.from({ length: height }).map((_, i) => (
          <div 
            key={i} 
            className="w-4 h-2 bg-[#ffd23f] border border-black relative overflow-hidden"
            style={{ 
              clipPath: 'polygon(1px 0, 100% 0, 100% 100%, 0 100%)',
              backgroundImage: 'linear-gradient(to right, #ffd23f, #ffe380, #ffd23f)' 
            }}
          >
            <div className="absolute inset-[0.5px] border-b border-[#cca932]" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink-stepped {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.15; }
        }
        .retro-blink {
          animation: blink-stepped 1s infinite steps(2);
        }
        .pixel-felt-pattern {
          background-image: radial-gradient(rgba(0,0,0,0.2) 15%, transparent 15%);
          background-size: 16px 16px;
        }
      `}} />

      {/* RENDER MODE A: ACTIVE POKER TABLE FELT SECTION */}
      {activeTable ? (
        <div className="space-y-6">
          {/* Active Header Panel */}
          <div className="border-3 border-[#3fff6e] bg-[#111111] p-4 flex flex-col md:flex-row items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-3">
              <span className="text-3xl text-[#3fff6e] retro-blink">♦</span>
              <div>
                <h1 className="text-3xl font-jersey text-[#3fff6e] uppercase m-0 leading-none">
                  SEAT OCCUPIED: {activeTable.name}
                </h1>
                <p className="font-jersey text-md text-[#5a5a72] uppercase m-0 mt-1 leading-none">
                  BLINDS: ${activeTable.smallBlind.toFixed(2)} / ${activeTable.bigBlind.toFixed(2)} • STAKES: {activeTable.difficulty}
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <PixelButton
                variant="gold"
                onClick={() => {
                  setRebuyAmount(Math.min(profile.chips, Number((activeTable.maxBuyIn - players[0].stack).toFixed(2))));
                  setIsRebuyOpen(true);
                }}
                disabled={players[0]?.stack >= activeTable.maxBuyIn || profile.chips <= 0}
              >
                RE-BUY
              </PixelButton>

              <PixelButton variant="red" onClick={handleExitTable}>
                STAND & EXIT
              </PixelButton>
            </div>
          </div>

          {/* OVAL FELT TABLE ARENA FRAME */}
          <div className="bg-[#1e5631] border-4 border-[#7a4b28] p-6 relative filter drop-shadow-[5px_5px_0px_#000] pixel-felt-pattern min-h-[480px] flex flex-col justify-between overflow-hidden">
            {/* Dark wood inner table shadow border */}
            <div className="absolute inset-4 border-4 border-dashed border-[#133c21] pointer-events-none rounded-[100px]" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

            {/* TOP AREA: AI Dealer stand and game timer plaque */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-[#111111] border-2 border-[#e8e8e8] px-3 py-1 font-jersey text-md text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ffd23f]" />
                <span>DEALER ENGINE: TURN TIMER {turnTimer}s</span>
              </div>
              
              {/* Dealer bubble dialogue */}
              <div className="relative mt-2 max-w-sm">
                <div className="bg-[#111111] border-2 border-[#ffd23f] px-4 py-1.5 text-center filter drop-shadow-[2px_2px_0px_#000]">
                  <p className="font-jersey text-lg text-[#ffd23f] uppercase m-0 leading-tight">
                    {botChatter || `"HAND #${currentHandNum} ROUND STAGE: ${gameStage.replace('_', ' ')}"`}
                  </p>
                </div>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#111111] border-r-2 border-b-2 border-[#ffd23f] rotate-45" />
              </div>
            </div>

            {/* CENTER OVAL: PLACING PLAYERS AND COMMUNITY CARDS */}
            <div className="relative z-10 my-4 flex-1 flex flex-col justify-center items-center relative min-h-[220px]">
              
              {/* COMMUNITY CARDS BOARD */}
              <div className="bg-black/40 border border-[#7a4b28] p-3 w-full max-w-sm flex flex-col items-center mb-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <Coins className="w-4 h-4 text-[#ffd23f] animate-bounce" />
                  <span className="font-jersey text-xl text-[#ffd23f] tracking-wide uppercase">
                    POT: ${pot.toFixed(2)} COINS
                  </span>
                </div>

                <div className="flex justify-center items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const card = communityCards[i];
                    return (
                      <div key={i}>
                        {card ? (
                          <RenderPixelCard card={card} />
                        ) : (
                          <div className="w-10 h-14 sm:w-12 sm:h-16 bg-[#0d0d1a]/70 border-2 border-dashed border-[#5a5a72]/60 flex items-center justify-center font-jersey text-[8px] text-[#5a5a72] uppercase">
                            {i < 3 ? 'FLOP' : i === 3 ? 'TURN' : 'RIVER'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ABSOLUTE POSITIONED PLAYER SEATS */}
              {players.map((p, idx) => {
                const isCurrent = currentPlayerIndex === idx && gameStage !== 'SHOWDOWN';
                const posClass = getSeatPosition(idx, players.length);
                const isDealer = dealerIndex === idx;

                return (
                  <div 
                    key={p.id} 
                    className={`absolute ${posClass} transition-all duration-300 z-20 flex flex-col items-center`}
                  >
                    {/* Bet amount representation stack */}
                    {p.bet > 0 && (
                      <div className="bg-[#1a1a2e] border border-[#ffd23f] px-1.5 py-0.5 mb-1 flex items-center gap-1">
                        <CoinStack val={p.bet} />
                        <span className="font-jersey text-xs text-[#ffd23f]">${p.bet.toFixed(2)}</span>
                      </div>
                    )}

                    <div 
                      className={`border-2 p-2 bg-black relative flex items-center gap-2 ${isCurrent ? 'border-[#3ff7ff] scale-105' : 'border-[#5a5a72]'}`}
                      style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                    >
                      {/* Active turn visual marquee bar */}
                      {isCurrent && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#3ff7ff] animate-pulse" />
                      )}

                      {/* Dealer Button badge */}
                      {isDealer && (
                        <div className="absolute top-[-8px] left-[-8px] w-5 h-5 bg-white text-black border border-black rounded-full font-jersey text-xs flex items-center justify-center font-bold">
                          D
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="w-10 h-10 bg-[#111111] border border-[#5a5a72] flex flex-col items-center justify-center font-jersey text-[#3ff7ff] text-md overflow-hidden relative shrink-0">
                        <span>P{p.avatarId}</span>
                      </div>

                      {/* Stats */}
                      <div className="text-left">
                        <div className="font-jersey text-sm text-white leading-none flex items-center gap-1">
                          <span>{p.name}</span>
                        </div>
                        <div className="font-jersey text-xs text-[#3fff6e] leading-none mt-1">
                          ${p.stack.toFixed(2)}
                        </div>
                        {p.lastAction && (
                          <div className="font-jersey text-[10px] text-[#ff3f8e] uppercase leading-none mt-1">
                            {p.lastAction}
                          </div>
                        )}
                      </div>

                      {/* Hand Cards */}
                      {p.cards.length > 0 && (
                        <div className="flex gap-1 shrink-0 ml-1">
                          {p.cards.map((c, cIdx) => (
                            <div key={cIdx}>
                              <RenderPixelCard 
                                card={c} 
                                isFacedown={p.isBot && gameStage !== 'SHOWDOWN' && !p.isFolded} 
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>

            {/* BOTTOM HUD PLAYING CONTROLS FOR PLAYER */}
            <div className="relative z-10 border-t-3 border-[#e8e8e8] bg-[#111111] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="font-jersey text-2xl text-white leading-none uppercase">
                  {players[0]?.name} (YOUR STACK)
                </div>
                <div className="font-jersey text-xl text-[#3fff6e] leading-none mt-1">
                  STREAK: ${players[0]?.stack.toFixed(2)} COINS
                </div>
              </div>

              {/* Action Buttons HUD */}
              {currentPlayerIndex === 0 && gameStage !== 'SHOWDOWN' && players[0] && !players[0].isFolded ? (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="flex flex-wrap gap-2 justify-end">
                    <PixelButton variant="red" onClick={() => handlePlayerAction('FOLD')}>
                      FOLD
                    </PixelButton>

                    <PixelButton 
                      variant="cyan" 
                      onClick={() => handlePlayerAction('CHECK')}
                      disabled={currentBet > players[0].bet}
                    >
                      CHECK
                    </PixelButton>

                    <PixelButton 
                      variant="green" 
                      onClick={() => handlePlayerAction('CALL')}
                      disabled={currentBet <= players[0].bet}
                    >
                      CALL (${(currentBet - players[0].bet).toFixed(2)})
                    </PixelButton>

                    <PixelButton 
                      variant="gold" 
                      onClick={() => {
                        const minR = currentBet === 0 ? activeTable.bigBlind : currentBet + minRaise;
                        setUserRaiseAmount(minR);
                        setIsRaising(!isRaising);
                      }}
                      disabled={players[0].stack <= (currentBet - players[0].bet)}
                    >
                      RAISE
                    </PixelButton>
                  </div>

                  {/* Dynamic Slide Drawer for Raise */}
                  {isRaising && (
                    <div className="bg-[#0d0d1a] border border-[#ffd23f] p-3 mt-1 flex flex-col gap-2 max-w-sm">
                      <div className="flex justify-between font-jersey text-sm text-white">
                        <span>RAISE TO:</span>
                        <span className="text-[#3fff6e]">${userRaiseAmount.toFixed(2)}</span>
                      </div>
                      
                      <input 
                        type="range"
                        min={currentBet === 0 ? activeTable.bigBlind : currentBet + minRaise}
                        max={players[0].stack + players[0].bet}
                        step={0.05}
                        value={userRaiseAmount}
                        onChange={(e) => {
                          setUserRaiseAmount(parseFloat(e.target.value) || 0);
                          audio.playClick();
                        }}
                        className="w-full h-2 bg-[#1a1a2e] accent-[#ffd23f]"
                      />

                      <div className="flex justify-between text-[10px] font-jersey text-[#5a5a72]">
                        <span>MIN: ${(currentBet + minRaise).toFixed(2)}</span>
                        <span>MAX: ${(players[0].stack + players[0].bet).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-end gap-2">
                        <PixelButton variant="green" onClick={() => handlePlayerAction('RAISE', userRaiseAmount)}>
                          CONFIRM
                        </PixelButton>
                        <PixelButton variant="magenta" onClick={() => setIsRaising(false)}>
                          CANCEL
                        </PixelButton>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="font-jersey text-xl text-[#5a5a72] uppercase tracking-widest">
                  {gameStage === 'SHOWDOWN' ? (
                    <PixelButton variant="gold" onClick={startNewHand}>
                      DEAL NEW HAND
                    </PixelButton>
                  ) : (
                    "OPPONENT ACTION IN PROGRESS..."
                  )}
                </div>
              )}
            </div>
          </div>

          {/* POKER EVENT STREAM JOURNAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PixelPanel title="★ POKER LOGS ★" subtitle="Live table ledger">
                <div className="bg-black border border-[#5a5a72] p-3 font-mono text-xs text-[#3fff6e] h-32 overflow-y-auto space-y-1">
                  {sessionLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 leading-snug">
                      <span className="text-[#5a5a72]">[{idx + 1}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </PixelPanel>
            </div>

            <div className="md:col-span-1">
              <PixelPanel title="TABLE GUIDE" subtitle="Rules of engagement">
                <div className="font-jersey text-md text-[#e8e8e8] uppercase space-y-2">
                  <p className="text-[#ffd23f] m-0">★ SYSTEM STATUTE RULES ★</p>
                  <p className="m-0">1. Table stack is isolated from wallet during session.</p>
                  <p className="m-0">2. Rebuys can be triggered at any point when stack is below max buyin bounds.</p>
                </div>
              </PixelPanel>
            </div>
          </div>

          {/* RE-BUY MODAL DIALOG */}
          <PixelModal
            isOpen={isRebuyOpen}
            onClose={() => setIsRebuyOpen(false)}
            title="★ TABLE COMP RE-BUY ★"
          >
            <div className="space-y-4 text-center">
              <Coins className="w-10 h-10 text-[#ffd23f] mx-auto animate-pulse" />
              <div>
                <h3 className="font-jersey text-2xl text-[#ffd23f] m-0">TRANSFER WALLET CHIPS</h3>
                <p className="font-jersey text-md text-[#5a5a72] m-0 mt-1">
                  WALLET BALANCE: <span className="text-white">${profile.chips.toFixed(2)}</span>
                </p>
              </div>

              <div className="bg-[#0d0d1a] border border-[#5a5a72] p-4 text-left space-y-3">
                <div className="flex justify-between font-jersey text-lg text-white">
                  <span>TRANSFER AMOUNT:</span>
                  <span className="text-[#3fff6e]">${rebuyAmount.toFixed(2)}</span>
                </div>

                <input 
                  type="range"
                  min={0.01}
                  max={Math.min(profile.chips, activeTable.maxBuyIn - (players[0]?.stack || 0))}
                  step={0.05}
                  value={rebuyAmount}
                  onChange={(e) => {
                    setRebuyAmount(parseFloat(e.target.value) || 0);
                    audio.playClick();
                  }}
                  className="w-full h-2 bg-[#1a1a2e] accent-[#ffd23f]"
                />
              </div>

              <div className="flex justify-center gap-2">
                <PixelButton variant="green" onClick={handleConfirmRebuy}>
                  CONFIRM RE-BUY
                </PixelButton>
                <PixelButton variant="magenta" onClick={() => setIsRebuyOpen(false)}>
                  CANCEL
                </PixelButton>
              </div>
            </div>
          </PixelModal>

          {/* SHOWDOWN WINNERS OVERLAY MODAL */}
          {gameStage === 'SHOWDOWN' && winnersList.length > 0 && (
            <PixelModal
              isOpen={true}
              onClose={() => {}}
              title="◆ SHOWDOWN HAND OVER ◆"
            >
              <div className="space-y-4 text-center">
                <Sparkles className="w-12 h-12 text-[#ffd23f] mx-auto animate-bounce" />
                
                <div className="space-y-2">
                  <h3 className="font-jersey text-3xl text-[#3fff6e] m-0">
                    WINNINGS DISTRIBUTED!
                  </h3>
                  
                  {winnersList.map((win, idx) => (
                    <div key={idx} className="bg-[#0d0d1a] border border-[#7a4b28] p-3 text-left">
                      <div className="flex justify-between items-center font-jersey text-lg">
                        <span className="text-white">{win.name}</span>
                        <span className="text-[#ffd23f]">+${win.prize.toFixed(2)} COINS</span>
                      </div>
                      <p className="font-jersey text-sm text-[#5a5a72] m-0 mt-1 uppercase">
                        HAND RATING: <span className="text-[#ff3f8e]">{win.handName}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <PixelButton variant="gold" onClick={startNewHand} className="w-full py-2">
                  DEAL NEXT HAND
                </PixelButton>
              </div>
            </PixelModal>
          )}

        </div>
      ) : (
        /* RENDER MODE B: TABLE SELECTION LISTING BAY */
        <div className="space-y-6">
          <div className="border-3 border-[#3fff6e] bg-[#111111] p-5 filter drop-shadow-[4px_4px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0d0d1a] opacity-40 pointer-events-none" />
            <div className="relative z-10 text-center md:text-left">
              <h1 className="text-4xl font-jersey uppercase text-white m-0">
                TEXAS HOLD&apos;EM SELECTION BAY
              </h1>
              <p className="font-jersey text-lg text-[#5a5a72] uppercase mt-1 m-0">
                WALLET CHIPS: <span className="text-[#3fff6e]">${profile.chips.toFixed(2)}</span> • MIN LIMIT: $0.10
              </p>
            </div>
            <div className="relative z-10">
              <PixelButton variant="dark" onClick={() => setRoute('lobby')}>
                CONCOURSE LOBBY
              </PixelButton>
            </div>
          </div>

          {isWalletDepletedOfAllTables() ? (
            <div className="border-3 border-[#ff3f3f] bg-[#111111] p-6 flex flex-col items-center justify-center gap-6 filter drop-shadow-[5px_5px_0px_#000]">
              <PixelMascot mood="idle" />
              <div className="relative max-w-lg">
                <div className="bg-black border-3 border-[#ff3f3f] p-4 text-center">
                  <h4 className="font-jersey text-2xl text-[#ff3f3f] m-0 leading-none mb-2">
                    ◆ CHIP METER EXHAUSTED ◆
                  </h4>
                  <p className="font-jersey text-lg text-white uppercase m-0 leading-snug">
                    &quot;ATTENTION CHIEF! THY WALLET COUNTER IS LOWER THAN EVERY TABLES LIMIT ($0.10)! VISIT SPIN SLOT REELS FOR FREE COINS!&quot;
                  </p>
                </div>
              </div>

              <div className="flex gap-4 w-full justify-center max-w-md">
                <PixelButton variant="gold" className="w-full" onClick={() => setRoute('minigames')}>
                  SPIN REELS FOR CHIPS
                </PixelButton>
                <PixelButton variant="magenta" className="w-full" onClick={() => setRoute('lobby')}>
                  DAILY BONUSES
                </PixelButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {POKER_TABLES.map(t => {
                const affordable = profile.chips >= t.minBuyIn;
                const headerBg = { magenta: 'bg-[#ff3f8e]', green: 'bg-[#3fff6e]', gold: 'bg-[#ffd23f]', cyan: 'bg-[#3ff7ff]' }[t.theme];
                const textCol = t.theme === 'magenta' ? 'text-white' : 'text-black';

                return (
                  <div 
                    key={t.id}
                    onClick={() => handleTableClick(t)}
                    className={`border-3 cursor-pointer p-4 transition-all flex flex-col justify-between ${affordable ? 'border-[#e8e8e8] bg-[#111111]' : 'border-[#5a5a72] bg-[#111111] opacity-75'}`}
                    style={{ clipPath: 'polygon(12px 0px, 100% 0px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0px 100%, 0px 12px)' }}
                  >
                    <div className={`${headerBg} ${textCol} font-jersey text-xl py-1 px-4 border-b-2 border-black uppercase tracking-wider flex justify-between`}>
                      <span>★ {t.name} ★</span>
                      <span className="text-xs bg-black text-white px-2 py-0.5 leading-none font-bold">
                        {t.difficulty}
                      </span>
                    </div>

                    <p className="font-jersey text-lg text-white leading-tight uppercase my-3 text-left">
                      {t.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-left">
                      <div className="border border-[#5a5a72]/30 p-2 bg-black">
                        <span className="block text-[10px] font-jersey text-[#5a5a72]">BLINDS</span>
                        <span className="font-jersey text-lg text-[#3fff6e]">
                          ${t.smallBlind.toFixed(2)} / ${t.bigBlind.toFixed(2)}
                        </span>
                      </div>
                      <div className="border border-[#5a5a72]/30 p-2 bg-black">
                        <span className="block text-[10px] font-jersey text-[#5a5a72]">BUYIN BOUNDS</span>
                        <span className="font-jersey text-lg text-white">
                          ${t.minBuyIn.toFixed(2)} - ${t.maxBuyIn.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#5a5a72]/30 flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 font-jersey text-md text-[#5a5a72]">
                        <User className="w-4 h-4" />
                        <span>SEATS: {t.seatsFilled}/{t.maxSeats}</span>
                      </div>
                      {affordable ? (
                        <div className={`px-4 py-1.5 font-jersey text-xl uppercase ${headerBg} ${textCol} border-2 border-black`}>
                          PLAY
                        </div>
                      ) : (
                        <div className="px-4 py-1.5 font-jersey text-xl bg-[#ff3f3f]/10 text-[#ff3f3f] border-2 border-[#ff3f3f]">
                          LOCKED
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CHOOSE BUYIN LEVEL MODAL */}
          {selectedTable && (
            <PixelModal
              isOpen={isBuyInModalOpen}
              onClose={() => setIsBuyInModalOpen(false)}
              title="★ CHOOSE BUY-IN STAKE ★"
            >
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h3 className="font-jersey text-3xl text-[#ffd23f] m-0 leading-none">
                    {selectedTable.name}
                  </h3>
                  <p className="font-jersey text-md text-[#5a5a72] m-0">
                    BLINDS: ${selectedTable.smallBlind.toFixed(2)} / ${selectedTable.bigBlind.toFixed(2)}
                  </p>
                  <p className="font-jersey text-md text-white m-0">
                    CONSOLE BALANCE: <span className="text-[#3fff6e]">${profile.chips.toFixed(2)}</span>
                  </p>
                </div>

                <div className="border-3 border-[#ffd23f] bg-black py-3 px-6 flex flex-col items-center">
                  <span className="text-xs font-mono text-[#5a5a72] tracking-wider mb-1">
                    CHIPS COMMITTING
                  </span>
                  
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleStep('down')}
                      disabled={buyInAmount <= selectedTable.minBuyIn}
                      className="w-8 h-8 border border-white bg-black text-white font-jersey text-xl flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-4xl font-jersey text-[#ffd23f] animate-pulse">
                      ${buyInAmount.toFixed(2)}
                    </span>

                    <button 
                      onClick={() => handleStep('up')}
                      disabled={buyInAmount >= selectedTable.maxBuyIn || buyInAmount >= profile.chips}
                      className="w-8 h-8 border border-white bg-black text-white font-jersey text-xl flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <input 
                  type="range"
                  min={selectedTable.minBuyIn}
                  max={Math.min(selectedTable.maxBuyIn, profile.chips)}
                  step={getStepSize(selectedTable.minBuyIn, selectedTable.maxBuyIn)}
                  value={buyInAmount}
                  onChange={(e) => {
                    setBuyInAmount(parseFloat(e.target.value) || selectedTable.minBuyIn);
                    audio.playClick();
                  }}
                  className="w-full accent-[#ff3f8e] bg-black"
                />

                <div className="flex justify-center gap-2">
                  <PixelButton variant="green" onClick={handleConfirmBuyIn}>
                    CONFIRM & PLAY
                  </PixelButton>
                  <PixelButton variant="magenta" onClick={() => setIsBuyInModalOpen(false)}>
                    CANCEL
                  </PixelButton>
                </div>
              </div>
            </PixelModal>
          )}

        </div>
      )}

    </div>
  );
};
