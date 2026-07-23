/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LuckyDrawPhase =
  | 'reveal'
  | 'open'
  | 'locked'
  | 'tumbling'
  | 'buffer';

export interface LuckyDrawPlayerEntry {
  name: string;
  avatarId: number;
  tickets: number;
}

export interface LuckyDrawEntrant {
  name: string;
  avatarId: number;
  tickets: number;
  isPlayer: boolean;
}

export interface LuckyDrawTicket {
  owner: string;
  avatarId: number;
  isPlayer: boolean;
  ticketIndex: number;
}

export interface LuckyDrawSnapshot {
  drawId: number;
  entrants: LuckyDrawEntrant[];
  tickets: LuckyDrawTicket[];
  totalTickets: number;
  grossPool: number;
  prizePool: number;
  winner: LuckyDrawTicket | null;
}

export type LuckyDrawPayoutStatus =
  | 'none'
  | 'crediting'
  | 'credited'
  | 'failed';

export interface LuckyDrawHistoryItem {
  drawId: number;
  winnerName: string;
  winnerAvatarId: number;
  winnerIsPlayer: boolean;
  prizePool: number;
  totalTickets: number;
  timestamp: number;
}
