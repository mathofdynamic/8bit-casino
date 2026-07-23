/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PachinkoSlot, PachinkoPeg } from './pachinkoTypes';

export const PACHINKO_BOARD_WIDTH = 380;
export const PACHINKO_BOARD_HEIGHT = 440;
export const PACHINKO_ROW_COUNT = 8;
export const PACHINKO_PEG_RADIUS = 3;
export const PACHINKO_BALL_RADIUS = 5.5;
export const PACHINKO_START_Y = 40;
export const PACHINKO_SIMULATION_INTERVAL_MS = 55;
export const PACHINKO_ANIMATION_INCREMENT = 0.25;

export const PACHINKO_ROW_HEIGHT =
  (PACHINKO_BOARD_HEIGHT - PACHINKO_START_Y - 50) / PACHINKO_ROW_COUNT;

export const PACHINKO_SLOTS: PachinkoSlot[] = [
  { index: 0, multiplier: 20.0, name: 'JACKPOT', color: '#F6B73C' },
  { index: 1, multiplier: 4.0, name: 'MEGA', color: '#D95F9A' },
  { index: 2, multiplier: 1.3, name: 'MINI', color: '#54D6D9' },
  { index: 3, multiplier: 0.4, name: 'PARTIAL', color: '#44476B' },
  { index: 4, multiplier: 0.2, name: 'CENTER', color: '#222744' },
  { index: 5, multiplier: 0.4, name: 'PARTIAL', color: '#44476B' },
  { index: 6, multiplier: 1.3, name: 'MINI', color: '#54D6D9' },
  { index: 7, multiplier: 4.0, name: 'MEGA', color: '#D95F9A' },
  { index: 8, multiplier: 20.0, name: 'JACKPOT', color: '#F6B73C' },
];

export const getPegPositions = (): PachinkoPeg[] => {
  const pegs: PachinkoPeg[] = [];
  for (let r = 0; r < PACHINKO_ROW_COUNT; r++) {
    const pegsInRow = r + 3;
    const rowWidth = (pegsInRow - 1) * 32;
    const startX = (PACHINKO_BOARD_WIDTH - rowWidth) / 2;
    const y = PACHINKO_START_Y + r * PACHINKO_ROW_HEIGHT;
    for (let p = 0; p < pegsInRow; p++) {
      pegs.push({ x: startX + p * 32, y });
    }
  }
  return pegs;
};

export const getBallVisualPos = (step: number, column: number): { x: number; y: number } => {
  if (step === 0) {
    return { x: PACHINKO_BOARD_WIDTH / 2, y: 15 };
  }
  const pegsInRowAbove = step + 2;
  const rowAboveWidth = (pegsInRowAbove - 1) * 32;
  const startXAbove = (PACHINKO_BOARD_WIDTH - rowAboveWidth) / 2;

  const x = startXAbove + column * 32 + 16;
  const y = PACHINKO_START_Y + (step - 1) * PACHINKO_ROW_HEIGHT + PACHINKO_ROW_HEIGHT / 2;
  return { x, y };
};

export const getSlotVisualPos = (slotIndex: number): { x: number; y: number } => {
  const slotWidth = PACHINKO_BOARD_WIDTH / 9;
  const x = slotIndex * slotWidth + slotWidth / 2;
  const y = PACHINKO_BOARD_HEIGHT - 12;
  return { x, y };
};
