/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PokerTable } from "./pokerTypes";

export const POKER_TABLES: PokerTable[] = [
  {
    id: "dinky_disco",
    name: "Dinky Disco",
    minBuyIn: 0.10,
    maxBuyIn: 1.00,
    smallBlind: 0.01,
    bigBlind: 0.02,
    seatsFilled: 3,
    maxSeats: 6,
    theme: "red",
    description: "A low-stakes retro disco neon floor. Perfect for first-timers!",
    difficulty: "Beginner",
    gameType: "Texas Hold'em",
    speed: "Standard",
    status: "OPEN",
    averagePot: 0.85,
    averageHandTime: 45,
    isHot: false,
    bots: [
      { name: "BOT CHIP", avatarId: 1, stack: 0.45 },
      { name: "BOT BIT", avatarId: 3, stack: 0.80 },
      { name: "BOT BYTE", avatarId: 2, stack: 0.65 }
    ]
  },
  {
    id: "rusty_saloon",
    name: "Rusty Saloon",
    minBuyIn: 1.00,
    maxBuyIn: 10.00,
    smallBlind: 0.05,
    bigBlind: 0.10,
    seatsFilled: 5,
    maxSeats: 6,
    theme: "green",
    description: "Dusty wood tables, swing doors, and classic country-western rules.",
    difficulty: "Casual",
    gameType: "Texas Hold'em",
    speed: "Standard",
    status: "ONE SEAT LEFT",
    averagePot: 8.50,
    averageHandTime: 50,
    isHot: false,
    bots: [
      { name: "BOT GARY", avatarId: 4, stack: 4.50 },
      { name: "BOT SALLY", avatarId: 5, stack: 6.20 },
      { name: "BOT WYATT", avatarId: 6, stack: 8.90 },
      { name: "BOT BILLY", avatarId: 2, stack: 3.10 }
    ]
  },
  {
    id: "neon_high_roller",
    name: "Neon High Roller",
    minBuyIn: 10.00,
    maxBuyIn: 100.00,
    smallBlind: 0.50,
    bigBlind: 1.00,
    seatsFilled: 4,
    maxSeats: 6,
    theme: "gold",
    description: "For players with deep pockets, arcade neon lights, and ice in their veins.",
    difficulty: "Advanced",
    gameType: "Texas Hold'em",
    speed: "Fast",
    status: "OPEN",
    averagePot: 75.00,
    averageHandTime: 35,
    isHot: true,
    bots: [
      { name: "BOT VIP", avatarId: 1, stack: 65.00 },
      { name: "BOT ACE", avatarId: 6, stack: 85.00 },
      { name: "BOT CYBER", avatarId: 2, stack: 45.00 },
      { name: "BOT RETRO", avatarId: 3, stack: 55.00 }
    ]
  },
  {
    id: "chipmaster_coven",
    name: "Chipmaster Coven",
    minBuyIn: 50.00,
    maxBuyIn: 500.00,
    smallBlind: 2.50,
    bigBlind: 5.00,
    seatsFilled: 6,
    maxSeats: 6,
    theme: "orange",
    description: "A high-stakes parlor where legendary card sharks and computer chips duel.",
    difficulty: "Expert",
    gameType: "Omaha",
    speed: "Turbo",
    status: "FULL",
    averagePot: 320.00,
    averageHandTime: 25,
    isHot: false,
    bots: [
      { name: "BOT DEEP", avatarId: 3, stack: 350.00 },
      { name: "BOT ALPHA", avatarId: 5, stack: 420.00 },
      { name: "BOT OMNI", avatarId: 1, stack: 485.00 },
      { name: "BOT GIGA", avatarId: 4, stack: 290.00 },
      { name: "BOT ZERO", avatarId: 6, stack: 510.00 },
      { name: "BOT HEX", avatarId: 2, stack: 400.00 }
    ]
  },
  {
    id: "pixel_palace",
    name: "Pixel Palace",
    minBuyIn: 250.00,
    maxBuyIn: 1000.00,
    smallBlind: 10.00,
    bigBlind: 20.00,
    seatsFilled: 2,
    maxSeats: 6,
    theme: "cyan" as any,
    description: "A palace of pure retro light and high-stakes computational skill.",
    difficulty: "Casual",
    gameType: "Texas Hold'em",
    speed: "Standard",
    status: "OPEN",
    averagePot: 1500.00,
    averageHandTime: 40,
    isHot: false,
    bots: [
      { name: "BOT KING", avatarId: 5, stack: 750.00 },
      { name: "BOT QUEEN", avatarId: 6, stack: 900.00 }
    ]
  },
  {
    id: "royal_circuit",
    name: "Royal Circuit",
    minBuyIn: 5000.00,
    maxBuyIn: 25000.00,
    smallBlind: 250.00,
    bigBlind: 500.00,
    seatsFilled: 3,
    maxSeats: 6,
    theme: "gold",
    description: "VIP invite-only arena for ultimate high rollers. Locked for simulation.",
    difficulty: "VIP",
    gameType: "Texas Hold'em",
    speed: "Fast",
    status: "INVITE ONLY",
    averagePot: 12500.00,
    averageHandTime: 30,
    isVip: true,
    isLocked: true,
    bots: [
      { name: "BOT ELITE", avatarId: 1, stack: 15000.00 },
      { name: "BOT BARON", avatarId: 4, stack: 18000.00 },
      { name: "BOT DUKE", avatarId: 3, stack: 22000.00 }
    ]
  }
];
