/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LuckyDrawPhase,
  LuckyDrawPlayerEntry,
  LuckyDrawEntrant,
  LuckyDrawTicket,
  LuckyDrawSnapshot,
} from './luckyDrawTypes';

export const LUCKY_DRAW_TICKET_PRICE = 0.20;
export const LUCKY_DRAW_HOUSE_RAKE = 0.05;
export const LUCKY_DRAW_RTP = 95.0;
export const LUCKY_DRAW_CYCLE_SECONDS = 90;

export const BOT_USERNAMES = [
  '8BIT_CHAMP',
  'PIXEL_BOSS',
  'RETRO_KID',
  'CHIP_STACKER',
  'NEON_RIDER',
  'CYBER_PUNK',
  'GOLD_MINER',
  'ROBO_RAIDER',
  'CHIP_CHAMP',
  'ARCADE_QUEEN',
  'VECTORS_RULE',
  'BIT_CHIPS',
  'LUCKY_LARRY',
  'DEALER_DAISY',
  'NEON_JOE',
];

export const getLuckyDrawClock = (): {
  cycleTime: number;
  currentDrawId: number;
} => {
  const nowSec = Math.floor(Date.now() / 1000);
  return {
    cycleTime: nowSec % LUCKY_DRAW_CYCLE_SECONDS,
    currentDrawId: Math.floor(nowSec / LUCKY_DRAW_CYCLE_SECONDS),
  };
};

export const getLuckyDrawPhase = (cycleTime: number): LuckyDrawPhase => {
  if (cycleTime < 10) return 'reveal';
  if (cycleTime < 70) return 'open';
  if (cycleTime < 80) return 'locked';
  if (cycleTime < 85) return 'tumbling';
  return 'buffer';
};

export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const buildBotEntrants = (
  drawId: number,
  elapsedCycleSecond: number
): LuckyDrawEntrant[] => {
  const list: LuckyDrawEntrant[] = [];
  const maxBots = 6 + (drawId % 6);

  for (let i = 0; i < maxBots; i++) {
    const botSeed = drawId + i * 13;
    const botIndex = Math.floor(seededRandom(botSeed) * BOT_USERNAMES.length);
    const botName = BOT_USERNAMES[botIndex];
    const avatarId = botIndex % 6;
    const buyTime = 12 + Math.floor(seededRandom(botSeed + 5) * 56);

    if (elapsedCycleSecond >= buyTime) {
      const tickets = 1 + Math.floor(seededRandom(botSeed + 9) * 4);
      list.push({
        name: botName,
        avatarId,
        tickets,
        isPlayer: false,
      });
    }
  }

  return list;
};

export const readPlayerEntry = (
  drawId: number,
  fallbackName: string,
  fallbackAvatarId: number
): LuckyDrawPlayerEntry | null => {
  try {
    const jsonStr = localStorage.getItem(`lucky_draw_entry_${drawId}`);
    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed.tickets === 'number' &&
        parsed.tickets > 0
      ) {
        return {
          name: typeof parsed.name === 'string' && parsed.name ? parsed.name : fallbackName,
          avatarId: typeof parsed.avatarId === 'number' ? parsed.avatarId : fallbackAvatarId,
          tickets: parsed.tickets,
        };
      }
    }

    const legacyTixStr = localStorage.getItem(`lucky_draw_tix_${drawId}`);
    if (legacyTixStr) {
      const parsedTix = parseInt(legacyTixStr, 10);
      if (!isNaN(parsedTix) && parsedTix > 0) {
        const entry: LuckyDrawPlayerEntry = {
          name: fallbackName,
          avatarId: fallbackAvatarId,
          tickets: parsedTix,
        };
        try {
          localStorage.setItem(`lucky_draw_entry_${drawId}`, JSON.stringify(entry));
        } catch (_) {}
        return entry;
      }
    }
  } catch (_) {
    // Return null on parsing errors
  }
  return null;
};

export const writePlayerEntry = (
  drawId: number,
  entry: LuckyDrawPlayerEntry
): void => {
  try {
    localStorage.setItem(`lucky_draw_entry_${drawId}`, JSON.stringify(entry));
    localStorage.setItem(`lucky_draw_tix_${drawId}`, entry.tickets.toString());
  } catch (_) {
    // Ignore storage errors
  }
};

export const buildEntrants = (
  drawId: number,
  elapsedCycleSecond: number,
  playerEntry: LuckyDrawPlayerEntry | null
): LuckyDrawEntrant[] => {
  const list: LuckyDrawEntrant[] = [];

  if (playerEntry && playerEntry.tickets > 0) {
    list.push({
      name: playerEntry.name,
      avatarId: playerEntry.avatarId,
      tickets: playerEntry.tickets,
      isPlayer: true,
    });
  }

  const botEntrants = buildBotEntrants(drawId, elapsedCycleSecond);
  return list.concat(botEntrants);
};

export const buildTicketList = (
  entrants: LuckyDrawEntrant[]
): LuckyDrawTicket[] => {
  const tickets: LuckyDrawTicket[] = [];
  let counter = 0;

  entrants.forEach((e) => {
    for (let i = 0; i < e.tickets; i++) {
      tickets.push({
        owner: e.name,
        avatarId: e.avatarId,
        isPlayer: e.isPlayer,
        ticketIndex: counter++,
      });
    }
  });

  return tickets;
};

export const selectWinningTicket = (
  drawId: number,
  tickets: LuckyDrawTicket[]
): LuckyDrawTicket | null => {
  if (tickets.length === 0) {
    return null;
  }

  const winSeed = drawId * 98765 + tickets.length * 321;
  const winningIndex = Math.floor(seededRandom(winSeed) * tickets.length);
  return tickets[winningIndex];
};

export const buildDrawSnapshot = (
  drawId: number,
  elapsedCycleSecond: number,
  playerEntry: LuckyDrawPlayerEntry | null
): LuckyDrawSnapshot => {
  const entrants = buildEntrants(drawId, elapsedCycleSecond, playerEntry);
  const tickets = buildTicketList(entrants);
  const totalTickets = tickets.length;
  const grossPool = Number((totalTickets * LUCKY_DRAW_TICKET_PRICE).toFixed(2));
  const prizePool = Number((grossPool * (1 - LUCKY_DRAW_HOUSE_RAKE)).toFixed(2));
  const winner = selectWinningTicket(drawId, tickets);

  return {
    drawId,
    entrants,
    tickets,
    totalTickets,
    grossPool,
    prizePool,
    winner,
  };
};
