/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameType = "Texas Hold'em" | "Omaha";
export type SpeedType = "Standard" | "Fast" | "Turbo";
export type DifficultyType = "Beginner" | "Casual" | "Advanced" | "Expert" | "VIP";
export type TableStatus = "OPEN" | "ONE SEAT LEFT" | "FULL" | "INVITE ONLY";

export interface BotConfig {
  name: string;
  avatarId: number;
  stack: number;
}

export interface PokerTable {
  id: string;
  name: string;
  minBuyIn: number;
  maxBuyIn: number;
  smallBlind: number;
  bigBlind: number;
  seatsFilled: number;
  maxSeats: number;
  theme: "red" | "green" | "gold" | "orange";
  description: string;
  difficulty: string;
  bots: BotConfig[];
  
  // Extended presentation fields
  gameType: GameType;
  speed: SpeedType;
  status: TableStatus;
  averagePot: number;
  averageHandTime: number; // in seconds
  isVip?: boolean;
  isHot?: boolean;
  isLocked?: boolean;
  roomThemeId?: string;
}

export interface PokerFiltersState {
  gameType: "All" | GameType;
  stakes: "All" | "Low" | "Medium" | "High";
  seats: "All" | "Available" | "OneSeat" | "NotFull";
  speed: "All" | SpeedType;
  difficulty: "All" | DifficultyType;
  search: string;
  favoritesOnly: boolean;
}

export type SortField = "Recommended" | "Stakes" | "Players" | "Buy-In";
