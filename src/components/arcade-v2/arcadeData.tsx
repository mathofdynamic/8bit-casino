/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArcadeGameData } from './arcadeTypes';

export const ARCADE_GAMES: ArcadeGameData[] = [
  {
    id: 'slots',
    title: '777 REELS',
    shortTitle: '777 REELS',
    description: 'Classic 3-reel and 5-reel play-money slots with configurable bets and a complete paytable.',
    category: 'REELS',
    maximumPayoutLabel: 'UP TO 100×',
    accent: 'gold',
    featured: true,
  },
  {
    id: 'wheel',
    title: 'FORTUNE MULTIPLIER',
    shortTitle: 'FORTUNE MULTIPLIER',
    description: 'Spin a sixteen-segment wheel and land on play-money multipliers ranging from zero to ten times the bet.',
    category: 'SPIN',
    maximumPayoutLabel: 'UP TO 10×',
    accent: 'cyan',
  },
  {
    id: 'dice',
    title: 'HIGH-LOW DICE',
    shortTitle: 'HIGH-LOW DICE',
    description: 'Predict whether the next dice total will be higher, lower, or equal, then decide whether to continue or bank.',
    category: 'DICE',
    maximumPayoutLabel: 'MULTI-ROUND',
    accent: 'magenta',
  },
  {
    id: 'scratch',
    title: 'PIXEL SCRATCHER',
    shortTitle: 'PIXEL SCRATCHER',
    description: 'Reveal a complete scratch grid and match symbols for an instant play-money result.',
    category: 'INSTANT',
    maximumPayoutLabel: 'UP TO 100×',
    accent: 'warning',
  },
  {
    id: 'pachinko',
    title: 'PLINKO CASCADE',
    shortTitle: 'PLINKO CASCADE',
    description: 'Drop play-money balls through a pixel peg board and land in multiplier slots.',
    category: 'PHYSICS',
    maximumPayoutLabel: 'UP TO 20×',
    accent: 'success',
  },
  {
    id: 'luckydraw',
    title: 'LUCKY DRAW',
    shortTitle: 'LUCKY DRAW',
    description: 'Enter a scheduled play-money draw and compete for the pooled prize.',
    category: 'DRAW',
    maximumPayoutLabel: 'POOLED PRIZE',
    accent: 'gold',
  },
];
